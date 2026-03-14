import { createContext, useContext, useEffect, useMemo, useRef, useState } from "react";

const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api";
const SimulationContext = createContext(null);

const defaultConfig = {
  cell_size: 2,
  entry_point: [2, 2],
  dump_polygon: {
    vertices: [
      [0, 0],
      [90, 5],
      [110, 35],
      [100, 75],
      [70, 100],
      [20, 92],
      [5, 55]
    ],
    max_height: 20,
    obstacles: [
      [40, 40, 6],
      [75, 60, 5]
    ]
  },
  trucks: [
    { id: 1, payload: 100, turn_radius: 12, type: "Medium" },
    { id: 2, payload: 120, turn_radius: 14, type: "Large" },
    { id: 3, payload: 90, turn_radius: 10, type: "Small" }
  ]
};

async function callApi(path, method = "GET", body = null) {
  const res = await fetch(`${API_BASE}${path}`, {
    method,
    headers: { "Content-Type": "application/json" },
    body: body ? JSON.stringify(body) : null
  });
  if (!res.ok) {
    throw new Error(await res.text());
  }
  return res.json();
}

function attachTruckMeta(rawState, scenarioConfig) {
  if (!rawState?.trucks?.length) return rawState;
  const metaById = new Map((scenarioConfig?.trucks || []).map((t) => [t.id, t]));
  return {
    ...rawState,
    trucks: rawState.trucks.map((t) => ({ ...t, type: metaById.get(t.id)?.type || "Medium" }))
  };
}

function inferAlerts(state) {
  if (!state?.grid) return [];
  const alerts = [];
  const { metrics, trucks, grid } = state;
  if (metrics.deadlock_events > 0) {
    alerts.push({ level: "high", text: `Deadlock events detected: ${metrics.deadlock_events}` });
  }
  if (metrics.collision_events > 0) {
    alerts.push({ level: "mid", text: `Collision conflicts detected: ${metrics.collision_events}` });
  }
  const lowSpots = grid.heights.flat().filter((h) => h > 0 && h < 2).length;
  if (lowSpots > 10) {
    alerts.push({ level: "low", text: `Low spots forming in ${lowSpots} cells` });
  }
  const overflow = grid.heights.flat().filter((h) => h >= grid.max_height).length;
  if (overflow > 0) {
    alerts.push({ level: "high", text: `Overfilled cells reached cap: ${overflow}` });
  }
  const blocked = trucks.filter((t) => t.risk === "blocked").length;
  if (blocked > 0) {
    alerts.push({ level: "high", text: `${blocked} truck(s) currently blocked` });
  }
  return alerts;
}

