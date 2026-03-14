export default function AIAssistantPanel({ logs = [] }) {
  const latest = logs[0]?.message || "Simulation insights will appear here.";
  return (
    <aside className="ai-assistant">
      <h4>AI Assistant</h4>
      <p>{latest}</p>
    </aside>
  );
}

