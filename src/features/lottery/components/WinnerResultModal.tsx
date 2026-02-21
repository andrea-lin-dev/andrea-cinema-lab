import { Link } from 'react-router-dom'
import { getImageUrl } from '@/shared/api/raw/client'
import type { MovieSummary } from '@/shared/types/domain'

interface WinnerResultModalProps {
  winner: MovieSummary
  onClose: () => void
  onCloseLottery?: () => void
}

export function WinnerResultModal({
  winner,
  onClose,
  onCloseLottery,
}: WinnerResultModalProps) {
  return (
    <div
      className="absolute inset-0 z-10 flex items-center justify-center rounded-2xl bg-stone-900/85 p-4"
      onClick={(e) => e.target === e.currentTarget && onClose()}
      role="dialog"
      aria-modal="true"
      aria-labelledby="winner-title"
    >
      <div
        className="relative flex min-w-[400px] max-w-sm flex-col items-center rounded-2xl border border-brown-200 bg-white p-6 text-center shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={onClose}
          className="absolute right-4 top-4 rounded-full p-2 text-stone-500 transition-colors hover:bg-brown-200 hover:text-stone-800"
          aria-label="關閉"
        >
          <svg
            className="h-5 w-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>

        <p id="winner-title" className="text-sm text-stone-500">
          今晚就看這部！
        </p>
        <div className="relative mt-3 aspect-[2/3] w-40 overflow-hidden rounded-xl bg-brown-100">
          {getImageUrl(winner.posterPath, 'w342') ? (
            <img
              src={getImageUrl(winner.posterPath, 'w342') ?? ''}
              alt={winner.title}
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-stone-400">
              無海報
            </div>
          )}
        </div>
        <p className="mt-3 text-xl font-bold text-stone-800">{winner.title}</p>
        <div className="mt-3 flex items-center justify-center gap-2">
          <Link
            to={`/movie/${winner.id}`}
            onClick={() => {
              onClose()
              onCloseLottery?.()
            }}
            className="inline-block rounded-lg bg-lavender-500 px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-lavender-600"
          >
            查看詳情
          </Link>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg border border-stone-200 bg-stone-100 p-2 text-stone-400 transition-colors hover:bg-stone-200 hover:text-stone-500"
            aria-label="關閉"
          >
            <svg
              className="h-4 w-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>
      </div>
    </div>
  )
}
