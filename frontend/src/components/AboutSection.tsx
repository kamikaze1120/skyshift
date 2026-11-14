function AboutSection() {
  return (
    <section className="mt-10 border-t border-starlight/10 pt-6 text-sm text-starlight/60">
      <p className="mb-2 text-xs uppercase tracking-widest text-starlight/50">A note on what you're seeing</p>
      <p className="mb-3 max-w-2xl">
        SPHEREx maps the entire sky in 102 near-infrared bands. This independent project uses exact archive research
        facts for six targets, but per-epoch cutout image files are not yet connected to this frontend.
      </p>
      <p className="max-w-2xl">
        So the visual area is deliberately a placeholder — not a generated star field. Dates, coordinates, status,
        and DOI are real; every limitation is shown where it matters.
      </p>

      <p className="mb-2 mt-6 text-xs uppercase tracking-widest text-starlight/50">Data citation</p>
      <p className="mb-3 max-w-2xl">
        This publication makes use of data products from the Spectro-Photometer for the History of the Universe,
        Epoch of Reionization and Ices Explorer (SPHEREx), which is a joint project of the Jet Propulsion Laboratory
        and the California Institute of Technology, and is funded by the National Aeronautics and Space
        Administration.
      </p>
      <p className="max-w-2xl">
        Every frame this app serves is from the QR2 Spectral Images release, DOI{' '}
        <a
          href="https://doi.org/10.26131/IRSA652"
          target="_blank"
          rel="noreferrer"
          className="underline hover:text-starlight"
        >
          10.26131/IRSA652
        </a>
        . See the{' '}
        <a
          href="https://irsa.ipac.caltech.edu/ack.html"
          target="_blank"
          rel="noreferrer"
          className="underline hover:text-starlight"
        >
          IRSA acknowledgement guidelines
        </a>{' '}
        and{' '}
        <a
          href="https://irsa.ipac.caltech.edu/data_use_terms.html"
          target="_blank"
          rel="noreferrer"
          className="underline hover:text-starlight"
        >
          IRSA data use terms
        </a>
        .
      </p>

      <p className="mb-2 mt-6 text-xs uppercase tracking-widest text-starlight/50">AI use disclosure</p>
      <p className="max-w-2xl">
        Built for NASA Space Apps 2026, with AI tools assisting ideation, scaffolding, and code, disclosed per the
        challenge rules. No sky/astronomy data is ever AI-generated or fabricated — every image and data point
        traces to a real SPHEREx/IRSA source file.
      </p>

      <p className="mb-2 mt-6 text-xs uppercase tracking-widest text-starlight/50">Privacy</p>
      <p className="max-w-2xl">
        This viewer has no accounts and collects no personal data — no sign-up, no names, no emails. Everything
        shown comes from public SPHEREx/IRSA archive data.
      </p>
    </section>
  )
}

export default AboutSection
