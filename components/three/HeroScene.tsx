'use client'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { useRef } from 'react'
import * as THREE from 'three'
import { useDeviceCapability } from '@/hooks/useDeviceCapability'

// A colored plane at a given Z depth that drifts gently
function DepthPlane({ z, opacity, color }: { z: number; opacity: number; color: string }) {
  const mesh = useRef<THREE.Mesh>(null!)

  useFrame((state) => {
    if (!mesh.current) return
    mesh.current.position.y = Math.sin(state.clock.elapsedTime * 0.2 + z) * 0.1
  })

  return (
    <mesh ref={mesh} position={[0, 0, z]}>
      <planeGeometry args={[16, 9]} />
      <meshBasicMaterial color={color} transparent opacity={opacity} />
    </mesh>
  )
}

function Scene({ mouse }: { mouse: { x: number; y: number } }) {
  const { camera } = useThree()
  const capability = useDeviceCapability()
  const layerCount = capability === 'low' ? 2 : capability === 'medium' ? 3 : 5

  useFrame(() => {
    camera.position.x += (mouse.x * 0.5 - camera.position.x) * 0.05
    camera.position.y += (mouse.y * 0.3 - camera.position.y) * 0.05
    camera.lookAt(0, 0, 0)
  })

  const layers = [
    { z: -8, opacity: 0.6, color: '#0a0f1a' },
    { z: -5, opacity: 0.4, color: '#0d1520' },
    { z: -3, opacity: 0.25, color: '#1a2535' },
    { z: -1, opacity: 0.15, color: '#243040' },
    { z: 0.5, opacity: 0.08, color: '#304050' },
  ].slice(0, layerCount)

  return (
    <>
      <fog attach="fog" args={['#080808', 5, 25]} />
      {layers.map((l, i) => (
        <DepthPlane key={i} z={l.z} opacity={l.opacity} color={l.color} />
      ))}
    </>
  )
}

export default function HeroScene({ mouse }: { mouse: { x: number; y: number } }) {
  const capability = useDeviceCapability()
  return (
    <Canvas
      camera={{ position: [0, 0, 5], fov: 60 }}
      gl={{ antialias: capability !== 'low', alpha: true }}
      dpr={capability === 'low' ? 1 : [1, 1.5]}
    >
      <Scene mouse={mouse} />
    </Canvas>
  )
}
