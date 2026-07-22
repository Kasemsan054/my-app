"use client"

import { useState } from 'react'
import { 
  Search, Eye, Trash2, Calendar, User, Building, Wrench, Clock, FileText, CheckCircle2, X 
} from 'lucide-react'
import { deleteWorksheet } from '@/app/actions/worksheetActions'
import { WorksheetItem, UserItem } from '@/app/types'

interface WorksheetListClientProps {
  initialWorksheets: WorksheetItem[]
  currentUser?: UserItem | null
}

export default function WorksheetListClient({ initialWorksheets, currentUser }: WorksheetListClientProps) {
  const [worksheets, setWorksheets] = useState(initialWorksheets)
  const [search, setSearch] = useState('')
  const [selectedItem, setSelectedItem] = useState<WorksheetItem | null>(null)
  const [isDeleting, setIsDeleting] = useState<string | null>(null)

  const filtered = worksheets.filter(ws => {
    if (!search.trim()) return true
    const q = search.toLowerCase()
    return (
      ws.worksheet_no.toLowerCase().includes(q) ||
      ws.customer_name.toLowerCase().includes(q) ||
      ws.brand.toLowerCase().includes(q) ||
      ws.model.toLowerCase().includes(q) ||
      (ws.serial_no && ws.serial_no.toLowerCase().includes(q)) ||
      ws.technician_name.toLowerCase().includes(q)
    )
  })

  const handleDelete = async (id: string) => {
    if (!confirm('คุณแน่ใจหรือไม่ว่าต้องการลบใบงานบริการนี้?')) return
    setIsDeleting(id)
    try {
      const res = await deleteWorksheet(id)
      if (res.success) {
        setWorksheets(prev => prev.filter(w => w.id !== id))
        if (selectedItem?.id === id) setSelectedItem(null)
      } else {
        alert(res.error || 'เกิดข้อผิดพลาดในการลบใบงาน')
      }
    } catch {
      alert('เกิดข้อผิดพลาดในการลบใบงาน')
    } finally {
      setIsDeleting(null)
    }
  }

  return (
    <div className="space-y-4">
      {/* Search Input */}
      <div className="relative max-w-md">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="ค้นหาเลขที่ใบงาน, ชื่อลูกค้า, ยี่ห้อ, รุ่น, S/N..."
          className="w-full text-xs pl-10 pr-4 py-3 rounded-2xl border border-slate-200 bg-white font-medium focus:ring-2 focus:ring-blue-500 focus:outline-none shadow-xs"
        />
      </div>

      {/* Table Container */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
        {filtered.length === 0 ? (
          <div className="p-12 text-center text-slate-400 text-xs font-medium space-y-2">
            <FileText size={32} className="mx-auto text-slate-300" />
            <p>ไม่พบรายการประวัติใบงานบริการ Worksheet</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-900 text-white font-bold border-b border-slate-800">
                  <th className="p-4 px-5">เลขที่ใบงาน</th>
                  <th className="p-4">ลูกค้า</th>
                  <th className="p-4">อุปกรณ์ / ยี่ห้อ / รุ่น</th>
                  <th className="p-4">วันที่ดำเนินการ</th>
                  <th className="p-4">ช่างผู้ดำเนินการ</th>
                  <th className="p-4 text-center">จัดการ</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                {filtered.map((ws) => (
                  <tr key={ws.id} className="hover:bg-blue-50/40 transition-colors">
                    <td className="p-4 px-5 font-bold text-blue-600">
                      {ws.worksheet_no}
                      <div className="text-[10px] font-normal text-slate-400 mt-0.5">
                        {ws.doc_types?.join(', ') || 'ใบงานบริการ'}
                      </div>
                    </td>
                    <td className="p-4 font-semibold text-slate-900">
                      {ws.customer_name}
                      {ws.province && <span className="text-[11px] text-slate-400 block font-normal">จ.{ws.province}</span>}
                    </td>
                    <td className="p-4">
                      <span className="font-semibold text-slate-800">{ws.product_type}</span> {ws.brand} {ws.model}
                      {ws.serial_no && (
                        <div className="text-[11px] font-mono text-slate-500">S/N: {ws.serial_no}</div>
                      )}
                    </td>
                    <td className="p-4 text-slate-600 whitespace-nowrap">
                      {new Date(ws.service_date).toLocaleDateString('th-TH')}
                      <div className="text-[11px] text-slate-400">{ws.start_time} - {ws.end_time}</div>
                    </td>
                    <td className="p-4 font-semibold text-slate-800 whitespace-nowrap">
                      {ws.technician_name}
                    </td>
                    <td className="p-4 text-center">
                      <div className="flex items-center justify-center gap-1.5">
                        <button
                          onClick={() => setSelectedItem(ws)}
                          title="ดูรายละเอียดใบงาน"
                          className="p-2 text-blue-600 hover:bg-blue-100 rounded-xl transition-colors cursor-pointer"
                        >
                          <Eye size={16} />
                        </button>
                        {currentUser?.role === 'ADMIN' && (
                          <button
                            onClick={() => handleDelete(ws.id)}
                            disabled={isDeleting === ws.id}
                            title="ลบใบงาน"
                            className="p-2 text-red-500 hover:bg-red-100 rounded-xl transition-colors cursor-pointer disabled:opacity-50"
                          >
                            <Trash2 size={16} />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Detail Modal */}
      {selectedItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200 overflow-y-auto">
          <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 w-full max-w-3xl max-h-[90vh] flex flex-col overflow-hidden my-auto">
            {/* Header */}
            <div className="bg-slate-900 text-white p-5 px-6 flex items-center justify-between border-b border-slate-800 shrink-0">
              <div>
                <span className="text-xs font-bold text-blue-400 uppercase tracking-wider">รายละเอียดใบงาน Worksheet</span>
                <h2 className="text-lg font-extrabold">{selectedItem.worksheet_no}</h2>
              </div>
              <button
                onClick={() => setSelectedItem(null)}
                className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6 overflow-y-auto space-y-6 text-xs text-slate-700">
              
              {/* Status Badges */}
              <div className="flex flex-wrap gap-2">
                {selectedItem.doc_types?.map(dt => (
                  <span key={dt} className="bg-blue-50 text-blue-700 border border-blue-200 px-3 py-1 rounded-full font-bold">
                    {dt}
                  </span>
                ))}
                <span className="bg-slate-100 text-slate-700 px-3 py-1 rounded-full font-bold">
                  {selectedItem.warranty_status}
                </span>
              </div>

              {/* Customer & Location */}
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-2">
                <div className="font-bold text-slate-900 text-sm flex items-center gap-2">
                  <Building size={16} className="text-blue-600" /> {selectedItem.customer_name}
                </div>
                {selectedItem.address && <p className="text-slate-600">ที่อยู่: {selectedItem.address} {selectedItem.province}</p>}
                {selectedItem.installation_spot && <p className="text-slate-600">จุดติดตั้ง: {selectedItem.installation_spot}</p>}
              </div>

              {/* Equipment */}
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-2">
                <div className="font-bold text-slate-900 text-sm flex items-center gap-2">
                  <Wrench size={16} className="text-blue-600" /> ข้อมูลอุปกรณ์
                </div>
                <div className="grid grid-cols-2 gap-2 text-slate-700">
                  <div><span className="font-bold">ประเภท:</span> {selectedItem.product_type}</div>
                  <div><span className="font-bold">ยี่ห้อ:</span> {selectedItem.brand}</div>
                  <div><span className="font-bold">รุ่น:</span> {selectedItem.model}</div>
                  <div><span className="font-bold">S/N:</span> {selectedItem.serial_no || '-'}</div>
                </div>
              </div>

              {/* Symptom & Details */}
              {selectedItem.symptom && (
                <div>
                  <h4 className="font-bold text-slate-900 mb-1">อาการเสีย:</h4>
                  <p className="p-3 bg-amber-50 text-amber-900 rounded-xl border border-amber-200 font-medium">
                    {selectedItem.symptom}
                  </p>
                </div>
              )}

              <div>
                <h4 className="font-bold text-slate-900 mb-1">รายละเอียดการดำเนินงาน:</h4>
                <div className="p-4 bg-slate-950 text-slate-100 rounded-2xl font-mono whitespace-pre-wrap leading-relaxed">
                  {selectedItem.work_details}
                </div>
              </div>

              {/* Job Status */}
              {selectedItem.job_status && selectedItem.job_status.length > 0 && (
                <div>
                  <h4 className="font-bold text-slate-900 mb-1.5">สถานะงาน:</h4>
                  <div className="flex flex-wrap gap-1.5">
                    {selectedItem.job_status.map(js => (
                      <span key={js} className="bg-emerald-50 text-emerald-800 border border-emerald-200 px-2.5 py-1 rounded-lg font-semibold flex items-center gap-1">
                        <CheckCircle2 size={12} /> {js}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Signature Display */}
              {selectedItem.signature_data && (
                <div className="pt-2 border-t border-slate-200">
                  <h4 className="font-bold text-slate-900 mb-2">ลายเซ็นต์ลูกค้า:</h4>
                  <div className="border border-slate-200 rounded-2xl p-2 bg-white w-fit">
                    <img src={selectedItem.signature_data} alt="Customer Signature" className="max-h-24 object-contain" />
                  </div>
                  {selectedItem.contact_person && (
                    <p className="text-slate-500 mt-1 font-semibold">
                      ลงนามโดย: {selectedItem.contact_person} ({selectedItem.contact_position || 'ลูกค้า'})
                    </p>
                  )}
                </div>
              )}

            </div>

            {/* Modal Footer */}
            <div className="bg-slate-100 p-4 px-6 border-t border-slate-200 flex justify-end shrink-0">
              <button
                onClick={() => setSelectedItem(null)}
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
