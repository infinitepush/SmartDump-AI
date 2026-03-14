# SmartDump AI

Hackathon-ready full-stack simulation platform for dynamic mining dump planning with:
- Irregular polygon dump area input
- Dynamic dump-point generation
- Multi-truck assignment and coordination
- Collision/deadlock awareness
- Real-time 2D visualization and metrics dashboard

## Project Structure

```text
SmartDump AI/
  backend/
    app.py
    requirements.txt
    data/demo_config.json
    simulation/
      engine.py
      models.py
      geometry.py
      grid.py
      sampling.py
      path_planning.py
      coordination.py
      metrics.py
  frontend/
    package.json
    vite.config.js
    index.html
    src/
      App.jsx
      styles.css
      components/
        Controls.jsx
        DumpMap.jsx
        MetricsPanel.jsx
```

## Backend (Flask)

### APIs
- `GET /api/health`
- `GET /api/demo-config`
- `POST /api/init` initialize simulation with polygon/truck config
- `POST /api/step` advance simulation (`{"steps": 1}`)
- `GET /api/state` current simulation state
- `POST /api/reset` reset to demo config

### Run backend

```bash
cd backend
python -m venv .venv
.venv\Scripts\activate
pip install -r requirements.txt
python app.py
```

Backend runs at `http://localhost:5000`.

## Frontend (React + Vite)

### Run frontend

```bash
cd frontend
npm install
npm run dev
```

Frontend runs at `http://localhost:5173`.

## Input Schema

```json
{
  "cell_size": 2.0,
  "entry_point": [2, 2],
  "dump_polygon": {
    "vertices": [[0,0],[90,5],[110,35],[100,75],[70,100],[20,92],[5,55]],
    "max_height": 20,
    "obstacles": [[40,40,6],[75,60,5]]
  },
  "trucks": [
    {"id": 1, "payload": 100, "turn_radius": 12},
    {"id": 2, "payload": 120, "turn_radius": 14}
  ]
}
```

## Algorithms Included

- Grid + height map generation for irregular polygons
- Dynamic dump points using Poisson-style candidate selection + hex candidates
- A* path planning with turn penalty and pile penalty
- Multi-truck assignment and conflict handling
- Real-time metrics:
  - packing density
  - truck idle time
  - total dumped volume
  - collision/deadlock counters

## Demo Workflow

1. Start backend and frontend.
2. Click `Load Demo`.
3. Click `Initialize`.
4. Click `Start` to run live simulation.
5. Observe truck paths:
   - Green: safe
   - Yellow: potential conflict
   - Red: blocked/deadlock

