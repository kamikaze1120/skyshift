import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import NarrativeOverlay from './NarrativeOverlay'

describe('NarrativeOverlay', () => {
  it('shows the full text immediately when reducedMotion is true', () => {
    render(<NarrativeOverlay text="Barnard's Star just moved." reducedMotion={true} />)
    const el = screen.getByText("Barnard's Star just moved.")
    expect(el).toBeInTheDocument()
    expect(el.style.clipPath).toBe('inset(0 0% 0 0)')
  })
  it('jumps to fully visible immediately when reducedMotion flips to true mid-reveal, not just for a future reveal', () => {
    const { rerender } = render(<NarrativeOverlay text="Barnard's Star just moved." reducedMotion={false} />)
    const midRevealEl = screen.getByText("Barnard's Star just moved.")
    expect(midRevealEl.style.clipPath).not.toBe('inset(0 0% 0 0)')

    rerender(<NarrativeOverlay text="Barnard's Star just moved." reducedMotion={true} />)
    const el = screen.getByText("Barnard's Star just moved.")
    expect(el.style.clipPath).toBe('inset(0 0% 0 0)')
  })
})
