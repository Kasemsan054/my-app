"use client"

import React from 'react'
import { Modal } from '@/app/components/ui/Modal'
import { Tag } from 'lucide-react'
import { Company, Contact, Product, DeleteTarget } from '../../types'

interface SettingsModalsProps {
  // Edit Company Modal
  editCompanyTarget: Company | null
  setEditCompanyTarget: (c: Company | null) => void
  editCompanyNameInput: string
  setEditCompanyNameInput: (v: string) => void
  editCompanyBranchInput: string
  setEditCompanyBranchInput: (v: string) => void
  editCompanyBrands: string[]
  setEditCompanyBrands: React.Dispatch<React.SetStateAction<string[]>>
  isUpdatingCompany: boolean
  handleUpdateCompany: (e: React.FormEvent) => void
  existingBrands: string[]

  // Edit Contact Modal
  editContactTarget: Contact | null
  setEditContactTarget: (c: Contact | null) => void
  editContactNameInput: string
  setEditContactNameInput: (v: string) => void
  editContactPhoneInput: string
  setEditContactPhoneInput: (v: string) => void
  isUpdatingContact: boolean
  handleUpdateContact: (e: React.FormEvent) => void

  // Edit Product Modal
  editProductTarget: Product | null
  setEditProductTarget: (p: Product | null) => void
  editBrandInput: string
  setEditBrandInput: (v: string) => void
  editModelInput: string
  setEditModelInput: (v: string) => void
  isUpdatingProduct: boolean
  handleUpdateProduct: (e: React.FormEvent) => void

  // Edit Brand Modal
  editBrandTarget: string | null
  setEditBrandTarget: (b: string | null) => void
  editBrandNameInput: string
  setEditBrandNameInput: (v: string) => void
  isUpdatingBrandName: boolean
  handleUpdateBrand: (e: React.FormEvent) => void

  // Delete Modal
  deleteTarget: DeleteTarget
  setDeleteTarget: (target: DeleteTarget) => void
  isDeleting: boolean
  handleDeleteConfirm: () => void
}

