/**
 * Maps API/network errors to user-friendly Chinese messages.
 */

const ERROR_MAP: Record<string, string> = {
  'Invalid API key': 'API 設定錯誤，請聯絡管理員。',
  'VITE_TMDB_API_KEY is not set. Add it to your .env file.':
    'API 設定錯誤，請聯絡管理員。',
  'Not found': '找不到此項目，可能已被移除。',
  'Rate limit exceeded': '請求過於頻繁，請稍後再試。',
  'Server error': '伺服器暫時無法回應，請稍後再試。',
  'Failed to fetch': '無法連線，請檢查網路後重試。',
  'Load failed': '無法連線，請檢查網路後重試。',
  NetworkError: '無法連線，請檢查網路後重試。',
}

const NETWORK_PATTERNS = [
  /network/i,
  /fetch/i,
  /connection/i,
  /timeout/i,
  /aborted/i,
]

export function getFriendlyErrorMessage(error: unknown): string {
  const message =
    error instanceof Error ? error.message : String(error ?? 'Unknown error')

  // Direct match
  const mapped = ERROR_MAP[message]
  if (mapped) return mapped

  // Network-related patterns
  if (NETWORK_PATTERNS.some((p) => p.test(message))) {
    return '無法連線，請檢查網路後重試。'
  }

  // HTTP status patterns
  if (/401|Unauthorized/i.test(message)) return 'API 設定錯誤，請聯絡管理員。'
  if (/404|Not Found/i.test(message)) return '找不到此項目，可能已被移除。'
  if (/429|rate limit/i.test(message)) return '請求過於頻繁，請稍後再試。'
  if (/5\d{2}/.test(message)) return '伺服器暫時無法回應，請稍後再試。'

  // Fallback: don't expose raw error to user
  return '發生錯誤，請稍後再試。'
}
