# Candidate Targets

Real, verified candidates for the blink-comparator gallery, found via IRSA's MOST tool (Moving Object Search Tool — see `IRSA_DATA_GUIDE.md`). Every entry here has been checked against actual SPHEREx archive matches, not just assumed.

## How these were found

MOST computes an object's ephemeris from its known orbit, then checks which SPHEREx exposures actually cover its predicted position at each epoch — no guessing required.

```
https://irsa.ipac.caltech.edu/cgi-bin/MOST/nph-most?catalog=spherex&input_type=name_input&obj_name={NAME_OR_NUMBER}&obs_begin={YYYY+MM+DD}&obs_end={YYYY+MM+DD}&output_mode=Brief
```
Returns an IPAC ASCII table: one row per matching exposure, with `ra`/`dec` of the object at that epoch, `start_date`/`end_date`, and `uri` (the archive file path — append `?center=...&size=...` per `IRSA_DATA_GUIDE.md` to pull a cutout instead of the full frame).

## Verified: 433 Eros

Queried 2026-10-02, window 2025-03-01 to 2026-10-01.

- **80 separate SPHEREx exposures** matched, spanning **2025-06-25 to 2025-07-07** (QR2, weeks 2025W26–2025W28).
- Near-Earth asteroid, well-catalogued (MPC designation A898 PA), so its ephemeris is reliable — low risk of a bad precovery match.

### Best same-day pair (story-mode hook candidate)

| | Epoch 1 | Epoch 2 |
|---|---|---|
| Date/time (UTC) | 2025-06-25 00:12:09 | 2025-06-25 08:19:18 |
| RA, Dec (deg) | 7.345405, 9.926905 | 7.482209, 10.027053 |
| Pointing | 2025W26_1A_0410_1 | 2025W26_1A_0465_1 |
| File | `ibe/data/spherex/qr2/level2/2025W26_1A/l2b-v20-2025-257/1/level2_2025W26_1A_0410_1D1_spx_l2b-v20-2025-257.fits` | `ibe/data/spherex/qr2/level2/2025W26_1A/l2b-v20-2025-257/1/level2_2025W26_1A_0465_1D1_spx_l2b-v20-2025-257.fits` |

**Computed separation:** ~604 arcsec (~10.1 arcmin) over ~8.12 hours — about **98 pixels** at SPHEREx's 6.15 arcsec/pixel scale. Comfortably visible in a single blink/swipe, and small enough (0.168°) to fit inside one cutout (max cutout size is 0.5°) centered between the two positions.

**Status:** Position/coverage confirmed via MOST. Not yet confirmed: actual visual quality of Eros in these specific frames (brightness/SNR, whether it falls near a detector edge or gap) — that requires pulling the real cutouts, which is a Phase 2/3 task, not Phase 1.

## Still to check
- At least one more candidate with a *longer* baseline (days, not hours) to show slower, more "did-you-catch-it" motion as a second story beat — contrast with Eros's fast jump.
- A main-belt asteroid (slower mover, different story) as a variety target for the curated gallery, not just NEOs.
- Run the same MOST query for 2–3 other bright, well-known asteroids (e.g., 1 Ceres, 4 Vesta, 99942 Apophis) to build out the gallery beyond one object.

## Next step
Pull the actual cutout images for the Eros pair above (`?center=7.413807,9.976979&size=0.3`, the precise midpoint between the two positions) and visually confirm the object is bright/clean enough to be the story-mode hook. This is the first real "touch the data" step — still allowed under `RULES_COMPLIANCE.md` as data exploration, not product building.
