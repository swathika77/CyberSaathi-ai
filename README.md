# CyberSaathi AI

CyberSaathi AI is a full-stack digital safety learning platform for children and teenagers. It includes:

- a React + Vite frontend with Tailwind styling
- a FastAPI backend with SQLite persistence
- a scenario-based learning engine with 25+ safety challenges
- a teacher dashboard and student dashboard
- fallback-safe AI explanation flow for educational feedback

## Run locally

Frontend:

```bash
npm install
npm run dev
```

Backend:

```bash
python -m pip install -r requirements.txt
python -m uvicorn backend.main:app --reload --port 8001
```

Open the frontend at http://localhost:5173 and the backend at http://localhost:8001.

## Testing

```bash
npm run test
pytest backend/test_main.py
```
