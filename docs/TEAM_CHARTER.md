# Planet X / SPHEREx Layered Exploration Platform

## Team Charter, Architecture, and Working Agreement

**Event:** 2026 NASA Space Apps Challenge, November 14 to 15, 2026
**Challenge:** Planet X and SPHEREx (Advanced). Public web tool showing how SPHEREx sky images change over time.
**Team:** Mujtaba (frontend, infra, submission) and Athena (backend, agents, data)
**Status of this doc:** Living. Final architecture locks after the full challenge statement publishes on October 28, 2026.

---

## 0. The rule that governs everything before November 14

Teams are not permitted to begin work on the challenge before the hackathon starts. That means:

**Allowed now:** learning the IRSA APIs, running tutorial notebooks, reading documentation, creating accounts, installing tooling, agreeing on this charter, practicing generic framework scaffolding unrelated to the challenge.

**Not allowed now:** writing the application, the data layer for SPHEREx, the agent graph, or any challenge specific logic.

Everything in Section 8 respects that line.

---

## 1. Product concept

A layered exploration platform for the SPHEREx all sky spectral survey. Not a viewer for one object. A tool where a user picks a region of sky, sees every SPHEREx observation that covers it across the mission timeline, and watches how that patch changes week over week, in wavelength as well as brightness.

The AI layer sits on top as a research assistant that plans queries, chooses the right visualization, and narrates what the data shows.

**What makes it different from existing sky viewers:** SPHEREx is a spectral survey, covering 0.75 to 5.1 microns. Every pixel carries wavelength information. Most public sky tools show color images. This one shows spectra changing over time.

---

## 2. Non negotiable design rule

**Agents never produce numbers. Agents only produce queries and prose.**

Every figure, coordinate, flux value, wavelength, and date rendered on screen comes from a deterministic Python function that read it from the archive. The LLM plans the query, selects the view, and writes explanation around results it did not compute.

Reason: one of the judging criteria is innovative use of technology with no fabricated data. An AI layer over astronomical data is the single most likely place to lose the Science and Plausibility criteria. State this rule explicitly in the demo video and the README. It turns the biggest risk into a credibility point.

---

## 3. Judging criteria the build is measured against

Every scope decision gets checked against these:

| Criterion | How this project addresses it |
|---|---|
| Science | Real SPHEREx QR2 calibrated data, correct citation, honest statement of limitations |
| Data access | Makes a hard to reach spectral archive explorable by non specialists |
| Innovation | Agent planned queries over a Virtual Observatory metadata layer |
| Impact | Lowers the barrier to a brand new all sky spectral dataset |
| Plausibility | Standard VO protocols, no invented pipelines |
| Storytelling | Narrative panel explains what the user is looking at in plain language |
| Global connection | Public web tool, open source, no login required |
| Craft | Clean layered architecture plus a genuinely good interface |

---

## 4. Data layer facts (verified)

Source of truth is IRSA (NASA/IPAC Infrared Science Archive).

- SPHEREx launched March 2025. Planned two year mission. Spectroscopy from 0.75 to 5.1 microns over the entire sky, deeper in the SPHEREx Deep Fields.
- IRSA releases Quick Release spectral images weekly. QR1 began July 2025. QR2 began October 2025 with substantially improved calibrations and reprocessed everything back to mission start.
- **QR2 supersedes QR1.** QR2 is the default returned by the SPHEREx Data Explorer and all IRSA program friendly APIs. QR1 remains available only through browsable directory listings. **Build on QR2 only.**
- All sky data cubes with 102 spectral channels arrive after survey years 1 and 2. A high reliability source catalog comes later still. Do not design around products that may not exist by November.

### Access paths, in order of preference

1. **ObsTAP via the `spherex.obscore` schema.** Standard TAP query against observation metadata. This is the backbone. Small, fast, queryable, and it is what makes multi object and multi epoch coverage possible without downloading images.
2. **IRSA cutout service.** Pull a small region of a spectral image on demand instead of the full frame.
3. **astroquery / PyVO.** Python clients for both of the above. IRSA publishes SPHEREx tutorial notebooks.
4. **AWS Open Data.** Bucket `nasa-irsa-spherex`, QR2 Level 2 products under `qr2/level2`. No AWS account required. Use this as the bulk fallback if TAP is slow at the venue.

### Mandatory citation

Failure to cite can cost award eligibility. Required in README and on the About page:

- DOI **10.26131/IRSA652** for QR2 (10.26131/IRSA629 for QR1 if ever referenced)
- IRSA acknowledgement text naming the Spectro-Photometer for the History of the Universe, Epoch of Reionization and Ices Explorer (SPHEREx) as a joint project of the Jet Propulsion Laboratory and the California Institute of Technology, funded by NASA.

---

## 5. Architecture

```
Layer 4   React + TypeScript + Tailwind                      [Mujtaba]
          Sky region picker, time slider, spectral plot, narrative panel
Layer 3   FastAPI                                            [Athena]
          /search  /object  /timeseries  /spectrum  /ask
          Pydantic request and response models, OpenAPI emitted
Layer 2   LangGraph (library, self hosted, MIT)              [Athena]
          planner -> tool caller -> validator -> narrator
          Tools are typed Python functions. No free text numeric output.
Layer 1   Postgres + pgvector                                [Athena]
          Mirrored observation metadata index, cached cutout pointers,
          embedded documentation for retrieval
Layer 0   IRSA
          ObsTAP (spherex.obscore), cutout service, astroquery/PyVO,
          AWS nasa-irsa-spherex
```

### Stack decisions and why

