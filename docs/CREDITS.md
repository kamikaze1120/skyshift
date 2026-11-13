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
| Gaia Data Release 3 (via MAST) | Catalog overlay, telling a known star from a mover | <https://archive.stsci.edu/missions-and-data/gaia> |
| WISE / NEOWISE | Overlay comparison, and context for the WISE 0855 test target | *(add specific archive endpoint if used)* |
| NASA JPL small body catalog | Cross check: known object vs unexplained | *(add specific catalog/API once selected)* |
| CSA NEOSSat | Independent near Earth object tracking, named in the cross check method | <https://data.asc-csa.gc.ca/dataset/neossat> |
| Canadian Astronomy Data Centre (CADC) | Partner archive, if used | <https://www.cadc-ccda.hia-iha.nrc-cnrc.gc.ca/en/> |
| SIMBAD (CDS) | Resolving object names and proper motions | <https://simbad.cds.unistra.fr/simbad/> |

## Reference tools and inspiration

Cite these even where we only studied them. See `REFERENCE_TOOLS.md` for what we took from each.

| Tool | Why it is listed |
|---|---|
| WiseView (<http://byw.tools/wiseview>) | NASA offered it as a model for this challenge. Studied for interaction design |
| Backyard Worlds (<http://backyardworlds.org/>) | Named in the official background as the public discovery precedent |
| Aladin / Aladin Lite (CDS) | Officially suggested viewer, evaluated against a hand built viewer |

## Libraries & tools

| Library/tool | Purpose | License |
|---|---|---|
| Astropy | FITS, WCS, coordinates, proper motion propagation | BSD 3-Clause |
| astroquery | IRSA SIA2 queries | BSD 3-Clause |
| *(populate the rest as the build starts: framework, viewer, plotting, server)* | | |

## AI tools
See `../AI_USAGE.md` for the AI-assistance disclosure log.
