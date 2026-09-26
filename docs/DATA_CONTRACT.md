# Data Contract

Draft schema for a single "target" record — the interface the frontend builds against, and the shape the data/backend partner produces from IRSA. Keeping this stable lets both sides work in parallel without blocking each other. Treat this as a living doc — lock it before Nov 14, then only change it together.

## Target record (draft)

```json
{
  "target_id": "string — stable slug, e.g. \"433-eros-2026-03\"",
  "display_name": "string — human-readable label, e.g. \"433 Eros\"",
  "object_type": "asteroid | comet | star | brown_dwarf | unknown",
  "coordinates": {
    "ra_deg": "number — right ascension, degrees",
    "dec_deg": "number — declination, degrees"
  },
  "observations": [
    {
      "epoch": "ISO 8601 date — observation date",
      "wavelength_band": "string — SPHEREx band identifier",
      "image_url": "string — web-friendly image (converted from FITS), hosted asset",
      "source_file": "string — original SPHEREx/IRSA file identifier",
      "doi": "string — citation DOI for this observation"
    }
  ],
  "known_motion_arcsec": "number | null — measured shift between epochs, if verified",
  "verified": "boolean — has a human confirmed this target shows visible motion?",
  "story_note": "string | null — one-line human context for the story-mode intro, only set for the curated hook targets"
}
```

## Rules for both sides
- `observations` must have at least 2 entries per target for a blink/swipe comparison to work.
- `image_url` is always a converted, browser-friendly image — never a raw FITS file (blocked by CI anyway).
- `source_file` and `doi` are required on every observation — this is what powers the "Where did this come from?" source panel (Innovation / no-hallucinations criterion).
- `verified: false` targets can exist in the dataset for the live-search stretch feature, but only `verified: true` targets appear in the curated gallery/story intro.

## Open questions (resolve during Phase 1–2)
- Exact IRSA query pattern per target (Simple Image Access V2 vs. Cutout Service) — partner documents this per target so Nov 14 fetching is mechanical.
- Confirm units/precision for `known_motion_arcsec` against what IRSA actually returns.
- Confirm whether `wavelength_band` needs to encode the FITS wavelength-per-pixel convention noted in `CHALLENGE.md`, or whether a simplified band label is sufficient for v1.
