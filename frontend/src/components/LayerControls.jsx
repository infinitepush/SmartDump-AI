export default function LayerControls({ layerVisibility, setLayerVisibility }) {
  function toggle(key) {
    setLayerVisibility({ ...layerVisibility, [key]: !layerVisibility[key] });
  }

  return (
    <section className="panel">
      <h3>Layer Controls</h3>
      <label className="toggle"><input type="checkbox" checked={layerVisibility.grid} onChange={() => toggle("grid")} /> Grid</label>
      <label className="toggle"><input type="checkbox" checked={layerVisibility.dumpPoints} onChange={() => toggle("dumpPoints")} /> Dump Points</label>
      <label className="toggle"><input type="checkbox" checked={layerVisibility.heightMap} onChange={() => toggle("heightMap")} /> Height Map</label>
      <label className="toggle"><input type="checkbox" checked={layerVisibility.truckPaths} onChange={() => toggle("truckPaths")} /> Truck Paths</label>
      <label className="toggle"><input type="checkbox" checked={layerVisibility.predictiveMap} onChange={() => toggle("predictiveMap")} /> Predictive Map</label>
    </section>
  );
}

