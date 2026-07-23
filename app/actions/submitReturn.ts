"use server"

import prisma from '@/app/lib/prisma'
import { generatePdfBuffer } from '@/app/lib/pdfGenerator'
import { revalidatePath } from 'next/cache'
import { requireAuth } from '@/app/lib/auth'
import { uploadAttachment, sendReturnTicketEmail } from '@/app/lib/tbsEmail'
import { getEmailConfig } from '@/app/actions/emailConfigActions'

export async function submitReturnTicket(formData: FormData) {
  try {
    const user = await requireAuth()

    const receiveDateStr = formData.get('receive_date') as string
    const companyId = Number(formData.get('companyId'))
    const contactId = Number(formData.get('contactId'))
    const productId = Number(formData.get('productId'))
    const serialNo = (formData.get('serial_no') as string) || ''
    const problemSymptom = (formData.get('problem_symptom') as string) || ''
    const includedAccessories = (formData.get('included_accessories') as string) || ''
    const remark = (formData.get('remark') as string) || ''
    const coStaffNames = (formData.get('co_staff_names') as string) || ''
    const recipientEmail = (formData.get('recipient_email') as string) || ''

    // Load email config from DB (with env fallback)
    const emailConfig = await getEmailConfig()
    const effectiveRecipient = recipientEmail || emailConfig.defaultRecipientEmail

    if (!receiveDateStr || !companyId || !contactId || !productId) {
      return { success: false, error: "กรุณากรอกข้อมูลสำคัญให้ครบถ้วน" }
    }

    const [company, contact, product, primaryStaff] = await Promise.all([
      prisma.company.findUnique({ where: { id: companyId } }),
      prisma.contact.findUnique({ where: { id: contactId } }),
      prisma.product.findUnique({ where: { id: productId } }),
      prisma.user.findUnique({ where: { employeeId: user.employeeId } })
    ])

    if (!company) return { success: false, error: `ไม่พบบริษัท (ID: ${companyId})` }
    if (!contact) return { success: false, error: `ไม่พบชื่อผู้ติดต่อ (ID: ${contactId})` }
    if (!product) return { success: false, error: `ไม่พบรุ่นอุปกรณ์ (ID: ${productId})` }
    if (!primaryStaff) return { success: false, error: `ไม่พบรหัสพนักงาน (${user.employeeId})` }

    // Collision-Safe Ticket No Generator: RET-YYYYMMDD-XXXX
    const now = new Date()
    const year = now.getFullYear()
    const month = String(now.getMonth() + 1).padStart(2, '0')
    const day = String(now.getDate()).padStart(2, '0')
    const datePrefix = `RET-${year}${month}${day}-`

    const todayCount = await prisma.returnTicket.count({
      where: {
        ticket_no: {
          startsWith: datePrefix
        }
      }
    })
    const seq = String(todayCount + 1).padStart(4, '0')
    const ticketNo = `${datePrefix}${seq}`

    // Dynamic On-Demand PDF path: ไม่ต้องเก็บไฟล์ PDF ลงฐานข้อมูลหรือ Storage (ประหยัดพื้นที่ Free Tier 100%)
    const filePath = `/api/tickets/${ticketNo}/pdf`

    // บันทึกลงฐานข้อมูล Prisma
    await prisma.returnTicket.create({
      data: {
        ticket_no: ticketNo,
        receive_date: new Date(receiveDateStr),
        status: "รอเปิดงานซ่อม",
        primaryStaffId: user.employeeId,
        co_staff_names: coStaffNames,
        companyId,
        contactId,
        productId,
        serial_no: serialNo,
        problem_symptom: problemSymptom,
        included_accessories: includedAccessories,
        remark: remark,
        file_path: filePath
      }
    })

    // ส่งอีเมลถ้ามีการระบุหรือมี default recipient
    let emailWarning = ''
    if (effectiveRecipient) {
      try {
        const pdfBuffer = await generatePdfBuffer({
          receiveDate: new Date(receiveDateStr).toLocaleDateString('th-TH'),
          statusDate: new Date().toLocaleDateString('th-TH'),
          companyName: company.branch && company.branch !== 'สำนักงานใหญ่' ? `${company.name} (${company.branch})` : company.name,
          contactName: `${contact.name} (${contact.phone})`,
          productName: `${product.brand} - ${product.model}`,
          serialNo,
          problemSymptom,
          includedAccessories,
          remark,
          staffName: primaryStaff.name,
          coStaffNames: coStaffNames
        })
        const attachmentUuid = await uploadAttachment(Buffer.from(pdfBuffer), `${ticketNo}.pdf`)
        await sendReturnTicketEmail(
          effectiveRecipient,
          `ใบแจ้งเปิดงานซ่อม ${ticketNo} - ${company.branch && company.branch !== 'สำนักงานใหญ่' ? `${company.name} (${company.branch})` : company.name}`,
          attachmentUuid,
          {
            DATE: new Date(receiveDateStr).toLocaleDateString('th-TH'),
            COMPANY_NAME: company.branch && company.branch !== 'สำนักงานใหญ่' ? `${company.name} (${company.branch})` : company.name,
            CONTACT_INFO: `${contact.name} (${contact.phone})`,
            PRODUCT: `${product.brand} - ${product.model} (S/N: ${serialNo || '-'})`,
            SYMPTOM: problemSymptom || "-",
            OTHER: includedAccessories || "-",
            STATUS: "รอเปิดงานซ่อม"
          },
          { fromEmail: emailConfig.fromEmail, fromName: emailConfig.fromName }
        )
      } catch (emailError: unknown) {
        console.error("Failed to send email:", emailError)
        const err = emailError as Error
        emailWarning = ` (ระบบส่งอีเมลไม่สำเร็จ: ${err.message})`
      }
    } else {
      emailWarning = ` (ไม่ได้ส่งอีเมลเนื่องจากไม่มีการระบุอีเมลผู้รับและยังไม่ได้ตั้งค่าอีเมลเริ่มต้นในระบบ)`
    }

    revalidatePath('/')
    revalidatePath('/histories')
    
    return { success: true, url: filePath, ticketNo, warning: emailWarning }

  } catch (error: unknown) {
    console.error("Submit Return Error:", error)
    const err = error as Error
    return { success: false, error: err.message || 'เกิดข้อผิดพลาดในระบบเซิร์ฟเวอร์' }
  }
}

