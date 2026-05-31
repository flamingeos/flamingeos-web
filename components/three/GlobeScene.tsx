'use client'
import { Canvas, useFrame } from '@react-three/fiber'
import { Sphere, Html } from '@react-three/drei'
import { useRef, useState } from 'react'
import * as THREE from 'three'
import { useDeviceCapability } from '@/hooks/useDeviceCapability'

const PINS = [
  { lat: 18.2208, lon: -66.5901, label: 'Puerto Rico', detail: 'Where it started.' },
  { lat: 25.7617, lon: -80.1918, label: 'Miami', detail: "Where it's based." },
  { lat: 34.0522, lon: -118.2437, label: 'Los Angeles', detail: 'Content capital.' },
  { lat: 6.2442, lon: -75.5812, label: 'Medellín', detail: 'The adventures.' },
]

function latLonToVec3(lat: number, lon: number, r: number): [number, number, number] {
  const phi = (90 - lat) * (Math.PI / 180)
  const theta = (lon + 180) * (Math.PI / 180)
  return [
    -(r * Math.sin(phi) * Math.cos(theta)),
    r * Math.cos(phi),
    r * Math.sin(phi) * Math.sin(theta),
  ]
}

function GlobePin({ lat, lon, label, detail }: {
  lat: number; lon: number; label: string; detail: string
}) {
  const [active, setActive] = useState(false)
  const pos = latLonToVec3(lat, lon, 2.05)

  return (
    <mesh
      position={pos}
      onClick={(e) => { e.stopPropagation(); setActive(!active) }}
    >
      <sphereGeometry args={[0.05, 8, 8]} />
      <meshBasicMaterial color={active ? '#f97316' : '#a8d8ff'} />
      {active && (
        <Html distanceFactor={6} center>
          <div className="glass px-4 py-3 text-center pointer-events-none" style={{ minWidth: 140 }}>
            <p className="text-white font-semibold text-sm">{label}</p>
            <p className="text-white/50 text-xs mt-1">{detail}</p>
          </div>
        </Html>
      )}
    </mesh>
  )
}

function Globe() {
  const groupRef = useRef<THREE.Group>(null!)
  const capability = useDeviceCapability()
  const segments = capability === 'low' ? 32 : capability === 'medium' ? 48 : 64

  useFrame((_, delta) => {
    if (groupRef.current) groupRef.current.rotation.y += delta * 0.08
  })

  return (
    <group ref={groupRef}>
      <Sphere args={[2, segments, segments]}>
        <meshStandardMaterial color="#0c1a2e" roughness={0.8} metalness={0.1} />
      </Sphere>
      <Sphere args={[2.12, 32, 32]}>
        <meshBasicMaterial color="#22d3ee" transparent opacity={0.04} side={THREE.BackSide} />
      </Sphere>
      {PINS.map((pin) => (
        <GlobePin key={pin.label} {...pin} />
      ))}
    </group>
  )
}

export default function GlobeScene() {
  return (
    <Canvas camera={{ position: [0, 0, 6], fov: 45 }} gl={{ antialias: true, alpha: true }}>
      <ambientLight intensity={0.3} />
      <pointLight position={[5, 3, 5]} intensity={1.5} color="#a8d8ff" />
      <pointLight position={[-5, -3, -5]} intensity={0.5} color="#22d3ee" />
      <Globe />
    </Canvas>
  )
}
