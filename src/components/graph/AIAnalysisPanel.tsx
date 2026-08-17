import { useEffect, useState } from 'react'
import { runAiAnalysis, type AiAnalysisResult } from '../../services/aiAnalysisService'
import { useGraphActions, useGraphState } from '../../state/GraphStateContext'

export function AIAnalysisPanel() {
  const { state, selectedNode } = useGraphState()
  const { setAiPanelOpen } = useGraphActions()
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<AiAnalysisResult | null>(null)

  useEffect(() => {
    if (!state.aiPanelOpen || !selectedNode) {
      setResult(null)
      return
    }
    let cancelled = false
    setLoading(true)
    runAiAnalysis(selectedNode).then((r) => {
      if (!cancelled) {
        setResult(r)
        setLoading(false)
      }
    })
    return () => {
      cancelled = true
    }
  }, [state.aiPanelOpen, selectedNode])

  if (!state.aiPanelOpen || !selectedNode) return null

  const rerun = () => {
    setLoading(true)
    runAiAnalysis(selectedNode).then((r) => {
      setResult(r)
      setLoading(false)
    })
  }

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="flex max-h-[80vh] w-[560px] flex-col overflow-hidden rounded-lg border border-neutral-800 bg-neutral-950 shadow-2xl">
        <div className="flex items-center justify-between border-b border-neutral-800 px-5 py-3.5">
          <div>
            <div className="flex items-center gap-2 text-sm font-semibold text-neutral-50">
              <span className="h-1.5 w-1.5 rounded-full bg-sky-400" />
              AI Research Analysis
            </div>
            <div className="mt-0.5 text-xs text-neutral-500">Analyzing: {selectedNode.label}</div>
          </div>
          <button
            onClick={() => setAiPanelOpen(false)}
            className="rounded p-1 text-neutral-500 hover:bg-neutral-800 hover:text-neutral-200"
          >
            <svg viewBox="0 0 20 20" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.6">
              <path d="M5 5l10 10M15 5L5 15" strokeLinecap="round" />
            </svg>
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-5 py-4">
          <div className="mb-3 inline-flex items-center gap-1.5 rounded-full border border-amber-800/50 bg-amber-950/30 px-2.5 py-1 text-[10px] font-medium uppercase tracking-wide text-amber-400">
            Mock / demo output — not a real scientific conclusion
          </div>

          {loading && (
            <div className="flex items-center gap-2 py-8 text-sm text-neutral-500">
              <span className="h-3 w-3 animate-spin rounded-full border-2 border-neutral-700 border-t-sky-400" />
              Running analysis…
            </div>
          )}

          {!loading && result && (
            <div className="space-y-4">
              <p className="text-sm leading-relaxed text-neutral-300">{result.summary}</p>
              {result.sections.map((section) => (
                <div key={section.title}>
                  <h4 className="mb-1.5 text-[11px] font-semibold uppercase tracking-wide text-neutral-500">
                    {section.title}
                  </h4>
                  <ul className="space-y-1">
                    {section.points.map((p) => (
                      <li key={p} className="flex gap-2 text-xs text-neutral-300">
                        <span className="mt-1 h-1 w-1 shrink-0 rounded-full bg-neutral-600" />
                        {p}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="flex flex-wrap gap-2 border-t border-neutral-800 px-5 py-3.5">
          <button
            onClick={rerun}
            className="rounded border border-neutral-700 bg-neutral-900 px-3 py-1.5 text-xs font-medium text-neutral-200 hover:border-neutral-500 hover:bg-neutral-800"
          >
            Generate Research Summary
          </button>
          <button
            onClick={rerun}
            className="rounded border border-neutral-700 bg-neutral-900 px-3 py-1.5 text-xs font-medium text-neutral-200 hover:border-neutral-500 hover:bg-neutral-800"
          >
            Find Therapeutic Candidates
          </button>
          <button
            onClick={rerun}
            className="rounded border border-neutral-700 bg-neutral-900 px-3 py-1.5 text-xs font-medium text-neutral-200 hover:border-neutral-500 hover:bg-neutral-800"
          >
            Find Supporting Papers
          </button>
        </div>
      </div>
    </div>
  )
}
