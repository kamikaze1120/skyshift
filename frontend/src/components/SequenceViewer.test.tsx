import { render, screen, act, fireEvent } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import SequenceViewer from './SequenceViewer'
import targets from '../fixtures/targets.json'
import type { TargetRecord } from '../fixtures/types'

const barnard = (targets as TargetRecord[]).find(t => t.target_id === 'barnards-star-2025-2026')!

const fourFrameTarget: TargetRecord = {
  ...barnard,
  target_id: 'synthetic-4frame',
  display_name: 'Synthetic 4-frame target',
  verified: true,
  observations: [
    { ...barnard.observations[0], epoch: '2025-01-01T00:00:00Z' },
    { ...barnard.observations[0], epoch: '2025-01-02T00:00:00Z' },
    { ...barnard.observations[0], epoch: '2025-01-03T00:00:00Z' },
    { ...barnard.observations[1], epoch: '2025-01-04T00:00:00Z' },
  ],
}

describe('SequenceViewer', () => {
  it('opens paused at the first frame regardless of how the target was reached', () => {
    render(<SequenceViewer target={barnard} />)
    expect(screen.getByRole('slider')).toHaveAttribute('aria-valuenow', '0')
    expect(screen.queryByRole('button', { name: /pause/i })).not.toBeInTheDocument()
  })

  it('always shows the SourcePanel — there is no more autoplay to wait for', () => {
    render(<SequenceViewer target={barnard} />)
    expect(screen.getByText(barnard.observations[0].doi)).toBeInTheDocument()
  })

  it('offers a way to flag the current target as a possible mover', () => {
    render(<SequenceViewer target={barnard} />)
    expect(screen.getByRole('button', { name: /flag.*possible mover/i })).toBeInTheDocument()
  })

  describe('with fake timers', () => {
    beforeEach(() => vi.useFakeTimers())
    afterEach(() => vi.useRealTimers())

    it('pressing Play actually advances frames, and Pause actually stops them', () => {
      render(<SequenceViewer target={fourFrameTarget} />)
      expect(screen.getByRole('slider')).toHaveAttribute('aria-valuenow', '0')

      fireEvent.click(screen.getByRole('button', { name: /play/i }))
      // Only one step-interval's worth of time: mid-playback, not yet at the
      // final frame, so the Play/Pause button is still showing "Pause".
      act(() => { vi.advanceTimersByTime(2000) })
      const advancedIndex = Number(screen.getByRole('slider').getAttribute('aria-valuenow'))
      expect(advancedIndex).toBeGreaterThan(0)
      expect(advancedIndex).toBeLessThan(3)

      fireEvent.click(screen.getByRole('button', { name: /pause/i }))
      const pausedAt = screen.getByRole('slider').getAttribute('aria-valuenow')
      act(() => { vi.advanceTimersByTime(5000) })
      expect(screen.getByRole('slider')).toHaveAttribute('aria-valuenow', pausedAt!)
    })

    it('resets to a fresh paused-at-start state when the target changes, even without unmounting', () => {
      const { rerender } = render(<SequenceViewer target={fourFrameTarget} />)
      fireEvent.click(screen.getByRole('button', { name: /play/i }))
      act(() => { vi.advanceTimersByTime(2000) })
      const advancedIndex = Number(screen.getByRole('slider').getAttribute('aria-valuenow'))
      expect(advancedIndex).toBeGreaterThan(0)

      rerender(<SequenceViewer target={barnard} />)
      expect(screen.getByRole('slider')).toHaveAttribute('aria-valuenow', '0')
      expect(screen.queryByRole('button', { name: /pause/i })).not.toBeInTheDocument()
    })
  })
})
