"use client"

import { useState, useEffect, useMemo } from 'react'
import { 
  X, Sparkles, Copy, Check, Wrench, CornerDownLeft, Plus, Layers, UserCheck, FileEdit, Trash2
} from 'lucide-react'
import { 
  SentenceData, TemplateId, TEMPLATES, PRODUCT_TYPES_LIST, 
  generateSentence, buildBrandModelsMap 
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
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [copiedLineIdx, setCopiedLineIdx] = useState<number | null>(null)
  const [isCustomModel, setIsCustomModel] = useState(false)

  // Dynamically built brand-models map from Database products merged with defaults
  const brandModelsMap = useMemo(() => buildBrandModelsMap(products), [products])

  const [formData, setFormData] = useState<SentenceData>({
    deviceType: 'Barcode Printer',
    brand: 'HPRT',
    model: 'HT800',
    serialNo: 'HT800023280476',
    symptom: 'ไฟเข้าบ้าง ไม่เข้าบ้าง',
    resolution: 'เปลี่ยนหัวพิมพ์ใหม่ และทดสอบการใช้งานตัวเครื่องสามารถใช้งานได้ปกติ',
    mileage: '119,166',
    isMileageUnknown: false,
    oldSerial: 'T7FV00324200007',
    newSerial: 'T7FV00324150013',
    replacedPartName: '',
    testResult: 'เครื่องสามารถใช้งานได้ปกติ',
    firmwareOld: '',
    firmwareNew: '',
    customNotes: '',
    devices: [
      { serialNo: 'HT800023280476', symptom: 'ไฟเข้าบ้าง ไม่เข้าบ้าง' },
      { serialNo: 'HT800023280473', symptom: 'ปรินกระโดดในบางครั้ง' }
    ],
    contactName: 'ยศวัจน์ สมบูรณ์',
    contactPosition: 'เจ้าหน้าที่คลัง',
    contactPhone: '0949191626'
  })

  useEffect(() => {
    if (initialData && isOpen) {
      // eslint-disable-next-line
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

  // const generatedLines = generatedText.split('\n').filter(line => line.trim().length > 0)

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(generatedText)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {}
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const handleCopySingleLine = async (lineText: string, index: number) => {
    try {
      await navigator.clipboard.writeText(lineText)
      setCopiedLineIdx(index)
      setTimeout(() => setCopiedLineIdx(null), 1500)
    } catch {}
  }

  const handleApplyToWorksheet = () => {
    if (onApply) {
      onApply(generatedText)
    }
    onClose()
  }

  const handleAddDevice = () => {
    const currentDevices = formData.devices && formData.devices.length > 0
      ? formData.devices
      : [
          { serialNo: formData.serialNo, symptom: formData.symptom, resolution: formData.resolution },
          { serialNo: '', symptom: '' }
        ]
    const updated = [...currentDevices, { serialNo: '', symptom: '' }]
    setFormData({ ...formData, devices: updated })
  }

  const handleRemoveDevice = (indexToRemove: number) => {
    if (!formData.devices) return
    const updated = formData.devices.filter((_, idx) => idx !== indexToRemove)
    setFormData({ ...formData, devices: updated })
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs transition-opacity animate-in fade-in duration-200"
        onClick={onClose}
      />

      {/* Modal Dialog */}
      <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 w-full max-w-5xl z-10 overflow-hidden max-h-[92vh] flex flex-col animate-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="p-4 sm:p-6 bg-slate-900 text-white border-b border-slate-800 flex items-center justify-between gap-4 shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-brand-primary/20 text-blue-400 border border-brand-primary-border">
              <Sparkles size={20} />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-bold text-white leading-snug">เครื่องมือสร้างประโยคสรุปงานซ่อม (Generator Modal)</h3>
              <p className="text-xs text-slate-300">เลือกรูปแบบเฉพาะ พิมพ์ข้อความอิสระ หรือคัดลอกเฉพาะบางบรรทัดลงใบงานได้ทันที</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl transition-colors shrink-0 cursor-pointer"
          >
            <X size={20} />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-4 sm:p-6 overflow-y-auto flex-1 custom-scrollbar space-y-6">
          
          {/* Template Selection */}
          <div className="space-y-3">
            <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              1. เลือกรูปแบบประโยค (Template)
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
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
                        ? 'bg-brand-primary-light border-brand-primary text-blue-900 shadow-xs font-bold ring-2 ring-brand-primary/20' 
                        : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                      }
                    `}
                  >
                    <span className={`text-[10px] px-2 py-0.5 rounded-md font-bold w-fit ${isActive ? 'bg-brand-primary text-white' : 'bg-slate-100 text-slate-500'}`}>
                      {tmpl.badge}
                    </span>
                    <div className="text-xs font-bold truncate">{tmpl.name}</div>
                  </button>
                )
              })}
            </div>
          </div>

          {/* Form Fields & Output Split */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            
            {/* Left: Tailored Input Form Controls (7 cols) */}
            <div className="lg:col-span-7 space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                <span className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                  {activeTemplate === 'custom' ? (
                    <>
                      <FileEdit className="text-amber-500" size={16} /> 2. พิมพ์ข้อความอิสระ (Custom Editor)
                    </>
                  ) : (
                    <>
                      <Wrench className="text-brand-primary" size={16} /> 2. กรอกรายละเอียดเฉพาะรูปแบบ
                    </>
                  )}
                </span>
                {activeTemplate === 'multi_device' && (
                  <button
                    type="button"
                    onClick={handleAddDevice}
                    className="text-xs font-bold text-brand-primary hover:text-blue-800 bg-brand-primary-light hover:bg-brand-primary-light px-2.5 py-1 rounded-xl transition-colors cursor-pointer flex items-center gap-1"
                  >
                    <Plus size={13} /> เพิ่มเครื่องหลายรายการ
                  </button>
                )}
              </div>

              {/* CUSTOM BLANK EDITOR */}
              {activeTemplate === 'custom' ? (
                <div className="space-y-3">
                  <div className="bg-amber-50/70 border border-amber-200/80 p-3 rounded-xl text-[11px] text-amber-900 font-medium">
                    ✏️ **หน้าเปล่าอิสระ**: พิมพ์รายละเอียดขั้นตอนการซ่อมได้อิสระตามต้องการ
                  </div>

                  <TextareaField
                    label="ข้อความการซ่อม (พิมพ์อิสระ)"
                    rows={10}
                    value={formData.customNotes || ''}
                    onChange={(e) => setFormData({ ...formData, customNotes: e.target.value })}
                    placeholder="พิมพ์ข้อความอธิบายขั้นตอนซ่อม..."
                  />
                </div>
              ) : (
                /* TAILORED FORM FIELDS */
                <div className="space-y-4">
                  {/* Common Header */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <SelectField
                      label="ประเภทสินค้า"
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
                      <div className="flex items-center justify-between mb-1.5">
                        <label className="block text-xs font-bold text-slate-700">
                          รุ่น - {formData.brand}
                        </label>
                        <button
                          type="button"
                          onClick={() => setIsCustomModel(!isCustomModel)}
                          className="text-[11px] text-brand-primary font-bold hover:underline cursor-pointer"
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

                    {activeTemplate !== 'multi_device' && (
                      <InputField
                        label="หมายเลขซีเรียล (S/N)"
                        value={formData.serialNo}
                        onChange={(e) => setFormData({ ...formData, serialNo: e.target.value })}
                        placeholder="เช่น HT800023280476"
                      />
                    )}
                  </div>

                  {/* Multi Device List */}
                  {activeTemplate === 'multi_device' && (
                    <div className="p-3 bg-slate-50 border border-slate-200 rounded-2xl space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-slate-800 flex items-center gap-1">
                          <Layers size={15} className="text-brand-primary" />
                          รายการอุปกรณ์หลายเครื่อง ({formData.devices?.length || 1} เครื่อง)
                        </span>
                        <button
                          type="button"
                          onClick={handleAddDevice}
                          className="text-[11px] font-bold text-brand-primary hover:text-blue-800 bg-brand-primary-light px-2 py-0.5 rounded-lg cursor-pointer flex items-center gap-1"
                        >
                          <Plus size={12} /> เพิ่มเครื่อง
                        </button>
                      </div>

                      {formData.devices && formData.devices.map((dev, idx) => (
                        <div key={idx} className="p-3 bg-white border border-slate-200 rounded-xl space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="text-[11px] font-bold text-brand-primary-hover bg-brand-primary-light px-2 py-0.5 rounded-md">
                              เครื่องที่ {idx + 1}
                            </span>
                            {formData.devices!.length > 1 && (
                              <button
                                type="button"
                                onClick={() => handleRemoveDevice(idx)}
                                className="text-[11px] text-red-600 font-bold hover:underline cursor-pointer flex items-center gap-0.5"
                              >
                                <Trash2 size={12} /> ลบ
                              </button>
                            )}
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                            <InputField
                              label={`S/N เครื่องที่ ${idx + 1}`}
                              value={dev.serialNo}
                              onChange={(e) => {
                                const updated = [...formData.devices!]
                                updated[idx] = { ...updated[idx], serialNo: e.target.value }
                                setFormData({ ...formData, devices: updated })
                              }}
                              placeholder="S/N..."
                            />
                            <InputField
                              label="อาการเสีย"
                              value={dev.symptom || ''}
                              onChange={(e) => {
                                const updated = [...formData.devices!]
                                updated[idx] = { ...updated[idx], symptom: e.target.value }
                                setFormData({ ...formData, devices: updated })
                              }}
                              placeholder="อาการเสีย..."
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Printhead Template */}
                  {activeTemplate === 'printhead' && (
                    <div className="pt-2 border-t border-slate-100 space-y-3">
                      <InputField
                        label="อาการเสียที่พบ"
                        value={formData.symptom}
                        onChange={(e) => setFormData({ ...formData, symptom: e.target.value })}
                        placeholder="อาการเสีย..."
                      />
                      <TextareaField
                        label="ขั้นตอนการแก้ไข"
                        rows={2}
                        value={formData.resolution}
                        onChange={(e) => setFormData({ ...formData, resolution: e.target.value })}
                        placeholder="รายละเอียด..."
                      />
                      <div>
                        <div className="flex items-center justify-between mb-1">
                          <label className="block text-xs font-bold text-slate-700">ระยะหัวพิมพ์ (M.)</label>
                          <label className="flex items-center gap-1 text-xs text-slate-600 font-semibold cursor-pointer select-none">
                            <input
                              type="checkbox"
                              checked={!!formData.isMileageUnknown}
                              onChange={(e) => setFormData({ ...formData, isMileageUnknown: e.target.checked })}
                              className="w-3.5 h-3.5 rounded text-brand-primary cursor-pointer"
                            />
                            <span>ไม่สามารถดูระยะหัวพิมพ์ได้</span>
                          </label>
                        </div>
                        <InputField
                          label=""
                          disabled={formData.isMileageUnknown}
                          value={formData.isMileageUnknown ? 'ไม่สามารถดูระยะได้' : (formData.mileage || '')}
                          onChange={(e) => setFormData({ ...formData, mileage: e.target.value })}
                          placeholder="เช่น 119,166"
                        />
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <InputField
                          label="S/N หัวพิมพ์เก่า"
                          value={formData.oldSerial || ''}
                          onChange={(e) => setFormData({ ...formData, oldSerial: e.target.value })}
                          placeholder="S/N หัวพิมพ์เก่า..."
                        />
                        <InputField
                          label="S/N หัวพิมพ์ใหม่"
                          value={formData.newSerial || ''}
                          onChange={(e) => setFormData({ ...formData, newSerial: e.target.value })}
                          placeholder="S/N หัวพิมพ์ใหม่..."
                        />
                      </div>
                    </div>
                  )}

                  {/* Part Replacement Template */}
                  {activeTemplate === 'part_replacement' && (
                    <div className="pt-2 border-t border-slate-100 space-y-3">
                      <InputField
                        label="อาการเสียที่พบ"
                        value={formData.symptom}
                        onChange={(e) => setFormData({ ...formData, symptom: e.target.value })}
                        placeholder="อาการเสีย..."
                      />
                      <InputField
                        label="ชื่ออะไหล่ที่เปลี่ยน"
                        value={formData.replacedPartName || ''}
                        onChange={(e) => setFormData({ ...formData, replacedPartName: e.target.value })}
                        placeholder="ชื่ออะไหล่..."
                      />
                      <TextareaField
                        label="ขั้นตอนการแก้ไข"
                        rows={2}
                        value={formData.resolution}
                        onChange={(e) => setFormData({ ...formData, resolution: e.target.value })}
                        placeholder="รายละเอียด..."
                      />
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <InputField
                          label="S/N อะไหล่เก่า"
                          value={formData.oldSerial || ''}
                          onChange={(e) => setFormData({ ...formData, oldSerial: e.target.value })}
                          placeholder="S/N อะไหล่เก่า..."
                        />
                        <InputField
                          label="S/N อะไหล่ใหม่"
                          value={formData.newSerial || ''}
                          onChange={(e) => setFormData({ ...formData, newSerial: e.target.value })}
                          placeholder="S/N อะไหล่ใหม่..."
                        />
                      </div>
                    </div>
                  )}

                  {/* Maintenance Template */}
                  {activeTemplate === 'maintenance' && (
                    <div className="pt-2 border-t border-slate-100 space-y-3">
                      <TextareaField
                        label="การบำรุงรักษา (PM)"
                        rows={3}
                        value={formData.resolution}
                        onChange={(e) => setFormData({ ...formData, resolution: e.target.value })}
                        placeholder="การดำเนินการ..."
                      />
                      <InputField
                        label="ผลการทดสอบ"
                        value={formData.testResult || ''}
                        onChange={(e) => setFormData({ ...formData, testResult: e.target.value })}
                        placeholder="ผลการทดสอบ..."
                      />
                    </div>
                  )}

                  {/* Firmware Template */}
                  {activeTemplate === 'firmware' && (
                    <div className="pt-2 border-t border-slate-100 space-y-3">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <InputField
                          label="Firmware เดิม"
                          value={formData.firmwareOld || ''}
                          onChange={(e) => setFormData({ ...formData, firmwareOld: e.target.value })}
                          placeholder="V1.02"
                        />
                        <InputField
                          label="Firmware ใหม่"
                          value={formData.firmwareNew || ''}
                          onChange={(e) => setFormData({ ...formData, firmwareNew: e.target.value })}
                          placeholder="V2.05"
                        />
                      </div>
                      <TextareaField
                        label="ขั้นตอนดำเนินการ"
                        rows={2}
                        value={formData.resolution}
                        onChange={(e) => setFormData({ ...formData, resolution: e.target.value })}
                        placeholder="ขั้นตอน..."
                      />
                    </div>
                  )}

                  {/* Contact Info */}
                  <div className="pt-2 border-t border-slate-100 space-y-2">
                    <div className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1">
                      <UserCheck size={14} className="text-brand-primary" /> ข้อมูลผู้ติดต่อ (ถ้ามี)
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                      <InputField
                        label="ชื่อผู้ติดต่อ"
                        value={formData.contactName || ''}
                        onChange={(e) => setFormData({ ...formData, contactName: e.target.value })}
                        placeholder="ชื่อผู้ติดต่อ..."
                      />
                      <InputField
                        label="ตำแหน่ง"
                        value={formData.contactPosition || ''}
                        onChange={(e) => setFormData({ ...formData, contactPosition: e.target.value })}
                        placeholder="ตำแหน่ง..."
                      />
                      <InputField
                        label="เบอร์โทร"
                        value={formData.contactPhone || ''}
                        onChange={(e) => setFormData({ ...formData, contactPhone: e.target.value })}
                        placeholder="เบอร์โทร..."
                      />
                    </div>
                  </div>

                </div>
              )}

            </div>

            {/* Right: Output Textarea, Partial Copy & Action Buttons (5 cols) */}
            <div className="lg:col-span-5 space-y-4 flex flex-col justify-between">
              <div className="space-y-3 flex-1 flex flex-col">
                <div className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center justify-between">
                  <span>3. ข้อความสรุปที่ได้</span>
                  <span className="text-[10px] text-brand-primary font-bold bg-brand-primary-light px-2 py-0.5 rounded-md">Live Output</span>
                </div>

                <textarea
                  readOnly={activeTemplate !== 'custom'}
                  rows={11}
                  value={generatedText}
                  onChange={(e) => {
                    if (activeTemplate === 'custom') {
                      setFormData({ ...formData, customNotes: e.target.value })
                    }
                  }}
                  className="w-full flex-1 bg-slate-900 text-slate-100 p-4 rounded-2xl font-mono text-xs leading-relaxed outline-none shadow-inner resize-none border border-slate-800 select-text cursor-text focus:ring-2 focus:ring-blue-500/20"
                />
              </div>

              {/* Action Buttons */}
              <div className="space-y-2 pt-2 border-t border-slate-100">
                {onApply && (
                  <button
                    type="button"
                    onClick={handleApplyToWorksheet}
                    className="w-full py-3 px-4 bg-brand-primary hover:bg-brand-primary-hover text-white font-bold text-xs rounded-2xl shadow-lg shadow-brand-primary/30 flex items-center justify-center gap-2 cursor-pointer transition-all"
                  >
                    <CornerDownLeft size={16} />
                    นำประโยคนี้ไปใส่ในใบงาน (Apply to Worksheet)
                  </button>
                )}

                <button
                  type="button"
                  onClick={handleCopy}
                  className={`
                    w-full py-2.5 px-4 rounded-2xl font-bold text-xs flex items-center justify-center gap-2 cursor-pointer transition-all
                    ${copied 
                      ? 'bg-emerald-600 text-white' 
                      : 'bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-200'
                    }
                  `}
                >
                  {copied ? <Check size={16} /> : <Copy size={16} />}
                  {copied ? 'คัดลอกสำเร็จแล้ว!' : 'คัดลอกข้อความทั้งหมด'}
                </button>
              </div>

            </div>

          </div>

        </div>

      </div>
    </div>
  )
}
