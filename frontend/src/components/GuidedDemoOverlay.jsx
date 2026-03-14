export default function GuidedDemoOverlay({ tick = 0, enabled }) {
  if (!enabled) return null;
  const step = tick % 4;
  const message =
    step === 0
      ? "Step 1: Generating dump points"
      : step === 1
        ? "Step 2: Assigning trucks"
        : step === 2
          ? "Step 3: Planning paths"
          : "Step 4: Updating height map";
  return <div className="guided-overlay">{message}</div>;
}

