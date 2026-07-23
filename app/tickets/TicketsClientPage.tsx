"use client"

import { useState, useMemo, useEffect } from 'react'
import { FileText } from 'lucide-react'
import { deleteTicket } from '@/app/actions/ticketActions'
import { deleteWorksheet } from '@/app/actions/worksheetActions'
import { Toast, RealtimeSyncBar } from '@/app/components/ui'
import { TicketItem, WorksheetItem, TicketsClientPageProps, DeleteTargetType, TicketKindItem } from './types'
import TicketFilterBar from './components/TicketFilterBar'
import TicketCardList from './components/TicketCardList'
import TicketTable from './components/TicketTable'
import TicketModals from './components/TicketModals'
import { appConfig } from '@/app/config/app.config'

export default function TicketsClientPage({ initialTickets, initialWorksheets, currentUser }: TicketsClientPageProps) {
  const [tickets, setTickets] = useState<TicketItem[]>(initialTickets)
  const [worksheets, setWorksheets] = useState<WorksheetItem[]>(initialWorksheets)

  useEffect(() => {
    // eslint-disable-next-line
    setTickets(initialTickets)
  }, [initialTickets])

  useEffect(() => {
    // eslint-disable-next-line
    setWorksheets(initialWorksheets)
  }, [initialWorksheets])

  // View & Filter States
  const [activeTab, setActiveTab] = useState<'ALL' | 'TICKET' | 'WORKSHEET'>('ALL')
  const [viewMode, setViewMode] = useState<'CARD' | 'TABLE'>('CARD')
  const [searchQuery, setSearchQuery] = useState('')

  // Modals state
  const [selectedWorksheet, setSelectedWorksheet] = useState<WorksheetItem | null>(null)
  const [deleteTarget, setDeleteTarget] = useState<DeleteTargetType>(null)

  const [isDeleting, setIsDeleting] = useState(false)
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null)

  // Combine and sort all history items by date
  const combinedItems = useMemo<TicketKindItem[]>(() => {
    const list: TicketKindItem[] = []

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
          <div className="flex items-center gap-2 text-brand-primary-light font-bold text-xs uppercase tracking-wider mb-1">
            <FileText size={16} /> Central Document History Hub
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight">{appConfig.ui.tickets.title}</h1>
          <p className="text-sm text-slate-300 mt-1">
            {appConfig.ui.tickets.description}
          </p>
        </div>

        {/* Quick Stats Badges & Realtime Sync */}
        <div className="flex flex-wrap items-center gap-3">
          <RealtimeSyncBar />
          <div className="bg-slate-800/90 border border-slate-700 px-4 py-2.5 rounded-2xl text-right">
            <div className="text-[11px] text-slate-400 font-medium">เอกสารรวมทั้งหมด</div>
            <div className="text-lg font-black text-white">{tickets.length + worksheets.length} รายการ</div>
          </div>
        </div>
      </div>

      {/* Control Bar: Category Tabs & View Mode & Search */}
      <TicketFilterBar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        viewMode={viewMode}
        setViewMode={setViewMode}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        ticketCount={tickets.length}
        worksheetCount={worksheets.length}
      />

      {/* Main Content Area */}
      {filteredItems.length === 0 ? (
        <div className="bg-white rounded-3xl p-16 border border-slate-200 text-center text-slate-400 space-y-3">
          <FileText size={40} className="mx-auto text-slate-300" />
          <div className="text-sm font-bold text-slate-700">{appConfig.ui.tickets.emptyTitle}</div>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">
            {appConfig.ui.tickets.emptyDescription}
          </p>
        </div>
      ) : viewMode === 'CARD' ? (
        <TicketCardList
          items={filteredItems}
          currentUser={currentUser}
          setSelectedWorksheet={setSelectedWorksheet}
          setDeleteTarget={setDeleteTarget}
        />
      ) : (
        <TicketTable
          items={filteredItems}
          currentUser={currentUser}
          setSelectedWorksheet={setSelectedWorksheet}
          setDeleteTarget={setDeleteTarget}
        />
      )}

      {/* Modals Dialogs */}
      <TicketModals
        deleteTarget={deleteTarget}
        setDeleteTarget={setDeleteTarget}
        isDeleting={isDeleting}
        handleDeleteConfirm={handleDeleteConfirm}
        selectedWorksheet={selectedWorksheet}
        setSelectedWorksheet={setSelectedWorksheet}
      />
    </div>
  )
}
