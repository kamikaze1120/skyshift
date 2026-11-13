# Reference tools and partner resources

Every item NASA listed under Data and Resources, plus what we decided to do about each. Skipping a
named resource is a scoring risk on Data access and Innovation, and all of them must be cited in
`CREDITS.md` if used.

## WiseView, the most useful thing on the list

<http://byw.tools/wiseview>

NASA's own words: a similar tool made for viewing data from the earlier WISE mission, used by the
public to make hundreds of discoveries, offered as a model or inspiration. Backyard Worlds, named in
the official background text, runs on this.

**This is a working proof of the exact product we are building, with a public discovery record.**
Studying it is the cheapest competitive advantage available to us.

**Timebox: 20 minutes before kickoff.** Answer these in writing and paste the answers below:

- [ ] What is the default view when it loads, and how many clicks to a blink?
- [ ] Which controls are exposed, and which are hidden behind an advanced panel?
- [ ] How does it handle field of view and zoom?
- [ ] How does it encode state in the URL? This directly answers the URL embeddability consideration
- [ ] How does it animate across epochs, and at what frame rate?
- [ ] What does a first time visitor understand without reading anything?
- [ ] What is clearly built for experts and could be cut for a general audience?

**Findings:**

*(fill in)*

**What we copy, and what we deliberately do differently:**

*(fill in)*

## Aladin (CDS)

An official suggestion for displaying astronomical data, from the Strasbourg Astronomical Data Center.
Aladin Lite embeds in a web page and handles sky navigation, overlays, and catalog layers.

**Open decision, resolve at kickoff in 15 minutes.** Two paths:

| Embed Aladin Lite | Build our own viewer |
|---|---|
| Sky navigation and overlays for free | Full control of the blink, swipe and play interaction |
| Gaia and other catalog overlays become near free | The provenance panel and agent layer are ours to place |
| Inherit its UX and its learning curve | More build time on basics |

**Leaning:** build our own viewer for the main experience, since our differentiator is the provenance
panel and the agent layer, and both need to sit inside the interaction. Revisit Aladin specifically
for the Gaia and WISE overlay consideration, where it would save the most time.

## Astropy

Already in active use for cutouts, WCS handling, and proper motion propagation. See
`IRSA_DATA_GUIDE.md`. Add to `CREDITS.md` with its license at build time.

## Gaia Data Release 3

<https://archive.stsci.edu/missions-and-data/gaia>

NASA's note says to use the latest release, DR3. This is the overlay consideration: showing Gaia
sources on top of a SPHEREx frame lets a user tell a known catalogued star from something that moved.

**Scope:** an overlay toggle, not a full catalog integration. Cheapest version is a cone search
around the displayed coordinates returning positions, drawn as markers over the frame.

## WISE

The overlay consideration names WISE alongside Gaia. Note the connection worth stating out loud in
the demo: WISE is the mission behind WiseView and Backyard Worlds, and WISE 0855, one of NASA's five
named test targets, is itself a WISE discovery.

## CSA partner resources

Space agency partner resources carry weight on the Global connection criterion, and NEOSSat is
directly adjacent to our asteroid work.

| Resource | Link | Our angle |
|---|---|---|
| NEOSSat | <https://www.asc-csa.gc.ca/eng/satellites/neossat/> | The world's first space telescope dedicated to detecting and tracking asteroids, comets, satellites and debris. Directly adjacent to our 433 Eros hero |
| NEOSSat dataset | <https://data.asc-csa.gc.ca/dataset/neossat> | Real observations supporting detection and tracking of near Earth objects |
| NEOSSat tutorial | <https://github.com/asc-csa/NEOSSAT_Tutorial> | Python visualization of NEOSSat data |
| Canadian Astronomy Data Centre | <https://www.cadc-ccda.hia-iha.nrc-cnrc.gc.ca/en/> | Broad archive of Canadian and international observations |

**Cheapest meaningful use:** when a user flags something that moved, the cross check line names the
catalogs consulted, and NEOSSat belongs in that list alongside JPL. That is one sentence of copy plus
a citation, and it turns a partner resource into a real part of the method rather than a logo.

**Stretch, only if clearly ahead:** NEOSSat is an independent asteroid tracking dataset, so a side by
side on a shared target would be a genuine multi mission moment. Do not plan around it.

## SPHEREx tutorial notebooks

<https://caltech-ipac.github.io/irsa-tutorials/spherex/>

The official notebook index. `IRSA_DATA_GUIDE.md` already distills the intro, cutouts and multi epoch
notebooks. Re-check the index at kickoff for anything added for the hackathon.
