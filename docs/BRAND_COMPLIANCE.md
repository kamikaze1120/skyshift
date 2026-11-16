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

**Updated 2026-11-15: the Space Apps "Orbit" logo is now used, and that's correct, not a
violation.** The earlier version of this doc read `docs/RULES_COMPLIANCE.md`'s "must not use NASA
branding" rule as covering the Space Apps Challenge's own logo too. Re-reading the brand guide
(20 pages, pulled directly from `assets.spaceappschallenge.org`) shows that rule is about **NASA's
own insignia** (the meatball logo, flags, mission identifiers) — the guide itself exists
specifically to tell participants how to use the Orbit mark correctly, with its own download link
(`spaceappschallenge.org/brand` → `NASA_Space_Apps_Logos_2026.zip`). Using the Challenge's own logo
is expected, not prohibited.

Two official assets are now in `frontend/public/brand/`, pulled from that same zip:
- `space-apps-lockup.svg` ("Color and White" Default horizontal lockup) — shown top-right in
  `IntroSequence.tsx`, replacing the old "NASA Space Apps · 2026" text.
- `space-apps-mark.svg` (White small Orbit mark only) — shown in `NavBar.tsx`'s header, next to the
  Skyshift wordmark.

Both are the untouched, unmodified official files — no recoloring, rotating, stretching, or
deconstructing the lockup (every "Logo Don't" in the guide avoided by not touching the files at
all). NASA's own insignia is still never used anywhere, which remains the actual hard rule.

## Follow-up (2026-11-15): Electric Blue and Neon Blue added

The guide documents exactly 3 approved backgrounds (Deep Blue, Electric Blue, White) and 5 accents
(Blue Yonder, Neon Blue, Rocket Red, Martian Red, Neon Yellow) — the app previously only ever used
one of the three backgrounds (Deep Blue), rendering as flat and monotone. Added as new tokens:

| Token | Hex | Maps to | Used for |
|---|---|---|---|
| `electric-blue` | `#0042A6` | **Electric Blue** (2nd approved background) | `.brand-gradient` (below) |
| `neon-blue` | `#0960E1` | **Neon Blue** (accent) | secondary interactive accent, distinct from `orbit`/Blue Yonder |

Added `.brand-gradient` (`index.css`): the guide's own documented 45° linear gradient from Electric
Blue (top-left) to Deep Blue (bottom-right) — applied to UI chrome surfaces (`NavBar`'s header,
`SequenceViewer`'s data rail, `TargetSelectionScreen`'s backdrop), never to the decorative
sky/nebula art, which keeps its own exempted illustrative gradient as before. This breaks up flat
single-tone chrome using a second *approved* background rather than introducing a new hue.

Also used White as an actual panel background (not just text) for the first time: the short-description
card in `TargetSelectionScreen.tsx` is a white card with Deep Blue text — one of the guide's
documented text/background pairings, used here for a deliberate light/dark contrast beat in the new
intro → selection → research-bay flow.

Martian Red (`#8E1100`) was considered and left out — likely has the same WCAG AA contrast problem
Rocket Red already failed in this app's reduced-opacity usage (see below), and wasn't re-verified.

## Follow-up: literal color leftovers

The first pass only updated the `@theme` token *values*. A review pass afterward found several
places with pre-migration colors hardcoded as literal hex/rgb (Tailwind arbitrary values like
`bg-[#03050a]`, or raw `rgba(225,123,80,...)` in shadows/gradients) instead of referencing the
tokens — these don't pick up a token-value change and were still rendering the old palette. Fixed in
`IntroSequence.tsx`, `NavBar.tsx`, `SequenceViewer.tsx`, `SkyFrame.tsx`, and `index.css`
(`.soft-scrollbar`, `.orbit-line`, `.glass-panel`). The documented decorative-art exemption
(`.scene-shell`, `.sky-canvas`, `.celestial-body`, `.sky-noise`) is unchanged on purpose.

A second, independent review pass caught one the first pass missed: `SkyFrame.tsx`'s full-frame
background overlay (the `absolute inset-0 bg-[radial-gradient(...),linear-gradient(...)]` div
behind the sky image) still had pre-migration near-black navy stops (`#07101b`/`#020408`/`#0d0a12`)
and an unrelated slate-blue highlight tint (`rgba(102,165,193,.08)`). Converted the gradient stops
to the Deep Blue token progression (`#07173F`/`#0b1d4d`/`#11295e`) and the highlight to Blue Yonder
(`rgba(46,150,245,.08)`), matching the same highlight color already used for the placeholder-cutout
gradient lower in the same file.

## Icons and imagery

Icons are custom inline SVGs, line-based with consistent stroke weight — already matches the guide's
"lightweight, line-based" icon style without needing a swap to Phosphor/Feather. Real SPHEREx
cutouts are shown in rounded rectangular holding shapes, matching the guide's web-context guidance
(circular holding shapes are its print/social recommendation, not required here).
