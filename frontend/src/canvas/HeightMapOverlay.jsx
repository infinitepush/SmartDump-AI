function maxHeight(heights) {
  let max = 1;
  for (const row of heights || []) {
    for (const h of row) {
      if (h > max) max = h;
    }
  }
  return max;
}

function colorOf(v, max, predictive) {
  const t = Math.min(1, v / max);
  if (predictive) {
    const r = Math.floor(50 + t * 90);
    const g = Math.floor(90 + t * 70);
    const b = Math.floor(55 + t * 150);
    return `rgb(${r},${g},${b})`;
  }
  const r = Math.floor(35 + t * 170);
  const g = Math.floor(50 + t * 150);
  const b = Math.floor(130 - t * 70);
  return `rgb(${r},${g},${b})`;
}

export default function HeightMapOverlay({ heights = [], scale = 8, predictive = false }) {
  const max = maxHeight(heights);
  return (
    <g opacity={predictive ? 0.55 : 0.92}>
      {heights.map((row, y) =>
        row.map((h, x) => (
          <rect
            key={`${x}-${y}`}
            x={x * scale}
            y={y * scale}
            width={scale}
            height={scale}
            fill={colorOf(h, max, predictive)}
          />
        ))
      )}
    </g>
  );
}

