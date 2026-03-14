import json
from pathlib import Path

from flask import Flask, jsonify, request
from flask_cors import CORS

from simulation.engine import SimulationEngine


BASE_DIR = Path(__file__).resolve().parent
DEMO_CONFIG = BASE_DIR / "data" / "demo_config.json"

app = Flask(__name__)
CORS(app)
engine = SimulationEngine()


@app.get("/api/health")
def health():
    return {"status": "ok"}


@app.get("/api/demo-config")
def demo_config():
    with DEMO_CONFIG.open("r", encoding="utf-8") as f:
        return jsonify(json.load(f))


@app.post("/api/init")
def init_simulation():
    payload = request.get_json(force=True)
    state = engine.init(payload)
    return jsonify(state)


@app.post("/api/step")
def step_simulation():
    body = request.get_json(silent=True) or {}
    n = int(body.get("steps", 1))
    state = engine.step(max(1, n))
    return jsonify(state)


@app.get("/api/state")
def get_state():
    if not engine.initialized:
        return jsonify({"error": "Simulation not initialized"}), 400
    return jsonify(engine.state())


@app.post("/api/reset")
def reset():
    with DEMO_CONFIG.open("r", encoding="utf-8") as f:
        config = json.load(f)
    return jsonify(engine.init(config))


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)

