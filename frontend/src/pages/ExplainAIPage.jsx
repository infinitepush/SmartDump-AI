export default function ExplainAIPage() {
  return (
    <section className="stack">
      <section className="panel">
        <h2>AI Explainability</h2>
        <p className="hint">How SmartDump AI decides dump points, assignments, and routes.</p>
      </section>
      <section className="explain-grid">
        <article className="panel">
          <h3>Dump Point Generation</h3>
          <p>Poisson-style spacing plus hex candidate checks generate dense but feasible dump opportunities.</p>
        </article>
        <article className="panel">
          <h3>Truck Assignment</h3>
          <p>Each truck is scored by distance, cell height, and accessibility to maximize packing and avoid congestion.</p>
        </article>
        <article className="panel">
          <h3>Path Planning</h3>
          <p>A* plans paths with turn penalties, obstacle constraints, and pile-height costs.</p>
        </article>
        <article className="panel">
          <h3>Conflict Resolution</h3>
          <p>Graph-like contention checks prioritize one truck per contested next-cell and reroute others.</p>
        </article>
      </section>
    </section>
  );
}

