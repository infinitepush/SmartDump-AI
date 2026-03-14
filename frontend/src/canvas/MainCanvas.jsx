import { useEffect, useMemo, useRef, useState } from "react";
import LegendPanel from "../components/LegendPanel.jsx";
import { useSimulation } from "../context/SimulationContext.jsx";
import { predictHeights } from "../utils/predictive.js";
import DumpPoints from "./DumpPoints.jsx";
import GridOverlay from "./GridOverlay.jsx";
import HeightMapOverlay from "./HeightMapOverlay.jsx";
import PolygonDisplay from "./PolygonDisplay.jsx";
import TrucksLayer from "./TrucksLayer.jsx";

const lerp = (a, b, t) => a + (b - a) * t;

export default function MainCanvas() {
  const { state, scenario, selectedTruckId, setSelectedTruckId, layerVisibility } = useSimulation();
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [animatedPositions, setAnimatedPositions] = useState({});
  const [hover, setHover] = useState(null);
  const prevPositionsRef = useRef({});

  const grid = state?.grid || null;
  const trucks = state?.trucks || [];
  const dump_points = state?.dump_points || [];
  const scale = 8;
  const width = grid ? grid.width * scale : 0;
  const height = grid ? grid.height * scale : 0;

  const predicted = useMemo(
    () => (grid ? predictHeights(grid.heights, dump_points, grid.max_height) : []),
    [grid, dump_points]
  );

  useEffect(() => {
    if (!grid || !trucks.length) return;
    const current = {};
    for (const t of trucks) current[t.id] = { x: t.position[0], y: t.position[1] };
    if (Object.keys(prevPositionsRef.current).length === 0) {
      prevPositionsRef.current = current;
      setAnimatedPositions(current);
      return;
    }

    const start = performance.now();
    const duration = 300;
    let raf = 0;

    const animate = (now) => {
      const prog = Math.min(1, (now - start) / duration);
      const next = {};
      for (const t of trucks) {
        const prev = prevPositionsRef.current[t.id] || current[t.id];
        const target = current[t.id];
        next[t.id] = { x: lerp(prev.x, target.x, prog), y: lerp(prev.y, target.y, prog) };
      }
      setAnimatedPositions(next);
      if (prog < 1) raf = requestAnimationFrame(animate);
      else prevPositionsRef.current = current;
    };
    raf = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(raf);
  }, [state?.tick, trucks, grid]);

  function toGrid(world) {
    if (!grid) return [0, 0];
    const ox = grid.origin[0];
    const oy = grid.origin[1];
    const cell = grid.cell_size;
    return [Math.round((world[0] - ox) / cell), Math.round((world[1] - oy) / cell)];
  }

  function onHoverTruck(truck, e) {
    if (!truck || !e) {
      setHover(null);
      return;
    }
    setHover({
      kind: "truck",
      x: e.clientX,
      y: e.clientY,
      text: `Truck T${truck.id} | ${truck.type || "Medium"} | ${truck.state} | Payload ${Math.round(
        truck.remaining_payload
      )}`
    });
  }

  function onMouseMoveCell(e) {
    if (!grid) return;
    const svg = e.currentTarget;
    const rect = svg.getBoundingClientRect();
    const localX = ((e.clientX - rect.left) / rect.width) * (Math.max(120, width / zoom)) + pan.x;
    const localY = ((e.clientY - rect.top) / rect.height) * (Math.max(120, height / zoom)) + pan.y;
    const gx = Math.floor(localX / scale);
    const gy = Math.floor(localY / scale);
    if (gx < 0 || gy < 0 || gx >= grid.width || gy >= grid.height) return;
    const h = grid.heights[gy]?.[gx] || 0;
    const ph = predicted[gy]?.[gx] || h;
    setHover({
      kind: "cell",
      x: e.clientX,
      y: e.clientY,
      text: `Cell (${gx},${gy}) | Height ${h.toFixed(1)}m | Predicted ${ph.toFixed(1)}m`
    });
  }

  const viewBox = `${pan.x} ${pan.y} ${Math.max(120, width / zoom)} ${Math.max(120, height / zoom)}`;

  if (!grid) {
    return (
      <section className="panel">
        <h2>Main Canvas</h2>
        <p className="hint">Initialize simulation to view dump map.</p>
      </section>
    );
  }

  return (
    <section className="panel">
      <div className="row spread">
        <h2>Main Canvas</h2>
        <div className="row">
          <label>Zoom</label>
          <input
            type="range"
            min="1"
            max="3"
            step="0.2"
            value={zoom}
            onChange={(e) => setZoom(Number(e.target.value))}
          />
          <button onClick={() => setPan({ x: Math.max(0, pan.x - 20), y: pan.y })}>Left</button>
          <button onClick={() => setPan({ x: pan.x + 20, y: pan.y })}>Right</button>
          <button onClick={() => setPan({ x: pan.x, y: Math.max(0, pan.y - 20) })}>Up</button>
          <button onClick={() => setPan({ x: pan.x, y: pan.y + 20 })}>Down</button>
        </div>
      </div>
      <div className="svg-wrap canvas-frame">
        <svg
          width="100%"
          height="560"
          viewBox={viewBox}
          onMouseMove={onMouseMoveCell}
          onMouseLeave={() => setHover(null)}
        >
          <rect x="0" y="0" width={width} height={height} fill="#081420" />
          {layerVisibility.heightMap ? <HeightMapOverlay heights={grid.heights} scale={scale} /> : null}
          {layerVisibility.predictiveMap ? <HeightMapOverlay heights={predicted} scale={scale} predictive /> : null}
          {layerVisibility.grid ? <GridOverlay accessibleCells={grid.accessible_cells} scale={scale} /> : null}
          <PolygonDisplay vertices={scenario.dump_polygon.vertices} toGrid={toGrid} scale={scale} />
          {layerVisibility.dumpPoints ? <DumpPoints dumpPoints={dump_points} trucks={trucks} scale={scale} /> : null}
          <TrucksLayer
            trucks={trucks}
            scale={scale}
            selectedTruckId={selectedTruckId}
            onSelectTruck={setSelectedTruckId}
            animatedPositions={animatedPositions}
            showPaths={layerVisibility.truckPaths}
            onHoverTruck={onHoverTruck}
          />
        </svg>
        <div className="legend-overlay">
          <LegendPanel />
        </div>
      </div>
      {hover ? <div className="tooltip-floating">{hover.text}</div> : null}
    </section>
  );
}
