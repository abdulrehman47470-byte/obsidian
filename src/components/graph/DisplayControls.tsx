import { useGraphActions, useGraphState } from '../../state/GraphStateContext'

export function DisplayControls() {
  const { state } = useGraphState()
  const { setShowEdgeLabels, setFocusMode, setHopDepth } = useGraphActions()

  return (
    <div>
      <h3 className="mb-1.5 text-[11px] font-semibold uppercase tracking-wide text-neutral-500">Display</h3>

      <label className="flex cursor-pointer items-center gap-2 rounded px-1.5 py-1 text-xs text-neutral-300 hover:bg-neutral-800/60">
        <input
          type="checkbox"
          checked={state.showEdgeLabels}
          onChange={(e) => setShowEdgeLabels(e.target.checked)}
          className="h-3 w-3 accent-neutral-400"
        />
        Edge labels
      </label>

      <label className="flex cursor-pointer items-center gap-2 rounded px-1.5 py-1 text-xs text-neutral-300 hover:bg-neutral-800/60">
        <input
          type="checkbox"
          checked={state.focusMode}
          onChange={(e) => setFocusMode(e.target.checked)}
          disabled={!state.selectedNodeId}
          className="h-3 w-3 accent-neutral-400 disabled:opacity-40"
        />
        Focus mode
        {!state.selectedNodeId && <span className="text-[10px] text-neutral-600">(select a node)</span>}
      </label>

      {state.focusMode && (
        <div className="mt-1.5 flex items-center gap-1.5 px-1.5">
          <span className="text-[10px] uppercase tracking-wide text-neutral-500">Hops</span>
          {[1, 2, 3].map((h) => (
            <button
              key={h}
              onClick={() => setHopDepth(h as 1 | 2 | 3)}
              className={`h-6 w-6 rounded text-xs transition-colors ${
                state.hopDepth === h
                  ? 'bg-neutral-100 text-neutral-900'
                  : 'bg-neutral-800 text-neutral-400 hover:bg-neutral-700'
              }`}
            >
              {h}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
