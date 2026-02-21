import { useEffect, useRef } from 'react'

interface InfiniteLoaderSentinelProps {
  onIntersect: () => void
  hasMore: boolean
  isLoading: boolean
}

export function InfiniteLoaderSentinel({
  onIntersect,
  hasMore,
  isLoading,
}: InfiniteLoaderSentinelProps) {
  const sentinelRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!hasMore || isLoading) return

    const el = sentinelRef.current
    if (!el) return

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          onIntersect()
        }
      },
      { rootMargin: '200px', threshold: 0 }
    )

    observer.observe(el)
    return () => observer.disconnect()
  }, [onIntersect, hasMore, isLoading])

  if (!hasMore) return null

  return (
    <div ref={sentinelRef} className="flex justify-center py-8">
      {isLoading && (
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-lavender-500 border-t-transparent" />
      )}
    </div>
  )
}
