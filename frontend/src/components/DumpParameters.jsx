export default function DumpParameters({ scenario, setScenario }) {
  const dump = scenario.dump_polygon;
  const obstacles = dump.obstacles || [];

  function updateDump(patch) {
    setScenario({ ...scenario, dump_polygon: { ...dump, ...patch } });
  }

  function addObstacle() {
    updateDump({ obstacles: [...obstacles, [10, 10, 4]] });
  }

  function updateObstacle(i, j, value) {
    const next = obstacles.map((o, idx) => (idx === i ? o.map((n, k) => (k === j ? value : n)) : o));
    updateDump({ obstacles: next });
  }

  return (
    <div className="panel">
      <h3>Dump Parameters</h3>
      <div className="row">
        <label>Max Height</label>
        <input
          type="number"
          value={dump.max_height}
          onChange={(e) => updateDump({ max_height: Number(e.target.value) || 20 })}
        />
      </div>
      <div className="row">
        <label>Grid Resolution (cell size)</label>
        <input
          type="number"
          step="0.5"
          value={scenario.cell_size}
          onChange={(e) => setScenario({ ...scenario, cell_size: Number(e.target.value) || 2 })}
        />
      </div>
      <div className="row">
        <label>Entry Point X</label>
        <input
          type="number"
          value={scenario.entry_point[0]}
          onChange={(e) =>
            setScenario({
              ...scenario,
              entry_point: [Number(e.target.value) || 0, scenario.entry_point[1]]
            })
          }
        />
        <label>Y</label>
        <input
          type="number"
          value={scenario.entry_point[1]}
          onChange={(e) =>
            setScenario({
              ...scenario,
              entry_point: [scenario.entry_point[0], Number(e.target.value) || 0]
            })
          }
        />
      </div>
      <h4>Obstacles / Restricted Zones</h4>
      {obstacles.map((o, i) => (
        <div className="row" key={`o-${i}`}>
          <label>X</label>
          <input type="number" value={o[0]} onChange={(e) => updateObstacle(i, 0, Number(e.target.value) || 0)} />
          <label>Y</label>
          <input type="number" value={o[1]} onChange={(e) => updateObstacle(i, 1, Number(e.target.value) || 0)} />
          <label>R</label>
          <input type="number" value={o[2]} onChange={(e) => updateObstacle(i, 2, Number(e.target.value) || 0)} />
        </div>
      ))}
      <button onClick={addObstacle}>Add Obstacle</button>
    </div>
  );
}

