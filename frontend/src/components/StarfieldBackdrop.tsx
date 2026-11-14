const STAR_COUNT = 140

function seededRandom(seed: number) {
  const x = Math.sin(seed) * 10000
  return x - Math.floor(x)
}

const stars = Array.from({ length: STAR_COUNT }, (_, i) => ({
  top: `${seededRandom(i * 3 + 1) * 100}%`,
  left: `${seededRandom(i * 7 + 2) * 100}%`,
  size: seededRandom(i * 11 + 3) > 0.85 ? 2 : 1,
  opacity: 0.3 + seededRandom(i * 13 + 5) * 0.7,
}))

function StarfieldBackdrop() {
  return (
    <div
      aria-hidden="true"
      className="fixed inset-0 -z-10 overflow-hidden bg-space-950"
    >
      {stars.map((star, i) => (
        <span
          key={i}
          className="absolute rounded-full bg-starlight"
          style={{
            top: star.top,
            left: star.left,
            width: star.size,
            height: star.size,
            opacity: star.opacity,
          }}
        />
      ))}
    </div>
  )
}

export default StarfieldBackdrop
