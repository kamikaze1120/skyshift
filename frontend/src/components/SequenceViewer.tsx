import { useEffect, useState } from 'react'
import type { TargetRecord } from '../fixtures/types'
import { useReducedMotion } from '../lib/useReducedMotion'
import { AUTOPLAY_INTRO_MS } from '../lib/constants'
import SkyFrame from './SkyFrame'
import PlaybackScrubber from './PlaybackScrubber'
import SourcePanel from './SourcePanel'
import FlagMoverPanel from './FlagMoverPanel'
import SpectralControls from './SpectralControls'
import AssistantPanel from './AssistantPanel'

interface SequenceViewerProps {
  target: TargetRecord
}

const SHOWS_MOTION_THRESHOLD_ARCSEC = 50
type DisplayMode = 'science' | 'difference' | 'coadded'

const MODE_DEFINITIONS: Array<{
  id: DisplayMode
  number: string
  label: string
  short: string
  description: string
}> = [
  {
    id: 'science',
    number: '01',
    label: 'Science',
    short: 'Original frame',
    description: 'The cited detector image as it was observed. Start here before interpreting change.',
  },
  {
    id: 'difference',
    number: '02',
    label: 'Difference',
    short: 'Find change',
    description: 'Subtracts one epoch from another to make motion or brightness changes easier to spot.',
  },
  {
    id: 'coadded',
    number: '03',
    label: 'Co-added',
    short: 'Reveal faint signal',
    description: 'Combines aligned exposures to strengthen a faint source. The local demo marks this view as illustrative.',
  },
]

