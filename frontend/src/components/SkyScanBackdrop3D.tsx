import { useMemo, useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import type { Mesh, Points as ThreePoints, MeshStandardMaterial } from 'three'

const BACKGROUND_STAR_COUNT = 300

function seededRandom(seed: number) {
  const x = Math.sin(seed) * 10000
  return x - Math.floor(x)
}

function BackgroundStars() {
  const pointsRef = useRef<ThreePoints>(null)

  const positions = useMemo(() => {
    const array = new Float32Array(BACKGROUND_STAR_COUNT * 3)
    for (let i = 0; i < BACKGROUND_STAR_COUNT; i++) {
      array[i * 3] = (seededRandom(i * 3 + 1) - 0.5) * 22
      array[i * 3 + 1] = (seededRandom(i * 7 + 2) - 0.5) * 14
      array[i * 3 + 2] = -6 - seededRandom(i * 11 + 3) * 8
    }
    return array
  }, [])

  useFrame(({ clock }) => {
    if (!pointsRef.current) return
    // A slow sky-survey crawl, not a spinning solar system.
    pointsRef.current.rotation.z = clock.getElapsedTime() * 0.003
  })

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial size={0.035} color="#AEB4C7" sizeAttenuation transparent opacity={0.55} />
    </points>
  )
}

interface TargetMarkerProps {
  position: [number, number, number]
  color: string
  twinkleSpeed: number
  twinkleOffset: number
  twinkle: boolean
}

function TargetMarker({ position, color, twinkleSpeed, twinkleOffset, twinkle }: TargetMarkerProps) {
  const ref = useRef<Mesh>(null)

  useFrame(({ clock }) => {
    if (!ref.current) return
    const material = ref.current.material as MeshStandardMaterial
    const t = twinkle ? clock.getElapsedTime() * twinkleSpeed + twinkleOffset : twinkleOffset
    material.emissiveIntensity = 1 + Math.sin(t) * 0.5
  })

  return (
    <mesh ref={ref} position={position}>
      <sphereGeometry args={[0.07, 16, 16]} />
      <meshStandardMaterial color={color} emissive={color} emissiveIntensity={1.2} toneMapped={false} />
    </mesh>
  )
}

// One marker per NASA-named target in this challenge — fixed points
// scattered toward the edges and back of the scene, each gently twinkling in
// place. This is a patch of sky SPHEREx surveys, not a solar system: there is
// no central star and nothing orbits anything. Purely decorative (the real
// target data drives the HTML cards drawn over this), so positions are
// illustrative, not the targets' actual sky coordinates.
const TARGET_MARKERS: Array<Omit<TargetMarkerProps, 'twinkle'>> = [
  { position: [-5.5, 3.2, -8], color: '#2E96F5', twinkleSpeed: 0.8, twinkleOffset: 0 },
  { position: [5.6, 3.8, -10], color: '#eafe07', twinkleSpeed: 0.6, twinkleOffset: 1.4 },
  { position: [-5.8, -3.6, -9], color: '#0960E1', twinkleSpeed: 0.7, twinkleOffset: 2.6 },
  { position: [6.2, -3.2, -11], color: '#FFB020', twinkleSpeed: 0.5, twinkleOffset: 3.8 },
  { position: [0.3, 5.2, -12], color: '#2E96F5', twinkleSpeed: 0.65, twinkleOffset: 5 },
]

interface SkyScanBackdrop3DProps {
  reducedMotion: boolean
}

// Purely decorative starfield backdrop for the target-selection screen. Never
// carries interactive or informational content (that's the real HTML cards
// drawn over it), so it is safe to hide from assistive tech and to freeze
// outright under prefers-reduced-motion.
function SkyScanBackdrop3D({ reducedMotion }: SkyScanBackdrop3DProps) {
  return (
    <Canvas
      aria-hidden="true"
      camera={{ position: [0, 0, 5], fov: 60 }}
      gl={{ alpha: true }}
      style={{ position: 'absolute', inset: 0 }}
      frameloop={reducedMotion ? 'demand' : 'always'}
    >
      <ambientLight intensity={0.7} />
      <BackgroundStars />
      {TARGET_MARKERS.map((marker, i) => (
        <TargetMarker key={i} {...marker} twinkle={!reducedMotion} />
      ))}
    </Canvas>
  )
}

export default SkyScanBackdrop3D
