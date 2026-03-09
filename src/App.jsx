import { useState, useCallback } from 'react'
import MindmapScene from './components/MindmapScene'
import InfoPanel from './components/InfoPanel'
import { useGraph } from './hooks/useGraph'
import './App.css'

export default function App() {
  const { nodes, edges, positions } = useGraph()
  const [selectedNode, setSelectedNode] = useState(null)
  const [focusedNode, setFocusedNode] = useState(null)
  const [breadcrumb, setBreadcrumb] = useState([])

  const handleNodeClick = useCallback((node) => {
    setSelectedNode(node)
  }, [])

  const handleFocus = useCallback((node) => {
    setBreadcrumb((prev) => [...prev, node])
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

  const nodeCount = nodes.length
  const edgeCount = edges.length

  return (
    <div className="app">
      {/* Full-screen 3D canvas */}
      <MindmapScene
        nodes={nodes}
        edges={edges}
        positions={positions}
        selectedNode={selectedNode}
        focusedNode={focusedNode}
        onNodeClick={handleNodeClick}
      />

      {/* Top-left HUD */}
      <header className="hud-header">
        <div className="hud-logo">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
            <circle cx="12" cy="12" r="3" fill="#6366f1" />
            <circle cx="4" cy="6" r="2" fill="#8b5cf6" />
            <circle cx="20" cy="6" r="2" fill="#06b6d4" />
            <circle cx="4" cy="18" r="2" fill="#10b981" />
            <circle cx="20" cy="18" r="2" fill="#f59e0b" />
            <line x1="12" y1="12" x2="4" y2="6" stroke="#6366f1" strokeWidth="1.5" strokeOpacity="0.6" />
            <line x1="12" y1="12" x2="20" y2="6" stroke="#6366f1" strokeWidth="1.5" strokeOpacity="0.6" />
            <line x1="12" y1="12" x2="4" y2="18" stroke="#6366f1" strokeWidth="1.5" strokeOpacity="0.6" />
            <line x1="12" y1="12" x2="20" y2="18" stroke="#6366f1" strokeWidth="1.5" strokeOpacity="0.6" />
          </svg>
          <span>Cosmic Mind</span>
        </div>
        <p className="hud-subtitle">
          {nodeCount} notes &middot; {edgeCount} links
        </p>
      </header>

      {/* Controls hint */}
      <div className="hud-controls">
        <span>Drag to orbit</span>
        <span className="hud-sep">·</span>
        <span>Scroll to zoom</span>
        <span className="hud-sep">·</span>
        <span>Click node to explore</span>
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

      {/* Info panel slides in from right */}
      <InfoPanel
        node={selectedNode}
        onClose={() => setSelectedNode(null)}
        onFocus={handleFocus}
      />
    </div>
  )
}
