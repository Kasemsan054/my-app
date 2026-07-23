"use client"

import { useState } from 'react'
import { UserPlus, Copy, CheckCircle2, ShieldCheck, KeyRound, Trash2, Shield, User, Users } from 'lucide-react'
import { addEmployeeAction, resetUserPassword, deleteUser } from '@/app/actions/adminActions'
import { InputField } from '@/app/components/ui/FormField'
import { SelectField } from '@/app/components/ui/Select'
import { Button } from '@/app/components/ui/Button'
import { Modal } from '@/app/components/ui/Modal'
import { Toast } from '@/app/components/ui/Toast'

interface UserItem {
  employeeId: string
  name: string
  role: string
  isFirstLogin: boolean
}

interface AdminUserClientPageProps {
  users: UserItem[]
  currentUser: { employeeId: string; name: string; role: string }
}

export default function AdminUserClientPage({ users, currentUser }: AdminUserClientPageProps) {
  const [userList, setUserList] = useState<UserItem[]>(users)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [successData, setSuccessData] = useState<{ empId: string; name: string; pass: string } | null>(null)
  const [copied, setCopied] = useState(false)

  // Reset & Delete Modals
  const [confirmResetTarget, setConfirmResetTarget] = useState<UserItem | null>(null)
  const [resetModalData, setResetModalData] = useState<{ empId: string; name: string; pass: string } | null>(null)
  const [deleteTarget, setDeleteTarget] = useState<UserItem | null>(null)
  const [isActionLoading, setIsActionLoading] = useState(false)
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setIsLoading(true)
    setError('')
    setSuccessData(null)
    setCopied(false)
    
    const formData = new FormData(e.currentTarget)
    const res = await addEmployeeAction(formData)
    
    if (res.error) {
      setError(res.error)
    } else if (res.success) {
      const newRole = (formData.get('role') as string) || 'STAFF'
      setUserList(prev => [
        { employeeId: res.employeeId as string, name: res.name as string, role: newRole, isFirstLogin: true },
        ...prev
      ])
      setSuccessData({
        empId: res.employeeId as string,
        name: res.name as string,
        pass: res.rawPassword as string
      })
      setToast({ message: `ลงทะเบียนพนักงาน ${res.name} เรียบร้อยแล้ว`, type: 'success' })
      ;(e.target as HTMLFormElement).reset()
    }
    setIsLoading(false)
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    setCopied(true)
    setToast({ message: `คัดลอกรหัสผ่าน "${text}" เรียบร้อยแล้ว`, type: 'success' })
    setTimeout(() => setCopied(false), 2000)
  }

  async function executeResetPassword() {
    if (!confirmResetTarget) return
    const emp = confirmResetTarget
    setConfirmResetTarget(null)

    setIsActionLoading(true)
    const res = await resetUserPassword(emp.employeeId)
    setIsActionLoading(false)

    if (res.success && res.rawPassword) {
      setUserList(prev => prev.map(u => u.employeeId === emp.employeeId ? { ...u, isFirstLogin: true } : u))
      setResetModalData({
        empId: emp.employeeId,
        name: emp.name,
        pass: res.rawPassword
      })
      setToast({ message: `รีเซ็ตรหัสผ่านของ ${emp.name} เรียบร้อยแล้ว (isFirstLogin = TRUE)`, type: 'success' })
    } else {
      setToast({ message: res.error || 'เกิดข้อผิดพลาดในการรีเซ็ตรหัสผ่าน', type: 'error' })
    }
  }

  async function handleDeleteConfirm() {
    if (!deleteTarget) return
    setIsActionLoading(true)
    const res = await deleteUser(deleteTarget.employeeId)
    setIsActionLoading(false)

    if (res.success) {
      setUserList(prev => prev.filter(u => u.employeeId !== deleteTarget.employeeId))
      setToast({ message: `ลบผู้ใช้งาน ${deleteTarget.name} เรียบร้อยแล้ว`, type: 'success' })
      setDeleteTarget(null)
    } else {
      setToast({ message: res.error || 'เกิดข้อผิดพลาดในการลบผู้ใช้งาน', type: 'error' })
    }
  }

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-12">
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

      {/* Header Banner */}
      <div className="bg-slate-900 rounded-3xl p-6 md:p-8 text-white shadow-xl flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <div className="flex items-center gap-2 text-blue-400 font-bold text-xs uppercase tracking-wider mb-1">
            <Users size={16} /> User Account Management
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight">จัดการผู้ใช้งานและพนักงานในระบบ</h1>
          <p className="text-sm text-slate-300 mt-1">เพิ่มบัญชีพนักงานใหม่ กำหนดสิทธิ์ และรีเซ็ตรหัสผ่าน</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Form to Add User (1 col) */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-3xl border border-slate-200/80 p-6 md:p-8 shadow-xs space-y-6">
            <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
              <div className="bg-slate-900 text-white p-3 rounded-2xl shadow-xs">
                <UserPlus size={20} />
              </div>
              <div>
                <h2 className="text-base font-bold text-slate-900">เพิ่มพนักงานใหม่</h2>
                <p className="text-xs text-slate-500">ระบบจะสร้างรหัสผ่านชั่วคให้อัตโนมัติ</p>
              </div>
            </div>

            {error && (
              <div className="bg-red-50 text-red-600 p-3.5 rounded-2xl text-xs font-semibold border border-red-100">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <InputField
                label="รหัสพนักงาน (Employee ID)"
                name="employeeId"
                required
                placeholder="เช่น EMP005"
              />

              <InputField
                label="ชื่อ-นามสกุล"
                name="name"
                required
                placeholder="พิมพ์ชื่อพนักงาน"
              />

              <SelectField
                label="สิทธิ์การใช้งาน (Role)"
                name="role"
                required
                options={[
                  { value: 'STAFF', label: 'เจ้าหน้าที่ทั่วไป (STAFF)' },
                  { value: 'ADMIN', label: 'ผู้ดูแลระบบ (ADMIN)' }
                ]}
              />

              <div className="pt-2">
                <Button
                  type="submit"
                  loading={isLoading}
                  icon={<UserPlus size={18} />}
                  className="w-full py-4 text-base cursor-pointer"
                >
                  ลงทะเบียนพนักงาน
                </Button>
              </div>
            </form>

            {/* Generated Password Result */}
            {successData && (
              <div className="bg-emerald-50 border border-emerald-200/80 p-5 rounded-2xl space-y-3 animate-in fade-in duration-300">
                <div className="flex items-center gap-2 text-emerald-800 font-bold text-xs">
                  <ShieldCheck size={18} className="text-emerald-600 shrink-0" /> ลงทะเบียนพนักงานสำเร็จ
                </div>
                <div className="text-xs text-slate-600">
                  รหัสพนักงาน: <b className="text-slate-900">{successData.empId}</b> ({successData.name})
                </div>
                <div>
                  <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                    รหัสผ่านชั่วคราว (คลิกเพื่อคัดลอก)
                  </div>
                  <div 
                    onClick={() => copyToClipboard(successData.pass)}
                    className="flex items-center gap-2 cursor-pointer group"
                    title="คลิกเพื่อคัดลอกรหัสผ่าน"
                  >
                    <code className="flex-1 bg-white border border-slate-200 group-hover:border-emerald-500 text-slate-900 p-2.5 rounded-xl font-mono text-base text-center font-bold transition-colors select-all">
                      {successData.pass}
                    </code>
                    <button
                      type="button"
                      className="p-2.5 bg-slate-900 text-white rounded-xl hover:bg-slate-800 transition-colors shrink-0 cursor-pointer"
                    >
                      {copied ? <CheckCircle2 size={18} className="text-emerald-400" /> : <Copy size={18} />}
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Registered Users Table (2 cols) */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs overflow-hidden">
            <div className="p-6 border-b border-slate-100 flex items-center justify-between">
              <div>
                <h2 className="text-base font-bold text-slate-900">รายชื่อผู้ใช้งานทั้งหมดในระบบ</h2>
                <p className="text-xs text-slate-500">จำนวนพนักงานทั้งหมด {userList.length} คน</p>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm border-collapse">
                <thead>
                  <tr className="bg-slate-50/80 border-b border-slate-200/80 text-xs text-slate-500 font-bold uppercase tracking-wider">
                    <th className="py-4 px-6">รหัสพนักงาน</th>
                    <th className="py-4 px-6">ชื่อ-นามสกุล</th>
                    <th className="py-4 px-6">สิทธิ์ (Role)</th>
                    <th className="py-4 px-6">สถานะการเข้าใช้งาน</th>
                    <th className="py-4 px-6 text-right">จัดการ</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {userList.map((usr) => (
                    <tr key={usr.employeeId} className="hover:bg-slate-50/60 transition-colors">
                      <td className="py-4 px-6 font-mono font-bold text-slate-900">
                        {usr.employeeId}
                      </td>

                      <td className="py-4 px-6 font-semibold text-slate-800">
                        {usr.name}
                        {usr.employeeId === currentUser.employeeId && (
                          <span className="ml-2 text-[10px] bg-brand-primary-light text-brand-primary-hover font-bold px-2 py-0.5 rounded-md">คุณ</span>
                        )}
                      </td>

                      <td className="py-4 px-6">
                        <span className={`
                          inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold
                          ${usr.role === 'ADMIN' ? 'bg-purple-50 text-purple-700 border border-purple-200' : 'bg-slate-100 text-slate-700 border border-slate-200'}
                        `}>
                          {usr.role === 'ADMIN' ? <Shield size={12} /> : <User size={12} />}
                          {usr.role}
                        </span>
                      </td>

                      <td className="py-4 px-6 text-xs">
                        {usr.isFirstLogin ? (
                          <span className="text-amber-600 bg-amber-50 border border-amber-200/60 px-2.5 py-1 rounded-full font-semibold">
                            รอเปลี่ยนรหัสผ่านครั้งแรก
                          </span>
                        ) : (
                          <span className="text-emerald-700 bg-emerald-50 border border-emerald-200/60 px-2.5 py-1 rounded-full font-semibold">
                            ใช้งานตามปกติ
                          </span>
                        )}
                      </td>

                      <td className="py-4 px-6 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => setConfirmResetTarget(usr)}
                            className="p-2 text-slate-600 hover:text-amber-600 hover:bg-amber-50 rounded-xl transition-colors cursor-pointer"
                            title="รีเซ็ตรหัสผ่านใหม่"
                          >
                            <KeyRound size={16} />
                          </button>

                          {usr.employeeId !== currentUser.employeeId && (
                            <button
                              onClick={() => setDeleteTarget(usr)}
                              className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-colors cursor-pointer"
                              title="ลบผู้ใช้งาน"
                            >
                              <Trash2 size={16} />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {/* Modal: Confirm Reset Password */}
      {confirmResetTarget && (
        <Modal
          isOpen={!!confirmResetTarget}
          onClose={() => setConfirmResetTarget(null)}
          title="ยืนยันการรีเซ็ตรหัสผ่าน"
          description={`คุณต้องการรีเซ็ตรหัสผ่านของพนักงาน "${confirmResetTarget.name}" (${confirmResetTarget.employeeId}) ใช่หรือไม่?`}
          confirmLabel="ยืนยันรีเซ็ตรหัสผ่าน"
          confirmVariant="danger"
          onConfirm={executeResetPassword}
          isLoading={isActionLoading}
        >
          <div className="bg-amber-50 border border-amber-200/80 p-4 rounded-2xl text-xs text-amber-800 space-y-1 font-medium">
            <div className="font-bold text-amber-900">หมายเหตุสำคัญ:</div>
            <p>
              ระบบจะรีเซ็ตรหัสผ่านเป็นรหัสผ่านชั่วคราวใหม่ และกำหนดสิทธิ์เป็น <b>รอเปลี่ยนรหัสผ่านครั้งแรก (isFirstLogin = TRUE)</b> เพื่อบังคับให้ผู้ใช้เปลี่ยนรหัสผ่านใหม่ในการเข้าใช้งานครั้งถัดไป
            </p>
          </div>
        </Modal>
      )}

      {/* Modal: Reset Password Result */}
      {resetModalData && (
        <Modal
          isOpen={!!resetModalData}
          onClose={() => setResetModalData(null)}
          title="รีเซ็ตรหัสผ่านสำเร็จ"
          description={`รหัสผ่านใหม่ชั่วคราวสำหรับ ${resetModalData.name} (${resetModalData.empId})`}
        >
          <div className="space-y-4">
            <div className="bg-amber-50 border border-amber-200 p-4 rounded-2xl text-xs text-amber-800">
              แจ้งรหัสผ่านชั่วคราวนี้ให้พนักงาน เพื่อให้ใช้เข้าสู่ระบบและตั้งรหัสผ่านใหม่ (isFirstLogin = TRUE)
            </div>

            <div>
              <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                รหัสผ่านใหม่ชั่วคราว (คลิกเพื่อคัดลอก)
              </div>
              <div 
                onClick={() => copyToClipboard(resetModalData.pass)}
                className="flex items-center gap-2 cursor-pointer group"
                title="คลิกเพื่อคัดลอกรหัสผ่าน"
              >
                <code className="flex-1 bg-slate-50 border border-slate-200 group-hover:border-amber-500 text-slate-900 p-3 rounded-xl font-mono text-lg text-center font-bold transition-colors select-all">
                  {resetModalData.pass}
                </code>
                <button
                  type="button"
                  className="p-3 bg-slate-900 text-white rounded-xl hover:bg-slate-800 transition-colors cursor-pointer shrink-0"
                >
                  {copied ? <CheckCircle2 size={18} className="text-emerald-400" /> : <Copy size={18} />}
                </button>
              </div>
            </div>
          </div>
        </Modal>
      )}

      {/* Modal: Delete User Confirm */}
      {deleteTarget && (
        <Modal
          isOpen={!!deleteTarget}
          onClose={() => setDeleteTarget(null)}
          title="ยืนยันการลบผู้ใช้งาน"
          description={`คุณต้องการลบบัญชีพนักงาน "${deleteTarget.name}" (${deleteTarget.employeeId}) ออกจากระบบใช่หรือไม่?`}
          confirmLabel="ยืนยันลบผู้ใช้"
          confirmVariant="danger"
          onConfirm={handleDeleteConfirm}
          isLoading={isActionLoading}
        />
      )}
    </div>
  )
}
