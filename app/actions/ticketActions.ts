"use server"

import prisma from '@/app/lib/prisma'
import type { Prisma } from '@prisma/client'
import { revalidatePath } from 'next/cache'
import { requireAuth, requireAdmin } from '@/app/lib/auth'

export async function getTickets(searchQuery = '', statusFilter = '') {
  await requireAuth()

  const whereCondition: Prisma.ReturnTicketWhereInput = {}

  if (statusFilter && statusFilter !== 'ALL') {
    whereCondition.status = statusFilter
  }

  if (searchQuery.trim()) {
    const q = searchQuery.trim()
    whereCondition.OR = [
      { ticket_no: { contains: q, mode: 'insensitive' } },
      { serial_no: { contains: q, mode: 'insensitive' } },
      { company: { name: { contains: q, mode: 'insensitive' } } },
      { contact: { name: { contains: q, mode: 'insensitive' } } },
      { contact: { phone: { contains: q, mode: 'insensitive' } } },
    ]
  }

  return await prisma.returnTicket.findMany({
    where: whereCondition,
    include: {
      company: true,
      contact: true,
      product: true,
      primaryStaff: {
        select: { name: true, employeeId: true }
      }
    },
    orderBy: { createdAt: 'desc' }
  })
}

export async function updateTicketStatus(ticketId: string, newStatus: string) {
  try {
    await requireAuth()

    if (!ticketId || !newStatus) {
      return { success: false, error: 'ข้อมูลไม่ครบถ้วน' }
    }

    await prisma.returnTicket.update({
      where: { id: ticketId },
      data: {
        status: newStatus,
        status_date: new Date()
      }
    })

    revalidatePath('/histories')
    revalidatePath('/')
    return { success: true }
  } catch (err: unknown) {
    console.error('Update status error:', err)
    const error = err as Error
    return { success: false, error: error.message || 'เกิดข้อผิดพลาดในการอัปเดตสถานะ' }
  }
}

export async function deleteTicket(ticketId: string) {
  try {
    await requireAdmin()

    await prisma.returnTicket.delete({
      where: { id: ticketId }
    })

    revalidatePath('/histories')
    revalidatePath('/')
    return { success: true }
  } catch (err: unknown) {
    console.error('Delete ticket error:', err)
    const error = err as Error
    return { success: false, error: error.message || 'เกิดข้อผิดพลาดในการลบใบแจ้งงานซ่อม' }
  }
}
