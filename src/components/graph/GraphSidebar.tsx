import { SearchBar } from './SearchBar'
import { NodeTypeFilters } from './NodeTypeFilters'
import { RelationshipFilters } from './RelationshipFilters'
import { DisplayControls } from './DisplayControls'
import { GraphStatsBar } from './GraphStatsBar'

interface GraphSidebarProps {
  onSelectResult: (nodeId: string) => void
}

export function GraphSidebar({ onSelectResult }: GraphSidebarProps) {
  return (
    <aside className="flex h-full w-72 shrink-0 flex-col gap-4 overflow-y-auto border-r border-neutral-800 bg-neutral-950 p-3">
      <div>
        <h2 className="mb-2 text-xs font-bold uppercase tracking-widest text-neutral-400">GeneSight Graph</h2>
        <SearchBar onSelectResult={onSelectResult} />
      </div>
      <NodeTypeFilters />
      <RelationshipFilters />
      <DisplayControls />
      <GraphStatsBar />
    </aside>
  )
}