export function SimulationProvider({ children }) {
  const [view, setView] = useState("dashboard");
  const [scenario, setScenario] = useState(defaultConfig);
  const [state, setState] = useState(null);
  const [running, setRunning] = useState(false);
  const [simulationMode, setSimulationMode] = useState("auto");
  const [predictiveOverlay, setPredictiveOverlay] = useState(false);
  const [layerVisibility, setLayerVisibility] = useState({
    grid: true,
    dumpPoints: true,
    heightMap: true,
    truckPaths: true,
    predictiveMap: false
  });
  const [selectedTruckId, setSelectedTruckId] = useState(null);
  const [metricsHistory, setMetricsHistory] = useState([]);
  const [decisionLogs, setDecisionLogs] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const prevStateRef = useRef(null);

  function logDecision(message) {
    setDecisionLogs((prev) => [
      { id: `${Date.now()}-${Math.random().toString(16).slice(2, 7)}`, message },
      ...prev.slice(0, 79)
    ]);
  }

  function buildDecisions(prev, next) {
    if (!prev || !next) return;
    const prevById = new Map((prev.trucks || []).map((t) => [t.id, t]));
    for (const truck of next.trucks || []) {
      const older = prevById.get(truck.id);
      if (!older) continue;
      const prevAssigned = older.assigned_cell?.join(",") || "";
      const nextAssigned = truck.assigned_cell?.join(",") || "";
      if (nextAssigned && prevAssigned !== nextAssigned) {
        logDecision(
          `[AI] Truck ${truck.id} assigned cell (${truck.assigned_cell[0]},${truck.assigned_cell[1]}) | Reason: density + accessibility`
        );
      }
      if (older.path?.length && truck.path?.length && older.path[1] && truck.path[1]) {
        const oldNext = older.path[1].join(",");
        const newNext = truck.path[1].join(",");
        if (oldNext !== newNext && truck.state === "moving") {
          logDecision(`[AI] Truck ${truck.id} rerouted | Reason: conflict mitigation`);
        }
      }
    }
    if ((next.dump_points || []).length > (prev.dump_points || []).length) {
      logDecision("[AI] New dump point created | Reason: dynamic spatial balancing");
    }
  }

  async function loadDemoConfig() {
    setLoading(true);
    try {
      const data = await callApi("/demo-config");
      setScenario(data);
      setError("");
      return data;
    } catch (e) {
      setError(String(e.message || e));
      return null;
    } finally {
      setLoading(false);
    }
  }

  async function initializeSimulation(configOverride = null) {
    setLoading(true);
    try {
      setRunning(false);
      const configToUse = configOverride || scenario;
      const res = attachTruckMeta(await callApi("/init", "POST", configToUse), configToUse);
      setState(res);
      prevStateRef.current = res;
      setMetricsHistory([res.metrics]);
      setDecisionLogs([]);
      setRunning(false);
      setError("");
      setView("studio");
    } catch (e) {
      setError(String(e.message || e));
    } finally {
      setLoading(false);
    }
  }

  async function stepSimulation(steps = 1) {
    try {
      const res = attachTruckMeta(await callApi("/step", "POST", { steps }), scenario);
      buildDecisions(prevStateRef.current, res);
      prevStateRef.current = res;
      setState(res);
      setMetricsHistory((prev) => [...prev.slice(-119), res.metrics]);
      setError("");
    } catch (e) {
      setRunning(false);
      setError(String(e.message || e));
    }
  }

  async function resetSimulation() {
    setLoading(true);
    try {
      const res = attachTruckMeta(await callApi("/reset", "POST"), scenario);
      prevStateRef.current = res;
      setState(res);
      setMetricsHistory([res.metrics]);
      setRunning(false);
      setDecisionLogs([]);
      setError("");
    } catch (e) {
      setError(String(e.message || e));
    } finally {
      setLoading(false);
    }
  }

  async function runDemoScenario() {
    const demo = await loadDemoConfig();
    if (!demo) return;
    await initializeSimulation(demo);
    setSimulationMode("auto");
    setRunning(true);
  }

  async function playSimulation() {
    if (loading) return;
    if (!state?.grid) {
      await initializeSimulation();
    }
    if (simulationMode === "step") {
      setRunning(false);
      return;
    }
    setRunning(true);
  }

  function pauseSimulation() {
    setRunning(false);
  }

  async function stepOnce() {
    if (loading) return;
    if (!state?.grid) {
      await initializeSimulation();
      return;
    }
    await stepSimulation(1);
  }

  useEffect(() => {
    if (simulationMode === "step" && running) {
      setRunning(false);
    }
  }, [simulationMode, running]);

  useEffect(() => {
    if (!running || simulationMode !== "auto") return undefined;
    const id = setInterval(() => stepSimulation(1), 450);
    return () => clearInterval(id);
  }, [running, simulationMode]);

  const alerts = useMemo(() => inferAlerts(state), [state]);
  const selectedTruck = useMemo(
    () => state?.trucks?.find((t) => t.id === selectedTruckId) || null,
    [selectedTruckId, state]
  );

  const value = {
    view,
    setView,
    scenario,
    setScenario,
    state,
    hasSimulation: Boolean(state?.grid),
    running,
    setRunning,
    simulationMode,
    setSimulationMode,
    predictiveOverlay,
    setPredictiveOverlay,
    layerVisibility,
    setLayerVisibility,
    selectedTruckId,
    setSelectedTruckId,
    selectedTruck,
    metricsHistory,
    decisionLogs,
    alerts,
    error,
    loading,
    playSimulation,
    pauseSimulation,
    stepOnce,
    loadDemoConfig,
    runDemoScenario,
    initializeSimulation,
    stepSimulation,
    resetSimulation
  };

  return <SimulationContext.Provider value={value}>{children}</SimulationContext.Provider>;
}

export function useSimulation() {
  const context = useContext(SimulationContext);
  if (!context) {
    throw new Error("useSimulation must be used inside SimulationProvider");
  }
  return context;
}
