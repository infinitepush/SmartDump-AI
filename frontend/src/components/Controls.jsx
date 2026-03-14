import { useMemo } from "react";

export default function Controls({
  configText,
  setConfigText,
  onLoadDemo,
  onInit,
  onStep,
  onStart,
  onStop,
  running
}) {
  const parsedHint = useMemo(() => {
    try {
      JSON.parse(configText);
      return "Valid JSON";
    } catch {
      return "Invalid JSON";
    }
  }, [configText]);

  return (
    <section className="panel">
      <h2>Scenario Input</h2>
      <p className="hint">Paste polygon/truck JSON or load demo.</p>
      <textarea
        className="config-input"
        value={configText}
        onChange={(e) => setConfigText(e.target.value)}
      />
      <p className={parsedHint === "Valid JSON" ? "ok" : "warn"}>{parsedHint}</p>
      <div className="row">
        <button onClick={onLoadDemo}>Load Demo</button>
        <button onClick={onInit}>Initialize</button>
        <button onClick={onStep}>Step</button>
        {!running ? <button onClick={onStart}>Start</button> : <button onClick={onStop}>Pause</button>}
      </div>
    </section>
  );
}

