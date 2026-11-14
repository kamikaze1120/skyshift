import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import PlaybackScrubber from './PlaybackScrubber'

describe('PlaybackScrubber', () => {
  it('renders a keyboard-operable scrubber for N observations, N != 2', () => {
    const onIndexChange = vi.fn()
    render(<PlaybackScrubber observationCount={5} currentIndex={2} isPlaying={false} onIndexChange={onIndexChange} onPlayPauseToggle={() => {}} />)
    const scrubber = screen.getByRole('slider')
    expect(scrubber).toHaveAttribute('aria-valuemin', '0')
    expect(scrubber).toHaveAttribute('aria-valuemax', '4')
    fireEvent.keyDown(scrubber, { key: 'ArrowRight' })
    expect(onIndexChange).toHaveBeenCalledWith(3)
  })
  it('has an accessible, keyboard-operable play/pause control', () => {
    const onToggle = vi.fn()
    render(<PlaybackScrubber observationCount={2} currentIndex={0} isPlaying={false} onIndexChange={() => {}} onPlayPauseToggle={onToggle} />)
    const button = screen.getByRole('button', { name: /play/i })
    fireEvent.click(button)
    expect(onToggle).toHaveBeenCalled()
  })
  it('announces the current epoch date, not just a bare index number', () => {
    render(
      <PlaybackScrubber
        observationCount={2}
        currentIndex={0}
        isPlaying={false}
        onIndexChange={() => {}}
        onPlayPauseToggle={() => {}}
        epochLabels={['2025-06-25T00:12:09Z', '2025-06-25T08:19:18Z']}
      />
    )
    expect(screen.getByRole('slider')).toHaveAttribute('aria-valuetext', expect.stringContaining('2025-06-25T00:12:09Z'))
  })
  it('is operable by pointer: clicking along the track changes the index', () => {
    const onIndexChange = vi.fn()
    render(<PlaybackScrubber observationCount={5} currentIndex={0} isPlaying={false} onIndexChange={onIndexChange} onPlayPauseToggle={() => {}} />)
    const scrubber = screen.getByRole('slider')
    vi.spyOn(scrubber, 'getBoundingClientRect').mockReturnValue({
      left: 0, width: 100, top: 0, height: 10, right: 100, bottom: 10, x: 0, y: 0, toJSON() { return {} },
    } as DOMRect)
    fireEvent.pointerDown(scrubber, { clientX: 90 })
    expect(onIndexChange).toHaveBeenCalledWith(4)
  })
})
