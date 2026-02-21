export function SkeletonCard() {
  return (
    <div className="overflow-hidden rounded-xl border border-brown-200 bg-white">
      <div className="aspect-[2/3] animate-pulse bg-brown-100" />
      <div className="space-y-2 p-3">
        <div className="h-4 w-3/4 animate-pulse rounded bg-brown-100" />
        <div className="h-3 w-1/3 animate-pulse rounded bg-brown-100" />
      </div>
    </div>
  )
}
