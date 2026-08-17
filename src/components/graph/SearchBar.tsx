import { useEffect, useRef, useState } from 'react'
import { searchEntities } from '../../services/graphService'
import { useGraphActions, useGraphState } from '../../state/GraphStateContext'
import { NODE_VISUALS } from '../../lib/nodeVisuals'
import type { SearchResult } from '../../types/graph'

interface SearchBarProps {
  onSelectResult: (nodeId: string) => void
}

export function SearchBar({ onSelectResult }: SearchBarProps) {
  const { state } = useGraphState()
  const { setSearchQuery } = useGraphActions()
  const [results, setResults] = useState<SearchResult[]>([])
  const [open, setOpen] = useState(false)
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current)
    const q = state.searchQuery
    if (!q.trim()) {
      setResults([])
      setOpen(false)
      return
    }
    debounceRef.current = setTimeout(async () => {
      const res = await searchEntities(q, 12)
      setResults(res)
      setOpen(true)
    }, 200)
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current)
    }
  }, [state.searchQuery])

  return (
    <div className="relative">
      <input
        id="graph-search-input"
        value={state.searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        onFocus={() => results.length > 0 && setOpen(true)}
        placeholder="Search TP53, EGFR, aspirin…"
        className="w-full rounded border border-neutral-800 bg-neutral-900 px-3 py-2 text-sm text-neutral-100 placeholder:text-neutral-600 outline-none focus:border-neutral-600"
      />
      {open && results.length > 0 && (
        <div className="absolute left-0 right-0 top-full z-30 mt-1 max-h-80 overflow-y-auto rounded border border-neutral-800 bg-neutral-900 shadow-xl">
          {results.map((r) => (
            <button
              key={r.node.id}
              onClick={() => {
                onSelectResult(r.node.id)
                setOpen(false)
              }}
              className="flex w-full items-start gap-2 border-b border-neutral-800/60 px-3 py-2 text-left last:border-b-0 hover:bg-neutral-800/60"
            >
              <span
                className="mt-1 inline-block h-2 w-2 shrink-0 rounded-full"
                style={{ backgroundColor: NODE_VISUALS[r.node.type].color }}
              />
              <span className="min-w-0 flex-1">
                <span className="flex items-center justify-between gap-2">
                  <span className="truncate text-sm text-neutral-100">{r.node.label}</span>
                  <span className="shrink-0 text-[10px] uppercase tracking-wide text-neutral-500">
                    {NODE_VISUALS[r.node.type].label}
                  </span>
                </span>
                {r.node.description && (
                  <span className="mt-0.5 line-clamp-1 block text-xs text-neutral-500">{r.node.description}</span>
                )}
                <span className="mt-0.5 block text-[10px] text-neutral-600">{r.connectionCount} connections</span>
              </span>
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
