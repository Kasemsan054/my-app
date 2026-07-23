"use client"

import { Wrench, FileCheck, ShieldCheck, Zap } from 'lucide-react'
import { LoginForm } from '@/app/components/forms'

export default function LoginPage() {
  return (
    <main className="min-h-screen bg-slate-950 bg-[radial-gradient(ellipse_100%_100%_at_50%_0%,rgba(37,99,235,0.25),rgba(15,23,42,1))] flex items-center justify-center p-4 sm:p-6 md:p-8 font-sans">
      <div className="w-full max-w-4xl bg-slate-900/90 backdrop-blur-2xl rounded-[2.5rem] shadow-[0_25px_60px_-15px_rgba(0,0,0,0.8)] border border-slate-800/90 overflow-hidden grid grid-cols-1 md:grid-cols-12 min-h-[580px] animate-in fade-in zoom-in-95 duration-300">
        
        {/* Left Side: Desktop / Tablet Hero Showcase */}
        <div className="hidden md:flex md:col-span-5 lg:col-span-6 bg-slate-950/60 border-r border-slate-800/80 p-8 lg:p-12 flex-col justify-between relative overflow-hidden">
          {/* Subtle Glow Overlay */}
          <div className="absolute -top-24 -left-24 w-60 h-60 bg-brand-primary-light0/20 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-24 -right-24 w-60 h-60 bg-brand-secondary-light0/20 rounded-full blur-3xl pointer-events-none" />

          {/* Top Brand Header */}
          <div className="relative z-10 space-y-3">
            <div className="inline-flex items-center gap-2.5 bg-brand-primary-light0/10 border border-blue-400/20 px-3.5 py-1.5 rounded-full text-xs font-bold text-blue-400 shadow-xs">
              <Wrench size={16} /> QSP Service Management
            </div>
            <h2 className="text-2xl lg:text-3xl font-black text-white tracking-tight leading-snug">
              ระบบออกใบแจ้งเปิดงานซ่อมอุปกรณ์
            </h2>
            <p className="text-xs lg:text-sm text-slate-300 leading-relaxed font-normal">
              ยกระดับการบริหารจัดการเปิดงานซ่อม สร้างเอกสาร PDF พรีวิวสด และตรวจสอบประวัติได้อย่างรวดเร็ว
            </p>
          </div>

          {/* Middle Feature Highlights */}
          <div className="relative z-10 space-y-3 my-6">
            <div className="flex items-center gap-3 bg-slate-900/80 border border-slate-800 p-3.5 rounded-2xl">
              <div className="p-2 rounded-xl bg-brand-primary-light0/20 text-blue-400 shrink-0">
                <Zap size={18} />
              </div>
              <div>
                <div className="text-xs font-bold text-white">สร้างพรีวิว PDF ทันที</div>
                <div className="text-[11px] text-slate-400">ตรวจสอบความถูกต้องได้ก่อนบันทึกจริง</div>
              </div>
            </div>

            <div className="flex items-center gap-3 bg-slate-900/80 border border-slate-800 p-3.5 rounded-2xl">
              <div className="p-2 rounded-xl bg-emerald-500/20 text-emerald-400 shrink-0">
                <FileCheck size={18} />
              </div>
              <div>
                <div className="text-xs font-bold text-white">ออกใบแจ้งซ่อมมาตรฐาน</div>
                <div className="text-[11px] text-slate-400">รหัสเอกสาร RET-YYYYMMDD-XXXX ป้องกันซ้ำ</div>
              </div>
            </div>

            <div className="flex items-center gap-3 bg-slate-900/80 border border-slate-800 p-3.5 rounded-2xl">
              <div className="p-2 rounded-xl bg-purple-500/20 text-purple-400 shrink-0">
                <ShieldCheck size={18} />
              </div>
              <div>
                <div className="text-xs font-bold text-white">ปลอดภัยและรัดกุม</div>
                <div className="text-[11px] text-slate-400">จำกัดสิทธิ์ผู้ใช้ และรีเซ็ตรหัสผ่านชั่วคราว</div>
              </div>
            </div>
          </div>

          {/* Bottom Footer Status */}
          <div className="relative z-10 pt-4 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
            <div className="flex items-center gap-2 font-medium">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              ระบบพร้อมใช้งาน (System Online)
            </div>
            <span className="text-[10px] font-mono text-slate-500">v2.5</span>
          </div>
        </div>

        {/* Right Side: Form Panel */}
        <div className="md:col-span-7 lg:col-span-6 p-8 sm:p-10 lg:p-12 flex flex-col justify-center space-y-6 bg-slate-900/90 text-white">
          
          {/* Header Branding (Mobile Badge & Title) */}
          <div className="space-y-2">
            <div className="md:hidden inline-flex items-center gap-2 bg-brand-primary-light0/10 text-blue-400 border border-blue-400/20 px-3 py-1.5 rounded-xl text-xs font-bold mb-1">
              <Wrench size={16} className="text-blue-400" /> QSP Service
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">เข้าสู่ระบบ</h1>
            <p className="text-xs sm:text-sm text-slate-400 font-medium">
              กรอกรหัสพนักงานและรหัสผ่านเพื่อเข้าใช้งานระบบ
            </p>
          </div>

          {/* Decoupled LoginForm Component */}
          <LoginForm />

          {/* Footer info */}
          <div className="text-center pt-2 border-t border-slate-800/80">
            <p className="text-[11px] text-slate-500 font-medium">
              หากจำรหัสผ่านไม่ได้หรือเข้าใช้งานไม่ได้ กรุณาติดต่อผู้ดูแลระบบ (Admin)
            </p>
          </div>
        </div>

      </div>
    </main>
  )
}