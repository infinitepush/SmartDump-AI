import { useSimulation } from "../context/SimulationContext.jsx";

export default function LandingPage() {
  const { setView, runDemoScenario, loading } = useSimulation();

  return (
    <section className="hero">
      <h2>AI-Driven Dump Density Optimization</h2>
      <p>
        Generate dynamic dump points inside irregular polygons, coordinate multiple trucks in real time,
        avoid deadlocks, and track operational efficiency.
      </p>
      <div className="row">
        <button onClick={() => setView("input")}>Start New Dump Simulation</button>
        <button onClick={runDemoScenario} disabled={loading}>
          {loading ? "Loading..." : "Quick Demo Run"}
        </button>
        <button onClick={() => setView("analytics")}>View Past Simulations</button>
      </div>
    </section>
  );
}
