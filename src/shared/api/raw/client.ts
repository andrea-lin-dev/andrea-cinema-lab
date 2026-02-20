const TMDB_BASE = 'https://api.themoviedb.org/3'
const TMDB_IMAGE_BASE = 'https://image.tmdb.org/t/p'

export function getImageUrl(
  path: string | null,
  size: string = 'w500',
  type: 'poster' | 'backdrop' = 'poster'
): string | null {
  if (!path) return null
  return `${TMDB_IMAGE_BASE}/${type === 'backdrop' ? 'w1280' : size}${path}`
}

async function getApiKey(): Promise<string> {
  const key = import.meta.env.VITE_TMDB_API_KEY
  if (!key) {
    throw new Error('VITE_TMDB_API_KEY is not set. Add it to your .env file.')
  }
  return key
}

export interface FetchOptions {
  params?: Record<string, string | number | undefined>
  signal?: AbortSignal
}

export async function tmdbFetch<T>(
  endpoint: string,
  options: FetchOptions = {}
): Promise<T> {
  const apiKey = await getApiKey()
  const { params = {}, signal } = options

  const searchParams = new URLSearchParams({
    api_key: apiKey,
    language: 'en-US',
    ...Object.fromEntries(
      Object.entries(params).filter(([, v]) => v != null && v !== '') as [
        string,
        string,
      ][]
    ),
  })

  const url = `${TMDB_BASE}${endpoint}?${searchParams}`
  const response = await fetch(url, { signal })

  if (!response.ok) {
    if (response.status === 401) throw new Error('Invalid API key')
    if (response.status === 404) throw new Error('Not found')
    if (response.status === 429) throw new Error('Rate limit exceeded')
    if (response.status >= 500) throw new Error('Server error')
    throw new Error(`HTTP ${response.status}: ${response.statusText}`)
  }

  return response.json() as Promise<T>
}
