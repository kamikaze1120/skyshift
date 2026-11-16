# Submission Checklist

Referenced from `docs/CREDITS.md`. Citations living in this repo are not enough — they must also be
pasted into the official Space Apps submission form on spaceappschallenge.org. Check each box only
after it's actually in the live submission form, not just in this repo.

## Links to paste into the submission form

- [ ] GitHub repo: <https://github.com/kamikaze1120/skyshift>
- [ ] Live demo: <https://skyshift-blue.vercel.app>
- [ ] Demo video (upload/link once recorded and posted)

## Required SPHEREx acknowledgement (paste verbatim)

> This publication makes use of data products from the Spectro-Photometer for the History of the
> Universe, Epoch of Reionization and Ices Explorer (SPHEREx), which is a joint project of the Jet
> Propulsion Laboratory and the California Institute of Technology, and is funded by the National
> Aeronautics and Space Administration.

- [ ] Pasted into the submission form's project description / citations field

## Data sources to cite (full detail in `docs/CREDITS.md`)

- [ ] SPHEREx spectral images via IRSA — DOI per release served (QR2 `10.26131/IRSA652`, DR1 images
      `10.26131/IRSA678`, DR1 cube `10.26131/IRSA679` — see `docs/DATA_RELEASES.md` for which are
      actually live)
- [ ] IRSA SIA2 / ObsTAP / Cutout Service
- [ ] NASA JPL Small-Body Database (SBDB) API
- [ ] Gaia Data Release 3 (catalog check panel — note: service was unreachable as of 2026-11-15, see
      `docs/CREDITS.md` for current status)
- [ ] SIMBAD (CDS)
- [ ] SPHEREx Explanatory Supplement (IRSA) — FLAGS bit definitions

## Open-source libraries to cite (full list in `docs/CREDITS.md`)

- [ ] Backend: FastAPI, Pydantic, Uvicorn, Astropy, astroquery, NumPy, Pillow, Requests, Babel
- [ ] Frontend: React, Three.js, @react-three/fiber, Framer Motion, Tailwind CSS, Vite, TypeScript,
      Vitest, Testing Library

## Reference tools to acknowledge (studied, not live-queried — full detail in `docs/CREDITS.md`)

- [ ] WiseView
- [ ] Backyard Worlds
- [ ] Aladin / Aladin Lite
- [ ] WISE / NEOWISE
- [ ] CSA NEOSSat
- [ ] Canadian Astronomy Data Centre (CADC)

## AI use disclosure

- [ ] Point the submission form's AI-use section at `AI_USAGE.md`, or paste its current log
- [ ] Confirm the demo video narration (AI-generated TTS) carries a visible watermark per Space Apps
      AI-use rules, and is logged in `AI_USAGE.md`

## Team

- [ ] Confirm both team members are registered on spaceappschallenge.org and joined the team page
- [ ] Confirm the Local Event's actual end time (governs over the global 11:59 PM close) — see
      `docs/RULES_COMPLIANCE.md` and `docs/DECISIONS.md`

## Final check

- [ ] License (Apache 2.0, `LICENSE`) referenced in the submission
- [ ] No personal data collected anywhere in the shipped app (flags are country-only, no accounts)
- [ ] README.md reflects the actual shipped app, not a pre-kickoff placeholder
