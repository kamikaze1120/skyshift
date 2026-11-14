import { useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import StarfieldBackdrop from './StarfieldBackdrop'
import { useReducedMotion } from '../lib/useReducedMotion'

interface IntroSequenceProps {
  onComplete: () => void
}

const STORY_LINES = [
  'Every six months, SPHEREx maps the whole sky.',
  '102 infrared channels reveal what visible light misses.',
  'Your job: find what changed.',
]

function IntroSequence({ onComplete }: IntroSequenceProps) {
  const reducedMotion = useReducedMotion()
  const completedRef = useRef(false)
  const skipButtonRef = useRef<HTMLButtonElement>(null)

  function complete() {
    if (completedRef.current) return
    completedRef.current = true
    onComplete()
  }

  useEffect(() => {
    skipButtonRef.current?.focus()
  }, [])

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-[#03050a] text-starlight">
      <StarfieldBackdrop />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_75%_40%,rgba(225,123,80,.13),transparent_24%),linear-gradient(90deg,rgba(3,5,10,.98),rgba(3,5,10,.72),rgba(3,5,10,.92))]" aria-hidden="true" />
      <div className="relative flex h-full flex-col px-5 py-5 sm:px-10 sm:py-8 lg:px-16">
        <div className="flex items-center justify-between border-b border-starlight/10 pb-5">
          <div className="flex items-center gap-3">
            <span className="relative grid size-8 place-items-center" aria-hidden="true">
              <span className="absolute h-3.5 w-7 -rotate-12 rounded-[50%] border border-accent-ember/70" />
              <span className="size-1.5 rounded-full bg-starlight" />
            </span>
            <div>
              <p className="display-font text-lg leading-none">Skyshift</p>
              <p className="micro-label mt-1 text-moon/35">A public SPHEREx research tool</p>
            </div>
          </div>
          <p className="micro-label hidden text-moon/30 sm:block">NASA Space Apps · 2026</p>
        </div>

        <div className="grid min-h-0 flex-1 items-center gap-8 py-8 lg:grid-cols-[1fr_340px] lg:gap-20">
          <div className="max-w-3xl">
            <motion.p initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .65 }} className="micro-label text-accent-ember">
              The mission briefing
            </motion.p>
            <motion.h1 initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .8, delay: .15 }} className="display-font mt-5 max-w-[8ch] text-[clamp(4rem,10vw,10rem)] leading-[.78] text-starlight">
              Find the change.
            </motion.h1>

            {reducedMotion ? (
              <p className="mt-8 max-w-md text-sm leading-relaxed text-moon/60">{STORY_LINES[0]} {STORY_LINES[2]}</p>
            ) : (
              <div data-testid="intro-story-drift" className="mt-8 max-w-lg space-y-3 text-sm">
                {STORY_LINES.map((line, index) => (
                  <motion.p
                    key={line}
                    initial={{ opacity: 0, x: -15 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: .65, delay: .8 + index * 1.05 }}
                    className={index === 2 ? 'display-font text-2xl text-accent-ember sm:text-3xl' : 'text-moon/58'}
                  >
                    {line}
                  </motion.p>
                ))}
              </div>
            )}

            <div className="mt-10 flex flex-wrap gap-2">
              <span className="rounded-full border border-starlight/12 bg-starlight/[.04] px-3 py-2 text-[10px] tabular-nums text-moon/55">&gt;1B sky objects</span>
              <span className="rounded-full border border-starlight/12 bg-starlight/[.04] px-3 py-2 text-[10px] tabular-nums text-moon/55">0.75–5.00 µm</span>
              <span className="rounded-full border border-starlight/12 bg-starlight/[.04] px-3 py-2 text-[10px] tabular-nums text-moon/55">102 channels</span>
            </div>
          </div>

          <motion.div initial={{ opacity: 0, scale: .9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 1, delay: .4 }} className="relative hidden aspect-square max-w-[340px] justify-self-center lg:grid place-items-center" aria-hidden="true">
            <div className="absolute inset-0 rounded-full border border-starlight/10" />
            <div className="absolute inset-[12%] rounded-full border border-starlight/10" />
            <div className="absolute inset-[26%] rounded-full border border-accent-ember/25" />
            <div className="absolute inset-[42%] rounded-full bg-accent-ember/20 blur-2xl" />
            <div className="absolute size-20 rounded-full bg-gradient-to-br from-starlight/85 via-accent-ember to-[#3b1820] shadow-[0_0_60px_rgba(225,123,80,.35)]" />
            <div className="absolute h-px w-full rotate-[-28deg] bg-accent-ember/25" />
            <div className="absolute h-2 w-2 -translate-y-36 rounded-full bg-orbit shadow-[0_0_20px_rgba(145,214,232,.85)]" />
            <div className="absolute bottom-10 left-1/2 w-52 -translate-x-1/2 text-center">
              <p className="micro-label text-moon/35">Research starts with a patch</p>
              <p className="mt-2 text-[10px] leading-relaxed text-moon/50">Coordinates in. Real epochs out. Every frame cited.</p>
            </div>
          </motion.div>
        </div>

        <div className="flex items-end justify-between border-t border-starlight/10 pt-5">
          <div className="flex items-center gap-3">
            <span className="micro-label text-accent-ember">01</span>
            <span className="h-px w-16 bg-accent-ember/45" />
            <span className="micro-label text-moon/25">Awaiting your entry</span>
          </div>
          <button
            ref={skipButtonRef}
            type="button"
            aria-label="Enter research bay"
            onClick={event => { event.stopPropagation(); complete() }}
            className="rounded-full border border-starlight/15 px-4 py-2 text-[10px] uppercase tracking-[.15em] text-moon/50 transition hover:border-starlight/30 hover:text-starlight focus-visible:outline-2 focus-visible:outline-accent-ember"
          >
            Enter research bay
          </button>
        </div>
      </div>
    </div>
  )
}

export default IntroSequence
