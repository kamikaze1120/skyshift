from datetime import datetime
from typing import Literal, Optional
from pydantic import BaseModel, Field

Release = Literal["dr1", "qr3", "qr2"]
ObjectType = Literal["asteroid", "comet", "star", "brown_dwarf", "unknown"]
Detection = Literal["clear", "faint", "not_detected", "needs_check"]


class Coordinates(BaseModel):
    ra_deg: float = Field(ge=0, lt=360)
    dec_deg: float = Field(ge=-90, le=90)


class Observation(BaseModel):
    epoch: datetime
    mjd: float
    release: Release
    detector: int = Field(ge=1, le=6)
    wavelength_um: float
    bandwidth_um: float
    image_url: str
    source_file: str
    doi: str


class ObjectCard(BaseModel):
    target_id: str
    display_name: str
    object_type: ObjectType
    coordinates: Coordinates
    detection: Detection
    releases: list[Release]
    blurb: str


class TargetRecord(BaseModel):
    target_id: str
    display_name: str
    object_type: ObjectType
    coordinates: Coordinates
    observations: list[Observation] = Field(min_length=2)
    known_motion_arcsec: Optional[float] = None
    verified: bool
    story_note: Optional[str] = None
