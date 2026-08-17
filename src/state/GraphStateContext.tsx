import { createContext, useCallback, useContext, useMemo, useReducer, type ReactNode } from 'react'
import type { GraphDataset, GraphEdge, GraphNode, LayoutName, NodeType, RelationshipType } from '../types/graph'
import { NODE_TYPES, RELATIONSHIP_TYPES } from '../types/graph'
import { bfsWithinHops, computeDegrees } from '../lib/graphMath'

interface GraphState {
  dataset: GraphDataset
  loading: boolean
  enabledNodeTypes: Set<NodeType>
  enabledRelationships: Set<RelationshipType>
  searchQuery: string
  selectedNodeId: string | null
  selectedEdgeId: string | null
  hoveredNodeId: string | null
  layout: LayoutName
  focusMode: boolean
  hopDepth: 1 | 2 | 3
  aiPanelOpen: boolean
  showEdgeLabels: boolean
}

type Action =
  | { type: 'SET_DATASET'; dataset: GraphDataset }
  | { type: 'SET_LOADING'; loading: boolean }
  | { type: 'TOGGLE_NODE_TYPE'; nodeType: NodeType }
  | { type: 'SET_ENABLED_NODE_TYPES'; nodeTypes: Set<NodeType> }
  | { type: 'TOGGLE_RELATIONSHIP'; relationship: RelationshipType }
  | { type: 'SET_SEARCH_QUERY'; query: string }
  | { type: 'SELECT_NODE'; nodeId: string | null }
  | { type: 'SELECT_EDGE'; edgeId: string | null }
  | { type: 'SET_HOVERED_NODE'; nodeId: string | null }
  | { type: 'SET_LAYOUT'; layout: LayoutName }
  | { type: 'SET_FOCUS_MODE'; focusMode: boolean }
  | { type: 'SET_HOP_DEPTH'; hopDepth: 1 | 2 | 3 }
  | { type: 'SET_AI_PANEL_OPEN'; open: boolean }
  | { type: 'SET_SHOW_EDGE_LABELS'; show: boolean }
  | { type: 'CLEAR_SELECTION' }

const initialState: GraphState = {
  dataset: { nodes: [], edges: [] },
  loading: true,
  enabledNodeTypes: new Set(NODE_TYPES),
  enabledRelationships: new Set(RELATIONSHIP_TYPES),
  searchQuery: '',
  selectedNodeId: null,
  selectedEdgeId: null,
  hoveredNodeId: null,
  layout: 'force-directed',
  focusMode: false,
  hopDepth: 1,
  aiPanelOpen: false,
  showEdgeLabels: false,
}

function reducer(state: GraphState, action: Action): GraphState {
  switch (action.type) {
    case 'SET_DATASET':
      return { ...state, dataset: action.dataset, loading: false }
    case 'SET_LOADING':
      return { ...state, loading: action.loading }
    case 'TOGGLE_NODE_TYPE': {
      const next = new Set(state.enabledNodeTypes)
      if (next.has(action.nodeType)) next.delete(action.nodeType)
      else next.add(action.nodeType)
      return { ...state, enabledNodeTypes: next }
    }
    case 'SET_ENABLED_NODE_TYPES':
      return { ...state, enabledNodeTypes: action.nodeTypes }
    case 'TOGGLE_RELATIONSHIP': {
      const next = new Set(state.enabledRelationships)
      if (next.has(action.relationship)) next.delete(action.relationship)
      else next.add(action.relationship)
      return { ...state, enabledRelationships: next }
    }
    case 'SET_SEARCH_QUERY':
      return { ...state, searchQuery: action.query }
    case 'SELECT_NODE':
      return {
        ...state,
        selectedNodeId: action.nodeId,
        selectedEdgeId: null,
        aiPanelOpen: action.nodeId ? state.aiPanelOpen : false,
      }
    case 'SELECT_EDGE':
      return { ...state, selectedEdgeId: action.edgeId, selectedNodeId: null }
    case 'SET_HOVERED_NODE':
      return { ...state, hoveredNodeId: action.nodeId }
    case 'SET_LAYOUT':
      return { ...state, layout: action.layout }
    case 'SET_FOCUS_MODE':
      return { ...state, focusMode: action.focusMode }
    case 'SET_HOP_DEPTH':
      return { ...state, hopDepth: action.hopDepth }
    case 'SET_AI_PANEL_OPEN':
      return { ...state, aiPanelOpen: action.open }
    case 'SET_SHOW_EDGE_LABELS':
      return { ...state, showEdgeLabels: action.show }
    case 'CLEAR_SELECTION':
      return { ...state, selectedNodeId: null, selectedEdgeId: null, aiPanelOpen: false }
    default:
      return state
  }
}

