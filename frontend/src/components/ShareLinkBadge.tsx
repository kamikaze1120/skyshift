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
    await navigator.clipboard?.writeText(url)
    setCopied(true)
    window.setTimeout(() => setCopied(false), COPIED_RESET_MS)
  }

  return (
    <div className="flex items-center gap-2 rounded border border-starlight/20 px-3 py-2 text-xs">
      <span className="break-all text-starlight/70">{url}</span>
      <button
        type="button"
        onClick={handleCopy}
        className="rounded border border-starlight/30 px-2 py-1 focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent-lime"
      >
        {copied ? 'Link copied' : 'Copy link'}
      </button>
    </div>
  )
}

export default ShareLinkBadge
