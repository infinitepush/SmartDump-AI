function sparkline(values) {
  if (!values.length) return "";
  const max = Math.max(...values, 1);
  return values
    .map((v, i) => {
      const x = (i / Math.max(1, values.length - 1)) * 260;
      const y = 56 - (v / max) * 50;
      return `${x},${y}`;
    })
    .join(" ");
}

export default function MetricsPanel({ metrics, tick, history = [] }) {
  if (!metrics) {
    return (
      <section className="panel">
        <h3>Metrics Panel</h3>
        <p className="hint">Initialize simulation to view metrics.</p>
      </section>
    );
  }
  const cards = [
    ["Tick", tick],
    ["Packing Density (%)", metrics.packing_density],
    ["Volume Dumped", metrics.volume_dumped],
    ["Avg Idle", metrics.truck_idle_time],
    ["Collisions", metrics.collision_events],
    ["Deadlocks", metrics.deadlock_events]
  ];
  const efficiencySeries = history.map((m) => m.packing_density || 0);
  const packedPct = Math.max(0, Math.min(100, metrics.packing_density || 0));
  const volumePct = Math.max(0, Math.min(100, (metrics.volume_dumped || 0) / 80));

  return (
    <section className="panel">
      <h3>Metrics Panel</h3>
      <div className="kpi-block">
        <div className="metric-label">Packing Density</div>
        <div className="progress"><div style={{ width: `${packedPct}%` }} /></div>
        <div className="metric-value">{packedPct.toFixed(1)}%</div>
      </div>
      <div className="kpi-block">
        <div className="metric-label">Dumped Volume</div>
        <div className="progress"><div style={{ width: `${volumePct}%` }} /></div>
        <div className="metric-value">{metrics.volume_dumped} m3</div>
      </div>
      <div className="metrics-grid">
        {cards.map(([label, value]) => (
          <div className="metric-card" key={label}>
            <div className="metric-label">{label}</div>
            <div className="metric-value">{value}</div>
          </div>
        ))}
      </div>
      <div className="chart">
        <div className="metric-label">Efficiency Trend</div>
        <svg width="280" height="60">
          <polyline fill="none" stroke="#4dabf7" strokeWidth="2" points={sparkline(efficiencySeries)} />
        </svg>
      </div>
    </section>
  );
}
