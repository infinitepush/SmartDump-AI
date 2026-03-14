import random
from typing import Dict, List, Optional, Tuple

from .geometry import euclidean
from .models import Truck


GridIndex = Tuple[int, int]


def hex_candidates(grid: Dict, spacing: int = 3) -> List[GridIndex]:
    candidates: List[GridIndex] = []
    for (x, y), cell in grid["cells"].items():
        if not cell.accessible:
            continue
        if x % spacing == 0 and (y + (x // spacing) % 2) % spacing == 0:
            candidates.append((x, y))
    return candidates


def poisson_pick(
    grid: Dict,
    trucks: List[Truck],
    min_distance: float = 3.0,
    max_tries: int = 40,
) -> Optional[GridIndex]:
    usable = [idx for idx, c in grid["cells"].items() if c.accessible and not c.occupied]
    if not usable:
        return None

    truck_targets = [t.assigned_cell for t in trucks if t.assigned_cell]
    for _ in range(max_tries):
        candidate = random.choice(usable)
        if all(euclidean(candidate, target) >= min_distance for target in truck_targets):
            return candidate
    return random.choice(usable)


def best_dump_point(grid: Dict, truck: Truck, trucks: List[Truck]) -> Optional[GridIndex]:
    seed = poisson_pick(grid, trucks)
    if seed is None:
        return None
    candidates = [seed] + hex_candidates(grid, spacing=4)[:20]
    valid: List[Tuple[float, GridIndex]] = []
    for idx in candidates:
        cell = grid["cells"].get(idx)
        if not cell or not cell.accessible:
            continue
        if cell.height >= grid["max_height"]:
            continue
        dist = euclidean(truck.position, idx)
        score = (cell.height * 2.5) + dist
        valid.append((score, idx))
    if not valid:
        return None
    valid.sort(key=lambda x: x[0])
    return valid[0][1]

