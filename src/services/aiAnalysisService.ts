import type { GraphNode } from '../types/graph'
import { getNeighbors, getRelationships } from './graphService'

export type AgentStatus = 'pending' | 'running' | 'done'

export interface AgentStep {
  id: string
  name: string
  role: string
  status: AgentStatus
  points: string[]
}

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

// --- Individual agents -----------------------------------------------------
// Each agent owns exactly one job and reads only the local graph — this is a
// demo pipeline, not a real multi-agent LLM system. No external literature
// search or model inference is performed by any step.

async function relationshipScannerAgent(node: GraphNode): Promise<string[]> {
  const relationships = await getRelationships(node.id)
  const kinds = [...new Set(relationships.map((r) => r.relationship))]
  if (!kinds.length) return ['No direct relationships found for this entity in the current graph.']
  return kinds.map(
    (k) => `${k.replace(/_/g, ' ')} — ${relationships.filter((r) => r.relationship === k).length} edge(s)`,
  )
}

async function evidenceValidatorAgent(node: GraphNode): Promise<string[]> {
  const relationships = await getRelationships(node.id)
  if (!relationships.length) return ['No relationships to validate for this entity.']
  const avgConfidence = relationships.reduce((sum, r) => sum + (r.confidence ?? 0), 0) / relationships.length
  const totalEvidence = relationships.reduce((sum, r) => sum + (r.evidenceCount ?? 0), 0)
  const highConfidence = relationships.filter((r) => (r.confidence ?? 0) >= 0.85).length
  const lowConfidence = relationships.filter((r) => (r.confidence ?? 0) < 0.5).length
  return [
    `Average confidence across ${relationships.length} relationship(s): ${Math.round(avgConfidence * 100)}%`,
    `Total supporting evidence count: ${totalEvidence.toLocaleString()}`,
    `${highConfidence} high-confidence (≥85%) link(s), ${lowConfidence} low-confidence (<50%) link(s)`,
  ]
}

async function therapeuticCandidateAgent(node: GraphNode): Promise<string[]> {
  const neighborhood = await getNeighbors(node.id, 1)
  const candidates = neighborhood.nodes.filter((n) => (n.type === 'compound' || n.type === 'drug') && n.id !== node.id)
  if (!candidates.length) return ['No directly connected compounds or drugs found in the current graph.']
  return candidates.map((c) => `${c.label} — ${c.type === 'drug' ? 'approved drug' : 'investigational compound'}`)
}

async function publicationAggregatorAgent(node: GraphNode): Promise<string[]> {
  const neighborhood = await getNeighbors(node.id, 1)
  const publications = neighborhood.nodes.filter((n) => n.type === 'publication')
  if (!publications.length) return ['No directly linked publications found in the current graph.']
  return publications.map((p) => `${p.label}${p.description ? ` — ${p.description}` : ''}`)
}

async function researchSummarizerAgent(node: GraphNode, priorOutputs: Record<string, string[]>): Promise<string[]> {
  const relationshipCount = priorOutputs.scan?.length ?? 0
  const candidateLines = priorOutputs.candidates ?? []
  const candidateCount = candidateLines[0]?.startsWith('No') ? 0 : candidateLines.length
  const publicationLines = priorOutputs.publications ?? []
  const publicationCount = publicationLines[0]?.startsWith('No') ? 0 : publicationLines.length
  return [
    `Synthesized ${relationshipCount} relationship categor${relationshipCount === 1 ? 'y' : 'ies'}, ${candidateCount} therapeutic candidate(s), and ${publicationCount} publication(s) from ${node.label}'s local graph neighborhood.`,
    'This summary reflects only what is encoded in the current demo graph — treat it as a structural overview, not a literature-backed scientific conclusion.',
  ]
}

// --- Pipeline orchestration --------------------------------------------------

interface AgentDefinition {
  id: string
  name: string
  role: string
  durationMs: number
}

export const AGENT_PIPELINE: AgentDefinition[] = [
  { id: 'scan', name: 'Relationship Scanner', role: 'Maps direct graph relationships', durationMs: 550 },
  { id: 'evidence', name: 'Evidence Validator', role: 'Scores confidence and evidence strength', durationMs: 650 },
  { id: 'candidates', name: 'Therapeutic Candidate Finder', role: 'Surfaces connected drugs and compounds', durationMs: 600 },
  { id: 'publications', name: 'Publication Aggregator', role: 'Collects directly linked literature', durationMs: 500 },
  { id: 'summary', name: 'Research Summarizer', role: 'Synthesizes prior agents’ findings into a brief', durationMs: 700 },
]

async function runAgent(id: string, node: GraphNode, priorOutputs: Record<string, string[]>): Promise<string[]> {
  switch (id) {
    case 'scan':
      return relationshipScannerAgent(node)
    case 'evidence':
      return evidenceValidatorAgent(node)
    case 'candidates':
      return therapeuticCandidateAgent(node)
    case 'publications':
      return publicationAggregatorAgent(node)
    case 'summary':
      return researchSummarizerAgent(node, priorOutputs)
    default:
      return []
  }
}

// Runs each agent strictly one at a time — the next agent does not start
// until the previous one has finished — calling onUpdate after every status
// change so the UI can render live pipeline progress.
export async function runAgentPipeline(node: GraphNode, onUpdate: (steps: AgentStep[]) => void): Promise<AgentStep[]> {
  const steps: AgentStep[] = AGENT_PIPELINE.map((def) => ({
    id: def.id,
    name: def.name,
    role: def.role,
    status: 'pending',
    points: [],
  }))
  onUpdate([...steps])

  const outputs: Record<string, string[]> = {}
  for (let i = 0; i < AGENT_PIPELINE.length; i += 1) {
    const def = AGENT_PIPELINE[i]
    steps[i] = { ...steps[i], status: 'running' }
    onUpdate([...steps])

    await delay(def.durationMs)
    const points = await runAgent(def.id, node, outputs)
    outputs[def.id] = points

    steps[i] = { ...steps[i], status: 'done', points }
    onUpdate([...steps])
  }

  return steps
}
