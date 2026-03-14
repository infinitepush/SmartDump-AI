export function predictHeights(heights, dumpPoints = [], maxHeight = 20) {
  if (!heights?.length) return [];
  const h = heights.map((row) => [...row]);
  for (const dp of dumpPoints) {
    const [x, y] = dp.cell;
    for (let dx = -2; dx <= 2; dx++) {
      for (let dy = -2; dy <= 2; dy++) {
        const nx = x + dx;
        const ny = y + dy;
        if (ny < 0 || nx < 0 || ny >= h.length || nx >= h[0].length) continue;
        const dist = Math.hypot(dx, dy);
        const bump = Math.max(0, 1.8 - dist * 0.6);
        h[ny][nx] = Math.min(maxHeight, h[ny][nx] + bump);
      }
    }
  }
  return h;
}

