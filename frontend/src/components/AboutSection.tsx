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
    </section>
  )
}

export default AboutSection
