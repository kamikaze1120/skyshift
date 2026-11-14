# Brand Compliance

Source: [NASA Space Apps Brand Guidelines](https://assets.spaceappschallenge.org/media/documents/Space_Apps_Brand_Guide_VUGpVJm.pdf), updated June 25, 2026. Reviewed in full (20 pages) on 2026-11-14.

## What this governs

The guide's hard rules — colors, contrast, typography, logo don'ts — are applied to the frontend's
UI chrome (backgrounds, text, buttons, badges, nav) in `frontend/src/index.css`. The app's bespoke
space/nebula decorative art (`scene-shell`, `sky-canvas`, `celestial-body`, `sky-noise` in
`index.css`) is left as creative illustration, not reskinned to the guide's two-tone gradient — the
guide's gradient spec is for marketing/poster-style backgrounds, and collapsing Skyshift's actual
sky-rendering art into a flat corporate gradient would be a real design regression, not a compliance
requirement.

## Color mapping

All values are the theme tokens in `frontend/src/index.css`'s `@theme` block. Contrast ratios were
computed directly (WCAG relative-luminance formula), not eyeballed — see `scratchpad/contrast.py`
from this session if you want to re-run them.

| Token | Old | New | Maps to | Contrast on Deep Blue |
|---|---|---|---|---|
| `space-950` (bg) | `#03050a` | `#07173F` | **Deep Blue** (official, approved body background) | — |
| `space-900` / `space-800` | `#090d16` / `#111827` | `#0b1d4d` / `#11295e` | Deep Blue tints (panel depth; guide doesn't name a specific tint) | — |
| `starlight` (primary text) | `#f2efe7` | `#FFFFFF` | **White** (official) | 17.45:1 |
| `orbit` (primary accent) | `#91d6e8` | `#2E96F5` | **Blue Yonder** (official) | 5.65:1 — matches the guide's own listed "AA 5.63:1" pairing almost exactly |
| `lilac` (links/citations) | `#a79acf` | `#eafe07` | **Neon Yellow** (official) | 15.52:1 — guide explicitly says use sparingly, e.g. for a hyperlink; existing usage here was already link-only |
| `moon` (muted text) | `#cbc8c1` | `#AEB4C7` | Cool gray (guide names "Slate Gray" for body copy but gives no hex) | 8.44:1 at full opacity |
| `accent-ember` (warm accent) | `#e17b50` | `#FFB020` | **Not** the official Rocket Red — see below | 9.54:1 at full opacity |

### Why `accent-ember` isn't literal Rocket Red

Rocket Red (`#E43700`) only reaches **4.03:1** against Deep Blue — already under the guide's own
stated 4.5:1 AA minimum for normal text, and the guide's own Do/Don't page lists sub-4.5 pairings as
a documented **Don't**. This app renders `accent-ember` text at reduced opacity in many places
(`/60` through `/80`, for micro-labels, warning text, badges), which lowers the *effective* contrast
further — down to **2.84:1** at `/60` for a literal Rocket Red. The amber used instead
(`#FFB020`) holds up far better at those same real opacities (4.07:1 at `/60`, 9.54:1 at full) while
keeping the same warm-accent semantic role. This was a deliberate trade: brand-color fidelity vs. a
hard, explicitly-stated accessibility rule in the same document — accessibility won.

**Known pre-existing gap, not introduced by this pass:** several decorative micro-labels use `moon`
or `accent-ember` at very low opacity (`/25`–`/45`) for de-emphasis (timestamps, field captions).
Those already fall under 4.5:1 with the old colors too — this is a pre-existing stylistic choice in
the design, not a regression from this color swap. A full WCAG pass across every low-opacity label
is a separate, larger task than brand-color compliance and wasn't attempted here.

## Typography

| Role | Guide requirement | Applied as |
|---|---|---|
| Headings (`.display-font`) | Fira Sans Black/Bold | `Fira Sans`, weight 900, loaded via Google Fonts |
| Body (`:root`) | Overpass Regular/Bold/Italic | `Overpass`, loaded via Google Fonts |
| Code (`code, pre`) | Fira Code Regular/Bold | `Fira Code`, loaded via Google Fonts (no code blocks currently render in the UI, but the stack is in place) |

Previously: Inter (body) and a serif stack (`Iowan Old Style`/`Baskerville`) for headings — neither
is in the guide.

## Logo and NASA branding

No NASA insignia or Space Apps logo graphic is used anywhere in the app — only text attribution
("Built for NASA Space Apps 2026...", `AboutSection.tsx`; "NASA Space Apps · 2026",
`IntroSequence.tsx`). This already matches `docs/RULES_COMPLIANCE.md`'s hard rule ("Generated
content must not use, contain, or modify NASA branding or design elements") and avoids every "Logo
Don't" in the guide (recoloring, tilting, stretching, deconstructing lockups) by not embedding the
logo mark at all. If the team wants to add the actual Space Apps "Orbit" logo mark later, pull the
real asset from spaceappschallenge.org/brand rather than approximating it.

## Follow-up: literal color leftovers

The first pass only updated the `@theme` token *values*. A review pass afterward found several
places with pre-migration colors hardcoded as literal hex/rgb (Tailwind arbitrary values like
`bg-[#03050a]`, or raw `rgba(225,123,80,...)` in shadows/gradients) instead of referencing the
tokens — these don't pick up a token-value change and were still rendering the old palette. Fixed in
`IntroSequence.tsx`, `NavBar.tsx`, `SequenceViewer.tsx`, `SkyFrame.tsx`, and `index.css`
(`.soft-scrollbar`, `.orbit-line`, `.glass-panel`). The documented decorative-art exemption
(`.scene-shell`, `.sky-canvas`, `.celestial-body`, `.sky-noise`) is unchanged on purpose.

## Icons and imagery

Icons are custom inline SVGs, line-based with consistent stroke weight — already matches the guide's
"lightweight, line-based" icon style without needing a swap to Phosphor/Feather. Real SPHEREx
cutouts are shown in rounded rectangular holding shapes, matching the guide's web-context guidance
(circular holding shapes are its print/social recommendation, not required here).
