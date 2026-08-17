import { NODE_TYPES } from '../../types/graph'
import { NODE_VISUALS } from '../../lib/nodeVisuals'
import { useGraphActions, useGraphState } from '../../state/GraphStateContext'

export function NodeTypeFilters() {
  const { state } = useGraphState()
  const { toggleNodeType } = useGraphActions()

  const countsByType = new Map<string, number>()
  for (const n of state.dataset.nodes) {
    countsByType.set(n.type, (countsByType.get(n.type) ?? 0) + 1)
  }

  return (
    <div>
      <div className="mb-1.5 flex items-center justify-between">
        <h3 className="text-[11px] font-semibold uppercase tracking-wide text-neutral-500">Node Types</h3>
      </div>
      <div className="space-y-0.5">
        {NODE_TYPES.map((type) => {
          const enabled = state.enabledNodeTypes.has(type)
          return (
            <button
              key={type}
              onClick={() => toggleNodeType(type)}
              className={`flex w-full items-center gap-2 rounded px-1.5 py-1 text-left text-xs transition-colors hover:bg-neutral-800/60 ${
                enabled ? 'text-neutral-200' : 'text-neutral-600'
              }`}
            >
              <span
                className="inline-block h-2.5 w-2.5 shrink-0 rounded-full transition-opacity"
                style={{ backgroundColor: NODE_VISUALS[type].color, opacity: enabled ? 1 : 0.3 }}
              />
              <span className="flex-1">{NODE_VISUALS[type].label}</span>
              <span className="text-neutral-600">{countsByType.get(type) ?? 0}</span>
            </button>
          )
        })}
      </div>
    </div>
  )
}
