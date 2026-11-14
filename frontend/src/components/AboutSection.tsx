function AboutSection() {
  return (
    <section className="text-sm text-moon/60">
      <p className="micro-label text-accent-ember/70">A note on what you're seeing · a public research bay</p>
      <h2 className="display-font mt-3 text-4xl leading-none text-starlight">Turn the archive into a hunt.</h2>
      <p className="mt-5 leading-relaxed">
        SPHEREx maps the entire sky in 102 near-infrared bands. Skyshift puts the research loop in one place:
        choose coordinates, watch the real observation sequence, move through wavelength, and compare what changed.
      </p>

      <div className="mt-7 space-y-3">
        <div className="rounded-2xl border border-starlight/10 bg-starlight/[.035] p-3">
          <p className="micro-label text-orbit/70">01 · Locate</p>
          <p className="mt-2 text-xs leading-relaxed text-moon/55">Enter RA and declination or choose a curated target. The live backend will query IRSA SIA2/ObsTAP for every available epoch.</p>
        </div>
        <div className="rounded-2xl border border-starlight/10 bg-starlight/[.035] p-3">
          <p className="micro-label text-orbit/70">02 · Compare</p>
          <p className="mt-2 text-xs leading-relaxed text-moon/55">Play the time sequence, subtract frames, adjust field of view, and move across all six detector bands.</p>
        </div>
        <div className="rounded-2xl border border-starlight/10 bg-starlight/[.035] p-3">
          <p className="micro-label text-orbit/70">03 · Explain</p>
          <p className="mt-2 text-xs leading-relaxed text-moon/55">Ask the AI research guide to explain the cited results. It can narrate; deterministic data tools supply every number and pixel.</p>
        </div>
      </div>

      <p className="mt-7 rounded-2xl border border-accent-ember/15 bg-accent-ember/[.045] p-3 text-xs leading-relaxed text-accent-ember/75">
        The local build includes clearly labeled placeholder states and verified reference cutouts—not generated sky pixels.
        Live IRSA cutouts replace the fixtures when the backend is connected.
      </p>

      <p className="micro-label mb-2 mt-8 text-moon/35">Data citation</p>
      <p className="leading-relaxed">
        This publication makes use of data products from the Spectro-Photometer for the History of the Universe,
        Epoch of Reionization and Ices Explorer (SPHEREx), which is a joint project of the Jet Propulsion Laboratory
        and the California Institute of Technology, and is funded by the National Aeronautics and Space
        Administration.
      </p>
      <p className="mt-3 leading-relaxed">
        The current fixtures cite QR2, DOI{' '}
        <a href="https://doi.org/10.26131/IRSA652" target="_blank" rel="noreferrer" className="text-starlight underline underline-offset-2 hover:text-accent-ember">
          10.26131/IRSA652
        </a>
        . New production work should prefer DR1 + QR3 as IRSA releases supersede QR2.
      </p>
      <p className="mt-3 leading-relaxed">
        See the{' '}
        <a href="https://irsa.ipac.caltech.edu/ack.html" target="_blank" rel="noreferrer" className="underline underline-offset-2 hover:text-starlight">IRSA acknowledgement guidelines</a>
        {' '}and{' '}
        <a href="https://irsa.ipac.caltech.edu/data_use_terms.html" target="_blank" rel="noreferrer" className="underline underline-offset-2 hover:text-starlight">IRSA data use terms</a>.
      </p>

      <p className="micro-label mb-2 mt-8 text-moon/35">AI use disclosure</p>
      <p className="leading-relaxed">
        Built for NASA Space Apps 2026, with AI tools assisting ideation, scaffolding, and code, disclosed per the
        challenge rules. No sky/astronomy data is ever AI-generated or fabricated—every image and data point traces
        to a real SPHEREx/IRSA source file.
      </p>

      <p className="micro-label mb-2 mt-8 text-moon/35">Privacy</p>
      <p className="leading-relaxed">
        This viewer has no accounts and collects no personal data—no sign-up, no names, no emails. Everything shown
        comes from public SPHEREx/IRSA archive data.
      </p>
    </section>
  )
}

export default AboutSection
