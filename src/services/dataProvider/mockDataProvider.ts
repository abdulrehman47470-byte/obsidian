import { mockDataset } from '../../data/mockDataset'
import type { GraphDataset, GraphEdge, GraphNode, GraphStatistics, NodeType, SearchResult } from '../../types/graph'
import type { DataProvider } from './types'

const nodesById = new Map<string, GraphNode>(mockDataset.nodes.map((n) => [n.id, n]))

function degreeOf(id: string): number {
  return mockDataset.edges.filter((e) => e.source === id || e.target === id).length
}

function neighborsWithinHops(id: string, hops: number): GraphDataset {
  const visitedNodeIds = new Set<string>([id])
  const visitedEdgeIds = new Set<string>()
  let frontier = [id]

  for (let hop = 0; hop < hops; hop += 1) {
    const nextFrontier: string[] = []
    for (const currentId of frontier) {
      for (const e of mockDataset.edges) {
        if (e.source === currentId || e.target === currentId) {
          if (!visitedEdgeIds.has(e.id)) visitedEdgeIds.add(e.id)
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

  return {
    nodes: [...visitedNodeIds].map((nid) => nodesById.get(nid)).filter((n): n is GraphNode => Boolean(n)),
    edges: mockDataset.edges.filter((e) => visitedEdgeIds.has(e.id)),
  }
}

// Simulates realistic network latency so loading states are exercised.
function delay<T>(value: T, ms = 120): Promise<T> {
  return new Promise((resolve) => setTimeout(() => resolve(value), ms))
}

export const mockDataProvider: DataProvider = {
  async getGraph() {
    return delay(mockDataset)
  },

  async searchEntities(query, limit = 20) {
    const q = query.trim().toLowerCase()
    if (!q) return delay([])
    const results: SearchResult[] = mockDataset.nodes
      .filter((n) => n.label.toLowerCase().includes(q) || n.description?.toLowerCase().includes(q))
      .sort((a, b) => {
        const aStarts = a.label.toLowerCase().startsWith(q) ? 0 : 1
        const bStarts = b.label.toLowerCase().startsWith(q) ? 0 : 1
        if (aStarts !== bStarts) return aStarts - bStarts
        return (b.importance ?? 0) - (a.importance ?? 0)
      })
      .slice(0, limit)
      .map((node) => ({ node, connectionCount: degreeOf(node.id) }))
    return delay(results, 80)
  },

  async getNode(id) {
    return delay(nodesById.get(id))
  },

  async getNeighbors(id, hops = 1) {
    return delay(neighborsWithinHops(id, hops))
  },

  async getRelationships(nodeId) {
    const rels: GraphEdge[] = mockDataset.edges.filter((e) => e.source === nodeId || e.target === nodeId)
    return delay(rels)
  },

  async getGraphStatistics() {
    const countsByType: Partial<Record<NodeType, number>> = {}
    for (const n of mockDataset.nodes) {
      countsByType[n.type] = (countsByType[n.type] ?? 0) + 1
    }
    const stats: GraphStatistics = {
      nodeCount: mockDataset.nodes.length,
      edgeCount: mockDataset.edges.length,
      countsByType,
    }
    return delay(stats, 40)
  },
}
