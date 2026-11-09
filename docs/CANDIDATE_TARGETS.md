# Candidate Targets

Real, verified candidates for the **curated hook/fallback gallery only** — found via IRSA's MOST tool (Moving Object Search Tool — see `IRSA_DATA_GUIDE.md`). Every entry here has been checked against actual SPHEREx archive matches, not just assumed.

**This list is not the product's scope.** Per `docs/MVP_CUT_LINE.md` (updated 2026-10-12), the app's core capability is live, comprehensive search over the full SPHEREx archive via ObsTAP/`spherex.obscore` — anyone can look up any object or region, not just what's listed here. These entries exist purely as a fast-loading, pre-verified entry point and a fallback if live queries are slow or IRSA is down during judging. Don't scope the build around "support these N targets" — scope it around "the search works for anything, and these are cached for speed/reliability."

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

**Status: visually confirmed (2026-10-02).** Pulled both real cutouts (`?center=7.413807,9.976979&size=0.3`) and opened the `IMAGE` extension with astropy. Eros is a clean, obvious point source in both frames — not near a detector edge or gap, not confused with a background star:

| | Epoch 1 | Epoch 2 |
|---|---|---|
| Predicted pixel | (133.8, 77.2) | (39.3, 97.4) |
| Peak flux near predicted position | 10.39 | 10.02 |
| Local background | 0.38 | 0.37 |
| Local noise (std) | 0.42 | 0.35 |
| **Peak SNR** | **~23.7** | **~27.4** |

(SNR computed from a local 36×36px background box around the predicted position, not the whole-frame stddev — the frame contains two bright stars that would otherwise skew a naive noise estimate.) The detected peak sits 1–2 pixels from the MOST-predicted position in both frames, which is expected ephemeris/WCS rounding at this scale, not a misidentification — the same two background stars (including a bright close double, bottom-right of the full cutout) hold fixed pixel positions across both frames while the circled source clearly jumps, confirming it's the moving object and not noise.

Full-frame comparison and zoomed-in crops:

![Eros full-frame blink comparison, epoch 1 vs epoch 2](assets/eros_blink_comparison.png)
![Eros zoomed detection, epoch 1 vs epoch 2](assets/eros_zoom.png)

**This is a confirmed, demo-ready target.** It resolves the project's single biggest open risk (`PLAN.md`): a real asteroid, real SPHEREx data, real visible motion, real SNR — all grounded, nothing simulated.

## NASA's own named test targets — higher priority than our self-picked ones

The full challenge statement (read 2026-11-09, see `CHALLENGE.md`) names five specific targets to test against: **Barnard's Star, Epsilon Indi B, WISE 0855, RW Aurigae, R Draconis.** None are solar-system objects, so they can't be found via MOST (which computes orbits) — they need a direct SIA2/ObsTAP coordinate query instead, same pattern documented in `IRSA_DATA_GUIDE.md`.

These matter more than our own curated picks for one reason: **judges will likely test these exact five.** Treat verifying the app against them as higher priority than expanding the Eros-style gallery.

### WISE 0855 — coverage confirmed, visibility NOT confirmed (checked 2026-11-09)

- Coordinates from the challenge page: RA 08h55m10.831s, Dec -7d14m42.53s → decimal (133.795129, -7.245147).
- Query: `https://irsa.ipac.caltech.edu/SIA?COLLECTION=spherex_qr2&POS=CIRCLE+133.795129+-7.245147+0.01&RESPONSEFORMAT=CSV`
- **256 exposures, 129 distinct epochs**, spanning MJD 60800.7 → 61174.3 (2025-05-07 to 2026-05-16, a 373.6-day baseline).
- Pulled real cutouts for the earliest (`2025W19_1B_0116_1`, detector D6) and latest (`2026W20_1A_1166_1`, detector D2) epochs. **No clear point source visible at the predicted pixel in either frame** — see `assets/wise0855_comparison.png`. This is a real, un-glossed result, not a success.
- **Why this probably happened:** WISE 0855 is one of the coldest, faintest known brown dwarfs (~250K) — notoriously hard to detect even for dedicated surveys. A single raw exposure in one detector band may simply be below SPHEREx's single-frame sensitivity for it. This directly matches the challenge page's own hint: *"it may make sense to separately add together all the data taken by each of the six detector arrays to improve the signal-to-noise."* Co-adding (stacking) is likely required to show this specific target, not optional polish.
- **Risk flag:** if the app can only show single raw frames, the official demo target most likely to embarrass the tool in front of judges is this one. Co-adding/stacking should move up in priority accordingly.

### Not yet checked
- **Barnard's Star** — highest proper-motion star known (~10.3 arcsec/year); likely to show *borderline* motion over a long baseline, similar risk profile to the "stars barely move" caveat already in `MVP_CUT_LINE.md`.
- **Epsilon Indi B** — brown dwarf binary; check both components resolve separately at SPHEREx's 6.15 arcsec/pixel scale, or whether they blend into one source.
- **RW Aurigae, R Draconis** — variable stars; these test the *brightness-over-time* dimension, not position. Need a light-curve view (flux vs. epoch at a fixed position), not a blink/swipe — worth confirming the API contract's `/timeseries` endpoint (issue #11 on the project board) actually covers this case, not just moving-object position tracking.

## Our own curated gallery — lower priority, still useful for the hook

- At least one more candidate with a *longer* baseline (days, not hours) to show slower, more "did-you-catch-it" motion as a second story beat — contrast with Eros's fast jump.
- A main-belt asteroid (slower mover, different story) as a variety target for the curated gallery, not just NEOs.
- Run the same MOST query for 2–3 other bright, well-known asteroids (e.g., 1 Ceres, 4 Vesta, 99942 Apophis) to build out the gallery beyond one object.
- Proper astrometric centroiding (fit the PSF, don't just trust the predicted pixel) once this moves into Phase 3 build work — the 1–2px offset is fine for a demo check, not for shipped precision.
