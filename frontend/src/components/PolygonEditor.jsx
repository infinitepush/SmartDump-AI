import { useEffect, useRef, useState } from "react";

function toLocal(vertices) {
  if (!vertices?.length) return [];
  const minX = Math.min(...vertices.map((v) => v[0]));
  const minY = Math.min(...vertices.map((v) => v[1]));
  return vertices.map(([x, y]) => [x - minX, y - minY]);
}

export default function PolygonEditor({ vertices, setVertices }) {
  const canvasRef = useRef(null);
  const [jsonText, setJsonText] = useState(JSON.stringify(vertices, null, 2));

  useEffect(() => {
    setJsonText(JSON.stringify(vertices, null, 2));
  }, [vertices]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const local = toLocal(vertices);
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "#0d1e2d";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.strokeStyle = "#3f88bf";
    ctx.lineWidth = 2;
    if (local.length > 1) {
      ctx.beginPath();
      ctx.moveTo(local[0][0] * 4 + 30, local[0][1] * 4 + 30);
      for (let i = 1; i < local.length; i++) {
        ctx.lineTo(local[i][0] * 4 + 30, local[i][1] * 4 + 30);
      }
      ctx.closePath();
      ctx.stroke();
    }
    for (let i = 0; i < local.length; i++) {
      const [x, y] = local[i];
      ctx.fillStyle = "#ffd43b";
      ctx.beginPath();
      ctx.arc(x * 4 + 30, y * 4 + 30, 4, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = "#ffffff";
      ctx.font = "10px monospace";
      ctx.fillText(`${i + 1}`, x * 4 + 35, y * 4 + 28);
    }
  }, [vertices]);

  function onCanvasClick(e) {
    const rect = canvasRef.current.getBoundingClientRect();
    const x = Math.round((e.clientX - rect.left - 30) / 4);
    const y = Math.round((e.clientY - rect.top - 30) / 4);
    if (x < 0 || y < 0) return;
    const minX = vertices.length ? Math.min(...vertices.map((v) => v[0])) : 0;
    const minY = vertices.length ? Math.min(...vertices.map((v) => v[1])) : 0;
    setVertices([...vertices, [x + minX, y + minY]]);
  }

  function applyJson() {
    try {
      const parsed = JSON.parse(jsonText);
      if (!Array.isArray(parsed) || parsed.length < 3) return;
      setVertices(parsed);
    } catch {
      // No-op for invalid JSON.
    }
  }

  return (
    <div className="panel">
      <h3>Polygon Input</h3>
      <p className="hint">Click canvas to add vertices, or paste vertices JSON.</p>
      <canvas ref={canvasRef} className="poly-canvas" width={420} height={280} onClick={onCanvasClick} />
      <div className="row">
        <button onClick={() => setVertices([])}>Clear</button>
        <button onClick={() => setVertices(vertices.slice(0, -1))}>Undo Last</button>
      </div>
      <textarea
        className="config-input small"
        value={jsonText}
        onChange={(e) => setJsonText(e.target.value)}
      />
      <button onClick={applyJson}>Apply JSON Vertices</button>
    </div>
  );
}

