# MVP Cut Line

Scope discipline for a small team in a 48-hour build. Ordered by commitment level.

**Scope principle (2026-10-12): comprehensive data access is a Must-ship, not a stretch.** The product is not a fixed gallery of a handful of hand-picked objects — it's a general exploration tool backed by a live query layer (ObsTAP/`spherex.obscore`, see `docs/TEAM_CHARTER.md` Section 4) over the full SPHEREx QR2 archive. A curated set of pre-verified targets still exists, but as a fast-loading, guaranteed-to-work *entry point and demo safety net* — never as the ceiling of what a visitor can explore. "Data access" is a named judging criterion, and a tool that only shows 10 fixed objects is a materially weaker answer to it than one that lets anyone search the real archive.

| Must ship | Ship if on schedule | Cut unless ahead |
|---|---|---|
| **Live search of the full SPHEREx archive** — by object name/designation or by sky coordinates/region, not a fixed list | Wavelength slider | Asteroid-catalog cross-check (flag vs. known object) |
| Blink + swipe between two observations, for *any* object the search returns, not just curated ones | Anonymous flagging + global map | Accounts, comments |
| Story intro + curated gallery of a handful of pre-verified targets (fast-loading hook, and a fallback demo if live queries are slow/down) | | 3D sky views |
| Source panel on every image (file, date, DOI) — for curated *and* live-searched targets alike | | |

## Why this order
- **Comprehensive beats curated.** The original framing ("ship a gallery of 10–20 targets, live search is a stretch") undersold the product's actual capability and the "Data access" criterion. The backend's `spherex.obscore` TAP layer already supports searching anything in the archive — gating the UI to a fixed list would be *hiding* a capability we have, not reducing risk.
- **Curated targets are a safety net, not a substitute.** IRSA can be slow, rate-limited, or down during judging. A small set of pre-verified, pre-cached targets (433 Eros confirmed so far, see `docs/CANDIDATE_TARGETS.md`) guarantees the demo opens to something working instantly — but the moment a user types a name or picks a region, they're hitting the real, comprehensive archive, not a wall.
- **Asteroids first, not stars, for the curated hook.** SPHEREx's ~6 arcsecond pixels are too coarse to show most stellar motion in a six-month blink — asteroids and comets move obviously between exposures hours/days apart. This only applies to which objects get *pre-verified and cached* for the guaranteed-fast hook; live search still returns whatever the archive has for any object a user asks about, stars included, with an honest "may not show visible motion at this resolution" caveat where relevant.
- **"Flag what moved," not "help find Planet X."** At SPHEREx's resolution the public won't discover distant planets, and overclaiming reads as implausible to judges. The honest framing — flag it, cross-check it against known objects — is a real scientific method and scores well on both Science and Innovation.
- **No accounts on the flagging map.** Space Apps forbids collecting personal information. Record country only, from the hosting platform's request location.