| Choice | Rationale |
|---|---|
| LangGraph OSS | MIT licensed, free, no usage caps, self hostable. LangGraph Platform (around $35/month) and LangSmith are **not used**. MIT also satisfies the Space Apps requirement that third party materials be OSI licensed. |
| FastAPI | Async, native Pydantic validation, auto generated OpenAPI which the frontend consumes as types |
| Postgres + pgvector | One database for relational metadata and vector retrieval |
| React + Vite or Next.js | Decide at kickoff based on whether SSR buys anything |
| Groq or Gemini free tier, Ollama local fallback | The orchestrator is free. Inference is the real cost. Local model means a dead venue network does not kill the demo. |

### Observability without paying

No LangSmith. Structured JSON logging plus optional OpenTelemetry. Log every tool call with inputs, outputs, and duration. This doubles as evidence for the "no hallucination" claim.

---

## 6. Ownership split

Split by layer, not by feature. Nobody touches the other person's directories without asking.

| Mujtaba (frontend and everything else) | Athena (backend) |
|---|---|
| `frontend/` React components, state, styling | `backend/` FastAPI routers, Pydantic schemas |
| `frontend/lib/api.ts` generated client | `agents/` LangGraph graph, tool definitions |
| Sky view, spectral plot, time slider | `data/` IRSA clients, DB models, migrations |
| `infra/` deploy, env, CI | Fixture JSON that the frontend mocks against |
| Submission form, citations, AI disclosure | Tool call logging and validation layer |
| Demo video, screenshots, visual design | Offline and cached data fallback |
| Narrative copy, About page | |

**Shared and edited only after discussion:** `schemas/` (the API contract), `DECISIONS.md`, `README.md`.

### What this split implies for prep

Athena owns the single riskiest layer: IRSA. She is the one who needs to run the IRSA SPHEREx tutorial notebooks, learn the `spherex.obscore` columns, and time a realistic TAP query before November 14. If only one person does the October data homework, it has to be her.

Mujtaba owns the critical path on Day 2. The demo video, citations, AI disclosure, and submission all land on the frontend side, and all of them are deadline bound. Build the About page and citation block early rather than Sunday afternoon.

---

## 7. Working rules during the hackathon

1. **Contract first.** Before either person writes logic, agree the API response shapes in Pydantic. FastAPI emits OpenAPI. Frontend generates TypeScript types from it. The contract is the only coupling point.
2. **Nobody commits to `main`.** Branch per task: `athena/metadata-tap`, `mujtaba/sky-view`. Small PRs. Merge often. No branch lives longer than three hours during the event.
3. **Mock from minute one.** Frontend builds against fixture JSON so it is never blocked on the data layer. Athena commits a fixture file matching the agreed contract before she writes the real query.
4. **Env hygiene.** `.env.example` committed, real `.env` gitignored. Keys never pasted into chat.
5. **`DECISIONS.md` is append only.** Timestamp, decision, one line of reasoning. Prevents relitigating at hour 30.
6. **`AI_USAGE.md` from the first commit.** NASA permits AI tools but requires clear indication of where and how they were used, with code and data acknowledging AI generation in descriptive text and metadata, and visible watermarks on AI generated images and video. Generated content must not use or modify NASA branding, logos, flags, or mission identifiers. Log as you go.
7. **Licensing.** Apache 2.0 unless there is a reason to pick otherwise. Original content must be freely available or OSI licensed. Every source cited, including open source ones.
8. **Hard stop rule.** If a layer is not working by its checkpoint, cut it and ship what stands. A clean partial beats a broken whole.

---

## 8. Timeline

### October 7 to October 27 (prep, no challenge code)

**Athena:** IRSA tutorial notebooks, `spherex.obscore` column notes, cutout service, query timing. Practice LangGraph on an unrelated API.

**Mujtaba:** generic starter template (FastAPI, Postgres with pgvector, React, OpenAPI type generation), accounts and keys, Ollama running locally, project name and logo, README and `AI_USAGE.md` skeletons, demo script.

**Both:** agree this charter, pick two or three demo sky regions with good repeat coverage.

### October 28

Full challenge statement publishes. Re read it line by line. Update this charter. Lock scope.

### October 28 to November 13

Finalize the API contract on paper. Rehearse the demo narrative. Four hour dry run on an unrelated toy problem using these exact rules. Confirm event logistics and pre pull dependencies.

### November 14 (Day 1)

- Morning: repo init, contract agreed, Athena has TAP queries returning real metadata, Mujtaba has the shell rendering fixtures
- Afternoon: metadata in Postgres, first endpoints live, frontend switched from fixtures to real endpoints
- Evening: thin end to end slice working. One region, one timeline, real data.

### November 15 (Day 2)

- Morning: Athena on the agent layer, Mujtaba on narrative panel and spectral plot
- Midday: polish, offline fallback verified
- Afternoon: demo video, citations, AI disclosure, README
- **Submit by early evening.** Submission closes 11:59 PM local to the event. Do not approach that line.

---

## 9. Risk register

| Risk | Mitigation |
|---|---|
| Venue Wi-Fi too slow for FITS downloads | Pre cached demo region, seeded fixtures, Ollama local model |
| TAP endpoint slow or down | AWS Open Data bucket as fallback path |
| Agent loops, burns free tier | Recursion cap, timeouts, cache every tool result |
| Scope creep into real astronomy analysis | Ship exploration and comparison, make no discovery claims |
| Merge conflicts | Layer ownership plus contract first |
| Citation or AI disclosure miss costs the award | Both files exist from commit one, checked before submit |
| Building before November 14 | Prep is learning and generic scaffolding only |
| Single point of failure on the data layer | Athena documents her IRSA findings in writing during October so Mujtaba can pick it up if she is blocked |
