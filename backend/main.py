from __future__ import annotations

import json
import sqlite3
from pathlib import Path
from typing import Any

from fastapi import FastAPI, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

from backend.data import SCENARIOS, build_student_summary, build_teacher_summary

DB_PATH = Path(__file__).resolve().parent.parent / "cybersaathi.db"

app = FastAPI(title="CyberSaathi AI", version="1.0.0")
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class ScenarioSubmission(BaseModel):
    scenario_id: str
    selected_option: str


def get_db() -> sqlite3.Connection:
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    return conn


def init_db() -> None:
    conn = get_db()
    conn.execute(
        """
        CREATE TABLE IF NOT EXISTS scenarios (
            id TEXT PRIMARY KEY,
            title TEXT,
            category TEXT,
            difficulty TEXT,
            situation TEXT,
            options TEXT,
            correct_option TEXT,
            safer_response TEXT,
            explanation TEXT,
            risk_indicators TEXT,
            recommended_action TEXT,
            learning_objective TEXT
        )
        """
    )
    conn.execute(
        """
        CREATE TABLE IF NOT EXISTS progress (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            scenario_id TEXT,
            selected_option TEXT,
            is_correct INTEGER,
            points_awarded INTEGER,
            submitted_at TEXT DEFAULT CURRENT_TIMESTAMP
        )
        """
    )
    existing = conn.execute("SELECT COUNT(*) FROM scenarios").fetchone()[0]
    if existing == 0:
        for scenario in SCENARIOS:
            conn.execute(
                """
                INSERT INTO scenarios (
                    id, title, category, difficulty, situation, options, correct_option,
                    safer_response, explanation, risk_indicators, recommended_action,
                    learning_objective
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
                """,
                (
                    scenario["id"],
                    scenario["title"],
                    scenario["category"],
                    scenario["difficulty"],
                    scenario["situation"],
                    json.dumps(scenario["options"]),
                    scenario["correct_option"],
                    scenario["safer_response"],
                    scenario["explanation"],
                    json.dumps(scenario["risk_indicators"]),
                    scenario["recommended_action"],
                    scenario["learning_objective"],
                ),
            )
    conn.commit()
    conn.close()


init_db()


@app.get("/api/health")
def health() -> dict[str, str]:
    return {"status": "ok"}


@app.get("/api/scenarios")
def get_scenarios(category: str | None = Query(default=None)) -> list[dict[str, Any]]:
    conn = get_db()
    if category:
        rows = conn.execute(
            "SELECT * FROM scenarios WHERE category = ? ORDER BY id",
            (category,),
        ).fetchall()
    else:
        rows = conn.execute("SELECT * FROM scenarios ORDER BY id").fetchall()
    conn.close()
    items: list[dict[str, Any]] = []
    for row in rows:
        items.append(
            {
                "id": row["id"],
                "title": row["title"],
                "category": row["category"],
                "difficulty": row["difficulty"],
                "situation": row["situation"],
                "options": json.loads(row["options"]),
                "correct_option": row["correct_option"],
                "safer_response": row["safer_response"],
                "explanation": row["explanation"],
                "risk_indicators": json.loads(row["risk_indicators"]),
                "recommended_action": row["recommended_action"],
                "learning_objective": row["learning_objective"],
            }
        )
    return items


@app.get("/api/student-summary")
def get_student_summary() -> dict[str, Any]:
    return build_student_summary()


@app.get("/api/teacher-summary")
def get_teacher_summary() -> dict[str, Any]:
    return build_teacher_summary()


@app.post("/api/submit-scenario")
def submit_scenario(payload: ScenarioSubmission) -> dict[str, Any]:
    conn = get_db()
    row = conn.execute("SELECT * FROM scenarios WHERE id = ?", (payload.scenario_id,)).fetchone()
    if row is None:
        conn.close()
        raise HTTPException(status_code=404, detail="Scenario not found")

    selected_option = payload.selected_option.strip().upper()
    is_correct = selected_option == str(row["correct_option"]).upper()
    points_awarded = 15 if is_correct else 0

    conn.execute(
        "INSERT INTO progress (scenario_id, selected_option, is_correct, points_awarded) VALUES (?, ?, ?, ?)",
        (payload.scenario_id, selected_option, int(is_correct), points_awarded),
    )
    conn.commit()
    conn.close()

    explanation = row["explanation"]
    verdict = "Safer choice" if is_correct else "This choice could be risky"
    ai_feedback = {
        "verdict": verdict,
        "why_it_matters": explanation,
        "warning_signs": json.loads(row["risk_indicators"]),
        "what_to_do": row["recommended_action"],
        "takeaway": "Think before you click, share, or meet online. Safety tools and trusted adults help keep you protected.",
        "source": "fallback-explanation",
    }

    return {
        "is_correct": is_correct,
        "score_awarded": points_awarded,
        "points_total": 312 + points_awarded,
        "response": {
            "selected_option": selected_option,
            "correct_option": str(row["correct_option"]).upper(),
            "safer_response": str(row["safer_response"]).upper(),
        },
        "ai_feedback": ai_feedback,
    }


if __name__ == "__main__":
    import uvicorn

    uvicorn.run("backend.main:app", host="0.0.0.0", port=8001, reload=True)
