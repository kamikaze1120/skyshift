import { useState } from 'react'
import type { TargetRecord } from '../fixtures/types'
import { buildTargetParams } from '../lib/urlParams'

interface ShareLinkBadgeProps {
  target: TargetRecord
}

const COPIED_RESET_MS = 1800

function ShareLinkBadge({ target }: ShareLinkBadgeProps) {
  const url = `${window.location.origin}${window.location.pathname}${buildTargetParams(target)}`
  const [copied, setCopied] = useState(false)

  async function handleCopy() {
    try {
      await navigator.clipboard?.writeText(url)
    } catch {
      return
    }
    setCopied(true)
    window.setTimeout(() => setCopied(false), COPIED_RESET_MS)
  }

  return (
    <div>
      <span className="sr-only">{url}</span>
      <button
        type="button"
        onClick={handleCopy}
        className={`flex h-9 items-center gap-2 rounded-xl border px-3 text-xs transition focus-visible:outline-2 focus-visible:outline-orbit ${copied ? 'border-orbit/30 bg-orbit/10 text-orbit' : 'border-transparent text-moon/60 hover:border-starlight/10 hover:bg-starlight/[.05] hover:text-starlight'}`}
        aria-label={copied ? 'Link copied' : 'Copy link'}
        title="Copy share link"
      >
        <svg viewBox="0 0 20 20" className="size-4" aria-hidden="true"><path d="M8 12 12 8M6.5 14.5l-1 1a3 3 0 0 1-4-4l3-3a3 3 0 0 1 4.2 0M13.5 5.5l1-1a3 3 0 0 1 4 4l-3 3a3 3 0 0 1-4.2 0" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" /></svg>
        <span className="hidden lg:inline">{copied ? 'Link copied' : 'Share'}</span>
      </button>
    </div>
  )
}

export default ShareLinkBadge
