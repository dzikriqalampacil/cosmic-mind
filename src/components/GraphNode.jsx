import { useRef, useState } from 'react'
import { useFrame } from '@react-three/fiber'
import { Text, Billboard } from '@react-three/drei'

const FLOAT_SPEED = 0.4
const FLOAT_AMP = 0.25

export default function GraphNode({ node, position, isSelected, isHighlighted, isDimmed, onClick }) {
  const groupRef = useRef()
  const ringRef = useRef()
  const [hovered, setHovered] = useState(false)

  const phaseOffset = hashToPhase(node.id)

  useFrame((state) => {
    if (!groupRef.current || !position) return
    const t = state.clock.elapsedTime
    groupRef.current.position.y = position.y + Math.sin(t * FLOAT_SPEED + phaseOffset) * FLOAT_AMP
    if (ringRef.current) {
      ringRef.current.rotation.z = t * 0.3
      ringRef.current.rotation.x = t * 0.15
    }
    const targetScale = isSelected
      ? 1.15 + Math.sin(t * 4) * 0.05
      : hovered
      ? 1.12
      : isDimmed
      ? 0.85
      : 1
    groupRef.current.scale.lerp({ x: targetScale, y: targetScale, z: targetScale }, 0.12)
  })

  if (!position) return null

  const radius = 0.55
  const color = node.color || '#4488ff'
  const emissiveIntensity = isSelected ? 3 : hovered ? 2.2 : isDimmed ? 0.3 : 1.2
  const labelOpacity = isDimmed ? 0.3 : 1

  return (
    <group
      ref={groupRef}
      position={[position.x, position.y, position.z]}
      onClick={(e) => {
        e.stopPropagation()
        onClick()
      }}
      onPointerOver={(e) => {
        e.stopPropagation()
        setHovered(true)
        document.body.style.cursor = 'pointer'
      }}
      onPointerOut={() => {
        setHovered(false)
        document.body.style.cursor = 'auto'
      }}
    >
      {/* Core sphere */}
      <mesh>
        <sphereGeometry args={[radius, 32, 32]} />
        <meshStandardMaterial
          color={isSelected || hovered ? '#ffffff' : color}
          emissive={color}
          emissiveIntensity={emissiveIntensity}
          roughness={0.15}
          metalness={0.7}
          transparent
          opacity={isDimmed ? 0.4 : 1}
        />
      </mesh>

      {/* Outer glow halo */}
      <mesh>
        <sphereGeometry args={[radius * 1.3, 16, 16]} />
        <meshBasicMaterial
          color={color}
          transparent
          opacity={isSelected ? 0.15 : hovered ? 0.12 : 0.05}
        />
      </mesh>

      {/* Orbiting ring */}
      <mesh ref={ringRef}>
        <torusGeometry args={[radius + 0.25, 0.03, 8, 48]} />
        <meshBasicMaterial
          color={color}
          transparent
          opacity={isSelected ? 0.9 : hovered ? 0.6 : 0.3}
        />
      </mesh>

      {/* Label — Billboard keeps text facing camera at all angles */}
      <Billboard position={[0, radius + 0.55, 0]}>
        <Text
          fontSize={0.38}
          color="white"
          anchorX="center"
          anchorY="bottom"
          outlineWidth={0.04}
          outlineColor="#000022"
          fillOpacity={labelOpacity}
          outlineOpacity={labelOpacity}
          renderOrder={1}
          depthTest={false}
        >
          {node.label}
        </Text>
      </Billboard>
    </group>
  )
}

function hashToPhase(id) {
  let hash = 0
  for (let i = 0; i < id.length; i++) {
    hash = (hash * 31 + id.charCodeAt(i)) & 0xffffffff
  }
  return (hash >>> 0) / 0xffffffff * Math.PI * 2
}
