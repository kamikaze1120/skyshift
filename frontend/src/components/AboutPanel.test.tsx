import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import AboutPanel from './AboutPanel'

describe('AboutPanel', () => {
  it('is not in the accessibility tree when closed', () => {
    render(<AboutPanel isOpen={false} onClose={vi.fn()} />)
    expect(screen.queryByText(/note on what you're seeing/i)).not.toBeInTheDocument()
  })

  it('shows the existing About content when open', () => {
    render(<AboutPanel isOpen={true} onClose={vi.fn()} />)
    expect(screen.getByText(/note on what you're seeing/i)).toBeInTheDocument()
  })

  it('closes on Escape and on clicking the close control', () => {
    const onClose = vi.fn()
    render(<AboutPanel isOpen={true} onClose={onClose} />)
    fireEvent.keyDown(window, { key: 'Escape' })
    expect(onClose).toHaveBeenCalledTimes(1)
    fireEvent.click(screen.getByRole('button', { name: /close/i }))
    expect(onClose).toHaveBeenCalledTimes(2)
  })
})
