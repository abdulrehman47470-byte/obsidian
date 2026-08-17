import type { NodeType } from '../types/graph'

export interface NodeVisual {
  color: string
  shape: 'ellipse' | 'round-rectangle' | 'diamond' | 'hexagon' | 'triangle' | 'round-triangle' | 'octagon' | 'round-diamond'
  label: string
}

// One distinct color + shape per entity type. Colors chosen for
// legibility on a dark canvas and sufficient hue separation at a glance.
export const NODE_VISUALS: Record<NodeType, NodeVisual> = {
  gene: { color: '#5eb1ff', shape: 'ellipse', label: 'Gene' },
  protein: { color: '#7c8cff', shape: 'round-rectangle', label: 'Protein' },
  disease: { color: '#ff6b6b', shape: 'diamond', label: 'Disease' },
  drug: { color: '#3ddc97', shape: 'hexagon', label: 'Drug' },
  compound: { color: '#40c4b8', shape: 'round-triangle', label: 'Compound' },
  mutation: { color: '#ffb84d', shape: 'triangle', label: 'Mutation' },
  pathway: { color: '#c792ea', shape: 'octagon', label: 'Pathway' },
  publication: { color: '#8d99ae', shape: 'round-rectangle', label: 'Publication' },
  clinical_trial: { color: '#e0b04d', shape: 'round-diamond', label: 'Clinical Trial' },
  process: { color: '#5ec9c0', shape: 'round-rectangle', label: 'Process' },
  target: { color: '#ff8fab', shape: 'ellipse', label: 'Target' },
}

export const RELATIONSHIP_COLOR = '#4a5568'
export const RELATIONSHIP_HIGHLIGHT_COLOR = '#e8b64c'
