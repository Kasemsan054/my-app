"use server"

import prisma from '@/app/lib/prisma'
import { requireAdmin } from '@/app/lib/auth'

const EMAIL_CONFIG_KEY = 'email_config'

export interface EmailConfig {
  fromEmail: string
  fromName: string
  defaultRecipientEmail: string
}

/** Read email config from DB, fallback to .env values */
export async function getEmailConfig(): Promise<EmailConfig> {
  try {
    const setting = await prisma.systemSetting.findUnique({
      where: { key: EMAIL_CONFIG_KEY }
    })
    if (setting?.value) {
      const parsed = JSON.parse(setting.value) as Partial<EmailConfig>
      return {
        fromEmail: parsed.fromEmail || process.env.TBS_MAIL_FROM_EMAIL || '',
        fromName: parsed.fromName || process.env.TBS_MAIL_FROM_NAME || 'Service',
        defaultRecipientEmail: parsed.defaultRecipientEmail || process.env.TBS_DEFAULT_RECIPIENT_EMAIL || '',
      }
    }
  } catch (e) {
    console.warn('getEmailConfig: DB read failed, using env fallback', e)
  }

  // Fallback to .env
  return {
    fromEmail: process.env.TBS_MAIL_FROM_EMAIL || '',
    fromName: process.env.TBS_MAIL_FROM_NAME || 'Service',
    defaultRecipientEmail: process.env.TBS_DEFAULT_RECIPIENT_EMAIL || '',
  }
}

/** Save email config to DB — ADMIN only */
export async function saveEmailConfig(data: EmailConfig): Promise<{ success: boolean; error?: string }> {
  try {
    await requireAdmin()

    if (!data.fromEmail || !data.fromEmail.includes('@')) {
      return { success: false, error: 'กรุณากรอกอีเมลผู้ส่งให้ถูกต้อง' }
    }

    await prisma.systemSetting.upsert({
      where: { key: EMAIL_CONFIG_KEY },
      update: {
        value: JSON.stringify(data),
      },
      create: {
        key: EMAIL_CONFIG_KEY,
        value: JSON.stringify(data),
      },
    })

    return { success: true }
  } catch (e) {
    const err = e as Error
    console.error('saveEmailConfig error:', err)
    return { success: false, error: err.message || 'เกิดข้อผิดพลาดในการบันทึก' }
  }
}
