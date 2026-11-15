import { useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import type { Mesh } from 'three'

interface OrbitNodeProps {
  radius: number
  speed: number
  color: string
  size: number
  offset: number
  spin: boolean
}

function OrbitNode({ radius, speed, color, size, offset, spin }: OrbitNodeProps) {
  const ref = useRef<Mesh>(null)

  useFrame(({ clock }) => {
    if (!ref.current) return
    const t = spin ? clock.getElapsedTime() * speed + offset : offset
    ref.current.position.set(Math.cos(t) * radius, Math.sin(t * 0.6) * radius * 0.3, Math.sin(t) * radius)
  })

  return (
    <mesh ref={ref}>
      <sphereGeometry args={[size, 16, 16]} />
      <meshStandardMaterial color={color} emissive={color} emissiveIntensity={1.4} toneMapped={false} />
    </mesh>
  )
}

const NODES: Array<Omit<OrbitNodeProps, 'spin'>> = [
  { radius: 2.2, speed: 0.15, color: '#2E96F5', size: 0.12, offset: 0 },
  { radius: 2.8, speed: 0.11, color: '#eafe07', size: 0.1, offset: 1.2 },
  { radius: 3.4, speed: 0.08, color: '#0960E1', size: 0.14, offset: 2.4 },
  { radius: 4.0, speed: 0.06, color: '#FFB020', size: 0.1, offset: 3.6 },
  { radius: 4.6, speed: 0.045, color: '#2E96F5', size: 0.16, offset: 4.8 },
]

interface OrbitField3DProps {
  reducedMotion: boolean
}

// Purely decorative orbit-field backdrop for the target-selection screen —
// one glowing node per NASA-named target, slowly circling a central light.
// Never carries interactive or informational content (that's the real HTML
// cards drawn over it), so it is safe to hide from assistive tech and to
// freeze outright under prefers-reduced-motion.
function OrbitField3D({ reducedMotion }: OrbitField3DProps) {
  return (
    <Canvas
      aria-hidden="true"
      camera={{ position: [0, 1.5, 6], fov: 50 }}
      gl={{ alpha: true }}
      style={{ position: 'absolute', inset: 0 }}
      frameloop={reducedMotion ? 'demand' : 'always'}
    >
      <ambientLight intensity={0.4} />
      <pointLight position={[0, 0, 0]} intensity={2} color="#2E96F5" />
      <mesh>
        <sphereGeometry args={[0.4, 32, 32]} />
        <meshStandardMaterial color="#FFB020" emissive="#FFB020" emissiveIntensity={0.8} toneMapped={false} />
      </mesh>
      {NODES.map((node, i) => (
        <OrbitNode key={i} {...node} spin={!reducedMotion} />
      ))}
    </Canvas>
  )
}

export default OrbitField3D
