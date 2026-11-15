import { useState } from 'react'
import { motion } from 'framer-motion'
import type { TargetRecord } from '../fixtures/types'
import { useReducedMotion } from '../lib/useReducedMotion'
import SkyScanBackdrop3D from './SkyScanBackdrop3D'

interface TargetSelectionScreenProps {
  targets: TargetRecord[]
  onTargetChosen: (target: TargetRecord) => void
  onDismiss?: () => void
}

function objectTypeLabel(type: TargetRecord['object_type']) {
  return type.replace('_', ' ')
}

function TargetSelectionScreen({ targets, onTargetChosen, onDismiss }: TargetSelectionScreenProps) {
  const reducedMotion = useReducedMotion()
  const [previewing, setPreviewing] = useState<TargetRecord | null>(null)

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-space-950 text-starlight">
      <div className="brand-gradient absolute inset-0" aria-hidden="true" />
      <SkyScanBackdrop3D reducedMotion={reducedMotion} />

      <motion.div
        initial={reducedMotion ? undefined : { opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
        className="relative flex h-full flex-col overflow-y-auto px-5 py-8 sm:px-10 lg:px-16"
      >
        <div className="flex items-start justify-between gap-4 border-b border-starlight/10 pb-5">
          <div>
            <p className="micro-label text-accent-ember">Mission briefing · 02</p>
            <h1 className="display-font mt-2 text-3xl sm:text-5xl">Choose your target</h1>
            <p className="mt-3 max-w-xl text-sm leading-relaxed text-moon/60">
              NASA named five objects for this challenge. Pick one to open its research bay — real
              SPHEREx archive data, every frame cited.
            </p>
          </div>
          {onDismiss && (
            <button
              type="button"
              onClick={onDismiss}
              className="micro-label shrink-0 whitespace-nowrap rounded-full border border-starlight/15 px-4 py-2 text-moon/55 transition hover:border-starlight/30 hover:text-starlight focus-visible:outline-2 focus-visible:outline-accent-ember"
            >
              ← Back to research bay
            </button>
          )}
        </div>

        <div role="list" aria-label="NASA-named targets" className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {targets.map(target => (
            <button
              key={target.target_id}
              type="button"
              role="listitem"
              aria-label={target.display_name}
              onClick={() => setPreviewing(target)}
              className="group flex flex-col items-start rounded-2xl border border-starlight/12 bg-starlight/[.04] p-5 text-left backdrop-blur-sm transition hover:border-neon-blue/50 hover:bg-starlight/[.08] focus-visible:outline-2 focus-visible:outline-accent-ember"
            >
              <span
                className={`rounded-full border px-2 py-1 text-[9px] uppercase tracking-[.14em] ${
                  target.verified ? 'border-orbit/25 text-orbit/75' : 'border-accent-ember/25 text-accent-ember/75'
                }`}
              >
                {target.verified ? 'Confirmed' : 'Needs check'}
              </span>
              <span className="display-font mt-3 text-xl">{target.display_name}</span>
              <span className="micro-label mt-1 text-moon/40">{objectTypeLabel(target.object_type)}</span>
            </button>
          ))}
        </div>
      </motion.div>

      {previewing && (
        <div className="fixed inset-0 z-10 flex items-center justify-center bg-space-950/90 p-4 backdrop-blur-xl" role="presentation">
          <motion.div
            initial={reducedMotion ? undefined : { opacity: 0, y: 20, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            className="w-full max-w-lg rounded-3xl border border-starlight/15 bg-starlight p-7 text-space-950 shadow-2xl"
          >
            <p className="micro-label text-space-950/45">{objectTypeLabel(previewing.object_type)}</p>
            <h2 className="display-font mt-2 text-3xl">{previewing.display_name}</h2>
            <p className="mt-4 text-sm leading-relaxed text-space-950/75">{previewing.story_note}</p>
            <div className="mt-6 flex items-center justify-between gap-3">
              <button
                type="button"
                onClick={() => setPreviewing(null)}
                className="text-xs text-space-950/50 underline-offset-2 hover:underline focus-visible:outline-2 focus-visible:outline-electric-blue"
              >
                Back
              </button>
              <button
                type="button"
                onClick={() => onTargetChosen(previewing)}
                className="rounded-full bg-space-950 px-5 py-3 text-xs uppercase tracking-[.12em] text-starlight transition hover:bg-electric-blue focus-visible:outline-2 focus-visible:outline-electric-blue"
              >
                Begin research
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  )
}

export default TargetSelectionScreen
