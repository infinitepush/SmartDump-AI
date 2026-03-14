export default function MiniMapPreview({ state }) {
  if (!state?.grid) {
    return <p className="hint">No active simulation preview.</p>;
  }
  const { grid, trucks } = state;
  const scale = 3;
  const width = grid.width * scale;
  const height = grid.height * scale;
  return (
    <div className="mini-map-wrap">
      <svg width="100%" height="180" viewBox={`0 0 ${width} ${height}`}>
        {grid.heights.map((row, y) =>
          row.map((h, x) => (
            <rect
              key={`${x}-${y}`}
              x={x * scale}
              y={y * scale}
              width={scale}
              height={scale}
              fill={`rgba(88, 149, 211, ${Math.min(0.95, 0.2 + h / Math.max(1, grid.max_height))})`}
            />
          ))
        )}
        {trucks.map((t) => (
          <circle key={t.id} cx={(t.position[0] + 0.5) * scale} cy={(t.position[1] + 0.5) * scale} r="1.8" fill="#ffd43b" />
        ))}
      </svg>
    </div>
  );
}

