import { useMemo } from "react";
import { useSimulation } from "../context/SimulationContext.jsx";

function pct(a, b) {
  if (!b) return 0;
  return Math.round((a / b) * 100);
}

export default function AnalyticsPage() {
  const { state, metricsHistory, setView } = useSimulation();
  const latest = state?.metrics;

  const summary = useMemo(() => {
    if (!latest) return null;
    const baseline = 55;
    return {
      packingImprovement: Math.max(0, latest.packing_density - baseline).toFixed(2),
      activeRatio: pct(
        (state?.trucks || []).filter((t) => ["moving", "dumping"].includes(t.state)).length,
        state?.trucks?.length || 1
      ),
      conflictRate:
        latest.collision_events + latest.deadlock_events > 0
          ? (latest.collision_events + latest.deadlock_events).toFixed(0)
          : "0"
    };
  }, [latest, state]);

  if (!latest) {
    return (
      <section className="panel">
        <h2>Analytics Dashboard</h2>
        <p className="hint">No simulation data yet.</p>
        <button onClick={() => setView("scenario")}>Go To Setup</button>
      </section>
    );
  }

  return (
    <section className="stack">
      <section className="panel">
        <h2>Analytics Dashboard</h2>
        <p className="hint">Packing density vs traditional baseline and fleet efficiency summary.</p>
        <div className="metrics-grid">
          <div className="metric-card">
            <div className="metric-label">Packing Improvement</div>
            <div className="metric-value">+{summary.packingImprovement}%</div>
          </div>
          <div className="metric-card">
            <div className="metric-label">Active Truck Ratio</div>
            <div className="metric-value">{summary.activeRatio}%</div>
          </div>
          <div className="metric-card">
            <div className="metric-label">Conflict Events</div>
            <div className="metric-value">{summary.conflictRate}</div>
          </div>
        </div>
      </section>
      <section className="panel">
        <h3>Density Timeline</h3>
        <div className="timeline">
          {metricsHistory.slice(-40).map((m, i) => (
            <div
              key={`bar-${i}`}
              className="bar"
              style={{ height: `${Math.max(3, m.packing_density)}%` }}
              title={`Tick ${i} density ${m.packing_density}`}
            />
          ))}
        </div>
      </section>
    </section>
  );
}
