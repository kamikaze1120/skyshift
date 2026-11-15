import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from schemas.models import ObjectCard, Coordinates

app = FastAPI(title="Skyshift API")

origins = [o for o in os.getenv("CORS_ALLOWED_ORIGINS", "http://localhost:3000").split(",") if o]
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_origin_regex=os.getenv("CORS_ORIGIN_REGEX") or None,
    allow_methods=["GET"],
    allow_headers=["*"],
)

# Source: docs/CANDIDATE_TARGETS.md (checks on 2026-11-09, SPHEREx QR2 via IRSA).
# Barnard's Star coordinates are the J2000 catalog position; queries must
# propagate its proper motion to each observation date.
OBJECTS = [
    ObjectCard(
        target_id="barnards-star", display_name="Barnard's Star", object_type="star",
        coordinates=Coordinates(ra_deg=269.452075, dec_deg=4.693364),
        detection="clear", releases=["qr2"],
        blurb="A nearby red dwarf with the largest known proper motion; clearly detected.",
    ),
    ObjectCard(
        target_id="rw-aurigae", display_name="RW Aurigae", object_type="star",
        coordinates=Coordinates(ra_deg=76.9564535, dec_deg=30.4013327),
        detection="clear", releases=["qr2"],
        blurb="A young variable star whose brightness changes between observations.",
    ),
    ObjectCard(
        target_id="r-draconis", display_name="R Draconis", object_type="star",
        coordinates=Coordinates(ra_deg=248.167472, dec_deg=66.7549882),
        detection="needs_check", releases=["qr2"],
        blurb="A large-amplitude variable star; very bright and may saturate the detector.",
    ),
    ObjectCard(
        target_id="wise-0855", display_name="WISE 0855-0714", object_type="brown_dwarf",
        coordinates=Coordinates(ra_deg=133.795129, dec_deg=-7.245147),
        detection="not_detected", releases=["qr2"],
        blurb="One of the coldest known brown dwarfs; too faint in single frames, may need stacking.",
    ),
    ObjectCard(
        target_id="epsilon-indi-b", display_name="Epsilon Indi B", object_type="brown_dwarf",
        coordinates=Coordinates(ra_deg=331.043836, dec_deg=-56.782707),
        detection="not_detected", releases=["qr2"],
        blurb="A pair of brown dwarfs orbiting a star; not detected in single frames.",
    ),
]


@app.get("/health")
def health():
    return {"status": "ok"}


@app.get("/objects", response_model=list[ObjectCard])
def objects():
    return OBJECTS
