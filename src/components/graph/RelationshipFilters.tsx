import { RELATIONSHIP_TYPES } from '../../types/graph'
import { useGraphActions, useGraphState } from '../../state/GraphStateContext'

export function RelationshipFilters() {
  const { state } = useGraphState()
  const { toggleRelationship } = useGraphActions()

  return (
    <div>
      <h3 className="mb-1.5 text-[11px] font-semibold uppercase tracking-wide text-neutral-500">Relationships</h3>
      <div className="space-y-0.5">
        {RELATIONSHIP_TYPES.map((rel) => {
          const enabled = state.enabledRelationships.has(rel)
          return (
            <label
              key={rel}
              className="flex w-full cursor-pointer items-center gap-2 rounded px-1.5 py-1 text-xs hover:bg-neutral-800/60"
            >
              <input
                type="checkbox"
                checked={enabled}
                onChange={() => toggleRelationship(rel)}
                className="h-3 w-3 accent-neutral-400"
              />
              <span className={enabled ? 'text-neutral-300' : 'text-neutral-600'}>{rel.replace(/_/g, ' ')}</span>
            </label>
          )
        })}
      </div>
    </div>
  )
}
