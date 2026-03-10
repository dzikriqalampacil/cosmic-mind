export function forceLayout2D(nodes, edges, options = {}) {
  const {
    iterations = 150,
    repulsion = 80,
    springLength = 6,
    springStrength = 0.05,
    gravity = 0.008,
    damping = 0.88,
    spread = 15,
  } = options

  if (!nodes.length) return {}

  const pos = {}
  for (const node of nodes) {
    const angle = Math.random() * Math.PI * 2
    const r = spread * (0.5 + Math.random() * 0.5)
    pos[node.id] = {
      x: r * Math.cos(angle),
      y: r * Math.sin(angle),
      vx: 0,
      vy: 0,
    }
  }

  for (let iter = 0; iter < iterations; iter++) {
    const cooling = 1 - iter / iterations

    // Repulsion
    for (let a = 0; a < nodes.length; a++) {
      for (let b = a + 1; b < nodes.length; b++) {
        const pa = pos[nodes[a].id]
        const pb = pos[nodes[b].id]
        const dx = pa.x - pb.x
        const dy = pa.y - pb.y
        const distSq = dx * dx + dy * dy + 0.01
        const dist = Math.sqrt(distSq)
        const force = repulsion / distSq
        const fx = (dx / dist) * force
        const fy = (dy / dist) * force
        pa.vx += fx; pa.vy += fy
        pb.vx -= fx; pb.vy -= fy
      }
    }

    // Springs
    for (const edge of edges) {
      const pa = pos[edge.source]
      const pb = pos[edge.target]
      if (!pa || !pb) continue
      const dx = pb.x - pa.x
      const dy = pb.y - pa.y
      const dist = Math.sqrt(dx * dx + dy * dy) + 0.01
      const displacement = dist - springLength
      const force = springStrength * displacement * cooling
      const fx = (dx / dist) * force
      const fy = (dy / dist) * force
      pa.vx += fx; pa.vy += fy
      pb.vx -= fx; pb.vy -= fy
    }

    // Gravity
    for (const node of nodes) {
      const p = pos[node.id]
      p.vx -= p.x * gravity
      p.vy -= p.y * gravity
    }

    // Integrate
    for (const node of nodes) {
      const p = pos[node.id]
      p.vx *= damping; p.vy *= damping
      p.x += p.vx; p.y += p.vy
    }
  }

  const result = {}
  for (const node of nodes) {
    const p = pos[node.id]
    result[node.id] = { x: p.x, y: p.y }
  }
  return result
}
