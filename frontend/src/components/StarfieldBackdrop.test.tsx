import { render } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import StarfieldBackdrop from './StarfieldBackdrop'

describe('StarfieldBackdrop', () => {
  it('renders a decorative backdrop marked aria-hidden', () => {
    const { container } = render(<StarfieldBackdrop />)
    expect(container.querySelector('[aria-hidden="true"]')).not.toBeNull()
  })
})
