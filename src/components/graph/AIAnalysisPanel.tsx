import { useEffect, useState } from 'react'
import { runAgentPipeline, type AgentStep } from '../../services/aiAnalysisService'
import { useGraphActions, useGraphState } from '../../state/GraphStateContext'

function StatusIndicator({ status, index }: { status: AgentStep['status']; index: number }) {
  if (status === 'done') {
    return (
      <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-emerald-500/15 text-emerald-400">
        <svg viewBox="0 0 20 20" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M4 10l4 4 8-8" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </span>
    )
  }
  if (status === 'running') {
    return (
      <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-sky-500/15">
        <span className="h-3 w-3 animate-spin rounded-full border-2 border-sky-900 border-t-sky-400" />
      </span>
    )
  }
  return (
    <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-neutral-800 text-[10px] font-medium text-neutral-500">
      {index + 1}
    </span>
  )
}

const STATUS_LABEL: Record<AgentStep['status'], string> = {
  pending: 'Queued',
  running: 'Running…',
  done: 'Complete',
}

export function AIAnalysisPanel() {
  const { state, selectedNode } = useGraphState()
  const { setAiPanelOpen } = useGraphActions()
  const [steps, setSteps] = useState<AgentStep[]>([])
  const [running, setRunning] = useState(false)

  useEffect(() => {
    if (!state.aiPanelOpen || !selectedNode) {
      setSteps([])
      return
    }
    let cancelled = false
    setRunning(true)
    runAgentPipeline(selectedNode, (update) => {
      if (!cancelled) setSteps(update)
    }).finally(() => {
      if (!cancelled) setRunning(false)
    })
    return () => {
      cancelled = true
    }
  }, [state.aiPanelOpen, selectedNode])

  if (!state.aiPanelOpen || !selectedNode) return null

  const rerun = () => {
    setRunning(true)
    runAgentPipeline(selectedNode, setSteps).finally(() => setRunning(false))
  }

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="flex max-h-[85vh] w-[600px] flex-col overflow-hidden rounded-lg border border-neutral-800 bg-neutral-950 shadow-2xl">
        <div className="flex items-center justify-between border-b border-neutral-800 px-5 py-3.5">
          <div>
            <div className="flex items-center gap-2 text-sm font-semibold text-neutral-50">
              <span className="h-1.5 w-1.5 rounded-full bg-sky-400" />
              AI Research Analysis — Agent Pipeline
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
          <div className="mb-4 inline-flex items-center gap-1.5 rounded-full border border-amber-800/50 bg-amber-950/30 px-2.5 py-1 text-[10px] font-medium uppercase tracking-wide text-amber-400">
            Mock / demo pipeline — not real scientific analysis
          </div>

          <ol className="space-y-0">
            {steps.map((step, i) => (
              <li key={step.id} className="relative pb-5 pl-0 last:pb-0">
                {i < steps.length - 1 && (
                  <span className="absolute left-3 top-6 h-[calc(100%-8px)] w-px bg-neutral-800" aria-hidden />
                )}
                <div className="flex items-start gap-3">
                  <StatusIndicator status={step.status} index={i} />
                  <div className="min-w-0 flex-1">
                    <div className="flex items-baseline justify-between gap-2">
                      <span className="text-sm font-medium text-neutral-100">{step.name}</span>
                      <span
                        className={`shrink-0 text-[10px] uppercase tracking-wide ${
                          step.status === 'done'
                            ? 'text-emerald-500'
                            : step.status === 'running'
                              ? 'text-sky-400'
                              : 'text-neutral-600'
                        }`}
                      >
                        {STATUS_LABEL[step.status]}
                      </span>
                    </div>
                    <div className="text-xs text-neutral-500">{step.role}</div>

                    {step.status === 'done' && step.points.length > 0 && (
                      <ul className="mt-2 space-y-1 rounded border border-neutral-800 bg-neutral-900/60 p-2.5">
                        {step.points.map((p) => (
                          <li key={p} className="flex gap-2 text-xs leading-relaxed text-neutral-300">
                            <span className="mt-1 h-1 w-1 shrink-0 rounded-full bg-neutral-600" />
                            {p}
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                </div>
              </li>
            ))}
          </ol>
        </div>

        <div className="flex justify-end border-t border-neutral-800 px-5 py-3.5">
          <button
            onClick={rerun}
            disabled={running}
            className="rounded border border-neutral-700 bg-neutral-900 px-3 py-1.5 text-xs font-medium text-neutral-200 hover:border-neutral-500 hover:bg-neutral-800 disabled:opacity-40"
          >
            {running ? 'Pipeline running…' : 'Re-run Pipeline'}
          </button>
        </div>
      </div>
    </div>
  )
}
