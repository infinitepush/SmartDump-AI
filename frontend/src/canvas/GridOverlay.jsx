export default function GridOverlay({ accessibleCells = [], scale = 8 }) {
  return (
    <g opacity="0.2">
      {accessibleCells.map(([x, y], i) => (
        <rect key={i} x={x * scale} y={y * scale} width={scale} height={scale} fill="#8aa4bf" />
      ))}
    </g>
  );
}

