import { useEffect, useRef } from 'react'
import { GraphCanvas, type GraphCanvasHandle } from '../components/graph/GraphCanvas'
import { GraphSidebar } from '../components/graph/GraphSidebar'
import { GraphToolbar } from '../components/graph/GraphToolbar'
import { NodeDetailsPanel } from '../components/graph/NodeDetailsPanel'
import { EvidencePanel } from '../components/graph/EvidencePanel'
import { AIAnalysisPanel } from '../components/graph/AIAnalysisPanel'
import { GraphStateProvider, useDatasetLoader, useGraphActions, useGraphState } from '../state/GraphStateContext'
import { getGraph } from '../services/graphService'
import type { NodeType } from '../types/graph'

function GraphPageInner() {
  const canvasRef = useRef<GraphCanvasHandle>(null)
  const loadDataset = useDatasetLoader()
  const { state, selectedNode, selectedEdge } = useGraphState()
  const { selectNode, setFocusMode, setEnabledNodeTypes } = useGraphActions()

  useEffect(() => {
    getGraph().then(loadDataset)
  }, [loadDataset])

  const handleSelectAndCenter = (nodeId: string) => {
    selectNode(nodeId)
    requestAnimationFrame(() => canvasRef.current?.centerOnNode(nodeId))
  }

  const handleExploreConnections = () => {
    setFocusMode(true)
    if (selectedNode) requestAnimationFrame(() => canvasRef.current?.centerOnNode(selectedNode.id))
  }

  const handleFilterToType = (type: NodeType) => {
    if (!selectedNode) return
    setEnabledNodeTypes(new Set<NodeType>([selectedNode.type, type]))
    setFocusMode(true)
  }

  const focusSearchInput = () => {
    document.getElementById('graph-search-input')?.focus()
  }

  return (
    <div className="flex h-screen w-full overflow-hidden bg-neutral-950 text-neutral-100">
      <GraphSidebar onSelectResult={handleSelectAndCenter} />

      <main className="relative min-w-0 flex-1">
        {state.loading ? (
          <div className="flex h-full items-center justify-center text-sm text-neutral-500">
            Loading biomedical knowledge graph…
          </div>
        ) : (
          <>
            <GraphCanvas ref={canvasRef} />
            <GraphToolbar canvasRef={canvasRef} onFocusSearch={focusSearchInput} />
          </>
        )}
      </main>

      {selectedNode && (
        <NodeDetailsPanel onExploreConnections={handleExploreConnections} onFilterToType={handleFilterToType} />
      )}
      {selectedEdge && <EvidencePanel />}
      <AIAnalysisPanel />
    </div>
  )
}

export function GraphPage() {
  return (
    <GraphStateProvider>
      <GraphPageInner />
    </GraphStateProvider>
  )
}
