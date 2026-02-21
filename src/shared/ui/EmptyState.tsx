interface EmptyStateProps {
  title: string
  description?: string
  icon?: React.ReactNode
}

export function EmptyState({ title, description, icon }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center rounded-xl border border-brown-200 bg-white p-12 text-center">
      {icon && <div className="mb-4 text-4xl text-stone-400">{icon}</div>}
      <p className="text-lg font-semibold text-stone-800">{title}</p>
      {description && <p className="mt-2 text-stone-600">{description}</p>}
    </div>
  )
}
