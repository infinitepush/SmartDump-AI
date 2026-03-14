export default function DumpPoints({ dumpPoints = [], trucks = [], scale = 8 }) {
  const assignedSet = new Set(trucks.filter((t) => t.assigned_cell).map((t) => t.assigned_cell.join(",")));
  const occupiedSet = new Set(trucks.filter((t) => t.state === "dumping").map((t) => t.position.join(",")));

  return (
    <g>
      {dumpPoints.map((dp) => {
        const key = dp.cell.join(",");
        const assigned = assignedSet.has(key);
        const color = occupiedSet.has(key) ? "#868e96" : assigned ? "#f1c40f" : "#2ecc71";
        return (
          <circle
            key={key}
            className={assigned ? "pulse-dot" : ""}
            cx={(dp.cell[0] + 0.5) * scale}
            cy={(dp.cell[1] + 0.5) * scale}
            r={assigned ? 4 : 3}
            fill={color}
          >
            {assigned ? <animate attributeName="r" values="3;5;3" dur="1s" repeatCount="indefinite" /> : null}
          </circle>
        );
      })}
    </g>
  );
}