function SequenceViewer({ target }: SequenceViewerProps) {
  const lastIndex = target.observations.length - 1
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [displayMode, setDisplayMode] = useState<DisplayMode>('science')
  const [fieldOfView, setFieldOfView] = useState(target.size_deg)
  const [channel, setChannel] = useState(51)
  const [assistantOpen, setAssistantOpen] = useState(false)
  const reducedMotion = useReducedMotion()

  useEffect(() => {
    setCurrentIndex(0)
    setIsPlaying(false)
    setDisplayMode('science')
    setFieldOfView(target.size_deg)
    setChannel(51)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [target.target_id])

  useEffect(() => {
    if (!isPlaying) return
    if (reducedMotion) {
      setCurrentIndex(lastIndex)
      setIsPlaying(false)
      return
    }
    const stepMs = AUTOPLAY_INTRO_MS / Math.max(1, lastIndex)
    const interval = setInterval(() => {
      setCurrentIndex(index => {
        const next = index + 1
        if (next >= lastIndex) {
          clearInterval(interval)
          setIsPlaying(false)
          return lastIndex
        }
        return next
      })
    }, stepMs)
    return () => clearInterval(interval)
  }, [isPlaying, reducedMotion, lastIndex])

  const observation = target.observations[currentIndex]
  const showsMotion = (target.known_motion_arcsec ?? 0) > SHOWS_MOTION_THRESHOLD_ARCSEC
  const activeMode = MODE_DEFINITIONS.find(mode => mode.id === displayMode) ?? MODE_DEFINITIONS[0]

  return (
    <section className="relative h-full overflow-hidden bg-[#05070d] pt-20">
      <div className="flex h-full min-h-0 flex-col lg:grid lg:grid-cols-[minmax(0,1fr)_380px]">
        <div className="relative min-h-0 flex-1 overflow-hidden border-b border-starlight/10 lg:border-b-0 lg:border-r">
          <div className="pointer-events-none absolute inset-x-0 top-0 z-20 flex items-center justify-between px-5 py-4 sm:px-8">
            <div>
              <p className="micro-label text-accent-ember">Research bay</p>
              <p className="mt-1 text-[10px] text-moon/35">Visual evidence · frame {currentIndex + 1} of {target.observations.length}</p>
            </div>
            <span className="rounded-full border border-starlight/10 bg-space-950/70 px-3 py-1.5 text-[9px] text-moon/45 backdrop-blur-md">
              {activeMode.label} view
            </span>
          </div>

          <SkyFrame observation={observation} index={currentIndex} reducedMotion={reducedMotion} showsMotion={showsMotion} displayMode={displayMode} fieldOfView={fieldOfView} baselineImageUrl={target.observations[0].image_url} />

          <div className="pointer-events-none absolute inset-x-4 bottom-4 z-20 sm:inset-x-8 sm:bottom-6">
            <div className="pointer-events-auto mx-auto max-w-3xl rounded-2xl border border-starlight/10 bg-space-950/85 px-4 py-3 shadow-2xl backdrop-blur-xl sm:px-5">
              <PlaybackScrubber
                observationCount={target.observations.length}
                currentIndex={currentIndex}
                isPlaying={isPlaying}
                onIndexChange={setCurrentIndex}
                onPlayPauseToggle={() => setIsPlaying(p => !p)}
                epochLabels={target.observations.map(o => o.epoch)}
              />
            </div>
          </div>
        </div>

        <aside className="soft-scrollbar relative min-h-0 overflow-y-auto bg-[#080b12]">
          <div className="border-b border-starlight/10 px-4 py-4 sm:px-5">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="micro-label text-moon/35">Selected patch · {target.object_type.replace('_', ' ')}</p>
                <h1 className="display-font mt-1 text-3xl leading-none text-starlight">{target.display_name}</h1>
              </div>
              <span className={`rounded-full border px-2 py-1 text-[9px] uppercase tracking-[.12em] ${target.verified ? 'border-orbit/20 text-orbit/70' : 'border-accent-ember/20 text-accent-ember/70'}`}>
                {target.verified ? 'Verified' : 'Review'}
              </span>
            </div>
            <p className="mt-3 text-[10px] leading-relaxed text-moon/45">{target.story_note}</p>
            <div className="mt-4 flex flex-wrap gap-x-4 gap-y-2 text-[9px] tabular-nums text-moon/50">
              <span><span className="text-moon/25">RA</span> {target.coordinates.ra_deg.toFixed(4)}°</span>
              <span><span className="text-moon/25">DEC</span> {target.coordinates.dec_deg >= 0 ? '+' : ''}{target.coordinates.dec_deg.toFixed(4)}°</span>
              <span><span className="text-moon/25">FOV</span> {fieldOfView.toFixed(2)}°</span>
            </div>
          </div>

          <section className="border-b border-starlight/10 px-4 py-4 sm:px-5" aria-labelledby="view-lens-title">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="micro-label text-moon/35">01 · View lens</p>
                <h2 id="view-lens-title" className="mt-1 text-sm text-starlight">What are you looking for?</h2>
              </div>
              <span className="text-[9px] text-moon/30">Choose one</span>
            </div>
            <div role="tablist" aria-label="Evidence view" className="mt-3 grid grid-cols-3 gap-1.5">
              {MODE_DEFINITIONS.map(mode => (
                <button
                  key={mode.id}
                  type="button"
                  role="tab"
                  aria-selected={displayMode === mode.id}
                  aria-label={`${mode.label}: ${mode.short}`}
                  onClick={() => setDisplayMode(mode.id)}
                  className={`rounded-xl border px-2.5 py-2.5 text-left transition focus-visible:outline-1 focus-visible:outline-accent-ember ${displayMode === mode.id ? 'border-starlight/30 bg-starlight/[.09]' : 'border-starlight/[.07] bg-starlight/[.02] hover:bg-starlight/[.05]'}`}
                >
                  <span className="micro-label block text-moon/30">{mode.number}</span>
                  <span className="mt-2 block text-[11px] text-starlight">{mode.label}</span>
                  <span className="mt-1 block text-[8px] leading-tight text-moon/35">{mode.short}</span>
                </button>
              ))}
            </div>
            <div className="mt-3 rounded-xl border border-starlight/8 bg-starlight/[.025] px-3 py-2.5">
              <p className="text-[10px] text-starlight">{activeMode.label} · {activeMode.short}</p>
              <p className="mt-1 text-[9px] leading-relaxed text-moon/40">{activeMode.description}</p>
            </div>
          </section>

          <SpectralControls channel={channel} onChannelChange={setChannel} />

          <section className="border-t border-starlight/10 px-4 py-4 sm:px-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="micro-label text-moon/35">03 · Frame</p>
                <p className="mt-1 text-sm text-starlight">Set the field of view</p>
              </div>
              <span className="text-[9px] tabular-nums text-moon/45">{fieldOfView.toFixed(2)}°</span>
            </div>
            <input type="range" role="presentation" min="0.05" max="0.5" step="0.05" value={fieldOfView} onChange={event => setFieldOfView(Number(event.target.value))} aria-label="Field of view" className="mt-3 h-1 w-full accent-accent-ember" />
            <div className="mt-2 flex justify-between text-[8px] text-moon/25"><span>Wide context</span><span>Close detail</span></div>
          </section>

          <SourcePanel observation={observation} verified={target.verified} storyNote={target.story_note} />

          <div className="px-4 sm:px-5">
            <FlagMoverPanel targetId={target.target_id} />
          </div>

          <section className="border-t border-starlight/10 px-4 py-4 sm:px-5">
            <button type="button" onClick={() => setAssistantOpen(open => !open)} className="flex w-full items-center justify-between rounded-xl border border-accent-ember/20 bg-accent-ember/[.045] px-3 py-3 text-left transition hover:bg-accent-ember/[.08] focus-visible:outline-1 focus-visible:outline-accent-ember">
              <span>
                <span className="micro-label block text-accent-ember">Ask the guide</span>
                <span className="mt-1 block text-sm text-starlight">Explain this evidence</span>
              </span>
              <span className="grid size-7 place-items-center rounded-full border border-accent-ember/25 text-accent-ember">✦</span>
            </button>
          </section>

          <p data-testid="honesty-badge" className="mx-4 mb-5 rounded-xl border border-starlight/8 bg-starlight/[.02] px-3 py-2.5 text-[9px] leading-relaxed text-moon/30">
            Local placeholder/reference cutouts are labeled. Difference view computes a real pixel subtraction when two real epochs are available, falling back to illustrative styling otherwise. Co-added styling stays illustrative until the live IRSA analysis endpoint is connected.
          </p>
        </aside>
      </div>

      {assistantOpen && <AssistantPanel targetName={target.display_name} channel={channel} onClose={() => setAssistantOpen(false)} />}
    </section>
  )
}

export default SequenceViewer
