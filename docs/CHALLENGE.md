# Challenge: Planet X and SPHEREx

**Event:** 2026 NASA Space Apps Challenge
**Difficulty:** Advanced
**Subjects:** Astrophysics, Planets & Moons, Software

**Source:** full official statement pulled from spaceappschallenge.org on 2026-11-09 (the "Oct 28 lock" task was never actually done by the team before now — this update is that task, done late, 5 days before kickoff).

## Official summary
Since 2025, NASA's SPHEREx mission has been mapping the entire sky every six months in 102 bands of near-infrared light, returning images of more than a billion objects. Comets, asteroids, stars, brown dwarfs, and even new planets reveal themselves by shifting position between images, but no one person can sift through all that data alone. The challenge: create a public-facing web tool to display images of the sky from the SPHEREx mission, making it easy for anyone to quickly see how they change over time.

## Background (official, verbatim)
Asteroids and comets orbit around the Sun. Nearby stars march across the sky as they orbit around the Galaxy. The Earth orbits the Sun too, causing objects near us to change their apparent positions. Watching for these motions help us discover new astronomical objects and also help measure the distances to these objects. For example, the dwarf planet Pluto was discovered when an astronomer compared two images of the sky taken at different times and recognized that one point of light had shifted between images.

More recently, astronomers have mounted massive searches for nearby objects using this process with help from the public. Hundreds of thousands of volunteers have used this technique to discover asteroids, comets, stars and brown dwarfs - balls of gas too massive to be considered planets yet without enough mass to burn like stars. In fact, most of the known comets and brown dwarfs were discovered by volunteers in this manner through projects like [backyardworlds.org](http://backyardworlds.org/).

Since May 2025, NASA's new SPHEREx mission has been returning unique data that could yield new discoveries. SPHEREx is mapping the whole sky once every six months in 102 bands of near-infrared light, making it uniquely sensitive to objects that are rich in hydrogen, water, carbon dioxide, carbon monoxide, and many other molecules. There will be too much data for any one person or even computer code to completely comprehend. There will be images of more than a billion objects - including brown dwarfs, quasars, comets, asteroids, stars, supernovae and galaxies - which often overlap or vary in brightness. We need your creative new tools to make the most of this treasure trove and help as many people as possible pitch in to make discoveries.

## Objectives (official, verbatim) — this is the actual core mechanic
Your challenge is to create a public-facing web tool to display images of the sky from the SPHEREx mission, making it easy for anyone to quickly see how they change over time. **Users will enter the coordinates of a patch of sky (Right Ascension and declination). Your tool will display a series of images of that patch like a little video, making it easy to spot moving objects.**

This is coordinate-first and animation-based — not just a two-image blink/swipe between a couple of pre-picked targets. The UI's primary input is RA/Dec, and the primary output is a time-sequence "video" over however many real epochs exist for that patch. A pairwise blink/swipe is a reasonable implementation of that, but the stated bar is "a series of images... like a little video," which reads as N frames, not 2.

### Official test targets — use these, not just our own picks
> "Test your tool on Barnard's Star, Epsilon Indi B (a pair of brown dwarfs orbiting a star), WISE 0855 (a fast-moving brown dwarf Right Ascension 08h55m10.831s, declination -7d14m42.53s), and variable stars RW Aurigae and R Draconis."

None of these are solar system objects — they're a high-proper-motion star, a brown dwarf binary, a brown dwarf, and two variable stars. This is a different validation set than our own research (see `CANDIDATE_TARGETS.md`), and it's the literal set NASA tells entrants to test against — treat it as what judges are likely to try themselves.

## Potential Considerations (official, verbatim)
"You may (but are not required to) consider the following:"
- New SPHEREx data is arriving fast! Make sure to design a tool that's easy to update with the latest data releases.
- Think creatively about how to display those 102 infrared bands so users can take advantage of them to make new discoveries! For example, it may make sense to separately add together all the data taken by each of the six detector arrays to improve the signal-to-noise in the images you display. Extra kudos if your tool can generate spectra on the fly.
- It may help users discover moving objects if they have the options to add together or subtract images taken at different times.
- Let users choose the field of view! Larger fields of view can make it possible to track faster-moving sources, at the cost of longer data transfer times.
- Users could benefit from having the option to overlay astronomical data from other telescopes, such as the Gaia mission or the WISE mission.
- If you make it possible to query your tool by including coordinates in the URL, users will be able to easily embed it in other websites and projects.
- It can be useful to display metadata, like contamination flags.
- Consider looking for publicly available tools that may help in handling astronomical data, like the Astropy tools, and in displaying astronomical data, like the Aladin tool developed by the Strasbourg Astronomical Data Center (CDS).

"For data and resources related to this challenge, refer to the Resources tab at the top of the page. More resources may be added before the hackathon begins." (The Resources tab didn't render reliably when checked on 2026-11-09 — worth a manual re-check closer to kickoff.)

## What this changes vs. our earlier assumptions
- **Co-adding per-detector data for SNR** and **image differencing (add/subtract epochs)** are official suggestions, not things we invented — worth promoting from "nice to have" toward real scope.
- **Adjustable field of view** and **URL-embeddable coordinates** are named UX requirements we hadn't scoped yet.
- **Aladin (CDS)** is an official suggested visualization tool worth evaluating against a hand-rolled viewer.
- **Contamination flags** — we already know about the `FLAGS` extension (`IRSA_DATA_GUIDE.md`); this confirms it's worth surfacing in the UI, not just internally.

## Where the data lives
- **Quick Release 2 Spectral Images** — accessible via the Simple Image Access V2 (SIA2) protocol and ObsTAP (`spherex.obscore`, per `TEAM_CHARTER.md`).
- **IRSA's Cutout Service** — cutouts of the on-prem Spectral Image data; this is what makes a fast web UI possible.
- Data is public **now**. Running IRSA's own tutorials to learn the data, and exploratory/notebook queries, are allowed before kickoff — see `RULES_COMPLIANCE.md`.

## The hard parts (judges will notice)
1. **Wavelength varies across the image.** The data uses a rarely-implemented part of the FITS convention — "same wavelength, two dates" takes care to get right.
2. **FITS files need conversion.** They aren't browser-friendly and must become web images with sensible contrast.
3. **Coverage is still filling in.** Some sky positions may not have two full surveys yet — verify this in the first hour of the build.
4. **Some official test targets are genuinely faint.** Confirmed 2026-11-09: WISE 0855 has 129 real SPHEREx exposures spanning a 373-day baseline, but wasn't clearly visible as a point source in a quick single-band check at either endpoint epoch (see `CANDIDATE_TARGETS.md`). This is likely exactly why the Potential Considerations suggest co-adding detector data for SNR — don't assume every named test target "just works" in a single raw exposure.

## Key resolution constraint
SPHEREx pixels are ~6 arcseconds wide — coarse. Even Barnard's Star (the fastest-moving star in the sky) shifts only ~5 arcseconds in six months, less than one pixel. Most stars and brown dwarfs won't visibly move in a blink comparison.
- **Implication:** lead the demo hook with **asteroids and comets** (obvious motion between exposures hours/days apart) for the curated fallback gallery, not stars. Brightness changes (variable stars, different wavelengths) also count as "change over time" — and two of NASA's five named test targets (RW Aurigae, R Draconis) are variable stars specifically testing that dimension, not position motion.

## Scope note
This is a software-only challenge and not a revenue play — treat it as a portfolio/credibility asset. Hardware has been explicitly dropped from this build (see `DECISIONS.md`).
