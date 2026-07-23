"use client"

import React from 'react'
import { Search, FileText, ClipboardCheck, LayoutGrid, List, X } from 'lucide-react'

interface TicketFilterBarProps {
  activeTab: 'ALL' | 'TICKET' | 'WORKSHEET'
  setActiveTab: (tab: 'ALL' | 'TICKET' | 'WORKSHEET') => void
  viewMode: 'CARD' | 'TABLE'
  setViewMode: (mode: 'CARD' | 'TABLE') => void
  searchQuery: string
  setSearchQuery: (query: string) => void
  ticketCount: number
  worksheetCount: number
}

export default function TicketFilterBar({
  activeTab,
  setActiveTab,
  viewMode,
  setViewMode,
  searchQuery,
  setSearchQuery,
  ticketCount,
  worksheetCount
}: TicketFilterBarProps) {
  return (
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
            <span>ทั้งหมด ({ticketCount + worksheetCount})</span>
          </button>

          <button
            onClick={() => setActiveTab('TICKET')}
            className={`
              px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2
              ${activeTab === 'TICKET'
                ? 'bg-brand-primary text-white shadow-md shadow-brand-primary/30'
                : 'text-slate-600 hover:text-slate-900'
              }
            `}
          >
            <FileText size={14} />
            <span>ใบแจ้งเปิดงานซ่อม ({ticketCount})</span>
          </button>

          <button
            onClick={() => setActiveTab('WORKSHEET')}
            className={`
              px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2
              ${activeTab === 'WORKSHEET'
                ? 'bg-brand-secondary text-white shadow-md shadow-brand-secondary/30'
                : 'text-slate-600 hover:text-slate-900'
              }
            `}
          >
            <ClipboardCheck size={14} />
            <span>ใบงานบริการ Worksheet ({worksheetCount})</span>
          </button>
        </div>

        {/* View Mode Toggle: Cards vs Table */}
        <div className="flex items-center gap-2 border border-slate-200 p-1 rounded-2xl bg-slate-50 w-fit self-end md:self-auto">
          <button
            onClick={() => setViewMode('CARD')}
            title="มุมมองแบบการ์ด (Spacious Cards)"
            className={`p-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${viewMode === 'CARD' ? 'bg-white text-slate-900 shadow-xs font-bold' : 'text-slate-500 hover:text-slate-900'
              }`}
          >
            <LayoutGrid size={16} /> <span className="hidden sm:inline">แบบการ์ด</span>
          </button>
          <button
            onClick={() => setViewMode('TABLE')}
            title="มุมมองแบบตาราง (Table List)"
            className={`p-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${viewMode === 'TABLE' ? 'bg-white text-slate-900 shadow-xs font-bold' : 'text-slate-500 hover:text-slate-900'
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
            className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-600 bg-slate-200/60 p-1 rounded-full cursor-pointer"
          >
            <X size={14} />
          </button>
        )}
      </div>
    </div>
  )
}
