"use client"

import React from 'react'
import { Building2, ChevronDown, ChevronRight, Pencil, Trash2, Layers, Plus } from 'lucide-react'
import { Company, Contact, DeleteTarget } from '../../types'
import ContactList from './ContactList'

interface CompanyCardProps {
  compName: string
  branchList: Company[]
  isCollapsed: boolean
  toggleCompanyCollapse: (compName: string) => void
  setEditCompanyTarget: (c: Company) => void
  setEditCompanyNameInput: (v: string) => void
  setEditCompanyBranchInput: (v: string) => void
  setEditCompanyBrands: (v: string[]) => void
  setDeleteTarget: (target: DeleteTarget) => void
  contactInputs: Record<number, { name: string; phone: string }>
  setContactInputs: React.Dispatch<React.SetStateAction<Record<number, { name: string; phone: string }>>>
  handleAddContact: (e: React.FormEvent, companyId: number) => void
  setEditContactTarget: (c: Contact) => void
  setEditContactNameInput: (v: string) => void
  setEditContactPhoneInput: (v: string) => void
  branchInputs: Record<number, string>
  setBranchInputs: React.Dispatch<React.SetStateAction<Record<number, string>>>
  handleAddBranchToCompany: (e: React.FormEvent, companyName: string, companyId: number) => void
}

