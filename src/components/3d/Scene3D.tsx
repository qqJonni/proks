import { useRef } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import { useScroll } from '@react-three/drei'
import { EffectComposer, Bloom, Vignette } from '@react-three/postprocessing'
import * as THREE from 'three'
import Building3D from './Building3D'
import { useScrollStore } from '../../scrollStore'

const cameraKeyframes = [
  { pos: [30, 25, 30], target: [0, 8, 0] },
  { pos: [25, 15, 25], target: [0, 12, 0] },
  { pos: [20, 18, -5], target: [0, 15, 0] },
  { pos: [8, 12, 15], target: [0, 10, 0] },
  { pos: [-2, 6, 4], target: [-3, 5, 0] },
  { pos: [0, 8, 1], target: [-5, 7, 0] },
  { pos: [0, 35, 0.1], target: [0, 0, 0] },
  { pos: [40, 20, 40], target: [0, 5, 0] },
]

function lerp3(a: number[], b: number[], t: number): [number, number, number] {
  return [
    a[0] + (b[0] - a[0]) * t,
    a[1] + (b[1] - a[1]) * t,
    a[2] + (b[2] - a[2]) * t,
  ]
}

function smoothstep(t: number): number {
  return t * t * (3 - 2 * t)
}

function getInterpolated(keyframes: typeof cameraKeyframes, progress: number) {
  const totalSegments = keyframes.length - 1
  const rawIndex = progress * totalSegments
  const idx = Math.min(Math.floor(rawIndex), totalSegments - 1)
  const t = smoothstep(rawIndex - idx)
  return {
    pos: lerp3(keyframes[idx].pos, keyframes[idx + 1].pos, t),
    target: lerp3(keyframes[idx].target, keyframes[idx + 1].target, t),
  }
}

function ScrollSync() {
  const scroll = useScroll()
  const { camera } = useThree()
  const targetLookAt = useRef(new THREE.Vector3())
  const setProgress = useScrollStore((s) => s.setProgress)
  const buildProgressRef = useRef(0)
  const facadeProgressRef = useRef(0)
  const cutawayProgressRef = useRef(0)

  useFrame(() => {
    const p = scroll.offset
    setProgress(p)

    const { pos, target } = getInterpolated(cameraKeyframes, Math.min(p, 0.999))
    camera.position.set(pos[0], pos[1], pos[2])
    targetLookAt.current.set(target[0], target[1], target[2])
    camera.lookAt(targetLookAt.current)

    buildProgressRef.current = Math.min(p / 0.15, 1)
    facadeProgressRef.current = Math.max(0, Math.min((p - 0.1) / 0.2, 1))
    cutawayProgressRef.current = Math.max(0, Math.min((p - 0.3) / 0.25, 1))
  })

  return (
    <BuildingAnimated
      buildRef={buildProgressRef}
      facadeRef={facadeProgressRef}
      cutawayRef={cutawayProgressRef}
    />
  )
}

function BuildingAnimated({
  buildRef,
  facadeRef,
  cutawayRef,
}: {
  buildRef: React.MutableRefObject<number>
  facadeRef: React.MutableRefObject<number>
  cutawayRef: React.MutableRefObject<number>
}) {
  const [bp, setBp] = React.useState(0)
  const [fp, setFp] = React.useState(0)
  const [cp, setCp] = React.useState(0)

  useFrame(() => {
    if (Math.abs(buildRef.current - bp) > 0.005) setBp(buildRef.current)
    if (Math.abs(facadeRef.current - fp) > 0.005) setFp(facadeRef.current)
    if (Math.abs(cutawayRef.current - cp) > 0.005) setCp(cutawayRef.current)
  })

  return <Building3D buildProgress={bp} facadeProgress={fp} cutawayProgress={cp} />
}

import React from 'react'

export default function Scene3D() {
  return (
    <>
      <fog attach="fog" args={['#0d0e10', 30, 100]} />
      <ambientLight intensity={0.3} />
      <directionalLight position={[20, 30, 10]} intensity={1.2} color="#ffffff" />
      <directionalLight position={[-10, 20, -10]} intensity={0.4} color="#4488cc" />
      <pointLight position={[0, 15, 0]} intensity={0.5} color="#2b7bd2" distance={40} />

      <ScrollSync />

      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -20, 0]}>
        <planeGeometry args={[200, 200]} />
        <meshStandardMaterial color="#111215" roughness={0.95} />
      </mesh>

      <EffectComposer>
        <Bloom luminanceThreshold={0.8} luminanceSmoothing={0.9} intensity={0.4} />
        <Vignette eskil={false} offset={0.1} darkness={0.8} />
      </EffectComposer>
    </>
  )
}
