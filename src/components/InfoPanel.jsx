import './InfoPanel.css'

export default function InfoPanel({ node, onClose, onFocus }) {
  if (!node) return null

  return (
    <div className={`info-panel ${node ? 'info-panel--open' : ''}`}>
      <div className="info-panel__header">
        <div className="info-panel__title-row">
          <span
            className="info-panel__color-dot"
            style={{ background: node.color }}
          />
          <h2 className="info-panel__title">{node.label}</h2>
        </div>

        <div className="info-panel__actions">
          <button
            className="info-panel__btn info-panel__btn--focus"
            onClick={() => onFocus(node)}
            title="Focus graph on this node"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="3" />
              <path d="M3 12h2M19 12h2M12 3v2M12 19v2" />
              <path d="M5.6 5.6l1.4 1.4M16.9 16.9l1.5 1.5M5.6 18.4l1.4-1.4M16.9 7.1l1.5-1.5" />
            </svg>
            Focus
          </button>
          <button
            className="info-panel__btn info-panel__btn--close"
            onClick={onClose}
            title="Close panel"
            aria-label="Close"
          >
            ✕
          </button>
        </div>
      </div>

      <div className="info-panel__content">
        <div dangerouslySetInnerHTML={{ __html: node.content }} />

        {node.tags.length > 0 && (
          <div className="info-panel__tags">
            {node.tags.map((tag) => (
              <span key={tag} className="info-panel__tag">
                #{tag}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
