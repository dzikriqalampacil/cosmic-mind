import { useMemo } from 'react'
import { parseVault, buildGraph } from '../utils/parseVault'
import { forceLayout3D } from '../utils/forceLayout'

const vaultModules = import.meta.glob('../vault/**/*.md', { query: '?raw', import: 'default', eager: true })

// Parse once at module level — vault files are static at build time
const _allFiles = parseVault(vaultModules)
export const _collections = [...new Set(
  Object.values(_allFiles).map(f => f.collection).filter(Boolean)
)].sort()

export function useGraph(selectedCollection) {
  const { nodes, edges } = useMemo(() => {
    const files = selectedCollection
      ? Object.fromEntries(
          Object.entries(_allFiles).filter(([, f]) => f.collection === selectedCollection)
        )
      : _allFiles
    return buildGraph(files)
  }, [selectedCollection])

  const positions = useMemo(() => {
    // 3D layout only uses file-level nodes; sections are 2D-only
    const fileNodes = nodes.filter(n => !n.isSection)
    const fileIds = new Set(fileNodes.map(n => n.id))
    const fileEdges = edges.filter(e => fileIds.has(e.source) && fileIds.has(e.target))
    return forceLayout3D(fileNodes, fileEdges)
  }, [nodes, edges])

  return { nodes, edges, positions, collections: _collections }
}
