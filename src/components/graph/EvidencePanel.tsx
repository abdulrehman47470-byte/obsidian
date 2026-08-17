import { useGraphActions, useGraphState } from '../../state/GraphStateContext'
import { NODE_VISUALS } from '../../lib/nodeVisuals'

export function EvidencePanel() {
  const { selectedEdge, nodesById } = useGraphState()
  const { clearSelection } = useGraphActions()

  if (!selectedEdge) return null

  const source = nodesById.get(selectedEdge.source)
  const target = nodesById.get(selectedEdge.target)
  const confidencePct = Math.round((selectedEdge.confidence ?? 0) * 100)

  return (
    <aside className="flex h-full w-80 shrink-0 flex-col overflow-y-auto border-l border-neutral-800 bg-neutral-950">
      <div className="flex items-start justify-between border-b border-neutral-800 p-4">
        <div>
          <span className="text-[10px] font-semibold uppercase tracking-widest text-neutral-500">
            Relationship Evidence
          </span>
          <h2 className="mt-1 text-base font-semibold uppercase tracking-wide text-neutral-50">
            {selectedEdge.relationship.replace(/_/g, ' ')}
          </h2>
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
        <section className="flex items-center gap-2 text-sm">
          {source && (
            <span className="flex items-center gap-1.5 rounded border border-neutral-800 px-2 py-1 text-neutral-200">
              <span
                className="h-2 w-2 rounded-full"
                style={{ backgroundColor: NODE_VISUALS[source.type].color }}
              />
              {source.label}
            </span>
          )}
          <span className="text-neutral-600">→</span>
          {target && (
            <span className="flex items-center gap-1.5 rounded border border-neutral-800 px-2 py-1 text-neutral-200">
              <span
                className="h-2 w-2 rounded-full"
                style={{ backgroundColor: NODE_VISUALS[target.type].color }}
              />
              {target.label}
            </span>
          )}
        </section>

        <section>
          <h3 className="mb-1 text-[11px] font-semibold uppercase tracking-wide text-neutral-500">Confidence</h3>
          <div className="flex items-center gap-2">
            <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-neutral-800">
              <div
                className="h-full rounded-full bg-emerald-500"
                style={{ width: `${confidencePct}%` }}
              />
            </div>
            <span className="w-10 text-right text-xs tabular-nums text-neutral-300">{confidencePct}%</span>
          </div>
        </section>

        <section className="grid grid-cols-2 gap-3 text-xs">
          <div className="rounded border border-neutral-800 p-2">
            <div className="text-neutral-500">Evidence count</div>
            <div className="mt-0.5 text-base font-semibold text-neutral-100">
              {selectedEdge.evidenceCount?.toLocaleString() ?? '—'}
            </div>
          </div>
          <div className="rounded border border-neutral-800 p-2">
            <div className="text-neutral-500">Last updated</div>
            <div className="mt-0.5 text-base font-semibold text-neutral-100">{selectedEdge.lastUpdated ?? '—'}</div>
          </div>
        </section>

        {selectedEdge.sourceDatabase && selectedEdge.sourceDatabase.length > 0 && (
          <section>
            <h3 className="mb-1.5 text-[11px] font-semibold uppercase tracking-wide text-neutral-500">
              Source Databases
            </h3>
            <div className="flex flex-wrap gap-1.5">
              {selectedEdge.sourceDatabase.map((db) => (
                <span key={db} className="rounded border border-neutral-800 bg-neutral-900 px-2 py-0.5 text-xs text-neutral-300">
                  {db}
                </span>
              ))}
            </div>
          </section>
        )}

        <section>
          <h3 className="mb-1 text-[11px] font-semibold uppercase tracking-wide text-neutral-500">Publications</h3>
          <p className="text-xs text-neutral-500">
            {selectedEdge.evidenceCount ?? 0} supporting publication{selectedEdge.evidenceCount === 1 ? '' : 's'} in the
            underlying evidence store.
          </p>
        </section>
      </div>
    </aside>
  )
}
