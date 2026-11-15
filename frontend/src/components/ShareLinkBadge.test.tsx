import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import ShareLinkBadge from './ShareLinkBadge'
import targets from '../fixtures/targets.json'
import type { TargetRecord } from '../fixtures/types'

const eros = (targets as TargetRecord[])[0]

describe('ShareLinkBadge', () => {
  it('displays a URL containing the target\'s ra, dec, and size', () => {
    render(<ShareLinkBadge target={eros} />)
    const text = screen.getByText(new RegExp(`ra=${eros.coordinates.ra_deg}`))
    expect(text).toBeInTheDocument()
  })
  it('shows a "Link copied" confirmation after clicking the copy button', async () => {
    const writeText = vi.fn().mockResolvedValue(undefined)
    vi.stubGlobal('navigator', { ...navigator, clipboard: { writeText } })
    render(<ShareLinkBadge target={eros} />)
    fireEvent.click(screen.getByRole('button', { name: /copy link/i }))
    expect(await screen.findByText(/link copied/i)).toBeInTheDocument()
    vi.unstubAllGlobals()
  })
  it('stays on "Copy link" instead of crashing when the clipboard write is rejected', async () => {
    const writeText = vi.fn().mockRejectedValue(new Error('denied'))
    vi.stubGlobal('navigator', { ...navigator, clipboard: { writeText } })
    render(<ShareLinkBadge target={eros} />)
    fireEvent.click(screen.getByRole('button', { name: /copy link/i }))
    await vi.waitFor(() => expect(writeText).toHaveBeenCalled())
    expect(screen.queryByText(/link copied/i)).not.toBeInTheDocument()
    expect(screen.getByRole('button', { name: /copy link/i })).toBeInTheDocument()
    vi.unstubAllGlobals()
  })
})
