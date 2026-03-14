export default function LegendPanel() {
  return (
    <div className="legend">
      <h4>Legend</h4>
      <div><span className="dot blue" /> Small Truck</div>
      <div><span className="dot orange" /> Medium Truck</div>
      <div><span className="dot red" /> Large Truck</div>
      <div><span className="dot green" /> Available Dump Point</div>
      <div><span className="dot yellow" /> Assigned Dump Point</div>
      <div><span className="dot gray" /> Occupied Dump Point</div>
      <div><span className="dot red" /> Deadlock / Blocked</div>
      <div className="gradient-pill">Height Map</div>
    </div>
  );
}

