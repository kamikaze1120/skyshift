import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import CoordinateSearch from './CoordinateSearch'

describe('CoordinateSearch', () => {
  it('calls onTargetSelected when a known name is searched', () => {
    const onSelected = vi.fn()
    render(<CoordinateSearch onTargetSelected={onSelected} />)
    fireEvent.change(screen.getByRole('textbox', { name: /name or designation/i }), { target: { value: 'Eros' } })
    fireEvent.click(screen.getByRole('button', { name: /search/i }))
    expect(onSelected).toHaveBeenCalledWith(expect.objectContaining({ target_id: '433-eros-2025-06' }))
  })
  it('shows an honest not-in-demo-set message for an unknown target, without calling onTargetSelected', () => {
    const onSelected = vi.fn()
    render(<CoordinateSearch onTargetSelected={onSelected} />)
    fireEvent.change(screen.getByRole('textbox', { name: /name or designation/i }), { target: { value: 'Planet Nine' } })
    fireEvent.click(screen.getByRole('button', { name: /search/i }))
    expect(screen.getByText(/not.*(local|demo).*set/i)).toBeInTheDocument()
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
  it('pressing Enter in the name field submits the search, without requiring a button click', () => {
    const onSelected = vi.fn()
    render(<CoordinateSearch onTargetSelected={onSelected} />)
    const nameInput = screen.getByRole('textbox', { name: /name or designation/i })
    fireEvent.change(nameInput, { target: { value: 'Eros' } })
    fireEvent.submit(nameInput.closest('form')!)
    expect(onSelected).toHaveBeenCalledWith(expect.objectContaining({ target_id: '433-eros-2025-06' }))
  })
  it('announces the not-found message to screen readers via role="status"', () => {
    const onSelected = vi.fn()
    render(<CoordinateSearch onTargetSelected={onSelected} />)
    fireEvent.change(screen.getByRole('textbox', { name: /name or designation/i }), { target: { value: 'Planet Nine' } })
    fireEvent.click(screen.getByRole('button', { name: /search/i }))
    expect(screen.getByRole('status')).toHaveTextContent(/not.*(local|demo).*set/i)
  })
})
