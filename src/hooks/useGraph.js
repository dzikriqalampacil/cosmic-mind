import { useMemo } from 'react'
import { parseVault, buildGraph } from '../utils/parseVault'
import { forceLayout3D } from '../utils/forceLayout'

const vaultModules = import.meta.glob('../vault/*.md', { query: '?raw', import: 'default', eager: true })

export function useGraph() {
  const { nodes, edges } = useMemo(() => {
    const files = parseVault(vaultModules)
    return buildGraph(files)
  }, [])

  const positions = useMemo(() => {
    return forceLayout3D(nodes, edges)
  }, [nodes, edges])

  return { nodes, edges, positions }
}
