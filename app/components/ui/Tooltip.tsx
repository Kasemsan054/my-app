import React, { ReactNode } from 'react'

interface TooltipProps {
  content: ReactNode
  children: ReactNode
  position?: 'top' | 'bottom' | 'left' | 'right'
  align?: 'center' | 'left' | 'right'
  className?: string
  wrapperClassName?: string
}

export function Tooltip({
  content,
  children,
  position = 'top',
  align = 'center',
  className = '',
  wrapperClassName = ''
}: TooltipProps) {

  let posClass = ''
  let arrowClass = ''

  if (position === 'bottom') {
    if (align === 'right') {
      posClass = 'top-full right-0 mt-2'
      arrowClass = 'bottom-full right-4 border-b-slate-900 border-l-transparent border-r-transparent border-t-transparent'
    } else if (align === 'left') {
      posClass = 'top-full left-0 mt-2'
      arrowClass = 'bottom-full left-4 border-b-slate-900 border-l-transparent border-r-transparent border-t-transparent'
    } else {
      posClass = 'top-full left-1/2 -translate-x-1/2 mt-2'
      arrowClass = 'bottom-full left-1/2 -translate-x-1/2 border-b-slate-900 border-l-transparent border-r-transparent border-t-transparent'
    }
  } else if (position === 'top') {
    if (align === 'right') {
      posClass = 'bottom-full right-0 mb-2'
      arrowClass = 'top-full right-4 border-t-slate-900 border-l-transparent border-r-transparent border-b-transparent'
    } else if (align === 'left') {
      posClass = 'bottom-full left-0 mb-2'
      arrowClass = 'top-full left-4 border-t-slate-900 border-l-transparent border-r-transparent border-b-transparent'
    } else {
      posClass = 'bottom-full left-1/2 -translate-x-1/2 mb-2'
      arrowClass = 'top-full left-1/2 -translate-x-1/2 border-t-slate-900 border-l-transparent border-r-transparent border-b-transparent'
    }
  } else if (position === 'left') {
    posClass = 'right-full top-1/2 -translate-y-1/2 mr-2'
    arrowClass = 'left-full top-1/2 -translate-y-1/2 border-l-slate-900 border-t-transparent border-b-transparent border-r-transparent'
  } else if (position === 'right') {
    posClass = 'left-full top-1/2 -translate-y-1/2 ml-2'
    arrowClass = 'right-full top-1/2 -translate-y-1/2 border-r-slate-900 border-t-transparent border-b-transparent border-l-transparent'
  }

  // Smooth animation scale & fade
  const animations = {
    top: 'translate-y-1 group-hover:translate-y-0 scale-95 group-hover:scale-100',
    bottom: '-translate-y-1 group-hover:translate-y-0 scale-95 group-hover:scale-100',
    left: 'translate-x-1 group-hover:translate-x-0 scale-95 group-hover:scale-100',
    right: '-translate-x-1 group-hover:translate-x-0 scale-95 group-hover:scale-100',
  }

  return (
    <div className={`relative group inline-flex ${wrapperClassName}`}>
      {children}
      <div 
        className={`absolute z-50 pointer-events-none invisible opacity-0 group-hover:visible group-hover:opacity-100 transition-all duration-200 ease-out ${posClass} ${animations[position]} ${className}`}
      >
        <div className="bg-slate-900/95 backdrop-blur-md text-white text-[11px] font-semibold py-1.5 px-3 rounded-xl shadow-2xl shadow-slate-950/40 border border-slate-700/80 whitespace-nowrap tracking-wide">
          {content}
        </div>
        {/* Arrow */}
        <div className={`absolute border-[5px] ${arrowClass} h-0 w-0`}></div>
      </div>
    </div>
  )
}
