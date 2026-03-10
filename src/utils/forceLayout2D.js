/**
 * Radial tree layout with barycenter crossing-minimization.
 * Returns { [nodeId]: { x, y, isRoot, depth } }
 *
 * Crossing reduction: iteratively re-orders siblings by the average angle
 * of their external connections (barycenter heuristic). Connected siblings
 * converge to angular neighbours, which eliminates most edge crossings.
 */
export function radialLayout(nodes, edges, forcedRootId = null) {
  if (!nodes.length) return {}

  // ── Adjacency ──────────────────────────────────────────────────────────────
  const adj = {}
  for (const n of nodes) adj[n.id] = []
  for (const e of edges) {
    if (adj[e.source]) adj[e.source].push(e.target)
    if (adj[e.target]) adj[e.target].push(e.source)
  }

  // ── Root ───────────────────────────────────────────────────────────────────
  let rootId = (forcedRootId && adj[forcedRootId]) ? forcedRootId : null
  if (!rootId) {
    rootId = nodes[0].id
    for (const n of nodes) {
      if (adj[n.id].length > adj[rootId].length) rootId = n.id
    }
  }

  // ── BFS spanning tree ──────────────────────────────────────────────────────
  const children = {}
  const depth = {}
  for (const n of nodes) children[n.id] = []
  const visited = new Set([rootId])
  const queue = [rootId]
  depth[rootId] = 0

  while (queue.length) {
    const cur = queue.shift()
    for (const nb of adj[cur]) {
      if (!visited.has(nb)) {
        visited.add(nb)
        children[cur].push(nb)
        depth[nb] = depth[cur] + 1
        queue.push(nb)
      }
    }
  }
  for (const n of nodes) {
    if (!visited.has(n.id)) {
      children[rootId].push(n.id)
      children[n.id] = []
      depth[n.id] = 1
    }
  }

  // ── Traversal order (root → leaves) and leaf counts ───────────────────────
  const topoOrder = []   // pre-order: root first
  const stk = [rootId]
  while (stk.length) {
    const id = stk.pop()
    topoOrder.push(id)
    for (const c of children[id]) stk.push(c)
  }

  const leaves = {}
  for (const id of [...topoOrder].reverse()) {   // post-order for leaf counts
    leaves[id] = children[id].length === 0
      ? 1
      : children[id].reduce((s, c) => s + leaves[c], 0)
  }

  // ── Precompute descendants for each node ───────────────────────────────────
  const desc = {}
  for (const id of [...topoOrder].reverse()) {
    desc[id] = new Set([id])
    for (const c of children[id]) for (const d of desc[c]) desc[id].add(d)
  }

  // ── Node label lookup ──────────────────────────────────────────────────────
  const labelOf = Object.fromEntries(nodes.map(n => [n.id, n.label ?? n.id]))

  // ── Sort children by label initially so chapters appear in natural order ───
  // This gives barycenter a good starting point and ensures sequential nodes
  // (Ch1, Ch2, Ch3…) start adjacent, minimising their mutual edge crossings.
  for (const id of topoOrder) {
    children[id].sort((a, b) => labelOf[a].localeCompare(labelOf[b], undefined, { numeric: true, sensitivity: 'base' }))
  }

  // ── Helpers ────────────────────────────────────────────────────────────────
  // Assign tentative midpoint angles for the current child ordering
  function assignAngles(id, aStart, aEnd, out) {
    out[id] = (aStart + aEnd) / 2
    const kids = children[id]
    if (!kids.length) return
    const total = kids.reduce((s, c) => s + leaves[c], 0)
    let cur = aStart
    for (const kid of kids) {
      const sweep = (aEnd - aStart) * (leaves[kid] / total)
      assignAngles(kid, cur, cur + sweep, out)
      cur += sweep
    }
  }

  // ── Barycenter crossing minimization (5 passes) ────────────────────────────
  // In each pass we: (1) assign tentative angles, (2) sort each node's
  // children so that each child's "barycenter" (avg angle of its external
  // connections) increases left-to-right within the parent's arc.
  for (let iter = 0; iter < 5; iter++) {
    const angleMap = {}
    assignAngles(rootId, -Math.PI, Math.PI, angleMap)

    // Process top-down so parent ordering is stable before children are sorted.
    // Skip the root's direct children — they stay in label-sorted order so
    // chapters appear in natural sequence (Ch1 → Ch8) clockwise.
    for (const nodeId of topoOrder) {
      const kids = children[nodeId]
      if (!kids.length) continue
      if (depth[nodeId] === 0) continue   // root's children: keep label order

      kids.sort((a, b) => {
        const bary = (id) => {
          // External neighbours: connected nodes outside id's own subtree
          const ext = adj[id].filter(nb => !desc[id].has(nb))
          if (!ext.length) return angleMap[id] ?? 0
          return ext.reduce((s, nb) => s + (angleMap[nb] ?? 0), 0) / ext.length
        }
        return bary(a) - bary(b)
      })
    }
  }

  // ── Dynamic radii ──────────────────────────────────────────────────────────
  const MIN_ARC = 240  // pixels per leaf slot — bigger = more spacing
  const totalLeaves = leaves[rootId]
  const R1 = Math.max(320, Math.ceil(totalLeaves * MIN_ARC / (2 * Math.PI)))
  const GAP = Math.max(240, R1 * 0.75)
  const RADII = [0, R1, R1 + GAP, R1 + GAP * 1.8, R1 + GAP * 2.5]

  // ── Final placement ────────────────────────────────────────────────────────
  const pos = {}
  const PADDING = 0.04  // small gap between siblings

  function place(id, aStart, aEnd) {
    const d = depth[id] || 0
    const r = RADII[Math.min(d, RADII.length - 1)]
    const mid = (aStart + aEnd) / 2
    pos[id] = {
      x: d === 0 ? 0 : r * Math.cos(mid),
      y: d === 0 ? 0 : r * Math.sin(mid),
      isRoot: d === 0,
      depth: d,
    }

    const kids = children[id]
    if (!kids.length) return
    const total = kids.reduce((s, c) => s + leaves[c], 0)
    let cur = aStart
    for (const kid of kids) {
      const sweep = (aEnd - aStart) * (leaves[kid] / total)
      place(kid, cur + PADDING, cur + sweep - PADDING)
      cur += sweep
    }
  }

  // Start angle: place the first child (Ch1) at 12 o'clock and go clockwise
  const nTopLevel = children[rootId].length
  const startAngle = nTopLevel > 0
    ? -(Math.PI / 2) - (Math.PI / nTopLevel)
    : -Math.PI

  place(rootId, startAngle, startAngle + Math.PI * 2)
  return pos
}
