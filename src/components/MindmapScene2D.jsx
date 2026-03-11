import { useRef, useState, useCallback, useEffect, useMemo } from 'react'
import { radialLayout } from '../utils/forceLayout2D'

const NODE_RX = 18
const SEC_RX  = 14
const ROOT_RX = 24
const LINE_H  = 14   // px between text lines

// Word-wrap a label into at most 2 lines given a max chars-per-line limit
function wrapLabel(label, maxChars) {
  if (label.length <= maxChars) return [label]
  const words = label.split(' ')
  const lines = []
  let cur = ''
  for (const word of words) {
    const test = cur ? `${cur} ${word}` : word
    if (test.length > maxChars && cur) { lines.push(cur); cur = word }
    else cur = test
  }
  if (cur) lines.push(cur)
  return lines.slice(0, 2)
}

function nodeDims(node, isRoot) {
  if (isRoot) {
    const w = Math.min(220, Math.max(140, node.label.length * 8 + 40))
    return { w, h: 48, rx: ROOT_RX, lines: [node.label] }
  }
  if (node.isSection) {
    const lines = wrapLabel(node.label, 20)
    const maxLen = Math.max(...lines.map(l => l.length))
    const w = Math.min(190, Math.max(90, maxLen * 6.5 + 28))
    const h = lines.length > 1 ? 44 : 30
    return { w, h, rx: SEC_RX, lines }
  }
  // Chapter node
  const lines = wrapLabel(node.label, 22)
  const maxLen = Math.max(...lines.map(l => l.length))
  const w = Math.min(200, Math.max(110, maxLen * 7 + 36))
  const h = lines.length > 1 ? 50 : 36
  return { w, h, rx: NODE_RX, lines }
}

function borderPt(cx, cy, w, h, toX, toY) {
  const dx = toX - cx, dy = toY - cy
  const len = Math.sqrt(dx * dx + dy * dy) || 1
  const nx = dx / len, ny = dy / len
  const tx = Math.abs(nx) > 1e-9 ? (w / 2) / Math.abs(nx) : Infinity
  const ty = Math.abs(ny) > 1e-9 ? (h / 2) / Math.abs(ny) : Infinity
  return { x: cx + nx * Math.min(tx, ty), y: cy + ny * Math.min(tx, ty) }
}

