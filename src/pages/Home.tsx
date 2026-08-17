import { Link } from 'react-router-dom'

export default function Home() {
  return (
    <div className="flex h-screen w-full flex-col items-center justify-center gap-6 bg-neutral-950 text-neutral-100">
      <div className="text-center">
        <div className="text-xs font-bold uppercase tracking-[0.3em] text-neutral-500">GeneSight</div>
        <h1 className="mt-2 text-3xl font-semibold text-neutral-50">Biomedical Research Intelligence</h1>
        <p className="mx-auto mt-2 max-w-md text-sm text-neutral-500">
          Explore genes, proteins, diseases, drugs, compounds, mutations, pathways, publications, and clinical trials
          as a connected knowledge graph.
        </p>
      </div>
      <Link
        to="/graph"
        className="rounded border border-neutral-700 bg-neutral-900 px-5 py-2.5 text-sm font-medium text-neutral-100 transition-colors hover:border-neutral-500 hover:bg-neutral-800"
      >
        Open Knowledge Graph →
      </Link>
    </div>
  )
}
