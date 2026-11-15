import type { Observation } from '../fixtures/types'
import { useDifferenceImage } from '../lib/useDifferenceImage'
import { fovToScale } from '../lib/fieldOfView'

interface SkyFrameProps {
  observation: Observation
  index: number
  totalFrames?: number
  modeLabel?: string
  reducedMotion: boolean
  showsMotion: boolean
  displayMode?: 'science' | 'difference' | 'coadded'
  fieldOfView?: number
  baselineImageUrl?: string | null
}

const MARKER_POSITIONS = [
  { top: '42%', left: '71%' },
  { top: '56%', left: '78%' },
  { top: '48%', left: '66%' },
  { top: '61%', left: '74%' },
]

const EPOCH_FORMATTER = new Intl.DateTimeFormat('en', {
  month: 'short',
  day: 'numeric',
  year: 'numeric',
  timeZone: 'UTC',
})

function formatEpoch(epoch: string) {
  const date = new Date(epoch)
  if (Number.isNaN(date.valueOf())) return epoch
  return EPOCH_FORMATTER.format(date)
}

function SkyFrame({ observation, index, totalFrames = 1, modeLabel = 'Science', reducedMotion, showsMotion, displayMode = 'science', fieldOfView = 0.2, baselineImageUrl = null }: SkyFrameProps) {
  const marker = showsMotion ? MARKER_POSITIONS[index % MARKER_POSITIONS.length] : MARKER_POSITIONS[0]
  const hasReferenceImage = !observation.image_url.startsWith('fixture-placeholder')

  const wantsRealDiff = displayMode === 'difference' && hasReferenceImage
  const { status: diffStatus, dataUrl: diffDataUrl } = useDifferenceImage(
    wantsRealDiff ? observation.image_url : null,
    wantsRealDiff ? baselineImageUrl : null
  )
  const hasRealDiff = diffStatus === 'ready' && diffDataUrl !== null
  const displaySrc = hasRealDiff ? diffDataUrl! : observation.image_url

  const imageClass = displayMode === 'difference' && !hasRealDiff
    ? 'grayscale contrast-150 sepia-[.18] hue-rotate-[310deg] saturate-150'
    : displayMode === 'coadded'
      ? 'brightness-125 contrast-110 saturate-75'
      : 'brightness-95 contrast-110'

  const markerClass = 'absolute z-10 -translate-x-1/2 -translate-y-1/2 ' + (reducedMotion ? '' : 'transition-all duration-1000 ease-out')

  return (
    <div className="absolute inset-0 overflow-hidden bg-space-950">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_42%,rgba(46,150,245,.08),transparent_35%),linear-gradient(140deg,var(--color-space-950),var(--color-space-900)_55%,var(--color-space-800))]" />
      <div className="sky-grid absolute inset-0 opacity-70" aria-hidden="true" />
      {!hasReferenceImage && <div className="sky-noise drift-slow absolute -inset-10 opacity-35" aria-hidden="true" />}

      <div className="absolute inset-x-4 top-4 z-10 flex items-start justify-between gap-3 sm:inset-x-6 sm:top-6">
        <div className="glass-panel rounded-xl px-3.5 py-2.5">
          <p className="micro-label text-accent-ember">Research bay</p>
          <p className="mt-1 text-[11px] tabular-nums text-moon/55">
            Epoch {index + 1} of {totalFrames} · {formatEpoch(observation.epoch)} · UTC
          </p>
        </div>
        <div className="glass-panel flex items-center gap-2.5 rounded-xl px-3.5 py-2.5 text-[10px] tabular-nums text-moon/55">
          <span data-testid="frame-mode-label" className="text-starlight/85">{modeLabel} view</span>
          <span className="h-3 w-px bg-starlight/15" />
          <span>{fieldOfView.toFixed(2)}° field</span>
          <span className="h-3 w-px bg-starlight/15" />
          <span className={hasReferenceImage ? 'text-orbit/70' : 'text-accent-ember/70'}>{hasReferenceImage ? 'Reference cutout' : 'Placeholder cutout'}</span>
          {hasRealDiff && (
            <>
              <span className="h-3 w-px bg-starlight/15" />
              <span className="text-orbit/70">Real pixel difference</span>
            </>
          )}
        </div>
      </div>

      <div className="absolute inset-x-4 bottom-24 top-20 flex items-center justify-center sm:inset-x-8 sm:bottom-28 sm:top-24">
        {hasReferenceImage ? (
          <div className="relative aspect-square h-full max-h-[640px] w-auto max-w-[min(78vw,640px)] overflow-hidden rounded-2xl border border-starlight/12 bg-black shadow-[0_24px_90px_rgba(0,0,0,.45)]">
            <img
              src={displaySrc}
              alt={'SPHEREx reference cutout for observation ' + (index + 1) + ', ' + observation.epoch}
              className={'h-full w-full object-cover transition duration-700 ' + imageClass}
              style={{ transform: `scale(${fovToScale(fieldOfView)})` }}
            />
            <div className="pointer-events-none absolute inset-0 ring-1 ring-inset ring-white/[.06]" />
            <span className="pointer-events-none absolute -left-px -top-px size-5 rounded-tl-xl border-l-2 border-t-2 border-orbit/60" aria-hidden="true" />
            <span className="pointer-events-none absolute -right-px -top-px size-5 rounded-tr-xl border-r-2 border-t-2 border-orbit/60" aria-hidden="true" />
            <span className="pointer-events-none absolute -bottom-px -left-px size-5 rounded-bl-xl border-b-2 border-l-2 border-orbit/60" aria-hidden="true" />
            <span className="pointer-events-none absolute -bottom-px -right-px size-5 rounded-br-xl border-b-2 border-r-2 border-orbit/60" aria-hidden="true" />
          </div>
        ) : (
          <div className="relative aspect-square h-full max-h-[640px] w-auto max-w-[min(78vw,640px)] overflow-hidden rounded-2xl border border-starlight/10 bg-black/30 shadow-[0_24px_90px_rgba(0,0,0,.45)]">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_40%,rgba(255,224,180,.24),transparent_2%),radial-gradient(circle_at_20%_75%,rgba(46,150,245,.18),transparent_1%),radial-gradient(circle_at_55%_25%,rgba(255,255,255,.7),transparent_1%)]" />
            <div className="absolute inset-0 opacity-70 [background-image:radial-gradient(circle,rgba(255,255,255,.85)_0_1px,transparent_1.4px)] [background-size:87px_73px]" />
            <div data-marker className={markerClass} style={{ top: marker.top, left: marker.left }}>
              <span className="absolute left-1/2 top-1/2 size-24 -translate-x-1/2 -translate-y-1/2 rounded-full bg-accent-ember/10 blur-xl" />
              <span className="relative block size-11 rounded-full border border-accent-ember/70">
                <span className="absolute inset-2.5 rounded-full border border-accent-ember/30" />
                <span className="absolute left-1/2 top-1/2 size-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-starlight shadow-[0_0_12px_rgba(255,255,255,.95)]" />
              </span>
              <span className="absolute left-14 top-1/2 w-max -translate-y-1/2">
                <span className="micro-label block text-accent-ember">Tracked source</span>
                <span className="mt-1 block text-[9px] text-moon/35">epoch {index + 1}</span>
              </span>
            </div>
            <span className="pointer-events-none absolute -left-px -top-px size-5 rounded-tl-xl border-l-2 border-t-2 border-orbit/60" aria-hidden="true" />
            <span className="pointer-events-none absolute -right-px -top-px size-5 rounded-tr-xl border-r-2 border-t-2 border-orbit/60" aria-hidden="true" />
            <span className="pointer-events-none absolute -bottom-px -left-px size-5 rounded-bl-xl border-b-2 border-l-2 border-orbit/60" aria-hidden="true" />
            <span className="pointer-events-none absolute -bottom-px -right-px size-5 rounded-br-xl border-b-2 border-r-2 border-orbit/60" aria-hidden="true" />
          </div>
        )}
      </div>
    </div>
  )
}

export default SkyFrame
