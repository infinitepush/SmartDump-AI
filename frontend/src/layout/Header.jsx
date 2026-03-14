import { useSimulation } from "../context/SimulationContext.jsx";

export default function Header() {
  const { view, setView } = useSimulation();
  const items = [
    ["landing", "Home"],
    ["input", "Setup"],
    ["simulation", "Simulation"],
    ["analytics", "Analytics"]
  ];
  return (
    <header className="topbar">
      <div>
        <h1>SmartDump AI</h1>
        <p>Dynamic dump planning for mining operations</p>
      </div>
      <nav>
        {items.map(([key, label]) => (
          <button
            key={key}
            className={view === key ? "nav-btn active" : "nav-btn"}
            onClick={() => setView(key)}
          >
            {label}
          </button>
        ))}
      </nav>
    </header>
  );
}

