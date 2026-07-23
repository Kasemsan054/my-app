"use client"

import { Wrench, Mail, RefreshCw } from 'lucide-react'
import { appConfig } from '@/app/config/app.config'

export default function MaintenancePage() {
  return (
    <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-6">
      <div className="max-w-xl w-full bg-slate-900/50 backdrop-blur-xl border border-slate-800 rounded-3xl p-8 md:p-12 text-center shadow-2xl relative overflow-hidden">
        {/* Background Decorative Glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-amber-500/10 blur-3xl rounded-full pointer-events-none"></div>

        <div className="relative z-10">
          <div className="w-24 h-24 bg-amber-500/10 rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-inner border border-amber-500/20">
            <Wrench size={48} className="text-amber-500 animate-pulse" />
          </div>
          
          <h1 className="text-3xl font-black text-white tracking-tight mb-4">ระบบกำลังปิดปรับปรุง</h1>
          <h2 className="text-lg font-bold text-slate-300 mb-4">{appConfig.appName} - Under Maintenance</h2>
          <p className="text-slate-400 mb-8 text-sm leading-relaxed">
            เรากำลังดำเนินการอัปเดตและบำรุงรักษาระบบ เพื่อเพิ่มประสิทธิภาพและประสบการณ์การใช้งานที่ดียิ่งขึ้น 
            ขออภัยในความไม่สะดวก ระบบจะกลับมาให้บริการอีกครั้งในเร็วๆ นี้
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <button 
              onClick={() => window.location.reload()}
              className="w-full sm:w-auto px-6 py-3 rounded-2xl bg-amber-500 text-slate-950 font-bold hover:bg-amber-400 shadow-lg shadow-amber-500/20 transition-all flex items-center justify-center gap-2"
            >
              <RefreshCw size={18} />
              ลองโหลดใหม่อีกครั้ง
            </button>
            <a 
              href={`mailto:${appConfig.company.adminEmail}`}
              className="w-full sm:w-auto px-6 py-3 rounded-2xl bg-slate-800 text-white font-bold hover:bg-slate-700 transition-colors flex items-center justify-center gap-2 border border-slate-700"
            >
              <Mail size={18} />
              ติดต่อผู้ดูแลระบบ
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}
