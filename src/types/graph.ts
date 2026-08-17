// Core graph domain model. Mirrors a Neo4j property-graph shape so the
// mock provider can be swapped for a FastAPI/Neo4j-backed provider later
// without touching UI code (see src/services/graphService.ts).

export type NodeType =
  | 'gene'
  | 'protein'
  | 'disease'
  | 'drug'
  | 'compound'
  | 'mutation'
  | 'pathway'
  | 'publication'
  | 'clinical_trial'
  | 'process'
  | 'target'

export const NODE_TYPES: NodeType[] = [
  'gene',
  'protein',
  'disease',
  'drug',
  'compound',
  'mutation',
  'pathway',
  'publication',
  'clinical_trial',
  'process',
  'target',
]

export type RelationshipType =
  | 'encodes'
  | 'associated_with'
  | 'has_mutation'
  | 'mentioned_in'
  | 'involved_in'
  | 'targeted_by'
  | 'targets'
  | 'inhibits'
  | 'activates'
  | 'interacts_with'
  | 'affects'
  | 'tested_for'
  | 'developed_as'
  | 'supports'
  | 'evaluated_in'
  | 'part_of'

export const RELATIONSHIP_TYPES: RelationshipType[] = [
  'interacts_with',
  'targets',
  'inhibits',
  'activates',
  'associated_with',
  'involved_in',
  'mentioned_in',
  'encodes',
  'has_mutation',
  'targeted_by',
  'affects',
  'tested_for',
  'developed_as',
  'supports',
  'evaluated_in',
  'part_of',
]

export interface GraphNode {
  id: string
  label: string
  type: NodeType
  description?: string
  metadata?: Record<string, unknown>
  /** 0-1 relative importance score; drives node sizing alongside degree. */
  importance?: number
}

export interface GraphEdge {
  id: string
  source: string
  target: string
  relationship: RelationshipType
  confidence?: number
  evidenceCount?: number
  sourceDatabase?: string[]
  publicationIds?: string[]
  lastUpdated?: string
}

export interface GraphDataset {
  nodes: GraphNode[]
  edges: GraphEdge[]
}

export interface GraphStatistics {
  nodeCount: number
  edgeCount: number
  countsByType: Partial<Record<NodeType, number>>
}

export interface SearchResult {
  node: GraphNode
  connectionCount: number
}

export type LayoutName = 'force-directed' | 'hierarchical' | 'circular' | 'concentric'
