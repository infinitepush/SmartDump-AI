from typing import Dict, List, Tuple

from .models import Truck
from .path_planning import astar_path
from .sampling import best_dump_point


def assign_trucks(grid: Dict, trucks: List[Truck]) -> None:
    for truck in trucks:
        if truck.state in {"reloading", "dumping"}:
            continue
        if truck.assigned_cell is not None and truck.path:
            continue
        target = best_dump_point(grid, truck, trucks)
        if target is None:
            truck.state = "idle"
            truck.idle_ticks += 1
            continue
        truck.assigned_cell = target
        truck.path = astar_path(grid, truck.position, target, truck.turn_radius)
        truck.state = "moving"


def detect_conflicts(trucks: List[Truck]) -> Tuple[int, int]:
    next_cells: Dict[Tuple[int, int], List[Truck]] = {}
    for t in trucks:
        if t.state != "moving" or len(t.path) < 2:
            continue
        nxt = t.path[1]
        next_cells.setdefault(nxt, []).append(t)

    collisions = 0
    deadlocks = 0
    for contenders in next_cells.values():
        if len(contenders) <= 1:
            continue
        collisions += 1
        contenders.sort(key=lambda tr: tr.fleet_index)
        winner = contenders[0]
        winner.risk = "safe"
        for loser in contenders[1:]:
            loser.risk = "warning"
            loser.idle_ticks += 1
            if loser.idle_ticks > 4:
                loser.risk = "blocked"
                deadlocks += 1
    return collisions, deadlocks

