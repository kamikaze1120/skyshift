import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { describe, it, expect, vi, afterEach } from 'vitest'
import CoordinateSearch from './CoordinateSearch'

describe('CoordinateSearch', () => {
  afterEach(() => {
    vi.unstubAllEnvs()
    vi.unstubAllGlobals()
  })

  it('calls onTargetSelected when a known name is searched', async () => {
    const onSelected = vi.fn()
    render(<CoordinateSearch onTargetSelected={onSelected} />)
    fireEvent.change(screen.getByRole('textbox', { name: /name or designation/i }), { target: { value: 'Eros' } })
    fireEvent.click(screen.getByRole('button', { name: /search/i }))
    await waitFor(() => expect(onSelected).toHaveBeenCalledWith(expect.objectContaining({ target_id: '433-eros-2025-06' })))
  })
  it('shows an honest not-in-demo-set message for an unknown target, without calling onTargetSelected', async () => {
    const onSelected = vi.fn()
    render(<CoordinateSearch onTargetSelected={onSelected} />)
    fireEvent.change(screen.getByRole('textbox', { name: /name or designation/i }), { target: { value: 'Planet Nine' } })
    fireEvent.click(screen.getByRole('button', { name: /search/i }))
    await waitFor(() => expect(screen.getByText(/not.*(local|demo).*set/i)).toBeInTheDocument())
    expect(onSelected).not.toHaveBeenCalled()
  })
  it('renders the curated gallery as selectable buttons for all six fixtures', () => {
    render(<CoordinateSearch onTargetSelected={() => {}} />)
    expect(screen.getByRole('button', { name: /433 eros/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /r draconis/i })).toBeInTheDocument()
  })
  it('flags unverified targets in the gallery instead of presenting all six with equal weight', () => {
    render(<CoordinateSearch onTargetSelected={() => {}} />)
    expect(screen.getByRole('button', { name: /433 eros.*verified/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /r draconis.*unconfirmed/i })).toBeInTheDocument()
  })
  it('pressing Enter in the name field submits the search, without requiring a button click', async () => {
    const onSelected = vi.fn()
    render(<CoordinateSearch onTargetSelected={onSelected} />)
    const nameInput = screen.getByRole('textbox', { name: /name or designation/i })
    fireEvent.change(nameInput, { target: { value: 'Eros' } })
    fireEvent.submit(nameInput.closest('form')!)
    await waitFor(() => expect(onSelected).toHaveBeenCalledWith(expect.objectContaining({ target_id: '433-eros-2025-06' })))
  })
  it('announces the not-found message to screen readers via role="status"', async () => {
    const onSelected = vi.fn()
    render(<CoordinateSearch onTargetSelected={onSelected} />)
    fireEvent.change(screen.getByRole('textbox', { name: /name or designation/i }), { target: { value: 'Planet Nine' } })
    fireEvent.click(screen.getByRole('button', { name: /search/i }))
    await waitFor(() => expect(screen.getByRole('status')).toHaveTextContent(/not.*(local|demo).*set/i))
  })
  it('prefers a live backend search result over the local fixture when the backend is configured', async () => {
    vi.stubEnv('VITE_API_BASE_URL', 'http://localhost:8000')
    const remoteTarget = {
      target_id: 'remote-ceres',
      display_name: 'Ceres',
      object_type: 'asteroid',
      coordinates: { ra_deg: 50, dec_deg: 10 },
      size_deg: 0.2,
      observations: [
        { epoch: '2026-01-01T00:00:00Z', wavelength_band: 'D1', image_url: '/data/remote.png', source_file: 'remote.fits', doi: '10.26131/IRSA652' },
        { epoch: '2026-02-01T00:00:00Z', wavelength_band: 'D1', image_url: '/data/remote2.png', source_file: 'remote2.fits', doi: '10.26131/IRSA652' },
      ],
      known_motion_arcsec: null,
      verified: true,
      story_note: null,
    }
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok: true, json: async () => [remoteTarget] }))
    const onSelected = vi.fn()
    render(<CoordinateSearch onTargetSelected={onSelected} />)
    fireEvent.change(screen.getByRole('textbox', { name: /name or designation/i }), { target: { value: 'Ceres' } })
    fireEvent.click(screen.getByRole('button', { name: /search/i }))
    await waitFor(() => expect(onSelected).toHaveBeenCalledWith(expect.objectContaining({ target_id: 'remote-ceres' })))
  })
  it('falls back to the local fixture when the backend is configured but unreachable', async () => {
    vi.stubEnv('VITE_API_BASE_URL', 'http://localhost:8000')
    vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new Error('network down')))
    const onSelected = vi.fn()
    render(<CoordinateSearch onTargetSelected={onSelected} />)
    fireEvent.change(screen.getByRole('textbox', { name: /name or designation/i }), { target: { value: 'Eros' } })
    fireEvent.click(screen.getByRole('button', { name: /search/i }))
    await waitFor(() => expect(onSelected).toHaveBeenCalledWith(expect.objectContaining({ target_id: '433-eros-2025-06' })))
  })
})
