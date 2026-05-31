'use client'
import { Canvas, useFrame } from '@react-three/fiber'
import { useRef, useMemo } from 'react'
import * as THREE from 'three'
import { useDeviceCapability } from '@/hooks/useDeviceCapability'

// Single particle that flies outward when shatter=true
function Particle({ origin, shatter, velocity }: {
  origin: THREE.Vector3
  shatter: boolean
  velocity: THREE.Vector3
}) {
  const mesh = useRef<THREE.Mesh>(null!)
  const opacity = useRef(0.8)

  useFrame((_, delta) => {
    if (!mesh.current) return
    if (shatter) {
      mesh.current.position.addScaledVector(velocity, delta)
      opacity.current = Math.max(0, opacity.current - delta * 0.7)
      ;(mesh.current.material as THREE.MeshBasicMaterial).opacity = opacity.current
    }
  })

  return (
    <mesh ref={mesh} position={[origin.x, origin.y, origin.z]}>
      <boxGeometry args={[0.06, 0.06, 0.06]} />
      <meshBasicMaterial color="#a8d8ff" transparent opacity={0.8} />
    </mesh>
  )
}

// 120 ambient floating particles in the background
function AmbientParticles({ count }: { count: number }) {
  const positions = useMemo(() => {
    const arr = new Float32Array(count * 3)
    for (let i = 0; i < count; i++) {
      arr[i * 3] = (Math.random() - 0.5) * 20
      arr[i * 3 + 1] = (Math.random() - 0.5) * 20
      arr[i * 3 + 2] = (Math.random() - 0.5) * 10 - 5
    }
    return arr
  }, [count])

  const points = useRef<THREE.Points>(null!)
  useFrame((state) => {
    if (points.current) {
      points.current.rotation.y = state.clock.elapsedTime * 0.03
    }
  })

  return (
    <points ref={points}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          array={positions}
          count={count}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial size={0.03} color="#a8d8ff" transparent opacity={0.5} sizeAttenuation />
    </points>
  )
}

// The FLAMINGEOS logo text made of box particles
// When shatter=false: particles are arranged in a rectangular cluster representing the logo
// When shatter=true: particles fly outward
function LogoParticles({ shatter }: { shatter: boolean }) {
  const groupRef = useRef<THREE.Group>(null!)

  const { origins, velocities } = useMemo(() => {
    const count = 200
    const origins: THREE.Vector3[] = []
    const velocities: THREE.Vector3[] = []
    for (let i = 0; i < count; i++) {
      origins.push(new THREE.Vector3(
        (Math.random() - 0.5) * 8,
        (Math.random() - 0.5) * 1.6,
        (Math.random() - 0.5) * 0.2
      ))
      velocities.push(new THREE.Vector3(
        (Math.random() - 0.5) * 12,
        (Math.random() - 0.5) * 12,
        (Math.random() - 0.5) * 8
      ))
    }
    return { origins, velocities }
  }, [])

  useFrame((state) => {
    if (groupRef.current && !shatter) {
      groupRef.current.position.y = Math.sin(state.clock.elapsedTime * 0.4) * 0.06
    }
  })

  return (
    <group ref={groupRef}>
      {origins.map((origin, i) => (
        <Particle key={i} origin={origin} shatter={shatter} velocity={velocities[i]} />
      ))}
    </group>
  )
}

// Logo text rendered as a white mesh (shown during logo phase only, before shatter)
function LogoText() {
  const meshRef = useRef<THREE.Group>(null!)

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.position.y = Math.sin(state.clock.elapsedTime * 0.4) * 0.06
    }
  })

  return (
    <group ref={meshRef}>
      {/* Simple text representation using a plane since Text3D needs font JSON */}
      <mesh>
        <planeGeometry args={[8, 1.4]} />
        <meshBasicMaterial color="#f0f0f0" transparent opacity={0.9} />
      </mesh>
    </group>
  )
}

interface LoadingSceneProps {
  shatter: boolean
}

export default function LoadingScene({ shatter }: LoadingSceneProps) {
  const capability = useDeviceCapability()
  const particleCount = capability === 'low' ? 60 : capability === 'medium' ? 90 : 120

  return (
    <Canvas
      camera={{ position: [0, 0, 8], fov: 50 }}
      gl={{ antialias: capability !== 'low', alpha: true }}
      dpr={capability === 'low' ? 1 : [1, 1.5]}
    >
      <ambientLight intensity={0.4} />
      <pointLight position={[4, 4, 4]} intensity={1.2} color="#a8d8ff" />
      <AmbientParticles count={particleCount} />
      {shatter ? (
        <LogoParticles shatter={true} />
      ) : (
        <>
          <LogoText />
          <LogoParticles shatter={false} />
        </>
      )}
    </Canvas>
  )
}
