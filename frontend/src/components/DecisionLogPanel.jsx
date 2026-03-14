export default function DecisionLogPanel({ logs = [] }) {
  return (
    <section className="panel">
      <h3>AI Decision Log</h3>
      <div className="decision-list">
        {!logs.length ? <p className="hint">No decision entries yet.</p> : null}
        {logs.map((entry) => (
          <p key={entry.id} className="decision-item">
            {entry.message}
          </p>
        ))}
      </div>
    </section>
  );
}

