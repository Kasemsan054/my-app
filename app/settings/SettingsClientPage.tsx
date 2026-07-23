"use client"

import { useState, useMemo } from 'react'
import { Sparkles, Building2, Package } from 'lucide-react'
import {
  createCompany, updateCompany, deleteCompany,
  createContact, updateContact, deleteContact,
  createProduct, updateProduct, deleteProduct,
  updateBrand, deleteBrand
} from '@/app/actions/masterActions'
import { Toast } from '@/app/components/ui/Toast'
import { Company, Contact, Product, DeleteTarget, SettingsClientPageProps } from './types'
import CompanySection from './components/CompanySection/CompanySection'
import ProductSection from './components/ProductSection/ProductSection'
import SettingsModals from './components/Modals/SettingsModals'
import { appConfig } from '@/app/config/app.config'

export default function SettingsClientPage({ initialCompanies, initialProducts }: SettingsClientPageProps) {
  const [companies] = useState<Company[]>(initialCompanies)
  const [products] = useState<Product[]>(initialProducts)
  
  const [activeTab, setActiveTab] = useState<'company' | 'product'>('company')

  // Forms state
  const [newCompanyName, setNewCompanyName] = useState('')
  const [newCompanyBranch, setNewCompanyBranch] = useState('')
  const [newCompanyBrands, setNewCompanyBrands] = useState<string[]>([])
  const [newBrand, setNewBrand] = useState('')
  const [newModel, setNewModel] = useState('')
  const [contactInputs, setContactInputs] = useState<Record<number, { name: string; phone: string }>>({})
  const [modelInputs, setModelInputs] = useState<Record<string, string>>({})
  const [branchInputs, setBranchInputs] = useState<Record<number, string>>({})

  // Search State
  const [companySearch, setCompanySearch] = useState('')
  const [productSearch, setProductSearch] = useState('')

  // Collapse / Expand State
  const [collapsedCompanies, setCollapsedCompanies] = useState<Record<string, boolean>>({})
  const [collapsedBrands, setCollapsedBrands] = useState<Record<string, boolean>>({})
  const [isCompaniesAllCollapsed, setIsCompaniesAllCollapsed] = useState(false)
  const [isBrandsAllCollapsed, setIsBrandsAllCollapsed] = useState(false)

  // Edit Targets State
  const [editCompanyTarget, setEditCompanyTarget] = useState<Company | null>(null)
  const [editCompanyNameInput, setEditCompanyNameInput] = useState('')
  const [editCompanyBranchInput, setEditCompanyBranchInput] = useState('')
  const [editCompanyBrands, setEditCompanyBrands] = useState<string[]>([])
  const [isUpdatingCompany, setIsUpdatingCompany] = useState(false)

  const [editContactTarget, setEditContactTarget] = useState<Contact | null>(null)
  const [editContactNameInput, setEditContactNameInput] = useState('')
  const [editContactPhoneInput, setEditContactPhoneInput] = useState('')
  const [isUpdatingContact, setIsUpdatingContact] = useState(false)

  const [editProductTarget, setEditProductTarget] = useState<Product | null>(null)
  const [editBrandInput, setEditBrandInput] = useState('')
  const [editModelInput, setEditModelInput] = useState('')
  const [isUpdatingProduct, setIsUpdatingProduct] = useState(false)

  const [editBrandTarget, setEditBrandTarget] = useState<string | null>(null)
  const [editBrandNameInput, setEditBrandNameInput] = useState('')
  const [isUpdatingBrandName, setIsUpdatingBrandName] = useState(false)

  // Delete Targets State
  const [deleteTarget, setDeleteTarget] = useState<DeleteTarget>(null)
  const [isDeleting, setIsDeleting] = useState(false)

  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null)

  // Memoized Computed Data
  const groupedProducts = useMemo(() => {
    const map: Record<string, Product[]> = {}
    products.forEach(p => {
      const b = p.brand.trim() || 'ไม่ระบุแบรนด์'
      if (!map[b]) map[b] = []
      map[b].push(p)
    })
    return map
  }, [products])

  const filteredGroupedProducts = useMemo(() => {
    if (!productSearch.trim()) return groupedProducts
    const search = productSearch.toLowerCase()
    const result: Record<string, Product[]> = {}
    Object.entries(groupedProducts).forEach(([brand, items]) => {
      const brandMatches = brand.toLowerCase().includes(search)
      const matchingItems = items.filter(item => item.model.toLowerCase().includes(search))
      if (brandMatches) {
        result[brand] = items
      } else if (matchingItems.length > 0) {
        result[brand] = matchingItems
      }
    })
    return result
  }, [groupedProducts, productSearch])

  const groupedCompanies = useMemo(() => {
    const map: Record<string, Company[]> = {}
    const search = companySearch.toLowerCase()
    const filtered = companies.filter(c => {
      if (!companySearch.trim()) return true
      return c.name.toLowerCase().includes(search) || (c.branch || '').toLowerCase().includes(search)
    })

    filtered.forEach(c => {
      const n = c.name.trim()
      if (!map[n]) map[n] = []
      map[n].push(c)
    })
    return map
  }, [companies, companySearch])

  const existingBrands = useMemo(() => {
    return Array.from(new Set(products.map(p => p.brand.trim()))).sort()
  }, [products])

  // --- Handlers: Company ---
  async function handleAddCompany(e: React.FormEvent) {
    e.preventDefault()
    if (!newCompanyName.trim()) return
    const res = await createCompany(newCompanyName, newCompanyBranch, newCompanyBrands)
    if (res.success) {
      setNewCompanyName('')
      setNewCompanyBranch('')
      setNewCompanyBrands([])
      setToast({ message: 'เพิ่มบริษัทเรียบร้อยแล้ว', type: 'success' })
      window.location.reload()
    } else {
      setToast({ message: res.error || 'เกิดข้อผิดพลาดในการเพิ่มบริษัท', type: 'error' })
    }
  }

  async function handleAddBranchToCompany(e: React.FormEvent, companyName: string, companyId: number) {
    e.preventDefault()
    const branchName = branchInputs[companyId]?.trim()
    if (!branchName) return
    const comp = companies.find(c => c.id === companyId) || companies.find(c => c.name === companyName)
    const brandsToPass = comp?.brands || []
    const res = await createCompany(companyName, branchName, brandsToPass)
    if (res.success) {
      setBranchInputs(prev => ({ ...prev, [companyId]: '' }))
      setToast({ message: `เพิ่มสาขา ${branchName} เรียบร้อยแล้ว`, type: 'success' })
      window.location.reload()
    } else {
      setToast({ message: res.error || 'เกิดข้อผิดพลาดในการเพิ่มสาขา', type: 'error' })
    }
  }

  async function handleUpdateCompany(e: React.FormEvent) {
    e.preventDefault()
    if (!editCompanyTarget || !editCompanyNameInput.trim()) return
    setIsUpdatingCompany(true)

    const oldName = editCompanyTarget.name
    const sameNameBranches = companies.filter(c => c.name === oldName)

    let res: { success: boolean; error?: string } = { success: false }

    if (sameNameBranches.length > 1 && oldName !== editCompanyNameInput.trim()) {
      for (const b of sameNameBranches) {
        res = await updateCompany(b.id, editCompanyNameInput, b.branch, editCompanyBrands)
      }
    } else {
      res = await updateCompany(editCompanyTarget.id, editCompanyNameInput, editCompanyBranchInput, editCompanyBrands)
    }

    setIsUpdatingCompany(false)
    if (res.success) {
      setToast({ message: 'แก้ไขข้อมูลบริษัทเรียบร้อยแล้ว', type: 'success' })
      setEditCompanyTarget(null)
      window.location.reload()
    } else {
      setToast({ message: res.error || 'เกิดข้อผิดพลาดในการแก้ไขบริษัท', type: 'error' })
    }
  }

  // --- Handlers: Contact ---
  async function handleAddContact(e: React.FormEvent, companyId: number) {
    e.preventDefault()
    const input = contactInputs[companyId]
    if (!input || !input.name.trim() || !input.phone.trim()) return

    const res = await createContact(companyId, input.name, input.phone)
    if (res.success) {
      setContactInputs(prev => ({ ...prev, [companyId]: { name: '', phone: '' } }))
      setToast({ message: 'เพิ่มผู้ติดต่อเรียบร้อยแล้ว', type: 'success' })
      window.location.reload()
    } else {
      setToast({ message: res.error || 'เกิดข้อผิดพลาดในการเพิ่มผู้ติดต่อ', type: 'error' })
    }
  }

  async function handleUpdateContact(e: React.FormEvent) {
    e.preventDefault()
    if (!editContactTarget || !editContactNameInput.trim() || !editContactPhoneInput.trim()) return
    setIsUpdatingContact(true)
    const res = await updateContact(editContactTarget.id, editContactNameInput, editContactPhoneInput)
    setIsUpdatingContact(false)
    if (res.success) {
      setToast({ message: 'แก้ไขข้อมูลผู้ติดต่อเรียบร้อยแล้ว', type: 'success' })
      setEditContactTarget(null)
      window.location.reload()
    } else {
      setToast({ message: res.error || 'เกิดข้อผิดพลาดในการแก้ไขผู้ติดต่อ', type: 'error' })
    }
  }

  // --- Handlers: Product & Brand ---
  async function handleAddProduct(e: React.FormEvent) {
    e.preventDefault()
    if (!newBrand.trim() || !newModel.trim()) return
    const res = await createProduct(newBrand, newModel)
    if (res.success) {
      setNewBrand('')
      setNewModel('')
      setToast({ message: 'เพิ่มรายการอุปกรณ์เรียบร้อยแล้ว', type: 'success' })
      window.location.reload()
    } else {
      setToast({ message: res.error || 'เกิดข้อผิดพลาดในการเพิ่มอุปกรณ์', type: 'error' })
    }
  }

  async function handleAddModelToBrand(e: React.FormEvent, brandName: string) {
    e.preventDefault()
    const model = modelInputs[brandName]?.trim()
    if (!model) return
    const res = await createProduct(brandName, model)
    if (res.success) {
      setModelInputs(prev => ({ ...prev, [brandName]: '' }))
      setToast({ message: `เพิ่มรุ่น ${model} ในแบรนด์ ${brandName} เรียบร้อยแล้ว`, type: 'success' })
      window.location.reload()
    } else {
      setToast({ message: res.error || 'เกิดข้อผิดพลาดในการเพิ่มรุ่นอุปกรณ์', type: 'error' })
    }
  }

  async function handleUpdateProduct(e: React.FormEvent) {
    e.preventDefault()
    if (!editProductTarget || !editBrandInput.trim() || !editModelInput.trim()) return

    setIsUpdatingProduct(true)
    const res = await updateProduct(editProductTarget.id, editBrandInput, editModelInput)
    setIsUpdatingProduct(false)

    if (res.success) {
      setToast({ message: 'แก้ไขข้อมูลอุปกรณ์เรียบร้อยแล้ว', type: 'success' })
      setEditProductTarget(null)
      window.location.reload()
    } else {
      setToast({ message: res.error || 'เกิดข้อผิดพลาดในการแก้ไขอุปกรณ์', type: 'error' })
    }
  }

  async function handleUpdateBrand(e: React.FormEvent) {
    e.preventDefault()
    if (!editBrandTarget || !editBrandNameInput.trim()) return

    setIsUpdatingBrandName(true)
    const res = await updateBrand(editBrandTarget, editBrandNameInput)
    setIsUpdatingBrandName(false)

    if (res.success) {
      setToast({ message: `แก้ไขชื่อแบรนด์เป็น "${editBrandNameInput}" เรียบร้อยแล้ว`, type: 'success' })
      setEditBrandTarget(null)
      window.location.reload()
    } else {
      setToast({ message: res.error || 'เกิดข้อผิดพลาดในการแก้ไขแบรนด์', type: 'error' })
    }
  }

  // --- Delete Handler ---
  async function handleDeleteConfirm() {
    if (!deleteTarget) return
    setIsDeleting(true)

    let res: { success: boolean; error?: string } = { success: false }
    if (deleteTarget.type === 'company' && typeof deleteTarget.id === 'number') {
      res = await deleteCompany(deleteTarget.id)
    } else if (deleteTarget.type === 'companyGroup' && typeof deleteTarget.id === 'string') {
      const groupBranches = groupedCompanies[deleteTarget.id] || []
      for (const b of groupBranches) {
        await deleteCompany(b.id)
      }
      res = { success: true }
    } else if (deleteTarget.type === 'contact' && typeof deleteTarget.id === 'number') {
      res = await deleteContact(deleteTarget.id)
    } else if (deleteTarget.type === 'product' && typeof deleteTarget.id === 'number') {
      res = await deleteProduct(deleteTarget.id)
    } else if (deleteTarget.type === 'brand' && typeof deleteTarget.id === 'string') {
      res = await deleteBrand(deleteTarget.id)
    }

    setIsDeleting(false)

    if (res.success) {
      setToast({ message: `ลบ ${deleteTarget.name} เรียบร้อยแล้ว`, type: 'success' })
      setDeleteTarget(null)
      window.location.reload()
    } else {
      setToast({ message: res.error || 'เกิดข้อผิดพลาดในการลบข้อมูล', type: 'error' })
    }
  }

  // --- Toggle Helpers ---
  function toggleCompanyCollapse(compName: string) {
    setCollapsedCompanies(prev => ({ ...prev, [compName]: !prev[compName] }))
  }

  const toggleAllCompanies = () => {
    const next = !isCompaniesAllCollapsed
    setIsCompaniesAllCollapsed(next)
    const map: Record<string, boolean> = {}
    Object.keys(groupedCompanies).forEach(compName => { map[compName] = next })
    setCollapsedCompanies(map)
  }

  const toggleBrandCollapse = (brand: string) => {
    setCollapsedBrands(prev => ({ ...prev, [brand]: !prev[brand] }))
  }

  const toggleAllBrands = () => {
    const next = !isBrandsAllCollapsed
    setIsBrandsAllCollapsed(next)
    const map: Record<string, boolean> = {}
    Object.keys(groupedProducts).forEach(b => { map[b] = next })
    setCollapsedBrands(map)
  }

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-12">
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

      {/* Premium Header Banner */}
      <div className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 rounded-[2rem] p-8 text-white shadow-2xl flex flex-col md:flex-row justify-between items-start md:items-center gap-6 border border-slate-700/50">
        {/* Decorative background elements */}
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-64 h-64 rounded-full bg-brand-primary/20 blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-0 left-10 w-40 h-40 rounded-full bg-brand-secondary/20 blur-3xl pointer-events-none"></div>
        
        <div className="relative z-10">
          <div className="flex items-center gap-2 text-slate-300 font-bold text-xs uppercase tracking-widest mb-2">
            <Sparkles size={16} className="text-amber-400" /> Settings & Configuration
          </div>
          <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight mb-2 drop-shadow-sm">{appConfig.ui.settings.title}</h1>
          <p className="text-slate-400 max-w-xl text-sm">{appConfig.ui.settings.description}</p>
        </div>
      </div>

      {/* Tab Switcher */}
      <div className="flex justify-center -mt-2 mb-2 relative z-20">
        <div className="bg-slate-200/50 backdrop-blur-md p-1.5 rounded-2xl inline-flex gap-1 shadow-inner border border-slate-200/80">
          <button
            onClick={() => setActiveTab('company')}
            className={`px-6 py-2.5 rounded-xl text-sm font-bold transition-all duration-300 flex items-center gap-2 cursor-pointer ${
              activeTab === 'company'
                ? 'bg-white text-slate-900 shadow-sm ring-1 ring-slate-200/50'
                : 'text-slate-500 hover:text-slate-800 hover:bg-slate-200/50'
            }`}
          >
            <Building2 size={18} className={activeTab === 'company' ? 'text-brand-primary' : ''} /> จัดการข้อมูลบริษัท
          </button>
          <button
            onClick={() => setActiveTab('product')}
            className={`px-6 py-2.5 rounded-xl text-sm font-bold transition-all duration-300 flex items-center gap-2 cursor-pointer ${
              activeTab === 'product'
                ? 'bg-white text-slate-900 shadow-sm ring-1 ring-slate-200/50'
                : 'text-slate-500 hover:text-slate-800 hover:bg-slate-200/50'
            }`}
          >
            <Package size={18} className={activeTab === 'product' ? 'text-brand-secondary' : ''} /> จัดการแบรนด์ / อุปกรณ์
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="transition-all duration-500 animate-fade-in max-w-5xl mx-auto">
        {activeTab === 'company' ? (
          <CompanySection
            companies={companies}
            groupedCompanies={groupedCompanies}
            companySearch={companySearch}
            setCompanySearch={setCompanySearch}
            isCompaniesAllCollapsed={isCompaniesAllCollapsed}
            toggleAllCompanies={toggleAllCompanies}
            collapsedCompanies={collapsedCompanies}
            toggleCompanyCollapse={toggleCompanyCollapse}
            newCompanyName={newCompanyName}
            setNewCompanyName={setNewCompanyName}
            newCompanyBranch={newCompanyBranch}
            setNewCompanyBranch={setNewCompanyBranch}
            newCompanyBrands={newCompanyBrands}
            setNewCompanyBrands={setNewCompanyBrands}
            existingBrands={existingBrands}
            handleAddCompany={handleAddCompany}
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
        ) : (
          <ProductSection
            products={products}
            filteredGroupedProducts={filteredGroupedProducts}
            productSearch={productSearch}
            setProductSearch={setProductSearch}
            isBrandsAllCollapsed={isBrandsAllCollapsed}
            toggleAllBrands={toggleAllBrands}
            collapsedBrands={collapsedBrands}
            toggleBrandCollapse={toggleBrandCollapse}
            newBrand={newBrand}
            setNewBrand={setNewBrand}
            newModel={newModel}
            setNewModel={setNewModel}
            existingBrands={existingBrands}
            handleAddProduct={handleAddProduct}
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
        )}
      </div>

      {/* Modals Dialogs Component */}
      <SettingsModals
        editCompanyTarget={editCompanyTarget}
        setEditCompanyTarget={setEditCompanyTarget}
        editCompanyNameInput={editCompanyNameInput}
        setEditCompanyNameInput={setEditCompanyNameInput}
        editCompanyBranchInput={editCompanyBranchInput}
        setEditCompanyBranchInput={setEditCompanyBranchInput}
        editCompanyBrands={editCompanyBrands}
        setEditCompanyBrands={setEditCompanyBrands}
        isUpdatingCompany={isUpdatingCompany}
        handleUpdateCompany={handleUpdateCompany}
        existingBrands={existingBrands}
        editContactTarget={editContactTarget}
        setEditContactTarget={setEditContactTarget}
        editContactNameInput={editContactNameInput}
        setEditContactNameInput={setEditContactNameInput}
        editContactPhoneInput={editContactPhoneInput}
        setEditContactPhoneInput={setEditContactPhoneInput}
        isUpdatingContact={isUpdatingContact}
        handleUpdateContact={handleUpdateContact}
        editProductTarget={editProductTarget}
        setEditProductTarget={setEditProductTarget}
        editBrandInput={editBrandInput}
        setEditBrandInput={setEditBrandInput}
        editModelInput={editModelInput}
        setEditModelInput={setEditModelInput}
        isUpdatingProduct={isUpdatingProduct}
        handleUpdateProduct={handleUpdateProduct}
        editBrandTarget={editBrandTarget}
        setEditBrandTarget={setEditBrandTarget}
        editBrandNameInput={editBrandNameInput}
        setEditBrandNameInput={setEditBrandNameInput}
        isUpdatingBrandName={isUpdatingBrandName}
        handleUpdateBrand={handleUpdateBrand}
        deleteTarget={deleteTarget}
        setDeleteTarget={setDeleteTarget}
        isDeleting={isDeleting}
        handleDeleteConfirm={handleDeleteConfirm}
      />
    </div>
  )
}
