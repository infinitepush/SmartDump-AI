import { useEffect, useRef } from "react";

const RISK_COLOR = {
  safe: "#2fb344",
  warning: "#f59f00",
  blocked: "#e03131"
};

function maxHeight(heights) {
  let max = 1;
  for (const row of heights) {
    for (const v of row) {
      if (v > max) max = v;
    }
  }
  return max;
}

export default function DumpMap({ state }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !state?.grid) return;

    const ctx = canvas.getContext("2d");
    const { grid, trucks, dump_points } = state;
    const h = grid.heights;
    const scale = 6;
    canvas.width = Math.max(720, grid.width * scale + 80);
    canvas.height = Math.max(480, grid.height * scale + 80);
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const maxH = maxHeight(h);
    for (let gy = 0; gy < grid.height; gy++) {
      for (let gx = 0; gx < grid.width; gx++) {
        const val = h[gy]?.[gx] || 0;
        const t = val / maxH;
        const c = Math.floor(25 + 170 * t);
        ctx.fillStyle = `rgb(${35 + c}, ${55 + c}, ${140 - Math.floor(80 * t)})`;
        ctx.fillRect(40 + gx * scale, 40 + gy * scale, scale - 0.4, scale - 0.4);
      }
    }

    for (const dp of dump_points || []) {
      const [x, y] = dp.cell;
      ctx.fillStyle = "#00c2ff";
      ctx.beginPath();
      ctx.arc(40 + x * scale + scale / 2, 40 + y * scale + scale / 2, 3, 0, Math.PI * 2);
      ctx.fill();
    }

    for (const truck of trucks || []) {
      const path = truck.path || [];
      if (path.length > 1) {
        ctx.strokeStyle = RISK_COLOR[truck.risk] || "#2fb344";
        ctx.lineWidth = 2;
        ctx.beginPath();
        const [sx, sy] = path[0];
        ctx.moveTo(40 + sx * scale + scale / 2, 40 + sy * scale + scale / 2);
        for (let i = 1; i < path.length; i++) {
          const [px, py] = path[i];
          ctx.lineTo(40 + px * scale + scale / 2, 40 + py * scale + scale / 2);
        }
        ctx.stroke();
      }

      const [tx, ty] = truck.position;
      ctx.fillStyle = RISK_COLOR[truck.risk] || "#2fb344";
      ctx.beginPath();
      ctx.arc(40 + tx * scale + scale / 2, 40 + ty * scale + scale / 2, 4, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = "#ffffff";
      ctx.font = "10px monospace";
      ctx.fillText(`T${truck.id}`, 44 + tx * scale, 36 + ty * scale);
    }
  }, [state]);

  return (
    <section className="panel">
      <h2>2D Dump Map</h2>
      <p className="hint">Path colors: green=safe, yellow=potential conflict, red=blocked/deadlock.</p>
      <div className="canvas-wrap">
        <canvas ref={canvasRef} />
      </div>
    </section>
  );
}

