// Matches the "Set the field of view" slider in SequenceViewer (0.05–0.5 deg).
const MIN_FOV_DEG = 0.05
const MAX_FOV_DEG = 0.5
const MIN_SCALE = 1
const MAX_SCALE = 2.5

// Turns the FOV slider into a real crop/zoom on the cutout instead of a
// number with no visual effect: narrower FOV scales the image up (crops
// in), widest FOV shows the full frame uncropped.
export function fovToScale(fieldOfViewDeg: number): number {
  const clamped = Math.min(MAX_FOV_DEG, Math.max(MIN_FOV_DEG, fieldOfViewDeg))
  const t = (MAX_FOV_DEG - clamped) / (MAX_FOV_DEG - MIN_FOV_DEG)
  return MIN_SCALE + t * (MAX_SCALE - MIN_SCALE)
}
