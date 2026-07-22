"use client"

import { useState } from 'react'
import { Modal } from '@/app/components/ui/Modal'
import { updateTicketStatus } from '@/app/actions/ticketActions'
import { StatusBadge } from '@/app/components/ui/Badge'
import { Toast } from '@/app/components/ui/Toast'
import { Wrench } from 'lucide-react'

interface TicketStatusModalProps {
  isOpen: boolean
  onClose: () => void
  ticket: {
    id: string
    ticket_no: string
    status: string
    company: { name: string }
    product: { brand: string; model: string }
  } | null
  onSuccess: () => void
}

const STATUS_OPTIONS = [
  'รอเปิดงานซ่อม',
  'กำลังตรวจเช็ค/ซ่อม',
  'รอส่งคืนลูกค้า',
  'ส่งคืนเรียบร้อย',
  'ยกเลิก'
]

export default function TicketStatusModal({
  isOpen,
  onClose,
  ticket,
  onSuccess
}: TicketStatusModalProps) {
  const [selectedStatus, setSelectedStatus] = useState<string>('')
  const [isLoading, setIsLoading] = useState(false)
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null)

  if (!ticket) return null

  const currentStatus = selectedStatus || ticket.status

  async function handleSave() {
    if (!ticket) return
    setIsLoading(true)
    const res = await updateTicketStatus(ticket.id, currentStatus)
    setIsLoading(false)

    if (res.success) {
      onSuccess()
      onClose()
    } else {
      setToast({ message: res.error || 'เกิดข้อผิดพลาดในการบันทึกสถานะ', type: 'error' })
    }
  }

  return (
    <>
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
      <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="อัปเดตสถานะงานซ่อม"
      description={`ใบรับคืนเลขที่: ${ticket.ticket_no}`}
      confirmLabel="บันทึกการเปลี่ยนสถานะ"
      onConfirm={handleSave}
      isLoading={isLoading}
    >
      <div className="space-y-6">
        {/* Ticket Summary */}
        <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200/60 space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-slate-500">บริษัท:</span>
            <span className="font-bold text-slate-800">{ticket.company.name}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-500">อุปกรณ์:</span>
            <span className="font-semibold text-slate-800">{ticket.product.brand} {ticket.product.model}</span>
          </div>
          <div className="flex justify-between items-center pt-2 border-t border-slate-200/50">
            <span className="text-slate-500">สถานะปัจจุบัน:</span>
            <StatusBadge status={ticket.status} />
          </div>
        </div>

        {/* Status Selection */}
        <div className="space-y-3">
          <label className="block text-sm font-semibold text-slate-900 flex items-center gap-1.5">
            <Wrench size={16} className="text-blue-600" /> เลือกสถานะใหม่
          </label>
          <div className="space-y-2">
            {STATUS_OPTIONS.map((st) => (
              <label
                key={st}
                className={`
                  flex items-center justify-between p-3.5 rounded-2xl border cursor-pointer transition-all
                  ${currentStatus === st
                    ? 'border-blue-600 bg-blue-50/60 font-bold shadow-xs'
                    : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                  }
                `}
              >
                <div className="flex items-center gap-3">
                  <input
                    type="radio"
                    name="status"
                    value={st}
                    checked={currentStatus === st}
                    onChange={(e) => setSelectedStatus(e.target.value)}
                    className="w-4 h-4 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-sm text-slate-800">{st}</span>
                </div>
                <StatusBadge status={st} />
              </label>
            ))}
          </div>
        </div>
      </div>
    </Modal>
    </>
  )
}
