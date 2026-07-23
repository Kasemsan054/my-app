import prisma from '../lib/prisma'
import { requireAuth } from '../lib/auth'
import { ServiceWorksheetForm } from '../components/forms'
import { FileText, PlusCircle } from 'lucide-react'
import { appConfig } from '../config/app.config'
import WithMaintenance from '../components/WithMaintenance'

export const dynamic = 'force-dynamic'

export default async function WorksheetPage() {
  const currentUser = await requireAuth()

  const [products, staffs] = await Promise.all([
    prisma.product.findMany({
      orderBy: [{ brand: 'asc' }, { model: 'asc' }]
    }),
    prisma.user.findMany({
      select: { employeeId: true, name: true, role: true },
      orderBy: { name: 'asc' }
    })
  ])

  return (
    <WithMaintenance path="/worksheet">
      <div className="space-y-8 max-w-7xl mx-auto pb-12">
        {/* Header Banner */}
        <div className="bg-slate-900 rounded-3xl p-6 md:p-8 text-white shadow-xl flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <div className="flex items-center gap-2 text-brand-primary-light font-bold text-xs uppercase tracking-wider mb-1">
              <FileText size={16} /> Service Worksheet System
            </div>
            <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight">{appConfig.ui.worksheet.title}</h1>
            <p className="text-sm text-slate-300 mt-1">
              {appConfig.ui.worksheet.description}
            </p>
          </div>
        </div>

        {/* Main Content Container */}
        <div className="space-y-6">
          {/* Form Section Header */}
          <div className="flex items-center justify-between border-b border-slate-200 pb-4">
            <div className="flex items-center gap-2 text-slate-900 font-extrabold text-lg">
              <PlusCircle size={20} className="text-brand-primary" /> บันทึกใบงานบริการฉบับใหม่ (Create Worksheet)
            </div>
          </div>

          {/* Worksheet Form with Dynamic Products & Staffs */}
          <ServiceWorksheetForm 
            currentUser={currentUser} 
            products={JSON.parse(JSON.stringify(products))} 
            staffs={JSON.parse(JSON.stringify(staffs))} 
          />
        </div>
      </div>
    </WithMaintenance>
  )
}
