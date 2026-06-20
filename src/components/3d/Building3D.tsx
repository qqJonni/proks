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
const concreteLight = new THREE.MeshStandardMaterial({ color: '#b0b0b0', roughness: 0.75, metalness: 0.03 })
const rebar = new THREE.MeshStandardMaterial({ color: '#6a4a3a', roughness: 0.5, metalness: 0.7 })
const glass = new THREE.MeshPhysicalMaterial({
  color: '#7ab5e0', roughness: 0.05, metalness: 0.1,
  transmission: 0.6, transparent: true, opacity: 0.35, side: THREE.DoubleSide,
})
const glassFrame = new THREE.MeshStandardMaterial({ color: '#3a4550', roughness: 0.4, metalness: 0.6 })
const wallInterior = new THREE.MeshStandardMaterial({ color: '#c8c0b8', roughness: 0.9, metalness: 0 })
const floorMat = new THREE.MeshStandardMaterial({ color: '#b0a89a', roughness: 0.85, metalness: 0 })
const railingMat = new THREE.MeshStandardMaterial({ color: '#555555', roughness: 0.4, metalness: 0.7 })
const roofMat = new THREE.MeshStandardMaterial({ color: '#505560', roughness: 0.7, metalness: 0.3 })
const pileMat = new THREE.MeshStandardMaterial({ color: '#6a6a6a', roughness: 0.8, metalness: 0.2 })
const wireframe = new THREE.MeshBasicMaterial({ color: '#2b7bd2', wireframe: true, transparent: true, opacity: 0.08 })
const elevator = new THREE.MeshStandardMaterial({ color: '#3a3e44', roughness: 0.6, metalness: 0.4 })
const waterproof = new THREE.MeshStandardMaterial({ color: '#1a1a1a', roughness: 0.95, metalness: 0 })
const insulation = new THREE.MeshStandardMaterial({ color: '#d4a040', roughness: 0.95, metalness: 0 })
const pipe = new THREE.MeshStandardMaterial({ color: '#666', roughness: 0.3, metalness: 0.8 })
const ductMat = new THREE.MeshStandardMaterial({ color: '#7a7a7a', roughness: 0.5, metalness: 0.5 })

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
      {/* ========== FOUNDATION ========== */}
      {buildProgress > 0 && (
        <group>
          {/* Raft / pile cap */}
          <mesh position={[0, -0.5, 0]} material={concreteDark}>
            <boxGeometry args={[widthX + 2.5, 1.0, widthZ + 2.5]} />
          </mesh>
          {/* Waterproofing membrane */}
          <mesh position={[0, 0.02, 0]} material={waterproof}>
            <boxGeometry args={[widthX + 2.2, 0.04, widthZ + 2.2]} />
          </mesh>
          {/* Insulation layer */}
          <mesh position={[0, 0.08, 0]} material={insulation}>
            <boxGeometry args={[widthX + 2.0, 0.06, widthZ + 2.0]} />
          </mesh>
          {/* Piles with rebar stubs */}
          {colPositions.map(([x, z], i) => (
            <group key={`pile-${i}`}>
              <mesh position={[x, -3.5, z]} material={pileMat}>
                <cylinderGeometry args={[0.15, 0.1, 5, 8]} />
              </mesh>
              <mesh position={[x, -0.9, z]} material={concreteDark}>
                <boxGeometry args={[0.7, 0.2, 0.7]} />
              </mesh>
              {/* Rebar stubs sticking out of pile into cap */}
              {[[-0.06, -0.06], [0.06, -0.06], [-0.06, 0.06], [0.06, 0.06]].map(([dx, dz], ri) => (
                <mesh key={ri} position={[x + dx, -0.3, z + dz]} material={rebar}>
                  <cylinderGeometry args={[0.012, 0.012, 1.2, 4]} />
                </mesh>
              ))}
            </group>
          ))}
          {/* Foundation drainage pipes */}
          {[-1, 1].map((side) => (
            <mesh key={`drain${side}`} position={[0, -0.8, side * (widthZ / 2 + 1.4)]} rotation={[0, 0, Math.PI / 2]} material={pipe}>
              <cylinderGeometry args={[0.06, 0.06, widthX + 2, 8]} />
            </mesh>
          ))}
        </group>
      )}

      {/* ========== FLOORS ========== */}
      {Array.from({ length: visibleFloors }, (_, fi) => {
        const isTop = fi === visibleFloors - 1
        const scale = isTop ? topFloorFrac : 1
        const y = fi * c.floorHeight
        const showFacade = facadeProgress > 0 && fi > 0
        const isCut = cutSide && fi > 2

        return (
          <group key={`f${fi}`}>
            {/* --- COLUMNS with chamfered capital --- */}
            {colPositions.map(([x, z], ci) => {
              if (isCut && x > widthX * 0.15 && z > -widthZ * 0.1) return null
              return (
                <group key={`c${fi}-${ci}`}>
                  <mesh
                    position={[x, y + c.floorHeight * scale / 2, z]}
                    material={concrete}
                    scale={[1, scale, 1]}
                  >
                    <boxGeometry args={[c.columnSize, c.floorHeight, c.columnSize]} />
                  </mesh>
                  {/* Column capital (wider at top) */}
                  {scale > 0.9 && (
                    <mesh position={[x, y + c.floorHeight - 0.08, z]} material={concrete}>
                      <boxGeometry args={[c.columnSize + 0.08, 0.12, c.columnSize + 0.08]} />
                    </mesh>
                  )}
                  {/* Rebar stubs on top of column (visible during construction) */}
                  {isTop && scale > 0.8 && buildProgress < 0.9 && (
                    <>
                      {[[-0.08, -0.08], [0.08, -0.08], [-0.08, 0.08], [0.08, 0.08]].map(([dx, dz], ri) => (
                        <mesh key={ri} position={[x + dx, y + c.floorHeight * scale + 0.3, z + dz]} material={rebar}>
                          <cylinderGeometry args={[0.01, 0.01, 0.6, 4]} />
                        </mesh>
                      ))}
                    </>
                  )}
                </group>
              )
            })}

            {/* --- SLAB with ribs --- */}
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
                {/* Slab edge profile (4 sides) */}
                {[
                  [0, widthZ / 2 + 0.42, widthX + 0.8, 0.06],
                  [0, -widthZ / 2 - 0.42, widthX + 0.8, 0.06],
                ].map(([xp, zp, w, d], ei) => (
                  <mesh key={`se${ei}`} position={[xp, y + c.floorHeight - c.slabThickness / 2 - 0.03, zp]} material={concreteDark}>
                    <boxGeometry args={[w as number, 0.06, d as number]} />
                  </mesh>
                ))}
                {[
                  [widthX / 2 + 0.42, 0, 0.06, widthZ + 0.8],
                  [-widthX / 2 - 0.42, 0, 0.06, widthZ + 0.8],
                ].map(([xp, zp, w, d], ei) => (
                  <mesh key={`sse${ei}`} position={[xp, y + c.floorHeight - c.slabThickness / 2 - 0.03, zp]} material={concreteDark}>
                    <boxGeometry args={[w as number, 0.06, d as number]} />
                  </mesh>
                ))}

                {/* Slab bottom ribs (cross-ribs between beams for realism) */}
                {fi > 0 && Array.from({ length: c.sectionsX }, (_, rx) =>
                  Array.from({ length: 2 }, (_, rr) => {
                    const xp = rx * c.bayWidth - widthX / 2 + c.bayWidth * (rr === 0 ? 0.33 : 0.67)
                    return (
                      <mesh key={`rib${fi}-${rx}-${rr}`} position={[xp, y + c.floorHeight - c.slabThickness - 0.06, 0]} material={concreteLight}>
                        <boxGeometry args={[0.08, 0.1, widthZ * 0.95]} />
                      </mesh>
                    )
                  })
                )}
              </group>
            )}

            {/* --- BEAMS (along X) — all Z lines, not just edges --- */}
            {scale > 0.5 && Array.from({ length: c.sectionsX }, (_, bx) => (
              <group key={`bx${fi}-${bx}`}>
                {Array.from({ length: c.sectionsZ + 1 }, (_, zIdx) => {
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

            {/* --- BEAMS (along Z) — all X lines --- */}
            {scale > 0.5 && Array.from({ length: c.sectionsZ }, (_, bz) => (
              <group key={`bz${fi}-${bz}`}>
                {Array.from({ length: c.sectionsX + 1 }, (_, xIdx) => {
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

            {/* --- SHEAR WALLS (at ends and core) --- */}
            {scale > 0.5 && fi > 0 && (
              <group>
                {/* End shear wall (left) */}
                <mesh position={[-widthX / 2 + 0.06, y + c.floorHeight / 2, widthZ / 4]} material={concrete}>
                  <boxGeometry args={[0.12, c.floorHeight, c.bayWidth * 0.7]} />
                </mesh>
                {/* End shear wall (right) */}
                <mesh position={[widthX / 2 - 0.06, y + c.floorHeight / 2, -widthZ / 4]} material={concrete}>
                  <boxGeometry args={[0.12, c.floorHeight, c.bayWidth * 0.7]} />
                </mesh>
              </group>
            )}

            {/* --- FACADE --- */}
            {showFacade && !isCut && (
              <group>
                {Array.from({ length: c.sectionsX }, (_, sx) => {
                  const xCenter = sx * c.bayWidth - widthX / 2 + c.bayWidth / 2
                  const panelW = c.bayWidth - c.columnSize - 0.1
                  const panelH = c.floorHeight * 0.75 * Math.min(facadeProgress * 2, 1)
                  const yCenter = y + c.floorHeight * 0.5 + 0.1

                  return (
                    <group key={`fp${fi}-${sx}`}>
                      {/* Front & back glass */}
                      {[widthZ / 2 + 0.08, -widthZ / 2 - 0.08].map((zp, zi) => (
                        <group key={zi}>
                          <mesh position={[xCenter, yCenter, zp]} material={glass}>
                            <boxGeometry args={[panelW, panelH, 0.02]} />
                          </mesh>
                          {/* Horizontal mullions */}
                          <mesh position={[xCenter, yCenter + panelH / 2, zp + (zi === 0 ? 0.02 : -0.02)]} material={glassFrame}>
                            <boxGeometry args={[panelW + 0.04, 0.03, 0.02]} />
                          </mesh>
                          <mesh position={[xCenter, yCenter - panelH / 2, zp + (zi === 0 ? 0.02 : -0.02)]} material={glassFrame}>
                            <boxGeometry args={[panelW + 0.04, 0.03, 0.02]} />
                          </mesh>
                          <mesh position={[xCenter, yCenter, zp + (zi === 0 ? 0.02 : -0.02)]} material={glassFrame}>
                            <boxGeometry args={[panelW + 0.04, 0.03, 0.02]} />
                          </mesh>
                          {/* Vertical mullion (center divider) */}
                          <mesh position={[xCenter, yCenter, zp + (zi === 0 ? 0.02 : -0.02)]} material={glassFrame}>
                            <boxGeometry args={[0.03, panelH, 0.02]} />
                          </mesh>
                          {/* Spandrel */}
                          {facadeProgress > 0.5 && (
                            <mesh position={[xCenter, y + 0.2, zp - (zi === 0 ? 0.02 : -0.02)]} material={concreteDark}>
                              <boxGeometry args={[panelW, 0.35, 0.04]} />
                            </mesh>
                          )}
                        </group>
                      ))}
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
                      {[widthX / 2 + 0.08, -widthX / 2 - 0.08].map((xp, xi) => (
                        <group key={xi}>
                          <mesh position={[xp, yCenter, zCenter]} material={glass}>
                            <boxGeometry args={[0.02, panelH, panelW]} />
                          </mesh>
                          <mesh position={[xp + (xi === 0 ? 0.02 : -0.02), yCenter, zCenter]} material={glassFrame}>
                            <boxGeometry args={[0.02, 0.03, panelW + 0.04]} />
                          </mesh>
                          <mesh position={[xp + (xi === 0 ? 0.02 : -0.02), yCenter, zCenter]} material={glassFrame}>
                            <boxGeometry args={[0.02, panelH, 0.03]} />
                          </mesh>
                        </group>
                      ))}
                    </group>
                  )
                })}
              </group>
            )}

            {/* --- BALCONIES --- */}
            {showFacade && fi > 1 && fi % 2 === 0 && !isCut && (
              <group>
                {[1, 3, 5].map((sx) => {
                  const xc = sx * c.bayWidth - widthX / 2 + c.bayWidth / 2
                  const balY = y + c.floorHeight * 0.05
                  const balZ = widthZ / 2
                  return (
                    <group key={`bal${fi}-${sx}`}>
                      {/* Slab */}
                      <mesh position={[xc, balY, balZ + 0.8]}>
                        <boxGeometry args={[c.bayWidth * 0.8, 0.12, 1.2]} />
                        <meshStandardMaterial color="#888" roughness={0.8} />
                      </mesh>
                      {/* Drip edge */}
                      <mesh position={[xc, balY - 0.07, balZ + 1.38]} material={concreteDark}>
                        <boxGeometry args={[c.bayWidth * 0.8, 0.02, 0.04]} />
                      </mesh>
                      {/* Glass railing */}
                      <mesh position={[xc, balY + 0.55, balZ + 1.35]}>
                        <boxGeometry args={[c.bayWidth * 0.75, 0.95, 0.02]} />
                        <meshPhysicalMaterial color="#aaccee" transmission={0.5} transparent opacity={0.2} roughness={0.05} />
                      </mesh>
                      {/* Railing top rail */}
                      <mesh position={[xc, balY + 1.05, balZ + 1.35]} material={railingMat}>
                        <boxGeometry args={[c.bayWidth * 0.8, 0.04, 0.04]} />
                      </mesh>
                      {/* Railing posts */}
                      {[-0.38, 0.38].map((ox, ri) => (
                        <mesh key={ri} position={[xc + ox * c.bayWidth, balY + 0.55, balZ + 1.35]} material={railingMat}>
                          <boxGeometry args={[0.03, 1.05, 0.03]} />
                        </mesh>
                      ))}
                    </group>
                  )
                })}
                {/* Back facade balconies (smaller) */}
                {[2, 4].map((sx) => {
                  const xc = sx * c.bayWidth - widthX / 2 + c.bayWidth / 2
                  return (
                    <group key={`balb${fi}-${sx}`}>
                      <mesh position={[xc, y + c.floorHeight * 0.05, -widthZ / 2 - 0.6]}>
                        <boxGeometry args={[c.bayWidth * 0.6, 0.1, 0.8]} />
                        <meshStandardMaterial color="#888" roughness={0.8} />
                      </mesh>
                      <mesh position={[xc, y + c.floorHeight * 0.05 + 0.55, -widthZ / 2 - 0.98]} material={railingMat}>
                        <boxGeometry args={[c.bayWidth * 0.6, 1.0, 0.03]} />
                      </mesh>
                    </group>
                  )
                })}
              </group>
            )}

            {/* --- INTERIOR (cutaway) --- */}
            {isCut && (
              <group>
                <mesh position={[0, y + 0.02, 0]} material={floorMat}>
                  <boxGeometry args={[widthX * 0.4, 0.04, widthZ * 0.9]} />
                </mesh>
                {fi % 3 === 0 && (
                  <>
                    <mesh position={[-widthX * 0.1, y + c.floorHeight * 0.45, 0]} material={wallInterior}>
                      <boxGeometry args={[0.1, c.floorHeight * 0.85, widthZ * 0.7]} />
                    </mesh>
                    <mesh position={[-widthX * 0.1, y + c.floorHeight * 0.45, widthZ * 0.15]} material={wallInterior}>
                      <boxGeometry args={[widthX * 0.25, c.floorHeight * 0.85, 0.1]} />
                    </mesh>
                    {/* Door opening in wall */}
                    <mesh position={[-widthX * 0.1, y + 1.1, widthZ * 0.05]} material={wallInterior}>
                      <boxGeometry args={[0.12, 2.1, 0.9]} />
                    </mesh>
                  </>
                )}
                {fi % 3 === 1 && (
                  <>
                    <mesh position={[-widthX * 0.15, y + c.floorHeight * 0.45, -widthZ * 0.1]} material={wallInterior}>
                      <boxGeometry args={[0.1, c.floorHeight * 0.85, widthZ * 0.5]} />
                    </mesh>
                    <mesh position={[-widthX * 0.02, y + c.floorHeight * 0.45, -widthZ * 0.1]} material={wallInterior}>
                      <boxGeometry args={[widthX * 0.2, c.floorHeight * 0.85, 0.1]} />
                    </mesh>
                  </>
                )}
                {fi % 3 === 2 && (
                  <mesh position={[-widthX * 0.08, y + c.floorHeight * 0.45, widthZ * 0.08]} material={wallInterior}>
                    <boxGeometry args={[0.1, c.floorHeight * 0.85, widthZ * 0.6]} />
                  </mesh>
                )}
              </group>
            )}

            {/* --- STAIRWELL / ELEVATOR CORE --- */}
            {scale > 0.5 && (
              <group>
                {/* Core walls — U-shape */}
                <mesh position={[-widthX / 2 + c.bayWidth * 0.5, y + c.floorHeight / 2, 0]} material={elevator}>
                  <boxGeometry args={[c.bayWidth * 0.8, c.floorHeight, 0.15]} />
                </mesh>
                <mesh position={[-widthX / 2 + c.bayWidth * 0.1, y + c.floorHeight / 2, 0]} material={elevator}>
                  <boxGeometry args={[0.15, c.floorHeight, c.bayWidth * 0.8]} />
                </mesh>
                <mesh position={[-widthX / 2 + c.bayWidth * 0.9, y + c.floorHeight / 2, 0]} material={elevator}>
                  <boxGeometry args={[0.15, c.floorHeight, c.bayWidth * 0.8]} />
                </mesh>
                {/* Elevator guide rails */}
                {[-0.25, 0.25].map((dz, i) => (
                  <mesh key={`rail${i}`} position={[-widthX / 2 + c.bayWidth * 0.35, y + c.floorHeight / 2, dz]} material={railingMat}>
                    <boxGeometry args={[0.04, c.floorHeight, 0.04]} />
                  </mesh>
                ))}
                {/* Stair flights (two-run with landing) */}
                {fi > 0 && fi < c.floors - 1 && (
                  <>
                    {/* Lower flight */}
                    <mesh
                      position={[-widthX / 2 + c.bayWidth * 0.65, y + c.floorHeight * 0.25, -0.25]}
                      rotation={[0.32, 0, 0]}
                      material={concrete}
                    >
                      <boxGeometry args={[0.85, 0.08, 1.2]} />
                    </mesh>
                    {/* Landing */}
                    <mesh position={[-widthX / 2 + c.bayWidth * 0.65, y + c.floorHeight * 0.48, 0.35]} material={concrete}>
                      <boxGeometry args={[0.85, 0.1, 0.5]} />
                    </mesh>
                    {/* Upper flight */}
                    <mesh
                      position={[-widthX / 2 + c.bayWidth * 0.65, y + c.floorHeight * 0.72, 0.1]}
                      rotation={[-0.32, 0, 0]}
                      material={concrete}
                    >
                      <boxGeometry args={[0.85, 0.08, 1.2]} />
                    </mesh>
                    {/* Stair railing */}
                    <mesh position={[-widthX / 2 + c.bayWidth * 0.25, y + c.floorHeight * 0.5, 0]} material={railingMat}>
                      <boxGeometry args={[0.03, c.floorHeight * 0.9, 0.03]} />
                    </mesh>
                  </>
                )}
                {/* Second elevator/stair core (right side) */}
                {fi > 0 && (
                  <group>
                    <mesh position={[widthX / 2 - c.bayWidth * 0.5, y + c.floorHeight / 2, 0]} material={elevator}>
                      <boxGeometry args={[c.bayWidth * 0.6, c.floorHeight, 0.15]} />
                    </mesh>
                    <mesh position={[widthX / 2 - c.bayWidth * 0.2, y + c.floorHeight / 2, 0]} material={elevator}>
                      <boxGeometry args={[0.15, c.floorHeight, c.bayWidth * 0.6]} />
                    </mesh>
                  </group>
                )}
              </group>
            )}

            {/* --- MEP RISERS (visible on bare frame) --- */}
            {fi > 0 && fi < c.floors && buildProgress > 0.3 && (
              <group>
                {/* Vertical pipes at column intersections */}
                {[1, 3, 5].map((sx) => (
                  <mesh key={`pipe${fi}-${sx}`} position={[sx * c.bayWidth - widthX / 2 + 0.2, y + c.floorHeight / 2, -widthZ / 2 + 0.3]} material={pipe}>
                    <cylinderGeometry args={[0.04, 0.04, c.floorHeight, 6]} />
                  </mesh>
                ))}
                {/* Horizontal duct run (HVAC) */}
                {fi % 4 === 0 && (
                  <mesh position={[0, y + c.floorHeight - 0.5, widthZ / 4]} material={ductMat}>
                    <boxGeometry args={[widthX * 0.8, 0.2, 0.3]} />
                  </mesh>
                )}
              </group>
            )}
          </group>
        )
      })}

      {/* ========== ROOF ========== */}
      {buildProgress > 0.9 && (
        <group>
          {/* Roof slab */}
          <mesh position={[0, c.floors * c.floorHeight + 0.15, 0]} material={roofMat}>
            <boxGeometry args={[widthX + 1.2, 0.3, widthZ + 1.2]} />
          </mesh>
          {/* Waterproofing on roof */}
          <mesh position={[0, c.floors * c.floorHeight + 0.32, 0]} material={waterproof}>
            <boxGeometry args={[widthX + 1.0, 0.02, widthZ + 1.0]} />
          </mesh>
          {/* Parapet walls (4 sides) */}
          {[
            [0, widthZ / 2 + 0.55, widthX + 1.2, 0.15],
            [0, -widthZ / 2 - 0.55, widthX + 1.2, 0.15],
          ].map(([xp, zp, w, d], i) => (
            <mesh key={`par${i}`} position={[xp, c.floors * c.floorHeight + 0.7, zp]} material={concreteDark}>
              <boxGeometry args={[w as number, 1.0, d as number]} />
            </mesh>
          ))}
          {[
            [widthX / 2 + 0.55, 0, 0.15, widthZ + 1.2],
            [-widthX / 2 - 0.55, 0, 0.15, widthZ + 1.2],
          ].map(([xp, zp, w, d], i) => (
            <mesh key={`pars${i}`} position={[xp, c.floors * c.floorHeight + 0.7, zp]} material={concreteDark}>
              <boxGeometry args={[w as number, 1.0, d as number]} />
            </mesh>
          ))}
          {/* Parapet cap (metal flashing) */}
          <mesh position={[0, c.floors * c.floorHeight + 1.22, widthZ / 2 + 0.55]} material={railingMat}>
            <boxGeometry args={[widthX + 1.4, 0.04, 0.25]} />
          </mesh>
          <mesh position={[0, c.floors * c.floorHeight + 1.22, -widthZ / 2 - 0.55]} material={railingMat}>
            <boxGeometry args={[widthX + 1.4, 0.04, 0.25]} />
          </mesh>
          {/* Elevator machine room */}
          <mesh position={[-widthX / 2 + c.bayWidth * 0.5, c.floors * c.floorHeight + 1.6, 0]} material={elevator}>
            <boxGeometry args={[c.bayWidth * 0.8, 2.5, c.bayWidth * 0.8]} />
          </mesh>
          {/* Machine room door */}
          <mesh position={[-widthX / 2 + c.bayWidth * 0.9 + 0.01, c.floors * c.floorHeight + 1.3, 0]} material={railingMat}>
            <boxGeometry args={[0.02, 1.8, 0.7]} />
          </mesh>
          {/* Ventilation pipes */}
          {[0, 2.5, 5, 7.5, 10, 12.5, 15].map((i) => (
            <mesh key={`vent${i}`} position={[i * 1.2 - widthX / 2 + 2, c.floors * c.floorHeight + 1.5, widthZ * 0.2]} material={pipe}>
              <cylinderGeometry args={[0.06, 0.06, 2.5, 8]} />
            </mesh>
          ))}
          {/* Vent caps */}
          {[0, 2.5, 5, 7.5, 10, 12.5, 15].map((i) => (
            <mesh key={`ventcap${i}`} position={[i * 1.2 - widthX / 2 + 2, c.floors * c.floorHeight + 2.8, widthZ * 0.2]} material={railingMat}>
              <cylinderGeometry args={[0.1, 0.1, 0.06, 8]} />
            </mesh>
          ))}
          {/* Rooftop HVAC unit */}
          <mesh position={[widthX * 0.15, c.floors * c.floorHeight + 0.8, -widthZ * 0.2]} material={ductMat}>
            <boxGeometry args={[2.0, 1.0, 1.5]} />
          </mesh>
          {/* Lightning rod */}
          <mesh position={[-widthX / 2 + c.bayWidth * 0.5, c.floors * c.floorHeight + 3.5, 0]} material={railingMat}>
            <cylinderGeometry args={[0.015, 0.015, 1.5, 4]} />
          </mesh>
        </group>
      )}

      {/* ========== ENTRANCE GROUP (ground floor) ========== */}
      {buildProgress > 0.3 && (
        <group>
          {/* Canopy over entrance */}
          <mesh position={[0, c.floorHeight * 0.9, widthZ / 2 + 1.0]} material={concrete}>
            <boxGeometry args={[c.bayWidth * 2, 0.12, 1.8]} />
          </mesh>
          {/* Canopy support columns */}
          {[-c.bayWidth * 0.8, c.bayWidth * 0.8].map((xp, i) => (
            <mesh key={`canopy${i}`} position={[xp, c.floorHeight * 0.45, widthZ / 2 + 1.8]} material={railingMat}>
              <cylinderGeometry args={[0.06, 0.06, c.floorHeight * 0.9, 8]} />
            </mesh>
          ))}
          {/* Entrance steps */}
          {[0, 1, 2].map((step) => (
            <mesh key={`step${step}`} position={[0, -0.05 + step * 0.15, widthZ / 2 + 1.8 - step * 0.3]} material={concreteLight}>
              <boxGeometry args={[c.bayWidth * 1.8, 0.15, 0.4]} />
            </mesh>
          ))}
          {/* Wheelchair ramp */}
          <mesh position={[c.bayWidth * 1.2, 0.15, widthZ / 2 + 1.5]} rotation={[0.08, 0, 0]} material={concreteLight}>
            <boxGeometry args={[1.2, 0.08, 2.5]} />
          </mesh>
          {/* Ramp railing */}
          <mesh position={[c.bayWidth * 1.2 + 0.55, 0.55, widthZ / 2 + 1.5]} material={railingMat}>
            <boxGeometry args={[0.03, 0.8, 2.5]} />
          </mesh>
        </group>
      )}

      {/* ========== GROUND SURROUNDINGS ========== */}
      {buildProgress > 0.3 && (
        <group>
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
