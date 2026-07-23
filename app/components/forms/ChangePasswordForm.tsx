"use client"

import { useState } from 'react'
import { changePasswordAction } from '@/app/actions/authActions'
import { KeyRound, Eye, EyeOff, AlertCircle, CheckCircle2 } from 'lucide-react'
import { Button } from '@/app/components/ui/Button'

export default function ChangePasswordForm() {
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setIsLoading(true)
    setError('')
    
    const formData = new FormData(e.currentTarget)
    const res = await changePasswordAction(formData)
    
    if (res?.error) setError(res.error)
    setIsLoading(false)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {error && (
        <div className="bg-rose-950/80 border border-rose-800/80 text-rose-300 p-4 rounded-2xl text-xs font-semibold flex items-center gap-2.5 animate-in fade-in duration-200">
          <AlertCircle size={18} className="text-rose-400 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* New Password */}
      <div className="space-y-1.5">
        <label className="block text-xs font-bold uppercase tracking-wider text-slate-400">
          รหัสผ่านใหม่ (New Password) <span className="text-rose-400">*</span>
        </label>
        <div className="relative">
          <KeyRound size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
          <input
            type={showNewPassword ? 'text' : 'password'}
            name="newPassword"
            required
            minLength={6}
            placeholder="ความยาวอย่างน้อย 6 ตัวอักษร"
            className="w-full h-11 bg-slate-950/90 border border-slate-800 pl-11 pr-11 rounded-2xl text-xs font-semibold text-white outline-none transition-all focus:bg-slate-950 focus:border-amber-500 focus:ring-4 focus:ring-amber-500/10 placeholder:text-slate-500"
          />
          <button
            type="button"
            onClick={() => setShowNewPassword(!showNewPassword)}
            className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 p-1 transition-colors cursor-pointer"
            title={showNewPassword ? 'ซ่อนรหัสผ่าน' : 'แสดงรหัสผ่าน'}
          >
            {showNewPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        </div>
      </div>

      {/* Confirm Password */}
      <div className="space-y-1.5">
        <label className="block text-xs font-bold uppercase tracking-wider text-slate-400">
          ยืนยันรหัสผ่านใหม่ (Confirm Password) <span className="text-rose-400">*</span>
        </label>
        <div className="relative">
          <KeyRound size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
          <input
            type={showConfirmPassword ? 'text' : 'password'}
            name="confirmPassword"
            required
            minLength={6}
            placeholder="พิมพ์รหัสผ่านใหม่อีกครั้ง"
            className="w-full h-11 bg-slate-950/90 border border-slate-800 pl-11 pr-11 rounded-2xl text-xs font-semibold text-white outline-none transition-all focus:bg-slate-950 focus:border-amber-500 focus:ring-4 focus:ring-amber-500/10 placeholder:text-slate-500"
          />
          <button
            type="button"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 p-1 transition-colors cursor-pointer"
            title={showConfirmPassword ? 'ซ่อนรหัสผ่าน' : 'แสดงรหัสผ่าน'}
          >
            {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        </div>
      </div>

      {/* Password requirement hint */}
      <div className="bg-slate-950/60 p-3.5 rounded-2xl border border-slate-800 text-xs text-slate-400 flex items-center gap-2">
        <CheckCircle2 size={16} className="text-emerald-400 shrink-0" />
        <span>รหัสผ่านใหม่ต้องมีความยาวอย่างน้อย 6 ตัวอักษร</span>
      </div>

      {/* Submit Action */}
      <div className="pt-2 flex items-center gap-3">
        <Button
          type="submit"
          loading={isLoading}
          icon={<KeyRound size={18} />}
          className="w-full py-3.5 text-sm font-bold bg-amber-600 hover:bg-amber-500 text-white shadow-lg shadow-amber-600/30 cursor-pointer border-none"
        >
          บันทึกรหัสผ่านใหม่
        </Button>
      </div>
    </form>
  )
}
