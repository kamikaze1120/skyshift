import { useState } from 'react'
import type { TargetRecord } from '../fixtures/types'
import NavBar from './NavBar'
import AboutPanel from './AboutPanel'
import SequenceViewer from './SequenceViewer'

interface AppShellProps {
  target: TargetRecord
  curatedTargets: TargetRecord[]
  onTargetSelected: (target: TargetRecord) => void
  onReplayIntro: () => void
  linkNotFound: boolean
}

function AppShell({ target, curatedTargets, onTargetSelected, onReplayIntro, linkNotFound }: AppShellProps) {
  const [aboutOpen, setAboutOpen] = useState(false)

  return (
    <div className="grid h-dvh w-full grid-rows-[auto_1fr] overflow-hidden">
      <NavBar
        curatedTargets={curatedTargets}
        activeTarget={target}
        onTargetSelected={onTargetSelected}
        onReplayIntro={onReplayIntro}
        onToggleAbout={() => setAboutOpen(open => !open)}
        linkNotFound={linkNotFound}
      />
      <div id="viewer" className="relative overflow-y-auto px-3 py-3 sm:px-4 sm:py-4">
        <svg
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 h-full w-full text-starlight"
          preserveAspectRatio="none"
          viewBox="0 0 100 100"
        >
          <line x1="0" y1="0" x2="50" y2="45" stroke="currentColor" strokeOpacity="0.06" strokeWidth="0.15" />
          <line x1="100" y1="0" x2="50" y2="45" stroke="currentColor" strokeOpacity="0.06" strokeWidth="0.15" />
          <line x1="0" y1="100" x2="50" y2="45" stroke="currentColor" strokeOpacity="0.06" strokeWidth="0.15" />
          <line x1="100" y1="100" x2="50" y2="45" stroke="currentColor" strokeOpacity="0.06" strokeWidth="0.15" />
        </svg>
        <div className="relative mx-auto w-full max-w-[1800px]">
          <SequenceViewer target={target} />
          <p data-testid="honesty-badge" className="mt-4 max-w-2xl text-sm text-starlight/60">
            So the visual area is deliberately a placeholder — not a generated star field. Dates, coordinates, status,
            and DOI are real; every limitation is shown where it matters.
          </p>
        </div>
      </div>
      <AboutPanel isOpen={aboutOpen} onClose={() => setAboutOpen(false)} />
    </div>
  )
}

export default AppShell
