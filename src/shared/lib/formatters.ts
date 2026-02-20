export function formatYear(dateStr: string | null): string {
  if (!dateStr) return ''
  const year = dateStr.slice(0, 4)
  return /^\d{4}$/.test(year) ? year : ''
}

export function formatRating(voteAverage: number): string {
  if (voteAverage <= 0) return '—'
  return voteAverage.toFixed(1)
}
