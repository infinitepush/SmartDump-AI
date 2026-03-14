import heapq
from typing import Dict, List, Optional, Tuple

from .geometry import euclidean
from .grid import neighbors


GridIndex = Tuple[int, int]


def _turn_penalty(prev: Optional[GridIndex], cur: GridIndex, nxt: GridIndex, turn_radius: float) -> float:
    if prev is None:
        return 0.0
    v1 = (cur[0] - prev[0], cur[1] - prev[1])
    v2 = (nxt[0] - cur[0], nxt[1] - cur[1])
    if v1 == v2:
        return 0.0
    return max(0.2, 3.0 / max(turn_radius, 1.0))


def astar_path(
    grid: Dict, start: GridIndex, goal: GridIndex, turn_radius: float
) -> List[GridIndex]:
    if start == goal:
        return [start]

    open_heap: List[Tuple[float, GridIndex]] = [(0.0, start)]
    came_from: Dict[GridIndex, Optional[GridIndex]] = {start: None}
    g_cost: Dict[GridIndex, float] = {start: 0.0}

    while open_heap:
        _, current = heapq.heappop(open_heap)
        if current == goal:
            break

        prev = came_from[current]
        for nxt in neighbors(current, grid):
            move = euclidean(current, nxt)
            turn = _turn_penalty(prev, current, nxt, turn_radius)
            pile_penalty = grid["cells"][nxt].height * 0.1
            tentative = g_cost[current] + move + turn + pile_penalty
            if tentative < g_cost.get(nxt, float("inf")):
                g_cost[nxt] = tentative
                came_from[nxt] = current
                f = tentative + euclidean(nxt, goal)
                heapq.heappush(open_heap, (f, nxt))

    if goal not in came_from:
        return [start]

    path: List[GridIndex] = []
    node: Optional[GridIndex] = goal
    while node is not None:
        path.append(node)
        node = came_from[node]
    path.reverse()
    return path

