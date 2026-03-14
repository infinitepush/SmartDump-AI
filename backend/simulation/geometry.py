import math
from typing import Iterable, List, Tuple


Point = Tuple[float, float]


def point_in_polygon(point: Point, vertices: List[Point]) -> bool:
    x, y = point
    inside = False
    n = len(vertices)
    j = n - 1
    for i in range(n):
        xi, yi = vertices[i]
        xj, yj = vertices[j]
        intersect = ((yi > y) != (yj > y)) and (
            x < (xj - xi) * (y - yi) / ((yj - yi) + 1e-9) + xi
        )
        if intersect:
            inside = not inside
        j = i
    return inside


def polygon_bounds(vertices: List[Point]) -> Tuple[float, float, float, float]:
    xs = [v[0] for v in vertices]
    ys = [v[1] for v in vertices]
    return min(xs), min(ys), max(xs), max(ys)


def euclidean(a: Point, b: Point) -> float:
    return math.hypot(a[0] - b[0], a[1] - b[1])


def circle_contains(point: Point, circle: Tuple[float, float, float]) -> bool:
    cx, cy, r = circle
    return euclidean(point, (cx, cy)) <= r


def mean(values: Iterable[float]) -> float:
    values = list(values)
    if not values:
        return 0.0
    return sum(values) / len(values)

