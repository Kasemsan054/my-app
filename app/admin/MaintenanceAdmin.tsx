'use client'

import { useState, useTransition } from 'react'
import { updateMaintenanceSettings } from '@/app/actions/maintenanceActions'
import { Wrench, CheckCircle, AlertTriangle } from 'lucide-react'
import { appConfig } from '@/app/config/app.config'

const availablePaths = [
  { path: '/', name: 'ออกใบแจ้งเปิดงานซ่อม (Create Ticket)' },
  { path: '/worksheet', name: appConfig.ui.worksheet.title },
  { path: '/generator', name: appConfig.ui.generator.title },
  { path: '/histories', name: appConfig.ui.histories.title },
  { path: '/settings', name: appConfig.ui.settings.title }
]

export default function MaintenanceAdmin({ initialPaths }: { initialPaths: string[] }) {
  const [disabledPaths, setDisabledPaths] = useState<string[]>(initialPaths)
  const [isPending, startTransition] = useTransition()
  const [status, setStatus] = useState<{ type: 'success' | 'error', msg: string } | null>(null)

  const handleToggle = (path: string) => {
    setDisabledPaths(prev => 
      prev.includes(path) 
        ? prev.filter(p => p !== path)
        : [...prev, path]
    )
    setStatus(null)
  }

  const handleSave = () => {
    startTransition(async () => {
      const res = await updateMaintenanceSettings(disabledPaths)
      if (res.success) {
        setStatus({ type: 'success', msg: 'บันทึกการตั้งค่า Maintenance Mode สำเร็จ' })
        setTimeout(() => setStatus(null), 3000)
      } else {
        setStatus({ type: 'error', msg: res.error || 'เกิดข้อผิดพลาดในการบันทึก' })
      }
    })
  }

  return (
    <div className="bg-white rounded-3xl border border-slate-200/80 shadow-2xs overflow-hidden transition-all">
      {/* Header */}
      <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-amber-500/10 text-amber-600 border border-amber-500/20 flex items-center justify-center shrink-0 shadow-2xs">
            <Wrench size={22} />
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-900">Maintenance Mode (ปิดปรับปรุงระบบชั่วคราว)</h2>
            <p className="text-xs text-slate-500 mt-0.5">เปิดใช้งานเมื่อต้องการปิดปรับปรุงบางหน้าชั่วคราว โดยผู้ใช้ทั่วไปจะถูก Redirect ไปยังหน้าแจ้งเตือน</p>
          </div>
        </div>
      </div>

      <div className="p-6 md:p-8 space-y-6">
        <div className="space-y-3">
          {availablePaths.map(item => {
            const isSelected = disabledPaths.includes(item.path)
            return (
              <label 
                key={item.path}
                className={`flex items-center justify-between p-4 rounded-2xl border transition-all cursor-pointer ${
                  isSelected 
                    ? 'bg-amber-50/80 border-amber-300 text-amber-950 shadow-xs' 
                    : 'bg-slate-50/40 border-slate-200/80 text-slate-700 hover:border-amber-300/80 hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center gap-3 font-bold text-sm">
                  <span className={`w-2.5 h-2.5 rounded-full ${isSelected ? 'bg-amber-500 animate-pulse' : 'bg-slate-300'}`} />
                  {item.name} 
                  <span className="text-xs text-slate-400 font-mono font-normal">({item.path})</span>
                </div>
                <div className="relative inline-flex items-center cursor-pointer">
                  <input 
                    type="checkbox" 
                    className="sr-only peer"
                    checked={isSelected}
                    onChange={() => handleToggle(item.path)}
                  />
                  <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-amber-500"></div>
                </div>
              </label>
            )
          })}
        </div>

        {status && (
          <div className={`flex items-center gap-2.5 px-4 py-3 rounded-2xl text-sm font-bold border transition-all animate-fade-in ${
            status.type === 'success' ? 'bg-emerald-50 text-emerald-700 border-emerald-200/80' : 'bg-red-50 text-red-700 border-red-200/80'
          }`}>
            {status.type === 'success' ? <CheckCircle size={18} /> : <AlertTriangle size={18} />}
            {status.msg}
          </div>
        )}

        <div className="flex items-center justify-end pt-2 border-t border-slate-100">
          <button
            onClick={handleSave}
            disabled={isPending}
            className={`px-7 py-3 rounded-2xl font-bold text-sm text-white shadow-md transition-all flex items-center justify-center gap-2 active:scale-[0.98] ${
              isPending ? 'bg-slate-400 cursor-not-allowed' : 'bg-slate-900 hover:bg-slate-800 shadow-slate-900/10 cursor-pointer'
            }`}
          >
            {isPending ? 'กำลังบันทึก...' : 'บันทึกการซ่อมบำรุง'}
          </button>
        </div>
      </div>
    </div>
  )
}
