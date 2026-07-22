"use client"

import { useState, useEffect, useMemo } from 'react'
import { 
  Sparkles, Copy, Check, Wand2, Wrench, History, Trash2 
} from 'lucide-react'
import { 
  SentenceData, TemplateId, TEMPLATES, PRODUCT_TYPES_LIST, 
  SYMPTOM_PRESETS, RESOLUTION_PRESETS, generateSentence, buildBrandModelsMap 
} from '@/app/lib/sentenceTemplates'
import { SelectField, InputField, TextareaField } from '@/app/components/ui'
import { ProductItem } from '@/app/types'

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
  const [history, setHistory] = useState<HistoryItem[]>([])
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

  // Load history from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem('generator_history')
      if (saved) {
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

  const handleCopy = async () => {
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
    } catch {
      // fallback
    }
  }

  const clearHistory = () => {
    setHistory([])
    try {
      localStorage.removeItem('generator_history')
    } catch {}
  }

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-12">

      {/* Header Banner */}
      <div className="bg-slate-900 rounded-3xl p-6 md:p-8 text-white shadow-xl flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <div className="flex items-center gap-2 text-blue-400 font-bold text-xs uppercase tracking-wider mb-1">
            <Sparkles size={16} /> Sentence Generator Tool
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight">ระบบสร้างประโยคสรุปการทำงานซ่อม</h1>
          <p className="text-sm text-slate-300 mt-1">
            เครื่องมือช่วยช่างสร้างข้อความอธิบายขั้นตอนการซ่อม เปลี่ยนหัวพิมพ์ เปลี่ยนอะไหล่ หรือ PM แบบมืออาชีพ
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

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
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
                    ? 'bg-blue-50 border-blue-600 text-blue-900 shadow-md ring-2 ring-blue-600/20 font-bold' 
                    : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300 hover:bg-slate-50'
                  }
                `}
              >
                <span className={`text-xs px-2.5 py-1 rounded-lg font-bold w-fit ${isActive ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-500'}`}>
                  {tmpl.badge}
                </span>
                <div>
                  <div className="text-sm font-bold leading-snug">{tmpl.name}</div>
                  <div className="text-[11px] font-normal text-slate-500 mt-1 line-clamp-2">{tmpl.description}</div>
                </div>
              </button>
            )
          })}
        </div>
      </div>

      {/* Main Generator Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column: Form Controls (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          <div className="bg-white rounded-3xl p-6 md:p-8 border border-slate-200 shadow-sm space-y-6">
            <div className="flex items-center gap-2 text-slate-900 font-extrabold text-base border-b border-slate-100 pb-3">
              <Wrench className="text-blue-600" size={20} /> 2. กรอกรายละเอียดอุปกรณ์และการแก้ไข
            </div>

            {/* Device Type & Brand - Dynamic Database Products */}
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

            {/* Model & Serial */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-sm font-medium text-slate-700">
                    รุ่น (Model) - {formData.brand}
                  </label>
                  <button
                    type="button"
                    onClick={() => setIsCustomModel(!isCustomModel)}
                    className="text-xs text-blue-600 font-bold hover:underline cursor-pointer"
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
                placeholder="เช่น หัวพิมพ์ขาด, พิมพ์ไม่ออก..."
              />
              <div className="flex gap-1.5 flex-wrap mt-2">
                {SYMPTOM_PRESETS.map((sym) => (
                  <button
                    key={sym}
                    type="button"
                    onClick={() => setFormData({ ...formData, symptom: sym })}
                    className="text-xs bg-amber-50 text-amber-800 border border-amber-200/80 hover:bg-amber-100 px-2.5 py-1 rounded-xl font-medium cursor-pointer transition-colors"
                  >
                    +{sym}
                  </button>
                ))}
              </div>
            </div>

            {/* Resolution */}
            <div>
              <TextareaField
                label="การแก้ไข / การดำเนินการ"
                rows={3}
                value={formData.resolution}
                onChange={(e) => setFormData({ ...formData, resolution: e.target.value })}
                placeholder="รายละเอียดขั้นตอนการแก้ไข..."
              />
              <div className="flex gap-1.5 flex-wrap mt-2">
                {RESOLUTION_PRESETS.map((res, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => setFormData({ ...formData, resolution: res })}
                    className="text-xs bg-emerald-50 text-emerald-800 border border-emerald-200/80 hover:bg-emerald-100 px-2.5 py-1 rounded-xl font-medium cursor-pointer transition-colors text-left truncate max-w-full"
                  >
                    +{res.slice(0, 35)}...
                  </button>
                ))}
              </div>
            </div>

            {/* Template Dynamic Extra Fields */}
            {activeTemplate === 'printhead' && (
              <div className="pt-4 border-t border-slate-100 space-y-4">
                <InputField
                  label="ระยะหัวพิมพ์ (M.)"
                  value={formData.mileage || ''}
                  onChange={(e) => setFormData({ ...formData, mileage: e.target.value })}
                  placeholder="เช่น 119,166"
                />

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
            )}

            {activeTemplate === 'part_replacement' && (
              <div className="pt-4 border-t border-slate-100 space-y-4">
                <InputField
                  label="ชื่ออะไหล่ที่เปลี่ยน"
                  value={formData.replacedPartName || ''}
                  onChange={(e) => setFormData({ ...formData, replacedPartName: e.target.value })}
                  placeholder="เช่น Mainboard, Roller, Platen Belt"
                />
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <InputField
                    label="S/N อะไหล่เก่า (ถ้ามี)"
                    value={formData.oldSerial || ''}
                    onChange={(e) => setFormData({ ...formData, oldSerial: e.target.value })}
                    placeholder="S/N อะไหล่เดิม"
                  />
                  <InputField
                    label="S/N อะไหล่ใหม่ (ถ้ามี)"
                    value={formData.newSerial || ''}
                    onChange={(e) => setFormData({ ...formData, newSerial: e.target.value })}
                    placeholder="S/N อะไหล่ใหม่"
                  />
                </div>
              </div>
            )}

            {activeTemplate === 'firmware' && (
              <div className="pt-4 border-t border-slate-100 space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <InputField
                    label="เวอร์ชัน Firmware เดิม"
                    value={formData.firmwareOld || ''}
                    onChange={(e) => setFormData({ ...formData, firmwareOld: e.target.value })}
                    placeholder="เช่น v1.0.2"
                  />
                  <InputField
                    label="เวอร์ชัน Firmware ใหม่"
                    value={formData.firmwareNew || ''}
                    onChange={(e) => setFormData({ ...formData, firmwareNew: e.target.value })}
                    placeholder="เช่น v1.2.0"
                  />
                </div>
              </div>
            )}

          </div>
        </div>

        {/* Right Column: Live Output & Recent Copy History (5 cols) */}
        <div className="lg:col-span-5 space-y-6 flex flex-col">
          
          {/* Output Card */}
          <div className="bg-slate-900 rounded-3xl p-6 text-white shadow-xl border border-slate-800 flex flex-col min-h-[380px]">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-4">
              <div className="flex items-center gap-2 text-xs font-bold text-blue-400">
                <Wand2 size={16} /> ตัวอย่างข้อความที่จะได้ (Generated Output)
              </div>
              <button
                type="button"
                onClick={handleCopy}
                className={`
                  flex items-center gap-1.5 text-xs px-4 py-2 rounded-xl font-bold transition-all cursor-pointer
                  ${copied 
                    ? 'bg-emerald-500 text-white' 
                    : 'bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-600/30'
                  }
                `}
              >
                {copied ? <Check size={16} /> : <Copy size={16} />}
                {copied ? 'คัดลอกแล้ว!' : 'คัดลอกข้อความ'}
              </button>
            </div>

            <div className="flex-1 bg-slate-950/90 p-5 rounded-2xl font-mono text-xs text-slate-200 whitespace-pre-wrap leading-relaxed border border-slate-800 select-all shadow-inner">
              {generatedText}
            </div>

            <p className="text-[11px] text-slate-400 mt-3 text-center">
              💡 ข้อความด้านบนจะถูกอัปเดตแบบ Real-time ตามที่คุณกรอกในฟอร์ม
            </p>
          </div>

          {/* Recent Copy History */}
          {history.length > 0 && (
            <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                  <History size={15} className="text-blue-600" /> ประวัติการสร้างข้อความล่าสุด
                </div>
                <button
                  type="button"
                  onClick={clearHistory}
                  className="text-xs text-slate-400 hover:text-red-600 font-semibold flex items-center gap-1 cursor-pointer"
                >
                  <Trash2 size={13} /> ล้างประวัติ
                </button>
              </div>

              <div className="space-y-3 max-h-64 overflow-y-auto pr-1">
                {history.map((h) => (
                  <div key={h.id} className="bg-slate-50 p-3 rounded-2xl border border-slate-200/60 space-y-1.5 text-xs">
                    <div className="flex justify-between items-center text-[11px] text-slate-400">
                      <span className="font-bold text-blue-600">{h.templateName}</span>
                      <span>{h.createdAt}</span>
                    </div>
                    <p className="font-mono text-slate-700 whitespace-pre-wrap text-[11px] line-clamp-3 bg-white p-2 rounded-xl border border-slate-200/50">
                      {h.text}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>

      </div>

    </div>
  )
}
