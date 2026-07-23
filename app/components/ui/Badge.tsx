import React from 'react'

export type TicketStatus = 'รอเปิดงานซ่อม' | 'กำลังตรวจเช็ค/ซ่อม' | 'รอส่งคืนลูกค้า' | 'ส่งคืนเรียบร้อย' | 'ยกเลิก'

interface BadgeProps {
  status: string
  className?: string
}

export function StatusBadge({ status, className = '' }: BadgeProps) {
  let style = 'bg-slate-100 text-slate-700 border-slate-200'
  let dotColor = 'bg-slate-400'

  switch (status) {
    case 'รอเปิดงานซ่อม':
      style = 'bg-amber-50 text-amber-800 border-amber-200/60'
      dotColor = 'bg-amber-500 animate-pulse'
      break
    case 'กำลังตรวจเช็ค/ซ่อม':
      style = 'bg-brand-primary-light text-blue-800 border-brand-primary-border/60'
      dotColor = 'bg-brand-primary-light0 animate-pulse'
      break
    case 'รอส่งคืนลูกค้า':
      style = 'bg-purple-50 text-purple-800 border-purple-200/60'
      dotColor = 'bg-purple-500'
      break
    case 'ส่งคืนเรียบร้อย':
      style = 'bg-emerald-50 text-emerald-800 border-emerald-200/60'
      dotColor = 'bg-emerald-500'
      break
    case 'ยกเลิก':
      style = 'bg-rose-50 text-rose-800 border-rose-200/60'
      dotColor = 'bg-rose-500'
      break
  }

  return (
    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border ${style} ${className}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${dotColor}`} />
      {status}
    </span>
  )
}
