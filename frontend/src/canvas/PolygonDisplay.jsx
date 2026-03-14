export default function PolygonDisplay({ vertices = [], toGrid, scale = 8 }) {
  if (!vertices.length) return null;
  const points = vertices
    .map((v) => {
      const [gx, gy] = toGrid(v);
      return `${(gx + 0.5) * scale},${(gy + 0.5) * scale}`;
    })
    .join(" ");
  return <polygon points={points} fill="none" stroke="#6ec1ff" strokeWidth="1.8" />;
}

