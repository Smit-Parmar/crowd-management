"""Smart Stadium Flow - Backend API

Lightweight crowd management system for large-scale sporting venues.
Tracks gate congestion, food stall wait times, and live announcements.
"""

from datetime import datetime
from enum import Enum

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field

# ---------------------------------------------------------------------------
# App setup
# ---------------------------------------------------------------------------

app = FastAPI(
    title="Smart Stadium Flow",
    description="Real-time crowd management for sporting venues",
    version="1.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ---------------------------------------------------------------------------
# Domain models
# ---------------------------------------------------------------------------


class CrowdLevel(str, Enum):
    low = "low"
    medium = "medium"
    high = "high"


class GateUpdate(BaseModel):
    gate: str = Field(..., description="Gate identifier, e.g. 'A'")
    level: CrowdLevel


class FoodUpdate(BaseModel):
    stall: str = Field(..., description="Stall identifier, e.g. 'stall1'")
    level: CrowdLevel


class AnnouncementCreate(BaseModel):
    message: str = Field(..., min_length=1, max_length=500)


class Announcement(BaseModel):
    message: str
    timestamp: str


# ---------------------------------------------------------------------------
# In-memory state
# ---------------------------------------------------------------------------

state: dict = {
    "gates": {
        "A": "low",
        "B": "medium",
        "C": "high",
        "D": "low",
    },
    "food": {
        "Pizza Palace": "low",
        "Burger Barn": "medium",
        "Taco Stand": "high",
        "Drinks & Ice": "low",
    },
    "announcements": [
        {
            "message": "Welcome to Smart Stadium! Enjoy the event.",
            "timestamp": datetime.now().strftime("%H:%M"),
        }
    ],
}

# ---------------------------------------------------------------------------
# Endpoints
# ---------------------------------------------------------------------------


@app.get("/status")
def get_status() -> dict:
    """Return full venue status — gates, food stalls, and announcements."""
    return state


@app.post("/update/gate")
def update_gate(payload: GateUpdate) -> dict:
    """Update crowd level for a specific gate."""
    if payload.gate not in state["gates"]:
        raise HTTPException(status_code=404, detail=f"Gate '{payload.gate}' not found")
    state["gates"][payload.gate] = payload.level.value
    return {"ok": True, "gate": payload.gate, "level": payload.level.value}


@app.post("/update/food")
def update_food(payload: FoodUpdate) -> dict:
    """Update crowd level for a specific food stall."""
    if payload.stall not in state["food"]:
        raise HTTPException(
            status_code=404, detail=f"Stall '{payload.stall}' not found"
        )
    state["food"][payload.stall] = payload.level.value
    return {"ok": True, "stall": payload.stall, "level": payload.level.value}


@app.post("/announcement")
def create_announcement(payload: AnnouncementCreate) -> dict:
    """Push a new live announcement to all attendees."""
    announcement: Announcement = Announcement(
        message=payload.message,
        timestamp=datetime.now().strftime("%H:%M"),
    )
    state["announcements"].insert(0, announcement.model_dump())

    # Keep only last 20 announcements
    if len(state["announcements"]) > 20:
        state["announcements"] = state["announcements"][:20]

    return {"ok": True, "announcement": announcement.model_dump()}


@app.get("/health")
def health_check() -> dict:
    """Health check endpoint."""
    return {"status": "healthy"}
