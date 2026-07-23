"use client"

import React from 'react'
import { Wand2, Check, Copy, History, Trash2 } from 'lucide-react'
import { HistoryItem, TemplateId, SentenceData } from '../types'

interface GeneratedOutputPanelProps {
  activeTemplate: TemplateId
  generatedText: string
  copied: boolean
  handleCopyAll: () => void
  history: HistoryItem[]
  clearHistory: () => void
  setFormData: React.Dispatch<React.SetStateAction<SentenceData>>
  formData: SentenceData
}

export default function GeneratedOutputPanel({
  activeTemplate,
  generatedText,
  copied,
  handleCopyAll,
  history,
  clearHistory,
  setFormData,
  formData
}: GeneratedOutputPanelProps) {
  return (
    <div className="bg-white rounded-3xl p-6 md:p-8 border border-slate-200 shadow-sm space-y-6 sticky top-24">
      <div className="flex items-center justify-between border-b border-slate-100 pb-3">
        <div className="flex items-center gap-2 text-slate-900 font-extrabold text-base">
          <Wand2 className="text-brand-primary" size={20} /> 3. ข้อความสรุปที่ได้
        </div>
        <span className="text-xs bg-brand-primary-light text-brand-primary-hover border border-brand-primary-border px-2.5 py-1 rounded-xl font-bold">
          พร้อมใช้งาน
        </span>
      </div>

      {/* Generated Text Area Display */}
      <div className="relative space-y-1.5">
        <textarea
          readOnly={activeTemplate !== 'custom'}
          rows={13}
          value={generatedText}
          onChange={(e) => {
            if (activeTemplate === 'custom') {
              setFormData({ ...formData, customNotes: e.target.value })
            }
          }}
          className="w-full bg-slate-900 text-slate-100 p-4 rounded-2xl font-mono text-xs leading-relaxed outline-none shadow-inner resize-none border border-slate-800 select-text cursor-text focus:ring-2 focus:ring-blue-500/20"
        />
      </div>

      {/* Main Copy All Button */}
      <button
        type="button"
        onClick={handleCopyAll}
        className={`
          w-full py-3.5 px-6 rounded-2xl font-bold text-sm tracking-wide transition-all duration-200 shadow-lg flex items-center justify-center gap-2.5 cursor-pointer
          ${copied 
            ? 'bg-emerald-600 text-white shadow-emerald-600/30 scale-102' 
            : 'bg-brand-primary hover:bg-brand-primary-hover text-white shadow-brand-primary/30 hover:scale-[1.01]'
          }
        `}
      >
        {copied ? (
          <>
            <Check size={18} />
            คัดลอกสำเร็จ!
          </>
        ) : (
          <>
            <Copy size={18} />
            คัดลอกทั้งหมด (Copy All)
          </>
        )}
      </button>

      {/* History Recent Usage Drawer */}
      {history.length > 0 && (
        <div className="pt-4 border-t border-slate-100 space-y-3">
          <div className="flex items-center justify-between">
            <div className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
              <History size={14} /> ประวัติการสร้างล่าสุด
            </div>
            <button
              type="button"
              onClick={clearHistory}
              className="text-[11px] text-red-500 hover:underline cursor-pointer flex items-center gap-1 font-semibold"
            >
              <Trash2 size={12} /> ล้างประวัติ
            </button>
          </div>

          <div className="space-y-2 max-h-40 overflow-y-auto pr-1">
            {history.slice(0, 5).map((item) => (
              <div
                key={item.id}
                onClick={async () => {
                  await navigator.clipboard.writeText(item.text)
                  handleCopyAll()
                }}
                className="p-2.5 bg-slate-50 hover:bg-slate-100 border border-slate-200/80 rounded-2xl text-xs space-y-1 cursor-pointer transition-colors group"
              >
                <div className="flex items-center justify-between text-[11px] font-bold text-slate-500">
                  <span>{item.templateName}</span>
                  <span className="text-[10px] text-slate-400">{item.createdAt}</span>
                </div>
                <div className="text-slate-800 font-mono text-[11px] line-clamp-2">{item.text}</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
