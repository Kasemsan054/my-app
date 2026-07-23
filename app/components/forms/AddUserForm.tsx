"use client"

import { useState } from 'react'
import { UserPlus, AlertCircle, CheckCircle2, ShieldCheck } from 'lucide-react'
import { addEmployeeAction } from '@/app/actions/adminActions'
import { InputField, SelectField, Button } from '@/app/components/ui'

export default function AddUserForm() {
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setIsLoading(true)
    setError('')
    setSuccess('')

    const formData = new FormData(e.currentTarget)
    const res = await addEmployeeAction(formData)

    if (res?.error) {
      setError(res.error)
    } else if (res?.success) {
      setSuccess(`เพิ่มผู้ใช้งานสำเร็จ! รหัสผ่านชั่วคราวคือ: ${res.rawPassword}`)
      e.currentTarget.reset()
    }
    setIsLoading(false)
  }

  return (
    <div className="bg-white p-6 md:p-8 rounded-3xl border border-slate-200 shadow-xs space-y-6">
      <div className="flex items-center gap-2.5 text-slate-900 font-extrabold text-base border-b border-slate-100 pb-3">
        <UserPlus className="text-brand-primary" size={20} /> กรอกข้อมูลเพื่อสร้างผู้ใช้งานใหม่
      </div>

      {error && (
        <div className="bg-rose-50 border border-rose-200 text-rose-700 p-4 rounded-2xl text-xs font-semibold flex items-center gap-2.5">
          <AlertCircle size={18} className="text-rose-500 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {success && (
        <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 p-4 rounded-2xl text-xs font-bold space-y-1">
          <div className="flex items-center gap-2 text-sm text-emerald-700">
            <CheckCircle2 size={18} />
            <span>{success}</span>
          </div>
          <div className="text-[11px] text-emerald-600 font-medium pl-6">
            แจ้งรหัสผ่านชั่วคราวนี้ให้พนักงาน เพื่อนำไปเข้าสู่ระบบและเปลี่ยนรหัสผ่านส่วนตัวในครั้งแรก
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <InputField
            label="รหัสพนักงาน (Employee ID)"
            name="employeeId"
            required
            placeholder="เช่น EMP001"
          />

          <InputField
            label="ชื่อ-นามสกุลพนักงาน"
            name="name"
            required
            placeholder="เช่น สมชาย ใจดี"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <SelectField
            label="สิทธิ์การใช้งาน (Role)"
            name="role"
            required
            defaultValue="STAFF"
            options={[
              { value: 'STAFF', label: 'พนักงานทั่วไป (STAFF)' },
              { value: 'ADMIN', label: 'ผู้ดูแลระบบ (ADMIN)' }
            ]}
          />

          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-slate-700">รหัสผ่านชั่วคราวเริ่มต้น</label>
            <div className="h-11 bg-slate-100 border border-slate-200 text-slate-500 font-semibold px-4 py-2.5 rounded-2xl text-xs flex items-center gap-2">
              <ShieldCheck size={16} className="text-slate-400" />
              <span>ระบบสุ่มให้อัตโนมัติ (Random Generator)</span>
            </div>
          </div>
        </div>

        <div className="pt-3 flex justify-end">
          <Button
            type="submit"
            loading={isLoading}
            icon={<UserPlus size={18} />}
            className="w-full sm:w-auto px-8 bg-brand-primary hover:bg-brand-primary-hover text-white font-bold text-xs"
          >
            สร้างบัญชีผู้ใช้งานใหม่
          </Button>
        </div>
      </form>
    </div>
  )
}
