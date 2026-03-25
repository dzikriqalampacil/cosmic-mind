import { useState, useCallback } from 'react'
import MindmapScene from './components/MindmapScene'
import MindmapScene2D from './components/MindmapScene2D'
import InfoPanel from './components/InfoPanel'
import { useGraph } from './hooks/useGraph'
import './App.css'

export default function App() {
  const [selectedCollection, setSelectedCollection] = useState('The Pragmatic Programmer')
  const { nodes, edges, positions, collections } = useGraph(selectedCollection)
  const [selectedNode, setSelectedNode] = useState(null)
  const [focusedNode, setFocusedNode] = useState(null)
  const [breadcrumb, setBreadcrumb] = useState([])
  const [is3D, setIs3D] = useState(true)
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [resetTrigger, setResetTrigger] = useState(0)

  const handleRecenter = useCallback(() => setResetTrigger(n => n + 1), [])

  const handleCollectionChange = useCallback((col) => {
    setSelectedCollection(col)
    setSelectedNode(null)
    setFocusedNode(null)
    setBreadcrumb([])
  }, [])

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
          resetTrigger={resetTrigger}
        />
      ) : (
        <MindmapScene2D
          nodes={nodes}
          edges={edges}
          selectedNode={selectedNode}
          focusedNode={focusedNode}
          onNodeClick={handleNodeClick}
          onFocus={handleFocus}
          resetTrigger={resetTrigger}
        />
      )}

      {/* Sidebar */}
      <aside className={`sidebar ${sidebarOpen ? '' : 'sidebar--collapsed'}`}>
        {/* Header */}
        <div className="sidebar__header">
          <div className="sidebar__logo">
            <img src="/favicon.png" width="18" height="18" alt="Cosmic Mind logo" />
            <span>Cosmic Mind</span>
          </div>
        </div>

        {/* Library section */}
        <div className="sidebar__section">
          <span className="sidebar__label">Library</span>
          <nav className="sidebar__nav">
            {collections.map(col => (
              <button
                key={col}
                className={`sidebar__item ${selectedCollection === col ? 'sidebar__item--active' : ''}`}
                onClick={() => handleCollectionChange(col)}
              >
                <svg className="sidebar__item-icon" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
                  <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
                </svg>
                <span>{col}</span>
                {selectedCollection === col && (
                  <span className="sidebar__item-count">{nodeCount}</span>
                )}
              </button>
            ))}
          </nav>
        </div>

        {/* Footer controls */}
        <div className="sidebar__footer">
          <span className="sidebar__label">View</span>
          <div className="sidebar__view-toggle">
            <button
              className={`sidebar__view-btn ${is3D ? 'sidebar__view-btn--active' : ''}`}
              onClick={() => setIs3D(true)}
            >
              3D
            </button>
            <button
              className={`sidebar__view-btn ${!is3D ? 'sidebar__view-btn--active' : ''}`}
              onClick={() => setIs3D(false)}
            >
              2D
            </button>
            <button className="sidebar__recenter-btn" onClick={handleRecenter} title="Recenter view">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <circle cx="12" cy="12" r="3" />
                <path d="M12 2v4M12 18v4M2 12h4M18 12h4" />
              </svg>
            </button>
          </div>

          <div className="sidebar__hints">
            <span>{is3D ? 'Drag to orbit' : 'Drag to pan'}</span>
            <span>·</span>
            <span>Scroll to zoom</span>
            <span>·</span>
            <span>Tap to explore</span>
          </div>
        </div>

      </aside>

      <button
        className={`sidebar__toggle ${sidebarOpen ? '' : 'sidebar__toggle--collapsed'}`}
        onClick={() => setSidebarOpen(o => !o)}
        title={sidebarOpen ? 'Collapse sidebar' : 'Expand sidebar'}
      >
        {sidebarOpen ? '‹' : '›'}
      </button>

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
