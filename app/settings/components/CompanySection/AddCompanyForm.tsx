"use client"

import React from 'react'
import { Plus, Tag } from 'lucide-react'

interface AddCompanyFormProps {
  newCompanyName: string
  setNewCompanyName: (v: string) => void
  newCompanyBranch: string
  setNewCompanyBranch: (v: string) => void
  newCompanyBrands: string[]
  setNewCompanyBrands: React.Dispatch<React.SetStateAction<string[]>>
  existingBrands: string[]
  handleAddCompany: (e: React.FormEvent) => void
}

export default function AddCompanyForm({
  newCompanyName,
  setNewCompanyName,
  newCompanyBranch,
  setNewCompanyBranch,
  newCompanyBrands,
  setNewCompanyBrands,
  existingBrands,
  handleAddCompany
}: AddCompanyFormProps) {
  return (
    <form onSubmit={handleAddCompany} className="space-y-4 bg-white p-5 rounded-2xl border border-slate-100 shadow-[0_4px_20px_rgb(0,0,0,0.03)] transition-all hover:shadow-[0_4px_25px_rgb(0,0,0,0.06)] relative overflow-hidden group">
      <div className="absolute top-0 left-0 w-1 h-full bg-brand-primary transform -translate-x-full group-hover:translate-x-0 transition-transform duration-300"></div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
        <input
          type="text"
          value={newCompanyName}
          onChange={(e) => setNewCompanyName(e.target.value)}
          required
          placeholder="พิมพ์ชื่อบริษัทใหม่..."
          className="w-full bg-slate-50 border border-slate-200 py-3 px-4 rounded-xl text-sm outline-none transition-all hover:border-brand-primary/50 focus:bg-white focus:border-brand-primary focus:ring-4 focus:ring-brand-primary/10"
        />
        <input
          type="text"
          value={newCompanyBranch}
          onChange={(e) => setNewCompanyBranch(e.target.value)}
          placeholder="สาขา (เช่น สำนักงานใหญ่)"
          className="w-full bg-slate-50 border border-slate-200 py-3 px-4 rounded-xl text-sm outline-none transition-all hover:border-brand-primary/50 focus:bg-white focus:border-brand-primary focus:ring-4 focus:ring-brand-primary/10"
        />
        <button
          type="submit"
          className="w-full sm:col-span-2 bg-gradient-to-r from-brand-primary to-brand-secondary hover:from-brand-primary-hover hover:to-brand-secondary-hover text-white px-5 py-3 rounded-xl text-sm font-bold flex items-center justify-center gap-2 shadow-md hover:shadow-lg transition-all transform hover:-translate-y-0.5 cursor-pointer"
        >
          <Plus size={16} /> เพิ่มบริษัท
        </button>
      </div>

      {/* Brand Selector for Customer */}
      <div className="space-y-1.5 pt-1">
        <label className="text-xs font-bold text-slate-600 flex items-center gap-1">
          <Tag size={12} className="text-amber-600" /> ยี่ห้ออุปกรณ์ที่มีที่ลูกค้ารายนี้ (สำหรับกรองตัวเลือกในฟอร์ม):
        </label>
        {existingBrands.length === 0 ? (
          <div className="text-[11px] text-slate-400 italic">ยังไม่มีข้อมูลยี่ห้อในระบบ (จะแสดงทุกอุปกรณ์)</div>
        ) : (
          <div className="flex flex-wrap gap-1.5">
            {existingBrands.map(b => {
              const isSelected = newCompanyBrands.includes(b)
              return (
                <button
                  key={b}
                  type="button"
                  onClick={() => {
                    setNewCompanyBrands(prev =>
                      isSelected ? prev.filter(x => x !== b) : [...prev, b]
                    )
                  }}
                  className={`text-xs font-semibold px-2.5 py-1 rounded-lg border transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-amber-500 text-white border-amber-600 shadow-2xs'
                      : 'bg-white text-slate-600 border-slate-200 hover:border-amber-300 hover:bg-amber-50/50'
                  }`}
                >
                  {isSelected ? '✓ ' : '+ '}{b}
                </button>
              )
            })}
          </div>
        )}
      </div>
    </form>
  )
}
