import { useRef, useMemo } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { OrbitControls, Stars } from '@react-three/drei'
import { EffectComposer, Bloom } from '@react-three/postprocessing'
import * as THREE from 'three'
import GraphNode from './GraphNode'
import GraphEdge from './GraphEdge'

// Particle geometry created once at module level — avoids calling Math.random during render
const _particleGeo = (() => {
  const count = 200
  const geo = new THREE.BufferGeometry()
  const arr = new Float32Array(count * 3)
  for (let i = 0; i < count; i++) {
    arr[i * 3]     = (Math.random() - 0.5) * 100
    arr[i * 3 + 1] = (Math.random() - 0.5) * 100
    arr[i * 3 + 2] = (Math.random() - 0.5) * 100
  }
  geo.setAttribute('position', new THREE.BufferAttribute(arr, 3))
  return geo
})()

// Drifting nebula dust — R3F v9 compatible
function BackgroundParticles() {
  const ref = useRef()

  useFrame((state) => {
    if (ref.current) {
      ref.current.rotation.y = state.clock.elapsedTime * 0.008
    }
  })

  return (
    <points ref={ref} geometry={_particleGeo}>
      <pointsMaterial size={0.12} color="#6366f1" transparent opacity={0.35} sizeAttenuation />
    </points>
  )
}

// Camera animator — flies to selected node
function CameraAnimator({ targetPosition, enabled }) {
  const { camera } = useThree()
  const targetRef = useRef(new THREE.Vector3())

  useFrame(() => {
    if (!enabled || !targetPosition) return
    targetRef.current.set(
      targetPosition.x,
      targetPosition.y + 2,
      targetPosition.z + 12
    )
    camera.position.lerp(targetRef.current, 0.04)
  })

  return null
}

export default function MindmapScene({
  nodes,
  edges,
  positions,
  selectedNode,
  focusedNode,
  onNodeClick,
}) {
  const orbitRef = useRef()

  // Determine which nodes/edges are visible based on focus
  const { visibleNodes, visibleEdges } = useMemo(() => {
    if (!focusedNode) {
      return { visibleNodes: nodes, visibleEdges: edges }
    }
    const connected = new Set([focusedNode.id])
    for (const edge of edges) {
      if (edge.source === focusedNode.id) connected.add(edge.target)
      if (edge.target === focusedNode.id) connected.add(edge.source)
    }
    const vNodes = nodes.filter((n) => connected.has(n.id))
    const vEdges = edges.filter(
      (e) => connected.has(e.source) && connected.has(e.target)
    )
    return { visibleNodes: vNodes, visibleEdges: vEdges }
  }, [nodes, edges, focusedNode])

  // IDs connected to the selected node (for edge highlighting)
  const selectedConnectedIds = useMemo(() => {
    if (!selectedNode) return new Set()
    const ids = new Set([selectedNode.id])
    for (const edge of edges) {
      if (edge.source === selectedNode.id) ids.add(edge.target)
      if (edge.target === selectedNode.id) ids.add(edge.source)
    }
    return ids
  }, [selectedNode, edges])

  const selectedPos = selectedNode ? positions[selectedNode.id] : null

  return (
    <Canvas
      camera={{ position: [0, 0, 35], fov: 60 }}
      style={{ background: '#060612' }}
      gl={{ antialias: true, toneMapping: 3 /* ACESFilmicToneMapping */ }}
    >
      <color attach="background" args={['#060612']} />
      <fog attach="fog" args={['#060612', 50, 150]} />

      <ambientLight intensity={0.3} />
      <pointLight position={[20, 20, 20]} intensity={1.5} color="#8b5cf6" />
      <pointLight position={[-20, -10, -20]} intensity={0.8} color="#06b6d4" />

      {/* Background */}
      <Stars
        radius={100}
        depth={50}
        count={800}
        factor={2.5}
        saturation={0}
        fade
        speed={0.3}
      />
      <BackgroundParticles />

      {/* Edges */}
      {visibleEdges.map((edge) => (
        <GraphEdge
          key={edge.id}
          edge={edge}
          positions={positions}
          highlighted={
            selectedNode &&
            (edge.source === selectedNode.id || edge.target === selectedNode.id)
          }
        />
      ))}

      {/* Nodes */}
      {visibleNodes.map((node) => (
        <GraphNode
          key={node.id}
          node={node}
          position={positions[node.id]}
          isSelected={selectedNode?.id === node.id}
          isHighlighted={selectedConnectedIds.has(node.id)}
          isDimmed={
            selectedNode != null &&
            !selectedConnectedIds.has(node.id)
          }
          onClick={() => onNodeClick(node)}
        />
      ))}

      {/* Bloom glow effect */}
      <EffectComposer>
        <Bloom
          luminanceThreshold={0.2}
          luminanceSmoothing={0.8}
          intensity={1.8}
          mipmapBlur
        />
      </EffectComposer>

      <CameraAnimator targetPosition={selectedPos} enabled={!!selectedNode} />

      <OrbitControls
        ref={orbitRef}
        enablePan
        enableZoom
        enableRotate
        autoRotate={!selectedNode}
        autoRotateSpeed={0.4}
        minDistance={5}
        maxDistance={80}
      />
    </Canvas>
  )
}
