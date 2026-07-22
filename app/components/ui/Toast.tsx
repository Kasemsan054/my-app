"use client"

import { useEffect } from 'react'
import { CheckCircle2, AlertCircle, X } from 'lucide-react'

interface ToastProps {
  message: string
  type?: 'success' | 'error'
  duration?: number
  onClose: () => void
}

export function Toast({ message, type = 'success', duration = 10000, onClose }: ToastProps) {
  useEffect(() => {
    if (duration <= 0) return
    const timer = setTimeout(() => {
      onClose()
    }, duration)
    return () => clearTimeout(timer)
  }, [duration, message, onClose])

  return (
    <div className="fixed top-8 left-1/2 -translate-x-1/2 z-[100] max-w-lg w-[94%] sm:w-auto animate-in slide-in-from-top-12 fade-in duration-500 delay-100 ease-out pointer-events-auto">
      <div className={`
        relative overflow-hidden flex items-center gap-4 py-4.5 px-6 sm:px-7 rounded-3xl shadow-2xl border backdrop-blur-xl transition-all duration-300
        ${type === 'success'
          ? 'bg-emerald-50/95 border-emerald-200/90 text-emerald-950 shadow-emerald-500/10'
          : 'bg-rose-50/95 border-rose-200/90 text-rose-950 shadow-rose-500/10'
        }
      `}>
        {type === 'success' ? (
          <div className="p-2 rounded-2xl bg-emerald-100/80 text-emerald-600 shrink-0">
            <CheckCircle2 size={24} />
          </div>
        ) : (
          <div className="p-2 rounded-2xl bg-rose-100/80 text-rose-600 shrink-0">
            <AlertCircle size={24} />
          </div>
        )}

        <span className="text-base font-bold text-slate-800 pr-2 leading-snug">
          {message}
        </span>

        <button
          onClick={onClose}
          type="button"
          className="p-2 hover:bg-slate-200/60 text-slate-400 hover:text-slate-700 rounded-2xl transition-colors ml-auto shrink-0 cursor-pointer"
          title="ปิดการแจ้งเตือน"
        >
          <X size={18} />
        </button>

        {/* Cooldown Progress bar */}
        {duration > 0 && (
          <div
            className={`absolute bottom-0 left-0 h-1.5 ${
              type === 'success' ? 'bg-emerald-400/80' : 'bg-rose-400/80'
            }`}
            style={{
              animation: `toast-progress ${duration}ms linear forwards`
            }}
          />
        )}
      </div>
    </div>
  )
}
