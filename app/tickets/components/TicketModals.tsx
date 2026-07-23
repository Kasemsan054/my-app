"use client"

import React from 'react'
import { X, Building2, Wrench, CheckCircle2 } from 'lucide-react'
import { WorksheetItem, DeleteTargetType } from '../types'

interface TicketModalsProps {
  deleteTarget: DeleteTargetType
  setDeleteTarget: (target: DeleteTargetType) => void
  isDeleting: boolean
  handleDeleteConfirm: () => void
  selectedWorksheet: WorksheetItem | null
  setSelectedWorksheet: (w: WorksheetItem | null) => void
}

export default function TicketModals({
  deleteTarget,
  setDeleteTarget,
  isDeleting,
  handleDeleteConfirm,
  selectedWorksheet,
  setSelectedWorksheet
}: TicketModalsProps) {
  return (
    <>
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
                className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
              >
                ยกเลิก
              </button>
              <button
                onClick={handleDeleteConfirm}
                disabled={isDeleting}
                className="px-5 py-2 rounded-xl text-xs font-bold bg-red-600 hover:bg-red-700 text-white shadow-md shadow-red-600/30 transition-all disabled:opacity-50 cursor-pointer"
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
                className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl transition-colors cursor-pointer"
              >
                <X size={20} />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6 overflow-y-auto space-y-6 text-xs text-slate-700">
              
              {/* Status Badges */}
              <div className="flex flex-wrap gap-2">
                {selectedWorksheet.doc_types?.map(dt => (
                  <span key={dt} className="bg-brand-secondary-light text-brand-secondary-hover border border-brand-secondary-border px-3 py-1 rounded-full font-bold">
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
                  <Building2 size={16} className="text-brand-secondary" /> {selectedWorksheet.customer_name}
                </div>
                {selectedWorksheet.address && <p className="text-slate-600">ที่อยู่: {selectedWorksheet.address} {selectedWorksheet.province}</p>}
                {selectedWorksheet.installation_spot && <p className="text-slate-600">จุดติดตั้ง: {selectedWorksheet.installation_spot}</p>}
              </div>

              {/* Equipment */}
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-2">
                <div className="font-bold text-slate-900 text-sm flex items-center gap-2">
                  <Wrench size={16} className="text-brand-secondary" /> ข้อมูลอุปกรณ์
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
                className="px-5 py-2.5 bg-slate-800 hover:bg-slate-900 text-white rounded-xl font-bold text-xs transition-colors cursor-pointer"
              >
                ปิดหน้าต่าง
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
