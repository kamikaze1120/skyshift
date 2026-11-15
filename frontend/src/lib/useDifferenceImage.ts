import { useEffect, useState } from 'react'
import { computeDifference } from './imageDiff'

export type DifferenceStatus = 'idle' | 'loading' | 'ready' | 'unavailable'

function loadImage(url: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.crossOrigin = 'anonymous'
    img.onload = () => resolve(img)
    img.onerror = () => reject(new Error(`failed to load ${url}`))
    img.src = url
  })
}

// Real per-pixel differencing between two actual epoch cutouts, drawn
// through a canvas so both frames land on the same pixel grid before
// computeDifference runs. Returns 'unavailable' (never a fabricated
// image) whenever there's no real second epoch to diff against, or the
// canvas/image pipeline can't produce one — SkyFrame falls back to the
// illustrative CSS view in that case.
export function useDifferenceImage(currentUrl: string | null, baselineUrl: string | null) {
  const [status, setStatus] = useState<DifferenceStatus>('idle')
  const [dataUrl, setDataUrl] = useState<string | null>(null)

  useEffect(() => {
    setDataUrl(null)

    if (!currentUrl || !baselineUrl || currentUrl === baselineUrl) {
      setStatus('unavailable')
      return
    }

    setStatus('loading')
    let cancelled = false

    Promise.all([loadImage(currentUrl), loadImage(baselineUrl)])
      .then(([currentImg, baselineImg]) => {
        if (cancelled) return

        // Forcing mismatched frames onto the same square would silently
        // stretch/crop one of them, producing a diff that looks real but
        // isn't a fair pixel comparison — honest "unavailable" instead.
        if (currentImg.width !== baselineImg.width || currentImg.height !== baselineImg.height) {
          setStatus('unavailable')
          return
        }

        const size = Math.min(currentImg.width, currentImg.height, baselineImg.width, baselineImg.height)
        const canvas = document.createElement('canvas')
        canvas.width = size
        canvas.height = size
        const ctx = canvas.getContext('2d')
        if (!ctx || size <= 0) {
          setStatus('unavailable')
          return
        }

        ctx.drawImage(currentImg, 0, 0, size, size)
        const currentData = ctx.getImageData(0, 0, size, size)
        ctx.drawImage(baselineImg, 0, 0, size, size)
        const baselineData = ctx.getImageData(0, 0, size, size)

        const diff = computeDifference(currentData, baselineData)
        if (!diff) {
          setStatus('unavailable')
          return
        }

        ctx.putImageData(new ImageData(new Uint8ClampedArray(diff.data), diff.width, diff.height), 0, 0)
        setDataUrl(canvas.toDataURL())
        setStatus('ready')
      })
      .catch(() => {
        if (!cancelled) setStatus('unavailable')
      })

    return () => {
      cancelled = true
    }
  }, [currentUrl, baselineUrl])

  return { status, dataUrl }
}
