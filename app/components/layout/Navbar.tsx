"use client"

import { useState, useEffect } from 'react'
import { Menu, PanelLeftOpen, PanelLeftClose, Calendar, Clock } from 'lucide-react'

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

export default function Navbar({ onOpenSidebar, isCollapsed, onToggleCollapse }: NavbarProps) {
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
    <header className="bg-white/80 backdrop-blur-md border-b border-slate-200/80 sticky top-0 z-30 px-4 lg:px-6 py-3 flex items-center justify-between shadow-xs">
      {/* Left Column: Mobile & Desktop Sidebar Toggles */}
      <div className="flex items-center gap-3 min-w-[60px] sm:min-w-[120px]">
        {/* Mobile menu button */}
        <button
          onClick={onOpenSidebar}
          className="p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-xl lg:hidden transition-colors cursor-pointer"
          aria-label="Open sidebar"
        >
          <Menu size={22} />
        </button>

        {/* Desktop sidebar toggle button */}
        {onToggleCollapse && (
          <button
            onClick={onToggleCollapse}
            className="hidden lg:flex p-2 text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
            title={isCollapsed ? "ขยาย Sidebar" : "ย่อ Sidebar"}
          >
            {isCollapsed ? <PanelLeftOpen size={20} /> : <PanelLeftClose size={20} />}
          </button>
        )}
      </div>

      {/* Center Column: Live Date & Time Badge */}
      <div className="flex items-center justify-center flex-1 mx-2">
        <div className="bg-slate-100/90 border border-slate-200/80 px-4 py-1.5 rounded-full text-xs font-bold text-slate-700 flex items-center gap-2 shadow-2xs">
          <Calendar size={14} className="text-blue-600 shrink-0" />
          <span className="font-mono text-slate-800">{dateTimeStr || 'กำลังโหลดเวลา...'}</span>
          <Clock size={14} className="text-indigo-600 shrink-0 hidden sm:inline" />
        </div>
      </div>

      {/* Right Column Spacer for Visual Balance */}
      <div className="min-w-[60px] sm:min-w-[120px] hidden sm:block" />
    </header>
  )
}
