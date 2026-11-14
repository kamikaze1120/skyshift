import { useState } from 'react'
import { askSkyshift } from '../lib/api'

interface AssistantPanelProps {
  targetName: string
  channel: number
  onClose?: () => void
}

function AssistantPanel({ targetName, channel, onClose }: AssistantPanelProps) {
  const [question, setQuestion] = useState('')
  const [answer, setAnswer] = useState('')
  const [source, setSource] = useState<'local' | 'backend'>('local')
  const [isLoading, setIsLoading] = useState(false)

  async function respond(event: React.FormEvent) {
    event.preventDefault()
    const normalized = question.toLowerCase()
    setIsLoading(true)
    const backendAnswer = await askSkyshift(question, { targetName, channel })
    if (backendAnswer) {
      setAnswer(backendAnswer)
      setSource('backend')
      setIsLoading(false)
      return
    }
    if (normalized.includes('move') || normalized.includes('different')) {
      setAnswer(`Start with Difference mode and play the observation sequence for ${targetName}. I can explain the change, but the pixels, timestamps, and coordinates always come from the cited SPHEREx frames.`)
    } else if (normalized.includes('spectrum') || normalized.includes('wavelength')) {
      setAnswer(`You are viewing channel ${channel} of 102. Try stepping across the spectral lens to compare how the source responds from 0.75 to 5.00 µm. A generated spectrum will be added when the DR1 cube endpoint is connected.`)
    } else {
      setAnswer(`I can help interpret the selected frames, spectral channel, coverage, or source trail for ${targetName}. Ask what changed, where this frame came from, or which mode to use next.`)
    }
    setSource('local')
    setIsLoading(false)
  }

  return (
    <div className="glass-panel absolute inset-x-4 bottom-24 z-30 max-w-md rounded-2xl border-accent-ember/20 shadow-2xl sm:inset-x-auto sm:right-8 sm:w-96">
      <div className="flex items-center justify-between border-b border-starlight/10 px-4 py-3">
        <div>
          <p className="micro-label text-accent-ember">AI research guide</p>
          <p className="mt-1 text-sm text-starlight">Ask Skyshift</p>
        </div>
        <button type="button" onClick={onClose} className="grid size-7 place-items-center rounded-full border border-starlight/10 text-moon/55 hover:text-starlight" aria-label="Close AI assistant">×</button>
      </div>
      <div className="p-4">
        <p className="text-[10px] leading-relaxed text-moon/50">The guide explains the selected archive results. It does not generate sky pixels or invent measurements.</p>
        {answer && <p className="mt-3 rounded-xl border border-orbit/15 bg-orbit/[.04] px-3 py-2.5 text-xs leading-relaxed text-moon/75"><span className="micro-label mb-2 block text-orbit/60">{source === 'backend' ? 'Connected assistant' : 'Local research guide'}</span>{answer}</p>}
        <form onSubmit={respond} className="mt-3 flex gap-2">
          <label className="sr-only" htmlFor="assistant-question">Ask Skyshift</label>
          <input id="assistant-question" value={question} onChange={event => setQuestion(event.target.value)} placeholder="What changed here?" className="min-w-0 flex-1 rounded-xl border border-starlight/10 bg-black/20 px-3 py-2 text-xs text-starlight outline-none placeholder:text-moon/25 focus:border-accent-ember/45" />
          <button type="submit" disabled={isLoading || !question.trim()} className="rounded-xl bg-accent-ember px-3 text-xs font-medium text-space-950 hover:bg-starlight disabled:cursor-wait disabled:opacity-50">{isLoading ? '…' : 'Ask'}</button>
        </form>
        <div className="mt-3 flex flex-wrap gap-1.5">
          {['What moved?', 'Explain channel 51', 'Where is this from?'].map(prompt => (
            <button key={prompt} type="button" onClick={() => setQuestion(prompt)} className="rounded-full border border-starlight/10 px-2.5 py-1 text-[9px] text-moon/45 hover:text-starlight">{prompt}</button>
          ))}
        </div>
      </div>
    </div>
  )
}

export default AssistantPanel
