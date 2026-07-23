"use client"

import { useState, useEffect } from 'react'
import { Sparkles, History, CheckCircle2, X, Tag, Calendar, Layers, ShieldAlert, Wrench, Rocket } from 'lucide-react'
import { CURRENT_VERSION, CHANGELOG_HISTORY, VersionLog, VersionChangeItem } from '@/app/config/versionConfig'

interface VersionModalProps {
  isOpen: boolean
  onClose: () => void
  onMarkAsRead?: () => void
}

export default function VersionModal({ isOpen, onClose, onMarkAsRead }: VersionModalProps) {
  const [activeTab, setActiveTab] = useState<'latest' | 'history'>('latest')
  const latestLog = CHANGELOG_HISTORY[0] || null

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isOpen])

  if (!isOpen) return null

  const handleClose = () => {
    if (onMarkAsRead) {
      onMarkAsRead()
    }
    onClose()
  }

  const renderBadge = (type: VersionChangeItem['type']) => {
    switch (type) {
      case 'feature':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200/80 shrink-0">
            <Rocket size={12} /> ฟีเจอร์ใหม่
          </span>
        )
      case 'fix':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-amber-50 text-amber-700 border border-amber-200/80 shrink-0">
            <Wrench size={12} /> แก้ไขระบบ
          </span>
        )
      case 'improvement':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200/80 shrink-0">
            <Sparkles size={12} /> ปรับปรุงประสิทธิภาพ
          </span>
        )
      default:
        return null
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-900/60 backdrop-blur-md animate-fade-in">
      <div className="bg-white w-full max-w-2xl rounded-3xl border border-slate-200/90 shadow-2xl overflow-hidden flex flex-col max-h-[85vh] transition-all">
        {/* Header */}
        <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 text-white p-6 relative flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-brand-primary text-white flex items-center justify-center font-bold text-xl shadow-lg shadow-brand-primary/40 shrink-0 border border-white/20">
              <Sparkles size={24} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold text-white tracking-wide">ประวัติและการอัปเดตระบบ</h2>
                <span className="bg-brand-primary/30 text-blue-200 text-xs font-mono font-bold px-2.5 py-0.5 rounded-full border border-brand-primary/40 whitespace-nowrap shrink-0 inline-flex items-center justify-center">
                  v{CURRENT_VERSION}
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">รายละเอียดฟังก์ชันใหม่ การแก้ไขปรับปรุง และบันทึกประวัติย้อนหลัง</p>
            </div>
          </div>

          <button
            onClick={handleClose}
            className="absolute top-5 right-5 p-2 text-slate-400 hover:text-white hover:bg-white/10 rounded-xl transition-colors cursor-pointer"
            aria-label="Close modal"
          >
            <X size={20} />
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center border-b border-slate-200/80 bg-slate-50/80 px-6 gap-2 pt-2">
          <button
            onClick={() => setActiveTab('latest')}
            className={`flex items-center gap-2 px-4 py-3 text-xs font-bold border-b-2 transition-all cursor-pointer ${
              activeTab === 'latest'
                ? 'border-brand-primary text-brand-primary bg-white rounded-t-xl border-t border-x border-slate-200/80 -mb-px'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Sparkles size={15} />
            มีอะไรใหม่ใน v{CURRENT_VERSION}
          </button>

          <button
            onClick={() => setActiveTab('history')}
            className={`flex items-center gap-2 px-4 py-3 text-xs font-bold border-b-2 transition-all cursor-pointer ${
              activeTab === 'history'
                ? 'border-brand-primary text-brand-primary bg-white rounded-t-xl border-t border-x border-slate-200/80 -mb-px'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <History size={15} />
            ประวัติการอัปเดตทั้งหมด ({CHANGELOG_HISTORY.length})
          </button>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar">
          {activeTab === 'latest' && latestLog && (
            <div className="space-y-5 animate-fade-in">
              {/* Latest Version Card Banner */}
              <div className="bg-gradient-to-br from-blue-50/80 to-indigo-50/50 border border-blue-200/80 rounded-2xl p-5 space-y-3">
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-blue-100 pb-3">
                  <div className="flex items-center gap-2.5">
                    <span className="bg-brand-primary text-white text-xs font-bold font-mono px-3.5 py-1.5 rounded-full shadow-xs whitespace-nowrap shrink-0 inline-flex items-center justify-center">
                      เวอร์ชัน {latestLog.version}
                    </span>
                    <h3 className="font-bold text-slate-900 text-sm sm:text-base">{latestLog.title}</h3>
                  </div>
                  <div className="flex items-center gap-1.5 text-xs font-medium text-slate-500">
                    <Calendar size={14} className="text-slate-400" />
                    <span>{latestLog.date}</span>
                  </div>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed font-medium">{latestLog.summary}</p>
              </div>

              {/* Changes List */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                  <Layers size={14} /> รายการเปลี่ยนแปลงในเวอร์ชันนี้
                </h4>

                <div className="space-y-2.5">
                  {latestLog.changes.map((item, idx) => (
                    <div key={idx} className="bg-white border border-slate-200/80 rounded-xl p-3.5 flex items-start gap-3 shadow-2xs hover:border-slate-300 transition-all">
                      {renderBadge(item.type)}
                      <span className="text-xs text-slate-700 font-medium leading-relaxed flex-1">
                        {item.description}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'history' && (
            <div className="space-y-6 animate-fade-in">
              {CHANGELOG_HISTORY.map((log: VersionLog, index: number) => (
                <div key={log.version} className="relative pl-6 border-l-2 border-slate-200 space-y-3">
                  {/* Timeline dot */}
                  <div className={`absolute -left-[9px] top-0 w-4 h-4 rounded-full border-2 bg-white flex items-center justify-center ${
                    index === 0 ? 'border-brand-primary text-brand-primary' : 'border-slate-300'
                  }`}>
                    <div className={`w-1.5 h-1.5 rounded-full ${index === 0 ? 'bg-brand-primary' : 'bg-slate-400'}`} />
                  </div>

                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className={`text-xs font-bold font-mono px-2.5 py-0.5 rounded-full whitespace-nowrap shrink-0 inline-flex items-center justify-center ${
                        index === 0 ? 'bg-brand-primary text-white' : 'bg-slate-100 text-slate-700 border border-slate-200'
                      }`}>
                        v{log.version}
                      </span>
                      <h4 className="font-bold text-slate-800 text-sm">{log.title}</h4>
                    </div>
                    <span className="text-xs text-slate-400 flex items-center gap-1">
                      <Calendar size={13} /> {log.date}
                    </span>
                  </div>

                  <p className="text-xs text-slate-600 leading-relaxed">{log.summary}</p>

                  <div className="space-y-2 pt-1">
                    {log.changes.map((item, idx) => (
                      <div key={idx} className="bg-slate-50/80 border border-slate-200/60 rounded-xl p-2.5 flex items-start gap-2.5 text-xs">
                        {renderBadge(item.type)}
                        <span className="text-slate-700 leading-relaxed flex-1">{item.description}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 sm:p-5 bg-slate-50 border-t border-slate-200/80 flex items-center justify-between gap-4">
          <div className="text-xs text-slate-500 font-medium hidden sm:flex items-center gap-1.5">
            <Tag size={14} className="text-slate-400" />
            <span>QSP Service System Version <b>v{CURRENT_VERSION}</b></span>
          </div>

          <button
            onClick={handleClose}
            className="w-full sm:w-auto px-6 py-2.5 bg-brand-primary hover:bg-brand-primary-hover text-white text-xs font-bold rounded-2xl shadow-md shadow-brand-primary/20 transition-all cursor-pointer flex items-center justify-center gap-2"
          >
            <CheckCircle2 size={16} />
            รับทราบและปิดหน้าต่าง
          </button>
        </div>
      </div>
    </div>
  )
}
