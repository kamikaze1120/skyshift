import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { describe, it, expect, vi, afterEach } from 'vitest'
import FlagMoverPanel from './FlagMoverPanel'

describe('FlagMoverPanel', () => {
  afterEach(() => {
    vi.unstubAllEnvs()
    vi.unstubAllGlobals()
  })

  it('renders a button to flag the target as a possible mover', () => {
    vi.stubEnv('VITE_API_BASE_URL', '')
    render(<FlagMoverPanel targetId="433-eros-2025-06" />)
    expect(screen.getByRole('button', { name: /flag.*possible mover/i })).toBeInTheDocument()
  })

  it('shows an honest message instead of a fake success when no backend is configured', async () => {
    vi.stubEnv('VITE_API_BASE_URL', '')
    render(<FlagMoverPanel targetId="433-eros-2025-06" />)
    fireEvent.click(screen.getByRole('button', { name: /flag.*possible mover/i }))
    await waitFor(() => expect(screen.getByText(/needs the live backend/i)).toBeInTheDocument())
    expect(screen.getByRole('button', { name: /flag.*possible mover/i })).not.toBeDisabled()
  })

  it('shows a real success message when the backend accepts the flag', async () => {
    vi.stubEnv('VITE_API_BASE_URL', 'http://localhost:8000')
    vi.stubGlobal('fetch', vi.fn().mockImplementation((url: string) => {
      if (String(url).includes('/flags/summary')) {
        return Promise.resolve({ ok: true, json: async () => [] })
      }
      return Promise.resolve({ ok: true })
    }))
    render(<FlagMoverPanel targetId="433-eros-2025-06" />)
    fireEvent.click(screen.getByRole('button', { name: /flag.*possible mover/i }))
    await waitFor(() => expect(screen.getByText(/logged for follow-up/i)).toBeInTheDocument())
  })

  it('shows a placeholder for the global tally when no backend is configured', () => {
    vi.stubEnv('VITE_API_BASE_URL', '')
    render(<FlagMoverPanel targetId="433-eros-2025-06" />)
    expect(screen.getByText(/lights up once the backend is connected/i)).toBeInTheDocument()
  })

  it('shows the real country tally when the backend provides one', async () => {
    vi.stubEnv('VITE_API_BASE_URL', 'http://localhost:8000')
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({
      ok: true,
      json: async () => [{ country: 'Kenya', count: 3 }, { country: 'Japan', count: 1 }],
    }))
    render(<FlagMoverPanel targetId="433-eros-2025-06" />)
    await waitFor(() => expect(screen.getByText('Kenya')).toBeInTheDocument())
    expect(screen.getByText('3')).toBeInTheDocument()
    expect(screen.getByText('Japan')).toBeInTheDocument()
  })
})
