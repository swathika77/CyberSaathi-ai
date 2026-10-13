from fastapi.testclient import TestClient

from backend.main import app

client = TestClient(app)


def test_health_check() -> None:
    response = client.get('/api/health')
    assert response.status_code == 200
    assert response.json()['status'] == 'ok'


def test_scenarios_loaded() -> None:
    response = client.get('/api/scenarios')
    assert response.status_code == 200
    data = response.json()
    assert len(data) >= 25
    assert any(item['category'] == 'Cyberbullying' for item in data)


def test_submit_scenario() -> None:
    scenario = client.get('/api/scenarios').json()[0]
    response = client.post(
        '/api/submit-scenario',
        json={'scenario_id': scenario['id'], 'selected_option': scenario['correct_option']},
    )
    assert response.status_code == 200
    payload = response.json()
    assert payload['is_correct'] is True
    assert payload['score_awarded'] == 15
    assert payload['ai_feedback']['verdict'] == 'Safer choice'
