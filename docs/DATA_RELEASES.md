# SPHEREx Data Releases

NASA's first Potential Consideration is literally *"New SPHEREx data is arriving fast! Make sure to
design a tool that's easy to update with the latest data releases."* This file is how we answer it.

**Verified 2026-11-13.** IRSA publishes new spectral images weekly, so re-check this table at kickoff.

## Release registry

| Release | What it is | Time span | Collections | DOI | Status |
|---|---|---|---|---|---|
| QR1 | First quick release | from 2025-07 | n/a | 10.26131/IRSA629 | **Retired Feb 2026**, no longer served by IRSA |
| QR2 | Quick release, improved calibration | 2025-04-24 to 2026-07-20 | `spherex_qr2`, `spherex_qr2_deep` | 10.26131/IRSA652 | Available |
| QR3 | Quick release, pipeline R7 | 2026-07-20 onward | `spherex_qr3`, `spherex_qr3_deep` | 10.26131/IRSA662 | Available since Sep 2026 |
| DR1 | Reprocessed spectral images | first survey years | *(confirm at kickoff)* | 10.26131/IRSA678 | **Released 2026-11-12** |
| DR1 cube | Spectral all sky cube, 102 nominal bands | first survey years | *(confirm at kickoff)* | 10.26131/IRSA679 | **Released 2026-11-12** |

## Two facts that change how we query

1. **QR2 and QR3 are consecutive time slices, not reprocessings of the same data.** Any timeline that
   spans the mission has to query both. A query against `spherex_qr2` alone stops in July 2026.
   Our verified 433 Eros pair (2025-06-25) is QR2. Our WISE 0855 coverage check spanned 373 days and
   therefore likely crossed the QR2 and QR3 boundary already.
2. **DR1 reprocesses the QR2 era to be uniformly processed with QR3.** So DR1 plus QR3 is the clean
   pair for a mission spanning timeline, and QR2 plus QR3 is the fallback.

The SPHEREx team advises caution when combining releases processed with different calibrations. If we
mix QR2 and QR3 in one sequence, say so in the UI rather than hiding it.

## Decision: baseline

**Primary:** DR1 plus QR3. **Fallback:** QR2 plus QR3, with an on screen note about the calibration
boundary. Athena confirms which responds correctly on Saturday morning and records the result in
`DECISIONS.md`. Both paths use the same code, because the release name is just config.

DR1 arrived the day before kickoff, so its collection names and SIA2 behavior are unverified by us.
Do not block the build on it: query what answers, and label what you used.

## The all sky cube

DR1 includes a cube covering the 102 nominal bands. The earlier charter assumed no cube would exist
by November, and that assumption is now wrong. A cube is far friendlier to a web tool than per
exposure FITS for anything spectral.

**Timebox: 20 minutes on Saturday morning** to answer one question. Can we pull a spectrum at a
coordinate from the cube faster than by assembling it from spectral images? If yes, it becomes the
backend for "generate spectra on the fly." If unclear in 20 minutes, drop it and move on.

## How the tool stays easy to update

This is the design answer to the consideration, and it is three rules, not a feature:

1. **No release name is ever hardcoded.** Collections, date ranges, and DOIs live in one config
   object loaded at startup. Adding a release is a config edit and a redeploy, not a code change.
   Proposed shape, to be implemented at kickoff:

   ```json
   {
     "releases": [
       {
         "id": "qr3",
         "label": "Quick Release 3",
         "collections": ["spherex_qr3", "spherex_qr3_deep"],
         "starts": "2026-07-20",
         "ends": null,
         "doi": "10.26131/IRSA662",
         "enabled": true
       }
     ]
   }
   ```

2. **Queries fan out across every enabled release and merge by observation time.** The UI shows one
   timeline. The release each frame came from travels with the frame and appears in the source panel.
3. **The citation list is generated from the same config**, so a new release cannot be added without
   its DOI appearing on the About page. This closes the single most award threatening gap by
   construction instead of by discipline.

**Demo line worth using:** a new release landed 48 hours before kickoff, and adding it was a config
entry. That is the consideration answered out loud.

## Open items for kickoff

- [ ] Confirm the DR1 collection names and their SIA2 behavior
- [ ] Decide whether the verified Eros pair stays on QR2 or moves to reprocessed DR1 files
- [ ] Confirm whether the WISE 0855 and Barnard's Star checks crossed the QR2 and QR3 boundary
- [ ] Re-check this table against the archive, since releases ship weekly
