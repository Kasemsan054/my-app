"use server"
import prisma from '../lib/prisma'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import bcrypt from 'bcryptjs'

export async function loginAction(formData: FormData) {
  const employeeId = formData.get('employeeId') as string
  const password = formData.get('password') as string

  const user = await prisma.user.findUnique({ where: { employeeId } })
  if (!user) return { error: "ไม่พบรหัสพนักงานนี้ในระบบ" }

  const isPasswordValid = await bcrypt.compare(password, user.password)
  if (!isPasswordValid) return { error: "รหัสผ่านไม่ถูกต้อง" }

  ;(await cookies()).set('session_userid', user.employeeId, { 
    httpOnly: true, secure: true, maxAge: 60 * 60 * 24 
  })

  // 👈 เช็คสถานะการเข้าสู่ระบบครั้งแรก
  if (user.isFirstLogin) {
    redirect('/change-password')
  }

  redirect('/')
}

// ฟังก์ชันใหม่: สำหรับบันทึกรหัสผ่านใหม่
export async function changePasswordAction(formData: FormData) {
  const newPassword = formData.get('newPassword') as string
  const confirmPassword = formData.get('confirmPassword') as string
  
  if (newPassword !== confirmPassword) {
    return { error: "รหัสผ่านและการยืนยันรหัสผ่านไม่ตรงกัน" }
  }

  if (newPassword.length < 6) {
    return { error: "รหัสผ่านต้องมีความยาวอย่างน้อย 6 ตัวอักษร" }
  }

  const empId = (await cookies()).get('session_userid')?.value
  if (!empId) return { error: "Session หมดอายุ กรุณาล็อกอินใหม่" }

  // เข้ารหัสรหัสผ่านใหม่และอัปเดตสถานะ isFirstLogin เป็น false
  const hashedPassword = await bcrypt.hash(newPassword, 10)
  
  await prisma.user.update({
    where: { employeeId: empId },
    data: { 
      password: hashedPassword,
      isFirstLogin: false 
    }
  })

  redirect('/')
}

export async function logoutAction() {
  (await cookies()).delete('session_userid')
  redirect('/login')
}