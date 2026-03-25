import { useMemo } from 'react'
import { Line } from '@react-three/drei'

export default function GraphEdge({ edge, positions, highlighted }) {
  const start = positions[edge.source]
  const end = positions[edge.target]

  const points = useMemo(() => {
    if (!start || !end) return null
    return [
      [start.x, start.y, start.z],
      [end.x, end.y, end.z],
    ]
  }, [start, end])

  if (!points) return null

  return (
    <Line
      points={points}
      color={highlighted ? '#7C5CFF' : '#2A3A4A'}
      lineWidth={highlighted ? 2 : 1}
      transparent
      opacity={highlighted ? 0.85 : 0.65}
    />
  )
}
