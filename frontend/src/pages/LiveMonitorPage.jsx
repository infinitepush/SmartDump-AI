import MainCanvas from "../canvas/MainCanvas.jsx";
import { useSimulation } from "../context/SimulationContext.jsx";

export default function LiveMonitorPage() {
  const { state, selectedTruckId, setSelectedTruckId } = useSimulation();
  const selected = state?.trucks?.find((t) => t.id === selectedTruckId) || null;

  return (
    <section className="monitor-layout">
      <aside className="panel">
        <h3>Truck List</h3>
        <div className="truck-list">
          {(state?.trucks || []).map((t) => (
            <button
              key={t.id}
              className={selectedTruckId === t.id ? "truck-item selected" : "truck-item"}
              onClick={() => setSelectedTruckId(t.id)}
            >
              T{t.id} {t.state}
            </button>
          ))}
        </div>
      </aside>
      <div>
        <MainCanvas />
      </div>
      <aside className="panel">
        <h3>Truck Details</h3>
        {!selected ? <p className="hint">Select a truck.</p> : null}
        {selected ? (
          <>
            <p>Truck: T{selected.id}</p>
            <p>Type: {selected.type}</p>
            <p>Status: {selected.state}</p>
            <p>Payload: {Math.round(selected.remaining_payload)}</p>
            <p>Assigned Cell: {selected.assigned_cell ? `${selected.assigned_cell[0]},${selected.assigned_cell[1]}` : "none"}</p>
            <p>ETA: {(selected.path?.length || 0) * 0.5}s</p>
          </>
        ) : null}
      </aside>
    </section>
  );
}

