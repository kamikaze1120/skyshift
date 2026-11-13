# MVP Cut Line

Scope discipline for a small team in a 48-hour build. Ordered by commitment level.

**Scope principle (2026-10-12): comprehensive data access is a Must-ship, not a stretch.** The product is not a fixed gallery of a handful of hand-picked objects — it's a general exploration tool backed by a live query layer (ObsTAP/`spherex.obscore`, see `docs/TEAM_CHARTER.md` Section 4) over the full SPHEREx QR2 archive. A curated set of pre-verified targets still exists, but as a fast-loading, guaranteed-to-work *entry point and demo safety net* — never as the ceiling of what a visitor can explore. "Data access" is a named judging criterion, and a tool that only shows 10 fixed objects is a materially weaker answer to it than one that lets anyone search the real archive.

**Confirmed against the official statement (2026-11-09, see `docs/CHALLENGE.md`):** the core ask is literally "user enters RA/Dec, tool shows a series of images like a little video" — this matches and validates the comprehensive-search principle above. It also names official feature suggestions worth weighing into the cut line: co-adding per-detector data for SNR, add/subtract images across epochs (differencing), adjustable field of view, and URL-embeddable coordinates. None of these were invented by us — they're straight from NASA's Potential Considerations.

| Must ship | Ship if on schedule | Cut unless ahead |
|---|---|---|
| **Live search of the full SPHEREx archive** by object name/designation or by sky coordinates/region, not a fixed list, rendered as a playable image sequence (not just a single pair) | Wavelength slider | Asteroid-catalog cross-check (flag vs. known object) |
| Blink + swipe (or play) between observations, for *any* object the search returns, not just curated ones | **Per-detector co-adding for SNR** (official suggestion; the WISE 0855 result shows single raw frames may not be enough, see `CANDIDATE_TARGETS.md`) | Gaia / WISE catalog overlay (`REFERENCE_TOOLS.md`) |
| Story intro + curated gallery of a handful of pre-verified targets (fast-loading hook, and a fallback demo if live queries are slow/down) | Adjustable field of view | Generate spectra on the fly from the DR1 all-sky cube ("extra kudos" in the official text; promote only if the 20-minute cube check in `DATA_RELEASES.md` comes back clean) |
| Source panel on every image (file, date, DOI, **release**) for curated *and* live-searched targets alike | Image differencing (add/subtract epochs) | Accounts, comments, 3D sky views |
| **URL-embeddable coordinates** (`?ra=&dec=&size=`) so any view is linkable and embeddable | Anonymous flagging + global map | |
| **Contamination flags surfaced in the UI** from the `FLAGS` extension we already parse | | |
| **Release config drives queries and citations** so a new data release is a config edit, not a code change (`DATA_RELEASES.md`) | | |


## Why three items were promoted to Must ship (2026-11-13)

All three are cheap, and each answers a named Potential Consideration that was previously only noted
in `CHALLENGE.md` and never scoped.

- **URL-embeddable coordinates.** Roughly an hour of work. NASA's own wording is that it lets users
  embed the tool in other websites and projects, which feeds the Global connection criterion
  directly. It was sitting in the same cell as image differencing, which is far more expensive.
- **Contamination flags.** We already read the `FLAGS` extension, so surfacing it is display work,
  not new plumbing. It reinforces the provenance story that is our main differentiator.
- **Release config.** This is the design answer to "new SPHEREx data is arriving fast." It also makes
  the citation list generated rather than maintained by hand, which removes the single most
  award-threatening failure mode by construction. DR1 landing on 2026-11-12, two days before kickoff,
  is the proof that the consideration is real.

## Why this order
- **Comprehensive beats curated.** The original framing ("ship a gallery of 10–20 targets, live search is a stretch") undersold the product's actual capability and the "Data access" criterion. The backend's `spherex.obscore` TAP layer already supports searching anything in the archive — gating the UI to a fixed list would be *hiding* a capability we have, not reducing risk.
- **Curated targets are a safety net, not a substitute.** IRSA can be slow, rate-limited, or down during judging. A small set of pre-verified, pre-cached targets (433 Eros confirmed so far, see `docs/CANDIDATE_TARGETS.md`) guarantees the demo opens to something working instantly — but the moment a user types a name or picks a region, they're hitting the real, comprehensive archive, not a wall.
- **Asteroids first, not stars, for the curated hook.** SPHEREx's ~6 arcsecond pixels are too coarse to show most stellar motion in a six-month blink — asteroids and comets move obviously between exposures hours/days apart. This only applies to which objects get *pre-verified and cached* for the guaranteed-fast hook; live search still returns whatever the archive has for any object a user asks about, stars included, with an honest "may not show visible motion at this resolution" caveat where relevant.
- **"Flag what moved," not "help find Planet X."** At SPHEREx's resolution the public won't discover distant planets, and overclaiming reads as implausible to judges. The honest framing — flag it, cross-check it against known objects — is a real scientific method and scores well on both Science and Innovation.
- **No accounts on the flagging map.** Space Apps forbids collecting personal information. Record country only, from the hosting platform's request location.
- **Spectra on the fly stays a stretch, deliberately.** The official text calls it "extra kudos," and
  the DR1 all-sky cube released 2026-11-12 is the plausible backend for it. It is scoped as a
  20-minute feasibility check at kickoff (`DATA_RELEASES.md`), not as planned work. If the cube
  answers quickly, it is the single highest-scoring stretch available.
