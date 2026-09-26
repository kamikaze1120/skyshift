# MVP Cut Line

Scope discipline for a small team in a 48-hour build. Ordered by commitment level.

| Must ship | Ship if on schedule | Cut unless ahead |
|---|---|---|
| Story intro on one real asteroid | Search by name or coordinates (live) | Asteroid-catalog cross-check (flag vs. known object) |
| Blink + swipe between two observations | Wavelength slider | Accounts, comments |
| Curated gallery of 10–20 verified targets | Anonymous flagging + global map | 3D sky views |
| Source panel on every image (file, date, DOI) | | |

## Why this order
- **Asteroids first, not stars.** SPHEREx's ~6 arcsecond pixels are too coarse to show most stellar motion in a six-month blink — asteroids and comets move obviously between exposures hours/days apart. Verified stellar cases can be shown as a bonus, not the headline.
- **Precomputed demo data, not live queries only.** IRSA can be slow, rate-limited, or down during judging. A curated set of 10–20 targets, converted to small web images with full source metadata ahead of time, is what the story and demo run on. Live search is a secondary feature layered on top once the core works.
- **"Flag what moved," not "help find Planet X."** At SPHEREx's resolution the public won't discover distant planets, and overclaiming reads as un-plausible to judges. The honest framing — flag it, cross-check it against known objects — is a real scientific method and scores well on both Science and Innovation.
- **No accounts on the flagging map.** Space Apps forbids collecting personal information. Record country only, from the hosting platform's request location.
