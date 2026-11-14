import type { Observation } from '../fixtures/types'

interface SkyFrameProps {
  observation: Observation
  index: number
  reducedMotion: boolean
  showsMotion: boolean
}

const MARKER_POSITIONS = [
  { top: '30%', left: '40%' },
  { top: '55%', left: '62%' },
  { top: '42%', left: '25%' },
  { top: '68%', left: '48%' },
]

function SkyFrame({ observation, index, reducedMotion, showsMotion }: SkyFrameProps) {
  // Only targets with a known, visually dramatic motion get a marker that
  // moves between frames (see SequenceViewer's showsMotion threshold) —
  // otherwise the marker would depict motion the fixture data doesn't claim.
  const marker = showsMotion ? MARKER_POSITIONS[index % MARKER_POSITIONS.length] : MARKER_POSITIONS[0]

  return (
    <div className="relative aspect-square w-full overflow-hidden rounded-lg bg-gradient-to-br from-space-950 via-[#121428] to-space-950">
      <p className="absolute left-2 top-2 text-[10px] uppercase tracking-wide text-starlight/50">
        Frame {index + 1}
      </p>
      <div
        data-marker
        className={`absolute h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full bg-accent-ember ${reducedMotion ? '' : 'transition-all duration-700 ease-out'}`}
        style={{ top: marker.top, left: marker.left }}
      />
      <p className="absolute bottom-2 left-2 right-2 text-xs text-starlight/60">
        Placeholder visual — no real cutout image exists for this epoch yet ({observation.epoch})
      </p>
    </div>
  )
}

export default SkyFrame
