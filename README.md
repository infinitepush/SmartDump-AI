# SmartDump AI

A cutting-edge web platform for AI-powered dump truck coordination and monitoring in mining environments.

[Check Live Backend Status](https://smartdump-ai.onrender.com/api/health)

---

## About The Project

SmartDump AI provides a robust, full-stack solution for the simulation and dynamic planning of mining dump sites. The platform allows users to configure complex dump areas, including irregular polygons and obstacles. Leveraging an AI-powered backend, SmartDump coordinates a fleet of trucks, optimizes paths, and resolves conflicts like collisions and deadlocks, ensuring safe and efficient operations.

Key features include real-time 2D/3D visualizations, data tracking, and AI-driven decision-making for improved fleet management and operational efficiency.

---

## Features

- **Interactive Simulation Control**: Start, pause, step through, and reset the simulation at any time.
- **Customizable Dump Site Configuration**: Define dump site polygons, entry points, maximum heights, and obstacles.
- **Advanced Fleet Management**: Create a fleet of trucks with varying payloads, turn radii, and other configurations.
- **AI-Driven Coordination**:
  - A* path planning with penalties for turns and pile placement.
  - Dynamic dump point generation using Poisson-disc sampling.
  - Multi-truck assignment with real-time conflict detection and resolution.
- **Rich Data Visualization**:
  - Live 2D map displaying truck positions, paths, and dump points in real-time.
  - Height map overlays to visualize terrain topology and elevations.
  - Real-time metrics dashboard to monitor volume, density, and operational efficiency.
- **AI Decision & Alert Logs**: Review AI decisions and view alerts for potential conflicts such as collisions or deadlocks.

---

## Tech Stack

This project uses a modern full-stack architecture:

### Backend
- **Python**
- **Flask**
- **Gunicorn**
- **NumPy**

### Frontend
- **React**
- **Vite**
- **JavaScript**

---

## Getting Started

### Prerequisites
- [Node.js](https://nodejs.org/) (v18.x or later)
- [Python](https://www.python.org/) (v3.10 or later) and `pip`

### Installation & Setup

1. **Clone the repository**:
    ```bash
    git clone https://github.com/your-username/SmartDump-AI.git
    cd SmartDump-AI
    ```

2. **Setup the Backend**:
    ```bash
    cd backend
    # Create and activate a virtual environment
    # On Windows:
    python -m venv .venv
    .venv\Scripts\activate
    # On macOS/Linux:
    # python3 -m venv .venv
    # source .venv/bin/activate
    # Install dependencies
    pip install -r requirements.txt
    # Run the server
    flask run
    ```

    The backend will be running at `http://localhost:5000`.

3. **Setup the Frontend**: (In a new terminal)
    ```bash
    cd frontend
    # Install dependencies
    npm install
    # Run the development server
    npm run dev
    ```

    The frontend will be accessible at `http://localhost:5173`.

---

## Deployment

SmartDump AI can be deployed on cloud platforms to ensure high availability and scalability:

- **Backend (Python/Flask)** is deployed on [Render](https://render.com/).
- **Frontend (React/Vite)** is deployed on [Vercel](https://vercel.com/).

### Backend Deployment (Render)

1. Push your code to GitHub.
2. Create a new **Web Service** on Render and connect your repository.
3. Use the following settings:
    - **Root Directory**: `backend`
    - **Build Command**: `pip install -r requirements.txt`
    - **Start Command**: `gunicorn --workers 4 --bind 0.0.0.0:$PORT app:app`
    - **Environment Variable**: Add `PYTHON_VERSION` with a value of `3.11.4`.

### Frontend Deployment (Vercel)

1. Create a `.env.production` file in the `frontend` directory:
    ```env
    VITE_API_BASE_URL=https://your-render-backend-url.onrender.com/api
    ```

2. Push your code (including the new `.env.production`) to GitHub.
3. Import your project into Vercel. Vercel will automatically detect it's a Vite project and configure the build settings.
4. Deploy. Vercel will build the app, using the `VITE_API_BASE_URL` to connect to your live backend.

---

## Project Structure

/
├── backend/ # Flask API and simulation engine  
│ ├── simulation/ # Core simulation logic  
│ ├── app.py # Flask application entrypoint  
│ └── requirements.txt  
└── frontend/ # React frontend application  
├── src/  
│ ├── components/ # Reusable UI components  
│ ├── context/ # Simulation context and API logic  
│ ├── pages/ # Top-level page components  
│ └── App.jsx # Main application component  
├── vite.config.js  
└── package.json

---

© 2026 SmartDump AI. All rights reserved.
