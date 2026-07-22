"use client"

import { useState, useMemo } from 'react'
import { 
  Search, FileText, Eye, Trash2, ExternalLink, Calendar, Building2, 
  Package, Wrench, Sparkles, Filter, LayoutGrid, List, CheckCircle2, 
  Clock, Phone, UserCheck, ShieldCheck, X, ClipboardCheck, ArrowUpRight 
} from 'lucide-react'
import { deleteTicket } from '@/app/actions/ticketActions'
import { deleteWorksheet } from '@/app/actions/worksheetActions'
import { Toast } from '@/app/components/ui'
import { ReturnTicketItem as TicketItem, WorksheetItem, UserItem } from '@/app/types'

interface HistoriesClientPageProps {
  initialTickets: TicketItem[]
  initialWorksheets: WorksheetItem[]
  currentUser: UserItem
}

export default function HistoriesClientPage({ initialTickets, initialWorksheets, currentUser }: HistoriesClientPageProps) {
  const [tickets, setTickets] = useState<TicketItem[]>(initialTickets)
  const [worksheets, setWorksheets] = useState<WorksheetItem[]>(initialWorksheets)
  
  // View & Filter States
  const [activeTab, setActiveTab] = useState<'ALL' | 'TICKET' | 'WORKSHEET'>('ALL')
  const [viewMode, setViewMode] = useState<'CARD' | 'TABLE'>('CARD')
  const [searchQuery, setSearchQuery] = useState('')
  
  // Modals state
  const [selectedTicketPdf, setSelectedTicketPdf] = useState<TicketItem | null>(null)
  const [selectedWorksheet, setSelectedWorksheet] = useState<WorksheetItem | null>(null)
  const [deleteTarget, setDeleteTarget] = useState<{ type: 'TICKET' | 'WORKSHEET'; id: string; title: string } | null>(null)
  
  const [isDeleting, setIsDeleting] = useState(false)
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null)

  // Combine and sort all history items by date
  const combinedItems = useMemo(() => {
    const list: Array<
      | { kind: 'TICKET'; data: TicketItem; date: Date }
      | { kind: 'WORKSHEET'; data: WorksheetItem; date: Date }
    > = []

    if (activeTab === 'ALL' || activeTab === 'TICKET') {
      tickets.forEach(t => {
        list.push({ kind: 'TICKET', data: t, date: new Date(t.createdAt) })
      })
    }

    if (activeTab === 'ALL' || activeTab === 'WORKSHEET') {
      worksheets.forEach(w => {
        list.push({ kind: 'WORKSHEET', data: w, date: new Date(w.createdAt) })
      })
    }

    return list.sort((a, b) => b.date.getTime() - a.date.getTime())
  }, [tickets, worksheets, activeTab])

  // Filter items by search query
  const filteredItems = useMemo(() => {
    const q = searchQuery.toLowerCase().trim()
    if (!q) return combinedItems

    return combinedItems.filter(item => {
      if (item.kind === 'TICKET') {
        const t = item.data
        return (
          t.ticket_no.toLowerCase().includes(q) ||
          (t.serial_no && t.serial_no.toLowerCase().includes(q)) ||
          t.company.name.toLowerCase().includes(q) ||
          t.contact.name.toLowerCase().includes(q) ||
          t.contact.phone.includes(q) ||
          t.product.brand.toLowerCase().includes(q) ||
          t.product.model.toLowerCase().includes(q) ||
          (t.problem_symptom && t.problem_symptom.toLowerCase().includes(q))
        )
      } else {
        const w = item.data
        return (
          w.worksheet_no.toLowerCase().includes(q) ||
          w.customer_name.toLowerCase().includes(q) ||
          w.brand.toLowerCase().includes(q) ||
          w.model.toLowerCase().includes(q) ||
          (w.serial_no && w.serial_no.toLowerCase().includes(q)) ||
          w.technician_name.toLowerCase().includes(q) ||
          (w.symptom && w.symptom.toLowerCase().includes(q))
        )
      }
    })
  }, [combinedItems, searchQuery])

  // Delete Action
  const handleDeleteConfirm = async () => {
    if (!deleteTarget) return
    setIsDeleting(true)

    try {
      if (deleteTarget.type === 'TICKET') {
        const res = await deleteTicket(deleteTarget.id)
        if (res.success) {
          setTickets(prev => prev.filter(t => t.id !== deleteTarget.id))
          setToast({ message: 'ลบประวัติใบแจ้งเปิดงานซ่อมเรียบร้อยแล้ว', type: 'success' })
        } else {
          setToast({ message: res.error || 'เกิดข้อผิดพลาดในการลบข้อมูล', type: 'error' })
        }
      } else {
        const res = await deleteWorksheet(deleteTarget.id)
        if (res.success) {
          setWorksheets(prev => prev.filter(w => w.id !== deleteTarget.id))
          setToast({ message: 'ลบประวัติใบงานบริการ Worksheet เรียบร้อยแล้ว', type: 'success' })
        } else {
          setToast({ message: res.error || 'เกิดข้อผิดพลาดในการลบข้อมูล', type: 'error' })
        }
      }
    } catch {
      setToast({ message: 'เกิดข้อผิดพลาดในการลบข้อมูล', type: 'error' })
    } finally {
      setIsDeleting(false)
      setDeleteTarget(null)
    }
  }

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-12">
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

      {/* Header Banner */}
      <div className="bg-slate-900 rounded-3xl p-6 md:p-8 text-white shadow-xl flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <div className="flex items-center gap-2 text-blue-400 font-bold text-xs uppercase tracking-wider mb-1">
            <FileText size={16} /> Central Document History Hub
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight">ศูนย์รวมประวัติเอกสารและใบงาน</h1>
          <p className="text-sm text-slate-300 mt-1">
            รวมประวัติใบแจ้งเปิดงานซ่อม และใบบันทึกผลการดำเนินงาน (Worksheet) ไว้ในที่เดียวเพื่อความสะดวกในการค้นหา
          </p>
        </div>

        {/* Quick Stats Badges */}
        <div className="flex items-center gap-3">
          <div className="bg-slate-800/90 border border-slate-700 px-4 py-2.5 rounded-2xl text-right">
            <div className="text-[11px] text-slate-400 font-medium">เอกสารรวมทั้งหมด</div>
            <div className="text-lg font-black text-white">{tickets.length + worksheets.length} รายการ</div>
          </div>
        </div>
      </div>

      {/* Control Bar: Category Tabs & View Mode & Search */}
      <div className="bg-white p-4 md:p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 pb-4">
          
          {/* Category Segmented Tabs */}
          <div className="flex items-center gap-1.5 bg-slate-100 p-1.5 rounded-2xl w-fit">
            <button
              onClick={() => setActiveTab('ALL')}
              className={`
                px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2
                ${activeTab === 'ALL' 
                  ? 'bg-white text-slate-900 shadow-sm' 
                  : 'text-slate-600 hover:text-slate-900'
                }
              `}
            >
              <span>ทั้งหมด ({tickets.length + worksheets.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('TICKET')}
              className={`
                px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2
                ${activeTab === 'TICKET' 
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30' 
                  : 'text-slate-600 hover:text-slate-900'
                }
              `}
            >
              <FileText size={14} />
              <span>ใบแจ้งเปิดงานซ่อม ({tickets.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('WORKSHEET')}
              className={`
                px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2
                ${activeTab === 'WORKSHEET' 
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30' 
                  : 'text-slate-600 hover:text-slate-900'
                }
              `}
            >
              <ClipboardCheck size={14} />
              <span>ใบงานบริการ Worksheet ({worksheets.length})</span>
            </button>
          </div>

          {/* View Mode Toggle: Cards vs Table */}
          <div className="flex items-center gap-2 border border-slate-200 p-1 rounded-2xl bg-slate-50 w-fit self-end md:self-auto">
            <button
              onClick={() => setViewMode('CARD')}
              title="มุมมองแบบการ์ด (Spacious Cards)"
              className={`p-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                viewMode === 'CARD' ? 'bg-white text-slate-900 shadow-xs font-bold' : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              <LayoutGrid size={16} /> <span className="hidden sm:inline">แบบการ์ด</span>
            </button>
            <button
              onClick={() => setViewMode('TABLE')}
              title="มุมมองแบบตาราง (Table List)"
              className={`p-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                viewMode === 'TABLE' ? 'bg-white text-slate-900 shadow-xs font-bold' : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              <List size={16} /> <span className="hidden sm:inline">แบบตาราง</span>
            </button>
          </div>

        </div>

        {/* Search Bar Input */}
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input
            type="text"
            placeholder="ค้นหาตามเลขที่เอกสาร, ชื่อลูกค้า/บริษัท, ยี่ห้อ/รุ่น, S/N, ช่างผู้รับผิดชอบ หรืออาการเสีย..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 py-3 pl-11 pr-4 rounded-2xl text-xs font-medium outline-none transition-all focus:bg-white focus:border-slate-900 focus:ring-4 focus:ring-slate-900/5 shadow-xs"
          />
          {searchQuery && (
            <button 
              onClick={() => setSearchQuery('')}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-600 bg-slate-200/60 p-1 rounded-full"
            >
              <X size={14} />
            </button>
          )}
        </div>
      </div>

      {/* Main Content Area */}
      {filteredItems.length === 0 ? (
        <div className="bg-white rounded-3xl p-16 border border-slate-200 text-center text-slate-400 space-y-3">
          <FileText size={40} className="mx-auto text-slate-300" />
          <div className="text-sm font-bold text-slate-700">ไม่พบประวัติเอกสารที่คุณค้นหา</div>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">
            ลองเปลี่ยนคำค้นหา หรือสลับประเภทแท็บเอกสารด้านบน
          </p>
        </div>
      ) : viewMode === 'CARD' ? (
        /* CARD VIEW: Clean, Spacious & Non-Crowded Layout */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredItems.map((item) => {
            if (item.kind === 'TICKET') {
              const t = item.data
              return (
                <div 
                  key={t.id}
                  className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-xs hover:shadow-lg transition-all duration-200 flex flex-col justify-between space-y-4 group"
                >
                  <div className="space-y-3">
                    {/* Header Badge */}
                    <div className="flex items-center justify-between">
                      <span className="bg-blue-50 text-blue-700 border border-blue-200/80 text-[11px] font-extrabold px-3 py-1 rounded-full flex items-center gap-1.5">
                        <FileText size={13} /> ใบแจ้งเปิดงานซ่อม
                      </span>
                      <span className="text-[11px] font-semibold text-slate-400">
                        {new Date(t.receive_date).toLocaleDateString('th-TH')}
                      </span>
                    </div>

                    {/* Doc No & Company */}
                    <div>
                      <div className="text-base font-black text-blue-600 font-mono tracking-tight group-hover:text-blue-700 transition-colors">
                        {t.ticket_no}
                      </div>
                      <h3 className="text-sm font-bold text-slate-900 mt-1 flex items-center gap-1.5">
                        <Building2 size={16} className="text-slate-400 shrink-0" />
                        <span className="truncate">{t.company.name}</span>
                      </h3>
                      <div className="text-xs text-slate-500 font-medium pl-5 mt-0.5">
                        ผู้ติดต่อ: {t.contact.name} ({t.contact.phone})
                      </div>
                    </div>

                    {/* Equipment Details */}
                    <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-100 space-y-1">
                      <div className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                        <Wrench size={14} className="text-blue-600" />
                        <span>{t.product.brand} {t.product.model}</span>
                      </div>
                      {t.serial_no && (
                        <div className="text-[11px] font-mono text-slate-500 pl-5">
                          S/N: {t.serial_no}
                        </div>
                      )}
                      {t.problem_symptom && (
                        <div className="text-xs text-amber-800 font-medium mt-1 pt-1 border-t border-slate-200/60 line-clamp-2">
                          อาการ: {t.problem_symptom}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Card Actions */}
                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                    <div className="text-slate-400 text-[11px]">
                      โดย {t.primaryStaff.name}
                    </div>

                    <div className="flex items-center gap-1.5">
                      {t.file_path ? (
                        <a
                          href={t.file_path}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-3 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-xl font-bold transition-colors flex items-center gap-1"
                        >
                          <Eye size={14} /> ดู PDF
                        </a>
                      ) : (
                        <span className="text-[11px] text-slate-400 italic">ไม่มี PDF</span>
                      )}

                      {currentUser.role === 'ADMIN' && (
                        <button
                          onClick={() => setDeleteTarget({ type: 'TICKET', id: t.id, title: t.ticket_no })}
                          className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-colors cursor-pointer"
                        >
                          <Trash2 size={15} />
                        </button>
                      )}
                    </div>
                  </div>

                </div>
              )
            } else {
              const w = item.data
              return (
                <div 
                  key={w.id}
                  className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-xs hover:shadow-lg transition-all duration-200 flex flex-col justify-between space-y-4 group"
                >
                  <div className="space-y-3">
                    {/* Header Badge */}
                    <div className="flex items-center justify-between">
                      <span className="bg-indigo-50 text-indigo-700 border border-indigo-200/80 text-[11px] font-extrabold px-3 py-1 rounded-full flex items-center gap-1.5">
                        <ClipboardCheck size={13} /> ใบงานบริการ (Worksheet)
                      </span>
                      <span className="text-[11px] font-semibold text-slate-400">
                        {new Date(w.service_date).toLocaleDateString('th-TH')}
                      </span>
                    </div>

                    {/* Doc No & Customer */}
                    <div>
                      <div className="text-base font-black text-indigo-600 font-mono tracking-tight group-hover:text-indigo-700 transition-colors">
                        {w.worksheet_no}
                      </div>
                      <h3 className="text-sm font-bold text-slate-900 mt-1 flex items-center gap-1.5">
                        <Building2 size={16} className="text-slate-400 shrink-0" />
                        <span className="truncate">{w.customer_name}</span>
                      </h3>
                      {w.province && (
                        <div className="text-xs text-slate-500 font-medium pl-5 mt-0.5">
                          จ.{w.province} {w.installation_spot ? `(${w.installation_spot})` : ''}
                        </div>
                      )}
                    </div>

                    {/* Equipment & Work Details */}
                    <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-100 space-y-1">
                      <div className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                        <Wrench size={14} className="text-indigo-600" />
                        <span>{w.product_type} - {w.brand} {w.model}</span>
                      </div>
                      {w.serial_no && (
                        <div className="text-[11px] font-mono text-slate-500 pl-5">
                          S/N: {w.serial_no}
                        </div>
                      )}
                      <div className="text-xs text-slate-700 font-mono mt-1 pt-1 border-t border-slate-200/60 line-clamp-2">
                        {w.work_details}
                      </div>
                    </div>
                  </div>

                  {/* Card Actions */}
                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                    <div className="text-slate-400 text-[11px]">
                      ช่าง: {w.technician_name}
                    </div>

                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => setSelectedWorksheet(w)}
                        className="px-3 py-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 rounded-xl font-bold transition-colors flex items-center gap-1 cursor-pointer"
                      >
                        <Eye size={14} /> ดูรายละเอียด
                      </button>

                      {currentUser.role === 'ADMIN' && (
                        <button
                          onClick={() => setDeleteTarget({ type: 'WORKSHEET', id: w.id, title: w.worksheet_no })}
                          className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-colors cursor-pointer"
                        >
                          <Trash2 size={15} />
                        </button>
                      )}
                    </div>
                  </div>

                </div>
              )
            }
          })}
        </div>
      ) : (
        /* TABLE VIEW: Spacious, Readable Table */
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-900 text-white font-bold border-b border-slate-800">
                  <th className="p-4 px-5">ประเภทเอกสาร</th>
                  <th className="p-4">เลขที่เอกสาร</th>
                  <th className="p-4">ชื่อลูกค้า / บริษัท</th>
                  <th className="p-4">อุปกรณ์ / ยี่ห้อ / รุ่น</th>
                  <th className="p-4">วันที่ดำเนินการ</th>
                  <th className="p-4 text-center">จัดการ</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                {filteredItems.map((item) => {
                  if (item.kind === 'TICKET') {
                    const t = item.data
                    return (
                      <tr key={t.id} className="hover:bg-blue-50/40 transition-colors">
                        <td className="p-4 px-5">
                          <span className="bg-blue-50 text-blue-700 border border-blue-200 px-2.5 py-0.5 rounded-full font-bold text-[11px]">
                            ใบแจ้งงานซ่อม
                          </span>
                        </td>
                        <td className="p-4 font-bold text-blue-600 font-mono">
                          {t.ticket_no}
                        </td>
                        <td className="p-4 font-semibold text-slate-900">
                          {t.company.name}
                          <div className="text-[11px] text-slate-400 font-normal">{t.contact.name} ({t.contact.phone})</div>
                        </td>
                        <td className="p-4">
                          <span className="font-semibold text-slate-800">{t.product.brand} {t.product.model}</span>
                          {t.serial_no && <div className="text-[11px] font-mono text-slate-500">S/N: {t.serial_no}</div>}
                        </td>
                        <td className="p-4 whitespace-nowrap text-slate-600">
                          {new Date(t.receive_date).toLocaleDateString('th-TH')}
                        </td>
                        <td className="p-4 text-center">
                          <div className="flex items-center justify-center gap-1.5">
                            {t.file_path && (
                              <a
                                href={t.file_path}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="p-2 text-blue-600 hover:bg-blue-100 rounded-xl transition-colors"
                                title="ดู PDF"
                              >
                                <Eye size={16} />
                              </a>
                            )}
                            {currentUser.role === 'ADMIN' && (
                              <button
                                onClick={() => setDeleteTarget({ type: 'TICKET', id: t.id, title: t.ticket_no })}
                                className="p-2 text-red-500 hover:bg-red-100 rounded-xl transition-colors cursor-pointer"
                                title="ลบใบแจ้งงานซ่อม"
                              >
                                <Trash2 size={16} />
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    )
                  } else {
                    const w = item.data
                    return (
                      <tr key={w.id} className="hover:bg-indigo-50/40 transition-colors">
                        <td className="p-4 px-5">
                          <span className="bg-indigo-50 text-indigo-700 border border-indigo-200 px-2.5 py-0.5 rounded-full font-bold text-[11px]">
                            Worksheet
                          </span>
                        </td>
                        <td className="p-4 font-bold text-indigo-600 font-mono">
                          {w.worksheet_no}
                        </td>
                        <td className="p-4 font-semibold text-slate-900">
                          {w.customer_name}
                          {w.province && <div className="text-[11px] text-slate-400 font-normal">จ.{w.province}</div>}
                        </td>
                        <td className="p-4">
                          <span className="font-semibold text-slate-800">{w.product_type} - {w.brand} {w.model}</span>
                          {w.serial_no && <div className="text-[11px] font-mono text-slate-500">S/N: {w.serial_no}</div>}
                        </td>
                        <td className="p-4 whitespace-nowrap text-slate-600">
                          {new Date(w.service_date).toLocaleDateString('th-TH')}
                        </td>
                        <td className="p-4 text-center">
                          <div className="flex items-center justify-center gap-1.5">
                            <button
                              onClick={() => setSelectedWorksheet(w)}
                              className="p-2 text-indigo-600 hover:bg-indigo-100 rounded-xl transition-colors cursor-pointer"
                              title="ดูรายละเอียดใบงาน"
                            >
                              <Eye size={16} />
                            </button>
                            {currentUser.role === 'ADMIN' && (
                              <button
                                onClick={() => setDeleteTarget({ type: 'WORKSHEET', id: w.id, title: w.worksheet_no })}
                                className="p-2 text-red-500 hover:bg-red-100 rounded-xl transition-colors cursor-pointer"
                                title="ลบใบงานบริการ"
                              >
                                <Trash2 size={16} />
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    )
                  }
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl border border-slate-200 space-y-4">
            <h3 className="text-lg font-bold text-slate-900">ยืนยันการลบเอกสาร</h3>
            <p className="text-xs text-slate-600">
              คุณต้องการลบรายการเอกสาร <span className="font-bold text-red-600">{deleteTarget.title}</span> หรือไม่? การดำเนินการนี้ไม่สามารถย้อนกลับได้
            </p>
            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setDeleteTarget(null)}
                className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100 transition-colors"
              >
                ยกเลิก
              </button>
              <button
                onClick={handleDeleteConfirm}
                disabled={isDeleting}
                className="px-5 py-2 rounded-xl text-xs font-bold bg-red-600 hover:bg-red-700 text-white shadow-md shadow-red-600/30 transition-all disabled:opacity-50"
              >
                {isDeleting ? 'กำลังลบ...' : 'ยืนยันลบข้อมูล'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Worksheet Detail Viewer Modal */}
      {selectedWorksheet && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200 overflow-y-auto">
          <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 w-full max-w-3xl max-h-[90vh] flex flex-col overflow-hidden my-auto">
            {/* Header */}
            <div className="bg-slate-900 text-white p-5 px-6 flex items-center justify-between border-b border-slate-800 shrink-0">
              <div>
                <span className="text-xs font-bold text-indigo-400 uppercase tracking-wider">รายละเอียดใบบันทึกผลการดำเนินงาน</span>
                <h2 className="text-lg font-extrabold">{selectedWorksheet.worksheet_no}</h2>
              </div>
              <button
                onClick={() => setSelectedWorksheet(null)}
                className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6 overflow-y-auto space-y-6 text-xs text-slate-700">
              
              {/* Status Badges */}
              <div className="flex flex-wrap gap-2">
                {selectedWorksheet.doc_types?.map(dt => (
                  <span key={dt} className="bg-indigo-50 text-indigo-700 border border-indigo-200 px-3 py-1 rounded-full font-bold">
                    {dt}
                  </span>
                ))}
                <span className="bg-slate-100 text-slate-700 px-3 py-1 rounded-full font-bold">
                  {selectedWorksheet.warranty_status}
                </span>
              </div>

              {/* Customer & Location */}
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-2">
                <div className="font-bold text-slate-900 text-sm flex items-center gap-2">
                  <Building2 size={16} className="text-indigo-600" /> {selectedWorksheet.customer_name}
                </div>
                {selectedWorksheet.address && <p className="text-slate-600">ที่อยู่: {selectedWorksheet.address} {selectedWorksheet.province}</p>}
                {selectedWorksheet.installation_spot && <p className="text-slate-600">จุดติดตั้ง: {selectedWorksheet.installation_spot}</p>}
              </div>

              {/* Equipment */}
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-2">
                <div className="font-bold text-slate-900 text-sm flex items-center gap-2">
                  <Wrench size={16} className="text-indigo-600" /> ข้อมูลอุปกรณ์
                </div>
                <div className="grid grid-cols-2 gap-2 text-slate-700">
                  <div><span className="font-bold">ประเภท:</span> {selectedWorksheet.product_type}</div>
                  <div><span className="font-bold">ยี่ห้อ:</span> {selectedWorksheet.brand}</div>
                  <div><span className="font-bold">รุ่น:</span> {selectedWorksheet.model}</div>
                  <div><span className="font-bold">S/N:</span> {selectedWorksheet.serial_no || '-'}</div>
                </div>
              </div>

              {/* Symptom & Details */}
              {selectedWorksheet.symptom && (
                <div>
                  <h4 className="font-bold text-slate-900 mb-1">อาการเสีย:</h4>
                  <p className="p-3 bg-amber-50 text-amber-900 rounded-xl border border-amber-200 font-medium">
                    {selectedWorksheet.symptom}
                  </p>
                </div>
              )}

              <div>
                <h4 className="font-bold text-slate-900 mb-1">รายละเอียดการดำเนินงาน:</h4>
                <div className="p-4 bg-slate-950 text-slate-100 rounded-2xl font-mono whitespace-pre-wrap leading-relaxed">
                  {selectedWorksheet.work_details}
                </div>
              </div>

              {/* Job Status */}
              {selectedWorksheet.job_status && selectedWorksheet.job_status.length > 0 && (
                <div>
                  <h4 className="font-bold text-slate-900 mb-1.5">สถานะงาน:</h4>
                  <div className="flex flex-wrap gap-1.5">
                    {selectedWorksheet.job_status.map(js => (
                      <span key={js} className="bg-emerald-50 text-emerald-800 border border-emerald-200 px-2.5 py-1 rounded-lg font-semibold flex items-center gap-1">
                        <CheckCircle2 size={12} /> {js}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Signature Display */}
              {selectedWorksheet.signature_data && (
                <div className="pt-2 border-t border-slate-200">
                  <h4 className="font-bold text-slate-900 mb-2">ลายเซ็นต์ลูกค้า:</h4>
                  <div className="border border-slate-200 rounded-2xl p-2 bg-white w-fit">
                    <img src={selectedWorksheet.signature_data} alt="Customer Signature" className="max-h-24 object-contain" />
                  </div>
                  {selectedWorksheet.contact_person && (
                    <p className="text-slate-500 mt-1 font-semibold">
                      ลงนามโดย: {selectedWorksheet.contact_person} ({selectedWorksheet.contact_position || 'ลูกค้า'})
                    </p>
                  )}
                </div>
              )}

            </div>

            {/* Modal Footer */}
            <div className="bg-slate-100 p-4 px-6 border-t border-slate-200 flex justify-end shrink-0">
              <button
                onClick={() => setSelectedWorksheet(null)}
                className="px-5 py-2.5 bg-slate-800 hover:bg-slate-900 text-white rounded-xl font-bold text-xs transition-colors"
              >
                ปิดหน้าต่าง
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  )
}
