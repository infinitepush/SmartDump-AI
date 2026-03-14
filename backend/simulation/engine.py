from __future__ import annotations

from typing import Dict, List, Tuple

from .coordination import assign_trucks, detect_conflicts
from .grid import generate_grid, grid_to_world, height_array, world_to_grid
from .metrics import compute_metrics
from .models import DumpPolygon, Truck


class SimulationEngine:
    def __init__(self) -> None:
        self.tick = 0
        self.grid: Dict = {}
        self.trucks: List[Truck] = []
        self.events = {"collisions": 0, "deadlocks": 0}
        self.volume_dumped = 0.0
        self.reload_ticks = 3
        self.initialized = False

    def init(self, payload: Dict) -> Dict:
        polygon_data = payload["dump_polygon"]
        dump_polygon = DumpPolygon(
            vertices=[tuple(v) for v in polygon_data["vertices"]],
            max_height=polygon_data.get("max_height", 20.0),
            obstacles=[tuple(o) for o in polygon_data.get("obstacles", [])],
        )
        self.grid = generate_grid(dump_polygon, payload.get("cell_size", 2.0))
        entry_world = payload.get("entry_point", dump_polygon.vertices[0])
        entry_idx = world_to_grid(tuple(entry_world), self.grid)
        if entry_idx not in self.grid["cells"] or not self.grid["cells"][entry_idx].accessible:
            entry_idx = next(iter(self.grid["cells"].keys()))

        self.trucks = []
        for i, t in enumerate(payload["trucks"]):
            truck = Truck(
                id=t["id"],
                payload_capacity=float(t["payload"]),
                turn_radius=float(t["turn_radius"]),
                fleet_index=i,
                position=entry_idx,
            )
            self.trucks.append(truck)

        self.tick = 0
        self.events = {"collisions": 0, "deadlocks": 0}
        self.volume_dumped = 0.0
        self.initialized = True
        return self.state()

    def _dump_if_arrived(self, truck: Truck) -> None:
        if truck.assigned_cell is None:
            return
        if truck.position != truck.assigned_cell:
            return
        cell = self.grid["cells"][truck.position]
        if cell.height >= self.grid["max_height"]:
            truck.assigned_cell = None
            truck.path = []
            truck.state = "idle"
            return
        amount = min(truck.remaining_payload, 10.0, self.grid["max_height"] - cell.height)
        cell.height += amount
        self.volume_dumped += amount
        truck.remaining_payload -= amount
        truck.state = "dumping"
        if truck.remaining_payload <= 0.0:
            truck.remaining_payload = 0.0
            truck.state = "reloading"
            truck.reload_ticks_remaining = self.reload_ticks
            truck.assigned_cell = None
            truck.path = []

    def _move_truck(self, truck: Truck, blocked_trucks: List[int]) -> None:
        if truck.state != "moving":
            return
        if len(truck.path) <= 1:
            self._dump_if_arrived(truck)
            return
        nxt = truck.path[1]
        if truck.id in blocked_trucks:
            truck.idle_ticks += 1
            truck.risk = "warning"
            return
        truck.position = nxt
        truck.path = truck.path[1:]
        truck.risk = "safe"
        if truck.assigned_cell == truck.position:
            self._dump_if_arrived(truck)

    def step(self, n: int = 1) -> Dict:
        if not self.initialized:
            raise ValueError("Simulation is not initialized.")
        for _ in range(n):
            self.tick += 1
            for truck in self.trucks:
                if truck.state == "reloading":
                    truck.reload_ticks_remaining -= 1
                    if truck.reload_ticks_remaining <= 0:
                        truck.remaining_payload = truck.payload_capacity
                        truck.state = "idle"
                elif truck.state == "dumping":
                    self._dump_if_arrived(truck)

            assign_trucks(self.grid, self.trucks)
            collisions, deadlocks = detect_conflicts(self.trucks)
            self.events["collisions"] += collisions
            self.events["deadlocks"] += deadlocks

            blocked_trucks: List[int] = []
            if collisions:
                taken = {}
                for t in self.trucks:
                    if t.state == "moving" and len(t.path) > 1:
                        nxt = t.path[1]
                        taken.setdefault(nxt, []).append(t)
                for nxt, contenders in taken.items():
                    if len(contenders) > 1:
                        contenders.sort(key=lambda tr: tr.fleet_index)
                        for loser in contenders[1:]:
                            blocked_trucks.append(loser.id)
                            loser.risk = "warning"

            for truck in self.trucks:
                self._move_truck(truck, blocked_trucks)
        return self.state()

    def state(self) -> Dict:
        metrics = compute_metrics(self.grid, self.trucks, self.volume_dumped, self.events)
        dump_points = []
        for t in self.trucks:
            if t.assigned_cell:
                dump_points.append(
                    {
                        "truck_id": t.id,
                        "cell": t.assigned_cell,
                        "world": grid_to_world(t.assigned_cell, self.grid),
                    }
                )

        trucks_json = []
        for t in self.trucks:
            trucks_json.append(
                {
                    "id": t.id,
                    "position": t.position,
                    "world_position": grid_to_world(t.position, self.grid),
                    "payload": t.payload_capacity,
                    "remaining_payload": t.remaining_payload,
                    "turn_radius": t.turn_radius,
                    "assigned_cell": t.assigned_cell,
                    "path": t.path,
                    "state": t.state,
                    "risk": t.risk,
                    "idle_ticks": t.idle_ticks,
                }
            )

        return {
            "tick": self.tick,
            "grid": {
                "width": self.grid["width"],
                "height": self.grid["height"],
                "origin": self.grid["origin"],
                "cell_size": self.grid["cell_size"],
                "max_height": self.grid["max_height"],
                "heights": height_array(self.grid),
                "accessible_cells": [list(idx) for idx, c in self.grid["cells"].items() if c.accessible],
            },
            "trucks": trucks_json,
            "dump_points": dump_points,
            "metrics": metrics,
        }
