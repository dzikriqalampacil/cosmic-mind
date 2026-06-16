import { useState, useEffect, useRef, useMemo } from 'react'
import './SearchPalette.css'

export default function SearchPalette({ nodes, onSelect, onClose }) {
  const [query, setQuery] = useState('')
  const [activeIdx, setActiveIdx] = useState(0)
  const inputRef = useRef()
  const listRef = useRef()

  useEffect(() => { inputRef.current?.focus() }, [])

  const results = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return []
    return nodes
      .filter(n => n.label.toLowerCase().includes(q))
      .slice(0, 12)
  }, [query, nodes])

  useEffect(() => setActiveIdx(0), [results])

  // Scroll active item into view
  useEffect(() => {
    const item = listRef.current?.children[activeIdx]
    item?.scrollIntoView({ block: 'nearest' })
  }, [activeIdx])

  function handleKeyDown(e) {
    if (e.key === 'Escape') { onClose(); return }
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setActiveIdx(i => Math.min(i + 1, results.length - 1))
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setActiveIdx(i => Math.max(i - 1, 0))
    } else if (e.key === 'Enter' && results[activeIdx]) {
      onSelect(results[activeIdx])
      onClose()
    }
  }

  return (
    <div className="search-overlay" onClick={onClose}>
      <div className="search-palette" onClick={e => e.stopPropagation()} onKeyDown={handleKeyDown}>
        <div className="search-palette__input-wrap">
          <svg className="search-palette__icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="11" cy="11" r="8" />
            <path d="m21 21-4.35-4.35" />
          </svg>
          <input
            ref={inputRef}
            className="search-palette__input"
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Search nodes…"
          />
          <kbd className="search-palette__esc">Esc</kbd>
        </div>

        {results.length > 0 && (
          <ul ref={listRef} className="search-palette__results">
            {results.map((node, i) => (
              <li
                key={node.id}
                className={`search-palette__item ${i === activeIdx ? 'search-palette__item--active' : ''}`}
                onMouseEnter={() => setActiveIdx(i)}
                onClick={() => { onSelect(node); onClose() }}
              >
                <span
                  className="search-palette__dot"
                  style={{ background: node.color || '#4488ff' }}
                />
                <span className="search-palette__label">{node.label}</span>
                {node.isSection && (
                  <span className="search-palette__badge">section</span>
                )}
              </li>
            ))}
          </ul>
        )}

        {query.trim() && results.length === 0 && (
          <p className="search-palette__empty">No results for "{query}"</p>
        )}

        {!query.trim() && (
          <p className="search-palette__hint">Type to search nodes…</p>
        )}
      </div>
    </div>
  )
}
