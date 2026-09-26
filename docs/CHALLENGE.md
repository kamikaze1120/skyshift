# Challenge: Planet X and SPHEREx

**Event:** 2026 NASA Space Apps Challenge
**Difficulty:** Advanced
**Subjects:** Astrophysics, Planets & Moons, Software

## Official summary
Since 2025, NASA's SPHEREx mission has been mapping the entire sky every six months in 102 bands of near-infrared light, returning images of more than a billion objects. Comets, asteroids, stars, brown dwarfs, and even new planets reveal themselves by shifting position between images, but no one person can sift through all that data alone. The challenge: create a public-facing web tool to display images of the sky from the SPHEREx mission, making it easy for anyone to quickly see how they change over time.

## What it actually asks for
In plain terms: a "blink comparator for the infrared sky, usable by anyone."

- SPHEREx revisits each patch of sky about every 6 months. Anything that moves shows a position shift between visits:
  - Asteroids move quickly between visits.
  - Brown dwarfs and nearby stars drift slowly.
  - A hypothetical "Planet X" would appear as a faint, slow mover.

## Where the data lives
- **Quick Release 2 Spectral Images** — accessible via the Simple Image Access V2 protocol.
- **IRSA's Cutout Service** — cutouts of the on-prem Spectral Image data; this is what makes a fast web UI possible.
- Data is public **now** — the Oct 28 challenge statement brings NASA's curated resources, not the underlying data itself. Running IRSA's own tutorials to learn the data is allowed before kickoff.

## The hard parts (judges will notice)
1. **Wavelength varies across the image.** The data uses a rarely-implemented part of the FITS convention — "same wavelength, two dates" takes care to get right.
2. **FITS files need conversion.** They aren't browser-friendly and must become web images with sensible contrast.
3. **Coverage is still filling in.** Some sky positions may not have two full surveys yet — verify this in the first hour of the build.

## Key resolution constraint
SPHEREx pixels are ~6 arcseconds wide — coarse. Even Barnard's Star (the fastest-moving star in the sky) shifts only ~5 arcseconds in six months, less than one pixel. Most stars and brown dwarfs won't visibly move in a blink comparison.
- **Implication:** lead the demo with **asteroids and comets** (obvious motion between exposures hours/days apart), not stars. Brightness changes (variable stars, different wavelengths) also count as "change over time."

## Scope note
This is a software-only challenge and not a revenue play — treat it as a portfolio/credibility asset. Hardware has been explicitly dropped from this build (see `DECISIONS.md`).
