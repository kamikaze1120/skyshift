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

GAIA_TAP_SYNC_URL = "https://gea.esac.esa.int/tap-server/tap/sync"
SBDB_URL = "https://ssd-api.jpl.nasa.gov/sbdb.api"
GAIA_CONE_RADIUS_DEG = 5 / 3600.0  # 5 arcsec
REQUEST_TIMEOUT_S = 20

OUTPUT_PATH = Path(__file__).resolve().parent.parent / "frontend" / "src" / "fixtures" / "catalogOverlays.json"

STAR_TARGETS = [
    {"target_id": "barnards-star-2025-2026", "display_name": "Barnard's Star", "ra_deg": 269.44634, "dec_deg": 4.76724},
    {"target_id": "rw-aurigae-2025-2026", "display_name": "RW Aurigae", "ra_deg": 76.9564535, "dec_deg": 30.4013327},
    {"target_id": "r-draconis-2025-2026", "display_name": "R Draconis", "ra_deg": 248.167472, "dec_deg": 66.7549882},
]

ASTEROID_TARGET = {"target_id": "433-eros-2025-06", "display_name": "433 Eros", "sstr": "433"}


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
        result = fetch_gaia_cone_search(target["ra_deg"], target["dec_deg"])
        overlays.append(
            {
                "target_id": target["target_id"],
                "source": "Gaia DR3",
                "query": f"cone search, {GAIA_CONE_RADIUS_DEG * 3600:.0f} arcsec radius, via {GAIA_TAP_SYNC_URL}",
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
