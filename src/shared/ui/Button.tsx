import { forwardRef, type ButtonHTMLAttributes } from 'react'

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger'
  size?: 'sm' | 'md' | 'lg'
}

const variants = {
  primary:
    'bg-accent-500 text-white hover:bg-accent-600 focus:ring-accent-200',
  secondary:
    'border border-neutral-200 bg-white text-stone-700 hover:bg-neutral-50 focus:ring-accent-200',
  ghost:
    'bg-transparent text-stone-700 hover:bg-neutral-100 focus:ring-accent-200',
  danger: 'bg-red-600 text-white hover:bg-red-500 focus:ring-red-200',
}

const sizes = {
  sm: 'px-3 py-1.5 text-sm',
  md: 'px-4 py-2 text-base',
  lg: 'px-6 py-3 text-lg',
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = 'primary', size = 'md', className = '', ...props }, ref) => (
    <button
      ref={ref}
      className={`inline-flex items-center justify-center rounded-lg font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    />
  )
)

Button.displayName = 'Button'
