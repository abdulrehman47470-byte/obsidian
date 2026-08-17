import type { Core, LayoutOptions, NodeSingular } from 'cytoscape'
import type { LayoutName } from '../types/graph'

export function layoutOptionsFor(name: LayoutName, cy: Core): LayoutOptions {
  switch (name) {
    case 'hierarchical':
      return {
        name: 'dagre',
        rankDir: 'TB',
        nodeSep: 36,
        rankSep: 90,
        edgeSep: 12,
        fit: true,
        padding: 40,
        animate: true,
        animationDuration: 400,
      } as LayoutOptions
    case 'circular':
      return {
        name: 'circle',
        fit: true,
        padding: 40,
        animate: true,
        animationDuration: 400,
        spacingFactor: 1.1,
      } as LayoutOptions
    case 'concentric':
      return {
        name: 'concentric',
        fit: true,
        padding: 40,
        animate: true,
        animationDuration: 400,
        minNodeSpacing: 24,
        concentric: (node: NodeSingular) => node.degree(false),
        levelWidth: () => 1,
      } as LayoutOptions
    case 'force-directed':
    default:
      return {
        name: 'cola',
        fit: true,
        padding: 40,
        animate: true,
        maxSimulationTime: cy.nodes().length > 300 ? 2500 : 1500,
        nodeSpacing: () => 8,
        edgeLength: 90,
        avoidOverlap: true,
        randomize: false,
      } as unknown as LayoutOptions
  }
}
