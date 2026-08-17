import { useGraphState } from '../../state/GraphStateContext'

const HEADLINE_TYPES: Array<{ type: string; label: string }> = [
  { type: 'gene', label: 'Genes' },
  { type: 'protein', label: 'Proteins' },
  { type: 'disease', label: 'Diseases' },
  { type: 'compound', label: 'Compounds' },
  { type: 'drug', label: 'Drugs' },
  { type: 'publication', label: 'Publications' },
]

export function GraphStatsBar() {
  const { state, visibleDataset } = useGraphState()

  const countsByType = new Map<string, number>()
  for (const n of state.dataset.nodes) {
    countsByType.set(n.type, (countsByType.get(n.type) ?? 0) + 1)
  }

  return (
    <div className="border-t border-neutral-800 pt-3">
      <h3 className="mb-1.5 text-[11px] font-semibold uppercase tracking-wide text-neutral-500">Statistics</h3>
      <div className="grid grid-cols-2 gap-x-3 gap-y-1 text-xs">
        <div className="flex justify-between text-neutral-300">
          <span>Nodes</span>
          <span className="tabular-nums text-neutral-100">{state.dataset.nodes.length.toLocaleString()}</span>
        </div>
        <div className="flex justify-between text-neutral-300">
          <span>Edges</span>
          <span className="tabular-nums text-neutral-100">{state.dataset.edges.length.toLocaleString()}</span>
        </div>
        {HEADLINE_TYPES.map(({ type, label }) => (
          <div key={type} className="flex justify-between text-neutral-500">
            <span>{label}</span>
            <span className="tabular-nums text-neutral-400">{(countsByType.get(type) ?? 0).toLocaleString()}</span>
          </div>
        ))}
      </div>
      {(visibleDataset.nodes.length !== state.dataset.nodes.length || state.focusMode) && (
        <div className="mt-2 text-[10px] text-neutral-600">
          Showing {visibleDataset.nodes.length.toLocaleString()} of {state.dataset.nodes.length.toLocaleString()} nodes
        </div>
      )}
    </div>
  )
}