export async function previewReturnTicket(formData: FormData) {
  try {
    const user = await requireAuth()

    const receiveDateStr = formData.get('receive_date') as string
    const companyId = Number(formData.get('companyId'))
    const contactId = Number(formData.get('contactId'))
    const productId = Number(formData.get('productId'))
    const serialNo = (formData.get('serial_no') as string) || ''
    const problemSymptom = (formData.get('problem_symptom') as string) || ''
    const includedAccessories = (formData.get('included_accessories') as string) || ''
    const remark = (formData.get('remark') as string) || ''
    const coStaffNames = (formData.get('co_staff_names') as string) || ''

    if (!companyId || !contactId || !productId) {
      return { success: false, error: "กรุณาเลือก บริษัท, ผู้ติดต่อ และ รุ่นอุปกรณ์ เพื่อดูพรีวิว" }
    }

    const [company, contact, product, primaryStaff] = await Promise.all([
      prisma.company.findUnique({ where: { id: companyId } }),
      prisma.contact.findUnique({ where: { id: contactId } }),
      prisma.product.findUnique({ where: { id: productId } }),
      prisma.user.findUnique({ where: { employeeId: user.employeeId } })
    ])

    if (!company) return { success: false, error: `ไม่พบบริษัท` }
    if (!contact) return { success: false, error: `ไม่พบผู้ติดต่อ` }
    if (!product) return { success: false, error: `ไม่พบรุ่นอุปกรณ์` }

    const pdfBuffer = await generatePdfBuffer({
      receiveDate: receiveDateStr ? new Date(receiveDateStr).toLocaleDateString('th-TH') : new Date().toLocaleDateString('th-TH'),
      statusDate: new Date().toLocaleDateString('th-TH'),
      companyName: company.branch && company.branch !== 'สำนักงานใหญ่' ? `${company.name} (${company.branch})` : company.name,
      contactName: `${contact.name} (${contact.phone})`,
      productName: `${product.brand} - ${product.model}`,
      serialNo,
      problemSymptom,
      includedAccessories,
      remark,
      staffName: primaryStaff?.name || user.name,
      coStaffNames: coStaffNames
    })

    const base64 = Buffer.from(pdfBuffer).toString('base64')
    const dataUrl = `data:application/pdf;base64,${base64}`

    return { success: true, url: dataUrl }
  } catch (error: unknown) {
    console.error("Preview Return Error:", error)
    const err = error as Error
    return { success: false, error: err.message || 'เกิดข้อผิดพลาดในการสร้างพรีวิว' }
  }
}