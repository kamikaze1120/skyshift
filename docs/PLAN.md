# Plan

Two-person work split assumed (lead + one data/backend partner); scales down gracefully if it stays solo.

- **Lead (product, story, frontend):** scope, narrative, user flow.
- **Partner (data, backend):** Python, astronomy data files.

The two roles work in parallel against an agreed **data contract** (see `DATA_CONTRACT.md`) — the interface gets built against a sample record while the partner produces real ones, so neither blocks the other.

## Phase 1: now → Oct 27 (learning, allowed)

| Lead | Partner |
|---|---|
| Recruit; study how Zooniverse and IRSA's own explorer present data | Run IRSA's "Introduction to SPHEREx Spectral Images" tutorial |
| Draft the story arc on paper: hook, reveal, call to action | Answer the risk questions: which asteroids have usable repeat coverage? Do any stars visibly move? |
| Draft the data contract | Review the contract against what the data actually contains |

## Phase 2: Oct 28 → Nov 13 (planning, no product code)
- Together: read the full challenge statement, adjust scope within 48 hours of its release.
- Lead: finalize the target list with the partner, write the demo script, sketch screens on paper.
- Partner: document the exact archive queries for each target, so fetching data is mechanical on Nov 14.
- Both: finalize the data contract and the kickoff plan.

## Phase 3: Nov 14–15 (build)

| Time | Lead | Partner |
|---|---|---|
| Sat AM | Set up the app and deploy a preview | Fetch data for the first 3 targets |
| Sat PM | Blink/swipe viewer and source panel on sample data | All curated targets converted to web images |
| Sat night | Wire in real data; build the story intro | Live search endpoint (stretch) |
| Sun AM | Gallery, polish, mobile | Flagging + map (stretch), bug fixes |
| Sun PM | Video, project page | Credits, data citations, final checks |

**Merge points:** Saturday 1 PM (first real image on screen) and Saturday 10 PM (feature freeze).

## Kill criteria
Hard stop rules to protect the demo if something isn't working — cut the feature, don't let it cut the weekend:
- If a stretch feature (live search, flagging + map, asteroid-catalog cross-check) isn't merge-ready by Saturday 10 PM feature freeze, it's cut.
- If the venue Wi-Fi can't reach IRSA/Supabase reliably, fall back to the precomputed demo dataset immediately — don't burn build time debugging network access mid-event.
- If a teammate's piece isn't unblocking others by its Phase 3 checkpoint, the lead reassigns or drops scope rather than waiting.

## Using a shared Claude project
Put the key documents (this repo's `docs/`) into the team's shared Claude project so every collaborator's Claude sessions start from the same foundation. That matters more than chat history, which is personal to whoever had the conversation.
