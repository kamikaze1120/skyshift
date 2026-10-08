# Security Policy

Skyshift is a volunteer project built for the 2026 NASA Space Apps Challenge. We take security seriously even at hackathon scale, especially since the shipped app will be public-facing with no login.

## Supported Versions

Pre-kickoff, this repo has no shipped application — only process/governance docs and scaffolding (see `docs/RULES_COMPLIANCE.md`). Once the app is live (post Nov 14, 2026), only the code on `main` / the deployed production build is supported with security fixes. There are no older versions to maintain.

## Reporting a Vulnerability

**Please do not open a public GitHub issue for a security vulnerability.**

Instead, report it privately:

- Email **mujtaba.mohammed720@gmail.com** with a description of the issue, steps to reproduce, and potential impact.
- Or use [GitHub's private vulnerability reporting](https://github.com/kamikaze1120/skyshift/security/advisories/new) on this repo (Security tab → "Report a vulnerability").

You should expect an acknowledgment within a few days. This is an unfunded, part-time hackathon project — there's no bug bounty and no SLA, but genuine reports will be taken seriously and fixed as fast as the team can manage.

## What's in scope

- The deployed Skyshift web app and its public API (once it exists)
- This repository's CI/CD configuration (`.github/workflows/`)
- Any data-handling code that touches SPHEREx/IRSA data or the anonymous "flag a mover" feature

## What's explicitly out of scope / already a known tradeoff

- IRSA/NASA's own infrastructure — report issues with their services to them directly, not here
- The project intentionally collects **no personal data** (no accounts, no names, no emails — see `docs/MVP_CUT_LINE.md` and `docs/CHALLENGE.md`), so there's no user-data exfiltration surface by design
- Secrets and credentials: CI already runs a gitleaks secret scan on every PR (`.github/workflows/ci.yml`) and GitHub secret scanning + push protection are enabled on the repo; if you find a leaked credential anyway, report it immediately as above
