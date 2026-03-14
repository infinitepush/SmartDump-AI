from dataclasses import dataclass, field
from typing import List, Tuple, Optional


Point = Tuple[float, float]
GridIndex = Tuple[int, int]


@dataclass
class Truck:
    id: int
    payload_capacity: float
    turn_radius: float
    fleet_index: int = 0
    position: GridIndex = (0, 0)
    state: str = "idle"
    assigned_cell: Optional[GridIndex] = None
    path: List[GridIndex] = field(default_factory=list)
    idle_ticks: int = 0
    reload_ticks_remaining: int = 0
    remaining_payload: float = 0.0
    risk: str = "safe"

    def __post_init__(self) -> None:
        self.remaining_payload = self.payload_capacity


@dataclass
class GridCell:
    coordinates: GridIndex
    height: float = 0.0
    occupied: bool = False
    accessible: bool = True


@dataclass
class DumpPolygon:
    vertices: List[Point]
    max_height: float = 20.0
    obstacles: List[Tuple[float, float, float]] = field(default_factory=list)

