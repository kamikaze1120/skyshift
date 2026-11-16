import csv
import io
import time

import requests

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


def search_images(ra, dec, radius_deg=0.02):
    """Find every image covering (ra, dec) across all enabled releases,
    merged and sorted by observation time."""
    rows = []
    for release in RELEASES:
        if not release["enabled"]:
            continue
        for collection in release["collections"]:
            url = (
                f"{SIA_URL}?COLLECTION={collection}"
                f"&POS=CIRCLE+{ra}+{dec}+{radius_deg}&RESPONSEFORMAT=CSV"
            )
            r = fetch_with_retry(url)
            if r is None:
                continue
            for row in csv.DictReader(io.StringIO(r.text)):
                row["_release"] = release["id"]
                row["_doi"] = release["doi"]
                rows.append(row)
    rows.sort(key=lambda row: float(row["t_min"]))
    return rows
