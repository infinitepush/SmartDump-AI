export default function SimulationTopBar({ running, mode, tick, collisions, deadlocks, onPlay, onPause, onStep, onReset }) {
  return (
    <section className="panel sim-topbar">
      <div className="row spread">
        <div className="row">
          <strong>Simulation Status:</strong>
          <span>{running ? "Running" : "Paused"}</span>
          <span>Mode: {mode === "auto" ? "Auto" : "Step"}</span>
          <span>Tick: {tick ?? 0}</span>
          <span>Collisions: {collisions ?? 0}</span>
          <span>Deadlocks: {deadlocks ?? 0}</span>
        </div>
        <div className="row">
          {!running ? <button onClick={onPlay}>Play</button> : <button onClick={onPause}>Pause</button>}
          <button onClick={onStep}>Step</button>
          <button onClick={onReset}>Reset</button>
        </div>
      </div>
    </section>
  );
}

