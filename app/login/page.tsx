"use client"

import { useState } from 'react'
import { LogIn, Eye, EyeOff, Wrench, User, KeyRound, AlertCircle, FileCheck, ShieldCheck, Zap } from 'lucide-react'
import { loginAction } from '@/app/actions/authActions'
import { Button } from '@/app/components/ui/Button'

export default function LoginPage() {
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setIsLoading(true)
    setError("")
    
    const formData = new FormData(e.currentTarget)
    const res = await loginAction(formData)
    
    if (res?.error) setError(res.error)
    setIsLoading(false)
  }

  return (
    <main className="min-h-screen bg-slate-950 bg-[radial-gradient(ellipse_100%_100%_at_50%_0%,rgba(37,99,235,0.25),rgba(15,23,42,1))] flex items-center justify-center p-4 sm:p-6 md:p-8 font-sans">
      <div className="w-full max-w-4xl bg-slate-900/90 backdrop-blur-2xl rounded-[2.5rem] shadow-[0_25px_60px_-15px_rgba(0,0,0,0.8)] border border-slate-800/90 overflow-hidden grid grid-cols-1 md:grid-cols-12 min-h-[580px] animate-in fade-in zoom-in-95 duration-300">
        
        {/* Left Side: Desktop / Tablet Hero Showcase */}
        <div className="hidden md:flex md:col-span-5 lg:col-span-6 bg-slate-950/60 border-r border-slate-800/80 p-8 lg:p-12 flex-col justify-between relative overflow-hidden">
          {/* Subtle Glow Overlay */}
          <div className="absolute -top-24 -left-24 w-60 h-60 bg-blue-500/20 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-24 -right-24 w-60 h-60 bg-indigo-500/20 rounded-full blur-3xl pointer-events-none" />

          {/* Top Brand Header */}
          <div className="relative z-10 space-y-3">
            <div className="inline-flex items-center gap-2.5 bg-blue-500/10 border border-blue-400/20 px-3.5 py-1.5 rounded-full text-xs font-bold text-blue-400 shadow-xs">
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
              <div className="p-2 rounded-xl bg-blue-500/20 text-blue-400 shrink-0">
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
            <div className="md:hidden inline-flex items-center gap-2 bg-blue-500/10 text-blue-400 border border-blue-400/20 px-3 py-1.5 rounded-xl text-xs font-bold mb-1">
              <Wrench size={16} className="text-blue-400" /> QSP Service
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">เข้าสู่ระบบ</h1>
            <p className="text-xs sm:text-sm text-slate-400 font-medium">
              กรอกรหัสพนักงานและรหัสผ่านเพื่อเข้าใช้งานระบบ
            </p>
          </div>

          {/* Error Alert */}
          {error && (
            <div className="bg-rose-950/80 border border-rose-800/80 text-rose-300 p-4 rounded-2xl text-xs font-semibold flex items-center gap-2.5 animate-in fade-in duration-200">
              <AlertCircle size={18} className="text-rose-400 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Employee ID */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-400">
                รหัสพนักงาน (Employee ID) <span className="text-rose-400">*</span>
              </label>
              <div className="relative">
                <User size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
                <input
                  type="text"
                  name="employeeId"
                  required
                  placeholder="เช่น EMP001"
                  className="w-full bg-slate-950/90 border border-slate-800 py-3.5 pl-11 pr-4 rounded-2xl text-sm font-semibold text-white outline-none transition-all focus:bg-slate-950 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 placeholder:text-slate-500"
                />
              </div>
            </div>

            {/* Password */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-400">
                รหัสผ่าน (Password) <span className="text-rose-400">*</span>
              </label>
              <div className="relative">
                <KeyRound size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  required
                  placeholder="กรอกรหัสผ่าน..."
                  className="w-full bg-slate-950/90 border border-slate-800 py-3.5 pl-11 pr-11 rounded-2xl text-sm font-semibold text-white outline-none transition-all focus:bg-slate-950 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 placeholder:text-slate-500"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 p-1 transition-colors cursor-pointer"
                  title={showPassword ? 'ซ่อนรหัสผ่าน' : 'แสดงรหัสผ่าน'}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {/* Submit Action */}
            <div className="pt-2">
              <Button
                type="submit"
                loading={isLoading}
                icon={<LogIn size={18} />}
                className="w-full py-4 text-base font-bold bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-600/30 cursor-pointer border-none"
              >
                เข้าสู่ระบบ
              </Button>
            </div>
          </form>

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