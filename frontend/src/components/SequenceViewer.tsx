import { useEffect, useState } from 'react'
import type { TargetRecord } from '../fixtures/types'
import { useReducedMotion } from '../lib/useReducedMotion'
import { AUTOPLAY_INTRO_MS } from '../lib/constants'
import { getLoggedDetector } from '../lib/spherexBands'
import SkyFrame from './SkyFrame'
import PlaybackScrubber from './PlaybackScrubber'
import SourcePanel from './SourcePanel'
import BandSelector from './BandSelector'

interface SequenceViewerProps {
  target: TargetRecord
}

// Only a target with motion well above the sensor's noise floor gets a
// marker that visibly jumps between frames (see SkyFrame's showsMotion prop).
const SHOWS_MOTION_THRESHOLD_ARCSEC = 50

function SequenceViewer({ target }: SequenceViewerProps) {
  const lastIndex = target.observations.length - 1
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [selectedBand, setSelectedBand] = useState(1)
  const reducedMotion = useReducedMotion()

  // Switching targets reuses this component instance (no remount), so
  // playback state has to be reset explicitly rather than relying on
  // useState's initializer, which only runs once.
  useEffect(() => {
    setCurrentIndex(0)
    setIsPlaying(false)
    setSelectedBand(1)
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

  return (
    <div className="grid gap-4 md:grid-cols-[minmax(0,1.65fr)_minmax(260px,0.65fr)]">
      <div className="flex flex-col gap-4">
        <SkyFrame observation={observation} index={currentIndex} reducedMotion={reducedMotion} showsMotion={showsMotion} />
        <PlaybackScrubber
          observationCount={target.observations.length}
          currentIndex={currentIndex}
          isPlaying={isPlaying}
          onIndexChange={setCurrentIndex}
          onPlayPauseToggle={() => setIsPlaying(p => !p)}
          epochLabels={target.observations.map(o => o.epoch)}
        />
        <BandSelector
          selectedBand={selectedBand}
          onBandChange={setSelectedBand}
          loggedDetector={getLoggedDetector(observation.wavelength_band)}
        />
      </div>
      <SourcePanel observation={observation} verified={target.verified} storyNote={target.story_note} />
    </div>
  )
}

export default SequenceViewer
