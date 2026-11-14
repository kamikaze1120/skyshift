import { useEffect, useState } from 'react'
import type { TargetRecord } from '../fixtures/types'
import { useReducedMotion } from '../lib/useReducedMotion'
import { AUTOPLAY_INTRO_MS } from '../lib/constants'
import SkyFrame from './SkyFrame'
import PlaybackScrubber from './PlaybackScrubber'
import NarrativeOverlay from './NarrativeOverlay'
import SourcePanel from './SourcePanel'

interface SequenceViewerProps {
  target: TargetRecord
  autoplayNarration: string | null
}

// Only a target with motion well above the sensor's noise floor gets a
// marker that visibly jumps between frames (see SkyFrame's showsMotion prop).
const SHOWS_MOTION_THRESHOLD_ARCSEC = 50

function SequenceViewer({ target, autoplayNarration }: SequenceViewerProps) {
  const lastIndex = target.observations.length - 1
  const isDeepLink = autoplayNarration === null
  const [currentIndex, setCurrentIndex] = useState(isDeepLink ? lastIndex : 0)
  const [isPlaying, setIsPlaying] = useState(!isDeepLink)
  const [autoplayDone, setAutoplayDone] = useState(isDeepLink)
  const reducedMotion = useReducedMotion()

  // Switching targets reuses this component instance (no remount), so
  // playback state has to be reset explicitly rather than relying on
  // useState's initializer, which only runs once.
  useEffect(() => {
    setCurrentIndex(isDeepLink ? lastIndex : 0)
    setIsPlaying(!isDeepLink)
    setAutoplayDone(isDeepLink)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [target.target_id])

  useEffect(() => {
    if (!isPlaying) return
    if (reducedMotion) {
      setCurrentIndex(lastIndex)
      setIsPlaying(false)
      setAutoplayDone(true)
      return
    }
    const stepMs = AUTOPLAY_INTRO_MS / Math.max(1, lastIndex)
    const interval = setInterval(() => {
      setCurrentIndex(index => {
        const next = index + 1
        if (next >= lastIndex) {
          clearInterval(interval)
          setIsPlaying(false)
          setAutoplayDone(true)
          return lastIndex
        }
        return next
      })
    }, stepMs)
    return () => clearInterval(interval)
  }, [isPlaying, reducedMotion, lastIndex])

  const observation = target.observations[currentIndex]
  const showSourcePanel = isDeepLink || autoplayDone
  const showsMotion = (target.known_motion_arcsec ?? 0) > SHOWS_MOTION_THRESHOLD_ARCSEC

  return (
    <div className="flex flex-col gap-4">
      <SkyFrame observation={observation} index={currentIndex} reducedMotion={reducedMotion} showsMotion={showsMotion} />
      {autoplayNarration !== null && <NarrativeOverlay text={autoplayNarration} reducedMotion={reducedMotion} />}
      <PlaybackScrubber
        observationCount={target.observations.length}
        currentIndex={currentIndex}
        isPlaying={isPlaying}
        onIndexChange={setCurrentIndex}
        onPlayPauseToggle={() => setIsPlaying(p => !p)}
        epochLabels={target.observations.map(o => o.epoch)}
      />
      {showSourcePanel && <SourcePanel observation={observation} verified={target.verified} storyNote={target.story_note} />}
    </div>
  )
}

export default SequenceViewer
