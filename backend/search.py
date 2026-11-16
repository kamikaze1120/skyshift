import re
from typing import Optional

from astropy.coordinates import SkyCoord
from fastapi import HTTPException, Query, Request

from schemas.models import TargetRecord


def _parse_pair(q):
    m = re.match(r"^\s*(-?\d+(?:\.\d+)?)\s*[, ]\s*(-?\d+(?:\.\d+)?)\s*$", q)
    return (float(m.group(1)), float(m.group(2))) if m else None


def register_search(app, objects, timeseries):
    @app.get("/search", response_model=list[TargetRecord])
    def search(
        request: Request,
        q: Optional[str] = None,
        ra: Optional[float] = Query(None, ge=0, lt=360),
        dec: Optional[float] = Query(None, ge=-90, le=90),
        limit: int = Query(6, ge=2, le=12),
    ):
        name = None
        if ra is None or dec is None:
            if not q:
                raise HTTPException(422, "Give q, or ra and dec.")
            needle = q.strip().lower()
            hit = next(
                (o for o in objects
                 if needle in o.display_name.lower() or needle in o.target_id),
                None,
            )
            if hit:
                return [timeseries(request=request, ra=None, dec=None,
                                   target_id=hit.target_id, size=0.1, limit=limit)]
            pair = _parse_pair(q)
            if pair:
                ra, dec = pair
            else:
                try:
                    c = SkyCoord.from_name(q)
                    ra, dec = float(c.ra.deg), float(c.dec.deg)
                    name = q.strip()
                except Exception:
                    raise HTTPException(
                        404, f"Could not find '{q}'. Try RA and Dec in degrees."
                    )

        record = timeseries(request=request, ra=ra, dec=dec,
                            target_id=None, size=0.1, limit=limit)
        if name:
            record.display_name = name
        return [record]
