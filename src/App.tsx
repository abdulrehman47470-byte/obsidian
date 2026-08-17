import { lazy, Suspense } from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Home from './pages/Home'

const GraphPage = lazy(() => import('./pages/GraphPage').then((m) => ({ default: m.GraphPage })))

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route
          path="/graph"
          element={
            <Suspense
              fallback={
                <div className="flex h-screen w-full items-center justify-center bg-neutral-950 text-sm text-neutral-500">
                  Loading graph workspace…
                </div>
              }
            >
              <GraphPage />
            </Suspense>
          }
        />
      </Routes>
    </BrowserRouter>
  )
}
