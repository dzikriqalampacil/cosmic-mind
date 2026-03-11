import { useState, useCallback } from 'react'
import MindmapScene from './components/MindmapScene'
import MindmapScene2D from './components/MindmapScene2D'
import InfoPanel from './components/InfoPanel'
import { useGraph } from './hooks/useGraph'
import './App.css'

export default function App() {
  const { nodes, edges, positions } = useGraph()
  const [selectedNode, setSelectedNode] = useState(null)
  const [focusedNode, setFocusedNode] = useState(null)
  const [breadcrumb, setBreadcrumb] = useState([])
  const [is3D, setIs3D] = useState(true)

  const handleNodeClick = useCallback((node) => {
    setSelectedNode(node)
  }, [])

  const handleFocus = useCallback((node) => {
    setBreadcrumb(prev => {
      // Already the current focus — do nothing
      if (prev[prev.length - 1]?.id === node.id) return prev
      // Node exists earlier in path — navigate back to it
      const existingIdx = prev.findIndex(n => n.id === node.id)
      if (existingIdx !== -1) return prev.slice(0, existingIdx + 1)
      return [...prev, node]
    })
    setFocusedNode(node)
    setSelectedNode(node)
  }, [])

  const handleBack = useCallback(() => {
    setBreadcrumb((prev) => {
      const next = prev.slice(0, -1)
      setFocusedNode(next.length > 0 ? next[next.length - 1] : null)
      return next
    })
  }, [])

  const handleBackToRoot = useCallback(() => {
    setBreadcrumb([])
    setFocusedNode(null)
  }, [])

  // Stats and 3D props use file-level nodes only (sections are 2D-only)
  const fileNodes = nodes.filter(n => !n.isSection)
  const fileEdges = edges.filter(e => !e.isSection)
  const nodeCount = fileNodes.length
  const edgeCount = fileEdges.length

  return (
    <div className="app">
      {/* Canvas — 3D or 2D */}
      {is3D ? (
        <MindmapScene
          nodes={fileNodes}
          edges={fileEdges}
          positions={positions}
          selectedNode={selectedNode}
          focusedNode={focusedNode}
          onNodeClick={handleNodeClick}
        />
      ) : (
        <MindmapScene2D
          nodes={nodes}
          edges={edges}
          selectedNode={selectedNode}
          focusedNode={focusedNode}
          onNodeClick={handleNodeClick}
          onFocus={handleFocus}
        />
      )}

      {/* Top-left HUD */}
      <header className="hud-header">
        <div className="hud-logo">
          <img src="/favicon.png" width="20" height="20" alt="Cosmic Mind logo" />
          <span>Cosmic Mind</span>
        </div>
        <p className="hud-subtitle">
          {nodeCount} notes &middot; {edgeCount} links
        </p>
      </header>

      {/* 3D / 2D toggle */}
      <div className="view-toggle">
        <button
          className={`view-toggle__btn ${is3D ? 'view-toggle__btn--active' : ''}`}
          onClick={() => setIs3D(true)}
        >
          3D
        </button>
        <button
          className={`view-toggle__btn ${!is3D ? 'view-toggle__btn--active' : ''}`}
          onClick={() => setIs3D(false)}
        >
          2D
        </button>
      </div>

      {/* Controls hint */}
      <div className="hud-controls">
        {is3D ? (
          <>
            <span className="hint-desktop">Drag to orbit</span>
            <span className="hud-sep hint-desktop">·</span>
            <span className="hint-desktop">Scroll to zoom</span>
            <span className="hud-sep hint-desktop">·</span>
            <span className="hint-mobile">Pinch to zoom</span>
            <span className="hud-sep hint-mobile">·</span>
            <span className="hint-mobile">Drag to orbit</span>
            <span className="hud-sep">·</span>
            <span>Tap node to explore</span>
          </>
        ) : (
          <>
            <span className="hint-desktop">Drag to pan</span>
            <span className="hud-sep hint-desktop">·</span>
            <span className="hint-desktop">Scroll to zoom</span>
            <span className="hud-sep hint-desktop">·</span>
            <span className="hint-mobile">Pinch to zoom</span>
            <span className="hud-sep hint-mobile">·</span>
            <span className="hint-mobile">Drag to pan</span>
            <span className="hud-sep">·</span>
            <span>Tap node to explore</span>
          </>
        )}
      </div>

      {/* Breadcrumb navigation */}
      {breadcrumb.length > 0 && (
        <nav className="breadcrumb">
          <button className="breadcrumb__home" onClick={handleBackToRoot} title="Back to full map">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
            </svg>
            All notes
          </button>

          {breadcrumb.map((node, i) => (
            <span key={`${node.id}-${i}`} className="breadcrumb__item">
              <span className="breadcrumb__sep">›</span>
              {i === breadcrumb.length - 1 ? (
                <span className="breadcrumb__current">{node.label}</span>
              ) : (
                <button
                  className="breadcrumb__link"
                  onClick={() => {
                    const next = breadcrumb.slice(0, i + 1)
                    setBreadcrumb(next)
                    setFocusedNode(next[next.length - 1])
                  }}
                >
                  {node.label}
                </button>
              )}
            </span>
          ))}

          <button className="breadcrumb__back" onClick={handleBack}>
            ← Back
          </button>
        </nav>
      )}

      {/* Info panel */}
      <InfoPanel
        node={selectedNode}
        onClose={() => setSelectedNode(null)}
        onFocus={handleFocus}
      />
    </div>
  )
}
