import { mockDataProvider } from './dataProvider/mockDataProvider'
import type { DataProvider } from './dataProvider/types'

// Single active provider. Swap this for a FastAPI/Neo4j-backed
// implementation of DataProvider once a real backend exists — no other
// file in the app imports the mock provider or dataset directly.
let activeProvider: DataProvider = mockDataProvider

export function setDataProvider(provider: DataProvider) {
  activeProvider = provider
}

export const getGraph: DataProvider['getGraph'] = (...args) => activeProvider.getGraph(...args)
export const searchEntities: DataProvider['searchEntities'] = (...args) => activeProvider.searchEntities(...args)
export const getNode: DataProvider['getNode'] = (...args) => activeProvider.getNode(...args)
export const getNeighbors: DataProvider['getNeighbors'] = (...args) => activeProvider.getNeighbors(...args)
export const getRelationships: DataProvider['getRelationships'] = (...args) => activeProvider.getRelationships(...args)
export const getGraphStatistics: DataProvider['getGraphStatistics'] = (...args) => activeProvider.getGraphStatistics(...args)
