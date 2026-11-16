from datetime import datetime
from typing import Literal, Optional
from pydantic import BaseModel, Field, model_validator

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
    wavelength_band: str = ""
    image_url: str
    source_file: str
    doi: str
    flags: Optional[list[str]] = None

    @model_validator(mode="after")
    def fill_band(self):
        if not self.wavelength_band:
            self.wavelength_band = f"D{self.detector} {self.wavelength_um:.2f} um"
        return self


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
    size_deg: float = 0.1
    observations: list[Observation] = Field(min_length=2)
    known_motion_arcsec: Optional[float] = None
    verified: bool
    story_note: Optional[str] = None
