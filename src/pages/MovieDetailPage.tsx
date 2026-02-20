import { useParams } from 'react-router-dom'

export function MovieDetailPage() {
  const { id } = useParams<{ id: string }>()
  return (
    <div className="min-h-[50vh] p-8">
      Movie detail page (blank) — ID: {id ?? '—'}
    </div>
  )
}
