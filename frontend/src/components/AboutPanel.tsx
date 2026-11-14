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
    <div className="fixed inset-x-0 bottom-0 z-40 max-h-[80vh] overflow-y-auto border-t border-starlight/20 bg-space-950 p-4 sm:inset-y-0 sm:left-auto sm:right-0 sm:w-96 sm:max-h-none sm:border-l sm:border-t-0">
      <button
        type="button"
        onClick={onClose}
        className="mb-3 rounded border border-starlight/30 px-3 py-1 text-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent-ember"
      >
        Close
      </button>
      <AboutSection />
    </div>
  )
}

export default AboutPanel
