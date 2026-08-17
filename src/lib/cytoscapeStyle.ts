import type { StylesheetJsonBlock } from 'cytoscape'
import { NODE_VISUALS, RELATIONSHIP_COLOR, RELATIONSHIP_HIGHLIGHT_COLOR } from './nodeVisuals'
import { NODE_TYPES } from '../types/graph'

export function buildCytoscapeStyle(showEdgeLabels: boolean): StylesheetJsonBlock[] {
  const nodeTypeStyles: StylesheetJsonBlock[] = NODE_TYPES.map((type) => ({
    selector: `node[nodeType = "${type}"]`,
    style: {
      'background-color': NODE_VISUALS[type].color,
      shape: NODE_VISUALS[type].shape,
    },
  }))

  return [
    {
      selector: 'node',
      style: {
        label: 'data(label)',
        'font-size': 9,
        'font-family': 'Inter, ui-sans-serif, system-ui, sans-serif',
        color: '#cbd5e1',
        'text-valign': 'bottom',
        'text-margin-y': 4,
        'text-wrap': 'ellipsis',
        'text-max-width': '90px',
        width: 'data(size)',
        height: 'data(size)',
        'border-width': 1.5,
        'border-color': 'rgba(255,255,255,0.15)',
        'transition-property': 'background-color, border-color, opacity, width, height',
        'transition-duration': 120,
      },
    },
    ...nodeTypeStyles,
    {
      selector: 'node:selected',
      style: {
        'border-width': 3,
        'border-color': '#ffffff',
        'overlay-opacity': 0,
      },
    },
    {
      selector: 'node.graph-highlighted',
      style: {
        'border-width': 3,
        'border-color': '#e8b64c',
        'z-index': 999,
      },
    },
    {
      selector: 'node.graph-dimmed',
      style: {
        opacity: 0.15,
      },
    },
    {
      selector: 'node.graph-search-match',
      style: {
        'border-width': 3,
        'border-color': '#ffffff',
      },
    },
    {
      selector: 'edge',
      style: {
        width: 'data(width)',
        'line-color': RELATIONSHIP_COLOR,
        'target-arrow-color': RELATIONSHIP_COLOR,
        'target-arrow-shape': 'triangle',
        'arrow-scale': 0.7,
        'curve-style': 'bezier',
        opacity: 0.55,
        label: showEdgeLabels ? 'data(label)' : '',
        'font-size': 7,
        color: '#94a3b8',
        'text-rotation': 'autorotate',
        'text-background-color': '#0b0e14',
        'text-background-opacity': 0.85,
        'text-background-padding': '2px',
      },
    },
    {
      selector: 'edge.graph-highlighted',
      style: {
        'line-color': RELATIONSHIP_HIGHLIGHT_COLOR,
        'target-arrow-color': RELATIONSHIP_HIGHLIGHT_COLOR,
        opacity: 1,
        width: 2.5,
        'z-index': 998,
      },
    },
    {
      selector: 'edge.graph-dimmed',
      style: {
        opacity: 0.05,
      },
    },
    {
      selector: 'edge:selected',
      style: {
        'line-color': '#ffffff',
        'target-arrow-color': '#ffffff',
        opacity: 1,
        width: 2.5,
      },
    },
  ]
}
