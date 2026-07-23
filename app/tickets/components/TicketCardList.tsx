"use client"

import React from 'react'
import { FileText, Building2, Wrench, Eye, Trash2, ClipboardCheck } from 'lucide-react'
import { Tooltip } from '@/app/components/ui'
import { TicketKindItem, WorksheetItem, UserItem, DeleteTargetType } from '../types'

interface TicketCardListProps {
  items: TicketKindItem[]
  currentUser: UserItem
  setSelectedWorksheet: (w: WorksheetItem) => void
  setDeleteTarget: (target: DeleteTargetType) => void
}

export default function TicketCardList({
  items,
  currentUser,
  setSelectedWorksheet,
  setDeleteTarget
}: TicketCardListProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
      {items.map((item) => {
        if (item.kind === 'TICKET') {
          const t = item.data
          return (
            <div 
              key={t.id}
              className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-2xs hover:shadow-lg hover:border-slate-300 transition-all duration-300 flex flex-col justify-between space-y-4 relative"
            >
              <div className="space-y-3">
                {/* Header Badge */}
                <div className="flex items-center justify-between">
                  <span className="bg-brand-primary-light text-brand-primary-hover border border-brand-primary-border/80 text-[11px] font-extrabold px-3 py-1 rounded-full flex items-center gap-1.5">
                    <FileText size={13} /> ใบแจ้งเปิดงานซ่อม
                  </span>
                  <span className="text-[11px] font-semibold text-slate-400">
                    {new Date(t.receive_date).toLocaleDateString('th-TH')}
                  </span>
                </div>

                {/* Doc No & Company */}
                <div>
                  <div className="text-base font-black text-brand-primary font-mono tracking-tight">
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
                    <Wrench size={14} className="text-brand-primary" />
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
                    <Tooltip content="ดู PDF" position="top">
                      <a
                        href={t.file_path}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-3.5 py-1.5 bg-brand-primary-light hover:bg-brand-primary text-brand-primary hover:text-white rounded-xl font-bold transition-all duration-200 flex items-center gap-1.5 cursor-pointer shadow-2xs"
                      >
                        <Eye size={14} /> ดู PDF
                      </a>
                    </Tooltip>
                  ) : (
                    <span className="text-[11px] text-slate-400 italic">ไม่มี PDF</span>
                  )}

                  {currentUser.role === 'ADMIN' && (
                    <Tooltip content="ลบ" position="top">
                      <button
                        onClick={() => setDeleteTarget({ type: 'TICKET', id: t.id, title: t.ticket_no })}
                        className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-colors cursor-pointer inline-block"
                      >
                        <Trash2 size={15} />
                      </button>
                    </Tooltip>
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
              className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-2xs hover:shadow-lg hover:border-slate-300 transition-all duration-300 flex flex-col justify-between space-y-4 relative"
            >
              <div className="space-y-3">
                {/* Header Badge */}
                <div className="flex items-center justify-between">
                  <span className="bg-brand-secondary-light text-brand-secondary-hover border border-brand-secondary-border/80 text-[11px] font-extrabold px-3 py-1 rounded-full flex items-center gap-1.5">
                    <ClipboardCheck size={13} /> ใบงานบริการ (Worksheet)
                  </span>
                  <span className="text-[11px] font-semibold text-slate-400">
                    {new Date(w.service_date).toLocaleDateString('th-TH')}
                  </span>
                </div>

                {/* Doc No & Customer */}
                <div>
                  <div className="text-base font-black text-brand-secondary font-mono tracking-tight">
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
                    <Wrench size={14} className="text-brand-secondary" />
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
                    className="px-3.5 py-1.5 bg-brand-secondary-light hover:bg-brand-secondary text-brand-secondary hover:text-white rounded-xl font-bold transition-all duration-200 flex items-center gap-1.5 cursor-pointer shadow-2xs"
                  >
                    <Eye size={14} /> ดูรายละเอียด
                  </button>

                  {currentUser.role === 'ADMIN' && (
                    <Tooltip content="ลบ" position="top">
                      <button
                        onClick={() => setDeleteTarget({ type: 'WORKSHEET', id: w.id, title: w.worksheet_no })}
                        className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-colors cursor-pointer inline-block"
                      >
                        <Trash2 size={15} />
                      </button>
                    </Tooltip>
                  )}
                </div>
              </div>

            </div>
          )
        }
      })}
    </div>
  )
}
