# Decision Record

Template: **Date — Decision — Why — Alternatives considered**

Log every decision here that changes scope, architecture, or the plan. This is the project's memory for teammates joining later.

---

## 2026-09-16 — Chose "Planet X and SPHEREx" as the challenge
**Why:** Fits an "unfair advantage" strategy — data-access and storytelling angle. Advanced difficulty, public web tool.
**Alternatives considered:** City Earth-observation dashboard, NASA knowledge engine (RAG), Artemis/Moon site explorer, space weather alerts, Mars habitat planner.

## 2026-09-21 — Repo scaffold created before kickoff
**Why:** Rules allow setting up team/repo/process now; building product code must wait for Nov 14 kickoff.
**Alternatives considered:** Wait entirely until kickoff to touch GitHub — rejected, since process setup (CI, contributing rules, docs) isn't product code and removes day-1 friction.

## 2026-09-22 — Locked the 8 judging criteria as the project's foundation
**Why:** Every feature must earn its place against these criteria; prevents scope drift once the team grows.
**Alternatives considered:** None — these are Space Apps' fixed judging criteria, not a team choice.

## 2026-09-22 — Removed hardware from the build entirely
**Why:** An earlier "Satellite vs. Street" concept (ESP32 + air-quality sensor) didn't move any of the 8 judging criteria for the SPHEREx challenge and risked eating hours from storytelling/craft. Software-only fits this specific challenge.
**Alternatives considered:** Keep hardware as a stretch add-on — rejected once the SPHEREx challenge (vs. the earlier city-dashboard idea) was locked in, since hardware has no natural fit here.

## 2026-09-22 — Reframed "Planet X" hook as "flag anything that moved," not "help find Planet X"
**Why:** At SPHEREx's ~6 arcsecond resolution, the public can't realistically discover distant planets — overclaiming reads as implausible to judges. Honest framing (flag it, cross-check against known objects) is a real scientific method.
**Alternatives considered:** Keep the "help find Planet X" framing as the headline pitch — rejected as an overclaim risk to the Plausibility criterion.

## 2026-09-22 — MVP leads with asteroids, not stars
**Why:** Stars barely move within SPHEREx's pixel resolution over six months; asteroids/comets move obviously between exposures hours/days apart and make a reliable demo.
**Alternatives considered:** Lead with stellar/brown-dwarf motion as the hook — rejected as too fragile for a live demo.

## 2026-10-02 — Worked through IRSA's SPHEREx tutorial, documented the real data access pattern
**Why:** The tutorial's own terminology (MEF extensions, spectral WCS, SIA2 vs. cutout service) wasn't self-explanatory. Pulled IRSA's actual docs to ground the data contract in confirmed facts rather than guesses — added `docs/IRSA_DATA_GUIDE.md` and resolved the open questions in `DATA_CONTRACT.md` (query pattern, pixel scale 6.15 arcsec/px, wavelength-per-pixel handling).
**Alternatives considered:** None — this was fact-finding, not a design choice. Still open: whether any specific candidate asteroid actually has 2+ usable SPHEREx epochs. IRSA's own example proved repeat coverage exists for at least one fixed object (84 epochs for a test galaxy), not for a mover we've picked.

## 2026-10-02 — Verified first real candidate target: 433 Eros has confirmed repeat SPHEREx coverage
**Why:** `DATA_CONTRACT.md`'s last open question was whether any specific asteroid actually has 2+ usable SPHEREx epochs — IRSA's own cutout tutorial only proved repeat coverage for a fixed galaxy, not a mover. Queried IRSA's MOST tool (`catalog=spherex`) directly for 433 Eros and got 80 real matched exposures between 2025-06-25 and 2025-07-07. A same-day pair (00:12 and 08:19 on 2025-06-25) shows ~604 arcsec (~98 pixels) of motion in ~8 hours — a clearly visible, dramatic blink, and small enough to fit one cutout. Logged in `docs/CANDIDATE_TARGETS.md`.
**Alternatives considered:** Could have picked a main-belt asteroid instead — slower, more subtle motion, less visually dramatic for a first hook. Eros (NEO) wins for the story-mode "wow" moment; a slower mover is still worth finding as a second gallery entry for variety.
