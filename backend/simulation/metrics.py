from typing import Dict, List

from .geometry import mean
from .models import Truck


def compute_metrics(grid: Dict, trucks: List[Truck], volume_dumped: float, events: Dict) -> Dict:
    all_cells = [c for c in grid["cells"].values() if c.accessible]
    filled = [c for c in all_cells if c.height > 0]
    total_capacity = max(len(all_cells) * grid["max_height"], 1.0)
    occupancy_density = (len(filled) / max(len(all_cells), 1)) * 100.0
    volume_density = (volume_dumped / total_capacity) * 100.0
    return {
        "packing_density": round((occupancy_density * 0.4 + volume_density * 0.6), 2),
        "truck_idle_time": round(mean(t.idle_ticks for t in trucks), 2),
        "volume_dumped": round(volume_dumped, 2),
        "collision_events": events["collisions"],
        "deadlock_events": events["deadlocks"],
    }

