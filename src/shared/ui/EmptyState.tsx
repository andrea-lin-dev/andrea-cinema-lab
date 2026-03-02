interface EmptyStateProps {
  title: string
  description?: string
  icon?: React.ReactNode
}

export function EmptyState({ title, description, icon }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center rounded-xl border border-neutral-200 bg-white p-8 text-center sm:p-12">
      {icon && (
        <div className="mb-4 text-3xl text-stone-400 sm:text-4xl">{icon}</div>
      )}
      <p className="text-md font-semibold text-stone-800 sm:text-lg">{title}</p>
      {description && (
        <p className="mt-2 text-sm text-stone-600 sm:text-base">
          {description}
        </p>
      )}
    </div>
  )
}
