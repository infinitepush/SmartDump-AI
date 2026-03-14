import MainCanvas from "../canvas/MainCanvas.jsx";
import AlertsPanel from "../components/AlertsPanel.jsx";
import AIAssistantPanel from "../components/AIAssistantPanel.jsx";
import DecisionLogPanel from "../components/DecisionLogPanel.jsx";
import GuidedDemoOverlay from "../components/GuidedDemoOverlay.jsx";
import LayerControls from "../components/LayerControls.jsx";
import MetricsPanel from "../components/MetricsPanel.jsx";
import SimulationControls from "../components/SimulationControls.jsx";
import SimulationTopBar from "../components/SimulationTopBar.jsx";
import Terrain3DPanel from "../components/Terrain3DPanel.jsx";
import TruckPanel from "../components/TruckPanel.jsx";
import { useSimulation } from "../context/SimulationContext.jsx";

export default function SimulationPage() {
  const {
    state,
    running,
    simulationMode,
    setSimulationMode,
    playSimulation,
    pauseSimulation,
    stepOnce,
    resetSimulation,
    layerVisibility,
    setLayerVisibility,
    alerts,
    selectedTruckId,
    setSelectedTruckId,
    metricsHistory,
    decisionLogs,
    error
  } = useSimulation();

  return (
    <section className="stack">
      <SimulationTopBar
        running={running}
        mode={simulationMode}
        tick={state?.tick}
        collisions={state?.metrics?.collision_events}
        deadlocks={state?.metrics?.deadlock_events}
        onPlay={playSimulation}
        onPause={pauseSimulation}
        onStep={stepOnce}
        onReset={resetSimulation}
      />
      <section className="sim-zone-layout">
        <aside className="stack zone-left">
          <SimulationControls
            running={running}
            mode={simulationMode}
            setMode={setSimulationMode}
            onStart={playSimulation}
            onPause={pauseSimulation}
            onStep={stepOnce}
            onReset={resetSimulation}
            predictiveOverlay={layerVisibility.predictiveMap}
            setPredictiveOverlay={(value) =>
              setLayerVisibility({ ...layerVisibility, predictiveMap: value })
            }
          />
          <LayerControls layerVisibility={layerVisibility} setLayerVisibility={setLayerVisibility} />
          <AlertsPanel alerts={alerts} />
          <TruckPanel
            trucks={state?.trucks || []}
            selectedTruckId={selectedTruckId}
            onSelectTruck={setSelectedTruckId}
          />
        </aside>
        <div className="zone-center">
          <MainCanvas />
          <GuidedDemoOverlay enabled={running} tick={state?.tick || 0} />
        </div>
        <aside className="stack zone-right">
          <MetricsPanel metrics={state?.metrics} tick={state?.tick} history={metricsHistory} />
          <Terrain3DPanel heights={state?.grid?.heights || []} />
          <DecisionLogPanel logs={decisionLogs} />
          {error ? <section className="panel error">{error}</section> : null}
        </aside>
      </section>
      <AIAssistantPanel logs={decisionLogs} />
    </section>
  );
}
