export function formatRuntime(minutes: number | null): string {
  if (minutes == null || minutes <= 0) return ''
  const h = Math.floor(minutes / 60)
  const m = minutes % 60
  if (h === 0) return `${m}m`
  return `${h}h ${m}m`
}

export function formatYear(dateStr: string | null): string {
  if (!dateStr) return ''
  const year = dateStr.slice(0, 4)
  return /^\d{4}$/.test(year) ? year : ''
}

export function formatRating(voteAverage: number): string {
  if (voteAverage <= 0) return '—'
  return voteAverage.toFixed(1)
}
