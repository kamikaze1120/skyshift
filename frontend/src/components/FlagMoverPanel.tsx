import { useEffect, useState } from 'react'
import { getGlobalFlags, submitFlag, type FlagSummaryEntry } from '../lib/api'

interface FlagMoverPanelProps {
  targetId: string
}

type Status = 'idle' | 'submitting' | 'success' | 'unavailable'

function FlagMoverPanel({ targetId }: FlagMoverPanelProps) {
  const [status, setStatus] = useState<Status>('idle')
  const [tally, setTally] = useState<FlagSummaryEntry[] | null>(null)

  useEffect(() => {
    let cancelled = false
    getGlobalFlags().then(result => {
      if (!cancelled) setTally(result)
    })
    return () => { cancelled = true }
  }, [])

  async function handleFlag() {
    setStatus('submitting')
    const accepted = await submitFlag({ target_id: targetId })
    setStatus(accepted ? 'success' : 'unavailable')
  }

  return (
    <div className="mt-5 rounded-xl border border-starlight/[.07] bg-starlight/[.025] p-4">
      <p className="text-[9px] uppercase tracking-[.22em] text-moon/45">Citizen science</p>
      <h3 className="display-font mt-1 text-sm text-starlight">See something moving?</h3>

      <button
        type="button"
        onClick={handleFlag}
        disabled={status === 'submitting' || status === 'success'}
        className="mt-3 w-full rounded-xl border border-lilac/20 bg-lilac/[.06] px-3 py-2 text-xs text-lilac/85 transition hover:border-lilac/35 hover:bg-lilac/10 focus-visible:outline-2 focus-visible:outline-orbit disabled:cursor-not-allowed disabled:opacity-60"
      >
        {status === 'submitting' ? 'Flagging…' : status === 'success' ? 'Flagged' : 'Flag this as a possible mover'}
      </button>

      {status === 'success' && (
        <p role="status" className="mt-2 text-[10px] leading-relaxed text-orbit/75">
          Flagged — thanks for the catch. Logged for follow-up.
        </p>
      )}
      {status === 'unavailable' && (
        <p role="status" className="mt-2 text-[10px] leading-relaxed text-accent-ember/75">
          Flagging needs the live backend — not connected in this preview.
        </p>
      )}

      <div className="mt-4 border-t border-starlight/[.06] pt-3">
        <p className="text-[9px] uppercase tracking-[.16em] text-moon/35">Who else is watching</p>
        {tally === null && (
          <p className="mt-1.5 text-[10px] leading-relaxed text-moon/45">
            Shared map lights up once the backend is connected.
          </p>
        )}
        {tally !== null && tally.length === 0 && (
          <p className="mt-1.5 text-[10px] leading-relaxed text-moon/45">No flags yet — be the first.</p>
        )}
        {tally !== null && tally.length > 0 && (
          <ul className="mt-1.5 space-y-1">
            {tally.map(entry => (
              <li key={entry.country} className="flex items-center justify-between text-[10px] text-moon/65">
                <span>{entry.country}</span>
                <span className="text-moon/40">{entry.count}</span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}

export default FlagMoverPanel
