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
