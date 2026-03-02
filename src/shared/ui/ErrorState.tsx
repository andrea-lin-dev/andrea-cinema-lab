interface ErrorStateProps {
  title?: string
  message?: string
  onRetry?: () => void
  retryLabel?: string
}

export function ErrorState({
  title = '發生錯誤',
  message = '無法載入內容，請稍後再試。',
  onRetry,
  retryLabel = '重試',
}: ErrorStateProps) {
  return (
    <div className="flex flex-col items-center justify-center rounded-xl border border-neutral-200 bg-white p-8 text-center shadow-sm">
      <span className="mb-3 text-4xl" role="img" aria-hidden>
        😕
      </span>
      <p className="text-lg font-semibold text-stone-800">{title}</p>
      <p className="mt-2 text-stone-600">{message}</p>
      {onRetry && (
        <button
          type="button"
          onClick={onRetry}
          className="mt-6 rounded-lg bg-accent-600 px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-accent-700"
        >
          {retryLabel}
        </button>
      )}
    </div>
  )
}
