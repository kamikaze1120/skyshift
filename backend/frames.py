import hashlib
import io
import os
import warnings

import astropy.units as u
import numpy as np
from astropy.coordinates import SkyCoord
from astropy.io import fits
from astropy.time import Time
from astropy.wcs import WCS
from PIL import Image

from backend.archive import fetch_with_retry
from schemas.models import Observation

warnings.filterwarnings("ignore")


def position_at(mjd, ra, dec, pm_ra, pm_dec):
    """Where a moving star is at a given time. Without proper motion the
    position is returned unchanged."""
    if pm_ra is None or pm_dec is None:
        return ra, dec
    c = SkyCoord(
        ra=ra * u.deg,
        dec=dec * u.deg,
        pm_ra_cosdec=pm_ra * u.mas / u.yr,
        pm_dec=pm_dec * u.mas / u.yr,
        obstime=Time("J2000"),
        frame="icrs",
    )
    p = c.apply_space_motion(new_obstime=Time(mjd, format="mjd"))
    return float(p.ra.deg), float(p.dec.deg)


def make_frame(row, ra, dec, pm_ra, pm_dec, size, frames_dir, base_url):
    """Download one cutout, read its real wavelength, save a PNG, and return
    an Observation. Returns None if anything fails."""
    try:
        mjd = float(row["t_min"])
        cra, cdec = position_at(mjd, ra, dec, pm_ra, pm_dec)
        url = f"{row['access_url']}?center={cra},{cdec}&size={size}"
        r = fetch_with_retry(url)
        if r is None:
            return None

        with fits.open(io.BytesIO(r.content)) as hdul:
            data = hdul["IMAGE"].data.astype("float64")
            spectral = WCS(hdul["IMAGE"].header, fobj=hdul, key="W")
            spectral.sip = None
            ny, nx = data.shape
            wl, bw = spectral.pixel_to_world(nx // 2, ny // 2)

        lo, hi = np.nanpercentile(data, [1, 99.5])
        scaled = np.clip((np.nan_to_num(data, nan=lo) - lo) / (hi - lo), 0, 1)
        img = Image.fromarray((scaled * 255).astype("uint8")[::-1])  # north up

        source_file = row["access_url"].split("/")[-1]
        tag = hashlib.md5(f"{cra:.5f}{cdec:.5f}{size}".encode()).hexdigest()[:8]
        png_name = source_file.replace(".fits", f"_{tag}.png")
        img.resize((nx * 4, ny * 4), Image.NEAREST).save(
            os.path.join(frames_dir, png_name)
        )

        return Observation(
            epoch=Time(mjd, format="mjd").isot,
            mjd=mjd,
            release=row["_release"],
            detector=int(row["energy_bandpassname"].split("D")[-1]),
            wavelength_um=float(wl.to_value("um")),
            bandwidth_um=float(bw.to_value("um")),
            image_url=f"{base_url}/frames/{png_name}",
            source_file=source_file,
            doi=row["_doi"],
        )
    except Exception:
        return None
