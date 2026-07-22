"use client"

import { useState, useMemo } from 'react'
import { Building2, Package, Plus, Trash2, Sparkles, Pencil, Tag, Layers, ChevronDown, ChevronRight, ChevronsUpDown } from 'lucide-react'
import { 
  createCompany, updateCompany, deleteCompany, 
  createContact, updateContact, deleteContact, 
  createProduct, updateProduct, deleteProduct,
  updateBrand
} from '@/app/actions/masterActions'
import { Modal } from '@/app/components/ui/Modal'
import { Toast } from '@/app/components/ui/Toast'

interface Contact {
  id: number
  name: string
  phone: string
  companyId: number
}

interface Company {
  id: number
  name: string
  brands?: string[]
  contacts: Contact[]
}

interface Product {
  id: number
  brand: string
  model: string
}

interface SettingsClientPageProps {
  initialCompanies: Company[]
  initialProducts: Product[]
}

export default function SettingsClientPage({ initialCompanies, initialProducts }: SettingsClientPageProps) {
  const [companies] = useState<Company[]>(initialCompanies)
  const [products] = useState<Product[]>(initialProducts)

  // Forms state
  const [newCompanyName, setNewCompanyName] = useState('')
  const [newCompanyBrands, setNewCompanyBrands] = useState<string[]>([])
  const [newBrand, setNewBrand] = useState('')
  const [newModel, setNewModel] = useState('')
  const [contactInputs, setContactInputs] = useState<Record<number, { name: string; phone: string }>>({})
  const [modelInputs, setModelInputs] = useState<Record<string, string>>({})

  // Collapse / Expand State
  const [collapsedCompanies, setCollapsedCompanies] = useState<Record<number, boolean>>({})
  const [collapsedBrands, setCollapsedBrands] = useState<Record<string, boolean>>({})
  const [isCompaniesAllCollapsed, setIsCompaniesAllCollapsed] = useState(false)
  const [isBrandsAllCollapsed, setIsBrandsAllCollapsed] = useState(false)

  // Edit Targets State
  const [editCompanyTarget, setEditCompanyTarget] = useState<Company | null>(null)
  const [editCompanyNameInput, setEditCompanyNameInput] = useState('')
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

  // Edit Brand Name State
  const [editBrandTarget, setEditBrandTarget] = useState<string | null>(null)
  const [editBrandNameInput, setEditBrandNameInput] = useState('')
  const [isUpdatingBrandName, setIsUpdatingBrandName] = useState(false)

  // Delete Targets State
  const [deleteTarget, setDeleteTarget] = useState<{
    type: 'company' | 'contact' | 'product'
    id: number
    name: string
  } | null>(null)
  
  const [isDeleting, setIsDeleting] = useState(false)
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null)

  // Group products by Brand (1 Brand -> Multiple Models)
  const groupedProducts = useMemo(() => {
    const map: Record<string, Product[]> = {}
    products.forEach(p => {
      const b = p.brand.trim() || 'ไม่ระบุแบรนด์'
      if (!map[b]) map[b] = []
      map[b].push(p)
    })
    return map
  }, [products])

  const existingBrands = useMemo(() => {
    return Array.from(new Set(products.map(p => p.brand.trim()))).sort()
  }, [products])

  // --- Handlers: Company ---
  async function handleAddCompany(e: React.FormEvent) {
    e.preventDefault()
    if (!newCompanyName.trim()) return
    const res = await createCompany(newCompanyName, newCompanyBrands)
    if (res.success) {
      setNewCompanyName('')
      setNewCompanyBrands([])
      setToast({ message: 'เพิ่มบริษัทเรียบร้อยแล้ว', type: 'success' })
      window.location.reload()
    } else {
      setToast({ message: res.error || 'เกิดข้อผิดพลาดในการเพิ่มบริษัท', type: 'error' })
    }
  }

  async function handleUpdateCompany(e: React.FormEvent) {
    e.preventDefault()
    if (!editCompanyTarget || !editCompanyNameInput.trim()) return
    setIsUpdatingCompany(true)
    const res = await updateCompany(editCompanyTarget.id, editCompanyNameInput, editCompanyBrands)
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

  async function handleAddModelToBrand(e: React.FormEvent, brand: string) {
    e.preventDefault()
    const model = modelInputs[brand]?.trim()
    if (!model) return

    const res = await createProduct(brand, model)
    if (res.success) {
      setModelInputs(prev => ({ ...prev, [brand]: '' }))
      setToast({ message: `เพิ่มรุ่น ${model} ในแบรนด์ ${brand} เรียบร้อยแล้ว`, type: 'success' })
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
      setToast({ message: res.error || 'เกิดข้อผิดพลาดในการแก้ไขข้อมูลอุปกรณ์', type: 'error' })
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
    if (deleteTarget.type === 'company') {
      res = await deleteCompany(deleteTarget.id)
    } else if (deleteTarget.type === 'contact') {
      res = await deleteContact(deleteTarget.id)
    } else if (deleteTarget.type === 'product') {
      res = await deleteProduct(deleteTarget.id)
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
  const toggleCompanyCollapse = (id: number) => {
    setCollapsedCompanies(prev => ({ ...prev, [id]: !prev[id] }))
  }

  const toggleAllCompanies = () => {
    const next = !isCompaniesAllCollapsed
    setIsCompaniesAllCollapsed(next)
    const map: Record<number, boolean> = {}
    companies.forEach(c => { map[c.id] = next })
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

      {/* Header Banner */}
      <div className="bg-slate-900 rounded-3xl p-6 md:p-8 text-white shadow-xl flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <div className="flex items-center gap-2 text-amber-400 font-bold text-xs uppercase tracking-wider mb-1">
            <Sparkles size={16} /> Company & Equipment Settings
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight">ตั้งค่าข้อมูลบริษัทและอุปกรณ์</h1>
          <p className="text-sm text-slate-300 mt-1">ตั้งค่าข้อมูลบริษัทลูกค้า รายชื่อผู้ติดต่อ และยี่ห้อ/รุ่นอุปกรณ์สำหรับเลือกใช้งานในระบบ</p>
        </div>
      </div>

      {/* Main Grid: 2 Columns */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Left Column: Company & Contact Management */}
        <div className="space-y-6">
          <section className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs space-y-6">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div className="flex items-center gap-3">
                <div className="bg-slate-900 text-white p-2.5 rounded-2xl shadow-xs">
                  <Building2 size={20} />
                </div>
                <div>
                  <h2 className="text-base font-bold text-slate-900">บริษัทลูกค้าและผู้ติดต่อ</h2>
                  <p className="text-xs text-slate-500">จัดการข้อมูลบริษัทและเบอร์โทรศัพท์ผู้ติดต่อ</p>
                </div>
              </div>
              <button
                type="button"
                onClick={toggleAllCompanies}
                className="p-2 text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
                title={isCompaniesAllCollapsed ? "ขยายทั้งหมด" : "ย่อทั้งหมด"}
              >
                <ChevronsUpDown size={18} />
              </button>
            </div>

            {/* Form: Add Company */}
            <form onSubmit={handleAddCompany} className="space-y-3 bg-slate-50 p-4 rounded-2xl border border-slate-200/80">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newCompanyName}
                  onChange={(e) => setNewCompanyName(e.target.value)}
                  required
                  placeholder="พิมพ์ชื่อบริษัทใหม่..."
                  className="flex-1 bg-white border border-slate-200 py-2.5 px-4 rounded-xl text-sm outline-none transition-all hover:border-slate-300 focus:border-slate-900 focus:ring-4 focus:ring-slate-900/5"
                />
                <button
                  type="submit"
                  className="bg-slate-900 hover:bg-slate-800 text-white px-5 py-2.5 rounded-xl text-sm font-bold flex items-center gap-1.5 shadow-sm transition-all shrink-0 cursor-pointer"
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

            {/* List: Companies & Contacts */}
            <div className="space-y-4 max-h-[520px] overflow-y-auto pr-1">
              {companies.map(comp => {
                const isCollapsed = collapsedCompanies[comp.id]
                const compBrands = comp.brands || []
                return (
                  <div key={comp.id} className="bg-slate-50/80 border border-slate-200/60 rounded-2xl p-4 space-y-3 transition-all">
                    <div className="flex justify-between items-start border-b border-slate-200/50 pb-2">
                      <div className="space-y-1">
                        <div 
                          onClick={() => toggleCompanyCollapse(comp.id)}
                          className="flex items-center gap-2 cursor-pointer select-none group"
                        >
                          <button type="button" className="text-slate-400 group-hover:text-slate-700 p-0.5">
                            {isCollapsed ? <ChevronRight size={18} /> : <ChevronDown size={18} />}
                          </button>
                          <span className="font-bold text-sm text-slate-900 flex items-center gap-2">
                            <Building2 size={16} className="text-blue-600" />
                            {comp.name}
                          </span>
                          <span className="bg-blue-100 text-blue-800 text-[11px] font-semibold px-2 py-0.5 rounded-full">
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
                            setEditCompanyBrands(comp.brands || [])
                          }}
                          className="text-slate-400 hover:text-blue-600 hover:bg-blue-50 p-1.5 rounded-xl transition-colors cursor-pointer"
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
                        {comp.contacts.length === 0 ? (
                          <div className="text-xs text-slate-400 italic py-1">ยังไม่มีผู้ติดต่อ</div>
                        ) : (
                          comp.contacts.map(c => (
                            <div key={c.id} className="flex justify-between items-center text-xs bg-white border border-slate-100 p-2.5 rounded-xl shadow-2xs">
                              <span className="font-medium text-slate-800">
                                {c.name} <span className="text-slate-400 font-normal">({c.phone})</span>
                              </span>
                              <div className="flex items-center gap-1">
                                <button
                                  onClick={() => {
                                    setEditContactTarget(c)
                                    setEditContactNameInput(c.name)
                                    setEditContactPhoneInput(c.phone)
                                  }}
                                  className="text-slate-400 hover:text-blue-600 hover:bg-blue-50 p-1 rounded-lg transition-colors cursor-pointer"
                                  title="แก้ไขผู้ติดต่อ"
                                >
                                  <Pencil size={13} />
                                </button>
                                <button
                                  onClick={() => setDeleteTarget({ type: 'contact', id: c.id, name: `ผู้ติดต่อ ${c.name}` })}
                                  className="text-slate-300 hover:text-red-600 hover:bg-red-50 p-1 rounded-lg transition-colors cursor-pointer"
                                  title="ลบผู้ติดต่อ"
                                >
                                  <Trash2 size={13} />
                                </button>
                              </div>
                            </div>
                          ))
                        )}

                        {/* Form: Add Contact under Company */}
                        <form onSubmit={(e) => handleAddContact(e, comp.id)} className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                          <input
                            type="text"
                            placeholder="ชื่อผู้ติดต่อ"
                            value={contactInputs[comp.id]?.name || ''}
                            onChange={(e) => setContactInputs(prev => ({
                              ...prev,
                              [comp.id]: { name: e.target.value, phone: prev[comp.id]?.phone || '' }
                            }))}
                            required
                            className="bg-white border border-slate-200 text-xs p-2.5 rounded-xl outline-none focus:border-slate-900"
                          />
                          <div className="flex gap-1.5">
                            <input
                              type="text"
                              placeholder="เบอร์โทร"
                              value={contactInputs[comp.id]?.phone || ''}
                              onChange={(e) => setContactInputs(prev => ({
                                ...prev,
                                [comp.id]: { name: prev[comp.id]?.name || '', phone: e.target.value }
                              }))}
                              required
                              className="flex-1 bg-white border border-slate-200 text-xs p-2.5 rounded-xl outline-none focus:border-slate-900"
                            />
                            <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white px-3 rounded-xl text-xs font-bold transition-colors shrink-0 cursor-pointer">
                              บันทึก
                            </button>
                          </div>
                        </form>
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          </section>
        </div>

        {/* Right Column: Product Catalog Management (1 Brand -> Multiple Models) */}
        <div>
          <section className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs space-y-6">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div className="flex items-center gap-3">
                <div className="bg-slate-900 text-white p-2.5 rounded-2xl shadow-xs">
                  <Package size={20} />
                </div>
                <div>
                  <h2 className="text-base font-bold text-slate-900">รายการอุปกรณ์ (Products)</h2>
                  <p className="text-xs text-slate-500">จัดการยี่ห้อและรุ่นของอุปกรณ์ (จัดกลุ่มตามแบรนด์)</p>
                </div>
              </div>
              <button
                type="button"
                onClick={toggleAllBrands}
                className="p-2 text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
                title={isBrandsAllCollapsed ? "ขยายทั้งหมด" : "ย่อทั้งหมด"}
              >
                <ChevronsUpDown size={18} />
              </button>
            </div>

            {/* Form: Add Brand & Model */}
            <form onSubmit={handleAddProduct} className="space-y-3 bg-slate-50/70 p-4 rounded-2xl border border-slate-200/60">
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
                    className="w-full bg-white border border-slate-200 py-2.5 px-3.5 rounded-xl text-sm outline-none transition-all hover:border-slate-300 focus:border-slate-900 focus:ring-4 focus:ring-slate-900/5"
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
                  className="w-full bg-white border border-slate-200 py-2.5 px-3.5 rounded-xl text-sm outline-none transition-all hover:border-slate-300 focus:border-slate-900 focus:ring-4 focus:ring-slate-900/5"
                />
              </div>
              <button
                type="submit"
                className="w-full bg-slate-900 hover:bg-slate-800 text-white py-3 rounded-xl text-sm font-bold flex items-center justify-center gap-1.5 shadow-sm transition-all cursor-pointer"
              >
                <Plus size={16} /> บันทึกอุปกรณ์ใหม่
              </button>
            </form>

            {/* List: Products Grouped by Brand */}
            <div className="space-y-4 max-h-[520px] overflow-y-auto pr-1">
              {Object.keys(groupedProducts).length === 0 ? (
                <div className="text-center py-8 text-slate-400 text-xs">ยังไม่มีข้อมูลอุปกรณ์ในระบบ</div>
              ) : (
                Object.entries(groupedProducts).map(([brandName, brandItems]) => {
                  const isCollapsed = collapsedBrands[brandName]
                  return (
                    <div key={brandName} className="bg-slate-50/80 border border-slate-200/60 rounded-2xl p-4 space-y-3 transition-all">
                      <div className="flex justify-between items-center border-b border-slate-200/50 pb-2">
                        <div 
                          onClick={() => toggleBrandCollapse(brandName)}
                          className="flex items-center gap-2 cursor-pointer select-none group"
                        >
                          <button type="button" className="text-slate-400 group-hover:text-slate-700 p-0.5">
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
                      </div>

                      {/* Models under this Brand (Visible when NOT collapsed) */}
                      {!isCollapsed && (
                        <div className="pl-3 border-l-2 border-amber-200 space-y-2 animate-fade-in">
                          {brandItems.map(item => (
                            <div key={item.id} className="flex justify-between items-center text-xs bg-white border border-slate-100 p-2.5 rounded-xl shadow-2xs">
                              <span className="font-medium text-slate-800 flex items-center gap-1.5">
                                <Tag size={13} className="text-slate-400" />
                                {item.model}
                              </span>
                              <div className="flex items-center gap-1">
                                <button
                                  onClick={() => {
                                    setEditProductTarget(item)
                                    setEditBrandInput(item.brand)
                                    setEditModelInput(item.model)
                                  }}
                                  className="text-slate-400 hover:text-blue-600 hover:bg-blue-50 p-1.5 rounded-lg transition-colors cursor-pointer"
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
                })
              )}
            </div>
          </section>
        </div>

      </div>

      {/* Delete Confirmation Modal */}
      {deleteTarget && (
        <Modal
          isOpen={!!deleteTarget}
          onClose={() => setDeleteTarget(null)}
          title="ยืนยันการลบข้อมูล"
          description={`คุณต้องการลบ "${deleteTarget.name}" ออกจากระบบใช่หรือไม่? ข้อมูลที่ถูกลบจะไม่สามารถกู้คืนได้`}
          confirmLabel="ยืนยันลบข้อมูล"
          confirmVariant="danger"
          onConfirm={handleDeleteConfirm}
          isLoading={isDeleting}
        />
      )}

      {/* Edit Company Modal */}
      {editCompanyTarget && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fade-in">
          <div className="bg-white rounded-3xl p-6 w-full max-w-md shadow-2xl border border-slate-100 space-y-4">
            <div className="flex justify-between items-center border-b border-slate-100 pb-3">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Building2 size={18} className="text-blue-600" /> แก้ไขข้อมูลบริษัทลูกค้า
              </h3>
              <button onClick={() => setEditCompanyTarget(null)} className="text-slate-400 hover:text-slate-600 text-sm p-1 cursor-pointer">
                ✕
              </button>
            </div>

            <form onSubmit={handleUpdateCompany} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">ชื่อบริษัท (Company Name)</label>
                <input
                  type="text"
                  value={editCompanyNameInput}
                  onChange={(e) => setEditCompanyNameInput(e.target.value)}
                  required
                  className="w-full bg-slate-50 border border-slate-200 py-2.5 px-3.5 rounded-xl text-sm outline-none focus:bg-white focus:border-slate-900"
                />
              </div>

              {/* Brand Selection in Edit Modal */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-slate-700">ยี่ห้ออุปกรณ์ที่มีที่ลูกค้ารายนี้</label>
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
                              : 'bg-slate-50 text-slate-600 border-slate-200 hover:border-amber-300'
                          }`}
                        >
                          {isSelected ? '✓ ' : '+ '}{b}
                        </button>
                      )
                    })}
                  </div>
                )}
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setEditCompanyTarget(null)}
                  className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 py-2.5 rounded-xl text-sm font-semibold transition-colors cursor-pointer"
                >
                  ยกเลิก
                </button>
                <button
                  type="submit"
                  disabled={isUpdatingCompany}
                  className="flex-1 bg-slate-900 hover:bg-slate-800 text-white py-2.5 rounded-xl text-sm font-semibold transition-colors cursor-pointer disabled:opacity-50"
                >
                  {isUpdatingCompany ? 'กำลังบันทึก...' : 'บันทึกการแก้ไข'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Contact Modal */}
      {editContactTarget && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fade-in">
          <div className="bg-white rounded-3xl p-6 w-full max-w-md shadow-2xl border border-slate-100 space-y-4">
            <div className="flex justify-between items-center border-b border-slate-100 pb-3">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Pencil size={18} className="text-blue-600" /> แก้ไขข้อมูลผู้ติดต่อ
              </h3>
              <button onClick={() => setEditContactTarget(null)} className="text-slate-400 hover:text-slate-600 text-sm p-1 cursor-pointer">
                ✕
              </button>
            </div>

            <form onSubmit={handleUpdateContact} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">ชื่อผู้ติดต่อ</label>
                <input
                  type="text"
                  value={editContactNameInput}
                  onChange={(e) => setEditContactNameInput(e.target.value)}
                  required
                  className="w-full bg-slate-50 border border-slate-200 py-2.5 px-3.5 rounded-xl text-sm outline-none focus:bg-white focus:border-slate-900"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">เบอร์โทรศัพท์</label>
                <input
                  type="text"
                  value={editContactPhoneInput}
                  onChange={(e) => setEditContactPhoneInput(e.target.value)}
                  required
                  className="w-full bg-slate-50 border border-slate-200 py-2.5 px-3.5 rounded-xl text-sm outline-none focus:bg-white focus:border-slate-900"
                />
              </div>
              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setEditContactTarget(null)}
                  className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 py-2.5 rounded-xl text-sm font-semibold transition-colors cursor-pointer"
                >
                  ยกเลิก
                </button>
                <button
                  type="submit"
                  disabled={isUpdatingContact}
                  className="flex-1 bg-slate-900 hover:bg-slate-800 text-white py-2.5 rounded-xl text-sm font-semibold transition-colors cursor-pointer disabled:opacity-50"
                >
                  {isUpdatingContact ? 'กำลังบันทึก...' : 'บันทึกการแก้ไข'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Product Modal */}
      {editProductTarget && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fade-in">
          <div className="bg-white rounded-3xl p-6 w-full max-w-md shadow-2xl border border-slate-100 space-y-4">
            <div className="flex justify-between items-center border-b border-slate-100 pb-3">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Pencil size={18} className="text-blue-600" /> แก้ไขข้อมูลอุปกรณ์
              </h3>
              <button onClick={() => setEditProductTarget(null)} className="text-slate-400 hover:text-slate-600 text-sm p-1 cursor-pointer">
                ✕
              </button>
            </div>

            <form onSubmit={handleUpdateProduct} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">แบรนด์ (Brand)</label>
                <input
                  type="text"
                  list="brand-suggestions"
                  value={editBrandInput}
                  onChange={(e) => setEditBrandInput(e.target.value)}
                  required
                  className="w-full bg-slate-50 border border-slate-200 py-2.5 px-3.5 rounded-xl text-sm outline-none focus:bg-white focus:border-slate-900"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">ชื่อรุ่น / โมเดล (Model)</label>
                <input
                  type="text"
                  value={editModelInput}
                  onChange={(e) => setEditModelInput(e.target.value)}
                  required
                  className="w-full bg-slate-50 border border-slate-200 py-2.5 px-3.5 rounded-xl text-sm outline-none focus:bg-white focus:border-slate-900"
                />
              </div>
              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setEditProductTarget(null)}
                  className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 py-2.5 rounded-xl text-sm font-semibold transition-colors cursor-pointer"
                >
                  ยกเลิก
                </button>
                <button
                  type="submit"
                  disabled={isUpdatingProduct}
                  className="flex-1 bg-slate-900 hover:bg-slate-800 text-white py-2.5 rounded-xl text-sm font-semibold transition-colors cursor-pointer disabled:opacity-50"
                >
                  {isUpdatingProduct ? 'กำลังบันทึก...' : 'บันทึกการแก้ไข'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Brand Name Modal */}
      {editBrandTarget && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fade-in">
          <div className="bg-white rounded-3xl p-6 w-full max-w-md shadow-2xl border border-slate-100 space-y-4">
            <div className="flex justify-between items-center border-b border-slate-100 pb-3">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Layers size={18} className="text-amber-600" /> แก้ไขชื่อแบรนด์ (Brand)
              </h3>
              <button onClick={() => setEditBrandTarget(null)} className="text-slate-400 hover:text-slate-600 text-sm p-1 cursor-pointer">
                ✕
              </button>
            </div>

            <form onSubmit={handleUpdateBrand} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">ชื่อแบรนด์ (Brand Name)</label>
                <input
                  type="text"
                  value={editBrandNameInput}
                  onChange={(e) => setEditBrandNameInput(e.target.value)}
                  required
                  className="w-full bg-slate-50 border border-slate-200 py-2.5 px-3.5 rounded-xl text-sm outline-none focus:bg-white focus:border-slate-900"
                />
                <p className="text-[11px] text-slate-500 mt-1.5 leading-relaxed">
                  การแก้ไขชื่อแบรนด์จะอัปเดตยี่ห้อของรุ่นอุปกรณ์ทั้งหมดภายใต้แบรนด์ <b>&quot;{editBrandTarget}&quot;</b> โดยอัตโนมัติ
                </p>
              </div>
              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setEditBrandTarget(null)}
                  className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 py-2.5 rounded-xl text-sm font-semibold transition-colors cursor-pointer"
                >
                  ยกเลิก
                </button>
                <button
                  type="submit"
                  disabled={isUpdatingBrandName}
                  className="flex-1 bg-amber-600 hover:bg-amber-700 text-white py-2.5 rounded-xl text-sm font-bold transition-colors cursor-pointer disabled:opacity-50"
                >
                  {isUpdatingBrandName ? 'กำลังบันทึก...' : 'บันทึกการแก้ไข'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
