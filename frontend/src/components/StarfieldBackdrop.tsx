const STAR_COUNT = 150

function seededRandom(seed: number) {
  const x = Math.sin(seed) * 10000
  return x - Math.floor(x)
}

const stars = Array.from({ length: STAR_COUNT }, (_, i) => ({
  top: `${seededRandom(i * 3 + 1) * 100}%`,
  left: `${seededRandom(i * 7 + 2) * 100}%`,
  size: seededRandom(i * 11 + 3) > 0.88 ? 2 : 1,
  opacity: 0.12 + seededRandom(i * 13 + 5) * 0.45,
}))

function StarfieldBackdrop() {
  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      <div className="absolute -left-40 -top-40 size-[32rem] rounded-full bg-lilac/10 blur-[120px]" />
      <div className="absolute -right-40 top-10 size-[30rem] rounded-full bg-orbit/8 blur-[120px]" />
      {stars.map((star, i) => (
        <span
          key={i}
          className="absolute rounded-full bg-starlight"
          style={{ top: star.top, left: star.left, width: star.size, height: star.size, opacity: star.opacity }}
        />
      ))}
    </div>
  )
}

export default StarfieldBackdrop
