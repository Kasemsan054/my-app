import prisma from './lib/prisma'
import { ReturnTicketForm } from './components/forms'
import { requireAuth } from './lib/auth'
import { FileText, CalendarDays, Building2, Package, PlusCircle, Wrench } from "lucide-react"
import WithMaintenance from './components/WithMaintenance'

export const dynamic = 'force-dynamic'

export default async function Home() {
  const currentUser = await requireAuth()

  // Calculate start of today for today's intake count
  const startOfToday = new Date()
  startOfToday.setHours(0, 0, 0, 0)

  const [companies, products, staffs, totalTicketsCount, todayTicketsCount, totalCompaniesCount, totalProductsCount] = await Promise.all([
    prisma.company.findMany({ include: { contacts: true }, orderBy: { name: 'asc' } }),
    prisma.product.findMany({ orderBy: { brand: 'asc' } }),
    prisma.user.findMany({ select: { employeeId: true, name: true, role: true }, orderBy: { name: 'asc' } }),
    prisma.returnTicket.count(),
    prisma.returnTicket.count({ where: { createdAt: { gte: startOfToday } } }),
    prisma.company.count(),
    prisma.product.count()
  ])

  const stats = [
    {
      label: 'ใบแจ้งเปิดงานซ่อมทั้งหมด',
      value: totalTicketsCount,
      icon: FileText,
      color: 'bg-brand-primary-light0 text-brand-primary bg-brand-primary-light',
      border: 'border-blue-100'
    },
    {
      label: 'เปิดงานซ่อมวันนี้',
      value: todayTicketsCount,
      icon: CalendarDays,
      color: 'bg-emerald-500 text-emerald-600 bg-emerald-50',
      border: 'border-emerald-100'
    },
    {
      label: 'บริษัทลูกค้าในระบบ',
      value: totalCompaniesCount,
      icon: Building2,
      color: 'bg-brand-secondary-light0 text-brand-secondary bg-brand-secondary-light',
      border: 'border-indigo-100'
    },
    {
      label: 'รุ่นอุปกรณ์ในระบบ',
      value: totalProductsCount,
      icon: Package,
      color: 'bg-amber-500 text-amber-600 bg-amber-50',
      border: 'border-amber-100'
    }
  ]

  return (
    <WithMaintenance path="/">
      <div className="space-y-8 max-w-7xl mx-auto pb-12">
        {/* Header Banner */}
        <div className="bg-slate-900 rounded-3xl p-6 md:p-8 text-white shadow-xl flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <div className="flex items-center gap-2 text-blue-400 font-bold text-xs uppercase tracking-wider mb-1">
              <Wrench size={16} /> Equipment Repair Intake System
            </div>
            <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight">ระบบออกใบแจ้งเปิดงานซ่อมอุปกรณ์</h1>
            <p className="text-sm text-slate-300 mt-1">
              ยินดีต้อนรับคุณ <span className="font-bold text-white">{currentUser.name}</span>
            </p>
          </div>
        </div>

        {/* Statistics Cards Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          {stats.map((stat, idx) => {
            const Icon = stat.icon
            return (
              <div key={idx} className={`bg-white p-5 rounded-3xl border ${stat.border} shadow-xs flex items-center gap-4 hover:shadow-md transition-all`}>
                <div className={`p-3.5 rounded-2xl ${stat.color}`}>
                  <Icon size={24} />
                </div>
                <div>
                  <div className="text-2xl font-black text-slate-900">{stat.value}</div>
                  <div className="text-xs font-semibold text-slate-500 mt-0.5">{stat.label}</div>
                </div>
              </div>
            )
          })}
        </div>

        {/* Form Section */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 text-slate-900 font-bold text-lg">
            <PlusCircle size={20} className="text-brand-primary" /> ออกใบแจ้งเปิดงานซ่อมฉบับใหม่ (Create Repair Ticket)
          </div>
          
          <ReturnTicketForm companies={companies} products={products} currentUser={currentUser} staffs={JSON.parse(JSON.stringify(staffs))} />
        </div>
      </div>
    </WithMaintenance>
  )
}