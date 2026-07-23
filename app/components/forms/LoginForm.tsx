"use client"

import { useState } from 'react'
import { LogIn, Eye, EyeOff, User, KeyRound, AlertCircle } from 'lucide-react'
import { loginAction } from '@/app/actions/authActions'
import { Button } from '@/app/components/ui/Button'

export default function LoginForm() {
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setIsLoading(true)
    setError('')
    
    const formData = new FormData(e.currentTarget)
    const res = await loginAction(formData)
    
    if (res?.error) setError(res.error)
    setIsLoading(false)
  }

  return (
    <div className="space-y-5">
      {error && (
        <div className="bg-rose-950/80 border border-rose-800/80 text-rose-300 p-4 rounded-2xl text-xs font-semibold flex items-center gap-2.5 animate-in fade-in duration-200">
          <AlertCircle size={18} className="text-rose-400 shrink-0" />
          <span>{error}</span>
        </div>
      )}

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
              className="w-full h-11 bg-slate-950/90 border border-slate-800 pl-11 pr-4 rounded-2xl text-xs font-semibold text-white outline-none transition-all focus:bg-slate-950 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 placeholder:text-slate-500"
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
              className="w-full h-11 bg-slate-950/90 border border-slate-800 pl-11 pr-11 rounded-2xl text-xs font-semibold text-white outline-none transition-all focus:bg-slate-950 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 placeholder:text-slate-500"
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
            className="w-full py-3.5 text-sm font-bold bg-brand-primary hover:bg-brand-primary-light0 text-white shadow-lg shadow-brand-primary/30 cursor-pointer border-none"
          >
            เข้าสู่ระบบ
          </Button>
        </div>
      </form>
    </div>
  )
}
