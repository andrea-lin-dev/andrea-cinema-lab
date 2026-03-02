import { useCallback } from 'react'

interface SearchBarProps {
  value: string
  onChange: (value: string) => void
  onSearch?: (value: string) => void
  placeholder?: string
  submitLabel?: string
}

export function SearchBar({
  value,
  onChange,
  onSearch,
  placeholder = '搜尋電影...',
  submitLabel = '搜尋電影',
}: SearchBarProps) {
  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault()
      onSearch?.(value.trim())
    },
    [value, onSearch]
  )

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-xl">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <input
          type="search"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          aria-label={placeholder}
          className="w-full rounded-xl border border-neutral-200 bg-white px-4 py-3 text-stone-800 placeholder-stone-400 focus:border-accent-500 focus:outline-none focus:ring-2 focus:ring-accent-200"
        />
        <button
          type="submit"
          className="shrink-0 rounded-xl bg-accent-500 px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-accent-600"
        >
          {submitLabel}
        </button>
      </div>
    </form>
  )
}
