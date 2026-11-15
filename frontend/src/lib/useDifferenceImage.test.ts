import { renderHook, waitFor } from '@testing-library/react'
import { describe, it, expect, vi, afterEach } from 'vitest'
import { useDifferenceImage } from './useDifferenceImage'

class FakeImage {
  width = 2
  height = 2
  crossOrigin = ''
  onload: (() => void) | null = null
  onerror: (() => void) | null = null
  private _src = ''
  set src(value: string) {
    this._src = value
    if (value.includes('wide')) {
      this.width = 4
      this.height = 2
    }
    queueMicrotask(() => {
      if (value.includes('bad')) this.onerror?.()
      else this.onload?.()
    })
  }
  get src() {
    return this._src
  }
}

function stubCanvas() {
  const ctx = {
    drawImage: vi.fn(),
    getImageData: vi.fn().mockReturnValue({ width: 2, height: 2, data: new Uint8ClampedArray(16) }),
    putImageData: vi.fn(),
  }
  vi.spyOn(HTMLCanvasElement.prototype, 'getContext').mockReturnValue(ctx as unknown as CanvasRenderingContext2D)
  vi.spyOn(HTMLCanvasElement.prototype, 'toDataURL').mockReturnValue('data:fake-diff')
  vi.stubGlobal('ImageData', class {
    data: Uint8ClampedArray
    width: number
    height: number
    constructor(data: Uint8ClampedArray, width: number, height: number) {
      this.data = data
      this.width = width
      this.height = height
    }
  })
  return ctx
}

describe('useDifferenceImage', () => {
  afterEach(() => {
    vi.unstubAllGlobals()
    vi.restoreAllMocks()
  })

  it('is unavailable without a second real epoch to diff against', () => {
    const { result } = renderHook(() => useDifferenceImage('/a.png', null))
    expect(result.current.status).toBe('unavailable')
  })

  it('is unavailable when the current and baseline URLs are the same frame', () => {
    const { result } = renderHook(() => useDifferenceImage('/a.png', '/a.png'))
    expect(result.current.status).toBe('unavailable')
  })

  it('produces a real diffed data URL once both epochs load', async () => {
    vi.stubGlobal('Image', FakeImage)
    stubCanvas()
    const { result } = renderHook(() => useDifferenceImage('/current.png', '/baseline.png'))
    expect(result.current.status).toBe('loading')
    await waitFor(() => expect(result.current.status).toBe('ready'))
    expect(result.current.dataUrl).toBe('data:fake-diff')
  })

  it('is unavailable, not a throw, when one epoch fails to load', async () => {
    vi.stubGlobal('Image', FakeImage)
    stubCanvas()
    const { result } = renderHook(() => useDifferenceImage('/current.png', '/bad.png'))
    await waitFor(() => expect(result.current.status).toBe('unavailable'))
    expect(result.current.dataUrl).toBeNull()
  })

  it('is unavailable, not a distorted diff, when the two epochs have different dimensions', async () => {
    vi.stubGlobal('Image', FakeImage)
    const ctx = stubCanvas()
    const { result } = renderHook(() => useDifferenceImage('/current-wide.png', '/baseline.png'))
    await waitFor(() => expect(result.current.status).toBe('unavailable'))
    expect(result.current.dataUrl).toBeNull()
    expect(ctx.drawImage).not.toHaveBeenCalled()
  })
})
