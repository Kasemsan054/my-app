"use client"

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { FilePlus, FileText, SlidersHorizontal, UserPlus, LogOut, Wrench, ChevronRight, KeyRound, Sparkles, ClipboardCheck } from 'lucide-react'
import { logoutAction } from '@/app/actions/authActions'

interface SidebarProps {
  currentUser?: {
    employeeId: string
    name: string
    role: string
  } | null
  isOpen?: boolean
  onClose?: () => void
  isCollapsed?: boolean
  onToggleCollapse?: () => void
}

export default function Sidebar({ currentUser, isOpen, onClose, isCollapsed }: SidebarProps) {
  const pathname = usePathname()

  const baseItems = [
    {
      label: 'ออกใบแจ้งเปิดงานซ่อม',
      href: '/',
      icon: FilePlus,
      description: 'สร้างใบแจ้งเปิดงานซ่อมใหม่'
    },
    {
      label: 'ใบงานบริการ (Worksheet)',
      href: '/worksheet',
      icon: ClipboardCheck,
      description: 'ใบบันทึกผลการดำเนินงาน'
    },
    {
      label: 'สร้างประโยครายงาน',
      href: '/generator',
      icon: Sparkles,
      description: 'เครื่องมือเจนข้อความสรุปงานซ่อม'
    },
  ]

  const settingsItem = {
    label: 'จัดการบริษัทและอุปกรณ์',
    href: '/settings',
    icon: SlidersHorizontal,
    description: 'บริษัท ผู้ติดต่อ และรุ่นอุปกรณ์'
  }

  const historyItem = {
    label: 'ประวัติเอกสารทั้งหมด',
    href: '/histories',
    icon: FileText,
    description: 'รวมใบแจ้งซ่อมและใบงานบริการ'
  }

  const adminItem = {
    label: 'จัดการผู้ใช้งานระบบ',
    href: '/admin/add-user',
    icon: UserPlus,
    description: 'เพิ่มพนักงานและรีเซ็ตรหัสผ่าน'
  }

  // Ensure 'ประวัติเอกสารทั้งหมด' is ALWAYS second-to-last (รองสุดท้าย) for all roles
  const navItems = currentUser?.role === 'ADMIN'
    ? [...baseItems, settingsItem, historyItem, adminItem]
    : [...baseItems, historyItem, settingsItem]

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      <aside className={`
        fixed top-0 bottom-0 left-0 z-50 bg-slate-900 text-white flex flex-col transition-all duration-300 ease-in-out
        lg:static lg:translate-x-0
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        ${isCollapsed ? 'lg:w-20' : 'lg:w-72'}
        w-72
      `}>
        {/* Brand Header */}
        <div className={`p-4 border-b border-slate-800 flex items-center ${isCollapsed ? 'lg:justify-center' : 'justify-start'}`}>
          <div className="flex items-center gap-3 overflow-hidden">
            <div className="w-10 h-10 rounded-2xl bg-blue-600 flex items-center justify-center text-white shadow-lg shadow-blue-500/30 shrink-0">
              <Wrench size={22} />
            </div>
            <div className={`${isCollapsed ? 'lg:hidden' : ''} transition-opacity`}>
              <h1 className="font-bold text-base text-white leading-tight tracking-wide whitespace-nowrap">QSP Service</h1>
              <p className="text-[11px] text-slate-400 font-medium whitespace-nowrap">Repair Intake System</p>
            </div>
          </div>
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 p-3 space-y-1.5 overflow-y-auto">
          <div className={`px-3 py-2 text-[11px] font-bold text-slate-400 uppercase tracking-wider ${isCollapsed ? 'lg:text-center lg:px-0' : ''}`}>
            {isCollapsed ? <span className="hidden lg:inline text-[9px]">เมนู</span> : null}
            <span className={isCollapsed ? 'lg:hidden' : ''}>เมนูหลัก</span>
          </div>

          {navItems.map((item) => {
            const Icon = item.icon
            const isActive = pathname === item.href

            return (
              <Link
                key={item.href}
                href={item.href}
                prefetch={true}
                onClick={onClose}
                title={item.label}
                className={`
                  group flex items-center justify-between p-2.5 rounded-2xl transition-all duration-200
                  ${isActive 
                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30 font-semibold' 
                    : 'text-slate-300 hover:bg-slate-800/80 hover:text-white'
                  }
                  ${isCollapsed ? 'lg:justify-center lg:p-3' : ''}
                `}
              >
                <div className="flex items-center gap-3">
                  <div className={`
                    p-2 rounded-xl transition-colors shrink-0
                    ${isActive ? 'bg-white/20 text-white' : 'bg-slate-800 text-slate-400 group-hover:text-white group-hover:bg-slate-700'}
                  `}>
                    <Icon size={18} />
                  </div>
                  <div className={`${isCollapsed ? 'lg:hidden' : ''} transition-opacity overflow-hidden`}>
                    <div className="text-sm whitespace-nowrap">{item.label}</div>
                    <div className={`text-[11px] font-normal whitespace-nowrap ${isActive ? 'text-blue-100' : 'text-slate-400'}`}>
                      {item.description}
                    </div>
                  </div>
                </div>
                {isActive && !isCollapsed && <ChevronRight size={16} className="text-blue-200 lg:inline hidden" />}
              </Link>
            )
          })}
        </nav>

        {/* User Card & Actions */}
        {currentUser && (
          <div className={`p-3 border-t border-slate-800 bg-slate-950/50 ${isCollapsed ? 'lg:p-2' : ''}`}>
            <div className={`flex items-center justify-between bg-slate-900 p-2.5 rounded-2xl border border-slate-800/80 ${isCollapsed ? 'lg:flex-col lg:gap-2 lg:p-2' : ''}`}>
              <div className="flex items-center gap-2.5 overflow-hidden">
                <div className="w-9 h-9 rounded-xl bg-blue-600/20 text-blue-400 border border-blue-500/30 flex items-center justify-center font-bold text-sm shrink-0" title={`${currentUser.name} (${currentUser.role})`}>
                  {currentUser.name.charAt(0)}
                </div>
                <div className={`truncate ${isCollapsed ? 'lg:hidden' : ''}`}>
                  <div className="text-xs font-bold text-white truncate">{currentUser.name}</div>
                  <div className="text-[11px] text-slate-400 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                    {currentUser.role === 'ADMIN' ? 'Admin' : 'Staff'}
                  </div>
                </div>
              </div>

              <div className={`flex items-center gap-1 ${isCollapsed ? 'lg:flex-col lg:gap-1.5' : ''}`}>
                <Link
                  href="/change-password"
                  onClick={onClose}
                  title="เปลี่ยนรหัสผ่าน"
                  className="p-1.5 text-slate-400 hover:text-amber-400 hover:bg-amber-500/10 rounded-xl transition-colors cursor-pointer"
                >
                  <KeyRound size={16} />
                </Link>
                <form action={logoutAction}>
                  <button
                    type="submit"
                    title="ออกจากระบบ"
                    className="p-1.5 text-slate-400 hover:text-red-400 hover:bg-red-500/10 rounded-xl transition-colors cursor-pointer"
                  >
                    <LogOut size={16} />
                  </button>
                </form>
              </div>
            </div>
          </div>
        )}
      </aside>
    </>
  )
}
