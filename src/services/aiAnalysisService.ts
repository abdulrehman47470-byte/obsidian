import type { GraphNode } from '../types/graph'
import { getRelationships } from './graphService'

export interface AiAnalysisSection {
  title: string
  points: string[]
}

export interface AiAnalysisResult {
  isMock: true
  summary: string
  sections: AiAnalysisSection[]
  generatedAt: string
}

function delay<T>(value: T, ms = 900): Promise<T> {
  return new Promise((resolve) => setTimeout(() => resolve(value), ms))
}

// Placeholder for a future LLM-backed research assistant call. Produces a
// clearly-labeled mock response derived from the node's actual graph
// neighborhood so the demo output stays grounded in real dataset content
// without asserting any real scientific conclusion.
export async function runAiAnalysis(node: GraphNode, secondNode?: GraphNode): Promise<AiAnalysisResult> {
  const relationships = await getRelationships(node.id)
  const relationshipKinds = [...new Set(relationships.map((r) => r.relationship))]

  const subject = secondNode ? `${node.label} → ${secondNode.label}` : node.label

  const result: AiAnalysisResult = {
    isMock: true,
    summary: `Demo analysis of ${subject}. This is a mock response generated from local graph structure — no external literature search or model inference was performed.`,
    sections: [
      {
        title: 'Potential relationships to review',
        points: relationshipKinds.length
          ? relationshipKinds.map((k) => `${k.replace(/_/g, ' ')} — ${relationships.filter((r) => r.relationship === k).length} edge(s) in the current graph`)
          : ['No direct relationships found in the current graph for this entity.'],
      },
      {
        title: 'Suggested next steps',
        points: [
          `Explore ${node.label}'s 2-hop neighborhood for indirect mechanistic links.`,
          `Cross-reference connected publications for supporting evidence strength.`,
          `Check connected compounds/drugs for therapeutic candidates worth prioritizing.`,
        ],
      },
    ],
    generatedAt: new Date().toISOString(),
  }
  return delay(result)
}
