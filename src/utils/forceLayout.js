/**
 * 3D force-directed layout algorithm.
 * Nodes repel each other (Coulomb), edges attract connected nodes (Hooke),
 * and a weak gravity pulls everything toward the origin.
 */
export function forceLayout3D(nodes, edges, options = {}) {
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

  // Initialise positions with a random 3D scatter
  const pos = {}
  for (const node of nodes) {
    const theta = Math.random() * Math.PI * 2
    const phi = Math.acos(2 * Math.random() - 1)
    const r = spread * (0.5 + Math.random() * 0.5)
    pos[node.id] = {
      x: r * Math.sin(phi) * Math.cos(theta),
      y: r * Math.sin(phi) * Math.sin(theta),
      z: r * Math.cos(phi),
      vx: 0,
      vy: 0,
      vz: 0,
    }
  }

  for (let iter = 0; iter < iterations; iter++) {
    // Cool down spring strength over time
    const cooling = 1 - iter / iterations

    // --- Repulsion between every pair ---
    for (let a = 0; a < nodes.length; a++) {
      for (let b = a + 1; b < nodes.length; b++) {
        const pa = pos[nodes[a].id]
        const pb = pos[nodes[b].id]
        const dx = pa.x - pb.x
        const dy = pa.y - pb.y
        const dz = pa.z - pb.z
        const distSq = dx * dx + dy * dy + dz * dz + 0.01
        const dist = Math.sqrt(distSq)
        const force = repulsion / distSq
        const fx = (dx / dist) * force
        const fy = (dy / dist) * force
        const fz = (dz / dist) * force
        pa.vx += fx
        pa.vy += fy
        pa.vz += fz
        pb.vx -= fx
        pb.vy -= fy
        pb.vz -= fz
      }
    }

    // --- Spring attraction along edges ---
    for (const edge of edges) {
      const pa = pos[edge.source]
      const pb = pos[edge.target]
      if (!pa || !pb) continue
      const dx = pb.x - pa.x
      const dy = pb.y - pa.y
      const dz = pb.z - pa.z
      const dist = Math.sqrt(dx * dx + dy * dy + dz * dz) + 0.01
      const displacement = dist - springLength
      const force = springStrength * displacement * cooling
      const fx = (dx / dist) * force
      const fy = (dy / dist) * force
      const fz = (dz / dist) * force
      pa.vx += fx
      pa.vy += fy
      pa.vz += fz
      pb.vx -= fx
      pb.vy -= fy
      pb.vz -= fz
    }

    // --- Gravity toward center ---
    for (const node of nodes) {
      const p = pos[node.id]
      p.vx -= p.x * gravity
      p.vy -= p.y * gravity
      p.vz -= p.z * gravity
    }

    // --- Integrate ---
    for (const node of nodes) {
      const p = pos[node.id]
      p.vx *= damping
      p.vy *= damping
      p.vz *= damping
      p.x += p.vx
      p.y += p.vy
      p.z += p.vz
    }
  }

  // Return only position values (drop velocity)
  const result = {}
  for (const node of nodes) {
    const p = pos[node.id]
    result[node.id] = { x: p.x, y: p.y, z: p.z }
  }
  return result
}
