"use server"

import prisma from '@/app/lib/prisma'
import { revalidatePath } from 'next/cache'
import { requireAuth, requireAdmin } from '@/app/lib/auth'

export interface CreateWorksheetInput {
  doc_types: string[]
  customer_name: string
  address?: string
  province?: string
  installation_spot?: string
  service_date: string // YYYY-MM-DD
  start_time: string // HH:mm
  end_time: string // HH:mm
  product_type: string
  brand: string
  model: string
  serial_no?: string
  warranty_status: string
  symptom?: string
  work_details: string
  remarks?: string
  job_status: string[]
  technician_name: string
  contact_person?: string
  contact_position?: string
  contact_phone?: string
  signature_data?: string
}

export async function createWorksheet(data: CreateWorksheetInput) {
  try {
    await requireAuth()

    if (!data.customer_name || !data.product_type || !data.brand || !data.model || !data.work_details || !data.technician_name) {
      return { success: false, error: 'กรุณากรอกข้อมูลสำคัญให้ครบถ้วน (ชื่อลูกค้า, ประเภทสินค้า, ยี่ห้อ, รุ่น, รายละเอียดงาน, ช่างผู้ดำเนินการ)' }
    }

    // Generator Worksheet Number: WS-YYYYMMDD-XXXX
    const now = new Date()
    const year = now.getFullYear()
    const month = String(now.getMonth() + 1).padStart(2, '0')
    const day = String(now.getDate()).padStart(2, '0')
    const datePrefix = `WS-${year}${month}${day}`

    // Count today's worksheets for sequential numbering
    const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate())
    const countToday = await prisma.worksheet.count({
      where: { createdAt: { gte: startOfToday } }
    })
    const sequentialNum = String(countToday + 1).padStart(4, '0')
    const worksheet_no = `${datePrefix}-${sequentialNum}`

    const worksheet = await prisma.worksheet.create({
      data: {
        worksheet_no,
        doc_types: data.doc_types || [],
        customer_name: data.customer_name,
        address: data.address || '',
        province: data.province || '',
        installation_spot: data.installation_spot || '',
        service_date: new Date(data.service_date),
        start_time: data.start_time || '',
        end_time: data.end_time || '',
        product_type: data.product_type,
        brand: data.brand,
        model: data.model,
        serial_no: data.serial_no || '',
        warranty_status: data.warranty_status || 'อยู่ในประกัน',
        symptom: data.symptom || '',
        work_details: data.work_details,
        remarks: data.remarks || '',
        job_status: data.job_status || [],
        technician_name: data.technician_name,
        contact_person: data.contact_person || '',
        contact_position: data.contact_position || '',
        contact_phone: data.contact_phone || '',
        signature_data: data.signature_data || '',
      }
    })

    revalidatePath('/worksheet')
    return { success: true, worksheet_no: worksheet.worksheet_no, id: worksheet.id }
  } catch (err: unknown) {
    console.error('Create worksheet error:', err)
    const error = err as Error
    return { success: false, error: error.message || 'เกิดข้อผิดพลาดในการบันทึกใบงาน Worksheet' }
  }
}

export async function getWorksheets(searchQuery = '') {
  await requireAuth()

  const whereCondition: Record<string, unknown> = {}

  if (searchQuery.trim()) {
    const q = searchQuery.trim()
    whereCondition.OR = [
      { worksheet_no: { contains: q, mode: 'insensitive' } },
      { customer_name: { contains: q, mode: 'insensitive' } },
      { serial_no: { contains: q, mode: 'insensitive' } },
      { brand: { contains: q, mode: 'insensitive' } },
      { model: { contains: q, mode: 'insensitive' } },
      { technician_name: { contains: q, mode: 'insensitive' } },
    ]
  }

  return await prisma.worksheet.findMany({
    where: whereCondition,
    orderBy: { createdAt: 'desc' }
  })
}

export async function getWorksheetById(id: string) {
  await requireAuth()
  return await prisma.worksheet.findUnique({
    where: { id }
  })
}

export async function deleteWorksheet(id: string) {
  try {
    await requireAdmin()

    await prisma.worksheet.delete({
      where: { id }
    })

    revalidatePath('/worksheet')
    revalidatePath('/histories')
    return { success: true }
  } catch (err: unknown) {
    console.error('Delete worksheet error:', err)
    const error = err as Error
    return { success: false, error: error.message || 'เกิดข้อผิดพลาดในการลบใบงาน' }
  }
}
