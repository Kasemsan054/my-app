"use client"

import React from 'react'
import { Layers, ChevronDown, ChevronRight, Pencil, Trash2, Tag } from 'lucide-react'
import { Product, DeleteTarget } from '../../types'

interface BrandCardProps {
  brandName: string
  brandItems: Product[]
  isCollapsed: boolean
  toggleBrandCollapse: (brandName: string) => void
  setEditBrandTarget: (brandName: string) => void
  setEditBrandNameInput: (brandName: string) => void
  setDeleteTarget: (target: DeleteTarget) => void
  setEditProductTarget: (product: Product) => void
  setEditBrandInput: (v: string) => void
  setEditModelInput: (v: string) => void
  modelInputs: Record<string, string>
  setModelInputs: React.Dispatch<React.SetStateAction<Record<string, string>>>
  handleAddModelToBrand: (e: React.FormEvent, brandName: string) => void
}

export default function BrandCard({
  brandName,
  brandItems,
  isCollapsed,
  toggleBrandCollapse,
  setEditBrandTarget,
  setEditBrandNameInput,
  setDeleteTarget,
  setEditProductTarget,
  setEditBrandInput,
  setEditModelInput,
  modelInputs,
  setModelInputs,
  handleAddModelToBrand
}: BrandCardProps) {
  return (
    <div className="bg-white border border-slate-100 rounded-2xl p-5 space-y-4 shadow-sm transition-all duration-300 hover:shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:border-brand-secondary/20 group/card relative overflow-hidden">
      <div className="absolute top-0 left-0 w-1 h-full bg-slate-200 group-hover/card:bg-brand-secondary transition-colors duration-300"></div>
      <div className="flex justify-between items-center border-b border-slate-200/50 pb-2">
        <div
          onClick={() => toggleBrandCollapse(brandName)}
          className="flex items-center gap-2 cursor-pointer select-none group/title"
        >
          <button type="button" className="text-slate-400 group-hover/title:text-brand-secondary p-0.5 transition-colors">
            {isCollapsed ? <ChevronRight size={18} /> : <ChevronDown size={18} />}
          </button>
          <span className="font-bold text-sm text-slate-900 flex items-center gap-2">
            <Layers size={16} className="text-amber-600" />
            {brandName}
          </span>
          <span className="bg-amber-100 text-amber-800 text-[11px] font-semibold px-2 py-0.5 rounded-full">
            {brandItems.length} รุ่น
          </span>
        </div>

        <div className="flex items-center gap-1">
          <button
            onClick={() => {
              setEditBrandTarget(brandName)
              setEditBrandNameInput(brandName)
            }}
            className="text-slate-400 hover:text-amber-600 hover:bg-amber-50 p-1.5 rounded-xl transition-colors cursor-pointer"
            title="แก้ไขชื่อแบรนด์"
          >
            <Pencil size={15} />
          </button>
          <button
            onClick={() => setDeleteTarget({ type: 'brand', id: brandName, name: `แบรนด์ ${brandName} และอุปกรณ์ทั้งหมดในแบรนด์นี้` })}
            className="text-slate-400 hover:text-red-600 hover:bg-red-50 p-1.5 rounded-xl transition-colors cursor-pointer"
            title="ลบแบรนด์และรุ่นทั้งหมด"
          >
            <Trash2 size={15} />
          </button>
        </div>
      </div>

      {/* Models under this Brand (Visible when NOT collapsed) */}
      {!isCollapsed && (
        <div className="pl-3 border-l-2 border-amber-200 space-y-2 animate-fade-in">
          {brandItems.map(item => (
            <div key={item.id} className="flex justify-between items-center text-xs bg-white border border-slate-100 p-3 rounded-xl shadow-[0_2px_10px_rgb(0,0,0,0.02)] transition-all hover:border-brand-secondary/30 group/item">
              <span className="font-medium text-slate-800 flex items-center gap-2">
                <Tag size={13} className="text-slate-400 group-hover/item:text-brand-secondary transition-colors" />
                {item.model}
              </span>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => {
                    setEditProductTarget(item)
                    setEditBrandInput(item.brand)
                    setEditModelInput(item.model)
                  }}
                  className="text-slate-400 hover:text-brand-primary hover:bg-brand-primary-light p-1.5 rounded-lg transition-colors cursor-pointer"
                  title="แก้ไขข้อมูลรุ่น"
                >
                  <Pencil size={14} />
                </button>
                <button
                  onClick={() => setDeleteTarget({ type: 'product', id: item.id, name: `รุ่น ${item.model} (แบรนด์ ${item.brand})` })}
                  className="text-slate-300 hover:text-red-600 hover:bg-red-50 p-1.5 rounded-lg transition-colors cursor-pointer"
                  title="ลบรุ่นนี้"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          ))}

          {/* Form: Add Model directly under this brand */}
          <form onSubmit={(e) => handleAddModelToBrand(e, brandName)} className="flex gap-2 pt-1">
            <input
              type="text"
              placeholder={`+ เพิ่มรุ่นใหม่ในแบรนด์ ${brandName}...`}
              value={modelInputs[brandName] || ''}
              onChange={(e) => setModelInputs(prev => ({ ...prev, [brandName]: e.target.value }))}
              required
              className="flex-1 bg-white border border-slate-200 text-xs p-2.5 rounded-xl outline-none focus:border-slate-900"
            />
            <button type="submit" className="bg-amber-600 hover:bg-amber-700 text-white px-3 rounded-xl text-xs font-bold transition-colors shrink-0 cursor-pointer">
              เพิ่มรุ่น
            </button>
          </form>
        </div>
      )}
    </div>
  )
}
