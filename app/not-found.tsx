"use client"

import Link from 'next/link'
import { FileQuestion, Home, ArrowLeft } from 'lucide-react'

export default function NotFound() {
  return (
    <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-6">
      <div className="max-w-md w-full bg-slate-900/50 backdrop-blur-xl border border-slate-800 rounded-3xl p-8 md:p-12 text-center shadow-2xl relative overflow-hidden">
        {/* Background Decorative Glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-brand-primary/20 blur-3xl rounded-full pointer-events-none"></div>

        <div className="relative z-10">
          <div className="w-24 h-24 bg-slate-800/50 rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-inner border border-slate-700">
            <FileQuestion size={48} className="text-brand-primary animate-bounce-slow" />
          </div>
          
          <h1 className="text-5xl font-black text-white tracking-tight mb-4">404</h1>
          <h2 className="text-xl font-bold text-slate-200 mb-3">ไม่พบหน้าที่คุณต้องการ</h2>
          <p className="text-slate-400 mb-8 text-sm">
            ขออภัย หน้าที่คุณพยายามเข้าถึงอาจถูกลบ ย้าย หรือไม่มีอยู่จริง กรุณาตรวจสอบ URL หรือกลับไปยังหน้าหลัก
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <button 
              onClick={() => window.history.back()}
              className="w-full sm:w-auto px-6 py-3 rounded-2xl bg-slate-800 text-white font-bold hover:bg-slate-700 transition-colors flex items-center justify-center gap-2 border border-slate-700"
            >
              <ArrowLeft size={18} />
              ย้อนกลับ
            </button>
            <Link 
              href="/"
              className="w-full sm:w-auto px-6 py-3 rounded-2xl bg-brand-primary text-white font-bold hover:bg-brand-primary-hover shadow-lg shadow-brand-primary/30 transition-all flex items-center justify-center gap-2"
            >
              <Home size={18} />
              หน้าหลัก
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
