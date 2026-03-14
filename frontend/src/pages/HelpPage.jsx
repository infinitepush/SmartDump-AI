export default function HelpPage() {
  return (
    <section className="stack">
      <section className="panel">
        <h2>Docs / Help</h2>
        <p className="hint">Quick definitions for judges and operators.</p>
      </section>
      <section className="panel">
        <h3>What is Packing Density?</h3>
        <p>Packing density measures how efficiently dumped material fills the polygon area.</p>
        <p>Higher density generally means fewer trips and lower idle time.</p>
      </section>
      <section className="panel">
        <h3>What is Deadlock Prevention?</h3>
        <p>When multiple trucks compete for space, SmartDump AI delays/reroutes lower-priority paths.</p>
      </section>
      <section className="panel">
        <h3>Guided Demo</h3>
        <p>Use Dashboard `Run Demo`, then open Simulation Studio and run in step mode for explainable flow.</p>
      </section>
    </section>
  );
}

