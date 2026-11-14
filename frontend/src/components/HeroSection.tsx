import type { TargetRecord } from '../fixtures/types'

interface HeroSectionProps {
  erosTarget: TargetRecord
  onWatchEros: (target: TargetRecord) => void
}

function hoursBetween(startIso: string, endIso: string): number {
  const ms = new Date(endIso).getTime() - new Date(startIso).getTime()
  return ms / (1000 * 60 * 60)
}

function HeroSection({ erosTarget, onWatchEros }: HeroSectionProps) {
  const [first, last] = erosTarget.observations
  const hours = hoursBetween(first.epoch, last.epoch).toFixed(1)

  return (
    <section className="mb-8 border-b border-starlight/10 pb-8">
      <p className="mb-2 text-xs uppercase tracking-widest text-starlight/50">A living atlas of a moving sky</p>
      <h2 className="mb-4 text-3xl font-semibold leading-tight">
        {hours} hours. <em className="text-accent-ember not-italic">{erosTarget.known_motion_arcsec}″.</em>
      </h2>
      <p className="mb-4 max-w-xl text-sm text-starlight/70">
        In {hours} hours, asteroid {erosTarget.display_name} crossed {erosTarget.known_motion_arcsec} arcseconds of a
        SPHEREx frame while Earth turned beneath it. Press play to watch the measurement unfold — then find your own
        patch of sky.
      </p>
      <button
        type="button"
        onClick={() => onWatchEros(erosTarget)}
        className="rounded border border-accent-ember px-4 py-2 text-sm font-semibold text-accent-ember focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent-ember"
      >
        Watch 433 Eros move
      </button>
      <p className="mt-4 max-w-xl text-xs text-starlight/50">
        This project never fabricates sky pixels. Until real cutouts are connected, every frame is clearly marked as
        a placeholder.
      </p>
    </section>
  )
}

export default HeroSection
