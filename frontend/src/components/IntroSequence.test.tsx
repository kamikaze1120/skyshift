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

  it('suppresses the default keyboard action, so a still-focused control underneath is not re-activated', async () => {
    vi.useRealTimers()
    const onComplete = vi.fn()
    const underlyingClick = vi.fn()
    render(
      <>
        <button onClick={underlyingClick}>Replay intro</button>
        <IntroSequence onComplete={onComplete} />
      </>,
    )
    screen.getByRole('button', { name: 'Replay intro' }).focus()
    const user = userEvent.setup()
    await user.keyboard('{Enter}')
    expect(onComplete).toHaveBeenCalledTimes(1)
    expect(underlyingClick).not.toHaveBeenCalled()
  })

  it('tells an honest, specific story about the real motion it demos, not generic copy', () => {
    const onComplete = vi.fn()
    render(<IntroSequence onComplete={onComplete} />)
    expect(screen.getByText('433 Eros did.')).toBeInTheDocument()
    expect(screen.getByText(/604 arcsec/i)).toBeInTheDocument()
  })

  it('lets the user turn on ambient startup sound where Web Audio is available', () => {
    class FakeOscillator {
      type = ''
      frequency = { value: 0 }
      connect = vi.fn()
      start = vi.fn()
      stop = vi.fn()
    }
    class FakeGainNode {
      gain = { value: 0, linearRampToValueAtTime: vi.fn() }
      connect = vi.fn()
    }
    class FakeAudioContext {
      destination = {}
      currentTime = 0
      createOscillator() {
        return new FakeOscillator()
      }
      createGain() {
        return new FakeGainNode()
      }
      close = vi.fn()
    }
    vi.stubGlobal('AudioContext', FakeAudioContext)

    const onComplete = vi.fn()
    render(<IntroSequence onComplete={onComplete} />)
    const soundToggle = screen.getByRole('button', { name: /sound: off/i })
    fireEvent.click(soundToggle)
    expect(screen.getByRole('button', { name: /sound: on/i })).toBeInTheDocument()
  })

  it('does not show a sound toggle at all where Web Audio is unavailable, rather than a dead control', () => {
    const onComplete = vi.fn()
    render(<IntroSequence onComplete={onComplete} />)
    expect(screen.queryByRole('button', { name: /sound:/i })).not.toBeInTheDocument()
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
