"use client"

import { useState, useEffect } from 'react'
import { usePathname } from 'next/navigation'
import Sidebar from './Sidebar'
import Navbar from './Navbar'
import Breadcrumbs from './Breadcrumbs'

interface AppShellProps {
  children: React.ReactNode
  currentUser?: {
    employeeId: string
    name: string
    role: string
  } | null
}

export default function AppShell({ children, currentUser }: AppShellProps) {
  const pathname = usePathname()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [isCollapsed, setIsCollapsed] = useState(false)

  useEffect(() => {
    const saved = localStorage.getItem('sidebar_collapsed')
    if (saved === 'true') {
      // eslint-disable-next-line
      setIsCollapsed(true)
    }
  }, [])

  const toggleCollapse = () => {
    setIsCollapsed(prev => {
      const next = !prev
      localStorage.setItem('sidebar_collapsed', String(next))
      return next
    })
  }

  // ถ้าเป็นหน้า Login หรือ Change Password ให้แสดงผลเฉพาะเนื้อหา ไม่ต้องแสดง Sidebar/Navbar
  const isAuthPage = pathname === '/login' || pathname === '/change-password'

  if (isAuthPage) {
    return <>{children}</>
  }

  return (
    <div className="flex h-screen overflow-hidden bg-slate-50 text-slate-800">
      <Sidebar 
        currentUser={currentUser} 
        isOpen={sidebarOpen} 
        onClose={() => setSidebarOpen(false)} 
        isCollapsed={isCollapsed}
        onToggleCollapse={toggleCollapse}
      />
      <div className="flex-1 flex flex-col h-full min-w-0 overflow-hidden">
        <Navbar 
          currentUser={currentUser} 
          onOpenSidebar={() => setSidebarOpen(true)} 
          isCollapsed={isCollapsed}
          onToggleCollapse={toggleCollapse}
        />
        
        {/* Sticky Breadcrumbs */}
        <div className="w-full bg-slate-50 border-b border-slate-200/50 z-20 sticky top-0">
          <div className="max-w-7xl mx-auto px-3 sm:px-5 md:px-6 lg:px-8 py-2 md:py-3 flex justify-start">
            <Breadcrumbs />
          </div>
        </div>

        <main className="flex-1 overflow-y-auto p-3 sm:p-5 md:p-6 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  )
}
