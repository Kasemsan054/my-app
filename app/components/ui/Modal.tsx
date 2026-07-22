"use client"

import { ReactNode } from 'react'
import { X, AlertTriangle } from 'lucide-react'

interface ModalProps {
  isOpen: boolean
  onClose: () => void
  title: string
  description?: string
  children?: ReactNode
  confirmLabel?: string
  confirmVariant?: 'danger' | 'primary'
  onConfirm?: () => void
  isLoading?: boolean
}

export function Modal({
  isOpen,
  onClose,
  title,
  description,
  children,
  confirmLabel,
  confirmVariant = 'primary',
  onConfirm,
  isLoading = false
}: ModalProps) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs transition-opacity animate-in fade-in duration-200"
        onClick={onClose}
      />

      {/* Modal Dialog */}
      <div className="bg-white rounded-3xl shadow-2xl border border-slate-100 w-full max-w-lg z-10 overflow-hidden max-h-[90vh] flex flex-col animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="p-4 sm:p-6 pb-4 border-b border-slate-100 flex items-start justify-between gap-4 shrink-0">
          <div className="flex items-center gap-3">
            {confirmVariant === 'danger' && (
              <div className="p-2.5 rounded-2xl bg-red-50 text-red-600 border border-red-100 shrink-0">
                <AlertTriangle size={20} />
              </div>
            )}
            <div>
              <h3 className="text-base sm:text-lg font-bold text-slate-900 leading-snug">{title}</h3>
              {description && <p className="text-xs text-slate-500 mt-0.5">{description}</p>}
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-xl transition-colors shrink-0 cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>

        {/* Content */}
        {children && <div className="p-4 sm:p-6 overflow-y-auto flex-1 custom-scrollbar">{children}</div>}

        {/* Footer actions if onConfirm provided */}
        {onConfirm && (
          <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-end gap-2 shrink-0">
            <button
              onClick={onClose}
              disabled={isLoading}
              className="px-4 py-2.5 rounded-xl text-sm font-semibold text-slate-600 hover:bg-slate-200/60 transition-colors cursor-pointer"
            >
              ยกเลิก
            </button>
            <button
              onClick={onConfirm}
              disabled={isLoading}
              className={`
                px-5 py-2.5 rounded-xl text-sm font-bold text-white shadow-sm transition-all cursor-pointer
                ${confirmVariant === 'danger' 
                  ? 'bg-red-600 hover:bg-red-700 shadow-red-500/20' 
                  : 'bg-slate-900 hover:bg-slate-800'
                }
                disabled:opacity-50
              `}
            >
              {isLoading ? 'กำลังดำเนินการ...' : (confirmLabel || 'ตกลง')}
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
