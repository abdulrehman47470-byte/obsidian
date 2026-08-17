import type { GraphDataset, GraphEdge, GraphNode, GraphStatistics, SearchResult } from '../../types/graph'

// A DataProvider is the only seam between the UI and a data backend.
// The mock provider implements this against the in-memory dataset today;
// a future FastAPI/Neo4j-backed provider implements the same interface
// (e.g. calling `GET /api/graph`, `POST /cypher`, etc.) and can be swapped
// in via `setDataProvider` in graphService.ts with zero UI changes.
export interface DataProvider {
  getGraph(): Promise<GraphDataset>
  searchEntities(query: string, limit?: number): Promise<SearchResult[]>
  getNode(id: string): Promise<GraphNode | undefined>
  getNeighbors(id: string, hops?: number): Promise<GraphDataset>
  getRelationships(nodeId: string): Promise<GraphEdge[]>
  getGraphStatistics(): Promise<GraphStatistics>
}
