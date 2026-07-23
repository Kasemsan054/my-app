"use client"

import { useState, useRef, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import { 
  FileText, Calendar, Building, Wrench, ShieldCheck, 
  CheckCircle2, Sparkles, UserCheck, Eraser, Save, AlertCircle, RefreshCw,
  Lock, Plus, Trash2 
} from 'lucide-react'
import { createWorksheet } from '@/app/actions/worksheetActions'
import GeneratorModal from '../../generator/GeneratorModal'
import { PRODUCT_TYPES_LIST, buildBrandModelsMap } from '@/app/lib/sentenceTemplates'
import { DatePickerField, TimePickerField, SelectField, InputField, TextareaField, Tooltip } from '@/app/components/ui'
import { ProductItem, UserItem } from '@/app/types'

const DOC_TYPES_OPTIONS = [
  'ติดตั้งเครื่อง',
  'ซ่อมเครื่อง',
  'รับเครื่องกลับ',
  'Demo',
  'PM/ซ่อมบำรุงรักษาเครื่อง',
  'Training',
  'ส่งตัวเครื่อง',
  'เปลี่ยนอุปกรณ์',
  'Stand By',
  'Visit',
  'อื่นๆ'
]

const JOB_STATUS_OPTIONS = [
  'อยู่ในเงื่อนไขการบริการ',
  'อยู่นอกเงื่อนไขการบริการ',
  'เครื่องใช้งานได้เรียบร้อย',
  'เครื่องยังใช้งานไม่ได้',
  'นำเครื่องลูกค้ากลับและบริษัทมีเครื่องทดแทน',
  'นำเครื่องกลับไม่มีเครื่องทดแทน'
]

interface ServiceWorksheetFormProps {
  currentUser?: {
    employeeId: string
    name: string
    role: string
  } | null
  products?: ProductItem[]
  staffs?: UserItem[]
}

export default function ServiceWorksheetForm({ currentUser, products = [], staffs = [] }: ServiceWorksheetFormProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')
  const [successMsg, setSuccessMsg] = useState('')
  const [isGeneratorOpen, setIsGeneratorOpen] = useState(false)
  const [isCustomModel, setIsCustomModel] = useState(false)

  // Dynamically built brand-models map from Database products merged with defaults
  const brandModelsMap = useMemo(() => buildBrandModelsMap(products), [products])

  // Form State
  const [docTypes, setDocTypes] = useState<string[]>(['ซ่อมเครื่อง'])
  const [otherDocType, setOtherDocType] = useState('')
  const [customerName, setCustomerName] = useState('')
  const [address, setAddress] = useState('')
  const [province, setProvince] = useState('')
  const [installationSpot, setInstallationSpot] = useState('')
  const [serviceDate, setServiceDate] = useState(() => new Date().toISOString().split('T')[0])
  const [startTime, setStartTime] = useState('09:00')
  const [endTime, setEndTime] = useState('12:00')
  
  // Linked Product, Brand & Model State
  const [productType, setProductType] = useState('Barcode Printer')
  const [brand, setBrand] = useState('Godex')
  const [model, setModel] = useState('RT863i')
  const [serialNo, setSerialNo] = useState('')
  const [warrantyStatus, setWarrantyStatus] = useState('อยู่ในประกัน')
  const [symptom, setSymptom] = useState('')
  const [workDetails, setWorkDetails] = useState('')
  const [remarks, setRemarks] = useState('')
  const [jobStatus, setJobStatus] = useState<string[]>(['อยู่ในเงื่อนไขการบริการ', 'เครื่องใช้งานได้เรียบร้อย'])
  const [technicianName] = useState(currentUser?.name || 'ช่างผู้ปฏิบัติงาน')
  const [coTechnicians, setCoTechnicians] = useState<string[]>([])
  const [contactPerson, setContactPerson] = useState('')
  const [contactPosition, setContactPosition] = useState('')
  const [contactPhone, setContactPhone] = useState('')

  // Signature Canvas Ref & State
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const [isDrawing, setIsDrawing] = useState(false)
  const [hasSignature, setHasSignature] = useState(false)

  // Tightly Linked Brand & Model Options
  const availableModels = brandModelsMap[brand] || []

  const handleBrandChange = (newBrand: string) => {
    setBrand(newBrand)
    const modelsForNewBrand = brandModelsMap[newBrand] || []
    setModel(modelsForNewBrand[0] || '')
    setIsCustomModel(false)
  }

  const handleModelSelectChange = (val: string) => {
    if (val === '__custom__') {
      setIsCustomModel(true)
      setModel('')
    } else {
      setModel(val)
    }
  }

  const handleDocTypeToggle = (type: string) => {
    if (docTypes.includes(type)) {
      setDocTypes(docTypes.filter(t => t !== type))
    } else {
      setDocTypes([...docTypes, type])
    }
  }

  const handleJobStatusToggle = (status: string) => {
    if (jobStatus.includes(status)) {
      setJobStatus(jobStatus.filter(s => s !== status))
    } else {
      setJobStatus([...jobStatus, status])
    }
  }

  // --- Signature Canvas Events ---
  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    setIsDrawing(true)
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    const rect = canvas.getBoundingClientRect()
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY
    ctx.beginPath()
    ctx.moveTo(clientX - rect.left, clientY - rect.top)
  }

  const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    const rect = canvas.getBoundingClientRect()
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY
    ctx.lineTo(clientX - rect.left, clientY - rect.top)
    ctx.strokeStyle = '#0f172a'
    ctx.lineWidth = 2.5
    ctx.lineCap = 'round'
    ctx.stroke()
    setHasSignature(true)
  }

  const stopDrawing = () => {
    setIsDrawing(false)
  }

  const clearSignature = () => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    setHasSignature(false)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setErrorMsg('')
    setSuccessMsg('')

    let customerSignatureBase64 = ''
    if (hasSignature && canvasRef.current) {
      customerSignatureBase64 = canvasRef.current.toDataURL('image/png')
    }

    const finalDocTypes = [...docTypes]
    if (docTypes.includes('อื่นๆ') && otherDocType) {
      finalDocTypes.push(otherDocType)
    }

    const primaryTech = currentUser?.name || technicianName
    const validCoTechs = coTechnicians.filter(Boolean)
    const finalTechnicianName = validCoTechs.length > 0 
      ? `${primaryTech} (หลัก), ${validCoTechs.join(', ')}`
      : primaryTech

    const payload = {
      doc_types: finalDocTypes,
      customer_name: customerName,
      address,
      province,
      installation_spot: installationSpot,
      service_date: serviceDate,
      start_time: startTime,
      end_time: endTime,
      product_type: productType,
      brand,
      model,
      serial_no: serialNo,
      warranty_status: warrantyStatus,
      symptom,
      work_details: workDetails,
      remarks,
      job_status: jobStatus,
      technician_name: finalTechnicianName,
      contact_person: contactPerson,
      contact_position: contactPosition,
      contact_phone: contactPhone,
      signature_data: customerSignatureBase64
    }

    const result = await createWorksheet(payload)

    if (result.error) {
      setErrorMsg(result.error)
      setLoading(false)
    } else if (result.success && result.worksheet_no) {
      setSuccessMsg(`บันทึกใบงานสำเร็จ! เลขที่ใบงาน: ${result.worksheet_no}`)
      setTimeout(() => {
        router.push('/histories')
      }, 1500)
    } else {
      setErrorMsg('เกิดข้อผิดพลาดไม่ทราบสาเหตุในการบันทึกใบงาน')
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8">

      {/* Generator Modal */}
      <GeneratorModal
        isOpen={isGeneratorOpen}
        onClose={() => setIsGeneratorOpen(false)}
        onApply={(text) => setWorkDetails(text)}
        initialData={{
          deviceType: productType,
          brand,
          model,
          serialNo,
          symptom
        }}
        products={products}
      />

      {/* Alert Messages */}
      {errorMsg && (
        <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-2xl flex items-center gap-3 font-semibold text-xs animate-in fade-in">
          <AlertCircle className="shrink-0 text-red-500" size={18} />
          <span>{errorMsg}</span>
        </div>
      )}

      {successMsg && (
        <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 p-4 rounded-2xl flex items-center gap-3 font-semibold text-xs animate-in fade-in">
          <CheckCircle2 className="shrink-0 text-emerald-600" size={18} />
          <span>{successMsg}</span>
        </div>
      )}

      {/* Section 1 & Section 2: Side-by-Side (Left & Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-stretch">
        
        {/* Section 1: Document Types (Left Column) */}
        <div className="bg-white p-6 md:p-8 rounded-3xl border border-slate-200 shadow-xs space-y-4 flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center gap-2.5 text-slate-900 font-extrabold text-base border-b border-slate-100 pb-3">
              <FileText className="text-brand-primary" size={20} /> 1. เอกสารดำเนินการ <span className="text-red-500">*</span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
              {DOC_TYPES_OPTIONS.map((type) => {
                const isChecked = docTypes.includes(type)
                return (
                  <label
                    key={type}
                    className={`
                      flex items-center gap-2 p-2.5 rounded-2xl border cursor-pointer transition-all text-xs font-semibold select-none
                      ${isChecked 
                        ? 'bg-brand-primary-light border-blue-500 text-blue-900 shadow-xs font-bold' 
                        : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                      }
                    `}
                  >
                    <input
                      type="checkbox"
                      checked={isChecked}
                      onChange={() => handleDocTypeToggle(type)}
                      className="w-4 h-4 rounded text-brand-primary focus:ring-blue-500 shrink-0"
                    />
                    <span className="truncate">{type}</span>
                  </label>
                )
              })}
            </div>

            {docTypes.includes('อื่นๆ') && (
              <div className="pt-2">
                <InputField
                  label="เอกสารดำเนินการอื่นๆ"
                  value={otherDocType}
                  onChange={(e) => setOtherDocType(e.target.value)}
                  placeholder="ระบุเอกสารดำเนินการอื่นๆ..."
                />
              </div>
            )}
          </div>
        </div>

        {/* Section 2: Date & Time (Right Column) */}
        <div className="bg-white p-6 md:p-8 rounded-3xl border border-slate-200 shadow-xs space-y-4 flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center gap-2.5 text-slate-900 font-extrabold text-base border-b border-slate-100 pb-3">
              <Calendar className="text-brand-primary" size={20} /> 2. วันที่และเวลาเข้าดำเนินการ
            </div>

            <div className="space-y-4">
              {/* Row 1: วันที่เข้าดำเนินการ */}
              <div>
                <DatePickerField
                  label="วันที่เข้าดำเนินการ"
                  value={serviceDate}
                  onChange={(e) => setServiceDate(e.target.value)}
                  required
                />
              </div>

              {/* Row 2: เวลาเริ่ม & เวลาเสร็จสิ้น Side-by-Side 50%-50% Equal Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <TimePickerField
                  label="เวลาเริ่มดำเนินการ"
                  value={startTime}
                  onChange={(e) => setStartTime(e.target.value)}
                  required
                />

                <TimePickerField
                  label="เวลาเสร็จสิ้น (ถึง)"
                  value={endTime}
                  onChange={(e) => setEndTime(e.target.value)}
                  required
                />
              </div>
            </div>
          </div>
        </div>

      </div>

      {/* Section 3: Customer & Location */}
      <div className="bg-white p-6 md:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2 text-slate-900 font-extrabold text-base">
            <Building className="text-brand-primary" size={20} /> 3. ข้อมูลลูกค้าและสถานที่
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="sm:col-span-2">
            <InputField
              label="ชื่อลูกค้า / บริษัทลูกค้า"
              required
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
              placeholder="ระบุชื่อลูกค้า หรือ ชื่อบริษัทลูกค้า"
            />
          </div>

          <div className="sm:col-span-2">
            <TextareaField
              label="ที่อยู่สถานที่ปฏิบัติงาน"
              rows={3}
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="ที่อยู่อาคาร / ถนน / แขวง..."
            />
          </div>

          <div className="sm:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-4">
            <InputField
              label="จังหวัด"
              value={province}
              onChange={(e) => setProvince(e.target.value)}
              placeholder="เช่น กรุงเทพมหานคร, สมุทรปราการ"
            />
            <InputField
              label="จุดติดตั้ง / แผนกที่วางอุปกรณ์"
              value={installationSpot}
              onChange={(e) => setInstallationSpot(e.target.value)}
              placeholder="เช่น คลังสินค้าชั้น 2 แผนกแพ็คสินค้า"
            />
          </div>
        </div>
      </div>

      {/* Section 4: Product & Device Info */}
      <div className="bg-white p-6 md:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2 text-slate-900 font-extrabold text-base">
            <Wrench className="text-brand-primary" size={20} /> 4. รายละเอียดอุปกรณ์ที่ปฏิบัติงาน
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Relational Product Type */}
          <SelectField
            label="ประเภทอุปกรณ์"
            value={productType}
            onChange={(e) => setProductType(e.target.value)}
            options={PRODUCT_TYPES_LIST.map(pt => ({ value: pt, label: pt }))}
          />

          {/* Relational Brand */}
          <SelectField
            label="ยี่ห้อ (Brand)"
            value={brand}
            onChange={(e) => handleBrandChange(e.target.value)}
            required
            options={[
              ...Object.keys(brandModelsMap).map(b => ({ value: b, label: b })),
              { value: 'อื่นๆ', label: 'อื่นๆ' }
            ]}
          />

          {/* Relational Model */}
          {!isCustomModel ? (
            <SelectField
              label={`รุ่น (Model) - ${brand}`}
              value={model}
              onChange={(e) => handleModelSelectChange(e.target.value)}
              required
              options={[
                ...availableModels.map(m => ({ value: m, label: m })),
                { value: '__custom__', label: '+ พิมพ์ชื่อรุ่นเอง (Custom)' }
              ]}
            />
          ) : (
            <div className="relative">
              <InputField
                label="รุ่น (พิมพ์เอง)"
                required
                value={model}
                onChange={(e) => setModel(e.target.value)}
                placeholder="กรอกชื่อรุ่น..."
              />
              <button
                type="button"
                onClick={() => setIsCustomModel(false)}
                className="absolute right-0 top-0 text-[10px] text-brand-primary font-bold hover:underline cursor-pointer"
              >
                ← เลือกจากรายการ
              </button>
            </div>
          )}

          {/* Serial Number */}
          <InputField
            label="หมายเลขซีเรียล (S/N)"
            value={serialNo}
            onChange={(e) => setSerialNo(e.target.value)}
            placeholder="เช่น 21420535"
          />
        </div>

        <div className="pt-2">
          <SelectField
            label="สถานะการรับประกัน"
            value={warrantyStatus}
            onChange={(e) => setWarrantyStatus(e.target.value)}
            options={[
              { value: 'อยู่ในประกัน', label: 'อยู่ในประกัน (In Warranty)' },
              { value: 'หมดประกัน', label: 'หมดประกัน (Out of Warranty)' },
              { value: 'สัญญาบริการ (MA)', label: 'สัญญาบริการ (Maintenance Agreement - MA)' },
              { value: 'อื่นๆ', label: 'อื่นๆ' }
            ]}
          />
        </div>
      </div>

      {/* Section 5: Work Details & Sentence Generator */}
      <div className="bg-white p-6 md:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2 text-slate-900 font-extrabold text-base">
            <Sparkles className="text-brand-primary" size={20} /> 5. รายละเอียดการปฏิบัติงาน & อาการเสีย
          </div>

          <button
            type="button"
            onClick={() => setIsGeneratorOpen(true)}
            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-2xl font-bold text-xs shadow-md shadow-blue-500/20 transition-all cursor-pointer hover:scale-[1.02]"
          >
            <Sparkles size={14} className="animate-pulse text-amber-300" />
            เปิดเครื่องมือสร้างประโยคอัตโนมัติ (Generator Tool)
          </button>
        </div>

        <div className="space-y-4">
          <InputField
            label="อาการเสีย / สาเหตุที่รับแจ้ง"
            value={symptom}
            onChange={(e) => setSymptom(e.target.value)}
            placeholder="ระบุอาการเสียเบื้องต้น..."
          />

          <TextareaField
            label="รายละเอียดการปฏิบัติงานและการแก้ไข (Work Action Details)"
            rows={5}
            value={workDetails}
            onChange={(e) => setWorkDetails(e.target.value)}
            placeholder="รายละเอียดขั้นตอนการปฏิบัติงานของช่าง..."
          />

          <TextareaField
            label="หมายเหตุเพิ่มเติม (Remarks)"
            rows={2}
            value={remarks}
            onChange={(e) => setRemarks(e.target.value)}
            placeholder="ข้อเสนอแนะเพิ่มเติม..."
          />
        </div>
      </div>

      {/* Section 6: Job Status Checkboxes */}
      <div className="bg-white p-6 md:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2 text-slate-900 font-extrabold text-base">
            <ShieldCheck className="text-brand-primary" size={20} /> 6. สรุปสถานะการบริการ
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
          {JOB_STATUS_OPTIONS.map((status) => {
            const isChecked = jobStatus.includes(status)
            return (
              <label
                key={status}
                className={`
                  flex items-center gap-2.5 p-3 rounded-2xl border cursor-pointer transition-all text-xs font-semibold select-none
                  ${isChecked 
                    ? 'bg-brand-primary-light border-blue-500 text-blue-900 shadow-xs font-bold' 
                    : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                  }
                `}
              >
                <input
                  type="checkbox"
                  checked={isChecked}
                  onChange={() => handleJobStatusToggle(status)}
                  className="w-4 h-4 rounded text-brand-primary focus:ring-blue-500"
                />
                <span>{status}</span>
              </label>
            )
          })}
        </div>
      </div>

      {/* Section 7: Signatures & Technician Info */}
      <div className="bg-white p-6 md:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-6">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2 text-slate-900 font-extrabold text-base">
            <UserCheck className="text-brand-primary" size={20} /> 7. ผู้ปฏิบัติงาน & ลายเซ็นผู้ตรวจรับงาน
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Technician Info (Primary Locked + Co-technicians) */}
          <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 space-y-4">
            <div className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center justify-between">
              <span>ข้อมูลผู้ปฏิบัติงาน (Technician)</span>
              <span className="text-[11px] font-bold text-amber-700 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-lg flex items-center gap-1">
                <Lock size={12} /> ล็อกผู้ทำรายการหลัก
              </span>
            </div>

            {/* Primary Technician (Locked) */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-700">
                ผู้ปฏิบัติงานหลัก (ผู้ทำรายการ) <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <ShieldCheck size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-brand-primary" />
                <input
                  type="text"
                  readOnly
                  disabled
                  value={currentUser?.name || technicianName}
                  className="w-full h-11 bg-slate-100 border border-slate-300 pl-10 pr-4 rounded-2xl text-xs font-extrabold text-slate-800 cursor-not-allowed select-none"
                />
              </div>
            </div>

            {/* Co-Technicians List */}
            <div className="pt-2 border-t border-slate-200/80 space-y-3">
              <div className="flex items-center justify-between">
                <label className="block text-xs font-bold text-slate-700">
                  ผู้ปฏิบัติงานร่วม (ถ้าไปหลายคน)
                </label>
                <button
                  type="button"
                  onClick={() => setCoTechnicians([...coTechnicians, ''])}
                  className="text-xs font-bold text-brand-primary hover:text-blue-800 bg-brand-primary-light/80 hover:bg-blue-200/80 px-2.5 py-1 rounded-xl transition-colors cursor-pointer flex items-center gap-1"
                >
                  <Plus size={13} /> + เพิ่มช่างร่วมปฏิบัติงาน
                </button>
              </div>

              {coTechnicians.length === 0 && (
                <div className="text-[11px] text-slate-400 italic">
                  กดปุ่มด้านบนหากมีช่างร่วมปฏิบัติงานมากกว่า 1 คน
                </div>
              )}

              {coTechnicians.map((coTech, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  <div className="flex-1">
                    <SelectField
                      value={coTech}
                      onChange={(e) => {
                        const updated = [...coTechnicians]
                        updated[idx] = e.target.value
                        setCoTechnicians(updated)
                      }}
                      options={[
                        { value: '', label: `-- เลือกช่างร่วมคนที่ ${idx + 1} --` },
                        ...staffs
                          .filter(s => s.name !== (currentUser?.name || technicianName) && !coTechnicians.includes(s.name))
                          .map(s => ({ value: s.name, label: s.name }))
                      ]}
                    />
                  </div>
                  <Tooltip content="ลบช่างร่วมท่านนี้" position="top">
                    <button
                      type="button"
                      onClick={() => setCoTechnicians(coTechnicians.filter((_, i) => i !== idx))}
                      className="p-2 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-xl transition-colors shrink-0 cursor-pointer inline-block"
                    >
                      <Trash2 size={16} />
                    </button>
                  </Tooltip>
                </div>
              ))}
            </div>
          </div>

          {/* Customer Signature & Contact Info */}
          <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 space-y-4">
            <div className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center justify-between">
              <span>ข้อมูลผู้ตรวจรับงาน (Customer Sign-off)</span>
              {hasSignature && (
                <button
                  type="button"
                  onClick={clearSignature}
                  className="text-xs text-red-600 hover:text-red-800 font-bold flex items-center gap-1 cursor-pointer"
                >
                  <Eraser size={14} /> ล้างลายเซ็น
                </button>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <InputField
                label="ชื่อผู้ตรวจรับงาน"
                value={contactPerson}
                onChange={(e) => setContactPerson(e.target.value)}
                placeholder="ชื่อ-นามสกุล..."
              />
              <InputField
                label="ตำแหน่ง"
                value={contactPosition}
                onChange={(e) => setContactPosition(e.target.value)}
                placeholder="ตำแหน่ง..."
              />
              <InputField
                label="เบอร์โทรศัพท์"
                value={contactPhone}
                onChange={(e) => setContactPhone(e.target.value)}
                placeholder="08X-XXX-XXXX"
              />
            </div>

            {/* Signature Canvas Pad */}
            <div className="space-y-1.5 pt-2">
              <label className="block text-xs font-bold text-slate-700">ลายเซ็นผู้ตรวจรับงาน (แตะหรือใช้เมาส์เซ็น):</label>
              <div className="bg-white border-2 border-dashed border-slate-300 rounded-2xl overflow-hidden touch-none relative">
                <canvas
                  ref={canvasRef}
                  width={400}
                  height={150}
                  onMouseDown={startDrawing}
                  onMouseMove={draw}
                  onMouseUp={stopDrawing}
                  onMouseLeave={stopDrawing}
                  onTouchStart={startDrawing}
                  onTouchMove={draw}
                  onTouchEnd={stopDrawing}
                  className="w-full h-[150px] cursor-crosshair bg-white"
                />
                {!hasSignature && (
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none text-slate-400 text-xs font-medium">
                    เซ็นลายเซ็นลงในกรอบนี้
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Form Submission Footer */}
      <div className="flex items-center justify-end gap-4 pt-4 border-t border-slate-200">
        <button
          type="button"
          onClick={() => router.push('/histories')}
          className="px-6 py-3.5 rounded-2xl text-xs font-bold text-slate-600 hover:bg-slate-200 transition-colors cursor-pointer"
        >
          ยกเลิก
        </button>

        <button
          type="submit"
          disabled={loading}
          className="flex items-center gap-2 px-8 py-3.5 bg-brand-primary hover:bg-brand-primary-hover text-white rounded-2xl font-bold text-xs shadow-lg shadow-brand-primary/30 transition-all cursor-pointer hover:scale-[1.01] disabled:opacity-50"
        >
          {loading ? (
            <>
              <RefreshCw size={18} className="animate-spin" />
              กำลังบันทึกข้อมูล...
            </>
          ) : (
            <>
              <Save size={18} />
              บันทึกใบงานบริการ (Save Worksheet)
            </>
          )}
        </button>
      </div>

    </form>
  )
}
