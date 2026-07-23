"use client"

import { useState } from 'react'
import { Mail, User, Send, CheckCircle2, AlertCircle, Loader2, Info } from 'lucide-react'
import { saveEmailConfig, type EmailConfig } from '@/app/actions/emailConfigActions'

interface EmailConfigAdminProps {
  initialConfig: EmailConfig
  configSource: 'db' | 'env'
}

export default function EmailConfigAdmin({ initialConfig, configSource }: EmailConfigAdminProps) {
  const [config, setConfig] = useState<EmailConfig>(initialConfig)
  const [isSaving, setIsSaving] = useState(false)
  const [result, setResult] = useState<{ success: boolean; message: string } | null>(null)

  const handleChange = (field: keyof EmailConfig, value: string) => {
    setConfig(prev => ({ ...prev, [field]: value }))
    setResult(null)
  }

  const handleSave = async () => {
    setIsSaving(true)
    setResult(null)
    try {
      const res = await saveEmailConfig(config)
      setResult({
        success: res.success,
        message: res.success ? 'บันทึกการตั้งค่าอีเมลเรียบร้อยแล้ว' : (res.error || 'เกิดข้อผิดพลาด')
      })
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <div className="bg-white rounded-3xl border border-slate-200/80 shadow-2xs overflow-hidden transition-all">
      {/* Header */}
      <div className="p-6 border-b border-slate-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-slate-50/50">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 text-emerald-600 border border-emerald-500/20 flex items-center justify-center shrink-0 shadow-2xs">
            <Mail size={22} />
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-900">ตั้งค่าอีเมลระบบ (Email Notifications Settings)</h2>
            <p className="text-xs text-slate-500 mt-0.5">กำหนดอีเมลผู้ส่ง (Sender) และผู้รับเริ่มต้นสำหรับเอกสารแจ้งซ่อม</p>
          </div>
        </div>
        {/* Source badge */}
        <div className="flex items-center gap-2 shrink-0">
          <span className={`text-xs font-bold px-3.5 py-1.5 rounded-full border shadow-2xs flex items-center gap-1.5 ${
            configSource === 'db' 
              ? 'bg-blue-50 text-blue-600 border-blue-200/80' 
              : 'bg-amber-50 text-amber-600 border-amber-200/80'
          }`}>
            <span className={`w-2 h-2 rounded-full ${configSource === 'db' ? 'bg-blue-500' : 'bg-amber-500'}`} />
            {configSource === 'db' ? 'ใช้งานข้อมูลจาก Database' : 'ใช้งานข้อมูลจาก .env (Fallback)'}
          </span>
        </div>
      </div>

      <div className="p-6 md:p-8 space-y-6">
        {/* Info banner */}
        <div className="flex items-start gap-3 bg-slate-50/80 border border-slate-200/80 rounded-2xl p-4 text-xs text-slate-600">
          <Info size={16} className="text-slate-400 mt-0.5 shrink-0" />
          <span className="leading-relaxed">
            การเปลี่ยนค่าอีเมลที่นี่จะมีผลกับการส่ง PDF ใบแจ้งซ่อมทันทีโดยไม่ต้อง restart server — หากไม่มีการตั้งค่าใน Database ระบบจะนำค่าจากไฟล์ <code className="bg-slate-200/80 font-mono px-1.5 py-0.5 rounded text-slate-800">.env</code> มาใช้งานแทนโดยอัตโนมัติ
          </span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Sender Section */}
          <div className="space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
              <Send size={14} className="text-emerald-500" /> ข้อมูลผู้ส่งอีเมล (Sender Details)
            </h3>
            <div className="space-y-4 bg-slate-50/40 p-5 rounded-2xl border border-slate-100">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Email ผู้ส่ง (Sender Email) <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="email"
                    value={config.fromEmail}
                    onChange={e => handleChange('fromEmail', e.target.value)}
                    placeholder="sender@company.co.th"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all font-mono"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  ชื่อผู้ส่งแสดงในกล่องข้อความ (Display Name)
                </label>
                <div className="relative">
                  <User size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    value={config.fromName}
                    onChange={e => handleChange('fromName', e.target.value)}
                    placeholder="QSP Service"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Recipient Section */}
          <div className="space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
              <Mail size={14} className="text-blue-500" /> ผู้รับอีเมลเริ่มต้น (Default Recipient)
            </h3>
            <div className="space-y-4 bg-slate-50/40 p-5 rounded-2xl border border-slate-100 h-[calc(100%-2rem)] flex flex-col justify-between">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Email ผู้รับหลัก (Default Recipient Email)
                </label>
                <div className="relative">
                  <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="email"
                    value={config.defaultRecipientEmail}
                    onChange={e => handleChange('defaultRecipientEmail', e.target.value)}
                    placeholder="admin@company.co.th"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-mono"
                  />
                </div>
                <p className="text-[11px] text-slate-400 mt-2 leading-relaxed">
                  หากผู้ใช้งานเปิดงานซ่อมโดยไม่ได้ระบุอีเมลผู้รับเฉพาะ ระบบจะจัดส่งไฟล์ PDF ไปยังอีเมลตั้งต้นนี้โดยอัตโนมัติ
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Result message */}
        {result && (
          <div className={`flex items-center gap-2.5 px-4 py-3 rounded-2xl text-sm font-bold border transition-all animate-fade-in ${
            result.success ? 'bg-emerald-50 text-emerald-700 border-emerald-200/80' : 'bg-red-50 text-red-700 border-red-200/80'
          }`}>
            {result.success ? <CheckCircle2 size={18} /> : <AlertCircle size={18} />}
            {result.message}
          </div>
        )}

        {/* Save button */}
        <div className="flex items-center justify-end pt-2 border-t border-slate-100">
          <button
            onClick={handleSave}
            disabled={isSaving}
            className="flex items-center gap-2 px-7 py-3 rounded-2xl bg-emerald-600 text-white text-sm font-bold hover:bg-emerald-500 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-md shadow-emerald-600/20 cursor-pointer"
          >
            {isSaving ? <Loader2 size={18} className="animate-spin" /> : <CheckCircle2 size={18} />}
            {isSaving ? 'กำลังบันทึกข้อมูล...' : 'บันทึกการตั้งค่าอีเมล'}
          </button>
        </div>
      </div>
    </div>
  )
}
