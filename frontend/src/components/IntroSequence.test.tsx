import { render, screen, fireEvent, act } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import IntroSequence from './IntroSequence'

describe('IntroSequence', () => {
  beforeEach(() => vi.useFakeTimers())
  afterEach(() => {
    vi.useRealTimers()
    vi.unstubAllGlobals()
  })

  it('keeps the mission briefing open until the user enters the research bay', () => {
    const onComplete = vi.fn()
    render(<IntroSequence onComplete={onComplete} />)
    expect(screen.getByText('Skyshift')).toBeInTheDocument()

    act(() => { vi.advanceTimersByTime(7000) })
    expect(onComplete).not.toHaveBeenCalled()
    fireEvent.click(screen.getByRole('button', { name: /enter research bay/i }))
    expect(onComplete).toHaveBeenCalledTimes(1)
  })

  it('does not complete from an unrelated global key press', () => {
    const onComplete = vi.fn()
    render(<IntroSequence onComplete={onComplete} />)
    fireEvent.keyDown(window, { key: 'Escape' })
    expect(onComplete).not.toHaveBeenCalled()
  })

  it('enters immediately when the visible Enter control is clicked', () => {
    const onComplete = vi.fn()
    render(<IntroSequence onComplete={onComplete} />)
    fireEvent.click(screen.getByRole('button', { name: /enter research bay/i }))
    expect(onComplete).toHaveBeenCalledTimes(1)
  })

  it('allows keyboard users to activate the focused Enter control', async () => {
    vi.useRealTimers()
    const onComplete = vi.fn()
    render(<IntroSequence onComplete={onComplete} />)
    const user = userEvent.setup()
    await user.keyboard('{Enter}')
    expect(onComplete).toHaveBeenCalledTimes(1)
  })

  it('shows the official NASA Space Apps logo lockup instead of plain text', () => {
    render(<IntroSequence onComplete={vi.fn()} />)
    expect(screen.getByRole('img', { name: /nasa space apps/i })).toBeInTheDocument()
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
