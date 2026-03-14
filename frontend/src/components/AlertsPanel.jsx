const LEVEL_CLASS = {
  low: "alert low",
  mid: "alert mid",
  high: "alert high"
};

export default function AlertsPanel({ alerts }) {
  return (
    <section className="panel">
      <h3>Alerts</h3>
      {!alerts.length ? <p className="hint">No active warnings.</p> : null}
      {alerts.map((a, i) => (
        <p className={LEVEL_CLASS[a.level] || "alert"} key={`${a.text}-${i}`}>
          {a.text}
        </p>
      ))}
    </section>
  );
}

