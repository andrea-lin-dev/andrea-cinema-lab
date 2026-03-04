/**
 * Mock API error responses for demo.
 *
 * Simulates API returning wrong shape:
 * - Search: root is array instead of object (expected { page, results, ... })
 * - Movie detail: credits root is array instead of object (expected { cast, crew })
 *
 * Enable with VITE_DEMO_API_ERROR=true in .env
 */

/** Search API 預期回傳 { page, total_pages, results: [...] }，此 mock 回傳 array 當 root */
export const searchErrorResponse = [
  {
    id: 1,
    title: 'Fake Movie',
    poster_path: '/fake.jpg',
    release_date: '2024-01-01',
    vote_average: 8,
    overview: 'This should not appear - API returned array instead of object.',
  },
]

/** Credits API 預期回傳 { cast: [...], crew: [...] }，此 mock 回傳 array 當 root */
export const creditsErrorResponse = [
  { id: 1, name: 'Actor One', character: 'Hero', profile_path: null },
  { id: 2, name: 'Actor Two', character: 'Villain', profile_path: null },
]

/** 另一種錯誤：results 預期是 array，此 mock 回傳 object */
export const searchErrorResponseObjectInsteadOfArray = {
  page: 1,
  total_pages: 10,
  total_results: 100,
  results: {
    error: 'API returned object instead of array',
    code: 'MALFORMED_RESPONSE',
  },
}
