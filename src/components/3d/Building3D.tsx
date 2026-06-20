import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

interface BuildingConfig {
  floors: number
  sectionsX: number
  sectionsZ: number
  bayWidth: number
  floorHeight: number
  columnSize: number
  slabThickness: number
  beamHeight: number
  beamWidth: number
}

const CONFIG: BuildingConfig = {
  floors: 16,
  sectionsX: 6,
  sectionsZ: 3,
  bayWidth: 3.2,
  floorHeight: 2.8,
  columnSize: 0.35,
  slabThickness: 0.22,
  beamHeight: 0.4,
  beamWidth: 0.2,
}

const concrete = new THREE.MeshStandardMaterial({ color: '#9a9a9a', roughness: 0.82, metalness: 0.05 })
const concreteDark = new THREE.MeshStandardMaterial({ color: '#707070', roughness: 0.9, metalness: 0.05 })
const rebar = new THREE.MeshStandardMaterial({ color: '#4a5560', roughness: 0.5, metalness: 0.7 })
const glass = new THREE.MeshPhysicalMaterial({
  color: '#7ab5e0',
  roughness: 0.05,
  metalness: 0.1,
  transmission: 0.6,
  transparent: true,
  opacity: 0.35,
  side: THREE.DoubleSide,
})
const glassFrame = new THREE.MeshStandardMaterial({ color: '#3a4550', roughness: 0.4, metalness: 0.6 })
const wallInterior = new THREE.MeshStandardMaterial({ color: '#c8c0b8', roughness: 0.9, metalness: 0 })
const floorMat = new THREE.MeshStandardMaterial({ color: '#b0a89a', roughness: 0.85, metalness: 0 })
const railingMat = new THREE.MeshStandardMaterial({ color: '#555555', roughness: 0.4, metalness: 0.7 })
const roofMat = new THREE.MeshStandardMaterial({ color: '#505560', roughness: 0.7, metalness: 0.3 })
const pileMat = new THREE.MeshStandardMaterial({ color: '#6a6a6a', roughness: 0.8, metalness: 0.2 })
const wireframe = new THREE.MeshBasicMaterial({ color: '#2b7bd2', wireframe: true, transparent: true, opacity: 0.08 })
const elevator = new THREE.MeshStandardMaterial({ color: '#3a3e44', roughness: 0.6, metalness: 0.4 })

interface Building3DProps {
  buildProgress: number
  facadeProgress: number
  cutawayProgress: number
}

