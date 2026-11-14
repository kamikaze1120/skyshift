import { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import StarfieldBackdrop from './StarfieldBackdrop'
import { useReducedMotion } from '../lib/useReducedMotion'
import { createAmbientDrone } from '../lib/ambientAudio'

interface IntroSequenceProps {
  onComplete: () => void
}

const WORDMARK_MS = 1000
const STORY_MS = 4500
const REDUCED_MOTION_MS = 1000

const STORY_LINES = [
  'Every six months, SPHEREx rephotographs the entire sky.',
  'Most points of light never move.',
  '433 Eros did.',
  '604 arcseconds in 8.1 hours — real SPHEREx data, not a simulation.',
]

function IntroSequence({ onComplete }: IntroSequenceProps) {
  const reducedMotion = useReducedMotion()
  const completedRef = useRef(false)
  const skipButtonRef = useRef<HTMLButtonElement>(null)
  const droneRef = useRef(createAmbientDrone())
  const [soundOn, setSoundOn] = useState(false)

  useEffect(() => {
    return () => droneRef.current?.stop()
  }, [])

  function toggleSound() {
    const drone = droneRef.current
    if (!drone) return
    if (soundOn) {
      drone.stop()
      setSoundOn(false)
    } else {
      drone.start()
      setSoundOn(true)
    }
  }

  function complete() {
    if (completedRef.current) return
    completedRef.current = true
    onComplete()
  }

  useEffect(() => {
    const totalMs = reducedMotion ? REDUCED_MOTION_MS : WORDMARK_MS + STORY_MS
    const timeout = setTimeout(complete, totalMs)
    return () => clearTimeout(timeout)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reducedMotion])

  // Whatever control the user clicked to get here (e.g. "Replay intro")
  // would otherwise keep focus underneath this overlay, so Escape/Enter/
  // Space skipping the intro would also re-trigger that control's own
  // default key activation on the same keypress. Moving focus into the
  // overlay, plus preventDefault below, stops that double-activation.
  useEffect(() => {
    skipButtonRef.current?.focus()
  }, [])

  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape' || event.key === 'Enter' || event.key === ' ') {
        event.preventDefault()
        complete()
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div
      className="fixed inset-0 z-50 flex flex-col items-center justify-center overflow-hidden bg-space-950 text-starlight"
      onClick={complete}
    >
      <StarfieldBackdrop />
      <div
        aria-hidden="true"
        className="absolute left-1/2 top-1/2 h-64 w-64 -translate-x-1/2 -translate-y-1/2 rounded-full border border-accent-amber/15"
      />
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: reducedMotion ? 0.3 : 0.8 }}
        className="font-display text-4xl italic tracking-wide text-starlight"
      >
        Skyshift
      </motion.p>
      {reducedMotion ? (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3, delay: 0.3 }}
          className="mt-4 max-w-md text-center font-mono text-sm text-accent-amber"
        >
          {STORY_LINES[2]}
        </motion.p>
      ) : (
        <div data-testid="intro-story-drift" className="mt-6 flex max-w-md flex-col items-center gap-2 text-center font-mono text-sm">
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: WORDMARK_MS / 1000 }}
            className="text-starlight/60"
          >
            {STORY_LINES[0]}
          </motion.p>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: WORDMARK_MS / 1000 + 1 }}
            className="text-starlight/70"
          >
            {STORY_LINES[1]}
          </motion.p>
          <motion.p
            initial={{ opacity: 0, x: -12 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: WORDMARK_MS / 1000 + 2 }}
            className="text-lg text-accent-amber"
          >
            {STORY_LINES[2]}
          </motion.p>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: WORDMARK_MS / 1000 + 3.2 }}
            className="text-starlight"
          >
            {STORY_LINES[3]}
          </motion.p>
        </div>
      )}
      {droneRef.current && (
        <button
          type="button"
          onClick={event => {
            event.stopPropagation()
            toggleSound()
          }}
          className="absolute bottom-6 left-6 rounded border border-starlight/20 px-3 py-1.5 font-mono text-[11px] uppercase tracking-wide text-starlight/60 hover:text-starlight focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent-amber"
        >
          Sound: {soundOn ? 'on' : 'off'}
        </button>
      )}
      <button
        ref={skipButtonRef}
        type="button"
        onClick={event => {
          event.stopPropagation()
          complete()
        }}
        className="absolute bottom-6 right-6 rounded border border-starlight/20 px-3 py-1.5 font-mono text-[11px] uppercase tracking-wide text-starlight/60 hover:text-starlight focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent-amber"
      >
        Skip intro
      </button>
    </div>
  )
}

export default IntroSequence
