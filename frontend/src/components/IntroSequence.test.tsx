import { render, screen, fireEvent, act } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import IntroSequence from './IntroSequence'

describe('IntroSequence', () => {
  beforeEach(() => vi.useFakeTimers())
  afterEach(() => {
    vi.useRealTimers()
    vi.unstubAllGlobals()
  })

  it('shows the wordmark, then the three story lines, then calls onComplete', () => {
    const onComplete = vi.fn()
    render(<IntroSequence onComplete={onComplete} />)
    expect(screen.getByText('Skyshift')).toBeInTheDocument()

    act(() => { vi.advanceTimersByTime(7000) })
    expect(onComplete).toHaveBeenCalledTimes(1)
  })

  it('skips immediately on Escape, Enter, or Space', () => {
    const onComplete = vi.fn()
    render(<IntroSequence onComplete={onComplete} />)
    fireEvent.keyDown(window, { key: 'Escape' })
    expect(onComplete).toHaveBeenCalledTimes(1)
  })

  it('skips immediately when the visible Skip control is clicked', () => {
    const onComplete = vi.fn()
    render(<IntroSequence onComplete={onComplete} />)
    fireEvent.click(screen.getByRole('button', { name: /skip intro/i }))
    expect(onComplete).toHaveBeenCalledTimes(1)
  })

  it('respects prefers-reduced-motion: shows a plain fade, without the drifting story animation', () => {
    vi.stubGlobal('matchMedia', (query: string) => ({
      matches: query.includes('reduce'),
      media: query,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    }))
    const onComplete = vi.fn()
    render(<IntroSequence onComplete={onComplete} />)
    expect(screen.queryByTestId('intro-story-drift')).not.toBeInTheDocument()
  })
})