export default function CompanyCard({
  compName,
  branchList,
  isCollapsed,
  toggleCompanyCollapse,
  setEditCompanyTarget,
  setEditCompanyNameInput,
  setEditCompanyBranchInput,
  setEditCompanyBrands,
  setDeleteTarget,
  contactInputs,
  setContactInputs,
  handleAddContact,
  setEditContactTarget,
  setEditContactNameInput,
  setEditContactPhoneInput,
  branchInputs,
  setBranchInputs,
  handleAddBranchToCompany
}: CompanyCardProps) {
  const isSingle = branchList.length === 1

  if (isSingle) {
    const comp = branchList[0]
    const compBrands = comp.brands || []
    return (
      <div className="bg-white border border-slate-100 rounded-2xl p-5 space-y-4 shadow-sm transition-all duration-300 hover:shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:border-brand-primary/20 group/card relative overflow-hidden">
        <div className="absolute top-0 left-0 w-1 h-full bg-slate-200 group-hover/card:bg-brand-primary transition-colors duration-300"></div>
        <div className="flex justify-between items-start border-b border-slate-200/50 pb-2">
          <div className="space-y-1">
            <div
              onClick={() => toggleCompanyCollapse(compName)}
              className="flex items-center gap-2 cursor-pointer select-none group/title"
            >
              <button type="button" className="text-slate-400 group-hover/title:text-brand-primary p-0.5 transition-colors">
                {isCollapsed ? <ChevronRight size={18} /> : <ChevronDown size={18} />}
              </button>
              <span className="font-bold text-sm text-slate-900 flex items-center gap-2">
                <Building2 size={16} className="text-brand-primary" />
                {comp.name} {comp.branch && comp.branch !== 'สำนักงานใหญ่' ? `- ${comp.branch}` : ''}
              </span>
              <span className="bg-brand-primary-light text-blue-800 text-[11px] font-semibold px-2 py-0.5 rounded-full">
                {comp.contacts.length} คน
              </span>
            </div>
            {/* Company Brands Badges */}
            <div className="pl-6 flex flex-wrap gap-1 items-center">
              <span className="text-[10px] font-bold text-slate-400">ยี่ห้อ:</span>
              {compBrands.length > 0 ? (
                compBrands.map(b => (
                  <span key={b} className="bg-amber-100 text-amber-900 border border-amber-200 text-[10px] font-bold px-2 py-0.2 rounded-md">
                    {b}
                  </span>
                ))
              ) : (
                <span className="text-[10px] text-slate-400 italic">ทุกยี่ห้อ (ไม่ได้ระบุเจาะจง)</span>
              )}
            </div>
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={() => {
                setEditCompanyTarget(comp)
                setEditCompanyNameInput(comp.name)
                setEditCompanyBranchInput(comp.branch || 'สำนักงานใหญ่')
                setEditCompanyBrands(comp.brands || [])
              }}
              className="text-slate-400 hover:text-brand-primary hover:bg-brand-primary-light p-1.5 rounded-xl transition-colors cursor-pointer"
              title="แก้ไขข้อมูลบริษัท"
            >
              <Pencil size={15} />
            </button>
            <button
              onClick={() => setDeleteTarget({ type: 'company', id: comp.id, name: `บริษัท ${comp.name}` })}
              className="text-slate-400 hover:text-red-600 hover:bg-red-50 p-1.5 rounded-xl transition-colors cursor-pointer"
              title="ลบข้อมูลบริษัท"
            >
              <Trash2 size={15} />
            </button>
          </div>
        </div>

        {/* Contacts List & Form (Visible when NOT collapsed) */}
        {!isCollapsed && (
          <div className="pl-3 border-l-2 border-slate-200 space-y-2 animate-fade-in">
            <ContactList
              companyId={comp.id}
              contacts={comp.contacts}
              contactInputs={contactInputs}
              setContactInputs={setContactInputs}
              handleAddContact={handleAddContact}
              setEditContactTarget={setEditContactTarget}
              setEditContactNameInput={setEditContactNameInput}
              setEditContactPhoneInput={setEditContactPhoneInput}
              setDeleteTarget={setDeleteTarget}
            />

            {/* Form: Add Branch under this Company */}
            <form onSubmit={(e) => handleAddBranchToCompany(e, compName, comp.id)} className="flex items-center gap-2 mt-3 pt-3 border-t border-slate-100">
              <input
                type="text"
                placeholder="เพิ่มสาขาใหม่..."
                value={branchInputs[comp.id] || ''}
                onChange={(e) => setBranchInputs(prev => ({ ...prev, [comp.id]: e.target.value }))}
                required
                className="flex-1 bg-white border border-slate-200 py-2 px-3 rounded-xl text-xs outline-none focus:border-slate-400"
              />
              <button type="submit" className="bg-slate-900 hover:bg-slate-800 text-white px-4 py-2 rounded-xl text-xs font-bold transition-colors shrink-0 cursor-pointer flex items-center gap-1">
                <Plus size={14} /> เพิ่มสาขา
              </button>
            </form>
          </div>
        )}
      </div>
    )
  }

  // Grouped layout for multiple branches
  const totalContacts = branchList.reduce((sum, b) => sum + b.contacts.length, 0)
  const allBrands = Array.from(new Set(branchList.flatMap(b => b.brands || [])))

  return (
    <div className="bg-white border border-slate-100 rounded-2xl p-5 space-y-4 shadow-sm transition-all duration-300 hover:shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:border-brand-primary/20 group/card relative overflow-hidden">
      <div className="absolute top-0 left-0 w-1 h-full bg-slate-200 group-hover/card:bg-brand-primary transition-colors duration-300"></div>
      <div className="flex justify-between items-start border-b border-slate-200/50 pb-2">
        <div className="space-y-1">
          <div
            onClick={() => toggleCompanyCollapse(compName)}
            className="flex items-center gap-2 cursor-pointer select-none group/title"
          >
            <button type="button" className="text-slate-400 group-hover/title:text-brand-primary p-0.5 transition-colors">
              {isCollapsed ? <ChevronRight size={18} /> : <ChevronDown size={18} />}
            </button>
            <span className="font-bold text-sm text-slate-900 flex items-center gap-2">
              <Building2 size={16} className="text-brand-primary" />
              {compName}
            </span>
            <span className="bg-brand-primary-light text-blue-800 text-[11px] font-semibold px-2.5 py-0.5 rounded-full">
              {branchList.length} สาขา • {totalContacts} คน
            </span>
          </div>
          {/* Company Brands Badges */}
          <div className="pl-6 flex flex-wrap gap-1 items-center">
            <span className="text-[10px] font-bold text-slate-400">ยี่ห้อ:</span>
            {allBrands.length > 0 ? (
              allBrands.map(b => (
                <span key={b} className="bg-amber-100 text-amber-900 border border-amber-200 text-[10px] font-bold px-2 py-0.2 rounded-md">
                  {b}
                </span>
              ))
            ) : (
              <span className="text-[10px] text-slate-400 italic">ทุกยี่ห้อ (ไม่ได้ระบุเจาะจง)</span>
            )}
          </div>
        </div>

        <div className="flex items-center gap-1">
          <button
            onClick={() => {
              const mainComp = branchList[0]
              setEditCompanyTarget(mainComp)
              setEditCompanyNameInput(compName)
              setEditCompanyBranchInput(mainComp.branch || 'สำนักงานใหญ่')
              setEditCompanyBrands(allBrands)
            }}
            className="text-slate-400 hover:text-brand-primary hover:bg-brand-primary-light p-1.5 rounded-xl transition-colors cursor-pointer"
            title="แก้ไขข้อมูลบริษัท"
          >
            <Pencil size={15} />
          </button>
          <button
            onClick={() => setDeleteTarget({ type: 'companyGroup', id: compName, name: `บริษัท ${compName} (รวมทั้ง ${branchList.length} สาขา)` })}
            className="text-slate-400 hover:text-red-600 hover:bg-red-50 p-1.5 rounded-xl transition-colors cursor-pointer"
            title="ลบบริษัทนี้และสาขาย่อยทั้งหมด"
          >
            <Trash2 size={15} />
          </button>
        </div>
      </div>

      {/* Branches List */}
      {!isCollapsed && (
        <div className="pl-3 border-l-2 border-slate-200 space-y-3 animate-fade-in">
          {branchList.map(comp => (
            <div key={comp.id} className="bg-white border border-slate-200 p-3 rounded-xl shadow-sm space-y-2">
              <div className="flex justify-between items-center border-b border-slate-100 pb-2">
                <div className="font-bold text-sm text-slate-800 flex items-center gap-1.5">
                  <Layers size={14} className="text-blue-500" />
                  <span className="text-brand-primary-hover">{comp.branch || 'สำนักงานใหญ่'}</span>
                </div>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => {
                      setEditCompanyTarget(comp)
                      setEditCompanyNameInput(comp.name)
                      setEditCompanyBranchInput(comp.branch || 'สำนักงานใหญ่')
                      setEditCompanyBrands(comp.brands || [])
                    }}
                    className="text-slate-400 hover:text-brand-primary hover:bg-brand-primary-light p-1.5 rounded-xl transition-colors cursor-pointer"
                    title="แก้ไขข้อมูลสาขา"
                  >
                    <Pencil size={14} />
                  </button>
                  <button
                    onClick={() => setDeleteTarget({ type: 'company', id: comp.id, name: `สาขา ${comp.branch || 'สำนักงานใหญ่'} ของ ${comp.name}` })}
                    className="text-slate-400 hover:text-red-600 hover:bg-red-50 p-1.5 rounded-xl transition-colors cursor-pointer"
                    title="ลบสาขา"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>

              {/* Contacts under Branch */}
              <ContactList
                companyId={comp.id}
                contacts={comp.contacts}
                contactInputs={contactInputs}
                setContactInputs={setContactInputs}
                handleAddContact={handleAddContact}
                setEditContactTarget={setEditContactTarget}
                setEditContactNameInput={setEditContactNameInput}
                setEditContactPhoneInput={setEditContactPhoneInput}
                setDeleteTarget={setDeleteTarget}
              />
            </div>
          ))}

          {/* Form: Add Branch under this Group */}
          <form onSubmit={(e) => handleAddBranchToCompany(e, compName, branchList[0].id)} className="flex items-center gap-2 mt-3 pt-3 border-t border-slate-100">
            <input
              type="text"
              placeholder="เพิ่มสาขาใหม่..."
              value={branchInputs[branchList[0].id] || ''}
              onChange={(e) => setBranchInputs(prev => ({ ...prev, [branchList[0].id]: e.target.value }))}
              required
              className="flex-1 bg-white border border-slate-200 py-2 px-3 rounded-xl text-xs outline-none focus:border-slate-400"
            />
            <button type="submit" className="bg-slate-900 hover:bg-slate-800 text-white px-4 py-2 rounded-xl text-xs font-bold transition-colors shrink-0 cursor-pointer flex items-center gap-1">
              <Plus size={14} /> เพิ่มสาขา
            </button>
          </form>
        </div>
      )}
    </div>
  )
}
