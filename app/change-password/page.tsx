"use client"

import Link from 'next/link'
import { ShieldAlert, Lock, ShieldCheck, ArrowLeft } from 'lucide-react'
import { ChangePasswordForm } from '@/app/components/forms'

export default function ChangePasswordPage() {
  return (
    <main className="min-h-screen bg-slate-950 bg-[radial-gradient(ellipse_100%_100%_at_50%_0%,rgba(245,158,11,0.25),rgba(15,23,42,1))] flex items-center justify-center p-4 sm:p-6 md:p-8 font-sans">
      <div className="w-full max-w-4xl bg-slate-900/90 backdrop-blur-2xl rounded-[2.5rem] shadow-[0_25px_60px_-15px_rgba(0,0,0,0.8)] border border-slate-800/90 overflow-hidden grid grid-cols-1 md:grid-cols-12 min-h-[550px] animate-in fade-in zoom-in-95 duration-300">
        
        {/* Left Side: Desktop / Tablet Hero Showcase */}
        <div className="hidden md:flex md:col-span-5 bg-slate-950/60 border-r border-slate-800/80 p-8 lg:p-10 flex-col justify-between relative overflow-hidden">
          {/* Glow backdrop */}
          <div className="absolute -top-20 -left-20 w-52 h-52 bg-amber-500/20 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 space-y-4">
            <div className="inline-flex items-center gap-2 bg-amber-500/10 border border-amber-400/20 px-3.5 py-1.5 rounded-full text-xs font-bold text-amber-400">
              <ShieldAlert size={16} /> Password Management Setup
            </div>
            <h2 className="text-2xl lg:text-3xl font-black text-white tracking-tight leading-snug">
              แก้ไขรหัสผ่านส่วนตัว
            </h2>
            <p className="text-xs lg:text-sm text-slate-300 leading-relaxed font-normal">
              กรุณาตั้งรหัสผ่านใหม่ที่คุณจำได้ง่ายแต่คาดเดายาก เพื่อความปลอดภัยในการเข้าใช้งานระบบ
            </p>
          </div>

          {/* Security Checklist */}
          <div className="relative z-10 space-y-3 my-6">
            <div className="flex items-center gap-3 bg-slate-900/80 border border-slate-800 p-3.5 rounded-2xl">
              <Lock size={18} className="text-amber-400 shrink-0" />
              <div className="text-xs font-semibold text-slate-200">ความยาวรหัสผ่านอย่างน้อย 6 ตัวอักษร</div>
            </div>

            <div className="flex items-center gap-3 bg-slate-900/80 border border-slate-800 p-3.5 rounded-2xl">
              <ShieldCheck size={18} className="text-emerald-400 shrink-0" />
              <div className="text-xs font-semibold text-slate-200">ห้ามเปิดเผยรหัสผ่านชั่วคราวให้ผู้อื่น</div>
            </div>
          </div>

          {/* Footer note */}
          <div className="relative z-10 pt-4 border-t border-slate-800/80 text-xs text-slate-400">
            ระบบความปลอดภัย QSP Service System
          </div>
        </div>

        {/* Right Side: Form Panel */}
        <div className="md:col-span-7 p-8 sm:p-10 lg:p-12 flex flex-col justify-center space-y-6 bg-slate-900/90 text-white">
          
          {/* Header Branding */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="inline-flex items-center gap-2 bg-amber-500/10 text-amber-400 border border-amber-400/20 px-3 py-1.5 rounded-xl text-xs font-bold mb-1">
                <ShieldAlert size={16} /> แก้ไขรหัสผ่านผู้ใช้งาน
              </div>
              <Link href="/" className="text-xs text-slate-400 hover:text-white flex items-center gap-1 font-semibold transition-colors">
                <ArrowLeft size={14} /> กลับหน้าหลัก
              </Link>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">ตั้งรหัสผ่านใหม่</h1>
            <p className="text-xs sm:text-sm text-slate-400 font-medium">
              ตั้งรหัสผ่านส่วนตัวสำหรับเข้าใช้งานระบบในครั้งต่อไป
            </p>
          </div>

          {/* Dedicated Decoupled ChangePasswordForm */}
          <ChangePasswordForm />
        </div>

      </div>
    </main>
  )
}