"use client"

import React from 'react'
import { Company, Contact, DeleteTarget } from '../../types'
import AddCompanyForm from './AddCompanyForm'
import CompanyCard from './CompanyCard'
import { appConfig } from '@/app/config/app.config'
import { Search, ChevronsUp, ChevronsDown } from 'lucide-react'

interface CompanySectionProps {
  companies: Company[]
  groupedCompanies: Record<string, Company[]>
  companySearch: string
  setCompanySearch: (v: string) => void
  isCompaniesAllCollapsed: boolean
  toggleAllCompanies: () => void
  collapsedCompanies: Record<string, boolean>
  toggleCompanyCollapse: (compName: string) => void
  
  newCompanyName: string
  setNewCompanyName: (v: string) => void
  newCompanyBranch: string
  setNewCompanyBranch: (v: string) => void
  newCompanyBrands: string[]
  setNewCompanyBrands: React.Dispatch<React.SetStateAction<string[]>>
  existingBrands: string[]
  handleAddCompany: (e: React.FormEvent) => void

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

export default function CompanySection({
  groupedCompanies,
  companySearch,
  setCompanySearch,
  isCompaniesAllCollapsed,
  toggleAllCompanies,
  collapsedCompanies,
  toggleCompanyCollapse,
  newCompanyName,
  setNewCompanyName,
  newCompanyBranch,
  setNewCompanyBranch,
  newCompanyBrands,
  setNewCompanyBrands,
  existingBrands,
  handleAddCompany,
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
}: CompanySectionProps) {
  return (
    <section className="bg-white/80 backdrop-blur-xl p-6 rounded-[2rem] border border-white shadow-xl shadow-slate-200/40 space-y-6">
      {/* Action Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-b border-slate-100 pb-4">
        <div className="relative flex-1 w-full">
          <input
            type="text"
            placeholder="ค้นหาชื่อบริษัท หรือ สาขา..."
            value={companySearch}
            onChange={(e) => setCompanySearch(e.target.value)}
            className="w-full bg-white/60 backdrop-blur-sm border border-slate-200 py-3 pl-11 pr-4 rounded-2xl text-sm outline-none transition-all focus:border-brand-primary focus:ring-4 focus:ring-brand-primary/10 shadow-sm"
          />
          <Search className="absolute left-4 top-3.5 text-slate-400" size={18} />
        </div>
        <button
          type="button"
          onClick={toggleAllCompanies}
          className="flex items-center gap-2 px-4 py-3 text-sm font-bold text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-2xl transition-all cursor-pointer shadow-sm shrink-0"
        >
          {isCompaniesAllCollapsed ? (
            <>
              <ChevronsDown size={18} className="text-brand-primary" /> ขยายทั้งหมด
            </>
          ) : (
            <>
              <ChevronsUp size={18} className="text-slate-500" /> ย่อทั้งหมด
            </>
          )}
        </button>
      </div>

      {/* Form: Add Company */}
      <AddCompanyForm
        newCompanyName={newCompanyName}
        setNewCompanyName={setNewCompanyName}
        newCompanyBranch={newCompanyBranch}
        setNewCompanyBranch={setNewCompanyBranch}
        newCompanyBrands={newCompanyBrands}
        setNewCompanyBrands={setNewCompanyBrands}
        existingBrands={existingBrands}
        handleAddCompany={handleAddCompany}
      />



      {/* List: Companies & Contacts */}
      <div className="space-y-4 max-h-[520px] overflow-y-auto pr-1">
        {Object.keys(groupedCompanies).length === 0 ? (
          <div className="text-center py-8 text-slate-400 text-xs">ไม่พบข้อมูลบริษัท</div>
        ) : (
          Object.entries(groupedCompanies).map(([compName, branchList]) => (
            <CompanyCard
              key={compName}
              compName={compName}
              branchList={branchList}
              isCollapsed={collapsedCompanies[compName]}
              toggleCompanyCollapse={toggleCompanyCollapse}
              setEditCompanyTarget={setEditCompanyTarget}
              setEditCompanyNameInput={setEditCompanyNameInput}
              setEditCompanyBranchInput={setEditCompanyBranchInput}
              setEditCompanyBrands={setEditCompanyBrands}
              setDeleteTarget={setDeleteTarget}
              contactInputs={contactInputs}
              setContactInputs={setContactInputs}
              handleAddContact={handleAddContact}
              setEditContactTarget={setEditContactTarget}
              setEditContactNameInput={setEditContactNameInput}
              setEditContactPhoneInput={setEditContactPhoneInput}
              branchInputs={branchInputs}
              setBranchInputs={setBranchInputs}
              handleAddBranchToCompany={handleAddBranchToCompany}
            />
          ))
        )}
      </div>
    </section>
  )
}
