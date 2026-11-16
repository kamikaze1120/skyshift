import csv
import io
import time

import astropy.units as u
import numpy as np
import requests
from astropy.coordinates import SkyCoord
from astroquery.ipac.irsa import Irsa

from backend.releases import RELEASES

SIA_URL = "https://irsa.ipac.caltech.edu/SIA"


def fetch_with_retry(url, tries=6, wait=5):
    """IRSA answers 503 now and then; try again instead of failing at once."""
    for attempt in range(tries):
        try:
            r = requests.get(url, timeout=120)
            if r.ok:
                return r
        except requests.RequestException:
            pass
        if attempt < tries - 1:
            time.sleep(wait)
    return None


def rows_from_astroquery(collection, ra, dec, radius_deg):
    """Ask IRSA through astroquery; rows come back as plain strings."""
    pos = SkyCoord(ra * u.deg, dec * u.deg)
    table = Irsa.query_sia(pos=(pos, radius_deg * u.deg), collection=collection)
    rows = []
    for record in table:
        row = {}
        for name in table.colnames:
            value = record[name]
            row[name] = "" if np.ma.is_masked(value) else str(value)
        rows.append(row)
    return rows


def rows_from_requests(collection, ra, dec, radius_deg):
    """Fallback: the original direct request to the IRSA SIA service."""
    url = (
        f"{SIA_URL}?COLLECTION={collection}"
        f"&POS=CIRCLE+{ra}+{dec}+{radius_deg}&RESPONSEFORMAT=CSV"
    )
    r = fetch_with_retry(url)
    if r is None:
        return []
    return list(csv.DictReader(io.StringIO(r.text)))


def rows_for_collection(collection, ra, dec, radius_deg):
    """Try astroquery twice; if it keeps failing, use the requests fallback."""
    for attempt in range(2):
        try:
            return rows_from_astroquery(collection, ra, dec, radius_deg)
        except Exception:
            if attempt == 0:
                time.sleep(3)
    return rows_from_requests(collection, ra, dec, radius_deg)


def search_images_uncached(ra, dec, radius_deg=0.02):
    """Find every image covering (ra, dec) across all enabled releases,
    merged and sorted by observation time."""
    rows = []
    for release in RELEASES:
        if not release["enabled"]:
            continue
        for collection in release["collections"]:
            for row in rows_for_collection(collection, ra, dec, radius_deg):
                row["_release"] = release["id"]
                row["_doi"] = release["doi"]
                rows.append(row)
    rows.sort(key=lambda row: float(row["t_min"]))
    return rows


SEARCH_CACHE = {}
CACHE_SECONDS = 1800


def search_images(ra, dec, radius_deg=0.02):
    """Same as search_images_uncached, but remembers each answer for 30
    minutes so repeat requests skip the slow IRSA search."""
    key = (round(ra, 5), round(dec, 5), radius_deg)
    hit = SEARCH_CACHE.get(key)
    if hit and time.time() - hit[0] < CACHE_SECONDS:
        return [dict(row) for row in hit[1]]
    rows = search_images_uncached(ra, dec, radius_deg)
    if rows:
        SEARCH_CACHE[key] = (time.time(), rows)
    return [dict(row) for row in rows]
