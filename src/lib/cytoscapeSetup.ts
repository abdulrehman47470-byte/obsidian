import cytoscape from 'cytoscape'
import dagre from 'cytoscape-dagre'
import cola from 'cytoscape-cola'

let registered = false

// Registers layout extensions exactly once regardless of how many times
// GraphCanvas mounts (React StrictMode double-invokes effects in dev).
export function ensureCytoscapeExtensionsRegistered() {
  if (registered) return
  cytoscape.use(dagre)
  cytoscape.use(cola)
  registered = true
}
