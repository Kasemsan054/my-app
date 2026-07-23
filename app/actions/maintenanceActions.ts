'use server'

import prisma from '@/app/lib/prisma'
import { revalidatePath } from 'next/cache'

export async function getMaintenanceSettings() {
  try {
    const setting = await prisma.systemSetting.findUnique({
      where: { key: 'maintenance_paths' }
    })
    
    if (setting && setting.value) {
      return JSON.parse(setting.value) as string[]
    }
    return []
  } catch (error) {
    console.error('Error fetching maintenance settings:', error)
    return []
  }
}

export async function updateMaintenanceSettings(paths: string[]) {
  try {
    await prisma.systemSetting.upsert({
      where: { key: 'maintenance_paths' },
      update: { value: JSON.stringify(paths) },
      create: { key: 'maintenance_paths', value: JSON.stringify(paths) }
    })
    
    // Revalidate paths so the layout checks take effect immediately
    revalidatePath('/', 'layout')
    
    return { success: true }
  } catch (error) {
    console.error('Error updating maintenance settings:', error)
    return { success: false, error: 'Failed to update settings' }
  }
}
