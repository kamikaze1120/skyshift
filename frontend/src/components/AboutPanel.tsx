import { useEffect } from 'react'
import AboutSection from './AboutSection'

interface AboutPanelProps {
  isOpen: boolean
  onClose: () => void
}

function AboutPanel({ isOpen, onClose }: AboutPanelProps) {
  useEffect(() => {
    if (!isOpen) return
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, onClose])

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-40 flex justify-end bg-space-950/45 p-2 backdrop-blur-sm sm:p-4" role="presentation" onMouseDown={event => { if (event.currentTarget === event.target) onClose() }}>
      <div className="glass-panel soft-scrollbar h-full w-full max-w-md overflow-y-auto rounded-2xl p-5 shadow-2xl">
        <div className="sticky top-0 z-10 mb-5 flex items-center justify-between rounded-xl border border-starlight/10 bg-space-900/80 px-3 py-2 backdrop-blur-xl">
          <div>
            <p className="text-[9px] uppercase tracking-[.2em] text-orbit/55">Mission context</p>
            <p className="display-font text-lg text-starlight">About Skyshift</p>
          </div>
          <button type="button" onClick={onClose} className="grid size-8 place-items-center rounded-full border border-starlight/10 text-moon/60 transition hover:bg-starlight/[.06] hover:text-starlight focus-visible:outline-2 focus-visible:outline-orbit" aria-label="Close">
            <svg viewBox="0 0 20 20" className="size-4" aria-hidden="true"><path d="m6 6 8 8M14 6l-8 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" /></svg>
          </button>
        </div>
        <AboutSection />
      </div>
    </div>
  )
}

export default AboutPanel
