"use server"

import prisma from '@/app/lib/prisma'
import { revalidatePath } from 'next/cache'
import { requireAuth } from '@/app/lib/auth'

// --- CRUD: Company ---
export async function createCompany(name: string, brands: string[] = []) {
  await requireAuth()
  if (!name.trim()) return { success: false, error: 'กรุณาระบุชื่อบริษัท' }

  try {
    await prisma.company.create({
      data: {
        name: name.trim(),
        brands: brands
      }
    })
    revalidatePath('/settings')
    revalidatePath('/master')
    revalidatePath('/')
    return { success: true }
  } catch {
    return { success: false, error: 'ชื่อบริษัทนี้มีอยู่ในระบบแล้ว' }
  }
}

export async function updateCompany(id: number, name: string, brands: string[] = []) {
  await requireAuth()
  if (!name.trim()) return { success: false, error: 'กรุณาระบุชื่อบริษัท' }

  try {
    await prisma.company.update({
      where: { id },
      data: {
        name: name.trim(),
        brands: brands
      }
    })
    revalidatePath('/settings')
    revalidatePath('/master')
    revalidatePath('/')
    return { success: true }
  } catch {
    return { success: false, error: 'ชื่อบริษัทนี้มีอยู่ในระบบแล้ว หรือเกิดข้อผิดพลาด' }
  }
}

export async function deleteCompany(id: number) {
  await requireAuth()
  try {
    await prisma.company.delete({ where: { id } })
    revalidatePath('/settings')
    revalidatePath('/master')
    revalidatePath('/')
    return { success: true }
  } catch {
    return { success: false, error: 'เกิดข้อผิดพลาดในการลบข้อมูลบริษัท' }
  }
}

// --- CRUD: Contact ---
export async function createContact(companyId: number, name: string, phone: string) {
  await requireAuth()
  if (!companyId || !name.trim() || !phone.trim()) {
    return { success: false, error: 'กรุณากรอกข้อมูลให้ครบถ้วน' }
  }

  try {
    await prisma.contact.create({ data: { companyId, name: name.trim(), phone: phone.trim() } })
    revalidatePath('/settings')
    revalidatePath('/master')
    revalidatePath('/')
    return { success: true }
  } catch {
    return { success: false, error: 'เกิดข้อผิดพลาดในการเพิ่มผู้ติดต่อ' }
  }
}

export async function updateContact(id: number, name: string, phone: string) {
  await requireAuth()
  if (!id || !name.trim() || !phone.trim()) {
    return { success: false, error: 'กรุณากรอกข้อมูลให้ครบถ้วน' }
  }

  try {
    await prisma.contact.update({
      where: { id },
      data: { name: name.trim(), phone: phone.trim() }
    })
    revalidatePath('/settings')
    revalidatePath('/master')
    revalidatePath('/')
    return { success: true }
  } catch {
    return { success: false, error: 'เกิดข้อผิดพลาดในการแก้ไขข้อมูลผู้ติดต่อ' }
  }
}

export async function deleteContact(id: number) {
  await requireAuth()
  try {
    await prisma.contact.delete({ where: { id } })
    revalidatePath('/settings')
    revalidatePath('/master')
    revalidatePath('/')
    return { success: true }
  } catch {
    return { success: false, error: 'เกิดข้อผิดพลาดในการลบผู้ติดต่อ' }
  }
}

// --- CRUD: Product ---
export async function createProduct(brand: string, model: string) {
  await requireAuth()
  if (!brand.trim() || !model.trim()) {
    return { success: false, error: 'กรุณาระบุยี่ห้อและรุ่นของอุปกรณ์' }
  }

  try {
    await prisma.product.create({ data: { brand: brand.trim(), model: model.trim() } })
    revalidatePath('/settings')
    revalidatePath('/master')
    revalidatePath('/')
    return { success: true }
  } catch {
    return { success: false, error: 'เกิดข้อผิดพลาดในการเพิ่มอุปกรณ์' }
  }
}

