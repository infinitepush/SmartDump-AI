import { useSimulation } from "../context/SimulationContext.jsx";

export default function AppTopBar() {
  const { runDemoScenario, setView, loading } = useSimulation();
  return (
    <header className="app-topbar">
      <div>
        <h1>SmartDump AI</h1>
        <p>Mining dump optimization mission control</p>
      </div>
      <div className="row">
        <button onClick={runDemoScenario} disabled={loading}>
          {loading ? "Running..." : "Run Demo"}
        </button>
        <button onClick={() => setView("help")}>Docs</button>
        <button onClick={() => setView("help")}>Help</button>
      </div>
    </header>
  );
}

