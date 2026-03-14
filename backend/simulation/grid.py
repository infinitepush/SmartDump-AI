from typing import Dict, List, Tuple

import numpy as np

from .geometry import circle_contains, point_in_polygon, polygon_bounds
from .models import DumpPolygon, GridCell


GridIndex = Tuple[int, int]


def generate_grid(dump_polygon: DumpPolygon, cell_size: float = 2.0) -> Dict:
    min_x, min_y, max_x, max_y = polygon_bounds(dump_polygon.vertices)
    width = int(np.ceil((max_x - min_x) / cell_size)) + 1
    height = int(np.ceil((max_y - min_y) / cell_size)) + 1

    cells: Dict[GridIndex, GridCell] = {}
    for gx in range(width):
        for gy in range(height):
            wx = min_x + gx * cell_size
            wy = min_y + gy * cell_size
            inside = point_in_polygon((wx, wy), dump_polygon.vertices)
            if not inside:
                continue
            blocked = any(circle_contains((wx, wy), c) for c in dump_polygon.obstacles)
            cells[(gx, gy)] = GridCell(
                coordinates=(gx, gy),
                height=0.0,
                occupied=False,
                accessible=not blocked,
            )

    return {
        "cells": cells,
        "width": width,
        "height": height,
        "origin": (min_x, min_y),
        "cell_size": cell_size,
        "max_height": dump_polygon.max_height,
    }


def neighbors(idx: GridIndex, grid: Dict) -> List[GridIndex]:
    x, y = idx
    out: List[GridIndex] = []
    for dx in [-1, 0, 1]:
        for dy in [-1, 0, 1]:
            if dx == 0 and dy == 0:
                continue
            n = (x + dx, y + dy)
            cell = grid["cells"].get(n)
            if cell and cell.accessible:
                out.append(n)
    return out


def world_to_grid(world: Tuple[float, float], grid: Dict) -> GridIndex:
    ox, oy = grid["origin"]
    s = grid["cell_size"]
    return int(round((world[0] - ox) / s)), int(round((world[1] - oy) / s))


def grid_to_world(idx: GridIndex, grid: Dict) -> Tuple[float, float]:
    ox, oy = grid["origin"]
    s = grid["cell_size"]
    return ox + idx[0] * s, oy + idx[1] * s


def height_array(grid: Dict) -> List[List[float]]:
    arr = np.zeros((grid["height"], grid["width"]))
    for (gx, gy), cell in grid["cells"].items():
        arr[gy, gx] = cell.height
    return arr.tolist()

