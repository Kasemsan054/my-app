"use client"

import React from 'react'
import { Package, Search, ChevronsUp, ChevronsDown } from 'lucide-react'
import { Product, DeleteTarget } from '../../types'
import AddProductForm from './AddProductForm'
import BrandCard from './BrandCard'
import { appConfig } from '@/app/config/app.config'

interface ProductSectionProps {
  products: Product[]
  filteredGroupedProducts: Record<string, Product[]>
  productSearch: string
  setProductSearch: (v: string) => void
  isBrandsAllCollapsed: boolean
  toggleAllBrands: () => void
  collapsedBrands: Record<string, boolean>
  toggleBrandCollapse: (brandName: string) => void

  newBrand: string
  setNewBrand: (v: string) => void
  newModel: string
  setNewModel: (v: string) => void
  existingBrands: string[]
  handleAddProduct: (e: React.FormEvent) => void

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

export default function ProductSection({
  filteredGroupedProducts,
  productSearch,
  setProductSearch,
  isBrandsAllCollapsed,
  toggleAllBrands,
  collapsedBrands,
  toggleBrandCollapse,
  newBrand,
  setNewBrand,
  newModel,
  setNewModel,
  existingBrands,
  handleAddProduct,
  setEditBrandTarget,
  setEditBrandNameInput,
  setDeleteTarget,
  setEditProductTarget,
  setEditBrandInput,
  setEditModelInput,
  modelInputs,
  setModelInputs,
  handleAddModelToBrand
}: ProductSectionProps) {
  return (
    <section className="bg-white/80 backdrop-blur-xl p-6 rounded-[2rem] border border-white shadow-xl shadow-slate-200/40 space-y-6">
      {/* Action Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-b border-slate-100 pb-4">
        <div className="relative flex-1 w-full">
          <input
            type="text"
            placeholder="ค้นหายี่ห้อ หรือ รุ่นอุปกรณ์..."
            value={productSearch}
            onChange={(e) => setProductSearch(e.target.value)}
            className="w-full bg-white/60 backdrop-blur-sm border border-slate-200 py-3 pl-11 pr-4 rounded-2xl text-sm outline-none transition-all focus:border-brand-secondary focus:ring-4 focus:ring-brand-secondary/10 shadow-sm"
          />
          <Search className="absolute left-4 top-3.5 text-slate-400" size={18} />
        </div>
        <button
          type="button"
          onClick={toggleAllBrands}
          className="flex items-center gap-2 px-4 py-3 text-sm font-bold text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-2xl transition-all cursor-pointer shadow-sm shrink-0"
        >
          {isBrandsAllCollapsed ? (
            <>
              <ChevronsDown size={18} className="text-brand-secondary" /> ขยายทั้งหมด
            </>
          ) : (
            <>
              <ChevronsUp size={18} className="text-slate-500" /> ย่อทั้งหมด
            </>
          )}
        </button>
      </div>

      {/* Form: Add Brand & Model */}
      <AddProductForm
        newBrand={newBrand}
        setNewBrand={setNewBrand}
        newModel={newModel}
        setNewModel={setNewModel}
        existingBrands={existingBrands}
        handleAddProduct={handleAddProduct}
      />



      {/* List: Products Grouped by Brand */}
      <div className="space-y-4 max-h-[520px] overflow-y-auto pr-1">
        {Object.keys(filteredGroupedProducts).length === 0 ? (
          <div className="text-center py-8 text-slate-400 text-xs">ยังไม่มีข้อมูลอุปกรณ์ในระบบ</div>
        ) : (
          Object.entries(filteredGroupedProducts).map(([brandName, brandItems]) => (
            <BrandCard
              key={brandName}
              brandName={brandName}
              brandItems={brandItems}
              isCollapsed={collapsedBrands[brandName]}
              toggleBrandCollapse={toggleBrandCollapse}
              setEditBrandTarget={setEditBrandTarget}
              setEditBrandNameInput={setEditBrandNameInput}
              setDeleteTarget={setDeleteTarget}
              setEditProductTarget={setEditProductTarget}
              setEditBrandInput={setEditBrandInput}
              setEditModelInput={setEditModelInput}
              modelInputs={modelInputs}
              setModelInputs={setModelInputs}
              handleAddModelToBrand={handleAddModelToBrand}
            />
          ))
        )}
      </div>
    </section>
  )
}
