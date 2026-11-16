import os
from concurrent.futures import ThreadPoolExecutor
from typing import Optional

from astropy.time import Time
from fastapi import FastAPI, HTTPException, Query, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles

from backend.archive import search_images
from backend.frames import make_frame, position_at
from schemas.models import Coordinates, ObjectCard, TargetRecord

app = FastAPI(title="Skyshift API")

origins = [o for o in os.getenv("CORS_ALLOWED_ORIGINS", "http://localhost:3000").split(",") if o]
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_origin_regex=os.getenv("CORS_ORIGIN_REGEX") or None,
    allow_methods=["GET", "POST"],
    allow_headers=["*"],
)

FRAMES_DIR = os.path.join(os.path.dirname(__file__), "cache", "frames")
os.makedirs(FRAMES_DIR, exist_ok=True)
app.mount("/frames", StaticFiles(directory=FRAMES_DIR), name="frames")

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

# Proper motion (mas/yr): (pm_ra_cosdec, pm_dec). Only Barnard's Star moves
# enough to matter. Source: SIMBAD, via docs/CANDIDATE_TARGETS.md.
PROPER_MOTION = {"barnards-star": (-801.551, 10362.394)}

# Reference time for the archive search (mid-survey), so a moving star is
# searched near where it was during the observations.
SEARCH_REF_MJD = Time("2025-12-01").mjd


def pick_evenly(rows, n):
    if len(rows) <= n:
        return rows
    idx = sorted({round(i * (len(rows) - 1) / (n - 1)) for i in range(n)})
    return [rows[i] for i in idx]


@app.get("/health")
def health():
    return {"status": "ok"}


@app.get("/objects", response_model=list[ObjectCard])
def objects():
    return OBJECTS


@app.get("/timeseries", response_model=TargetRecord)
def timeseries(
    request: Request,
    ra: Optional[float] = Query(None, ge=0, lt=360),
    dec: Optional[float] = Query(None, ge=-90, le=90),
    target_id: Optional[str] = None,
    size: float = Query(0.1, ge=0.01, le=0.5),
    limit: int = Query(8, ge=2, le=24),
):
    card = next((o for o in OBJECTS if o.target_id == target_id), None)
    if ra is None or dec is None:
        if card is None:
            raise HTTPException(422, "Give ra and dec, or a known target_id.")
        ra, dec = card.coordinates.ra_deg, card.coordinates.dec_deg
    pm_ra, pm_dec = PROPER_MOTION.get(target_id, (None, None))

    search_ra, search_dec = position_at(SEARCH_REF_MJD, ra, dec, pm_ra, pm_dec)
    rows = search_images(search_ra, search_dec)
    if not rows:
        raise HTTPException(
            502, "No images found. The archive may be busy, or this position is not covered."
        )

    base_url = (
        os.getenv("PUBLIC_BASE_URL")
        or os.getenv("RENDER_EXTERNAL_URL")
        or str(request.base_url)
    ).rstrip("/")

    picked = pick_evenly(rows, limit)
    with ThreadPoolExecutor(max_workers=4) as pool:
        results = list(
            pool.map(
                lambda row: make_frame(row, ra, dec, pm_ra, pm_dec, size, FRAMES_DIR, base_url),
                picked,
            )
        )
    observations = sorted((o for o in results if o), key=lambda o: o.mjd)
    if len(observations) < 2:
        raise HTTPException(502, "Could not build enough frames. Try again in a minute.")

    return TargetRecord(
        target_id=card.target_id if card else f"radec-{ra:.4f}{dec:+.4f}",
        display_name=card.display_name if card else f"RA {ra:.4f}, Dec {dec:.4f}",
        object_type=card.object_type if card else "unknown",
        coordinates=Coordinates(ra_deg=ra, dec_deg=dec),
        observations=observations,
        size_deg=size,
        known_motion_arcsec=None,
        verified=False,
        story_note=None,
    )


from backend.search import register_search  # noqa: E402

register_search(app, OBJECTS, timeseries)

from backend.flags import register_flags  # noqa: E402

register_flags(app)