export async function updateProduct(id: number, brand: string, model: string) {
  await requireAuth()
  if (!brand.trim() || !model.trim()) {
    return { success: false, error: 'กรุณาระบุยี่ห้อและรุ่นของอุปกรณ์' }
  }

  try {
    await prisma.product.update({
      where: { id },
      data: { brand: brand.trim(), model: model.trim() }
    })
    revalidatePath('/settings')
    revalidatePath('/master')
    revalidatePath('/')
    return { success: true }
  } catch {
    return { success: false, error: 'เกิดข้อผิดพลาดในการแก้ไขข้อมูลอุปกรณ์' }
  }
}

export async function updateBrand(oldBrand: string, newBrand: string) {
  await requireAuth()
  if (!oldBrand.trim() || !newBrand.trim()) {
    return { success: false, error: 'กรุณาระบุชื่อแบรนด์ใหม่' }
  }

  try {
    await prisma.product.updateMany({
      where: { brand: oldBrand.trim() },
      data: { brand: newBrand.trim() }
    })
    revalidatePath('/settings')
    revalidatePath('/master')
    revalidatePath('/')
    return { success: true }
  } catch {
    return { success: false, error: 'เกิดข้อผิดพลาดในการเปลี่ยนชื่อแบรนด์' }
  }
}

export async function deleteProduct(id: number) {
  await requireAuth()
  try {
    await prisma.product.delete({ where: { id } })
    revalidatePath('/settings')
    revalidatePath('/master')
    revalidatePath('/')
    return { success: true }
  } catch {
    return { success: false, error: 'เกิดข้อผิดพลาดในการลบอุปกรณ์' }
  }
}

export async function seedPresetProducts() {
  await requireAuth()

  const BRAND_MODELS_PRESETS: Record<string, string[]> = {
    'Godex': ['RT863i', 'G500', 'EZ120', 'HD830i', 'DT4x', 'ZX420i', 'RT700i', 'BP500L'],
    'Zebra': ['ZT411', 'ZT230', 'ZD220', 'ZD420', 'GK420t', 'ZT421', 'ZQ521', 'ZT610'],
    'Honeywell': ['PC42t', 'PM42', 'PX4i', 'CW45', 'Intermec PD43', 'EDA51'],
    'TSC': ['TTP-244 Pro', 'TA210', 'TE200', 'MB240T', 'MH241', 'TDP-225'],
    'Sato': ['CL4NX Plus', 'PW208NX', 'FX3-LX', 'CG408', 'WS408'],
    'Bixolon': ['SLP-TX400', 'SRP-350III', 'SPP-R200III', 'XD5-40t'],
    'Epson': ['TM-T82III', 'TM-U220B', 'TM-T88VI', 'LQ-310', 'L3250'],
    'HPRT': ['TP808', 'HT300', 'LPQ58', 'POS80'],
    'Datalogic': ['QuickScan QW2100', 'Gryphon GD4500', 'Powerscan PD9530'],
    'Fujitsu': ['fi-7160', 'fi-8170', 'fi-7260']
  }

  try {
    const existingProducts = await prisma.product.findMany()
    const existingSet = new Set(existingProducts.map(p => `${p.brand}__${p.model}`))

    const toCreate: Array<{ brand: string; model: string }> = []

    Object.entries(BRAND_MODELS_PRESETS).forEach(([brand, models]) => {
      models.forEach(model => {
        const key = `${brand}__${model}`
        if (!existingSet.has(key)) {
          toCreate.push({ brand, model })
        }
      })
    })

    if (toCreate.length > 0) {
      await prisma.product.createMany({
        data: toCreate
      })
    }

    revalidatePath('/settings')
    revalidatePath('/generator')
    revalidatePath('/worksheet')
    revalidatePath('/')
    return { success: true, insertedCount: toCreate.length }
  } catch (err: unknown) {
    const error = err as Error
    return { success: false, error: error.message || 'เกิดข้อผิดพลาดในการนำเข้าข้อมูลยี่ห้อและรุ่น' }
  }
}