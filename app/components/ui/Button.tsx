import { ButtonHTMLAttributes } from 'react'
import { Loader2 } from 'lucide-react'

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  loading?: boolean
  isLoading?: boolean
  variant?: 'primary' | 'secondary' | 'outline' | 'danger'
  icon?: React.ReactNode
}

export function Button({ 
  children, 
  loading, 
  isLoading,
  variant = 'primary', 
  icon, 
  className = '', 
  ...props 
}: ButtonProps) {
  const isSpinning = loading || isLoading

  const variantStyles = {
    primary: 'bg-slate-900 text-white shadow-xs hover:bg-slate-800 hover:-translate-y-0.5 focus:ring-4 focus:ring-slate-900/10',
    secondary: 'bg-blue-600 text-white shadow-xs hover:bg-blue-700 hover:-translate-y-0.5 focus:ring-4 focus:ring-blue-600/10',
    outline: 'bg-white border border-slate-300 text-slate-700 hover:bg-slate-50 hover:border-slate-400 focus:ring-4 focus:ring-slate-100',
    danger: 'bg-red-600 text-white shadow-xs hover:bg-red-700 hover:-translate-y-0.5 focus:ring-4 focus:ring-red-600/10'
  }

  return (
    <button 
      disabled={isSpinning || props.disabled}
      className={`
        group relative flex flex-row items-center justify-center gap-2.5 
        py-3 px-6 rounded-2xl font-semibold text-sm tracking-wide
        transition-all duration-200 ease-out outline-none cursor-pointer
        disabled:bg-slate-100 disabled:text-slate-400 disabled:shadow-none 
        disabled:cursor-not-allowed disabled:transform-none disabled:border border-slate-200/50
        ${variantStyles[variant]}
        ${className}
      `}
      {...props}
    >
      {isSpinning ? (
        <Loader2 size={18} className="animate-spin text-current shrink-0" />
      ) : (
        icon && <span className="transition-transform group-hover:scale-110 duration-200 shrink-0 flex items-center">{icon}</span>
      )}
      <span className="inline-flex flex-row items-center justify-center gap-2 shrink-0">{children}</span>
    </button>
  )
}