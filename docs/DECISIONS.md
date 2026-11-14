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

## 2026-10-02 — Visually confirmed 433 Eros in real SPHEREx cutouts
**Why:** `CANDIDATE_TARGETS.md` had position/coverage confirmed via MOST but not actual image quality. Downloaded both real cutout FITS files (`?center=7.413807,9.976979&size=0.3`), opened the IMAGE extension with astropy, and confirmed Eros as a clean point source in both frames: peak SNR ~23.7 and ~27.4 (local-background estimate), 1-2px from the MOST-predicted position (normal ephemeris rounding), not near a detector edge or gap, and clearly distinguishable from the fixed background star field across both epochs. Comparison images saved to docs/assets/.
**Alternatives considered:** None — this was direct verification, not a design choice. This closes out the Phase 1 risk-check from PLAN.md: we now have one fully confirmed, demo-ready target with real data, not just a theoretical candidate.

## 2026-10-08 — Adopted team charter; Athena joins as backend/agents/data owner
**Why:** Team is no longer solo. Athena joined for backend/agents/data; Mujtaba owns frontend/infra/submission. The team formalized a much larger architecture than the original MVP concept: a layered exploration platform (React frontend, FastAPI backend, LangGraph agent layer, Postgres+pgvector) rather than a single static blink-comparator page, with a non-negotiable rule that agents only produce queries/prose, never numbers. Full doc: `docs/TEAM_CHARTER.md`.
**Alternatives considered:** None — this is the team's own agreed working document, added as authoritative source of truth rather than rewritten or second-guessed.
**Note:** This charter's data-access approach (ObsTAP via `spherex.obscore`, AWS Open Data bucket `nasa-irsa-spherex`, DOI 10.26131/IRSA652) is more specific than what's in `IRSA_DATA_GUIDE.md` and `DATA_CONTRACT.md` (which used the SIA2 `spherex_qr2` collection path). Both approaches query the same underlying IRSA archive and are not contradictory, but the existing data docs have not yet been reconciled with the charter's ObsTAP-first approach — flagged for a follow-up pass, not done as part of this push.

## 2026-10-08 — Added community health files; made README dynamic
**Why:** Repo needed the standard GitHub community-health set (Code of Conduct, Security policy) and the LICENSE file turned out to be a shortened paraphrase of Apache 2.0 from an earlier heredoc truncation issue, not the verbatim legal text — replaced with the official 202-line text from apache.org. Updated CONTRIBUTING.md to match the team charter's actual working rules (contract-first, mock-from-minute-one, env hygiene) instead of the older generic version. README rebuilt with badges (license, CI, last commit, open issues, Contributor Covenant), a table of contents, a judging-criteria table, and the real Eros verification images embedded inline as visual proof the concept works, not just linked.
**Alternatives considered:** None — this was housekeeping/accuracy work requested directly, not a design choice.

## 2026-10-12 — Scope correction: comprehensive archive search is a Must-ship, curated targets are a fallback only
**Why:** The original MVP framing treated live/full-archive search as a stretch goal and a fixed 10-20 target gallery as the core deliverable. That undersold the "Data access" judging criterion and the backend's actual capability (ObsTAP/`spherex.obscore` can already query anything in the archive). Reframed: comprehensive live search is Must-ship; the curated gallery (433 Eros, etc.) is explicitly demoted to a fast-loading entry point / fallback-if-IRSA-is-slow, not the product's scope ceiling.
**Alternatives considered:** Keep curated-first framing for lower risk — rejected because it would mean deliberately hiding a capability the architecture already supports, which is a worse answer to "best makes space data accessible" than shipping what we actually have.

## 2026-10-12 — Set up GitHub Project board for task tracking
**Why:** Need a shared, visible way to track prep-phase and lock-phase tasks ahead of Nov 14. Confirmed this is allowed under docs/RULES_COMPLIANCE.md (organizational work, not challenge code). Reused an empty auto-provisioned project rather than creating a duplicate; renamed to "Skyshift — Space Apps 2026". Seeded with 14 issues covering: Athena's IRSA/data homework, Mujtaba's generic scaffolding, shared contract/recruiting/logistics tasks, and the Oct 28 checkpoint - all pulled directly from docs/TEAM_CHARTER.md Section 8 and docs/TEAM_ROLES.md, plus one issue specifically validating the 2026-10-12 comprehensive-search scope decision (arbitrary-region ObsTAP timing, not just pre-verified targets).
**Alternatives considered:** A separate tool (Trello/Notion) - rejected for now since CONTRIBUTING.md already assumes GitHub Issues as the workflow; keeping tracking in the same place as the code avoids a second system to sync. Can revisit if a non-technical teammate (design/video role) joins and GitHub is a barrier for them.

