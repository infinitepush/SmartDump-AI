import createPlotlyComponent from "react-plotly.js/factory";
import Plotly from "plotly.js-dist-min";

const Plot = createPlotlyComponent(Plotly);

function downsample(matrix, step = 2) {
  if (!matrix?.length) return [];
  const out = [];
  for (let y = 0; y < matrix.length; y += step) {
    const row = [];
    for (let x = 0; x < matrix[y].length; x += step) {
      row.push(matrix[y][x]);
    }
    out.push(row);
  }
  return out;
}

export default function Terrain3DPanel({ heights }) {
  if (!heights?.length) {
    return (
      <section className="panel">
        <h3>3D Terrain</h3>
        <p className="hint">No height map data yet.</p>
      </section>
    );
  }
  const z = downsample(heights, 2);
  const x = Array.from({ length: z[0]?.length || 0 }, (_, i) => i);
  const y = Array.from({ length: z.length }, (_, i) => i);

  return (
    <section className="panel">
      <h3>3D Dump Terrain</h3>
      <Plot
        data={[
          {
            z,
            x,
            y,
            type: "surface",
            colorscale: "YlGnBu",
            contours: {
              z: { show: true, usecolormap: true, highlightcolor: "#42a5f5", project: { z: true } }
            }
          }
        ]}
        layout={{
          paper_bgcolor: "rgba(0,0,0,0)",
          plot_bgcolor: "rgba(0,0,0,0)",
          font: { color: "#dce8f6" },
          scene: {
            xaxis: { title: "Grid X" },
            yaxis: { title: "Grid Y" },
            zaxis: { title: "Height" },
            camera: { eye: { x: 1.6, y: 1.5, z: 0.8 } }
          },
          margin: { l: 0, r: 0, t: 20, b: 0 }
        }}
        config={{ displaylogo: false, responsive: true }}
        style={{ width: "100%", height: "340px" }}
      />
    </section>
  );
}
