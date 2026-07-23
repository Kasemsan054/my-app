"use client"

import { useState, useEffect } from 'react'
import { Menu, Calendar, Clock } from 'lucide-react'
import { Tooltip } from '@/app/components/ui'

interface NavbarProps {
  currentUser?: {
    employeeId: string
    name: string
    role: string
  } | null
  onOpenSidebar: () => void
  isCollapsed?: boolean
  onToggleCollapse?: () => void
}

const THAI_MONTHS = [
  'มกราคม', 'กุมภาพันธ์', 'มีนาคม', 'เมษายน', 'พฤษภาคม', 'มิถุนายน',
  'กรกฎาคม', 'สิงหาคม', 'กันยายน', 'ตุลาคม', 'พฤศจิกายน', 'ธันวาคม'
]

export default function Navbar({ onOpenSidebar }: NavbarProps) {
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

      {/* Right Column Spacer for Visual Balance */}
      <div className="w-10 sm:w-32 shrink-0" />
    </header>
  )
}
