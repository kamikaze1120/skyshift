# Credits & Citations

Space Apps requires every data source and third-party library to be cited. NASA reserves the right to
remove awards from teams that do not cite the resources they used, including open source ones. Add a
row here the moment a new source or dependency is introduced; don't wait until submission day.

Citations also go in the submission form itself, not only in this repo. See `SUBMISSION_CHECKLIST.md`.

## SPHEREx data: required citation

Cite the DOI of every release the tool actually serves. Full registry and collection names in
`DATA_RELEASES.md`.

| Release | DOI | Cite when |
|---|---|---|
| QR2 Spectral Images | 10.26131/IRSA652 | Any QR2 frame is shown. Our verified 433 Eros pair is QR2 |
| QR3 Spectral Images | 10.26131/IRSA662 | Any observation after 2026-07-20 |
| DR1 Spectral Images | 10.26131/IRSA678 | If we adopt DR1 as the baseline |
| DR1 Spectral All Sky Cube | 10.26131/IRSA679 | If the cube backs the on the fly spectra feature |
| QR1 Spectral Images | 10.26131/IRSA629 | Retired Feb 2026. Reference only, do not serve |

**Required acknowledgement text, verbatim, in the README and on the About page:**

> This publication makes use of data products from the Spectro-Photometer for the History of the
> Universe, Epoch of Reionization and Ices Explorer (SPHEREx), which is a joint project of the Jet
> Propulsion Laboratory and the California Institute of Technology, and is funded by the National
> Aeronautics and Space Administration.

Also follow the IRSA acknowledgement guidelines (<https://irsa.ipac.caltech.edu/ack.html>) and the
IRSA data use terms (<https://irsa.ipac.caltech.edu/data_use_terms.html>).

**The citation list is generated from the release config**, so a release cannot reach production
without its DOI reaching the About page. See `DATA_RELEASES.md`.

## Data sources

| Source | What we use it for | Citation / link |
|---|---|---|
| NASA SPHEREx spectral images, served by IRSA | Core sky imagery, every frame in the viewer | DOI per release, table above |
| IRSA (IPAC/Caltech) SIA2, ObsTAP and Cutout Service | Image discovery and cutouts | <https://irsa.ipac.caltech.edu/Missions/spherex.html> |
| IRSA MOST (Moving Object Search Tool) | Finding which exposures cover a solar system object at each epoch | <https://irsa.ipac.caltech.edu/applications/MOST/> |
| SPHEREx tutorial notebooks | Access patterns, WCS and cutout handling | <https://caltech-ipac.github.io/irsa-tutorials/spherex/> |
| Gaia Data Release 3 | Catalog overlay ("Catalog check" panel): cone search near each star target, telling a known catalogued star from something that moved. Fetched once via `scripts/fetch_catalog_overlays.py` into `frontend/src/fixtures/catalogOverlays.json`, not queried live by the running app. As of the 2026-11-15 run, the TAP service (`gea.esac.esa.int`) was unreachable from the build machine — re-run the script from an unrestricted network before the demo to backfill real matches | <https://gea.esac.esa.int/archive/> |
| NASA JPL Small-Body Database (SBDB) API | Catalog check for 433 Eros: real discovery record and orbit class, fetched the same way as Gaia above. Confirmed working 2026-11-15 | <https://ssd-api.jpl.nasa.gov/doc/sbdb.html> |
| SIMBAD (CDS) | Resolving object names and proper motions | <https://simbad.cds.unistra.fr/simbad/> |

## Reference tools and inspiration

Cite these even where we only studied them, or where we deliberately decided not to build a live integration. See `REFERENCE_TOOLS.md` for what we took from each.

| Tool | Why it is listed |
|---|---|
| WiseView (<http://byw.tools/wiseview>) | NASA offered it as a model for this challenge. Studied for interaction design |
| Backyard Worlds (<http://backyardworlds.org/>) | Named in the official background as the public discovery precedent |
| Aladin / Aladin Lite (CDS) | Officially suggested viewer, evaluated against a hand built viewer |
| WISE / NEOWISE | Context only: WISE is the mission behind WiseView and Backyard Worlds, and WISE 0855 (one of our test targets) is itself a WISE discovery. No WISE catalog data is queried by this app |
| CSA NEOSSat (<https://www.asc-csa.gc.ca/eng/satellites/neossat/>) | Partner resource adjacent to our 433 Eros work. We studied it but did not build a live cross-check — NEOSSat's own exposure logs may not cover Eros at our observation epochs, so we chose not to claim a cross-check we hadn't actually run |
| Canadian Astronomy Data Centre (CADC) (<https://www.cadc-ccda.hia-iha.nrc-cnrc.gc.ca/en/>) | Same as NEOSSat above: studied as the archive that hosts NEOSSat data, not queried live |

## Libraries & tools

| Library/tool | Purpose | License |
|---|---|---|
| Astropy | FITS, WCS, coordinates, proper motion propagation | BSD 3-Clause |
| astroquery | IRSA SIA2 queries | BSD 3-Clause |
| FastAPI | Backend web API | MIT |
| Pydantic | Data contract / validation models | MIT |
| Uvicorn | Server that runs the API | BSD 3-Clause |
| NumPy | Array handling for image data | BSD 3-Clause (bundled components: 0BSD, MIT, Zlib, CC0-1.0) |
| Pillow | Converting image data to PNG | MIT-CMU |
| Requests | HTTP requests to IRSA | Apache 2.0 |
| Babel | Converting country codes to country names for the flag tally | BSD 3-Clause |
| *(populate the rest as the build starts: framework, viewer, plotting, server)* | | |

## AI tools
See `../AI_USAGE.md` for the AI-assistance disclosure log.
