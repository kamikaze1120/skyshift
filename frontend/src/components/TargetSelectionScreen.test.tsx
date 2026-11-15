import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import TargetSelectionScreen from './TargetSelectionScreen'
import { getTargetById } from '../lib/api'

vi.mock('./SkyScanBackdrop3D', () => ({ default: () => <div data-testid="sky-scan-backdrop-mock" /> }))

const BARNARD = getTargetById('barnards-star-2025-2026')!
const WISE = getTargetById('wise-0855-2025-2026')!

describe('TargetSelectionScreen', () => {
  it('lists every NASA-named target passed in', () => {
    render(<TargetSelectionScreen targets={[BARNARD, WISE]} onTargetChosen={vi.fn()} />)
    expect(screen.getByRole('listitem', { name: /barnard/i })).toBeInTheDocument()
    expect(screen.getByRole('listitem', { name: /wise 0855/i })).toBeInTheDocument()
  })

  it('shows a short description before committing to a target', () => {
    render(<TargetSelectionScreen targets={[BARNARD]} onTargetChosen={vi.fn()} />)
    fireEvent.click(screen.getByRole('listitem', { name: /barnard/i }))
    expect(screen.getByText(BARNARD.story_note!)).toBeInTheDocument()
  })

  it('only calls onTargetChosen once the description is confirmed, not on the initial click', () => {
    const onTargetChosen = vi.fn()
    render(<TargetSelectionScreen targets={[BARNARD]} onTargetChosen={onTargetChosen} />)
    fireEvent.click(screen.getByRole('listitem', { name: /barnard/i }))
    expect(onTargetChosen).not.toHaveBeenCalled()
    fireEvent.click(screen.getByRole('button', { name: /begin research/i }))
    expect(onTargetChosen).toHaveBeenCalledWith(BARNARD)
  })

  it('lets the user back out of the description without committing', () => {
    const onTargetChosen = vi.fn()
    render(<TargetSelectionScreen targets={[BARNARD]} onTargetChosen={onTargetChosen} />)
    fireEvent.click(screen.getByRole('listitem', { name: /barnard/i }))
    fireEvent.click(screen.getByRole('button', { name: /back/i }))
    expect(screen.queryByText(BARNARD.story_note!)).not.toBeInTheDocument()
    expect(onTargetChosen).not.toHaveBeenCalled()
  })

  it('offers a way to dismiss the whole screen without choosing a target, when onDismiss is given', () => {
    const onDismiss = vi.fn()
    render(<TargetSelectionScreen targets={[BARNARD]} onTargetChosen={vi.fn()} onDismiss={onDismiss} />)
    fireEvent.click(screen.getByRole('button', { name: /back to research bay/i }))
    expect(onDismiss).toHaveBeenCalled()
  })

  it('does not render a dismiss control when onDismiss is not given', () => {
    render(<TargetSelectionScreen targets={[BARNARD]} onTargetChosen={vi.fn()} />)
    expect(screen.queryByRole('button', { name: /back to research bay/i })).not.toBeInTheDocument()
  })
})
