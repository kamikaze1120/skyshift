# Skyshift

A public web tool for the 2026 NASA Space Apps Challenge — **"Planet X and SPHEREx"** — that lets anyone see how the sky, as mapped by NASA's SPHEREx mission, changes over time.

> **Status: pre-kickoff.** This repo currently holds process/governance docs only — no application code. Space Apps rules ask teams not to start building the actual solution before kickoff (Nov 14, 2026, 9:00 AM). See [`docs/RULES_COMPLIANCE.md`](docs/RULES_COMPLIANCE.md).

## The challenge

Since 2025, NASA's SPHEREx mission has mapped the entire sky every six months in 102 bands of near-infrared light, imaging more than a billion objects. Comets, asteroids, stars, brown dwarfs, and even new planets reveal themselves by shifting position between images — but no one person can sift through all that data alone.

**Our job:** a public-facing web tool that makes it easy for anyone to see how the sky changes over time.

Full breakdown: [`docs/CHALLENGE.md`](docs/CHALLENGE.md)

## Judging criteria

Everything built here is judged on eight criteria, and every design decision should trace back to at least one of them. Full text: [`docs/JUDGING_CRITERIA.md`](docs/JUDGING_CRITERIA.md).

Science · Data access · Innovation (no hallucinations) · Impact · Plausibility · Storytelling · Global connection · Craft

## The concept

A "planet hunters' blink comparator": a curated real mover (asteroid first — stars barely shift at SPHEREx's resolution) blinks between two real SPHEREx observations, with every image traced to its source file, date, and DOI. Visitors can flag anything that moved; flags land on a shared, anonymous, country-level world map.

MVP scope: [`docs/MVP_CUT_LINE.md`](docs/MVP_CUT_LINE.md)

## Team

Solo lead so far, team open to local participants. Roles and open slots: [`docs/TEAM_ROLES.md`](docs/TEAM_ROLES.md)

## Plan

Three-phase plan from now through the Nov 14–15 build weekend, with kill criteria: [`docs/PLAN.md`](docs/PLAN.md)

## Data

Data contract teammates build against once real data is flowing: [`docs/DATA_CONTRACT.md`](docs/DATA_CONTRACT.md). Plain-language guide to the actual SPHEREx/IRSA file format and how to query it: [`docs/IRSA_DATA_GUIDE.md`](docs/IRSA_DATA_GUIDE.md). Real, verified candidate targets found so far: [`docs/CANDIDATE_TARGETS.md`](docs/CANDIDATE_TARGETS.md)

## Contributing

Read [`CONTRIBUTING.md`](CONTRIBUTING.md) before opening a branch — it's the workflow that keeps a small team from overwriting each other's changes.

## AI use disclosure

This project uses AI tools (Claude) to accelerate planning and, later, development, per Space Apps' AI-use rules. Ongoing disclosure log: [`AI_USAGE.md`](AI_USAGE.md).

## License

Apache 2.0 — see [`LICENSE`](LICENSE). All data sources and third-party libraries must be cited; see [`docs/CREDITS.md`](docs/CREDITS.md).
