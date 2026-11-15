import { useState } from 'react'
import type { TargetRecord } from '../fixtures/types'
import NavBar from './NavBar'
import AboutPanel from './AboutPanel'
import SequenceViewer from './SequenceViewer'
import StarfieldBackdrop from './StarfieldBackdrop'

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
    <div className="relative h-dvh w-full overflow-hidden bg-space-950">
      <StarfieldBackdrop />
      <main id="viewer" className="absolute inset-0">
        <SequenceViewer target={target} />
      </main>
      <NavBar
        curatedTargets={curatedTargets}
        activeTarget={target}
        onTargetSelected={onTargetSelected}
        onReplayIntro={onReplayIntro}
        onToggleAbout={() => setAboutOpen(open => !open)}
        linkNotFound={linkNotFound}
      />
      <AboutPanel isOpen={aboutOpen} onClose={() => setAboutOpen(false)} />
    </div>
  )
}

export default AppShell