## 2026-10-12 — Expanded project board: in-depth task bodies + 51 real sub-issues
**Why:** Flat one-line issues weren't enough to actually execute against. Rewrote all 14 parent issues with acceptance criteria and an explicit rule-compliance note each, then created 51 GitHub-native sub-issues (via `gh issue create --parent`) breaking each into concrete, actionable steps. Caught and corrected three compliance edge cases while doing this:
  - Issue #5 (generic starter template) - practice must happen in a throwaway sandbox repo, not committed to `skyshift`. The real app scaffold is Nov 14 morning work per `docs/TEAM_CHARTER.md` Section 8.
  - Issue #9 (About page/citations) - rescoped to content/text only (citation wording, AI disclosure wording). Actual page component code is Nov 14-15 build work, not prep.
  - Issue #11 (API contract) - rescoped to a design doc/markdown sketch per endpoint, not a `schemas/` code directory. Matches the charter's own "finalize the contract on paper" language for the Oct 28-Nov 13 window.
Backend issues (owner:backend) left unassigned - reserved for Athena, pending her GitHub username. All frontend and shared issues assigned to @me (kamikaze1120).
**Alternatives considered:** Plain markdown checklists inside each issue instead of real sub-issues - rejected since GitHub's native sub-issues (available via `gh issue create --parent`, gh CLI 2.101.0) show up as a tracked hierarchy with progress bars on both the issue and the project board, which is strictly more useful for the same effort.

