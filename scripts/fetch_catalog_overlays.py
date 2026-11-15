#!/usr/bin/env python3
"""One-time fetch: real Gaia DR3 + JPL SBDB data for Skyshift's fixed target set.

Not part of the running app. Run this locally whenever the target list changes,
and commit the regenerated frontend/src/fixtures/catalogOverlays.json.

    python3 scripts/fetch_catalog_overlays.py

Gaia DR3 is queried live via its TAP service for the three star targets (a
cone search near each target's RA/Dec — brown dwarfs are skipped, they're too
faint for Gaia's optical catalog). JPL SBDB is queried for 433 Eros, the one
solar-system body in the set. Each target's entry in the output records
whether its query actually succeeded, so the fixture never silently claims
data it doesn't have.
"""
from __future__ import annotations

import json
from datetime import datetime, timezone
from pathlib import Path

import requests
from astropy.coordinates import SkyCoord
from astropy.time import Time
import astropy.units as u

GAIA_TAP_SYNC_URL = "https://gea.esac.esa.int/tap-server/tap/sync"
SBDB_URL = "https://ssd-api.jpl.nasa.gov/sbdb.api"
GAIA_CONE_RADIUS_DEG = 5 / 3600.0  # 5 arcsec
GAIA_REFERENCE_EPOCH = Time("J2016.0")
REQUEST_TIMEOUT_S = 20

OUTPUT_PATH = Path(__file__).resolve().parent.parent / "frontend" / "src" / "fixtures" / "catalogOverlays.json"

# Gaia DR3 stores every source's position at epoch J2016.0. A target with
# large proper motion must be propagated back to that epoch before a cone
# search, or the search centers on empty sky and falsely implies the star
# isn't catalogued at all. Barnard's Star moves ~10.4 arcsec/yr (the fastest
# of any star), so its fixture position (as observed ~2025) is ~100 arcsec
# from where Gaia actually sees it. RW Aurigae and R Draconis have no
# logged proper motion (see known_motion_arcsec: null in targets.json) —
# negligible over this baseline, so they're queried at the fixture position
# directly, matching Athena's own review finding.
PROPER_MOTION_MAS_PER_YR = {
    # (pm_ra_cosdec, pm_dec), same values as backend's PROPER_MOTION dict
    "barnards-star-2025-2026": (-801.551, 10362.394),
}
FIXTURE_COORDINATE_EPOCH = Time("2025-08-15")  # targets.json's first observation epoch for this target

STAR_TARGETS = [
    {"target_id": "barnards-star-2025-2026", "display_name": "Barnard's Star", "ra_deg": 269.44634, "dec_deg": 4.76724},
    {"target_id": "rw-aurigae-2025-2026", "display_name": "RW Aurigae", "ra_deg": 76.9564535, "dec_deg": 30.4013327},
    {"target_id": "r-draconis-2025-2026", "display_name": "R Draconis", "ra_deg": 248.167472, "dec_deg": 66.7549882},
]

ASTEROID_TARGET = {"target_id": "433-eros-2025-06", "display_name": "433 Eros", "sstr": "433"}


def gaia_search_position(target: dict) -> tuple[float, float, bool]:
    """Returns (ra_deg, dec_deg, was_propagated) to actually search Gaia at."""
    proper_motion = PROPER_MOTION_MAS_PER_YR.get(target["target_id"])
    if proper_motion is None:
        return target["ra_deg"], target["dec_deg"], False

    pm_ra_cosdec, pm_dec = proper_motion
    coord = SkyCoord(
        ra=target["ra_deg"] * u.deg,
        dec=target["dec_deg"] * u.deg,
        pm_ra_cosdec=pm_ra_cosdec * u.mas / u.yr,
        pm_dec=pm_dec * u.mas / u.yr,
        obstime=FIXTURE_COORDINATE_EPOCH,
    )
    propagated = coord.apply_space_motion(new_obstime=GAIA_REFERENCE_EPOCH)
    return propagated.ra.deg, propagated.dec.deg, True


def fetch_gaia_cone_search(ra_deg: float, dec_deg: float) -> dict:
    query = (
        "SELECT TOP 5 source_id, ra, dec, phot_g_mean_mag, parallax, pmra, pmdec "
        "FROM gaiadr3.gaia_source "
        f"WHERE 1=CONTAINS(POINT('ICRS', ra, dec), CIRCLE('ICRS', {ra_deg}, {dec_deg}, {GAIA_CONE_RADIUS_DEG}))"
    )
    params = {"REQUEST": "doQuery", "LANG": "ADQL", "FORMAT": "json", "QUERY": query}
    try:
        response = requests.get(GAIA_TAP_SYNC_URL, params=params, timeout=REQUEST_TIMEOUT_S)
        response.raise_for_status()
    except requests.exceptions.RequestException as exc:
        return {"status": "service_unreachable", "detail": str(exc), "sources": []}

    payload = response.json()
    columns = [col["name"] for col in payload["metadata"]]
    rows = [dict(zip(columns, row)) for row in payload["data"]]
    return {"status": "ok" if rows else "no_match", "sources": rows}


def fetch_sbdb(sstr: str) -> dict:
    params = {"sstr": sstr, "discovery": "1", "phys-par": "1"}
    try:
        response = requests.get(SBDB_URL, params=params, timeout=REQUEST_TIMEOUT_S)
        response.raise_for_status()
    except requests.exceptions.RequestException as exc:
        return {"status": "service_unreachable", "detail": str(exc)}

    payload = response.json()
    if "object" not in payload:
        return {"status": "no_match", "raw": payload}
    return {"status": "ok", "object": payload["object"], "discovery": payload.get("discovery")}


def main() -> None:
    fetched_at = datetime.now(timezone.utc).isoformat()
    overlays = []

    for target in STAR_TARGETS:
        search_ra, search_dec, was_propagated = gaia_search_position(target)
        result = fetch_gaia_cone_search(search_ra, search_dec)
        epoch_note = (
            f"position propagated to J2016.0 from fixture epoch {FIXTURE_COORDINATE_EPOCH.iso[:10]} using known proper motion"
            if was_propagated
            else "queried at the fixture position directly (no significant known proper motion)"
        )
        overlays.append(
            {
                "target_id": target["target_id"],
                "source": "Gaia DR3",
                "query": f"cone search, {GAIA_CONE_RADIUS_DEG * 3600:.0f} arcsec radius, via {GAIA_TAP_SYNC_URL} — {epoch_note}",
                "fetched_at": fetched_at,
                **result,
            }
        )
        print(f"[gaia] {target['display_name']}: {result['status']}")

    sbdb_result = fetch_sbdb(ASTEROID_TARGET["sstr"])
    overlays.append(
        {
            "target_id": ASTEROID_TARGET["target_id"],
            "source": "JPL Small-Body Database",
            "query": f"sstr={ASTEROID_TARGET['sstr']}, via {SBDB_URL}",
            "fetched_at": fetched_at,
            **sbdb_result,
        }
    )
    print(f"[sbdb] {ASTEROID_TARGET['display_name']}: {sbdb_result['status']}")

    OUTPUT_PATH.parent.mkdir(parents=True, exist_ok=True)
    OUTPUT_PATH.write_text(json.dumps(overlays, indent=2) + "\n", encoding="utf-8")
    print(f"\nWrote {OUTPUT_PATH}")


if __name__ == "__main__":
    main()
