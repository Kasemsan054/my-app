"use client"

import { useState, useRef, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import { 
  FileText, Calendar, Clock, Building, Wrench, ShieldCheck, 
  CheckCircle2, Sparkles, UserCheck, Phone, Eraser, Save, AlertCircle, RefreshCw 
} from 'lucide-react'
import { createWorksheet } from '@/app/actions/worksheetActions'
import GeneratorModal from '../generator/GeneratorModal'
import { PRODUCT_TYPES_LIST, buildBrandModelsMap } from '@/app/lib/sentenceTemplates'
import { DatePickerField, TimePickerField, SelectField, InputField, TextareaField } from '@/app/components/ui'
import { ProductItem } from '@/app/types'

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

interface WorksheetFormProps {
  currentUser?: {
    employeeId: string
    name: string
    role: string
  } | null
  products?: ProductItem[]
}

export default function WorksheetForm({ currentUser, products = [] }: WorksheetFormProps) {
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
  const [technicianName, setTechnicianName] = useState(currentUser?.name || '')
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
      setIsCustomModel(false)
      setModel(val)
    }
  }

  // Canvas Drawing Handlers
  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    setIsDrawing(true)
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
    ctx.lineJoin = 'round'
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

  const handleDocTypeToggle = (type: string) => {
    setDocTypes(prev => 
      prev.includes(type) ? prev.filter(t => t !== type) : [...prev, type]
    )
  }

  const handleJobStatusToggle = (status: string) => {
    setJobStatus(prev => 
      prev.includes(status) ? prev.filter(s => s !== status) : [...prev, status]
    )
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrorMsg('')
    setSuccessMsg('')
    setLoading(true)

    try {
      let signatureBase64 = ''
      if (hasSignature && canvasRef.current) {
        signatureBase64 = canvasRef.current.toDataURL('image/png')
      }

      const finalDocTypes = docTypes.map(t => t === 'อื่นๆ' && otherDocType ? `อื่นๆ: ${otherDocType}` : t)

      const result = await createWorksheet({
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
        technician_name: technicianName,
        contact_person: contactPerson,
        contact_position: contactPosition,
        contact_phone: contactPhone,
        signature_data: signatureBase64
      })

      if (result.success) {
        setSuccessMsg(`บันทึกใบงาน Worksheet เรียบร้อยแล้ว! เลขที่ใบงาน: ${result.worksheet_no}`)
        window.scrollTo({ top: 0, behavior: 'smooth' })
        setTimeout(() => {
          router.refresh()
        }, 1500)
      } else {
        setErrorMsg(result.error || 'เกิดข้อผิดพลาดในการบันทึกข้อมูล')
      }
    } catch (err: unknown) {
      const error = err as Error
      setErrorMsg(error.message || 'เกิดข้อผิดพลาดในระบบ')
    } finally {
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
        <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-2xl flex items-center gap-3 font-semibold text-xs">
          <AlertCircle className="shrink-0 text-red-500" size={18} />
          <span>{errorMsg}</span>
        </div>
      )}

      {successMsg && (
        <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 p-4 rounded-2xl flex items-center gap-3 font-semibold text-xs">
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
      <div className="bg-white p-6 md:p-8 rounded-3xl border border-slate-200 shadow-xs space-y-4">
        <div className="flex items-center gap-2.5 text-slate-900 font-extrabold text-base border-b border-slate-100 pb-3">
          <Building className="text-brand-primary" size={20} /> 3. ข้อมูลลูกค้าและสถานที่
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

      {/* Section 4: Product & Device Info - Standardized Relational Sizing */}
      <div className="bg-white p-6 md:p-8 rounded-3xl border border-slate-200 shadow-xs space-y-4">
        <div className="flex items-center gap-2.5 text-slate-900 font-extrabold text-base border-b border-slate-100 pb-3">
          <Wrench className="text-brand-primary" size={20} /> 4. ข้อมูลสินค้าและอุปกรณ์
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 items-start">
          
          {/* Product Type */}
          <SelectField
            label="ประเภทสินค้า"
            value={productType}
            onChange={(e) => setProductType(e.target.value)}
            required
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

        {/* Warranty Status */}
        <div className="pt-2 border-t border-slate-100 mt-4">
          <label className="block text-sm font-medium text-slate-700 mb-2 mt-2">
            สถานะประกันตัวเครื่อง <span className="text-red-500">*</span>
          </label>
          <div className="flex gap-4">
            {['อยู่ในประกัน', 'ไม่อยู่ในประกัน'].map((st) => (
              <label key={st} className="flex items-center gap-2 text-sm font-semibold text-slate-700 cursor-pointer select-none">
                <input
                  type="radio"
                  name="warrantyStatus"
                  value={st}
                  checked={warrantyStatus === st}
                  onChange={(e) => setWarrantyStatus(e.target.value)}
                  className="w-4 h-4 text-brand-primary focus:ring-blue-500"
                />
                <span>{st}</span>
              </label>
            ))}
          </div>
        </div>
      </div>

      {/* Section 5: Work Details & Sentence Generator */}
      <div className="bg-white p-6 md:p-8 rounded-3xl border border-slate-200 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2.5 text-slate-900 font-extrabold text-base">
            <FileText className="text-brand-primary" size={20} /> 5. อาการเสียและรายละเอียดการดำเนินงาน
          </div>

          {/* SINGLE Generator Button */}
          <button
            type="button"
            onClick={() => setIsGeneratorOpen(true)}
            className="flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white text-xs font-bold px-4 py-2.5 rounded-2xl shadow-md shadow-blue-500/20 transition-all cursor-pointer transform hover:-translate-y-0.5"
          >
            <Sparkles size={16} /> ✨ ช่วยสร้างประโยคอธิบายการทำงาน
          </button>
        </div>

        <div className="space-y-4">
          <InputField
            label="อาการเสีย (Symptom / Problem)"
            value={symptom}
            onChange={(e) => setSymptom(e.target.value)}
            placeholder="ระบุอาการเสียที่พบ เช่น หัวพิมพ์ขาด, สแกนไม่ติด..."
          />

          <TextareaField
            label="รายละเอียดการดำเนินงาน"
            required
            rows={6}
            value={workDetails}
            onChange={(e) => setWorkDetails(e.target.value)}
            placeholder="รายละเอียดการดำเนินงานซ่อม/เปลี่ยนอะไหล่/ทดสอบเครื่อง..."
            className="font-mono leading-relaxed"
          />

          <InputField
            label="หมายเหตุเพิ่มเติม"
            value={remarks}
            onChange={(e) => setRemarks(e.target.value)}
            placeholder="หมายเหตุเพิ่มเติม (ถ้ามี)"
          />
        </div>
      </div>

      {/* Section 6: Job Status */}
      <div className="bg-white p-6 md:p-8 rounded-3xl border border-slate-200 shadow-xs space-y-4">
        <div className="flex items-center gap-2.5 text-slate-900 font-extrabold text-base border-b border-slate-100 pb-3">
          <ShieldCheck className="text-brand-primary" size={20} /> 6. สรุปสถานะงาน (Job Status)
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
          {JOB_STATUS_OPTIONS.map((st) => {
            const isChecked = jobStatus.includes(st)
            return (
              <label
                key={st}
                className={`
                  flex items-center gap-2.5 p-3 rounded-2xl border cursor-pointer transition-all text-sm font-semibold select-none
                  ${isChecked 
                    ? 'bg-emerald-50 border-emerald-500 text-emerald-900 shadow-xs font-bold' 
                    : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                  }
                `}
              >
                <input
                  type="checkbox"
                  checked={isChecked}
                  onChange={() => handleJobStatusToggle(st)}
                  className="w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500"
                />
                <span>{st}</span>
              </label>
            )
          })}
        </div>
      </div>

      {/* Section 7: Technician & Signature */}
      <div className="bg-white p-6 md:p-8 rounded-3xl border border-slate-200 shadow-xs space-y-6">
        <div className="flex items-center gap-2.5 text-slate-900 font-extrabold text-base border-b border-slate-100 pb-3">
          <UserCheck className="text-brand-primary" size={20} /> 7. ผู้ลงนามและข้อมูลติดต่อ
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <InputField
            label="ช่างผู้ดำเนินการ"
            required
            value={technicianName}
            onChange={(e) => setTechnicianName(e.target.value)}
            placeholder="ชื่อช่างผู้เข้าปฏิบัติงาน"
          />

          <InputField
            label="ชื่อลูกค้าผู้ลงนามรับงาน"
            value={contactPerson}
            onChange={(e) => setContactPerson(e.target.value)}
            placeholder="ชื่อ-นามสกุล ผู้ลงนาม"
          />

          <InputField
            label="ตำแหน่งผู้ลงนาม"
            value={contactPosition}
            onChange={(e) => setContactPosition(e.target.value)}
            placeholder="เช่น IT Support, Manager"
          />

          <InputField
            label="เบอร์โทรศัพท์ติดต่อ"
            type="tel"
            value={contactPhone}
            onChange={(e) => setContactPhone(e.target.value)}
            placeholder="เบอร์โทรศัพท์ลูกค้า"
          />
        </div>

        {/* Digital Signature Box */}
        <div className="pt-4 border-t border-slate-100 space-y-2">
          <div className="flex items-center justify-between">
            <label className="block text-sm font-medium text-slate-700">
              ลายเซ็นต์ลูกค้า (Customer Signature)
            </label>
            <button
              type="button"
              onClick={clearSignature}
              className="text-xs text-slate-500 hover:text-red-600 font-semibold flex items-center gap-1 cursor-pointer"
            >
              <Eraser size={14} /> ล้างลายเซ็นต์
            </button>
          </div>

          <div className="border-2 border-dashed border-slate-300 rounded-2xl bg-slate-50 overflow-hidden relative touch-none max-w-lg">
            <canvas
              ref={canvasRef}
              width={480}
              height={180}
              onMouseDown={startDrawing}
              onMouseMove={draw}
              onMouseUp={stopDrawing}
              onMouseLeave={stopDrawing}
              onTouchStart={startDrawing}
              onTouchMove={draw}
              onTouchEnd={stopDrawing}
              className="w-full h-[180px] bg-white cursor-crosshair"
            />
            {!hasSignature && (
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none text-xs text-slate-400 font-medium">
                ใช้นิ้วหรือเมาส์ลากเพื่อเซ็นชื่อลงในช่องนี้
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Submit Button */}
      <div className="flex justify-end pt-4 pb-12">
        <button
          type="submit"
          disabled={loading}
          className="w-full sm:w-auto px-8 py-4 bg-brand-primary hover:bg-brand-primary-hover text-white font-extrabold rounded-2xl shadow-xl shadow-brand-primary/30 transition-all flex items-center justify-center gap-2 cursor-pointer text-sm disabled:opacity-50 transform hover:-translate-y-0.5"
        >
          {loading ? <RefreshCw className="animate-spin" size={18} /> : <Save size={18} />}
          {loading ? 'กำลังบันทึกข้อมูล...' : 'บันทึกใบงาน Worksheet'}
        </button>
      </div>

    </form>
  )
}
