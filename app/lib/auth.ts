import { cookies } from 'next/headers'
import prisma from '@/app/lib/prisma'
import { redirect } from 'next/navigation'

export async function getCurrentUser() {
  const empId = (await cookies()).get('session_userid')?.value
  if (!empId) return null
  return await prisma.user.findUnique({
    where: { employeeId: empId },
    select: {
      employeeId: true,
      name: true,
      role: true,
      isFirstLogin: true,
    }
  })
}

export async function requireAuth() {
  const user = await getCurrentUser()
  if (!user) {
    redirect('/login')
  }
  if (user.isFirstLogin) {
    redirect('/change-password')
  }
  return user
}

export async function requireAdmin() {
  const user = await requireAuth()
  if (user.role !== 'ADMIN') {
    redirect('/')
  }
  return user
}