import cytoscape, { type Core, type NodeSingular } from 'cytoscape'
import { forwardRef, useEffect, useImperativeHandle, useRef, useState } from 'react'
import { ensureCytoscapeExtensionsRegistered } from '../../lib/cytoscapeSetup'
import { buildCytoscapeStyle } from '../../lib/cytoscapeStyle'
import { layoutOptionsFor } from '../../lib/layouts'
import { nodeSize } from '../../lib/graphMath'
import { NODE_VISUALS } from '../../lib/nodeVisuals'
import { useGraphActions, useGraphState } from '../../state/GraphStateContext'
import type { GraphNode } from '../../types/graph'

ensureCytoscapeExtensionsRegistered()

export interface GraphCanvasHandle {
  zoomIn: () => void
  zoomOut: () => void
  fit: () => void
  resetLayout: () => void
  centerOnNode: (id: string) => void
}

interface TooltipState {
  node: GraphNode
  x: number
  y: number
}

const ZOOM_LABEL_THRESHOLD = 1.35

export const GraphCanvas = forwardRef<GraphCanvasHandle>(function GraphCanvas(_props, ref) {
  const containerRef = useRef<HTMLDivElement>(null)
  const cyRef = useRef<Core | null>(null)
  const structureSignatureRef = useRef<string>('')
  const autoLabelsRef = useRef(false)
  const { state, visibleDataset, fullDegrees, maxDegree } = useGraphState()
  const { selectNode, selectEdge, clearSelection, setFocusMode } = useGraphActions()
  const [tooltip, setTooltip] = useState<TooltipState | null>(null)

  // Mount cytoscape once.
  useEffect(() => {
    if (!containerRef.current) return
    const cy = cytoscape({
      container: containerRef.current,
      elements: [],
      style: buildCytoscapeStyle(false),
      wheelSensitivity: 0.25,
      minZoom: 0.15,
      maxZoom: 3.5,
      layout: { name: 'preset' },
    })
    cyRef.current = cy
    // Force the element-sync effect to re-run layout against this fresh
    // instance, even if the visible dataset hasn't changed (e.g. after
    // React StrictMode's dev-mode double-mount destroys the first instance).
    structureSignatureRef.current = ''

    cy.on('tap', (evt) => {
      if (evt.target === cy) {
        clearSelection()
        setTooltip(null)
      }
    })
    cy.on('tap', 'node', (evt) => {
      selectNode(evt.target.id())
    })
    cy.on('tap', 'edge', (evt) => {
      selectEdge(evt.target.id())
    })
    cy.on('dbltap', 'node', (evt) => {
      const node = evt.target as NodeSingular
      selectNode(node.id())
      setFocusMode(true)
    })
    cy.on('mouseover', 'node', (evt) => {
      const node = evt.target as NodeSingular
      const pos = node.renderedPosition()
      const graphNode: GraphNode = {
        id: node.id(),
        label: node.data('label'),
        type: node.data('nodeType'),
        description: node.data('description'),
        importance: node.data('importance'),
      }
      setTooltip({ node: graphNode, x: pos.x, y: pos.y })
      containerRef.current?.style.setProperty('cursor', 'pointer')
    })
    cy.on('mouseout', 'node', () => {
      setTooltip(null)
      containerRef.current?.style.setProperty('cursor', 'default')
    })
    cy.on('drag', 'node', () => setTooltip(null))

    // Cytoscape sizes its canvas to the container at creation time and does
    // not observe layout changes on its own (e.g. the details/evidence
    // panel mounting and shrinking this container).
    const resizeObserver = new ResizeObserver(() => cy.resize())
    resizeObserver.observe(containerRef.current)

    return () => {
      resizeObserver.disconnect()
      cy.destroy()
      cyRef.current = null
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Sync elements when the visible (filtered) dataset changes.
  useEffect(() => {
    const cy = cyRef.current
    if (!cy) return

    const desiredNodeIds = new Set(visibleDataset.nodes.map((n) => n.id))
    const desiredEdgeIds = new Set(visibleDataset.edges.map((e) => e.id))

    cy.batch(() => {
      cy.nodes().forEach((n) => {
        if (!desiredNodeIds.has(n.id())) n.remove()
      })
      cy.edges().forEach((e) => {
        if (!desiredEdgeIds.has(e.id())) e.remove()
      })

      const existingNodeIds = new Set(cy.nodes().map((n) => n.id()))
      for (const n of visibleDataset.nodes) {
        if (!existingNodeIds.has(n.id)) {
          const degree = fullDegrees.get(n.id) ?? 0
          cy.add({
            group: 'nodes',
            data: {
              id: n.id,
              label: n.label,
              nodeType: n.type,
              description: n.description,
              importance: n.importance,
              size: nodeSize(degree, n.importance, maxDegree),
            },
          })
        }
      }

      const existingEdgeIds = new Set(cy.edges().map((e) => e.id()))
      for (const e of visibleDataset.edges) {
        if (!existingEdgeIds.has(e.id)) {
          cy.add({
            group: 'edges',
            data: {
              id: e.id,
              source: e.source,
              target: e.target,
              label: e.relationship.replace(/_/g, ' '),
              relationship: e.relationship,
              width: 1 + Math.min(3, (e.confidence ?? 0.5) * 3),
            },
          })
        }
      }
    })

    const signature = `${visibleDataset.nodes.length}:${visibleDataset.edges.length}:${state.layout}`
    if (structureSignatureRef.current !== signature) {
      structureSignatureRef.current = signature
      if (cy.nodes().length > 0) {
        cy.layout(layoutOptionsFor(state.layout, cy)).run()
      }
    }
  }, [visibleDataset, state.layout, fullDegrees, maxDegree])

  // Selection spotlight: highlight the selected node's neighborhood, dim the rest.
  useEffect(() => {
    const cy = cyRef.current
    if (!cy) return
    cy.batch(() => {
      cy.elements().removeClass('graph-highlighted graph-dimmed')
      if (state.selectedNodeId && cy.$id(state.selectedNodeId).nonempty()) {
        const node = cy.$id(state.selectedNodeId)
        const neighborhood = node.closedNeighborhood()
        cy.elements().difference(neighborhood).addClass('graph-dimmed')
        node.addClass('graph-highlighted')
        neighborhood.edges().addClass('graph-highlighted')
      }
    })
  }, [state.selectedNodeId, visibleDataset])

  // Search match highlighting.
  useEffect(() => {
    const cy = cyRef.current
    if (!cy) return
    cy.nodes().removeClass('graph-search-match')
    const q = state.searchQuery.trim().toLowerCase()
    if (q) {
      cy.nodes().forEach((n) => {
        if ((n.data('label') as string).toLowerCase().includes(q)) n.addClass('graph-search-match')
      })
    }
  }, [state.searchQuery, visibleDataset])

  // Zoom-driven edge label visibility, combined with the manual toggle.
  useEffect(() => {
    const cy = cyRef.current
    if (!cy) return

    const applyLabelState = () => {
      const shouldShow = state.showEdgeLabels || cy.zoom() >= ZOOM_LABEL_THRESHOLD
      if (shouldShow !== autoLabelsRef.current) {
        autoLabelsRef.current = shouldShow
        cy.style(buildCytoscapeStyle(shouldShow)).update()
      }
    }
    applyLabelState()
    cy.on('zoom', applyLabelState)
    return () => {
      cy.off('zoom', applyLabelState)
    }
  }, [state.showEdgeLabels])

  useImperativeHandle(ref, () => ({
    zoomIn: () => {
      const cy = cyRef.current
      if (!cy) return
      const renderedPosition = { x: cy.width() / 2, y: cy.height() / 2 }
      cy.animate({ zoom: { level: Math.min(cy.maxZoom(), cy.zoom() * 1.3), renderedPosition } }, { duration: 150 })
    },
    zoomOut: () => {
      const cy = cyRef.current
      if (!cy) return
      const renderedPosition = { x: cy.width() / 2, y: cy.height() / 2 }
      cy.animate({ zoom: { level: Math.max(cy.minZoom(), cy.zoom() / 1.3), renderedPosition } }, { duration: 150 })
    },
    fit: () => {
      const cy = cyRef.current
      if (!cy) return
      cy.animate({ fit: { eles: cy.elements(), padding: 40 } }, { duration: 350 })
    },
    resetLayout: () => {
      const cy = cyRef.current
      if (!cy) return
      cy.layout(layoutOptionsFor(state.layout, cy)).run()
    },
    centerOnNode: (id: string) => {
      const cy = cyRef.current
      if (!cy) return
      const el = cy.$id(id)
      if (el.empty()) return
      cy.animate({ center: { eles: el }, zoom: Math.max(cy.zoom(), 1.3) }, { duration: 400 })
    },
  }))

  return (
    <div ref={containerRef} className="relative h-full w-full bg-graph-canvas">
      {tooltip && (
        <div
          className="pointer-events-none absolute z-20 max-w-64 -translate-x-1/2 -translate-y-[calc(100%+14px)] rounded border border-neutral-700 bg-neutral-900/95 px-3 py-2 text-xs text-neutral-200 shadow-lg"
          style={{ left: tooltip.x, top: tooltip.y }}
        >
          <div className="flex items-center gap-1.5 font-medium text-neutral-50">
            <span
              className="inline-block h-2 w-2 rounded-full"
              style={{ backgroundColor: NODE_VISUALS[tooltip.node.type].color }}
            />
            {tooltip.node.label}
          </div>
          <div className="mt-0.5 text-[10px] uppercase tracking-wide text-neutral-500">
            {NODE_VISUALS[tooltip.node.type].label}
          </div>
          {tooltip.node.description && (
            <div className="mt-1 line-clamp-2 text-neutral-400">{tooltip.node.description}</div>
          )}
        </div>
      )}
    </div>
  )
})