interface GraphStateContextValue {
  state: GraphState
  dispatch: React.Dispatch<Action>
  visibleDataset: GraphDataset
  selectedNode: GraphNode | null
  selectedEdge: GraphEdge | null
  nodesById: Map<string, GraphNode>
  fullDegrees: Map<string, number>
  maxDegree: number
}

const GraphStateContext = createContext<GraphStateContextValue | null>(null)

export function GraphStateProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, initialState)

  const nodesById = useMemo(() => new Map(state.dataset.nodes.map((n) => [n.id, n])), [state.dataset.nodes])

  const visibleDataset = useMemo<GraphDataset>(() => {
    let base = state.dataset

    if (state.focusMode && state.selectedNodeId) {
      base = bfsWithinHops(state.dataset, state.selectedNodeId, state.hopDepth)
    }

    const filteredNodes = base.nodes.filter((n) => state.enabledNodeTypes.has(n.type))
    const nodeIdSet = new Set(filteredNodes.map((n) => n.id))
    const filteredEdges = base.edges.filter(
      (e) => state.enabledRelationships.has(e.relationship) && nodeIdSet.has(e.source) && nodeIdSet.has(e.target),
    )
    return { nodes: filteredNodes, edges: filteredEdges }
  }, [state.dataset, state.enabledNodeTypes, state.enabledRelationships, state.focusMode, state.selectedNodeId, state.hopDepth])

  const selectedNode = state.selectedNodeId ? nodesById.get(state.selectedNodeId) ?? null : null
  const selectedEdge = state.selectedEdgeId ? state.dataset.edges.find((e) => e.id === state.selectedEdgeId) ?? null : null

  const fullDegrees = useMemo(() => computeDegrees(state.dataset.edges), [state.dataset.edges])
  const maxDegree = useMemo(() => Math.max(1, ...fullDegrees.values()), [fullDegrees])

  const value: GraphStateContextValue = {
    state,
    dispatch,
    visibleDataset,
    selectedNode,
    selectedEdge,
    nodesById,
    fullDegrees,
    maxDegree,
  }

  return <GraphStateContext.Provider value={value}>{children}</GraphStateContext.Provider>
}

export function useGraphState() {
  const ctx = useContext(GraphStateContext)
  if (!ctx) throw new Error('useGraphState must be used within GraphStateProvider')
  return ctx
}

export const useGraphActions = () => {
  const { dispatch } = useGraphState()
  return useMemo(
    () => ({
      toggleNodeType: (nodeType: NodeType) => dispatch({ type: 'TOGGLE_NODE_TYPE', nodeType }),
      setEnabledNodeTypes: (nodeTypes: Set<NodeType>) => dispatch({ type: 'SET_ENABLED_NODE_TYPES', nodeTypes }),
      toggleRelationship: (relationship: RelationshipType) => dispatch({ type: 'TOGGLE_RELATIONSHIP', relationship }),
      setSearchQuery: (query: string) => dispatch({ type: 'SET_SEARCH_QUERY', query }),
      selectNode: (nodeId: string | null) => dispatch({ type: 'SELECT_NODE', nodeId }),
      selectEdge: (edgeId: string | null) => dispatch({ type: 'SELECT_EDGE', edgeId }),
      setHoveredNode: (nodeId: string | null) => dispatch({ type: 'SET_HOVERED_NODE', nodeId }),
      setLayout: (layout: LayoutName) => dispatch({ type: 'SET_LAYOUT', layout }),
      setFocusMode: (focusMode: boolean) => dispatch({ type: 'SET_FOCUS_MODE', focusMode }),
      setHopDepth: (hopDepth: 1 | 2 | 3) => dispatch({ type: 'SET_HOP_DEPTH', hopDepth }),
      setAiPanelOpen: (open: boolean) => dispatch({ type: 'SET_AI_PANEL_OPEN', open }),
      setShowEdgeLabels: (show: boolean) => dispatch({ type: 'SET_SHOW_EDGE_LABELS', show }),
      clearSelection: () => dispatch({ type: 'CLEAR_SELECTION' }),
    }),
    [dispatch],
  )
}

export function useDatasetLoader() {
  const { dispatch } = useGraphState()
  return useCallback(
    (dataset: GraphDataset) => dispatch({ type: 'SET_DATASET', dataset }),
    [dispatch],
  )
}
