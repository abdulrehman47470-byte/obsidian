import type { GraphDataset, GraphEdge, GraphNode } from '../types/graph'

export function computeDegrees(edges: GraphEdge[]): Map<string, number> {
  const degrees = new Map<string, number>()
  for (const e of edges) {
    degrees.set(e.source, (degrees.get(e.source) ?? 0) + 1)
    degrees.set(e.target, (degrees.get(e.target) ?? 0) + 1)
  }
  return degrees
}

/** Node visual size in px, scaled by degree (connection count) and importance. */
export function nodeSize(degree: number, importance: number | undefined, maxDegree: number): number {
  const minSize = 18
  const maxSize = 60
  const degreeFactor = maxDegree > 0 ? degree / maxDegree : 0
  const importanceFactor = importance ?? 0.3
  const blended = degreeFactor * 0.65 + importanceFactor * 0.35
  return Math.round(minSize + blended * (maxSize - minSize))
}

/** Breadth-first traversal outward from a root node up to N hops. */
export function bfsWithinHops(dataset: GraphDataset, rootId: string, hops: number): GraphDataset {
  const visitedNodeIds = new Set<string>([rootId])
  const visitedEdgeIds = new Set<string>()
  let frontier = [rootId]

  for (let hop = 0; hop < hops; hop += 1) {
    const nextFrontier: string[] = []
    for (const currentId of frontier) {
      for (const e of dataset.edges) {
        if (e.source === currentId || e.target === currentId) {
          visitedEdgeIds.add(e.id)
          const otherId = e.source === currentId ? e.target : e.source
          if (!visitedNodeIds.has(otherId)) {
            visitedNodeIds.add(otherId)
            nextFrontier.push(otherId)
          }
        }
      }
    }
    frontier = nextFrontier
  }

  const nodesById = new Map(dataset.nodes.map((n) => [n.id, n]))
  return {
    nodes: [...visitedNodeIds].map((id) => nodesById.get(id)).filter((n): n is GraphNode => Boolean(n)),
    edges: dataset.edges.filter((e) => visitedEdgeIds.has(e.id)),
  }
}
