export interface ImageDataLike {
  width: number
  height: number
  data: Uint8ClampedArray
}

// Pixel-level absolute difference between two equal-sized frames. Real
// per-detector differencing needs matching dimensions; mismatched frames
// return null rather than a fabricated result, so callers can fall back
// to an honest "can't diff this pair" state instead of crashing.
export function computeDifference(a: ImageDataLike, b: ImageDataLike): ImageDataLike | null {
  if (a.width !== b.width || a.height !== b.height) return null

  const data = new Uint8ClampedArray(a.data.length)
  for (let i = 0; i < a.data.length; i += 4) {
    data[i] = Math.abs(a.data[i] - b.data[i])
    data[i + 1] = Math.abs(a.data[i + 1] - b.data[i + 1])
    data[i + 2] = Math.abs(a.data[i + 2] - b.data[i + 2])
    data[i + 3] = 255
  }
  return { width: a.width, height: a.height, data }
}
