# Contributing to Skyshift

This is a small team working in parallel for one weekend. These rules exist so nobody overwrites anyone else's work.

## Before Nov 14, 2026, 9:00 AM
Space Apps asks teams to start the actual work at kickoff. Until then this repo only grows: docs, process files, CI, and non-product scaffolding (see `docs/RULES_COMPLIANCE.md`). Do not add application/product code before kickoff.

## Workflow
1. **Claim an issue before coding.** Each person owns a "lane" of the codebase — pick an open issue, assign yourself, comment your plan.
2. **One issue, one branch, one small PR.** Branch names: `<role>/<short-description>` (e.g. `frontend/blink-viewer`).
3. **Rebase on `main`; never merge `main` into your branch.** Keep history linear.
4. **Force-push only with `--force-with-lease`, and only on your own branch.** Never force-push a shared branch.
5. **Shared files change in tiny, fast PRs.** `package.json`, lockfiles, and CI config are high-conflict — touch them in isolated, quickly-reviewed PRs.
6. **Lockfile conflicts are regenerated, never hand-edited.** Delete and reinstall, then commit the regenerated file.
7. **Squash-merge only.** Merged branches auto-delete.

## Pull requests
- Requires 1 approval and a passing CI run before merge.
- PR titles follow [Conventional Commits](https://www.conventionalcommits.org/) (`feat:`, `fix:`, `docs:`, `chore:`, …) — CI checks this.
- Link the issue the PR closes.
- If the PR touches AI-generated code or copy, note it and update `AI_USAGE.md`.

## CI checks on every PR
- Secret scan (gitleaks) — no credentials, tokens, or API keys committed, ever.
- Blocks files over 5 MB and raw `.fits`/`.FITS` files (convert to web images before committing).
- PR title format check.

## Data & science integrity
- Every image or data point shown in the app must trace to a real SPHEREx/IRSA source file — cite it (file ID, observation date, DOI) in a source panel.
- No AI-generated or fabricated sky imagery or data, ever. See `docs/JUDGING_CRITERIA.md` (Innovation criterion).
- Cite every data source and third-party library in `docs/CREDITS.md` — Space Apps revokes award status for missing citations.

## Roles
See `docs/TEAM_ROLES.md` for open slots and who owns what.