export default function Building3D({ buildProgress, facadeProgress, cutawayProgress }: Building3DProps) {
  const groupRef = useRef<THREE.Group>(null)
  const c = CONFIG
  const totalHeight = c.floors * c.floorHeight
  const widthX = c.sectionsX * c.bayWidth
  const widthZ = c.sectionsZ * c.bayWidth

  const colPositions = useMemo(() => {
    const pos: [number, number][] = []
    for (let x = 0; x <= c.sectionsX; x++) {
      for (let z = 0; z <= c.sectionsZ; z++) {
        pos.push([x * c.bayWidth - widthX / 2, z * c.bayWidth - widthZ / 2])
      }
    }
    return pos
  }, [c, widthX, widthZ])

  const visibleFloors = Math.ceil(buildProgress * c.floors)
  const topFloorFrac = (buildProgress * c.floors) % 1 || 1

  useFrame(() => {
    if (groupRef.current) groupRef.current.position.y = -totalHeight / 2 + 2
  })

  const cutSide = cutawayProgress > 0

  return (
    <group ref={groupRef}>
      {/* === FOUNDATION === */}
      {buildProgress > 0 && (
        <group>
          {/* Pile cap / raft foundation */}
          <mesh position={[0, -0.5, 0]} material={concreteDark}>
            <boxGeometry args={[widthX + 2.5, 1.0, widthZ + 2.5]} />
          </mesh>
          {/* Piles */}
          {colPositions.map(([x, z], i) => (
            <group key={`pile-${i}`}>
              <mesh position={[x, -3.5, z]} material={pileMat}>
                <cylinderGeometry args={[0.15, 0.1, 5, 8]} />
              </mesh>
              {/* Pile cap detail */}
              <mesh position={[x, -0.9, z]} material={concreteDark}>
                <boxGeometry args={[0.7, 0.2, 0.7]} />
              </mesh>
            </group>
          ))}
          {/* Foundation waterproofing layer */}
          <mesh position={[0, 0.02, 0]} material={new THREE.MeshStandardMaterial({ color: '#2a2a2a', roughness: 0.95 })}>
            <boxGeometry args={[widthX + 2, 0.04, widthZ + 2]} />
          </mesh>
        </group>
      )}

      {/* === FLOORS === */}
      {Array.from({ length: visibleFloors }, (_, fi) => {
        const isTop = fi === visibleFloors - 1
        const scale = isTop ? topFloorFrac : 1
        const y = fi * c.floorHeight
        const showFacade = facadeProgress > 0 && fi > 0
        const isCut = cutSide && fi > 2

        return (
          <group key={`f${fi}`}>
            {/* --- COLUMNS --- */}
            {colPositions.map(([x, z], ci) => {
              if (isCut && x > widthX * 0.15 && z > -widthZ * 0.1) return null
              return (
                <mesh
                  key={`c${fi}-${ci}`}
                  position={[x, y + c.floorHeight * scale / 2, z]}
                  material={concrete}
                  scale={[1, scale, 1]}
                >
                  <boxGeometry args={[c.columnSize, c.floorHeight, c.columnSize]} />
                </mesh>
              )
            })}

            {/* --- SLAB --- */}
            {scale > 0.3 && (
              <group>
                <mesh position={[0, y + c.floorHeight, 0]} material={concrete}>
                  <boxGeometry args={[widthX + 0.8, c.slabThickness, widthZ + 0.8]} />
                </mesh>
                {buildProgress < 0.5 && (
                  <mesh position={[0, y + c.floorHeight, 0]} material={wireframe}>
                    <boxGeometry args={[widthX + 0.8, c.slabThickness, widthZ + 0.8]} />
                  </mesh>
                )}
                {/* Slab edge / drip */}
                <mesh position={[0, y + c.floorHeight - c.slabThickness / 2 - 0.03, widthZ / 2 + 0.42]} material={concreteDark}>
                  <boxGeometry args={[widthX + 0.8, 0.06, 0.06]} />
                </mesh>
                <mesh position={[0, y + c.floorHeight - c.slabThickness / 2 - 0.03, -widthZ / 2 - 0.42]} material={concreteDark}>
                  <boxGeometry args={[widthX + 0.8, 0.06, 0.06]} />
                </mesh>
              </group>
            )}

            {/* --- BEAMS (along X, at each Z column line) --- */}
            {scale > 0.5 && Array.from({ length: c.sectionsX }, (_, bx) => (
              <group key={`bx${fi}-${bx}`}>
                {[0, c.sectionsZ].map((zIdx) => {
                  const zPos = zIdx * c.bayWidth - widthZ / 2
                  return (
                    <mesh
                      key={`bxz${zIdx}`}
                      position={[
                        bx * c.bayWidth - widthX / 2 + c.bayWidth / 2,
                        y + c.floorHeight - c.slabThickness / 2 - c.beamHeight / 2,
                        zPos,
                      ]}
                      material={concrete}
                    >
                      <boxGeometry args={[c.bayWidth - c.columnSize, c.beamHeight, c.beamWidth]} />
                    </mesh>
                  )
                })}
              </group>
            ))}

            {/* --- BEAMS (along Z, at each X column line) --- */}
            {scale > 0.5 && Array.from({ length: c.sectionsZ }, (_, bz) => (
              <group key={`bz${fi}-${bz}`}>
                {[0, c.sectionsX].map((xIdx) => {
                  const xPos = xIdx * c.bayWidth - widthX / 2
                  return (
                    <mesh
                      key={`bzx${xIdx}`}
                      position={[
                        xPos,
                        y + c.floorHeight - c.slabThickness / 2 - c.beamHeight / 2,
                        bz * c.bayWidth - widthZ / 2 + c.bayWidth / 2,
                      ]}
                      material={concrete}
                    >
                      <boxGeometry args={[c.beamWidth, c.beamHeight, c.bayWidth - c.columnSize]} />
                    </mesh>
                  )
                })}
              </group>
            ))}

            {/* --- FACADE GLASS PANELS --- */}
            {showFacade && !isCut && (
              <group>
                {/* Front & back facades — individual panels per bay */}
                {Array.from({ length: c.sectionsX }, (_, sx) => {
                  const xCenter = sx * c.bayWidth - widthX / 2 + c.bayWidth / 2
                  const panelW = c.bayWidth - c.columnSize - 0.1
                  const panelH = c.floorHeight * 0.75 * Math.min(facadeProgress * 2, 1)
                  const yCenter = y + c.floorHeight * 0.5 + 0.1

                  return (
                    <group key={`fp${fi}-${sx}`}>
                      {/* Front */}
                      <mesh position={[xCenter, yCenter, widthZ / 2 + 0.08]} material={glass}>
                        <boxGeometry args={[panelW, panelH, 0.02]} />
                      </mesh>
                      {/* Window frame front */}
                      <mesh position={[xCenter, yCenter, widthZ / 2 + 0.1]} material={glassFrame}>
                        <boxGeometry args={[panelW + 0.04, 0.03, 0.02]} />
                      </mesh>
                      <mesh position={[xCenter, yCenter + panelH / 2, widthZ / 2 + 0.1]} material={glassFrame}>
                        <boxGeometry args={[panelW + 0.04, 0.03, 0.02]} />
                      </mesh>
                      <mesh position={[xCenter, yCenter - panelH / 2, widthZ / 2 + 0.1]} material={glassFrame}>
                        <boxGeometry args={[panelW + 0.04, 0.03, 0.02]} />
                      </mesh>
                      {/* Back */}
                      <mesh position={[xCenter, yCenter, -widthZ / 2 - 0.08]} material={glass}>
                        <boxGeometry args={[panelW, panelH, 0.02]} />
                      </mesh>
                      <mesh position={[xCenter, yCenter, -widthZ / 2 - 0.1]} material={glassFrame}>
                        <boxGeometry args={[panelW + 0.04, 0.03, 0.02]} />
                      </mesh>
                      {/* Spandrel panel (below window) */}
                      {facadeProgress > 0.5 && (
                        <>
                          <mesh position={[xCenter, y + 0.2, widthZ / 2 + 0.06]} material={concreteDark}>
                            <boxGeometry args={[panelW, 0.35, 0.04]} />
                          </mesh>
                          <mesh position={[xCenter, y + 0.2, -widthZ / 2 - 0.06]} material={concreteDark}>
                            <boxGeometry args={[panelW, 0.35, 0.04]} />
                          </mesh>
                        </>
                      )}
                    </group>
                  )
                })}
                {/* Side facades */}
                {Array.from({ length: c.sectionsZ }, (_, sz) => {
                  const zCenter = sz * c.bayWidth - widthZ / 2 + c.bayWidth / 2
                  const panelW = c.bayWidth - c.columnSize - 0.1
                  const panelH = c.floorHeight * 0.75 * Math.min(facadeProgress * 2, 1)
                  const yCenter = y + c.floorHeight * 0.5 + 0.1
                  return (
                    <group key={`fs${fi}-${sz}`}>
                      <mesh position={[widthX / 2 + 0.08, yCenter, zCenter]} material={glass}>
                        <boxGeometry args={[0.02, panelH, panelW]} />
                      </mesh>
                      <mesh position={[-widthX / 2 - 0.08, yCenter, zCenter]} material={glass}>
                        <boxGeometry args={[0.02, panelH, panelW]} />
                      </mesh>
                      <mesh position={[widthX / 2 + 0.1, yCenter, zCenter]} material={glassFrame}>
                        <boxGeometry args={[0.02, 0.03, panelW + 0.04]} />
                      </mesh>
                      <mesh position={[-widthX / 2 - 0.1, yCenter, zCenter]} material={glassFrame}>
                        <boxGeometry args={[0.02, 0.03, panelW + 0.04]} />
                      </mesh>
                    </group>
                  )
                })}
              </group>
            )}

            {/* --- BALCONY SLABS (every 2nd floor, front facade) --- */}
            {showFacade && fi > 1 && fi % 2 === 0 && !isCut && (
              <group>
                {[1, 3, 5].map((sx) => {
                  const xCenter = sx * c.bayWidth - widthX / 2 + c.bayWidth / 2
                  return (
                    <group key={`bal${fi}-${sx}`}>
                      <mesh position={[xCenter, y + c.floorHeight * 0.05, widthZ / 2 + 0.8]}>
                        <boxGeometry args={[c.bayWidth * 0.8, 0.12, 1.2]} />
                        <meshStandardMaterial color="#888888" roughness={0.8} />
                      </mesh>
                      {/* Railing posts */}
                      {[-0.35, 0, 0.35].map((ox, ri) => (
                        <mesh key={ri} position={[xCenter + ox * c.bayWidth, y + c.floorHeight * 0.05 + 0.5, widthZ / 2 + 1.35]} material={railingMat}>
                          <boxGeometry args={[0.03, 1.0, 0.03]} />
                        </mesh>
                      ))}
                      {/* Railing horizontal */}
                      <mesh position={[xCenter, y + c.floorHeight * 0.05 + 1.0, widthZ / 2 + 1.35]} material={railingMat}>
                        <boxGeometry args={[c.bayWidth * 0.8, 0.03, 0.03]} />
                      </mesh>
                    </group>
                  )
                })}
              </group>
            )}

            {/* --- INTERIOR (visible in cutaway) --- */}
            {isCut && (
              <group>
                {/* Floor finish */}
                <mesh position={[0, y + 0.02, 0]} material={floorMat}>
                  <boxGeometry args={[widthX * 0.4, 0.04, widthZ * 0.9]} />
                </mesh>
                {/* Partition walls */}
                {fi % 2 === 0 && (
                  <>
                    <mesh position={[-widthX * 0.1, y + c.floorHeight * 0.45, 0]} material={wallInterior}>
                      <boxGeometry args={[0.1, c.floorHeight * 0.85, widthZ * 0.7]} />
                    </mesh>
                    <mesh position={[-widthX * 0.1, y + c.floorHeight * 0.45, widthZ * 0.15]} material={wallInterior}>
                      <boxGeometry args={[widthX * 0.25, c.floorHeight * 0.85, 0.1]} />
                    </mesh>
                  </>
                )}
                {fi % 2 === 1 && (
                  <mesh position={[-widthX * 0.15, y + c.floorHeight * 0.45, -widthZ * 0.1]} material={wallInterior}>
                    <boxGeometry args={[0.1, c.floorHeight * 0.85, widthZ * 0.5]} />
                  </mesh>
                )}
              </group>
            )}

            {/* --- STAIRWELL / ELEVATOR CORE --- */}
            {scale > 0.5 && (
              <group>
                {/* Core walls */}
                <mesh position={[-widthX / 2 + c.bayWidth * 0.5, y + c.floorHeight / 2, 0]} material={elevator}>
                  <boxGeometry args={[c.bayWidth * 0.8, c.floorHeight, 0.12]} />
                </mesh>
                <mesh position={[-widthX / 2 + c.bayWidth * 0.1, y + c.floorHeight / 2, 0]} material={elevator}>
                  <boxGeometry args={[0.12, c.floorHeight, c.bayWidth * 0.8]} />
                </mesh>
                <mesh position={[-widthX / 2 + c.bayWidth * 0.9, y + c.floorHeight / 2, 0]} material={elevator}>
                  <boxGeometry args={[0.12, c.floorHeight, c.bayWidth * 0.8]} />
                </mesh>
                {/* Stair flights */}
                {fi > 0 && fi < c.floors - 1 && (
                  <mesh
                    position={[-widthX / 2 + c.bayWidth * 0.5, y + c.floorHeight * 0.3, -0.15]}
                    rotation={[0.35, 0, 0]}
                    material={concrete}
                  >
                    <boxGeometry args={[0.9, 0.08, 1.5]} />
                  </mesh>
                )}
              </group>
            )}
          </group>
        )
      })}

      {/* === ROOF === */}
      {buildProgress > 0.9 && (
        <group>
          <mesh position={[0, c.floors * c.floorHeight + 0.15, 0]} material={roofMat}>
            <boxGeometry args={[widthX + 1.2, 0.3, widthZ + 1.2]} />
          </mesh>
          {/* Parapet */}
          <mesh position={[0, c.floors * c.floorHeight + 0.6, widthZ / 2 + 0.55]} material={concreteDark}>
            <boxGeometry args={[widthX + 1.2, 0.9, 0.12]} />
          </mesh>
          <mesh position={[0, c.floors * c.floorHeight + 0.6, -widthZ / 2 - 0.55]} material={concreteDark}>
            <boxGeometry args={[widthX + 1.2, 0.9, 0.12]} />
          </mesh>
          <mesh position={[widthX / 2 + 0.55, c.floors * c.floorHeight + 0.6, 0]} material={concreteDark}>
            <boxGeometry args={[0.12, 0.9, widthZ + 1.2]} />
          </mesh>
          <mesh position={[-widthX / 2 - 0.55, c.floors * c.floorHeight + 0.6, 0]} material={concreteDark}>
            <boxGeometry args={[0.12, 0.9, widthZ + 1.2]} />
          </mesh>
          {/* Elevator machine room */}
          <mesh position={[-widthX / 2 + c.bayWidth * 0.5, c.floors * c.floorHeight + 1.5, 0]} material={elevator}>
            <boxGeometry args={[c.bayWidth * 0.8, 2.5, c.bayWidth * 0.8]} />
          </mesh>
          {/* Ventilation pipes */}
          {[0, 3, 6, 9, 12, 15].map((i) => (
            <mesh key={`vent${i}`} position={[i * 1.2 - widthX / 2 + 2, c.floors * c.floorHeight + 1.2, widthZ * 0.2]} material={railingMat}>
              <cylinderGeometry args={[0.08, 0.08, 2, 6]} />
            </mesh>
          ))}
        </group>
      )}


      {/* === GROUND SURROUNDINGS === */}
      {buildProgress > 0.3 && (
        <group>
          {/* Construction fence */}
          {[-1, 1].map((side) => (
            <mesh key={`fence${side}`} position={[0, -5.5, side * (widthZ / 2 + 4)]} material={new THREE.MeshStandardMaterial({ color: '#2266aa', roughness: 0.8 })}>
              <boxGeometry args={[widthX + 8, 2, 0.05]} />
            </mesh>
          ))}
        </group>
      )}
    </group>
  )
}
