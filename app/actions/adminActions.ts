"use server"

import prisma from '@/app/lib/prisma'
import bcrypt from 'bcryptjs'
import { requireAdmin } from '@/app/lib/auth'
import { revalidatePath } from 'next/cache'

function generateRandomPassword(length = 8) {
  const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
  let password = ''
  for (let i = 0; i < length; i++) {
    password += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return password
}

export async function addEmployeeAction(formData: FormData) {
  try {
    await requireAdmin()

    const employeeId = (formData.get('employeeId') as string)?.trim()
    const name = (formData.get('name') as string)?.trim()
    const role = (formData.get('role') as string) || 'STAFF'

    if (!employeeId || !name) {
      return { error: "กรุณากรอกข้อมูลให้ครบถ้วน" }
    }

    const existingUser = await prisma.user.findUnique({ where: { employeeId } })
    if (existingUser) {
      return { error: "รหัสพนักงานนี้ถูกใช้งานแล้วในระบบ" }
    }

    const rawPassword = generateRandomPassword()
    const hashedPassword = await bcrypt.hash(rawPassword, 10)

    await prisma.user.create({
      data: {
        employeeId,
        name,
        password: hashedPassword,
        isFirstLogin: true,
        role: role === 'ADMIN' ? 'ADMIN' : 'STAFF'
      }
    })

    revalidatePath('/admin/add-user')
    return { success: true, employeeId, name, rawPassword }

  } catch (error: unknown) {
    console.error("Add Employee Error:", error)
    const err = error as Error
    return { error: err.message || "เกิดข้อผิดพลาดในการบันทึกข้อมูล" }
  }
}

export async function resetUserPassword(employeeId: string) {
  try {
    await requireAdmin()

    const user = await prisma.user.findUnique({ where: { employeeId } })
    if (!user) return { success: false, error: 'ไม่พบผู้ใช้นี้ในระบบ' }

    const rawPassword = generateRandomPassword()
    const hashedPassword = await bcrypt.hash(rawPassword, 10)

    await prisma.user.update({
      where: { employeeId },
      data: {
        password: hashedPassword,
        isFirstLogin: true
      }
    })

    revalidatePath('/admin/add-user')
    return { success: true, rawPassword }
  } catch (error: unknown) {
    const err = error as Error
    return { success: false, error: err.message || 'เกิดข้อผิดพลาดในการรีเซ็ตรหัสผ่าน' }
  }
}

export async function deleteUser(employeeId: string) {
  try {
    const currentUser = await requireAdmin()

    if (currentUser.employeeId === employeeId) {
      return { success: false, error: 'ไม่สามารถลบบัญชีของตัวเองได้' }
    }

    await prisma.user.delete({ where: { employeeId } })
    revalidatePath('/admin/add-user')
    return { success: true }
  } catch (error: unknown) {
    const err = error as Error
    return { success: false, error: err.message || 'เกิดข้อผิดพลาดในการลบผู้ใช้งาน' }
  }
}