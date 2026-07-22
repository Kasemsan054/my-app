import { PDFDocument } from 'pdf-lib'
import fontkit from '@pdf-lib/fontkit'
import fs from 'fs/promises'
import path from 'path'

export interface PdfData {
  receiveDate: string
  statusDate: string
  companyName: string
  contactName: string
  productName: string
  serialNo: string
  problemSymptom: string
  includedAccessories?: string
  remark: string
  staffName: string
  coStaffNames?: string
}

export async function generatePdfBuffer(data: PdfData): Promise<Uint8Array> {
  const templatePath = path.join(process.cwd(), 'public', 'templates', 'template.pdf')
  const pdfBytes = await fs.readFile(templatePath)
  const pdfDoc = await PDFDocument.load(pdfBytes)

  // โหลดฟอนต์ภาษาไทย
  pdfDoc.registerFontkit(fontkit)
  const fontPath = path.join(process.cwd(), 'public', 'fonts', 'THSarabunNew Bold.ttf')
  const fontBytes = await fs.readFile(fontPath)
  const thaiFont = await pdfDoc.embedFont(fontBytes)

  const form = pdfDoc.getForm()

  const fillText = (fieldName: string, text: string) => {
    try {
      const field = form.getTextField(fieldName)
      if (field) {
        field.setText(text)
        field.updateAppearances(thaiFont)
      }
    } catch {
      console.warn(`[Warning] ข้ามช่อง Text "${fieldName}"`)
    }
  }

  const checkBox = (fieldName: string) => {
    try {
      const field = form.getCheckBox(fieldName)
      if (field) field.check()
    } catch {
      console.warn(`[Warning] ข้ามช่อง Checkbox "${fieldName}"`)
    }
  }

  const formatStatusDate = (dateString: string) => {
    if (!dateString) return ""
    let day, month, year

    if (dateString.includes("-")) {
      [year, month, day] = dateString.split("-")
    } else if (dateString.includes("/")) {
      [day, month, year] = dateString.split("/")
    } else {
      return dateString
    }

    return `${day}         ${month}         ${year}`
  }

  const finalStaffText = data.coStaffNames 
    ? `${data.staffName}, ${data.coStaffNames}` 
    : data.staffName

  const [brand, ...modelParts] = data.productName.split(' - ')
  const model = modelParts.join(' - ') || '-'

  fillText('return_date', data.receiveDate)
  fillText('customer_name', data.companyName)
  fillText('contact_info', data.contactName)
  fillText('brand', brand)
  fillText('model', model)
  fillText('serial_no', data.serialNo || '-')
  fillText('problem_symptom', data.problemSymptom || '-')
  fillText('included_accessories', data.includedAccessories || '-')
  fillText('receiver_name', finalStaffText)
  fillText('remark', data.remark || '-')

  checkBox('chk_wait_repair')
  fillText('date_wait_repair', formatStatusDate(data.statusDate))

  return await pdfDoc.save()
}