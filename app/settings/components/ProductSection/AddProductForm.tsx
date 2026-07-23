"use client"

import React from 'react'
import { Plus } from 'lucide-react'

interface AddProductFormProps {
  newBrand: string
  setNewBrand: (v: string) => void
  newModel: string
  setNewModel: (v: string) => void
  existingBrands: string[]
  handleAddProduct: (e: React.FormEvent) => void
}

export default function AddProductForm({
  newBrand,
  setNewBrand,
  newModel,
  setNewModel,
  existingBrands,
  handleAddProduct
}: AddProductFormProps) {
  return (
    <form onSubmit={handleAddProduct} className="space-y-4 bg-white p-5 rounded-2xl border border-slate-100 shadow-[0_4px_20px_rgb(0,0,0,0.03)] transition-all hover:shadow-[0_4px_25px_rgb(0,0,0,0.06)] relative overflow-hidden group">
      <div className="absolute top-0 left-0 w-1 h-full bg-brand-secondary transform -translate-x-full group-hover:translate-x-0 transition-transform duration-300"></div>
      <div className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
        <Plus size={14} className="text-amber-600" /> เพิ่มแบรนด์ / รุ่นอุปกรณ์ใหม่
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <input
            type="text"
            list="brand-suggestions"
            placeholder="แบรนด์ (เช่น HP, Cisco)"
            value={newBrand}
            onChange={(e) => setNewBrand(e.target.value)}
            required
            className="w-full bg-slate-50 border border-slate-200 py-3 px-4 rounded-xl text-sm outline-none transition-all hover:border-brand-secondary/50 focus:bg-white focus:border-brand-secondary focus:ring-4 focus:ring-brand-secondary/10"
          />
          <datalist id="brand-suggestions">
            {existingBrands.map(b => (
              <option key={b} value={b} />
            ))}
          </datalist>
        </div>
        <input
          type="text"
          placeholder="ชื่อรุ่น / โมเดล"
          value={newModel}
          onChange={(e) => setNewModel(e.target.value)}
          required
          className="w-full bg-slate-50 border border-slate-200 py-3 px-4 rounded-xl text-sm outline-none transition-all hover:border-brand-secondary/50 focus:bg-white focus:border-brand-secondary focus:ring-4 focus:ring-brand-secondary/10"
        />
      </div>
      <button
        type="submit"
        className="w-full bg-gradient-to-r from-brand-secondary to-brand-primary hover:from-brand-secondary-hover hover:to-brand-primary-hover text-white py-3 rounded-xl text-sm font-bold flex items-center justify-center gap-2 shadow-md hover:shadow-lg transition-all transform hover:-translate-y-0.5 cursor-pointer"
      >
        <Plus size={16} /> บันทึกอุปกรณ์ใหม่
      </button>
    </form>
  )
}
