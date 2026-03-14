import { useSimulation } from "../context/SimulationContext.jsx";

const ITEMS = [
  ["dashboard", "Dashboard"],
  ["studio", "Simulation Studio"],
  ["scenario", "Scenario Builder"],
  ["monitor", "Live Monitor"],
  ["analytics", "Analytics"],
  ["explain", "Explain AI"],
  ["help", "Help"],
  ["settings", "Settings"]
];

export default function SidebarNav() {
  const { view, setView } = useSimulation();
  return (
    <aside className="sidebar">
      <div className="sidebar-title">SmartDump AI</div>
      <div className="sidebar-items">
        {ITEMS.map(([id, label]) => (
          <button key={id} className={view === id ? "side-btn active" : "side-btn"} onClick={() => setView(id)}>
            {label}
          </button>
        ))}
      </div>
    </aside>
  );
}

