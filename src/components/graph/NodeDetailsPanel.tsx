import { useMemo } from 'react'
import { useGraphActions, useGraphState } from '../../state/GraphStateContext'
import { NODE_VISUALS } from '../../lib/nodeVisuals'
import type { NodeType } from '../../types/graph'

const TYPE_LABEL_PLURAL: Record<NodeType, string> = {
  gene: 'Genes',
  protein: 'Proteins',
  disease: 'Diseases',
  drug: 'Drugs',
  compound: 'Compounds',
  mutation: 'Mutations',
  pathway: 'Pathways',
  publication: 'Publications',
  clinical_trial: 'Clinical Trials',
  process: 'Processes',
  target: 'Targets',
}

interface NodeDetailsPanelProps {
  onExploreConnections: () => void
  onFilterToType: (type: NodeType) => void
}

export function NodeDetailsPanel({ onExploreConnections, onFilterToType }: NodeDetailsPanelProps) {
  const { state, selectedNode, nodesById } = useGraphState()
  const { clearSelection, setAiPanelOpen } = useGraphActions()

  const connectionBreakdown = useMemo(() => {
    if (!selectedNode) return []
    const counts = new Map<NodeType, number>()
    for (const e of state.dataset.edges) {
      if (e.source === selectedNode.id || e.target === selectedNode.id) {
        const otherId = e.source === selectedNode.id ? e.target : e.source
        const other = nodesById.get(otherId)
        if (other) counts.set(other.type, (counts.get(other.type) ?? 0) + 1)
      }
    }
    return [...counts.entries()].sort((a, b) => b[1] - a[1])
  }, [selectedNode, state.dataset.edges, nodesById])

  if (!selectedNode) return null

  const visual = NODE_VISUALS[selectedNode.type]
  const hasDrugsOrCompounds = connectionBreakdown.some(([t]) => t === 'drug' || t === 'compound')
  const hasMutations = connectionBreakdown.some(([t]) => t === 'mutation')
  const hasPublications = connectionBreakdown.some(([t]) => t === 'publication')

  return (
    <aside className="flex h-full w-80 shrink-0 flex-col overflow-y-auto border-l border-neutral-800 bg-neutral-950">
      <div className="flex items-start justify-between border-b border-neutral-800 p-4">
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <span className="inline-block h-2.5 w-2.5 rounded-full" style={{ backgroundColor: visual.color }} />
            <span className="text-[10px] font-semibold uppercase tracking-widest text-neutral-500">
              {visual.label}
            </span>
          </div>
          <h2 className="mt-1 truncate text-lg font-semibold text-neutral-50">{selectedNode.label}</h2>
          {selectedNode.metadata?.organism ? (
            <p className="mt-0.5 text-xs text-neutral-500">
              {String(selectedNode.metadata.organism)}
              {selectedNode.metadata.chromosome ? ` · Chromosome ${selectedNode.metadata.chromosome}` : ''}
            </p>
          ) : null}
        </div>
        <button
          onClick={clearSelection}
          className="shrink-0 rounded p-1 text-neutral-500 hover:bg-neutral-800 hover:text-neutral-200"
          title="Close"
        >
          <svg viewBox="0 0 20 20" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.6">
            <path d="M5 5l10 10M15 5L5 15" strokeLinecap="round" />
          </svg>
        </button>
      </div>

      <div className="flex-1 space-y-5 p-4">
        {selectedNode.description && (
          <section>
            <h3 className="mb-1 text-[11px] font-semibold uppercase tracking-wide text-neutral-500">Description</h3>
            <p className="text-sm leading-relaxed text-neutral-300">{selectedNode.description}</p>
          </section>
        )}

        {typeof selectedNode.importance === 'number' && (
          <section>
            <h3 className="mb-1 text-[11px] font-semibold uppercase tracking-wide text-neutral-500">
              Importance Score
            </h3>
            <div className="h-1.5 w-full overflow-hidden rounded-full bg-neutral-800">
              <div
                className="h-full rounded-full"
                style={{ width: `${Math.round(selectedNode.importance * 100)}%`, backgroundColor: visual.color }}
              />
            </div>
          </section>
        )}

        <section>
          <h3 className="mb-1.5 text-[11px] font-semibold uppercase tracking-wide text-neutral-500">
            Connected Entities
          </h3>
          {connectionBreakdown.length === 0 ? (
            <p className="text-xs text-neutral-600">No connections in the current graph.</p>
          ) : (
            <div className="space-y-0.5">
              {connectionBreakdown.map(([type, count]) => (
                <button
                  key={type}
                  onClick={() => onFilterToType(type)}
                  className="flex w-full items-center justify-between rounded px-1.5 py-1 text-left text-xs hover:bg-neutral-800/60"
                >
                  <span className="flex items-center gap-1.5 text-neutral-300">
                    <span
                      className="inline-block h-2 w-2 rounded-full"
                      style={{ backgroundColor: NODE_VISUALS[type].color }}
                    />
                    {TYPE_LABEL_PLURAL[type]}
                  </span>
                  <span className="tabular-nums text-neutral-100">{count.toLocaleString()}</span>
                </button>
              ))}
            </div>
          )}
        </section>

        <section className="space-y-1.5">
          <h3 className="mb-1 text-[11px] font-semibold uppercase tracking-wide text-neutral-500">Actions</h3>
          <button
            onClick={onExploreConnections}
            className="w-full rounded border border-neutral-700 bg-neutral-900 px-3 py-2 text-left text-xs font-medium text-neutral-200 transition-colors hover:border-neutral-500 hover:bg-neutral-800"
          >
            Explore Connections
          </button>
          {hasDrugsOrCompounds && (
            <button
              onClick={() => onFilterToType('drug')}
              className="w-full rounded border border-neutral-700 bg-neutral-900 px-3 py-2 text-left text-xs font-medium text-neutral-200 transition-colors hover:border-neutral-500 hover:bg-neutral-800"
            >
              Find Drugs
            </button>
          )}
          {hasMutations && (
            <button
              onClick={() => onFilterToType('mutation')}
              className="w-full rounded border border-neutral-700 bg-neutral-900 px-3 py-2 text-left text-xs font-medium text-neutral-200 transition-colors hover:border-neutral-500 hover:bg-neutral-800"
            >
              Find Mutations
            </button>
          )}
          {hasPublications && (
            <button
              onClick={() => onFilterToType('publication')}
              className="w-full rounded border border-neutral-700 bg-neutral-900 px-3 py-2 text-left text-xs font-medium text-neutral-200 transition-colors hover:border-neutral-500 hover:bg-neutral-800"
            >
              View Publications
            </button>
          )}
          <button
            onClick={() => setAiPanelOpen(true)}
            className="w-full rounded border border-sky-800 bg-sky-950/40 px-3 py-2 text-left text-xs font-medium text-sky-300 transition-colors hover:border-sky-600 hover:bg-sky-950/70"
          >
            Run AI Analysis
          </button>
        </section>
      </div>
    </aside>
  )
}
