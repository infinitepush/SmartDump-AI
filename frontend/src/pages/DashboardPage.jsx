import MiniMapPreview from "../components/MiniMapPreview.jsx";
import { useSimulation } from "../context/SimulationContext.jsx";

export default function DashboardPage() {
  const { state, runDemoScenario, loading, setView } = useSimulation();
  const m = state?.metrics;
  const activeTrucks = state?.trucks?.filter((t) => ["moving", "dumping"].includes(t.state)).length || 0;

  return (
    <section className="stack">
      <section className="panel">
        <h2>System Overview</h2>
        <p className="hint">Mission control summary for simulation readiness and quick actions.</p>
        <div className="row">
          <button onClick={() => setView("scenario")}>Open Scenario Builder</button>
          <button onClick={() => setView("studio")}>Open Simulation Studio</button>
          <button onClick={runDemoScenario} disabled={loading}>
            {loading ? "Running..." : "Run Demo Scenario"}
          </button>
        </div>
      </section>
      <section className="dashboard-grid">
        <div className="panel">
          <h3>Simulation Status</h3>
          <p>Status: {state ? "Ready" : "Not initialized"}</p>
          <p>Last Tick: {state?.tick ?? "-"}</p>
          <p>Active Trucks: {activeTrucks}</p>
        </div>
        <div className="panel">
          <h3>Packing Density</h3>
          <div className="big-kpi">{m?.packing_density ?? 0}%</div>
        </div>
        <div className="panel">
          <h3>Volume Dumped</h3>
          <div className="big-kpi">{m?.volume_dumped ?? 0} m3</div>
        </div>
        <div className="panel">
          <h3>Truck Idle Time</h3>
          <div className="big-kpi">{m?.truck_idle_time ?? 0}%</div>
        </div>
      </section>
      <section className="panel">
        <h3>Mini Map Preview</h3>
        <MiniMapPreview state={state} />
      </section>
    </section>
  );
}

