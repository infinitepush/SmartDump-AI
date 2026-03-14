import { SimulationProvider, useSimulation } from "./context/SimulationContext.jsx";
import AppTopBar from "./layout/AppTopBar.jsx";
import SidebarNav from "./layout/SidebarNav.jsx";
import AnalyticsPage from "./pages/AnalyticsPage.jsx";
import DashboardPage from "./pages/DashboardPage.jsx";
import ExplainAIPage from "./pages/ExplainAIPage.jsx";
import HelpPage from "./pages/HelpPage.jsx";
import LiveMonitorPage from "./pages/LiveMonitorPage.jsx";
import ScenarioBuilderPage from "./pages/ScenarioBuilderPage.jsx";
import SimulationPage from "./pages/SimulationPage.jsx";
import SettingsPage from "./pages/SettingsPage.jsx";

function PageRouter() {
  const { view } = useSimulation();
  if (view === "dashboard") return <DashboardPage />;
  if (view === "studio") return <SimulationPage />;
  if (view === "scenario") return <ScenarioBuilderPage />;
  if (view === "monitor") return <LiveMonitorPage />;
  if (view === "analytics") return <AnalyticsPage />;
  if (view === "explain") return <ExplainAIPage />;
  if (view === "help") return <HelpPage />;
  return <SettingsPage />;
}

function Shell() {
  return (
    <main className="product-shell">
      <AppTopBar />
      <section className="product-grid">
        <SidebarNav />
        <div className="content-pane">
          <PageRouter />
        </div>
      </section>
    </main>
  );
}

export default function App() {
  return (
    <SimulationProvider>
      <Shell />
    </SimulationProvider>
  );
}

