"use client"

import React from 'react'
import { Eye, Trash2, FileText, ClipboardCheck, Calendar, Building2, Wrench } from 'lucide-react'
import { Tooltip } from '@/app/components/ui'
import { TicketKindItem, WorksheetItem, UserItem, DeleteTargetType } from '../types'

interface TicketTableProps {
  items: TicketKindItem[]
  currentUser: UserItem
  setSelectedWorksheet: (w: WorksheetItem) => void
  setDeleteTarget: (target: DeleteTargetType) => void
}

export default function TicketTable({
  items,
  currentUser,
  setSelectedWorksheet,
  setDeleteTarget
}: TicketTableProps) {
  return (
    <div className="bg-white rounded-3xl border border-slate-200/80 shadow-2xs overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="bg-slate-900 text-white font-bold border-b border-slate-800">
              <th className="p-4 px-6">ประเภทเอกสาร</th>
              <th className="p-4">เลขที่เอกสาร</th>
              <th className="p-4">ชื่อลูกค้า / บริษัท</th>
              <th className="p-4">อุปกรณ์ / ยี่ห้อ / รุ่น</th>
              <th className="p-4">วันที่ดำเนินการ</th>
              <th className="p-4 text-center">จัดการ</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
            {items.map((item) => {
              if (item.kind === 'TICKET') {
                const t = item.data
                return (
                  <tr key={t.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="p-4 px-6">
                      <span className="bg-brand-primary/10 text-brand-primary border border-brand-primary/20 px-3 py-1 rounded-full font-extrabold text-[11px] inline-flex items-center gap-1.5 shadow-2xs">
                        <FileText size={12} /> ใบแจ้งซ่อม
                      </span>
                    </td>
                    <td className="p-4 font-black text-brand-primary font-mono text-sm tracking-tight">
                      {t.ticket_no}
                    </td>
                    <td className="p-4 font-semibold text-slate-900">
                      <div className="flex items-center gap-1.5">
                        <Building2 size={14} className="text-slate-400 shrink-0" />
                        <span>{t.company.name}</span>
                      </div>
                      <div className="text-[11px] text-slate-400 font-normal pl-5 mt-0.5">{t.contact.name} ({t.contact.phone})</div>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-1.5 font-semibold text-slate-800">
                        <Wrench size={14} className="text-brand-primary shrink-0" />
                        <span>{t.product.brand} {t.product.model}</span>
                      </div>
                      {t.serial_no && <div className="text-[11px] font-mono text-slate-400 pl-5">S/N: {t.serial_no}</div>}
                    </td>
                    <td className="p-4 whitespace-nowrap text-slate-600 font-mono">
                      <div className="flex items-center gap-1.5">
                        <Calendar size={13} className="text-slate-400" />
                        <span>{new Date(t.receive_date).toLocaleDateString('th-TH')}</span>
                      </div>
                    </td>
                    <td className="p-4 text-center">
                      <div className="flex items-center justify-center gap-1.5">
                        {t.file_path && (
                          <Tooltip content="ดู PDF" position="top">
                            <a
                              href={t.file_path}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="p-2 text-brand-primary hover:bg-brand-primary/10 rounded-xl transition-colors inline-block cursor-pointer"
                            >
                              <Eye size={16} />
                            </a>
                          </Tooltip>
                        )}
                        {currentUser.role === 'ADMIN' && (
                          <Tooltip content="ลบ" position="top">
                            <button
                              onClick={() => setDeleteTarget({ type: 'TICKET', id: t.id, title: t.ticket_no })}
                              className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-colors cursor-pointer inline-block"
                            >
                              <Trash2 size={16} />
                            </button>
                          </Tooltip>
                        )}
                      </div>
                    </td>
                  </tr>
                )
              } else {
                const w = item.data
                return (
                  <tr key={w.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="p-4 px-6">
                      <span className="bg-brand-secondary/10 text-brand-secondary border border-brand-secondary/20 px-3 py-1 rounded-full font-extrabold text-[11px] inline-flex items-center gap-1.5 shadow-2xs">
                        <ClipboardCheck size={12} /> Worksheet
                      </span>
                    </td>
                    <td className="p-4 font-black text-brand-secondary font-mono text-sm tracking-tight">
                      {w.worksheet_no}
                    </td>
                    <td className="p-4 font-semibold text-slate-900">
                      <div className="flex items-center gap-1.5">
                        <Building2 size={14} className="text-slate-400 shrink-0" />
                        <span>{w.customer_name}</span>
                      </div>
                      {w.province && <div className="text-[11px] text-slate-400 font-normal pl-5 mt-0.5">จ.{w.province}</div>}
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-1.5 font-semibold text-slate-800">
                        <Wrench size={14} className="text-brand-secondary shrink-0" />
                        <span>{w.product_type} - {w.brand} {w.model}</span>
                      </div>
                      {w.serial_no && <div className="text-[11px] font-mono text-slate-400 pl-5">S/N: {w.serial_no}</div>}
                    </td>
                    <td className="p-4 whitespace-nowrap text-slate-600 font-mono">
                      <div className="flex items-center gap-1.5">
                        <Calendar size={13} className="text-slate-400" />
                        <span>{new Date(w.service_date).toLocaleDateString('th-TH')}</span>
                      </div>
                    </td>
                    <td className="p-4 text-center">
                      <div className="flex items-center justify-center gap-1.5">
                        <button
                          onClick={() => setSelectedWorksheet(w)}
                          className="p-2 text-brand-secondary hover:bg-brand-secondary/10 rounded-xl transition-colors cursor-pointer inline-block"
                        >
                          <Eye size={16} />
                        </button>
                        {currentUser.role === 'ADMIN' && (
                          <Tooltip content="ลบ" position="top">
                            <button
                              onClick={() => setDeleteTarget({ type: 'WORKSHEET', id: w.id, title: w.worksheet_no })}
                              className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-colors cursor-pointer inline-block"
                            >
                              <Trash2 size={16} />
                            </button>
                          </Tooltip>
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
  )
}
