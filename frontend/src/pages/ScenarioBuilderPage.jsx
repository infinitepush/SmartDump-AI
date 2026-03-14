import InputPage from "./InputPage.jsx";

export default function ScenarioBuilderPage() {
  return (
    <section className="stack">
      <section className="panel">
        <h2>Scenario Builder</h2>
        <p className="hint">Design dump site polygon, fleet configuration, and operational constraints.</p>
      </section>
      <InputPage />
    </section>
  );
}

