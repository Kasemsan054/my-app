
import Link from 'next/link'
import { Users, Database, ShieldCheck, Activity, ChevronRight, FileText, ClipboardCheck, Building2, Wrench, Mail } from 'lucide-react'
import MaintenanceAdmin from './MaintenanceAdmin'
import EmailConfigAdmin from './EmailConfigAdmin'
import { getMaintenanceSettings } from '@/app/actions/maintenanceActions'
import { getEmailConfig } from '@/app/actions/emailConfigActions'
import prisma from '@/app/lib/prisma'

export default async function AdminDashboardPage() {
  const [initialPaths, emailConfig, userCount, ticketCount, worksheetCount, companyCount] = await Promise.all([
    getMaintenanceSettings(),
    getEmailConfig(),
    prisma.user.count(),
    prisma.returnTicket.count(),
    prisma.worksheet.count(),
    prisma.company.count(),
  ])

  // Check if config is from DB or env fallback
  const emailConfigInDb = await prisma.systemSetting.findUnique({ where: { key: 'email_config' } })
  const configSource: 'db' | 'env' = emailConfigInDb ? 'db' : 'env'

  const adminModules = [
    {
      title: 'จัดการผู้ใช้งาน (User Management)',
      description: 'เพิ่ม, ลบ, และจัดการพนักงานในระบบ กำหนดสิทธิ์การเข้าใช้งาน',
      href: '/admin/add-user',
      icon: Users,
      badge: `${userCount} ผู้ใช้`,
      color: 'text-blue-600',
      bgColor: 'bg-blue-500/10',
      borderColor: 'border-blue-500/20'
    },
    {
      title: 'ตั้งค่าระบบ (System Settings)',
      description: 'จัดการข้อมูลบริษัท สินค้า แบรนด์ และผู้ติดต่อพื้นฐาน',
      href: '/settings',
      icon: Database,
      badge: `${companyCount} บริษัท`,
      color: 'text-indigo-600',
      bgColor: 'bg-indigo-500/10',
      borderColor: 'border-indigo-500/20'
    }
  ]

  const stats = [
    { label: 'พนักงานในระบบ', value: userCount.toLocaleString(), icon: Users, desc: 'ผู้ใช้งานทั้งหมด', color: 'text-blue-500', bg: 'bg-blue-50' },
    { label: 'ใบแจ้งเปิดงานซ่อม', value: ticketCount.toLocaleString(), icon: FileText, desc: 'ประวัติใบแจ้งซ่อม', color: 'text-amber-500', bg: 'bg-amber-50' },
    { label: 'ใบบันทึกผลงาน (Worksheet)', value: worksheetCount.toLocaleString(), icon: ClipboardCheck, desc: 'ใบงานบริการทั้งหมด', color: 'text-emerald-500', bg: 'bg-emerald-50' },
    { label: 'บริษัท / ลูกค้า', value: companyCount.toLocaleString(), icon: Building2, desc: 'ฐานข้อมูลลูกค้า', color: 'text-purple-500', bg: 'bg-purple-50' },
  ]

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-16">
      {/* Header Banner */}
      <div className="relative overflow-hidden bg-slate-900 rounded-[2.5rem] p-8 md:p-10 text-white shadow-2xl border border-slate-800">
        {/* Background Gradients */}
        <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full bg-brand-primary/20 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-96 h-96 rounded-full bg-blue-600/20 blur-3xl pointer-events-none" />
        
        <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/10 text-slate-300 font-bold text-xs uppercase tracking-widest mb-3">
              <ShieldCheck size={14} className="text-emerald-400" /> Admin Console
            </div>
            <h1 className="text-3xl md:text-4xl font-black tracking-tight text-white mb-2">
              แผงควบคุมผู้ดูแลระบบ <span className="text-brand-primary font-normal text-2xl md:text-3xl">(Admin Dashboard)</span>
            </h1>
            <p className="text-slate-400 max-w-2xl text-sm leading-relaxed">
              ศูนย์รวมการจัดการระบบ กำหนดสิทธิ์ผู้ใช้ ตั้งค่าอีเมลการแจ้งเตือน และเปิด-ปิดโหมดปรับปรุงระบบ
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0 bg-white/5 backdrop-blur-md p-3.5 rounded-2xl border border-white/10">
            <div className="w-3 h-3 rounded-full bg-emerald-400 animate-ping" />
            <div className="text-xs">
              <div className="font-bold text-white">ระบบทำงานปกติ</div>
              <div className="text-slate-400 text-[11px]">Server Online</div>
            </div>
          </div>
        </div>
      </div>

      {/* Real Statistics Overview Grid */}
      <div>
        <h2 className="text-sm font-bold uppercase tracking-wider text-slate-400 mb-4 px-1 flex items-center gap-2">
          <Activity size={16} className="text-brand-primary" /> สถิติภาพรวมระบบ (Overview Statistics)
        </h2>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          {stats.map((stat, i) => {
            const Icon = stat.icon
            return (
              <div key={i} className="bg-white rounded-3xl p-5 md:p-6 border border-slate-200/80 shadow-2xs hover:shadow-md transition-all duration-300 group relative overflow-hidden">
                <div className="flex items-center justify-between mb-3">
                  <div className={`w-12 h-12 rounded-2xl ${stat.bg} ${stat.color} flex items-center justify-center font-bold transition-transform group-hover:scale-110`}>
                    <Icon size={22} />
                  </div>
                  <span className="text-[11px] font-semibold text-slate-400">{stat.desc}</span>
                </div>
                <div className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight">{stat.value}</div>
                <div className="text-xs font-medium text-slate-500 mt-1">{stat.label}</div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Main Admin Modules */}
      <div>
        <h2 className="text-sm font-bold uppercase tracking-wider text-slate-400 mb-4 px-1 flex items-center gap-2">
          <Database size={16} className="text-brand-primary" /> เครื่องมือการจัดการหลัก (Management Modules)
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {adminModules.map((mod, i) => {
            const Icon = mod.icon
            return (
              <Link 
                href={mod.href} 
                key={i}
                className="group bg-white rounded-3xl p-6 border border-slate-200/80 shadow-2xs hover:shadow-xl hover:shadow-slate-200/60 hover:border-slate-300 transition-all duration-300 flex items-start gap-5 cursor-pointer relative overflow-hidden"
              >
                <div className={`w-14 h-14 rounded-2xl ${mod.bgColor} ${mod.color} border ${mod.borderColor} flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform duration-300`}>
                  <Icon size={26} />
                </div>
                <div className="flex-1 min-w-0 pt-0.5">
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <h3 className="text-base font-bold text-slate-900 group-hover:text-brand-primary transition-colors truncate">
                      {mod.title}
                    </h3>
                    <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-600 shrink-0">
                      {mod.badge}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 leading-relaxed line-clamp-2">{mod.description}</p>
                </div>
                <ChevronRight size={18} className="text-slate-300 group-hover:text-brand-primary group-hover:translate-x-1 transition-all shrink-0 self-center" />
              </Link>
            )
          })}
        </div>
      </div>
      
      {/* System Settings & Configurations Grid */}
      <div className="space-y-6 pt-2">
        <h2 className="text-sm font-bold uppercase tracking-wider text-slate-400 px-1 flex items-center gap-2">
          <Wrench size={16} className="text-amber-500" /> การตั้งค่าระบบและการซ่อมบำรุง (System Controls)
        </h2>

        {/* Email Configuration Admin */}
        <EmailConfigAdmin initialConfig={emailConfig} configSource={configSource} />

        {/* Maintenance Controls Admin */}
        <MaintenanceAdmin initialPaths={initialPaths} />
      </div>
    </div>
  )
}

