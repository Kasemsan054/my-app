"use client"

import { useState, useEffect } from 'react'
import { Menu, Calendar, Clock, Sparkles } from 'lucide-react'
import { Tooltip } from '@/app/components/ui'
import { CURRENT_VERSION } from '@/app/config/versionConfig'

interface NavbarProps {
  currentUser?: {
    employeeId: string
    name: string
    role: string
  } | null
  onOpenSidebar: () => void
  isCollapsed?: boolean
  onToggleCollapse?: () => void
  onOpenVersionModal?: () => void
  hasUnreadVersion?: boolean
}

const THAI_MONTHS = [
  'มกราคม', 'กุมภาพันธ์', 'มีนาคม', 'เมษายน', 'พฤษภาคม', 'มิถุนายน',
  'กรกฎาคม', 'สิงหาคม', 'กันยายน', 'ตุลาคม', 'พฤศจิกายน', 'ธันวาคม'
]

export default function Navbar({ onOpenSidebar, onOpenVersionModal, hasUnreadVersion }: NavbarProps) {
  const [dateTimeStr, setDateTimeStr] = useState<string>('')

  useEffect(() => {
    const updateDateTime = () => {
      const now = new Date()
      const day = now.getDate()
      const month = THAI_MONTHS[now.getMonth()]
      const yearBE = now.getFullYear() + 543
      const hours = String(now.getHours()).padStart(2, '0')
      const minutes = String(now.getMinutes()).padStart(2, '0')
      const seconds = String(now.getSeconds()).padStart(2, '0')

      setDateTimeStr(`${day} ${month} ${yearBE} • ${hours}:${minutes}:${seconds} น.`)
    }

    updateDateTime()
    const timer = setInterval(updateDateTime, 1000)
    return () => clearInterval(timer)
  }, [])

  return (
    <header className="bg-white/80 backdrop-blur-md border-b border-slate-200/80 sticky top-0 z-30 px-3 lg:px-6 py-3 flex items-center justify-between shadow-xs">
      {/* Left Column: Mobile Sidebar Toggle */}
      <div className="flex items-center w-10 sm:w-32 justify-start shrink-0">
        {/* Mobile menu button */}
        <Tooltip content="เปิดเมนู" position="bottom" wrapperClassName="lg:hidden">
          <button
            onClick={onOpenSidebar}
            className="p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer shrink-0"
            aria-label="Open sidebar"
          >
            <Menu size={22} />
          </button>
        </Tooltip>
      </div>

      {/* Center Column: Live Date & Time Badge */}
      <div className="flex items-center justify-center flex-1 mx-1 sm:mx-2">
        <div className="bg-slate-100/90 border border-slate-200/80 px-3 sm:px-4 py-1.5 rounded-full text-xs font-bold text-slate-700 flex items-center gap-1.5 sm:gap-2 shadow-2xs whitespace-nowrap">
          <Calendar size={14} className="text-brand-primary shrink-0" />
          <span className="font-mono text-slate-800 text-[11px] sm:text-xs">{dateTimeStr || 'กำลังโหลดเวลา...'}</span>
          <Clock size={14} className="text-brand-secondary shrink-0 hidden sm:inline" />
        </div>
      </div>

      {/* Right Column: Version Badge Button */}
      <div className="flex items-center justify-end w-auto sm:w-32 shrink-0">
        {onOpenVersionModal && (
          <Tooltip content="ดูรายละเอียดการอัปเดตและประวัติเวอร์ชัน (Changelog)" position="bottom" align="right">
            <button
              onClick={onOpenVersionModal}
              className="relative flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-100 hover:bg-brand-primary/10 text-slate-700 hover:text-brand-primary border border-slate-200 hover:border-brand-primary/30 transition-all font-mono text-xs font-bold cursor-pointer group shadow-2xs"
            >
              <Sparkles size={13} className="text-brand-primary group-hover:scale-110 transition-transform" />
              <span>v{CURRENT_VERSION}</span>

              {hasUnreadVersion && (
                <span className="absolute -top-1 -right-1 flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500 border-2 border-white"></span>
                </span>
              )}
            </button>
          </Tooltip>
        )}
      </div>
    </header>
  )
}
