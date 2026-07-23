"use client"

import { useState, useEffect, useMemo } from 'react'
import { 
  Sparkles, Copy, Check, Wand2, Wrench, History, Trash2, Plus, Layers, UserCheck, FileEdit
} from 'lucide-react'
import { 
  SentenceData, TemplateId, TEMPLATES, PRODUCT_TYPES_LIST, 
  SYMPTOM_PRESETS, generateSentence, buildBrandModelsMap 
} from '@/app/lib/sentenceTemplates'
import { SelectField, InputField, TextareaField } from '@/app/components/ui'
import { ProductItem } from '@/app/types'
import { appConfig } from '@/app/config/app.config'

interface HistoryItem {
  id: string
  templateName: string
  text: string
  createdAt: string
}

interface ServiceGeneratorClientProps {
  products?: ProductItem[]
}

export default function ServiceGeneratorClient({ products = [] }: ServiceGeneratorClientProps) {
  const [activeTemplate, setActiveTemplate] = useState<TemplateId>('printhead')
  const [copied, setCopied] = useState(false)
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [copiedLineIdx, setCopiedLineIdx] = useState<number | null>(null)
  const [history, setHistory] = useState<HistoryItem[]>([])
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
    replacedPartName: 'ชุดหัวพิมพ์ใหม่',
    testResult: 'เครื่องสามารถใช้งานได้ปกติ พิมพ์เทสผ่านเกณฑ์',
    firmwareOld: 'V1.02',
    firmwareNew: 'V2.05',
    customNotes: 'ดำเนินการเข้าตรวจสอบเครื่อง Barcode Printer HPRT HT800...',
    devices: [
      { serialNo: 'HT800023280476', symptom: 'ไฟเข้าบ้าง ไม่เข้าบ้าง' },
      { serialNo: 'HT800023280473', symptom: 'ปรินกระโดดในบางครั้ง' }
    ],
    contactName: 'ยศวัจน์ สมบูรณ์',
    contactPosition: 'เจ้าหน้าที่คลัง',
    contactPhone: '0949191626'
  })

  // Load history from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem('generator_history')
      if (saved) {
        // eslint-disable-next-line
        setHistory(JSON.parse(saved))
      }
    } catch {
      // ignore error
    }
  }, [])

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

  // Split lines into non-empty sections for partial copy
  // const generatedLines = useMemo(() => {
  //   return generatedText.split('\n').filter(line => line.trim().length > 0)
  // }, [generatedText])

  const handleCopyAll = async () => {
    try {
      await navigator.clipboard.writeText(generatedText)
      setCopied(true)

      // Save to history
      const newItem: HistoryItem = {
        id: Date.now().toString(),
        templateName: TEMPLATES.find(t => t.id === activeTemplate)?.name || activeTemplate,
        text: generatedText,
        createdAt: new Date().toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit' })
      }
      
      setHistory(prev => {
        const updated = [newItem, ...prev.slice(0, 19)]
        try {
          localStorage.setItem('generator_history', JSON.stringify(updated))
        } catch {}
        return updated
      })

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

  const clearHistory = () => {
    setHistory([])
    try {
      localStorage.removeItem('generator_history')
    } catch {}
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
    <div className="space-y-8 max-w-7xl mx-auto pb-12">

      {/* Header Banner */}
      <div className="bg-slate-900 rounded-3xl p-6 md:p-8 text-white shadow-xl flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <div className="flex items-center gap-2 text-brand-primary-light font-bold text-xs uppercase tracking-wider mb-1">
            <Sparkles size={16} /> Sentence Generator Tool
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight">{appConfig.ui.generator.title}</h1>
          <p className="text-sm text-slate-300 mt-1">
            {appConfig.ui.generator.description}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="bg-slate-800/90 border border-slate-700 px-4 py-2.5 rounded-2xl text-right">
            <div className="text-[11px] text-slate-400 font-medium">รูปแบบที่มีให้เลือก</div>
            <div className="text-lg font-black text-white">{TEMPLATES.length} หมวดหมู่</div>
          </div>
        </div>
      </div>

      {/* Template Selection Cards */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
        <div className="text-xs font-bold text-slate-400 uppercase tracking-wider border-b border-slate-100 pb-2">
          1. เลือกรูปแบบประโยครายงาน (Template)
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-3">
          {TEMPLATES.map((tmpl) => {
            const isActive = activeTemplate === tmpl.id
            return (
              <button
                key={tmpl.id}
                type="button"
                onClick={() => setActiveTemplate(tmpl.id)}
                className={`
                  p-4 rounded-2xl text-left border transition-all flex flex-col justify-between gap-3 cursor-pointer
                  ${isActive 
                    ? 'bg-brand-primary-light border-brand-primary text-blue-900 shadow-md ring-2 ring-brand-primary/20 font-bold' 
                    : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300 hover:bg-slate-50'
                  }
                `}
              >
                <span className={`text-[11px] px-2.5 py-1 rounded-lg font-bold w-fit ${isActive ? 'bg-brand-primary text-white' : 'bg-slate-100 text-slate-500'}`}>
                  {tmpl.badge}
                </span>
                <div>
                  <div className="text-xs sm:text-sm font-bold leading-snug">{tmpl.name}</div>
                  <div className="text-[11px] font-normal text-slate-500 mt-1 line-clamp-2">{tmpl.description}</div>
                </div>
              </button>
            )
          })}
        </div>
      </div>

      {/* Main Generator Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column: Tailored Form Controls per Template (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          <div className="bg-white rounded-3xl p-6 md:p-8 border border-slate-200 shadow-sm space-y-6">
            
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2 text-slate-900 font-extrabold text-base">
                {activeTemplate === 'custom' ? (
                  <>
                    <FileEdit className="text-amber-500" size={20} /> 2. หน้าเปล่าสำหรับพิมพ์และจัดรูปแบบข้อความอิสระ
                  </>
                ) : (
                  <>
                    <Wrench className="text-brand-primary" size={20} /> 2. กรอกรายละเอียดเฉพาะรูปแบบ ({TEMPLATES.find(t => t.id === activeTemplate)?.name})
                  </>
                )}
              </div>

              {activeTemplate === 'multi_device' && (
                <button
                  type="button"
                  onClick={handleAddDevice}
                  className="text-xs font-bold text-brand-primary hover:text-blue-800 bg-brand-primary-light hover:bg-brand-primary-light px-3 py-1.5 rounded-xl transition-colors cursor-pointer flex items-center gap-1.5"
                >
                  <Plus size={14} /> เพิ่มอุปกรณ์
                </button>
              )}
            </div>

            {/* CASE: CUSTOM BLANK TEXT EDITOR */}
            {activeTemplate === 'custom' ? (
              <div className="space-y-4">
                <TextareaField
                  label="ข้อความอธิบายการซ่อม (พิมพ์หรือแก้ไขอิสระ)"
                  rows={12}
                  value={formData.customNotes || ''}
                  onChange={(e) => setFormData({ ...formData, customNotes: e.target.value })}
                  placeholder="พิมพ์ข้อความรายละเอียดขั้นตอนการซ่อมตามต้องการ..."
                />
              </div>
            ) : (
              /* CASE: TAILORED FORM FIELDS PER TEMPLATE */
              <div className="space-y-6">

                {/* Common Header: Device Type & Brand & Model */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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

                {/* Model & Main Serial */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <label className="block text-xs font-bold text-slate-700">
                        รุ่น (Model) - {formData.brand}
                      </label>
                      <button
                        type="button"
                        onClick={() => setIsCustomModel(!isCustomModel)}
                        className="text-xs text-brand-primary font-bold hover:underline cursor-pointer"
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

                {/* TEMPLATE 1: MULTI_DEVICE */}
                {activeTemplate === 'multi_device' && (
                  <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-4">
                    <div className="flex items-center justify-between border-b border-slate-200/80 pb-2">
                      <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                        <Layers size={16} className="text-brand-primary" />
                        รายการอุปกรณ์หลายเครื่อง ({formData.devices?.length || 1} เครื่อง)
                      </span>
                      <button
                        type="button"
                        onClick={handleAddDevice}
                        className="text-xs font-bold text-brand-primary hover:text-blue-800 bg-brand-primary-light/80 px-2.5 py-1 rounded-lg transition-colors cursor-pointer flex items-center gap-1"
                      >
                        <Plus size={13} /> เพิ่มเครื่องที่ {(formData.devices?.length || 0) + 1}
                      </button>
                    </div>

                    {formData.devices && formData.devices.map((dev, idx) => (
                      <div key={idx} className="p-3 bg-white border border-slate-200 rounded-xl space-y-3 shadow-2xs">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-brand-primary-hover bg-brand-primary-light px-2 py-0.5 rounded-md border border-blue-100">
                            เครื่องที่ {idx + 1}
                          </span>
                          {formData.devices!.length > 1 && (
                            <button
                              type="button"
                              onClick={() => handleRemoveDevice(idx)}
                              className="text-xs text-red-600 hover:text-red-800 font-bold cursor-pointer flex items-center gap-1"
                            >
                              <Trash2 size={13} /> ลบเครื่องนี้
                            </button>
                          )}
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <InputField
                            label={`S/N เครื่องที่ ${idx + 1}`}
                            value={dev.serialNo}
                            onChange={(e) => {
                              const updated = [...formData.devices!]
                              updated[idx] = { ...updated[idx], serialNo: e.target.value }
                              setFormData({ ...formData, devices: updated })
                            }}
                            placeholder="เช่น HT800023280476"
                          />

                          <InputField
                            label="อาการเสียประจำเครื่อง"
                            value={dev.symptom || ''}
                            onChange={(e) => {
                              const updated = [...formData.devices!]
                              updated[idx] = { ...updated[idx], symptom: e.target.value }
                              setFormData({ ...formData, devices: updated })
                            }}
                            placeholder="เช่น ไฟเข้าบ้าง ไม่เข้าบ้าง..."
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* TEMPLATE 2: PRINTHEAD */}
                {activeTemplate === 'printhead' && (
                  <div className="space-y-4">
                    <div>
                      <InputField
                        label="อาการเสียที่พบ"
                        value={formData.symptom}
                        onChange={(e) => setFormData({ ...formData, symptom: e.target.value })}
                        placeholder="เช่น หัวพิมพ์ขาด, พิมพ์ไม่ออก..."
                      />
                      <div className="flex gap-1.5 flex-wrap mt-2">
                        {SYMPTOM_PRESETS.slice(0, 4).map((sym) => (
                          <button
                            key={sym}
                            type="button"
                            onClick={() => setFormData({ ...formData, symptom: sym })}
                            className="text-xs bg-amber-50 text-amber-800 border border-amber-200/80 hover:bg-amber-100 px-2 py-0.5 rounded-lg font-medium cursor-pointer"
                          >
                            +{sym}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <TextareaField
                        label="ขั้นตอนการแก้ไข"
                        rows={2}
                        value={formData.resolution}
                        onChange={(e) => setFormData({ ...formData, resolution: e.target.value })}
                        placeholder="เช่น เปลี่ยนหัวพิมพ์ใหม่ และคาลิเบรท..."
                      />
                    </div>

                    <div className="pt-3 border-t border-slate-100 space-y-4">
                      <div>
                        <div className="flex items-center justify-between mb-1.5">
                          <label className="block text-xs font-bold text-slate-700">ระยะหัวพิมพ์ (M.)</label>
                          <label className="flex items-center gap-1.5 text-xs text-slate-600 font-semibold cursor-pointer select-none">
                            <input
                              type="checkbox"
                              checked={!!formData.isMileageUnknown}
                              onChange={(e) => setFormData({ ...formData, isMileageUnknown: e.target.checked })}
                              className="w-4 h-4 rounded text-brand-primary focus:ring-blue-500 cursor-pointer"
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

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <InputField
                          label="S/N หัวพิมพ์เก่า"
                          value={formData.oldSerial || ''}
                          onChange={(e) => setFormData({ ...formData, oldSerial: e.target.value })}
                          placeholder="เช่น T7FV00324200007"
                        />
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

                {/* TEMPLATE 3: PART REPLACEMENT */}
                {activeTemplate === 'part_replacement' && (
                  <div className="space-y-4">
                    <InputField
                      label="อาการเสียที่พบ"
                      value={formData.symptom}
                      onChange={(e) => setFormData({ ...formData, symptom: e.target.value })}
                      placeholder="เช่น Roller ชำรุด, บอร์ดไม่ทำงาน..."
                    />

                    <InputField
                      label="ชื่ออะไหล่ที่เปลี่ยน"
                      value={formData.replacedPartName || ''}
                      onChange={(e) => setFormData({ ...formData, replacedPartName: e.target.value })}
                      placeholder="เช่น Mainboard, Roller, Platen Belt"
                    />

                    <TextareaField
                      label="ขั้นตอนการแก้ไข"
                      rows={2}
                      value={formData.resolution}
                      onChange={(e) => setFormData({ ...formData, resolution: e.target.value })}
                      placeholder="เช่น ดำเนินการเปลี่ยนชุด Mainboard อะไหล่ใหม่..."
                    />

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <InputField
                        label="S/N อะไหล่เก่า (ถ้ามี)"
                        value={formData.oldSerial || ''}
                        onChange={(e) => setFormData({ ...formData, oldSerial: e.target.value })}
                        placeholder="S/N อะไหล่เก่า..."
                      />
                      <InputField
                        label="S/N อะไหล่ใหม่ (ถ้ามี)"
                        value={formData.newSerial || ''}
                        onChange={(e) => setFormData({ ...formData, newSerial: e.target.value })}
                        placeholder="S/N อะไหล่ใหม่..."
                      />
                    </div>

                    <InputField
                      label="ผลการทดสอบหลังเปลี่ยนอะไหล่"
                      value={formData.testResult || ''}
                      onChange={(e) => setFormData({ ...formData, testResult: e.target.value })}
                      placeholder="เช่น ทดสอบใช้งานจริงผ่านเกณฑ์มาตรฐาน"
                    />
                  </div>
                )}

                {/* TEMPLATE 4: MAINTENANCE (PM) */}
                {activeTemplate === 'maintenance' && (
                  <div className="space-y-4">
                    <TextareaField
                      label="รายละเอียดการบำรุงรักษา (PM Action)"
                      rows={3}
                      value={formData.resolution}
                      onChange={(e) => setFormData({ ...formData, resolution: e.target.value })}
                      placeholder="เช่น ทำความสะอาดหัวพิมพ์, ลูกกลิ้ง Roller และคาลิเบรท..."
                    />

                    <InputField
                      label="ผลการทดสอบการทำงาน"
                      value={formData.testResult || ''}
                      onChange={(e) => setFormData({ ...formData, testResult: e.target.value })}
                      placeholder="เช่น ทดสอบพิมพ์งานต่อเนื่อง สามารถใช้งานได้ปกติ"
                    />

                    <TextareaField
                      label="หมายเหตุเพิ่มเติม"
                      rows={2}
                      value={formData.customNotes || ''}
                      onChange={(e) => setFormData({ ...formData, customNotes: e.target.value })}
                      placeholder="ข้อเสนอแนะสำหรับการบำรุงรักษาครั้งต่อไป..."
                    />
                  </div>
                )}

                {/* TEMPLATE 5: FIRMWARE */}
                {activeTemplate === 'firmware' && (
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <InputField
                        label="เวอร์ชัน Firmware เดิม"
                        value={formData.firmwareOld || ''}
                        onChange={(e) => setFormData({ ...formData, firmwareOld: e.target.value })}
                        placeholder="เช่น V1.02"
                      />
                      <InputField
                        label="เวอร์ชัน Firmware ใหม่"
                        value={formData.firmwareNew || ''}
                        onChange={(e) => setFormData({ ...formData, firmwareNew: e.target.value })}
                        placeholder="เช่น V2.05"
                      />
                    </div>

                    <TextareaField
                      label="ขั้นตอนการดำเนินการ"
                      rows={2}
                      value={formData.resolution}
                      onChange={(e) => setFormData({ ...formData, resolution: e.target.value })}
                      placeholder="เช่น อัปเดตเฟิร์มแวร์ คาลิเบรตเซ็นเซอร์ และทดสอบส่งข้อมูล..."
                    />

                    <InputField
                      label="ผลการทดสอบ"
                      value={formData.testResult || ''}
                      onChange={(e) => setFormData({ ...formData, testResult: e.target.value })}
                      placeholder="เช่น ระบบส่งข้อมูลเร็วขึ้น เซ็นเซอร์ทำงานแม่นยำ"
                    />
                  </div>
                )}

                {/* Common Contact Info Section (For non-custom templates) */}
                <div className="pt-4 border-t border-slate-100 space-y-3">
                  <div className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                    <UserCheck size={16} className="text-brand-primary" /> ข้อมูลผู้ติดต่อ (Contact Info)
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <InputField
                      label="ชื่อผู้ติดต่อ"
                      value={formData.contactName || ''}
                      onChange={(e) => setFormData({ ...formData, contactName: e.target.value })}
                      placeholder="เช่น ยศวัจน์ สมบูรณ์"
                    />
                    <InputField
                      label="ตำแหน่ง"
                      value={formData.contactPosition || ''}
                      onChange={(e) => setFormData({ ...formData, contactPosition: e.target.value })}
                      placeholder="เช่น เจ้าหน้าที่คลัง"
                    />
                    <InputField
                      label="เบอร์โทรศัพท์"
                      value={formData.contactPhone || ''}
                      onChange={(e) => setFormData({ ...formData, contactPhone: e.target.value })}
                      placeholder="เช่น 0949191626"
                    />
                  </div>
                </div>

              </div>
            )}

          </div>
        </div>

        {/* Right Column: Output Preview & Section Copy (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white rounded-3xl p-6 md:p-8 border border-slate-200 shadow-sm space-y-6 sticky top-24">
            
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2 text-slate-900 font-extrabold text-base">
                <Wand2 className="text-brand-primary" size={20} /> 3. ข้อความสรุปที่ได้
              </div>
              <span className="text-xs bg-brand-primary-light text-brand-primary-hover border border-brand-primary-border px-2.5 py-1 rounded-xl font-bold">
                พร้อมใช้งาน
              </span>
            </div>

            {/* Generated Text Area Display (Selectable Text) */}
            <div className="relative space-y-1.5">
              <textarea
                readOnly={activeTemplate !== 'custom'}
                rows={13}
                value={generatedText}
                onChange={(e) => {
                  if (activeTemplate === 'custom') {
                    setFormData({ ...formData, customNotes: e.target.value })
                  }
                }}
                className="w-full bg-slate-900 text-slate-100 p-4 rounded-2xl font-mono text-xs leading-relaxed outline-none shadow-inner resize-none border border-slate-800 select-text cursor-text focus:ring-2 focus:ring-blue-500/20"
              />
            </div>

            {/* Main Copy All Button */}
            <button
              type="button"
              onClick={handleCopyAll}
              className={`
                w-full py-3.5 px-6 rounded-2xl font-bold text-sm tracking-wide transition-all duration-200 shadow-lg flex items-center justify-center gap-2.5 cursor-pointer
                ${copied 
                  ? 'bg-emerald-600 text-white shadow-emerald-600/30 scale-102' 
                  : 'bg-brand-primary hover:bg-brand-primary-hover text-white shadow-brand-primary/30 hover:scale-[1.01]'
                }
              `}
            >
              {copied ? (
                <>
                  <Check size={18} />
                  คัดลอกสำเร็จ!
                </>
              ) : (
                <>
                  <Copy size={18} />
                  คัดลอกทั้งหมด (Copy All)
                </>
              )}
            </button>

            {/* History Recent Usage Drawer */}
            {history.length > 0 && (
              <div className="pt-4 border-t border-slate-100 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                    <History size={14} /> ประวัติการสร้างล่าสุด
                  </div>
                  <button
                    type="button"
                    onClick={clearHistory}
                    className="text-[11px] text-red-500 hover:underline cursor-pointer flex items-center gap-1 font-semibold"
                  >
                    <Trash2 size={12} /> ล้างประวัติ
                  </button>
                </div>

                <div className="space-y-2 max-h-40 overflow-y-auto pr-1">
                  {history.slice(0, 5).map((item) => (
                    <div
                      key={item.id}
                      onClick={async () => {
                        await navigator.clipboard.writeText(item.text)
                        setCopied(true)
                        setTimeout(() => setCopied(false), 2000)
                      }}
                      className="p-2.5 bg-slate-50 hover:bg-slate-100 border border-slate-200/80 rounded-2xl text-xs space-y-1 cursor-pointer transition-colors group"
                    >
                      <div className="flex items-center justify-between text-[11px] font-bold text-slate-500">
                        <span>{item.templateName}</span>
                        <span className="text-[10px] text-slate-400">{item.createdAt}</span>
                      </div>
                      <div className="text-slate-800 font-mono text-[11px] line-clamp-2">{item.text}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}

          </div>
        </div>

      </div>

    </div>
  )
}
