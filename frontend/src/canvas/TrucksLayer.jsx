const TYPE_COLOR = {
  Small: "#3498db",
  Medium: "#f39c12",
  Large: "#e74c3c"
};

const RISK_COLOR = { safe: "#2fb344", warning: "#f59f00", blocked: "#e03131" };

export default function TrucksLayer({
  trucks = [],
  scale = 8,
  selectedTruckId,
  onSelectTruck,
  animatedPositions = {},
  showPaths = true,
  onHoverTruck
}) {
  return (
    <g>
      {trucks.map((truck) => (
        <g
          key={truck.id}
          onClick={() => onSelectTruck(truck.id)}
          onMouseEnter={(e) => onHoverTruck?.(truck, e)}
          onMouseLeave={() => onHoverTruck?.(null, null)}
          style={{ cursor: "pointer" }}
        >
          {showPaths && truck.path?.length > 1 ? (
            <polyline
              points={truck.path.map(([x, y]) => `${(x + 0.5) * scale},${(y + 0.5) * scale}`).join(" ")}
              fill="none"
              stroke={selectedTruckId === truck.id ? "#ffffff" : RISK_COLOR[truck.risk] || "#2fb344"}
              strokeWidth={selectedTruckId === truck.id ? 2.8 : 1.8}
            />
          ) : null}
          {(() => {
            const pos = animatedPositions[truck.id] || { x: truck.position[0], y: truck.position[1] };
            const base = TYPE_COLOR[truck.type || "Medium"] || "#f39c12";
            const ring = truck.risk === "safe" ? base : RISK_COLOR[truck.risk] || base;
            return (
              <>
                <circle cx={(pos.x + 0.5) * scale} cy={(pos.y + 0.5) * scale} r={5.2} fill={ring} opacity="0.28" />
                <circle
                  cx={(pos.x + 0.5) * scale}
                  cy={(pos.y + 0.5) * scale}
                  r={3.7}
                  fill={base}
                >
                  <title>{`Truck ${truck.id} | ${truck.state} | payload ${Math.round(truck.remaining_payload)}`}</title>
                </circle>
                <text x={(pos.x + 0.5) * scale + 4} y={(pos.y + 0.5) * scale - 5} fill="#fff" fontSize="9">
                  T{truck.id}
                </text>
              </>
            );
          })()}
        </g>
      ))}
    </g>
  );
}
