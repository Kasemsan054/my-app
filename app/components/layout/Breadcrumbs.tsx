'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { ChevronRight, Home } from 'lucide-react'

// Define route mapping for breadcrumbs
const routeMap: Record<string, string> = {
  '/': 'หน้าแรก (Create Ticket)',
  '/worksheet': 'ระบบสร้างใบงาน (Worksheet)',
  '/generator': 'ระบบสร้างประโยค (Generator)',
  '/histories': 'ประวัติการทำงาน (Histories)',
  '/settings': 'ตั้งค่าระบบ (Settings)',
  '/admin': 'ผู้ดูแลระบบ (Admin)',
  '/admin/add-user': 'จัดการผู้ใช้งาน (User Management)',
  '/maintenance': 'ปิดปรับปรุงระบบ (Maintenance)'
}

export default function Breadcrumbs() {
  const pathname = usePathname()
  
  if (pathname === '/login' || pathname === '/change-password') return null

  const paths = pathname.split('/').filter(p => p !== '')
  
  // Construct breadcrumb items
  const breadcrumbs = []
  let currentPath = ''
  
  // Always add home first if not on home
  if (pathname !== '/') {
    breadcrumbs.push({
      path: '/',
      label: <Home size={14} className="shrink-0" />,
      isExact: false
    })
  } else {
    breadcrumbs.push({
      path: '/',
      label: <span className="flex items-center gap-1.5"><Home size={14} /> หน้าแรก</span>,
      isExact: true
    })
  }

  paths.forEach((segment, index) => {
    currentPath += `/${segment}`
    const isLast = index === paths.length - 1
    const label = routeMap[currentPath] || segment

    breadcrumbs.push({
      path: currentPath,
      label,
      isExact: isLast
    })
  })

  return (
    <nav className="hidden sm:flex items-center text-sm font-medium text-slate-500">
      <ol className="flex items-center gap-1.5">
        {breadcrumbs.map((bc, idx) => (
          <li key={bc.path} className="flex items-center gap-1.5">
            {idx > 0 && <ChevronRight size={14} className="text-slate-300" />}
            {bc.isExact ? (
              <span className="text-brand-primary font-bold bg-brand-primary/5 px-2 py-0.5 rounded-md border border-brand-primary/10">
                {bc.label}
              </span>
            ) : (
              <Link 
                href={bc.path} 
                className="hover:text-slate-900 hover:bg-slate-100 px-2 py-0.5 rounded-md transition-colors flex items-center"
              >
                {bc.label}
              </Link>
            )}
          </li>
        ))}
      </ol>
    </nav>
  )
}
