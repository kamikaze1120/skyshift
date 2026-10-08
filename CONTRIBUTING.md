# Contributing to Skyshift

This is a small team working in parallel for one weekend. These rules exist so nobody overwrites anyone else's work. By participating, you're expected to follow our [Code of Conduct](CODE_OF_CONDUCT.md).

For the full architecture, ownership split, and working agreement, `docs/TEAM_CHARTER.md` is the authoritative source — this file is the short, practical version of its Section 7 ("Working rules during the hackathon").

## Before Nov 14, 2026, 9:00 AM
Space Apps asks teams to start the actual work at kickoff. Until then this repo only grows: docs, process files, CI, and non-product scaffolding (see `docs/RULES_COMPLIANCE.md`). Do not add application/product code before kickoff.

## Workflow
1. **Claim an issue before coding.** Each person owns a layer of the codebase per `docs/TEAM_CHARTER.md` (Section 6) — pick an open issue, assign yourself, comment your plan.
2. **One issue, one branch, one small PR.** Branch names: `<name>/<short-description>` (e.g. `athena/metadata-tap`, `mujtaba/sky-view`).
3. **Contract first.** Agree the API request/response shapes (Pydantic models) before either side writes logic against them. The contract in `schemas/` is the only coupling point between frontend and backend — edit it only after discussion.
4. **Mock from minute one.** Frontend builds against fixture JSON so it's never blocked waiting on the real data layer.
5. **Rebase on `main`; never merge `main` into your branch.** Keep history linear.
6. **Force-push only with `--force-with-lease`, and only on your own branch.** Never force-push a shared branch. No branch should live longer than ~3 hours during the Nov 14–15 build.
7. **Shared files change in tiny, fast PRs.** `package.json`, lockfiles, CI config, and `schemas/` are high-conflict — touch them in isolated, quickly-reviewed PRs.
8. **Lockfile conflicts are regenerated, never hand-edited.** Delete and reinstall, then commit the regenerated file.
9. **Squash-merge only.** Merged branches auto-delete.
10. **Env hygiene.** Commit `.env.example`; real `.env` stays gitignored. Never paste a key or token into chat, a commit, or an issue — see `SECURITY.md` if one leaks anyway.

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
- No AI-generated or fabricated sky imagery or data, ever. See `docs/JUDGING_CRITERIA.md` (Innovation criterion) and `docs/TEAM_CHARTER.md` Section 2 ("Agents never produce numbers. Agents only produce queries and prose.").
- Cite every data source and third-party library in `docs/CREDITS.md` — Space Apps revokes award status for missing citations.

## Decisions
`docs/DECISIONS.md` is append-only — log every scope, architecture, or plan change there (timestamp, decision, one line of reasoning) instead of relitigating it later. It's a shared file (see rule 7 above): small, isolated PRs only.

## Found a security issue?
Don't open a public issue for it — see [`SECURITY.md`](SECURITY.md) for how to report privately.

## Roles
See `docs/TEAM_ROLES.md` for open slots and who owns what, and `docs/TEAM_CHARTER.md` for the full ownership split between current team members.
