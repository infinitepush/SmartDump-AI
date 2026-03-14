import DumpParameters from "../components/DumpParameters.jsx";
import FleetInput from "../components/FleetInput.jsx";
import PolygonEditor from "../components/PolygonEditor.jsx";
import { useSimulation } from "../context/SimulationContext.jsx";

export default function InputPage() {
  const { scenario, setScenario, loadDemoConfig, initializeSimulation, loading, setView } = useSimulation();

  function setVertices(vertices) {
    setScenario({ ...scenario, dump_polygon: { ...scenario.dump_polygon, vertices } });
  }

  function setTrucks(trucks) {
    setScenario({ ...scenario, trucks });
  }

  const estimatedDensity = Math.min(
    100,
    Math.round((scenario.trucks.reduce((s, t) => s + t.payload, 0) / 600) * 35 + 22)
  );

  return (
    <section className="input-grid">
      <div className="stack">
        <PolygonEditor vertices={scenario.dump_polygon.vertices} setVertices={setVertices} />
        <DumpParameters scenario={scenario} setScenario={setScenario} />
      </div>
      <div className="stack">
        <FleetInput trucks={scenario.trucks} setTrucks={setTrucks} />
        <section className="panel">
          <h3>Planning Preview</h3>
          <p>Estimated initial packing density: {estimatedDensity}%</p>
          <p className="hint">Predictive overlay can be toggled during simulation.</p>
          <div className="row">
            <button onClick={loadDemoConfig} disabled={loading}>
              Load Demo Config
            </button>
            <button onClick={() => initializeSimulation()} disabled={loading}>
              {loading ? "Initializing..." : "Start Simulation"}
            </button>
            <button onClick={() => setView("dashboard")}>Back</button>
          </div>
        </section>
      </div>
    </section>
  );
}
