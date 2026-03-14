export default function TruckPanel({ trucks = [], selectedTruckId, onSelectTruck }) {
  return (
    <section className="panel">
      <h3>Truck Panel</h3>
      <div className="truck-list">
        {trucks.map((t) => (
          <button
            key={t.id}
            className={selectedTruckId === t.id ? "truck-item selected" : "truck-item"}
            onClick={() => onSelectTruck(t.id)}
          >
            <span>T{t.id}</span>
            <span>{t.state}</span>
            <span>{t.assigned_cell ? `Cell ${t.assigned_cell[0]},${t.assigned_cell[1]}` : "No target"}</span>
            <span>Payload left {Math.round(t.remaining_payload)}</span>
            <span>ETA {(t.path?.length || 0) * 0.5}s</span>
          </button>
        ))}
      </div>
    </section>
  );
}