## 2026-11-09 — Read the full challenge statement (Oct 28 lock task, done late) and checked a named test target
**Why:** The "Oct 28 lock" task (issue #12 and sub-issues #56-59) was never actually done - no commits or issue progress happened between 2026-10-12 and 2026-11-09. With kickoff 5 days out, re-pulled the official statement directly from spaceappschallenge.org (via browser automation, since direct HTTPS fetch hit a TLS trust-chain error specific to that domain). Key findings, folded into docs/CHALLENGE.md, docs/CANDIDATE_TARGETS.md, docs/MVP_CUT_LINE.md:
  - The official Objectives text is RA/Dec-first and frames output as "a series of images... like a little video" - validates, and sharpens, the 2026-10-12 comprehensive-search scope decision.
  - NASA names five specific test targets: Barnard's Star, Epsilon Indi B, WISE 0855, RW Aurigae, R Draconis. None are solar-system objects (unlike our own 433 Eros research) and none were previously in our docs.
  - Verified WISE 0855 against real SPHEREx data: 129 real epochs over a 373-day baseline (coverage confirmed), but NOT visually detected as a point source in a quick single-band check at either endpoint epoch - a real, unresolved risk, not a success. Likely needs per-detector co-adding, which is literally one of NASA's own Potential Considerations.
  - Official Potential Considerations also name: image differencing (add/subtract epochs), adjustable field of view, URL-embeddable coordinates, Gaia/WISE overlay, and the Aladin (CDS) viewer as a tool worth evaluating - none previously in our docs.
**Alternatives considered:** None - this was fact-finding against an authoritative source, not a design choice. The remaining four named targets (Barnard's Star, Epsilon Indi B, RW Aurigae, R Draconis) still need the same verification pass.

## 2026-11-09 — Verified all 5 of NASA's named test targets against real SPHEREx data
**Why:** Issue #66 (urgent). With 5 days to kickoff, checked all four remaining official test targets (Barnard's Star, Epsilon Indi B, RW Aurigae, R Draconis) the same way WISE 0855 was checked earlier today - real SIA2 coverage query, real cutouts pulled, real SNR computed. Results: Barnard's Star and RW Aurigae are both strong, clean, demo-ready detections (SNR ~11-32). Epsilon Indi B is NOT detected (T-dwarf binary, likely too faint even with co-adding). R Draconis shows a real but saturated/off-center detection needing one more clean check. Full writeup with images: docs/CANDIDATE_TARGETS.md.
**Alternatives considered:** None - this was direct verification, not a design choice. Recommendation going forward: lead the official-target portion of the demo with Barnard's Star and RW Aurigae, not WISE 0855 - don't put the hardest/unconfirmed target in front of judges first.

## 2026-11-09 — Locked deployment topology: frontend on Vercel, backend on a separate host

**Why:** Team confirmed Vercel as the frontend deployment target and needed to settle how env vars connect frontend and backend. FastAPI + LangGraph + Postgres/pgvector needs a persistent process and pooled DB connections, which doesn't fit Vercel's serverless function model (cold starts, short timeouts, no long-lived connections). Split: frontend on Vercel; backend on Render/Railway/Fly (final pick at kickoff). Frontend reaches the backend via one public env var, `VITE_API_BASE_URL`; backend secrets (`DATABASE_URL`, LLM keys, `CORS_ALLOWED_ORIGINS`) live on the backend's own host, never in Vercel's dashboard. Flagged the Vercel-preview-URL CORS gotcha (unique domain per PR) for Athena's FastAPI CORS config. Updated `docs/TEAM_CHARTER.md` (new "Deployment topology and env vars" subsection, ownership table) and `docs/DATA_CONTRACT.md` (new "Transport contract" section).
**Alternatives considered:** Running the backend on Vercel too (Python serverless functions) - rejected since LangGraph's multi-step agent calls and a pooled Postgres/pgvector connection don't fit short-lived serverless invocations well.

## 2026-11-13 — Covered every official Potential Consideration, and caught the DR1 release
**Why:** Audited the repo against the official Potential Considerations and the Data and Resources list, one day before kickoff. Five were covered, three were only noted without being scoped, and three named resources were missing entirely. Changes made:
  - **DR1 released 2026-11-12, two days before kickoff, and was absent from every doc.** DR1 reprocesses the QR2 era to be uniformly processed with QR3 and adds an all sky cube across the 102 nominal bands. Our docs listed only the QR2 and QR3 collections. New `DATA_RELEASES.md` holds the full registry, all DOIs, and the baseline decision: DR1 plus QR3 primary, QR2 plus QR3 fallback, confirmed Saturday morning.
  - **QR2 and QR3 are consecutive time slices, not reprocessings.** Querying `spherex_qr2` alone stops at 2026-07-20. Corrected in `IRSA_DATA_GUIDE.md`, which previously showed a single collection query as the pattern. Our verified Eros pair is QR2; the 373 day WISE 0855 check almost certainly crossed the boundary.
  - **Promoted to Must ship:** URL embeddable coordinates (about an hour of work, feeds Global connection), contamination flags from the `FLAGS` extension we already parse, and release config driving both queries and the generated citation list. The third is the design answer to "new SPHEREx data is arriving fast," and it makes a missing DOI structurally impossible rather than a discipline problem.
  - **New `REFERENCE_TOOLS.md`** covering WiseView, Aladin, Astropy, Gaia DR3, WISE, and the CSA partner resources (NEOSSat, CADC), none of which appeared anywhere in the repo. WiseView is NASA's own offered model for this exact tool with a public discovery record, and carries a 20 minute teardown checklist to complete before kickoff. NEOSSat gets named alongside JPL in the known object cross check copy.
  - **Completed the DOI table** in `CREDITS.md`: QR3 is 10.26131/IRSA662, DR1 images 10.26131/IRSA678, DR1 cube 10.26131/IRSA679, QR2 10.26131/IRSA652, QR1 retired. Added MOST, SIMBAD, Gaia, NEOSSat, CADC and the reference tools as citable sources.
  - **Flagged the real deadline** in `RULES_COMPLIANCE.md`: projects are submitted according to the ending time of the team's Local Event, which governs and may be earlier than the global 11:59 PM. Confirm and record.
  - **Spectra on the fly** added as an explicit stretch, with the DR1 cube as its plausible backend and a 20 minute feasibility timebox rather than planned work.
**Alternatives considered:** Leaving the release handling hardcoded to one collection and adding others later, rejected because NASA names update-ability as the first Potential Consideration and DR1 arriving two days before kickoff is a live demonstration of why. Embedding Aladin for the whole viewer, deferred rather than decided, since the provenance panel and agent layer need to live inside the interaction; Aladin is revisited specifically for the Gaia and WISE overlay.

## 2026-11-13 — Dropped Gemini, Groq is the sole remote LLM provider; added a hard LLM-timeout fallback

**Why:** Testing the Gemini free-tier API before kickoff showed it stalling and returning empty responses under normal use — a live-demo-killing failure mode, not a hypothetical. Considered claiming the NASA Space Apps Global Collaborator Google Cloud $300/90-day credit to run Gemini through Vertex AI's paid tier instead (removes the free-tier throttling), but decided against adding GCP account/billing/IAM setup the night before kickoff for a provider we no longer need: Groq's free tier is fast, low-latency, needs no cloud console setup, and was already an option in the charter's original stack row. Groq is now the sole primary provider, with the already-planned local Ollama model as the guaranteed fallback. Also added a concrete mechanic that was previously only named, not specified: a hard 5-8s timeout per LLM call in the LangGraph layer, falling back to a code-generated (non-AI) sentence over the deterministic query results on timeout/empty response, plus pre-running and caching the exact demo queries before judging. Updated `docs/TEAM_CHARTER.md` (Section 5 stack table and env var contract, Section 9 risk register).
**Alternatives considered:** Claiming the Google Cloud credit to run Gemini via Vertex AI — rejected for added setup complexity with no remaining need once Groq covers the use case for free. Relying on Gemini free tier as-is — rejected, already observed failing. Also evaluated, and separately decided against, the GoDaddy/Porkbun free-domain Global Offer (no WHOIS privacy on the free registration, exposing personal contact info to public lookup and spam) and the Microsoft Teams Global Offer (not needed over existing team coordination) from the same Global Collaborators list; GitHub Copilot Free was adopted as a no-cost, no-card supplementary coding tool.