export default function SettingsModals({
  editCompanyTarget,
  setEditCompanyTarget,
  editCompanyNameInput,
  setEditCompanyNameInput,
  editCompanyBranchInput,
  setEditCompanyBranchInput,
  editCompanyBrands,
  setEditCompanyBrands,
  isUpdatingCompany,
  handleUpdateCompany,
  existingBrands,

  editContactTarget,
  setEditContactTarget,
  editContactNameInput,
  setEditContactNameInput,
  editContactPhoneInput,
  setEditContactPhoneInput,
  isUpdatingContact,
  handleUpdateContact,

  editProductTarget,
  setEditProductTarget,
  editBrandInput,
  setEditBrandInput,
  editModelInput,
  setEditModelInput,
  isUpdatingProduct,
  handleUpdateProduct,

  editBrandTarget,
  setEditBrandTarget,
  editBrandNameInput,
  setEditBrandNameInput,
  isUpdatingBrandName,
  handleUpdateBrand,

  deleteTarget,
  setDeleteTarget,
  isDeleting,
  handleDeleteConfirm
}: SettingsModalsProps) {
  return (
    <>
      {/* Modal: Edit Company */}
      <Modal
        isOpen={!!editCompanyTarget}
        onClose={() => setEditCompanyTarget(null)}
        title="แก้ไขข้อมูลบริษัทและสาขา"
      >
        <form onSubmit={handleUpdateCompany} className="space-y-4">
          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1">ชื่อบริษัท *</label>
            <input
              type="text"
              value={editCompanyNameInput}
              onChange={(e) => setEditCompanyNameInput(e.target.value)}
              required
              className="w-full bg-slate-50 border border-slate-200 py-2.5 px-3.5 rounded-xl text-sm outline-none focus:border-slate-900"
            />
          </div>
          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1">ชื่อสาขา</label>
            <input
              type="text"
              value={editCompanyBranchInput}
              onChange={(e) => setEditCompanyBranchInput(e.target.value)}
              placeholder="สาขา (เช่น สำนักงานใหญ่)"
              className="w-full bg-slate-50 border border-slate-200 py-2.5 px-3.5 rounded-xl text-sm outline-none focus:border-slate-900"
            />
          </div>

          <div className="space-y-1.5 pt-1">
            <label className="text-xs font-bold text-slate-700 flex items-center gap-1">
              <Tag size={12} className="text-amber-600" /> ยี่ห้ออุปกรณ์ที่มีที่ลูกค้ารายนี้:
            </label>
            {existingBrands.length === 0 ? (
              <div className="text-[11px] text-slate-400 italic">ยังไม่มีข้อมูลยี่ห้อในระบบ</div>
            ) : (
              <div className="flex flex-wrap gap-1.5">
                {existingBrands.map(b => {
                  const isSelected = editCompanyBrands.includes(b)
                  return (
                    <button
                      key={b}
                      type="button"
                      onClick={() => {
                        setEditCompanyBrands(prev =>
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

          <div className="flex justify-end gap-2 pt-4 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setEditCompanyTarget(null)}
              className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
            >
              ยกเลิก
            </button>
            <button
              type="submit"
              disabled={isUpdatingCompany}
              className="px-5 py-2 text-xs font-bold text-white bg-slate-900 hover:bg-slate-800 rounded-xl transition-colors shadow-sm disabled:opacity-50 cursor-pointer"
            >
              {isUpdatingCompany ? 'กำลังบันทึก...' : 'บันทึกการแก้ไข'}
            </button>
          </div>
        </form>
      </Modal>

      {/* Modal: Edit Contact */}
      <Modal
        isOpen={!!editContactTarget}
        onClose={() => setEditContactTarget(null)}
        title="แก้ไขผู้ติดต่อ"
      >
        <form onSubmit={handleUpdateContact} className="space-y-4">
          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1">ชื่อผู้ติดต่อ *</label>
            <input
              type="text"
              value={editContactNameInput}
              onChange={(e) => setEditContactNameInput(e.target.value)}
              required
              className="w-full bg-slate-50 border border-slate-200 py-2.5 px-3.5 rounded-xl text-sm outline-none focus:border-slate-900"
            />
          </div>
          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1">เบอร์โทรศัพท์ *</label>
            <input
              type="text"
              value={editContactPhoneInput}
              onChange={(e) => setEditContactPhoneInput(e.target.value)}
              required
              className="w-full bg-slate-50 border border-slate-200 py-2.5 px-3.5 rounded-xl text-sm outline-none focus:border-slate-900"
            />
          </div>
          <div className="flex justify-end gap-2 pt-4 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setEditContactTarget(null)}
              className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
            >
              ยกเลิก
            </button>
            <button
              type="submit"
              disabled={isUpdatingContact}
              className="px-5 py-2 text-xs font-bold text-white bg-brand-primary hover:bg-brand-primary-hover rounded-xl transition-colors shadow-sm disabled:opacity-50 cursor-pointer"
            >
              {isUpdatingContact ? 'กำลังบันทึก...' : 'บันทึกการแก้ไข'}
            </button>
          </div>
        </form>
      </Modal>

      {/* Modal: Edit Product (Model & Brand) */}
      <Modal
        isOpen={!!editProductTarget}
        onClose={() => setEditProductTarget(null)}
        title="แก้ไขข้อมูลอุปกรณ์"
      >
        <form onSubmit={handleUpdateProduct} className="space-y-4">
          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1">แบรนด์ *</label>
            <input
              type="text"
              list="edit-brand-suggestions"
              value={editBrandInput}
              onChange={(e) => setEditBrandInput(e.target.value)}
              required
              className="w-full bg-slate-50 border border-slate-200 py-2.5 px-3.5 rounded-xl text-sm outline-none focus:border-slate-900"
            />
            <datalist id="edit-brand-suggestions">
              {existingBrands.map(b => (
                <option key={b} value={b} />
              ))}
            </datalist>
          </div>
          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1">ชื่อรุ่น / โมเดล *</label>
            <input
              type="text"
              value={editModelInput}
              onChange={(e) => setEditModelInput(e.target.value)}
              required
              className="w-full bg-slate-50 border border-slate-200 py-2.5 px-3.5 rounded-xl text-sm outline-none focus:border-slate-900"
            />
          </div>
          <div className="flex justify-end gap-2 pt-4 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setEditProductTarget(null)}
              className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
            >
              ยกเลิก
            </button>
            <button
              type="submit"
              disabled={isUpdatingProduct}
              className="px-5 py-2 text-xs font-bold text-white bg-slate-900 hover:bg-slate-800 rounded-xl transition-colors shadow-sm disabled:opacity-50 cursor-pointer"
            >
              {isUpdatingProduct ? 'กำลังบันทึก...' : 'บันทึกการแก้ไข'}
            </button>
          </div>
        </form>
      </Modal>

      {/* Modal: Edit Brand Name */}
      <Modal
        isOpen={!!editBrandTarget}
        onClose={() => setEditBrandTarget(null)}
        title="แก้ไขชื่อแบรนด์"
      >
        <form onSubmit={handleUpdateBrand} className="space-y-4">
          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1">ชื่อแบรนด์ใหม่ *</label>
            <input
              type="text"
              value={editBrandNameInput}
              onChange={(e) => setEditBrandNameInput(e.target.value)}
              required
              className="w-full bg-slate-50 border border-slate-200 py-2.5 px-3.5 rounded-xl text-sm outline-none focus:border-slate-900"
            />
            <p className="text-[11px] text-slate-500 mt-1">การเปลี่ยนชื่อแบรนด์จะอัปเดตรุ่นทั้งหมดภายใต้แบรนด์นี้อัตโนมัติ</p>
          </div>
          <div className="flex justify-end gap-2 pt-4 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setEditBrandTarget(null)}
              className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
            >
              ยกเลิก
            </button>
            <button
              type="submit"
              disabled={isUpdatingBrandName}
              className="px-5 py-2 text-xs font-bold text-white bg-amber-600 hover:bg-amber-700 rounded-xl transition-colors shadow-sm disabled:opacity-50 cursor-pointer"
            >
              {isUpdatingBrandName ? 'กำลังบันทึก...' : 'บันทึกการเปลี่ยนชื่อแบรนด์'}
            </button>
          </div>
        </form>
      </Modal>

      {/* Modal: Confirm Delete */}
      <Modal
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        title="ยืนยันการลบข้อมูล"
      >
        <div className="space-y-4">
          <p className="text-sm text-slate-600">
            คุณแน่ใจหรือไม่ว่าต้องการลบ <span className="font-bold text-slate-900">{deleteTarget?.name}</span> ?
          </p>
          <p className="text-xs text-red-500 bg-red-50 p-2.5 rounded-xl border border-red-100">
            ⚠️ การดำเนินการนี้ไม่สามารถยกเลิกได้ ข้อมูลที่ลบไปแล้วจะไม่สามารถกู้คืนได้
          </p>
          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => setDeleteTarget(null)}
              className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
            >
              ยกเลิก
            </button>
            <button
              type="button"
              onClick={handleDeleteConfirm}
              disabled={isDeleting}
              className="px-5 py-2 text-xs font-bold text-white bg-red-600 hover:bg-red-700 rounded-xl transition-colors shadow-sm disabled:opacity-50 cursor-pointer"
            >
              {isDeleting ? 'กำลังลบ...' : 'ยืนยันลบข้อมูล'}
            </button>
          </div>
        </div>
      </Modal>
    </>
  )
}
