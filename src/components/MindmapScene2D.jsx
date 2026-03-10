import { useRef, useState, useCallback, useEffect, useMemo } from 'react'
import { forceLayout2D } from '../utils/forceLayout2D'

const SCALE = 60

export default function MindmapScene2D({ nodes, edges, selectedNode, focusedNode, onNodeClick }) {
  const svgRef = useRef()
  const [transform, setTransform] = useState({ x: 0, y: 0, scale: 1 })
  const dragging = useRef(false)
  const lastPos = useRef({ x: 0, y: 0 })
  const lastTouchDist = useRef(null)

  const positions = useMemo(() => forceLayout2D(nodes, edges), [nodes, edges])

  // Center on mount
  useEffect(() => {
    setTransform({ x: window.innerWidth / 2, y: window.innerHeight / 2, scale: 1 })
  }, [])

  const { visibleNodes, visibleEdges, selectedConnectedIds } = useMemo(() => {
    if (!focusedNode) {
      const ids = selectedNode
        ? new Set([selectedNode.id, ...edges
            .filter(e => e.source === selectedNode.id || e.target === selectedNode.id)
            .flatMap(e => [e.source, e.target])])
        : new Set()
      return { visibleNodes: nodes, visibleEdges: edges, selectedConnectedIds: ids }
    }
    const connected = new Set([focusedNode.id])
    for (const edge of edges) {
      if (edge.source === focusedNode.id) connected.add(edge.target)
      if (edge.target === focusedNode.id) connected.add(edge.source)
    }
    return {
      visibleNodes: nodes.filter(n => connected.has(n.id)),
      visibleEdges: edges.filter(e => connected.has(e.source) && connected.has(e.target)),
      selectedConnectedIds: connected,
    }
  }, [nodes, edges, focusedNode, selectedNode])

  // Pan — mouse
  const onMouseDown = useCallback((e) => {
    if (e.target.closest('.node-hit')) return
    dragging.current = true
    lastPos.current = { x: e.clientX, y: e.clientY }
  }, [])

  const onMouseMove = useCallback((e) => {
    if (!dragging.current) return
    setTransform(t => ({
      ...t,
      x: t.x + e.clientX - lastPos.current.x,
      y: t.y + e.clientY - lastPos.current.y,
    }))
    lastPos.current = { x: e.clientX, y: e.clientY }
  }, [])

  const onMouseUp = useCallback(() => { dragging.current = false }, [])

  // Scroll zoom
  const onWheel = useCallback((e) => {
    e.preventDefault()
    const factor = e.deltaY < 0 ? 1.1 : 0.9
    setTransform(t => {
      const newScale = Math.min(4, Math.max(0.2, t.scale * factor))
      const rect = svgRef.current.getBoundingClientRect()
      const mx = e.clientX - rect.left
      const my = e.clientY - rect.top
      return {
        x: mx - (mx - t.x) * (newScale / t.scale),
        y: my - (my - t.y) * (newScale / t.scale),
        scale: newScale,
      }
    })
  }, [])

  // Touch pan + pinch zoom
  const onTouchStart = useCallback((e) => {
    if (e.touches.length === 1) {
      dragging.current = true
      lastPos.current = { x: e.touches[0].clientX, y: e.touches[0].clientY }
    } else if (e.touches.length === 2) {
      dragging.current = false
      const dx = e.touches[0].clientX - e.touches[1].clientX
      const dy = e.touches[0].clientY - e.touches[1].clientY
      lastTouchDist.current = Math.sqrt(dx * dx + dy * dy)
    }
  }, [])

  const onTouchMove = useCallback((e) => {
    e.preventDefault()
    if (e.touches.length === 1 && dragging.current) {
      setTransform(t => ({
        ...t,
        x: t.x + e.touches[0].clientX - lastPos.current.x,
        y: t.y + e.touches[0].clientY - lastPos.current.y,
      }))
      lastPos.current = { x: e.touches[0].clientX, y: e.touches[0].clientY }
    } else if (e.touches.length === 2 && lastTouchDist.current) {
      const dx = e.touches[0].clientX - e.touches[1].clientX
      const dy = e.touches[0].clientY - e.touches[1].clientY
      const dist = Math.sqrt(dx * dx + dy * dy)
      const factor = dist / lastTouchDist.current
      setTransform(t => ({
        ...t,
        scale: Math.min(4, Math.max(0.2, t.scale * factor)),
      }))
      lastTouchDist.current = dist
    }
  }, [])

  const onTouchEnd = useCallback(() => {
    dragging.current = false
    lastTouchDist.current = null
  }, [])

  useEffect(() => {
    const svg = svgRef.current
    if (!svg) return
    svg.addEventListener('wheel', onWheel, { passive: false })
    svg.addEventListener('touchmove', onTouchMove, { passive: false })
    return () => {
      svg.removeEventListener('wheel', onWheel)
      svg.removeEventListener('touchmove', onTouchMove)
    }
  }, [onWheel, onTouchMove])

  const NODE_R = 18

  return (
    <svg
      ref={svgRef}
      style={{
        position: 'absolute', inset: 0,
        width: '100%', height: '100%',
        background: '#060612',
        cursor: 'grab',
      }}
      onMouseDown={onMouseDown}
      onMouseMove={onMouseMove}
      onMouseUp={onMouseUp}
      onMouseLeave={onMouseUp}
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
    >
      <defs>
        <filter id="glow2d">
          <feGaussianBlur stdDeviation="3" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
        <filter id="glow2d-strong">
          <feGaussianBlur stdDeviation="5" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      <g transform={`translate(${transform.x},${transform.y}) scale(${transform.scale})`}>
        {/* Edges */}
        {visibleEdges.map(edge => {
          const pa = positions[edge.source]
          const pb = positions[edge.target]
          if (!pa || !pb) return null
          const isHighlighted = selectedNode &&
            (edge.source === selectedNode.id || edge.target === selectedNode.id)
          return (
            <line
              key={edge.id}
              x1={pa.x * SCALE} y1={pa.y * SCALE}
              x2={pb.x * SCALE} y2={pb.y * SCALE}
              stroke={isHighlighted ? '#6366f1' : '#1e293b'}
              strokeWidth={isHighlighted ? 2 : 1}
              strokeOpacity={isHighlighted ? 0.9 : 0.5}
            />
          )
        })}

        {/* Nodes */}
        {visibleNodes.map(node => {
          const p = positions[node.id]
          if (!p) return null
          const isSelected = selectedNode?.id === node.id
          const isDimmed = selectedNode != null && !selectedConnectedIds.has(node.id)
          const cx = p.x * SCALE
          const cy = p.y * SCALE

          return (
            <g
              key={node.id}
              className="node-hit"
              style={{ cursor: 'pointer' }}
              onClick={(e) => { e.stopPropagation(); onNodeClick(node) }}
            >
              {/* Glow halo */}
              <circle
                cx={cx} cy={cy}
                r={isSelected ? NODE_R + 10 : NODE_R + 5}
                fill={node.color}
                opacity={isSelected ? 0.18 : isDimmed ? 0 : 0.07}
                filter="url(#glow2d)"
              />
              {/* Main circle */}
              <circle
                cx={cx} cy={cy} r={NODE_R}
                fill={isSelected ? '#ffffff' : node.color}
                opacity={isDimmed ? 0.25 : 1}
                filter={isSelected ? 'url(#glow2d-strong)' : 'url(#glow2d)'}
                stroke={isSelected ? node.color : 'none'}
                strokeWidth={2}
              />
              {/* Label */}
              <text
                x={cx} y={cy + NODE_R + 16}
                textAnchor="middle"
                fontSize={11}
                fontFamily="Inter, system-ui, sans-serif"
                fontWeight={isSelected ? 700 : 500}
                fill={isDimmed ? '#334155' : '#e2e8f0'}
                style={{ pointerEvents: 'none', userSelect: 'none' }}
              >
                {node.label}
              </text>
            </g>
          )
        })}
      </g>
    </svg>
  )
}
