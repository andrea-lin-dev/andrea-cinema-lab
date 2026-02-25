import { useInfiniteQuery } from '@tanstack/react-query'
import { useMemo } from 'react'
import { searchMovies } from '@/shared/api/services/movieService'
import { sortMovies } from '@/shared/lib/sortMovies'
import type { WatchlistSortOption } from '@/shared/types/domain'

export function useSearchMovies(
  keyword: string,
  sortOption?: WatchlistSortOption
) {
  const query = useInfiniteQuery({
    queryKey: ['search', keyword, sortOption],
    queryFn: ({ pageParam, signal }) =>
      searchMovies(keyword, pageParam, signal),
    initialPageParam: 1,
    getNextPageParam: (last) => {
      if (last.page >= last.totalPages) return undefined
      return last.page + 1
    },
    enabled: keyword.length >= 2,
  })

  const allMovies = useMemo(() => {
    const movies = query.data?.pages.flatMap((p) => p.movies) ?? []
    if (sortOption) {
      return sortMovies(movies, sortOption)
    }
    return movies
  }, [query.data?.pages, sortOption])

  return {
    ...query,
    movies: allMovies,
    hasMore:
      (query.data?.pages.at(-1)?.page ?? 0) <
      (query.data?.pages.at(-1)?.totalPages ?? 0),
  }
}