export default function MindmapScene2D({ nodes, edges, selectedNode, focusedNode, onNodeClick, onFocus }) {
  const svgRef = useRef()

  const [transform, setTransform] = useState(
    () => ({ x: window.innerWidth / 2, y: window.innerHeight / 2, scale: 1 })
  )
  const transformRef = useRef(transform)
  useEffect(() => { transformRef.current = transform }, [transform])

  // Nodes that have section children → double-click focusable
  const focusableIds = useMemo(() => {
    const ids = new Set()
    for (const e of edges) {
      const t = nodes.find(n => n.id === e.target)
      if (t?.isSection) ids.add(e.source)
    }
    return ids
  }, [nodes, edges])

  // Visible set depends on focus state
  const { visibleNodes, visibleEdges } = useMemo(() => {
    if (!focusedNode) {
      // Normal view: file-level nodes only (no sections)
      const fileNodes = nodes.filter(n => !n.isSection)
      const fileIds = new Set(fileNodes.map(n => n.id))
      return {
        visibleNodes: fileNodes,
        visibleEdges: edges.filter(e => fileIds.has(e.source) && fileIds.has(e.target)),
      }
    }

    if (focusedNode.isSection) {
      // Sections are leaves — show only the section itself
      return { visibleNodes: [focusedNode], visibleEdges: [] }
    }

    // Focused on a chapter: show chapter + its section children
    const secEdges = edges.filter(e => e.source === focusedNode.id && e.isSection)
    if (secEdges.length > 0) {
      const childIds = new Set([focusedNode.id, ...secEdges.map(e => e.target)])
      return {
        visibleNodes: nodes.filter(n => childIds.has(n.id)),
        visibleEdges: secEdges,
      }
    }

    // Focused on root (no sections): show file-level neighbors
    const fileNodes = nodes.filter(n => !n.isSection)
    const fileIds = new Set(fileNodes.map(n => n.id))
    const connected = new Set([focusedNode.id])
    for (const e of edges) {
      if (e.source === focusedNode.id && fileIds.has(e.target)) connected.add(e.target)
      if (e.target === focusedNode.id && fileIds.has(e.source)) connected.add(e.source)
    }
    return {
      visibleNodes: fileNodes.filter(n => connected.has(n.id)),
      visibleEdges: edges.filter(e =>
        fileIds.has(e.source) && fileIds.has(e.target) &&
        connected.has(e.source) && connected.has(e.target)
      ),
    }
  }, [nodes, edges, focusedNode])

  const layoutPositions = useMemo(
    () => radialLayout(visibleNodes, visibleEdges, focusedNode?.id ?? null),
    [visibleNodes, visibleEdges, focusedNode]
  )

  const [positions, setPositions] = useState(layoutPositions)
  useEffect(() => { setPositions(layoutPositions) }, [layoutPositions])

  // Auto-fit the view whenever the layout changes
  useEffect(() => {
    const vals = Object.values(layoutPositions)
    if (!vals.length) return

    const xs = vals.map(p => p.x)
    const ys = vals.map(p => p.y)
    // Add padding for node dimensions
    const minX = Math.min(...xs) - 130
    const maxX = Math.max(...xs) + 130
    const minY = Math.min(...ys) - 50
    const maxY = Math.max(...ys) + 50

    const graphW = maxX - minX
    const graphH = maxY - minY

    const vw = window.innerWidth
    const vh = window.innerHeight

    // Reserve space: top HUD ~90px, bottom controls bar ~70px, sides ~40px
    const padTop    = 90
    const padBottom = 70
    const padSide   = 40
    const availW = vw - padSide * 2
    const availH = vh - padTop - padBottom

    const scale = Math.min(availW / graphW, availH / graphH, 1)

    const cx = (minX + maxX) / 2
    const cy = (minY + maxY) / 2

    setTransform({
      x: vw / 2 - cx * scale,
      y: padTop + availH / 2 - cy * scale,
      scale,
    })
  }, [layoutPositions])

  const nodeMap = useMemo(
    () => Object.fromEntries(visibleNodes.map(n => [n.id, n])),
    [visibleNodes]
  )

  // Drag state
  const panDragging   = useRef(false)
  const nodeDragging  = useRef(null)
  const nodeMoved     = useRef(false)
  const lastPos       = useRef({ x: 0, y: 0 })
  const lastTouchDist = useRef(null)

  const onMouseMove = useCallback((e) => {
    const dx = e.clientX - lastPos.current.x
    const dy = e.clientY - lastPos.current.y
    lastPos.current = { x: e.clientX, y: e.clientY }
    if (nodeDragging.current) {
      const scale = transformRef.current.scale
      setPositions(prev => {
        const p = prev[nodeDragging.current]
        if (!p) return prev
        return { ...prev, [nodeDragging.current]: { ...p, x: p.x + dx / scale, y: p.y + dy / scale } }
      })
      nodeMoved.current = true
    } else if (panDragging.current) {
      setTransform(t => ({ ...t, x: t.x + dx, y: t.y + dy }))
    }
  }, [])

  const onMouseUp = useCallback(() => {
    panDragging.current = false
    nodeDragging.current = null
  }, [])

  useEffect(() => {
    window.addEventListener('mousemove', onMouseMove)
    window.addEventListener('mouseup', onMouseUp)
    return () => {
      window.removeEventListener('mousemove', onMouseMove)
      window.removeEventListener('mouseup', onMouseUp)
    }
  }, [onMouseMove, onMouseUp])

  const onBgMouseDown = useCallback((e) => {
    panDragging.current = true
    lastPos.current = { x: e.clientX, y: e.clientY }
  }, [])

  const onNodeMouseDown = useCallback((e, nodeId) => {
    e.stopPropagation()
    nodeDragging.current = nodeId
    nodeMoved.current = false
    lastPos.current = { x: e.clientX, y: e.clientY }
  }, [])

  const onWheel = useCallback((e) => {
    e.preventDefault()
    const factor = e.deltaY < 0 ? 1.1 : 0.9
    setTransform(t => {
      const newScale = Math.min(4, Math.max(0.15, t.scale * factor))
      const rect = svgRef.current.getBoundingClientRect()
      const mx = e.clientX - rect.left, my = e.clientY - rect.top
      return {
        x: mx - (mx - t.x) * (newScale / t.scale),
        y: my - (my - t.y) * (newScale / t.scale),
        scale: newScale,
      }
    })
  }, [])

  const onTouchStart = useCallback((e) => {
    if (e.touches.length === 1) {
      panDragging.current = true
      lastPos.current = { x: e.touches[0].clientX, y: e.touches[0].clientY }
    } else if (e.touches.length === 2) {
      panDragging.current = false
      const dx = e.touches[0].clientX - e.touches[1].clientX
      const dy = e.touches[0].clientY - e.touches[1].clientY
      lastTouchDist.current = Math.sqrt(dx * dx + dy * dy)
    }
  }, [])

  const onTouchMove = useCallback((e) => {
    e.preventDefault()
    if (e.touches.length === 1 && panDragging.current) {
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
      setTransform(t => ({
        ...t,
        scale: Math.min(4, Math.max(0.15, t.scale * (dist / lastTouchDist.current))),
      }))
      lastTouchDist.current = dist
    }
  }, [])

  const onTouchEnd = useCallback(() => {
    panDragging.current = false
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

  return (
    <svg
      ref={svgRef}
      style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', background: '#0d1117' }}
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
    >
      <defs>
        <marker id="arr" markerWidth="7" markerHeight="7" refX="5" refY="3.5" orient="auto">
          <path d="M0,1 L0,6 L6,3.5 z" fill="#2d3f55" />
        </marker>
        <marker id="arr-hi" markerWidth="7" markerHeight="7" refX="5" refY="3.5" orient="auto">
          <path d="M0,1 L0,6 L6,3.5 z" fill="#6366f1" />
        </marker>
      </defs>

      {/* Full-screen background — catches pan mousedown */}
      <rect x="0" y="0" width="100%" height="100%" fill="transparent" style={{ cursor: 'grab' }} onMouseDown={onBgMouseDown} />

      <g transform={`translate(${transform.x},${transform.y}) scale(${transform.scale})`}>

        {/* Edges */}
        {visibleEdges.map(edge => {
          const pa = positions[edge.source]
          const pb = positions[edge.target]
          if (!pa || !pb) return null

          const depthA = pa.depth ?? 0, depthB = pb.depth ?? 0
          const [fromId, toId, fromP, toP] = depthA <= depthB
            ? [edge.source, edge.target, pa, pb]
            : [edge.target, edge.source, pb, pa]

          const fn = nodeMap[fromId], tn = nodeMap[toId]
          const fd = nodeDims(fn, fromP.isRoot)
          const td = nodeDims(tn, toP.isRoot)

          const start = borderPt(fromP.x, fromP.y, fd.w, fd.h, toP.x, toP.y)
          const end   = borderPt(toP.x,   toP.y,   td.w, td.h, fromP.x, fromP.y)
          const mx = (start.x + end.x) / 2, my = (start.y + end.y) / 2
          const ddx = end.x - start.x, ddy = end.y - start.y
          const dist = Math.sqrt(ddx * ddx + ddy * ddy) || 1
          const cpx = mx - (ddy / dist) * dist * 0.1
          const cpy = my + (ddx / dist) * dist * 0.1

          const isHighlighted = selectedNode &&
            (edge.source === selectedNode.id || edge.target === selectedNode.id)

          return (
            <path
              key={edge.id}
              d={`M ${start.x} ${start.y} Q ${cpx} ${cpy} ${end.x} ${end.y}`}
              fill="none"
              stroke={isHighlighted ? '#6366f1' : edge.isSection ? '#1a2e47' : '#1e3a5f'}
              strokeWidth={isHighlighted ? 2 : 1.5}
              strokeDasharray={edge.isSection ? '4 3' : undefined}
              markerEnd={isHighlighted ? 'url(#arr-hi)' : 'url(#arr)'}
            />
          )
        })}

        {/* Nodes */}
        {visibleNodes.map(node => {
          const p = positions[node.id]
          if (!p) return null

          const isFocusable = focusableIds.has(node.id)
          const { w, h, rx, lines } = nodeDims(node, !!p.isRoot)
          const isSelected  = selectedNode?.id === node.id
          const isConnected = selectedNode != null && visibleEdges.some(e =>
            (e.source === selectedNode.id && e.target === node.id) ||
            (e.target === selectedNode.id && e.source === node.id)
          )
          const isDimmed = selectedNode != null && !isSelected && !isConnected

          return (
            <g
              key={node.id}
              className="node-hit"
              style={{ cursor: 'pointer' }}
              onMouseDown={(e) => onNodeMouseDown(e, node.id)}
              onDoubleClick={(e) => {
                e.stopPropagation()
                if (isFocusable) onFocus(node)
              }}
              onClick={(e) => {
                e.stopPropagation()
                if (!nodeMoved.current) onNodeClick(node)
                nodeMoved.current = false
              }}
            >
              {isSelected && (
                <rect
                  x={p.x - w / 2 - 5} y={p.y - h / 2 - 5}
                  width={w + 10} height={h + 10} rx={rx + 5}
                  fill="none" stroke={node.color} strokeWidth={2} opacity={0.45}
                />
              )}

              <rect
                x={p.x - w / 2} y={p.y - h / 2}
                width={w} height={h} rx={rx}
                fill={p.isRoot ? node.color : node.isSection ? 'transparent' : isSelected ? '#1e2d45' : '#161e2e'}
                stroke={p.isRoot ? 'none' : node.color}
                strokeWidth={node.isSection ? 1 : 1.5}
                strokeOpacity={node.isSection ? 0.5 : 1}
                strokeDasharray={node.isSection ? '4 3' : undefined}
                opacity={isDimmed ? 0.25 : 1}
              />

              <text
                textAnchor="middle"
                fontSize={p.isRoot ? 13 : node.isSection ? 10 : 11}
                fontFamily="Inter, system-ui, sans-serif"
                fontWeight={p.isRoot || isSelected ? 700 : 500}
                fill={
                  isDimmed ? '#3a4a5c' :
                  p.isRoot ? '#ffffff' :
                  node.isSection ? '#7a8fa8' :
                  isSelected ? '#e2e8f0' : '#94a3b8'
                }
                style={{ pointerEvents: 'none', userSelect: 'none' }}
              >
                {lines.map((line, i) => (
                  <tspan
                    key={i}
                    x={p.x}
                    y={p.y + (i - (lines.length - 1) / 2) * LINE_H}
                    dominantBaseline="middle"
                  >
                    {line}
                  </tspan>
                ))}
              </text>

              {/* Focusable indicator: small dot at bottom-right corner */}
              {isFocusable && (
                <circle
                  cx={p.x + w / 2 - 7} cy={p.y + h / 2 - 7}
                  r={4} fill={node.color} opacity={0.85}
                  style={{ pointerEvents: 'none' }}
                />
              )}
            </g>
          )
        })}

      </g>
    </svg>
  )
}
