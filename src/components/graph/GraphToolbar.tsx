import type { RefObject } from 'react'
import type { GraphCanvasHandle } from './GraphCanvas'
import { useGraphActions, useGraphState } from '../../state/GraphStateContext'
import type { LayoutName } from '../../types/graph'

const LAYOUTS: Array<{ value: LayoutName; label: string }> = [
  { value: 'force-directed', label: 'Force Directed' },
  { value: 'hierarchical', label: 'Hierarchical' },
  { value: 'circular', label: 'Circular' },
  { value: 'concentric', label: 'Concentric' },
]

interface GraphToolbarProps {
  canvasRef: RefObject<GraphCanvasHandle | null>
  onFocusSearch: () => void
}

function ToolbarButton({ onClick, title, children }: { onClick: () => void; title: string; children: React.ReactNode }) {
  return (
    <button
      onClick={onClick}
      title={title}
      className="flex h-8 w-8 items-center justify-center rounded text-neutral-300 transition-colors hover:bg-neutral-800 hover:text-neutral-50"
    >
      {children}
    </button>
  )
}

export function GraphToolbar({ canvasRef, onFocusSearch }: GraphToolbarProps) {
  const { state, selectedNode } = useGraphState()
  const { setLayout } = useGraphActions()

  return (
    <div className="absolute bottom-4 left-1/2 z-10 flex -translate-x-1/2 items-center gap-1 rounded-lg border border-neutral-800 bg-neutral-900/95 px-1.5 py-1.5 shadow-xl backdrop-blur">
      <ToolbarButton title="Zoom in" onClick={() => canvasRef.current?.zoomIn()}>
        <svg viewBox="0 0 20 20" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.6">
          <circle cx="9" cy="9" r="6.5" />
          <path d="M14 14L18 18M6.5 9h5M9 6.5v5" strokeLinecap="round" />
        </svg>
      </ToolbarButton>
      <ToolbarButton title="Zoom out" onClick={() => canvasRef.current?.zoomOut()}>
        <svg viewBox="0 0 20 20" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.6">
          <circle cx="9" cy="9" r="6.5" />
          <path d="M14 14L18 18M6.5 9h5" strokeLinecap="round" />
        </svg>
      </ToolbarButton>
      <ToolbarButton title="Fit graph" onClick={() => canvasRef.current?.fit()}>
        <svg viewBox="0 0 20 20" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.6">
          <path d="M3 7V3h4M17 7V3h-4M3 13v4h4M17 13v4h-4" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </ToolbarButton>
      <ToolbarButton title="Reset layout" onClick={() => canvasRef.current?.resetLayout()}>
        <svg viewBox="0 0 20 20" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.6">
          <path
            d="M15.5 6.5A6 6 0 1 0 16.9 11"
            strokeLinecap="round"
          />
          <path d="M16 3v4h-4" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </ToolbarButton>
      <ToolbarButton
        title="Center selected"
        onClick={() => selectedNode && canvasRef.current?.centerOnNode(selectedNode.id)}
      >
        <svg viewBox="0 0 20 20" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.6">
          <circle cx="10" cy="10" r="2" fill="currentColor" stroke="none" />
          <circle cx="10" cy="10" r="7" />
        </svg>
      </ToolbarButton>
      <ToolbarButton title="Search" onClick={onFocusSearch}>
        <svg viewBox="0 0 20 20" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.6">
          <circle cx="8.5" cy="8.5" r="5.5" />
          <path d="M16 16l-3.5-3.5" strokeLinecap="round" />
        </svg>
      </ToolbarButton>

      <div className="mx-1 h-5 w-px bg-neutral-800" />

      <select
        value={state.layout}
        onChange={(e) => setLayout(e.target.value as LayoutName)}
        className="h-8 rounded bg-neutral-800 px-2 text-xs text-neutral-200 outline-none"
        title="Graph layout"
      >
        {LAYOUTS.map((l) => (
          <option key={l.value} value={l.value}>
            {l.label}
          </option>
        ))}
      </select>
    </div>
  )
}
