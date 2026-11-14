import { SPHEREX_BAND_COUNT, getBand } from '../lib/spherexBands'

interface BandSelectorProps {
  selectedBand: number
  onBandChange: (band: number) => void
  loggedDetector: string | null
}

function BandSelector({ selectedBand, onBandChange, loggedDetector }: BandSelectorProps) {
  const band = getBand(selectedBand)

  function handleKeyDown(event: React.KeyboardEvent) {
    if (event.key === 'ArrowRight' || event.key === 'ArrowUp') {
      event.preventDefault()
      onBandChange(Math.min(SPHEREX_BAND_COUNT, band.index + 1))
    } else if (event.key === 'ArrowLeft' || event.key === 'ArrowDown') {
      event.preventDefault()
      onBandChange(Math.max(1, band.index - 1))
    } else if (event.key === 'Home') {
      event.preventDefault()
      onBandChange(1)
    } else if (event.key === 'End') {
      event.preventDefault()
      onBandChange(SPHEREX_BAND_COUNT)
    }
  }

  function handlePointerDown(event: React.PointerEvent<HTMLDivElement>) {
    const rect = event.currentTarget.getBoundingClientRect()
    const fraction = rect.width > 0 ? (event.clientX - rect.left) / rect.width : 0
    const index = Math.round(Math.min(1, Math.max(0, fraction)) * (SPHEREX_BAND_COUNT - 1)) + 1
    onBandChange(index)
  }

  const matchesLogged = loggedDetector !== null && loggedDetector === band.detector

  return (
    <div className="flex flex-col gap-1.5 rounded border border-starlight/10 p-3">
      <div className="flex items-center justify-between font-mono text-[11px] uppercase tracking-wide text-starlight/50">
        <span>Band {band.index} of {SPHEREX_BAND_COUNT}</span>
        <span>
          ~{band.wavelengthUm.toFixed(2)} μm (approx.) · Detector {band.detector}
        </span>
      </div>
      <div
        role="slider"
        tabIndex={0}
        aria-label="Band"
        aria-valuemin={1}
        aria-valuemax={SPHEREX_BAND_COUNT}
        aria-valuenow={band.index}
        onKeyDown={handleKeyDown}
        onPointerDown={handlePointerDown}
        className="h-2 cursor-pointer rounded-full bg-starlight/20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent-lime"
      >
        <div
          className="h-2 rounded-full bg-accent-lime"
          style={{ width: `${((band.index - 1) / (SPHEREX_BAND_COUNT - 1)) * 100}%` }}
        />
      </div>
      <p className="font-mono text-[10px] text-starlight/50">
        {matchesLogged
          ? 'This detector is logged for this observation.'
          : loggedDetector === null
            ? 'Detector not logged for this observation — the fixture data never recorded which array was used.'
            : `This observation's logged detector (${loggedDetector}) is at a different band position.`}
      </p>
    </div>
  )
}

export default BandSelector
