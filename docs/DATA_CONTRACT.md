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

## Resolved (2026-10-02, from IRSA's own tutorials — see `IRSA_DATA_GUIDE.md`)

- **Query pattern:** SIA2 query first (`astroquery.ipac.irsa.Irsa.query_sia(pos=(coord, radius), collection='spherex_qr2')`) to find candidate images for a position, then append `?center={ra},{dec}&size={deg}` to any result's `access_url` to pull a small cutout instead of the full 2048×2048 detector frame. Confirmed: a single sky position can return dozens of observations across time (IRSA's own cutout tutorial pulled 84 for one test field) — repeat coverage is real, at least in some fields. Each team member still needs to verify it for our *specific* chosen target(s).
- **`known_motion_arcsec` units/precision:** SPHEREx's pixel scale is **~6.15 arcsec/pixel** (confirmed figure, not the rough "~6" estimate). Store `known_motion_arcsec` as a float with at least 2 decimal places — anything under ~3 arcsec (half a pixel) is not a credible "it moved" claim.
- **`wavelength_band`:** needs the real per-pixel wavelength, not a simplified label — SPHEREx wavelength varies *across* a single detector image. Pull it via the image's spectral WCS: `WCS(header=hdulist["IMAGE"].header, fobj=hdulist, key="W").pixel_to_world(x, y)` returns `(wavelength, bandwidth)` for a given pixel. Store both values on the observation, not just a band name.

## Open questions (resolve during Phase 1–2)
- Which specific target(s) — likely a known asteroid, since stars/brown dwarfs won't visibly move at this pixel scale (see `MVP_CUT_LINE.md`) — actually have 2+ epochs with the object inside the cutout footprint. Not yet checked against a real moving object; the 84-epoch example above was a fixed extended object (galaxy), so it proves repeat coverage exists, not that any specific asteroid is caught twice.
- Whether to query via SIA2 (per-image) or TAP SQL (bulk, sorted by time — what IRSA's own multi-epoch tutorial uses) for assembling a target's full observation list.
