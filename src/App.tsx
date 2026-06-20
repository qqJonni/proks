import { Suspense, useEffect, useRef } from 'react'
import { Canvas } from '@react-three/fiber'
import { ScrollControls } from '@react-three/drei'
import Scene3D from './components/3d/Scene3D'
import Overlays from './components/Overlays'
import Nav from './components/Nav'
import LoadingScreen from './components/LoadingScreen'
import { useScrollStore } from './scrollStore'

function ScrollTracker() {
  const setProgress = useScrollStore((s) => s.setProgress)
  const scrollRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    const el = document.getElementById('scroll-root')
    if (!el) return
    scrollRef.current = el
    const onScroll = () => {
      const p = el.scrollTop / (el.scrollHeight - el.clientHeight)
      setProgress(Math.max(0, Math.min(1, p)))
    }
    el.addEventListener('scroll', onScroll, { passive: true })
    return () => el.removeEventListener('scroll', onScroll)
  }, [setProgress])

  return null
}

export default function App() {
  return (
    <>
      <LoadingScreen />
      <Canvas
        shadows
        camera={{ fov: 45, near: 0.1, far: 200, position: [30, 25, 30] }}
        gl={{ antialias: true, alpha: false }}
        style={{ position: 'fixed', inset: 0, zIndex: 0 }}
      >
        <color attach="background" args={['#0d0e10']} />
        <Suspense fallback={null}>
          <Scene3DNoScroll />
        </Suspense>
      </Canvas>
      <div
        id="scroll-root"
        className="relative z-10 h-screen overflow-y-auto"
        style={{ scrollBehavior: 'smooth' }}
      >
        <Nav />
        <Overlays />
      </div>
      <ScrollTracker />
    </>
  )
}

import { useRef as useRef2 } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'
import Building3D from './components/3d/Building3D'
import { EffectComposer, Bloom, Vignette } from '@react-three/postprocessing'
import React from 'react'

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
  return [a[0]+(b[0]-a[0])*t, a[1]+(b[1]-a[1])*t, a[2]+(b[2]-a[2])*t]
}
function smoothstep(t: number) { return t*t*(3-2*t) }
function getInterpolated(kf: typeof cameraKeyframes, p: number) {
  const n = kf.length - 1
  const r = p * n
  const i = Math.min(Math.floor(r), n - 1)
  const t = smoothstep(r - i)
  return { pos: lerp3(kf[i].pos, kf[i+1].pos, t), target: lerp3(kf[i].target, kf[i+1].target, t) }
}

function Scene3DNoScroll() {
  const { camera } = useThree()
  const lookAt = useRef2(new THREE.Vector3())
  const [bp, setBp] = React.useState(0)
  const [fp, setFp] = React.useState(0)
  const [cp, setCp] = React.useState(0)

  useFrame(() => {
    const p = useScrollStore.getState().progress
    const { pos, target } = getInterpolated(cameraKeyframes, Math.min(p, 0.999))
    camera.position.set(pos[0], pos[1], pos[2])
    lookAt.current.set(target[0], target[1], target[2])
    camera.lookAt(lookAt.current)

    const nb = Math.min(p / 0.15, 1)
    const nf = Math.max(0, Math.min((p - 0.1) / 0.2, 1))
    const nc = Math.max(0, Math.min((p - 0.3) / 0.25, 1))
    if (Math.abs(nb - bp) > 0.005) setBp(nb)
    if (Math.abs(nf - fp) > 0.005) setFp(nf)
    if (Math.abs(nc - cp) > 0.005) setCp(nc)
  })

  return (
    <>
      <fog attach="fog" args={['#0d0e10', 30, 100]} />
      <ambientLight intensity={0.3} />
      <directionalLight position={[20, 30, 10]} intensity={1.2} color="#ffffff" />
      <directionalLight position={[-10, 20, -10]} intensity={0.4} color="#4488cc" />
      <pointLight position={[0, 15, 0]} intensity={0.5} color="#2b7bd2" distance={40} />
      <Building3D buildProgress={bp} facadeProgress={fp} cutawayProgress={cp} />
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
