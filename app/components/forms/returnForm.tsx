"use client"

import { useState, useRef } from 'react'
import { submitReturnTicket, previewReturnTicket } from '@/app/actions/submitReturn'
import { InputField, TextareaField, SelectField, DatePickerField, Button, Toast } from '@/app/components/ui'
import { Printer, Eye, FileBox, Users, Wrench, CheckCircle2 } from 'lucide-react'
import Link from 'next/link'
import { CompanyItem, ContactItem, ProductItem, UserItem } from '@/app/types'

interface ReturnFormProps {
  companies: CompanyItem[]
  products: ProductItem[]
  currentUser: UserItem
  staffs?: UserItem[]
}

export default function ReturnForm({ companies, products, currentUser, staffs = [] }: ReturnFormProps) {
  const formRef = useRef<HTMLFormElement>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [isPreviewLoading, setIsPreviewLoading] = useState(false)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [generatedTicketNo, setGeneratedTicketNo] = useState<string | null>(null)
  const [selectedCompanyId, setSelectedCompanyId] = useState<string>("")
  const [receiveDate, setReceiveDate] = useState<string>(() => new Date().toISOString().split('T')[0])
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null)

  const selectedCompany = companies.find((c: CompanyItem) => c.id === Number(selectedCompanyId))
  const activeContacts = selectedCompany?.contacts || []
  const companyBrands: string[] = selectedCompany?.brands || []

  // Filter products by selected company's brands if specified
  const filteredProducts = products.filter((p: ProductItem) => {
    if (!selectedCompanyId || companyBrands.length === 0) return true
    return companyBrands.includes(p.brand)
  })

  // Staff options for co-staff dropdown
  const coStaffOptions = staffs
    .filter((s: UserItem) => s.employeeId !== currentUser?.employeeId)
    .map((s: UserItem) => ({ value: s.name, label: s.name }))

  async function handlePreview() {
    if (!formRef.current) return
    setIsPreviewLoading(true)
    
    const formData = new FormData(formRef.current)
    const res = await previewReturnTicket(formData)

    if (res.success && res.url) {
      setPreviewUrl(res.url)
      setToast({ message: 'แสดงผลตัวอย่าง PDF พรีวิวเรียบร้อยแล้ว', type: 'success' })
    } else {
      setToast({ message: res.error || 'เกิดข้อผิดพลาดในการดูพรีวิว', type: 'error' })
    }
    setIsPreviewLoading(false)
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setIsLoading(true)
    setPreviewUrl(null)
    setGeneratedTicketNo(null)
    
    const formData = new FormData(e.currentTarget)
    const res = await submitReturnTicket(formData)
    
    if (res.success && res.ticketNo) {
      setGeneratedTicketNo(res.ticketNo)
      if (res.url) setPreviewUrl(res.url)
      
      const successMsg = `ออกใบแจ้งเปิดงานซ่อมเลขที่ ${res.ticketNo} สำเร็จแล้ว`
      setToast({ 
        message: res.warning ? `${successMsg} ${res.warning}` : successMsg, 
        type: res.warning ? 'error' : 'success' 
      })
    } else {
      setToast({ message: res.error || 'เกิดข้อผิดพลาดในการออกใบแจ้งเปิดงานซ่อม', type: 'error' })
    }
    setIsLoading(false)
  }

  return (
    <div className="flex flex-col lg:flex-row w-full gap-6">
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
      
      {/* Left Column: Form */}
      <div className="w-full lg:w-[50%] bg-white p-6 md:p-8 rounded-3xl border border-slate-200/80 shadow-xs space-y-6">
        <form ref={formRef} onSubmit={handleSubmit} className="space-y-6">
          
          {/* Section 1: Document info */}
          <div className="space-y-4">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5 border-b border-slate-100 pb-2">
              <FileBox size={14} /> ข้อมูลใบแจ้งเปิดงานซ่อม
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <DatePickerField 
                label="วันที่รับเครื่อง" 
                name="receive_date" 
                required 
                value={receiveDate}
                onChange={(e) => setReceiveDate(e.target.value)} 
              />
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-slate-700">ประเภทเอกสาร</label>
                <div className="w-full h-11 bg-brand-primary-light text-blue-800 font-bold px-4 py-2.5 rounded-2xl text-xs border border-blue-100 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-brand-primary-light0 shrink-0"></span>
                  <span>ใบแจ้งเปิดงานซ่อม</span>
                </div>
              </div>
            </div>
          </div>

          {/* Section 2: Staff */}
          <div className="bg-slate-50/80 p-5 rounded-2xl border border-slate-100 space-y-4">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
              <Users size={14} /> เจ้าหน้าที่ผู้รับเรื่อง
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <InputField label="เจ้าหน้าที่รับเครื่อง" disabled value={currentUser?.name || ''} />
              <SelectField 
                label="เจ้าหน้าที่ร่วม" 
                name="co_staff_names" 
                options={[
                  { value: "", label: "-- ไม่มี (ทำรายการคนเดียว) --" },
                  ...coStaffOptions
                ]} 
              />
            </div>
          </div>

          {/* Section 3: Customer & Product */}
          <div className="space-y-4">
            <div className="border-b border-slate-100 pb-2">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                <Wrench size={14} /> ข้อมูลลูกค้าและอุปกรณ์
              </h3>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <SelectField 
                label="บริษัทลูกค้า" 
                name="companyId" 
                value={selectedCompanyId} 
                onChange={(e) => setSelectedCompanyId(e.target.value)} 
                required
                options={companies.map((c: CompanyItem) => {
                  const hasMultipleBranches = companies.filter(comp => comp.name === c.name).length > 1;
                  const shouldShowBranch = c.branch && (hasMultipleBranches || c.branch !== 'สำนักงานใหญ่');
                  return { 
                    value: c.id, 
                    label: shouldShowBranch ? `${c.name} - ${c.branch}` : c.name
                  };
                })} 
              />

              <SelectField 
                label="ผู้ติดต่อและเบอร์โทร" 
                name="contactId" 
                disabled={!selectedCompanyId} 
                required
                options={activeContacts.map((c: ContactItem) => ({ value: c.id, label: `${c.name} (${c.phone})` }))} 
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <SelectField 
                label="รุ่นอุปกรณ์ที่รับเปิดงานซ่อม"
                name="productId" 
                required
                options={filteredProducts.map((p: ProductItem) => ({ value: p.id, label: `${p.brand} ${p.model}` }))} 
              />
              <InputField label="Serial Number (S/N)" name="serial_no" placeholder="กรอก S/N อุปกรณ์..." />
            </div>

            <div className="grid grid-cols-1 gap-4">
              <InputField 
                label="อีเมลผู้รับ (Optional)" 
                name="recipient_email" 
                type="email"
                placeholder="ระบุอีเมลเพื่อส่งสำเนาใบแจ้งเปิดงานซ่อม (หากต้องการ)" 
              />
            </div>
          </div>

          {/* Section 4: Problem symptom & Accessories */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <TextareaField label="อาการเสีย (Symptom)" name="problem_symptom" rows={2} placeholder="ระบุอาการเสียเบื้องต้น..." />
            <TextareaField label="อุปกรณ์ที่ติดมาด้วย" name="included_accessories" rows={2} placeholder="เช่น สายชาร์จ, กระเป๋า, กล่อง..." />
          </div>

          {/* Section 5: Remark */}
          <TextareaField label="หมายเหตุ (Remark)" name="remark" rows={2} placeholder="หมายเหตุเพิ่มเติม (ถ้ามี)..." />

          {/* Action Buttons */}
          <div className="pt-4 flex flex-col sm:flex-row gap-3">
            <Button 
              type="button" 
              variant="outline" 
              onClick={handlePreview} 
              isLoading={isPreviewLoading}
              icon={<Eye size={18} />}
              className="w-full sm:w-1/2 flex flex-row items-center justify-center gap-2 py-3 border-slate-300 hover:bg-slate-50 text-slate-700 font-bold text-sm"
            >
              ดูพรีวิว PDF
            </Button>
            <Button 
              type="submit" 
              isLoading={isLoading} 
              icon={<Printer size={18} />}
              className="w-full sm:w-1/2 flex flex-row items-center justify-center gap-2 py-3 bg-brand-primary hover:bg-brand-primary-hover text-white font-bold text-sm shadow-lg shadow-brand-primary/30"
            >
              ออกใบเปิดงานซ่อม
            </Button>
          </div>

        </form>
      </div>

      {/* Right Column: PDF Preview / Success View */}
      <div className="w-full lg:w-[50%] bg-white p-6 md:p-8 rounded-3xl border border-slate-200/80 shadow-xs flex flex-col min-h-[500px]">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
            <Eye size={14} /> ตัวอย่างเอกสาร PDF (Live Preview)
          </h3>
          {generatedTicketNo && (
            <span className="bg-emerald-50 text-emerald-700 text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1 border border-emerald-200">
              <CheckCircle2 size={14} /> ออกเอกสารเรียบร้อย
            </span>
          )}
        </div>

        {previewUrl ? (
          <div className="flex-1 flex flex-col space-y-4">
            {generatedTicketNo && (
              <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 p-4 rounded-2xl text-xs space-y-1">
                <div className="font-bold text-sm">✓ ออกใบแจ้งเปิดงานซ่อมเลขที่ {generatedTicketNo} สำเร็จแล้ว</div>
                <div>สามารถกดพิมพ์เอกสาร หรือดาวน์โหลดไฟล์ PDF ด้านล่างได้ทันที</div>
              </div>
            )}

            <div className="flex-1 border border-slate-200 rounded-2xl overflow-hidden bg-slate-100 min-h-[450px]">
              <iframe src={previewUrl} className="w-full h-full border-0" title="PDF Preview" />
            </div>

            <div className="flex justify-between items-center text-xs text-slate-500 pt-2">
              <span>สามารถดูเอกสารย้อนหลังได้ที่เมนูประวัติ</span>
              <Link href="/histories" className="text-brand-primary font-bold hover:underline">
                ไปหน้าประวัติเอกสาร →
              </Link>
            </div>
          </div>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-slate-400 p-8 text-center space-y-3 border-2 border-dashed border-slate-200 rounded-2xl">
            <Printer size={48} className="text-slate-300 animate-pulse" />
            <div className="text-sm font-bold text-slate-600">ยังไม่มีตัวอย่างพรีวิว PDF</div>
            <p className="text-xs text-slate-400 max-w-xs">
              กรอกข้อมูลในฟอร์มทางซ้ายมือ แล้วกดปุ่ม &quot;ดูพรีวิวเอกสาร PDF&quot; เพื่อตรวจสอบความถูกต้องก่อนพิมพ์
            </p>
          </div>
        )}
      </div>
    </div>
  )
}