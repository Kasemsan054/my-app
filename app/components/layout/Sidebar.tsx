"use client"

import { useState, useRef, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { FilePlus, FileText, SlidersHorizontal, LogOut, Wrench, ChevronRight, KeyRound, Sparkles, ClipboardCheck, PanelLeftOpen, PanelLeftClose, ShieldCheck } from 'lucide-react'
import { Tooltip } from '@/app/components/ui'
import { logoutAction } from '@/app/actions/authActions'
import { appConfig } from '@/app/config/app.config'

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

export default function Sidebar({ currentUser, isOpen, onClose, isCollapsed, onToggleCollapse }: SidebarProps) {
  const pathname = usePathname()
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false)
  const [isLogoHovered, setIsLogoHovered] = useState(false)
  const profileMenuRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (profileMenuRef.current && !profileMenuRef.current.contains(event.target as Node)) {
        setIsProfileMenuOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const baseItems = [
    {
      label: 'ออกใบแจ้งเปิดงานซ่อม',
      href: '/',
      icon: FilePlus,
      description: 'สร้างใบแจ้งเปิดงานซ่อมใหม่'
    },
    {
      label: appConfig.ui.worksheet.title,
      href: '/worksheet',
      icon: ClipboardCheck,
      description: appConfig.ui.worksheet.description
    },
    {
      label: appConfig.ui.generator.title,
      href: '/generator',
      icon: Sparkles,
      description: appConfig.ui.generator.description
    },
  ]

  const settingsItem = {
    label: appConfig.ui.settings.title,
    href: '/settings',
    icon: SlidersHorizontal,
    description: appConfig.ui.settings.description
  }

  const historyItem = {
    label: appConfig.ui.histories.title,
    href: '/histories',
    icon: FileText,
    description: appConfig.ui.histories.description
  }

  const adminItem = {
    label: 'แผงควบคุมผู้ดูแลระบบ',
    href: '/admin',
    icon: ShieldCheck,
    description: 'จัดการผู้ใช้งานและการตั้งค่าระบบ'
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
        <div className={`p-4 border-b border-slate-800 flex items-center ${isCollapsed ? 'lg:justify-center' : 'justify-between'} relative group/header`}>
          <div className="flex items-center gap-3 overflow-hidden">
            <div
              className="relative w-10 h-10 shrink-0"
              onMouseEnter={() => isCollapsed && setIsLogoHovered(true)}
              onMouseLeave={() => setIsLogoHovered(false)}
            >
              {/* Logo icon — fades out on hover when collapsed */}
              <div className={`w-10 h-10 rounded-2xl bg-brand-primary flex items-center justify-center text-white shadow-lg shadow-brand-primary/30 transition-all duration-300 ${isCollapsed && isLogoHovered ? 'opacity-0' : 'opacity-100'}`}>
                <Wrench size={22} />
              </div>

              {/* Expand Button — fades in on hover when collapsed (desktop only) */}
              {isCollapsed && onToggleCollapse && (
                <div className="hidden lg:block absolute inset-0 z-10">
                  <button
                    onClick={onToggleCollapse}
                    className={`w-full h-full bg-slate-800 rounded-2xl text-slate-300 hover:text-white flex items-center justify-center transition-all duration-300 cursor-pointer shadow-lg border border-slate-700 ${isLogoHovered ? 'opacity-100' : 'opacity-0'}`}
                  >
                    <PanelLeftOpen size={20} />
                  </button>
                </div>
              )}
            </div>

            <div className={`transition-all duration-300 overflow-hidden ${isCollapsed ? 'lg:opacity-0 lg:max-w-0 lg:ml-0' : 'opacity-100 max-w-xs'}`}>
              <h1 className="font-bold text-base text-white leading-tight tracking-wide whitespace-nowrap">{appConfig.ui.sidebar.title}</h1>
              <p className="text-[11px] text-slate-400 font-medium whitespace-nowrap">{appConfig.ui.sidebar.subtitle}</p>
            </div>
          </div>

          {/* Tooltip for expand button — outside overflow-hidden, relative to brand header */}
          {isCollapsed && isLogoHovered && (
            <div className="hidden lg:block absolute left-[72px] top-1/2 -translate-y-1/2 z-50 pointer-events-none">
              <div className="bg-slate-800 text-white text-xs font-medium py-1.5 px-3 rounded-lg shadow-xl whitespace-nowrap border border-slate-700">
                ขยาย Sidebar
              </div>
              <div className="absolute right-full top-1/2 -translate-y-1/2 border-[5px] border-r-slate-800 border-t-transparent border-b-transparent border-l-transparent h-0 w-0" />
            </div>
          )}

          {/* Collapse Button (When expanded) */}
          {!isCollapsed && onToggleCollapse && (
            <div className="hidden lg:block">
              <Tooltip content="ย่อ Sidebar" position="left">
                <button
                  onClick={onToggleCollapse}
                  className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
                >
                  <PanelLeftClose size={18} />
                </button>
              </Tooltip>
            </div>
          )}
        </div>

        {/* Navigation Items */}
        <div className={`flex-1 py-6 px-3 space-y-1.5 custom-scrollbar ${isCollapsed ? 'overflow-visible' : 'overflow-y-auto overflow-x-hidden'}`}>
          {navItems.map((item) => {
            const isActive = pathname === item.href || (item.href !== '/' && pathname?.startsWith(item.href))
            const Icon = item.icon
              const linkContent = (
                <Link
                  href={item.href}
                  onClick={onClose}
                  className={`
                    flex items-center gap-3 px-3 py-3 rounded-2xl transition-all duration-200 group relative w-full
                    ${isActive 
                      ? 'bg-brand-primary text-white shadow-lg shadow-brand-primary/30 font-semibold' 
                      : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                    }
                    ${isCollapsed ? 'justify-center' : 'justify-start'}
                  `}
                >
                  <Icon size={20} className={isActive ? 'text-white' : 'text-slate-400 group-hover:text-white'} />
                  
                  {!isCollapsed && (
                    <div className="flex-1 min-w-0">
                      <div className="text-sm truncate">{item.label}</div>
                      <div className={`text-[10px] truncate mt-0.5 ${isActive ? 'text-brand-primary-border' : 'text-slate-500'}`}>
                        {item.description}
                      </div>
                    </div>
                  )}

                  {isActive && !isCollapsed && (
                    <ChevronRight size={16} className="text-white opacity-50 shrink-0" />
                  )}
                </Link>
              )

              return isCollapsed ? (
                <Tooltip key={item.href} content={item.label} position="right" wrapperClassName="w-full flex">
                  {linkContent}
                </Tooltip>
              ) : (
                <div key={item.href}>{linkContent}</div>
              )
            })}
          </div>

        {/* User Profile & Logout */}
        {currentUser && (
          <div className="p-4 border-t border-slate-800">
            <div className={`flex items-center gap-2 ${isCollapsed ? 'justify-center relative' : ''}`} ref={isCollapsed ? profileMenuRef : null}>
              {/* Profile Icon */}
              {isCollapsed ? (
                <Tooltip content="โปรไฟล์" position="right" wrapperClassName="w-full flex justify-center">
                  <button 
                    onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
                    className="w-9 h-9 rounded-xl bg-brand-primary/20 text-brand-primary border border-brand-primary/30 flex items-center justify-center font-bold text-sm shrink-0 hover:bg-brand-primary/30 cursor-pointer"
                  >
                    {currentUser.name.charAt(0)}
                  </button>
                </Tooltip>
              ) : (
                <div className="w-9 h-9 rounded-xl bg-brand-primary/20 text-brand-primary border border-brand-primary/30 flex items-center justify-center font-bold text-sm shrink-0">
                  {currentUser.name.charAt(0)}
                </div>
              )}

              {/* Popup Menu when collapsed */}
              {isCollapsed && isProfileMenuOpen && (
                <div className="absolute bottom-full left-0 mb-3 bg-slate-800 border border-slate-700 rounded-xl shadow-xl w-36 py-1 z-50 animate-fade-in origin-bottom-left">
                  <Link 
                    href="/change-password" 
                    className="flex items-center gap-2 px-3 py-2 text-sm text-slate-300 hover:text-white hover:bg-slate-700 transition-colors"
                    onClick={() => setIsProfileMenuOpen(false)}
                  >
                    <KeyRound size={16} />
                    เปลี่ยนรหัสผ่าน
                  </Link>
                  <div className="h-px bg-slate-700 my-1 mx-2"></div>
                  <form action={logoutAction}>
                    <button 
                      type="submit" 
                      className="flex items-center gap-2 px-3 py-2 text-sm text-red-400 hover:text-red-300 hover:bg-red-400/10 transition-colors w-full text-left cursor-pointer"
                    >
                      <LogOut size={16} />
                      ออกจากระบบ
                    </button>
                  </form>
                </div>
              )}

              {!isCollapsed && (
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-bold text-white truncate">{currentUser.name}</div>
                  <div className="text-[11px] text-slate-400 flex items-center gap-1">
                    <KeyRound size={10} />
                    {currentUser.role}
                  </div>
                </div>
              )}

              {!isCollapsed && (
                <div className="flex items-center shrink-0">
                  <Tooltip content="เปลี่ยนรหัสผ่าน" position="top" wrapperClassName="flex">
                    <Link 
                      href="/change-password"
                      className="w-8 h-8 text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl transition-colors cursor-pointer flex items-center justify-center"
                    >
                      <KeyRound size={15} />
                    </Link>
                  </Tooltip>
                  <form action={logoutAction}>
                    <Tooltip content="ออกจากระบบ" position="top" wrapperClassName="flex">
                      <button 
                        type="submit" 
                        className="w-8 h-8 text-slate-400 hover:text-red-400 hover:bg-red-400/10 rounded-xl transition-colors cursor-pointer flex items-center justify-center"
                      >
                        <LogOut size={15} />
                      </button>
                    </Tooltip>
                  </form>
                </div>
              )}
            </div>
          </div>
        )}
      </aside>
    </>
  )
}
