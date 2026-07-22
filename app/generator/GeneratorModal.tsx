"use client"

import { useState, useEffect, useMemo } from 'react'
import { 
  X, Sparkles, Copy, Check, Wand2, Wrench, CornerDownLeft 
} from 'lucide-react'
import { 
  SentenceData, TemplateId, TEMPLATES, PRODUCT_TYPES_LIST, 
  SYMPTOM_PRESETS, RESOLUTION_PRESETS, generateSentence, buildBrandModelsMap 
} from '@/app/lib/sentenceTemplates'
import { SelectField, InputField, TextareaField } from '@/app/components/ui'
import { ProductItem } from '@/app/types'

interface GeneratorModalProps {
  isOpen: boolean
  onClose: () => void
  onApply?: (text: string) => void
  initialData?: Partial<SentenceData>
  products?: ProductItem[]
}

export default function GeneratorModal({ isOpen, onClose, onApply, initialData, products = [] }: GeneratorModalProps) {
  const [activeTemplate, setActiveTemplate] = useState<TemplateId>('printhead')
  const [copied, setCopied] = useState(false)
  const [isCustomModel, setIsCustomModel] = useState(false)

  // Dynamically built brand-models map from Database products merged with defaults
  const brandModelsMap = useMemo(() => buildBrandModelsMap(products), [products])

  const [formData, setFormData] = useState<SentenceData>({
    deviceType: 'Barcode Printer',
    brand: 'Godex',
    model: 'RT863i',
    serialNo: '21420535',
    symptom: 'หัวพิมพ์ขาด',
    resolution: 'เปลี่ยนหัวพิมพ์ใหม่ และทดสอบการใช้งานตัวเครื่องสามารถใช้งานได้ปกติ',
    mileage: '119,166',
    oldSerial: 'T7FV00324200007',
    newSerial: 'T7FV00324150013',
    replacedPartName: '',
    testResult: 'เครื่องสามารถใช้งานได้ปกติ',
    firmwareOld: '',
    firmwareNew: '',
    customNotes: ''
  })

  useEffect(() => {
    if (initialData && isOpen) {
      setFormData(prev => ({
        ...prev,
        ...initialData,
        deviceType: initialData.deviceType || prev.deviceType || 'Barcode Printer',
        brand: initialData.brand || prev.brand || 'Godex',
        model: initialData.model || prev.model || 'RT863i',
        serialNo: initialData.serialNo || prev.serialNo || '',
        symptom: initialData.symptom || prev.symptom || ''
      }))
    }
  }, [initialData, isOpen])

  if (!isOpen) return null

  const availableModels = brandModelsMap[formData.brand] || []

  const handleBrandChange = (newBrand: string) => {
    const modelsForNewBrand = brandModelsMap[newBrand] || []
    const firstModel = modelsForNewBrand[0] || ''
    setFormData(prev => ({
      ...prev,
      brand: newBrand,
      model: firstModel
    }))
    setIsCustomModel(false)
  }

  const generatedText = generateSentence(activeTemplate, formData)

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(generatedText)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      // fallback
    }
  }

  const handleApplyToForm = () => {
    if (onApply) {
      onApply(generatedText)
      onClose()
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200 overflow-y-auto">
      <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden my-auto">
        
        {/* Header */}
        <div className="bg-slate-900 text-white p-5 px-6 flex items-center justify-between border-b border-slate-800 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-500 flex items-center justify-center shadow-md text-white">
              <Sparkles size={20} />
            </div>
            <div>
              <h2 className="text-lg font-bold flex items-center gap-2">
                ระบบสร้างประโยคสรุปการทำงาน
                <span className="text-xs font-semibold bg-blue-500/20 text-blue-300 border border-blue-400/30 px-2.5 py-0.5 rounded-full">
                  Sentence Generator
                </span>
              </h2>
              <p className="text-xs text-slate-300">
                เลือกรูปแบบ กรอกข้อมูลอุปกรณ์ และรับประโยคสรุปรายงานการทำงานทันที
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">

          {/* Template Selection Tabs */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
              1. เลือกรูปแบบประโยครายงาน (Template)
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2.5">
              {TEMPLATES.map((tmpl) => {
                const isActive = activeTemplate === tmpl.id
                return (
                  <button
                    key={tmpl.id}
                    type="button"
                    onClick={() => setActiveTemplate(tmpl.id)}
                    className={`
                      p-3 rounded-2xl text-left border transition-all flex flex-col justify-between gap-2 cursor-pointer
                      ${isActive 
                        ? 'bg-blue-50 border-blue-600 text-blue-900 shadow-sm ring-2 ring-blue-600/20 font-bold' 
                        : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300 hover:bg-slate-50'
                      }
                    `}
                  >
                    <span className={`text-xs px-2 py-0.5 rounded-md font-semibold w-fit ${isActive ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-500'}`}>
                      {tmpl.badge}
                    </span>
                    <div className="text-xs font-bold leading-tight">{tmpl.name}</div>
                  </button>
                )
              })}
            </div>
          </div>

          {/* Form Fields & Live Preview Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

            {/* Left side: Inputs */}
            <div className="lg:col-span-7 space-y-4">
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-4">
                <div className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5 border-b border-slate-200 pb-2">
                  <Wrench size={14} className="text-blue-600" /> ข้อมูลอุปกรณ์และการแก้ไข
                </div>

                {/* Device Type & Brand - Dynamic Database Select Fields */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <SelectField
                    label="ประเภทสินค้า / อุปกรณ์"
                    value={formData.deviceType}
                    onChange={(e) => setFormData({ ...formData, deviceType: e.target.value })}
                    options={PRODUCT_TYPES_LIST.map((pt) => ({ value: pt, label: pt }))}
                  />

                  <SelectField
                    label="ยี่ห้อ (Brand)"
                    value={formData.brand}
                    onChange={(e) => handleBrandChange(e.target.value)}
                    options={[
                      ...Object.keys(brandModelsMap).map((b) => ({ value: b, label: b })),
                      { value: 'อื่นๆ', label: 'อื่นๆ' }
                    ]}
                  />
                </div>

                {/* Model & Serial */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="block text-sm font-medium text-slate-700">
                        รุ่น (Model) - {formData.brand}
                      </label>
                      <button
                        type="button"
                        onClick={() => setIsCustomModel(!isCustomModel)}
                        className="text-[10px] text-blue-600 font-bold hover:underline"
                      >
                        {isCustomModel ? 'เลือกจากรายการ' : '+ พิมพ์รุ่นเอง'}
                      </button>
                    </div>

                    {!isCustomModel && availableModels.length > 0 ? (
                      <SelectField
                        value={formData.model}
                        onChange={(e) => setFormData({ ...formData, model: e.target.value })}
                        options={availableModels.map((m) => ({ value: m, label: m }))}
                      />
                    ) : (
                      <InputField
                        label=""
                        value={formData.model}
                        onChange={(e) => setFormData({ ...formData, model: e.target.value })}
                        placeholder="กรอกชื่อรุ่น..."
                      />
                    )}
                  </div>

                  <div>
                    <InputField
                      label="หมายเลขซีเรียล (S/N)"
                      value={formData.serialNo}
                      onChange={(e) => setFormData({ ...formData, serialNo: e.target.value })}
                      placeholder="เช่น 21420535"
                    />
                  </div>
                </div>

                {/* Symptom */}
                <div>
                  <InputField
                    label="อาการที่พบ / อาการเสีย"
                    value={formData.symptom}
                    onChange={(e) => setFormData({ ...formData, symptom: e.target.value })}
                    placeholder="เช่น หัวพิมพ์ขาด"
                  />
                  <div className="flex gap-1 flex-wrap mt-1.5">
                    {SYMPTOM_PRESETS.slice(0, 4).map((sym) => (
                      <button
                        key={sym}
                        type="button"
                        onClick={() => setFormData({ ...formData, symptom: sym })}
                        className="text-[10px] bg-amber-50 text-amber-700 border border-amber-200 hover:bg-amber-100 px-2 py-0.5 rounded-md font-medium"
                      >
                        {sym}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Resolution */}
                <div>
                  <TextareaField
                    label="การแก้ไข / การดำเนินการ"
                    rows={2}
                    value={formData.resolution}
                    onChange={(e) => setFormData({ ...formData, resolution: e.target.value })}
                    placeholder="รายละเอียดการแก้ไข..."
                  />
                  <div className="flex gap-1 flex-wrap mt-1.5">
                    {RESOLUTION_PRESETS.slice(0, 2).map((res, i) => (
                      <button
                        key={i}
                        type="button"
                        onClick={() => setFormData({ ...formData, resolution: res })}
                        className="text-[10px] bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100 px-2 py-0.5 rounded-md font-medium text-left truncate max-w-full"
                      >
                        +{res.slice(0, 35)}...
                      </button>
                    ))}
                  </div>
                </div>

                {/* Template Specific Fields */}
                {activeTemplate === 'printhead' && (
                  <div className="pt-2 border-t border-slate-200 space-y-3">
                    <div>
                      <InputField
                        label="ระยะหัวพิมพ์ (M.)"
                        value={formData.mileage || ''}
                        onChange={(e) => setFormData({ ...formData, mileage: e.target.value })}
                        placeholder="เช่น 119,166"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <InputField
                          label="S/N หัวพิมพ์เก่า"
                          value={formData.oldSerial || ''}
                          onChange={(e) => setFormData({ ...formData, oldSerial: e.target.value })}
                          placeholder="เช่น T7FV00324200007"
                        />
                      </div>
                      <div>
                        <InputField
                          label="S/N หัวพิมพ์ใหม่"
                          value={formData.newSerial || ''}
                          onChange={(e) => setFormData({ ...formData, newSerial: e.target.value })}
                          placeholder="เช่น T7FV00324150013"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {activeTemplate === 'part_replacement' && (
                  <div className="pt-2 border-t border-slate-200 space-y-3">
                    <div>
                      <InputField
                        label="ชื่ออะไหล่ที่เปลี่ยน"
                        value={formData.replacedPartName || ''}
                        onChange={(e) => setFormData({ ...formData, replacedPartName: e.target.value })}
                        placeholder="เช่น Mainboard, Roller, Platen Belt"
                      />
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <InputField
                          label="S/N อะไหล่เก่า (ถ้ามี)"
                          value={formData.oldSerial || ''}
                          onChange={(e) => setFormData({ ...formData, oldSerial: e.target.value })}
                          placeholder="S/N อะไหล่เดิม"
                        />
                      </div>
                      <div>
                        <InputField
                          label="S/N อะไหล่ใหม่ (ถ้ามี)"
                          value={formData.newSerial || ''}
                          onChange={(e) => setFormData({ ...formData, newSerial: e.target.value })}
                          placeholder="S/N อะไหล่ใหม่"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {activeTemplate === 'firmware' && (
                  <div className="pt-2 border-t border-slate-200 space-y-3">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <InputField
                          label="เวอร์ชัน Firmware เดิม"
                          value={formData.firmwareOld || ''}
                          onChange={(e) => setFormData({ ...formData, firmwareOld: e.target.value })}
                          placeholder="เช่น v1.0.2"
                        />
                      </div>
                      <div>
                        <InputField
                          label="เวอร์ชัน Firmware ใหม่"
                          value={formData.firmwareNew || ''}
                          onChange={(e) => setFormData({ ...formData, firmwareNew: e.target.value })}
                          placeholder="เช่น v1.2.0"
                        />
                      </div>
                    </div>
                  </div>
                )}

              </div>
            </div>

            {/* Right side: Live Preview */}
            <div className="lg:col-span-5 flex flex-col h-full">
              <div className="bg-slate-900 rounded-2xl p-4 flex-1 flex flex-col text-white shadow-inner border border-slate-800 min-h-[300px]">
                <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-3">
                  <div className="flex items-center gap-2 text-xs font-bold text-blue-400">
                    <Wand2 size={16} /> ตัวอย่างข้อความที่จะได้ (Generated Output)
                  </div>
                  <button
                    type="button"
                    onClick={handleCopy}
                    className={`
                      flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-xl font-semibold transition-all cursor-pointer
                      ${copied 
                        ? 'bg-emerald-500 text-white' 
                        : 'bg-blue-600 hover:bg-blue-500 text-white shadow-md shadow-blue-600/30'
                      }
                    `}
                  >
                    {copied ? <Check size={14} /> : <Copy size={14} />}
                    {copied ? 'คัดลอกแล้ว!' : 'คัดลอกข้อความ'}
                  </button>
                </div>

                <div className="flex-1 bg-slate-950/80 p-4 rounded-xl font-mono text-xs text-slate-200 whitespace-pre-wrap leading-relaxed border border-slate-800 select-all">
                  {generatedText}
                </div>

                <p className="text-[11px] text-slate-400 mt-3 text-center">
                  💡 ข้อความด้านบนจะถูกอัปเดตแบบ Real-time ตามที่คุณกรอกในฟอร์ม
                </p>
              </div>
            </div>

          </div>

        </div>

        {/* Modal Footer */}
        <div className="bg-slate-100 p-4 px-6 border-t border-slate-200 flex flex-col sm:flex-row justify-between items-center gap-3 shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="w-full sm:w-auto px-4 py-2.5 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-200 transition-colors"
          >
            ยกเลิก (Cancel)
          </button>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              type="button"
              onClick={handleCopy}
              className="flex-1 sm:flex-none px-4 py-2.5 rounded-xl text-xs font-bold bg-white text-slate-800 border border-slate-300 hover:bg-slate-50 transition-colors flex items-center justify-center gap-1.5"
            >
              <Copy size={14} /> {copied ? 'คัดลอกแล้ว' : 'คัดลอกข้อความเท่านั้น'}
            </button>

            {onApply && (
              <button
                type="button"
                onClick={handleApplyToForm}
                className="flex-1 sm:flex-none px-5 py-2.5 rounded-xl text-xs font-bold bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-600/30 transition-all flex items-center justify-center gap-1.5"
              >
                <CornerDownLeft size={14} /> นำข้อความไปใส่ในฟอร์ม
              </button>
            )}
          </div>
        </div>

      </div>
    </div>
  )
}
