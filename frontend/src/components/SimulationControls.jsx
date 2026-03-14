export default function SimulationControls({
  running,
  mode,
  setMode,
  onStart,
  onPause,
  onStep,
  onReset,
  predictiveOverlay,
  setPredictiveOverlay
}) {
  return (
    <section className="panel">
      <h3>Simulation Controls</h3>
      <div className="row">
        {!running ? <button onClick={onStart}>Play</button> : <button onClick={onPause}>Pause</button>}
        <button onClick={onStep}>Step-by-Step</button>
        <button onClick={onReset}>Reset</button>
      </div>
      <div className="row">
        <label>Mode</label>
        <button className={mode === "auto" ? "nav-btn active" : "nav-btn"} onClick={() => setMode("auto")}>
          Auto
        </button>
        <button className={mode === "step" ? "nav-btn active" : "nav-btn"} onClick={() => setMode("step")}>
          Step
        </button>
      </div>
      <label className="toggle">
        <input
          type="checkbox"
          checked={predictiveOverlay}
          onChange={(e) => setPredictiveOverlay(e.target.checked)}
        />
        Predictive Height Map Overlay
      </label>
    </section>
  );
}
