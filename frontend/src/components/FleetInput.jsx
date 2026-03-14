const presets = {
  Small: { payload: 80, turn_radius: 9 },
  Medium: { payload: 100, turn_radius: 12 },
  Large: { payload: 130, turn_radius: 15 }
};

function toTruck(i, type) {
  return { id: i + 1, type, ...presets[type] };
}

export default function FleetInput({ trucks, setTrucks }) {
  function setFleetSize(size) {
    const next = [];
    for (let i = 0; i < size; i++) {
      next.push(trucks[i] || toTruck(i, "Medium"));
    }
    setTrucks(next);
  }

  function updateTruck(index, patch) {
    const next = [...trucks];
    next[index] = { ...next[index], ...patch };
    setTrucks(next);
  }

  return (
    <div className="panel">
      <h3>Truck Fleet Input</h3>
      <div className="row">
        <label>Fleet Size</label>
        <input
          type="number"
          min={1}
          max={12}
          value={trucks.length}
          onChange={(e) => setFleetSize(Number(e.target.value) || 1)}
        />
      </div>
      <p className="hint">Mixed fleet supported with Small/Medium/Large presets.</p>
      <div className="fleet-list">
        {trucks.map((truck, i) => (
          <div key={truck.id} className="fleet-item">
            <strong>Truck {truck.id}</strong>
            <div className="row">
              <label>Type</label>
              <select
                value={truck.type || "Medium"}
                onChange={(e) => {
                  const type = e.target.value;
                  updateTruck(i, { type, ...presets[type] });
                }}
              >
                <option>Small</option>
                <option>Medium</option>
                <option>Large</option>
              </select>
            </div>
            <div className="row">
              <label>Payload</label>
              <input
                type="number"
                value={truck.payload}
                onChange={(e) => updateTruck(i, { payload: Number(e.target.value) || 0 })}
              />
              <label>Turn Radius</label>
              <input
                type="number"
                value={truck.turn_radius}
                onChange={(e) => updateTruck(i, { turn_radius: Number(e.target.value) || 0 })}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

