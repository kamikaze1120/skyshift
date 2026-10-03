# IRSA / SPHEREx Data Guide

Plain-language notes on what IRSA's "Introduction to SPHEREx Spectral Images" tutorial actually teaches, and how it maps to this project. Source: [IRSA Tutorials — Introduction to SPHEREx Spectral Images](https://caltech-ipac.github.io/irsa-tutorials/spherex-intro/), [SPHEREx Data Access](https://caltech-ipac.github.io/spherex-archive-documentation/spherex-data-access/), [Download a collection of SPHEREx cutouts](https://caltech-ipac.github.io/irsa-tutorials/spherex-cutouts/), [SPHEREx Cutout Tool](https://irsa.ipac.caltech.edu/data/SPHEREx/docs/cutout_tool.html).

## What a SPHEREx file is

Each observation is a multi-extension FITS (MEF) file — one file, six layers:

| Extension | Contents |
|---|---|
| `IMAGE` | Calibrated flux (MJy/sr) — the actual picture |
| `FLAGS` | Per-pixel bitmap of bad/hot/transient pixels |
| `VARIANCE` | Per-pixel noise estimate |
| `ZODI` | Modeled zodiacal dust background — **not** subtracted from `IMAGE` already |
| `PSF` | 121 point-spread-function samples (101×101px, 10x oversampled) |
| `WCS-WAVE` | Lookup table mapping pixel coordinates to wavelength + bandwidth |

**The thing that trips people up:** wavelength isn't one value per image. SPHEREx uses Linear Variable Filters, so wavelength changes *across* a single detector frame. The file has three coordinate systems in its header — a normal sky WCS, a pixel WCS (`WCSNAMEA`), and a spectral WCS (`WCSNAMEW`) that you query to get the actual wavelength at a given pixel.

## How to get data for one target

1. **Find candidate images** — query by sky position, not by browsing files:
   ```python
   from astroquery.ipac.irsa import Irsa
   from astropy.coordinates import SkyCoord
   coord = SkyCoord(ra_deg, dec_deg, unit='deg')
   results = Irsa.query_sia(pos=(coord, search_radius), collection='spherex_qr2')
   ```
   Collections: `spherex_qr2`, `spherex_qr2_deep`, `spherex_qr3`, `spherex_qr3_deep`. Results include `access_url` and observation date — not the image data itself.

2. **Pull a cutout, not the full file** — append center/size to any `access_url`:
   ```
   https://irsa.ipac.caltech.edu/ibe/data/spherex/qr/level2/.../some_file.fits?center=156.09328159,-41.64466331&size=0.1
   ```
   `size` is in degrees (0.01–0.5 range). This is what keeps the app fast — nobody downloads a full 2048×2048 detector frame per target.

3. **Open with astropy, read the wavelength:**
   ```python
   from astropy.io import fits
   from astropy.wcs import WCS
   hdulist = fits.open(cutout_url)
   spectral_wcs = WCS(header=hdulist["IMAGE"].header, fobj=hdulist, key="W")
   wavelength, bandwidth = spectral_wcs.pixel_to_world(x, y)
   ```

4. **For multiple epochs of the same target**, IRSA's own multi-epoch tutorial uses a TAP SQL query instead of SIA2 — returns all overlapping observations sorted by date in one call, rather than paging through SIA2 results. Their worked example (a fixed galaxy, not a mover) returned **84 separate observations** of one sky position. That confirms repeat coverage exists for at least some fields — it does **not** confirm any specific asteroid we pick will have 2+ usable epochs. That still needs to be checked per-target.

## Hard numbers worth keeping straight
- **Pixel scale: ~6.15 arcsec/pixel.** This is the number behind the "stars barely move" risk in `MVP_CUT_LINE.md` — anything shifting less than ~half a pixel (~3 arcsec) between epochs isn't a credible on-screen "it moved."
- **Detector frames are 2048×2048 pixels**, across 6 detectors per exposure, covering 0.75–5.0 μm.

## What this means for our build
- Lead with **asteroids/comets**, not stars — their motion between exposures hours/days apart is large compared to the pixel scale; stellar motion over 6 months mostly isn't.
- The data contract (`DATA_CONTRACT.md`) `observations[]` array maps directly onto SIA2/cutout query rows: `source_file`/`doi` ↔ the file's own metadata, `wavelength_band` ↔ the spectral-WCS lookup, `image_url` ↔ a cutout URL converted to a web-friendly format ahead of time (never ship a raw FITS file — also blocked by CI).
- Next concrete step: pick one or two real candidate targets (known near-Earth asteroids with a plausible SPHEREx pass) and actually run the SIA2/TAP query against them to see if 2+ usable epochs exist. That's the one unresolved question blocking the rest of the plan — see `DECISIONS.md` and `PLAN.md`.
