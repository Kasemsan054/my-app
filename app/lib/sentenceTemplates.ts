export interface DeviceItem {
  serialNo: string
  symptom?: string
  resolution?: string
  mileage?: string
  isMileageUnknown?: boolean
  oldSerial?: string
  newSerial?: string
}

export interface SentenceData {
  deviceType: string
  brand: string
  model: string
  quantity?: number
  serialNo: string
  symptom: string
  resolution: string
  mileage?: string
  isMileageUnknown?: boolean
  oldSerial?: string
  newSerial?: string
  replacedPartName?: string
  testResult?: string
  firmwareOld?: string
  firmwareNew?: string
  customNotes?: string

  // Multi-device listing array
  devices?: DeviceItem[]

  // Contact info
  contactName?: string
  contactPosition?: string
  contactPhone?: string
}

export type TemplateId = 'multi_device' | 'printhead' | 'part_replacement' | 'maintenance' | 'firmware' | 'custom'

export interface SentenceTemplate {
  id: TemplateId
  name: string
  description: string
  badge: string
}

export const TEMPLATES: SentenceTemplate[] = [
  {
    id: 'multi_device',
    name: 'เข้าตรวจสอบหลายเครื่อง (Multi-Device)',
    description: 'สำหรับงานเข้าตรวจสอบอุปกรณ์หลายเครื่อง พร้อมระบุ S/N, อาการเสียของแต่ละเครื่อง และข้อมูลผู้ติดต่อ',
    badge: 'หลายเครื่อง'
  },
  {
    id: 'printhead',
    name: 'ตรวจเช็ค & เปลี่ยนหัวพิมพ์',
    description: 'เหมาะสำหรับงานซ่อม/เปลี่ยนหัวพิมพ์ Barcode Printer (รองรับระยะ M. หรือไม่สามารถดูระยะได้ และ S/N)',
    badge: 'หัวพิมพ์ (Printhead)'
  },
  {
    id: 'part_replacement',
    name: 'ตรวจเช็ค & เปลี่ยนอะไหล่ทั่วไป',
    description: 'สำหรับเปลี่ยนชิ้นส่วนอุปกรณ์ (Mainboard, Roller, Belt, Sensor, Power Supply ฯลฯ)',
    badge: 'เปลี่ยนอะไหล่'
  },
  {
    id: 'maintenance',
    name: 'ตรวจเช็ค & บำรุงรักษา (PM)',
    description: 'สำหรับงานทำความสะอาด ปรับตั้งค่า คาลิเบรต และทดสอบระบบการทำงานทั่วไป',
    badge: 'บำรุงรักษา (PM)'
  },
  {
    id: 'firmware',
    name: 'อัปเดตเฟิร์มแวร์ & คาลิเบรต',
    description: 'สำหรับอัปเกรด Firmware, Calibrate เซ็นเซอร์ และ Re-config ระบบ',
    badge: 'Firmware'
  },
  {
    id: 'custom',
    name: 'แบบกำหนดเองอิสระ',
    description: 'หน้าเปล่าสำหรับพิมพ์และเรียบเรียงข้อความอิสระด้วยตนเอง',
    badge: 'พิมพ์อิสระ'
  }
]

export const PRODUCT_TYPES_LIST = [
  'Barcode Printer',
  'Scale',
  'POS Terminal',
  'Printer TM Epson',
  'CashDrawer',
  'Scanner',
  'Touch Monitor',
  'Card Printer',
  'Mobile Computer',
  'Finger Scan',
  'Solution RIM',
  'Solution Healthcare',
  'Laser Printer',
  'Ink Jet Printer',
  'Software',
  'Accessories',
  'Sticker/Ribbon',
  'Server',
  'Network',
  'Smart Card Reader',
  'Dot Matrix',
  'Tablet',
  'Mobile Printer',
  'Solution RMS',
  'Computer',
  'UPS',
  'Hardware',
  'OS',
  'RFID',
  'Ribbon',
  'Printer TP HPRT',
  'Router',
  'Receipt Printer',
  'Adaptor',
  'Code52',
  'QPOS',
  'Other'
]

export const BRAND_MODELS_MAP: Record<string, string[]> = {
  'Godex': ['RT863i', 'G500', 'EZ120', 'HD830i', 'DT4x', 'ZX420i', 'RT700i', 'BP500L'],
  'Zebra': ['ZT411', 'ZT230', 'ZD220', 'ZD420', 'GK420t', 'ZT421', 'ZQ521', 'ZT610'],
  'Honeywell': ['PC42t', 'PM42', 'PX4i', 'CW45', 'Intermec PD43', 'EDA51'],
  'TSC': ['TTP-244 Pro', 'TA210', 'TE200', 'MB240T', 'MH241', 'TDP-225'],
  'Sato': ['CL4NX Plus', 'PW208NX', 'FX3-LX', 'CG408', 'WS408'],
  'Bixolon': ['SLP-TX400', 'SRP-350III', 'SPP-R200III', 'XD5-40t'],
  'Epson': ['TM-T82III', 'TM-U220B', 'TM-T88VI', 'LQ-310', 'L3250'],
  'HPRT': ['TP808', 'HT300', 'LPQ58', 'POS80', 'HT800'],
  'Datalogic': ['QuickScan QW2100', 'Gryphon GD4500', 'Powerscan PD9530'],
  'Fujitsu': ['fi-7160', 'fi-8170', 'fi-7260']
}

export function buildBrandModelsMap(products?: Array<{ brand: string; model: string }>): Record<string, string[]> {
  if (!products || products.length === 0) {
    return BRAND_MODELS_MAP
  }

  const map: Record<string, string[]> = {}

  // 1. Load dynamic products from DB
  products.forEach(p => {
    if (!p.brand) return
    if (!map[p.brand]) {
      map[p.brand] = []
    }
    if (p.model && !map[p.brand].includes(p.model)) {
      map[p.brand].push(p.model)
    }
  })

  // 2. Merge with preset defaults so presets remain available
  Object.keys(BRAND_MODELS_MAP).forEach(b => {
    if (!map[b]) {
      map[b] = BRAND_MODELS_MAP[b]
    } else {
      BRAND_MODELS_MAP[b].forEach(m => {
        if (!map[b].includes(m)) {
          map[b].push(m)
        }
      })
    }
  })

  return map
}

export const BRAND_PRESETS = Object.keys(BRAND_MODELS_MAP)

export const SYMPTOM_PRESETS = [
  'ไฟเข้าบ้าง ไม่เข้าบ้าง',
  'ปรินกระโดดในบางครั้ง',
  'หัวพิมพ์ขาด',
  'หัวพิมพ์เป็นเส้น',
  'พิมพ์ไม่ออก / ตัวหนังสือขาดหาย',
  'ลูกกลิ้ง Roller ชำรุด',
  'สแกน Barcode ไม่ติด',
  'เปิดเครื่องไม่ติด / ไฟไม่เข้า',
  'ริบบอนไม่หมุน / Ribbon Error',
  'เซ็นเซอร์ไม่จับกระดาษ / Paper Out',
  'การเชื่อมต่อหลุดบ่อย / Connection Lost'
]

export const RESOLUTION_PRESETS = [
  'เปลี่ยนหัวพิมพ์ใหม่ และทดสอบการใช้งานตัวเครื่องสามารถใช้งานได้ปกติ',
  'เปลี่ยนอะไหล่ชุดใหม่ และทดสอบการพิมพ์งานจริงผ่านเกณฑ์มาตรฐาน',
  'ทำความสะอาดหัวพิมพ์, ลูกกลิ้ง Roller และปรับตั้งค่า คาลิเบรตเซ็นเซอร์ใหม่',
  'อัปเดตเวอร์ชันเฟิร์มแวร์ล่าสุด และทดสอบการส่งข้อมูลเรียบร้อย',
  'ดำเนินการตรวจเช็คบำรุงรักษา (PM) ทำความสะอาดฝุ่นภายในเครื่องและทดสอบการใช้งาน'
]

export function generateSentence(templateId: TemplateId, data: SentenceData): string {
  if (templateId === 'custom') {
    return data.customNotes || ''
  }

  const deviceHeader = [data.deviceType, data.brand, data.model].filter(Boolean).join(' ')
  
  // Helper to append contact info
  const appendContact = (lines: string[]) => {
    if (data.contactName || data.contactPosition || data.contactPhone) {
      lines.push('')
      lines.push('ข้อมูลผู้ติดต่อ')
      if (data.contactName) lines.push(`ชื่อ: ${data.contactName}`)
      if (data.contactPosition) lines.push(`ตำแหน่ง: ${data.contactPosition}`)
      if (data.contactPhone) lines.push(`โทรฯ: ${data.contactPhone}`)
    }
  }

  const serialLine = data.serialNo ? `S/N: ${data.serialNo}` : ''

  switch (templateId) {
    case 'multi_device': {
      const devicesList = (data.devices && data.devices.length > 0) 
        ? data.devices 
        : [{ serialNo: data.serialNo, symptom: data.symptom, resolution: data.resolution }]

      const lines: string[] = []
      const totalCount = devicesList.length
      lines.push(`ดำเนินการเข้าตรวจสอบเครื่อง ${deviceHeader || '[ประเภท/ยี่ห้อ/รุ่น]'} จำนวน ${totalCount} เครื่อง ได้แก่`)
      lines.push('')

      devicesList.forEach((dev, idx) => {
        lines.push(`${idx + 1}. S/N: ${dev.serialNo || '-'}`)
        if (dev.symptom) {
          lines.push(`   อาการเสีย: ${dev.symptom}`)
        }
        if (dev.resolution) {
          lines.push(`   การแก้ไข: ${dev.resolution}`)
        }
        if (dev.isMileageUnknown) {
          lines.push(`   ระยะหัวพิมพ์: (ไม่สามารถตรวจสอบระยะสะสมได้)`)
        } else if (dev.mileage) {
          lines.push(`   ระยะหัวพิมพ์: ${dev.mileage} M.`)
        }
        if (dev.oldSerial || dev.newSerial) {
          if (dev.oldSerial) lines.push(`   - S/N หัวพิมพ์เก่า: ${dev.oldSerial}`)
          if (dev.newSerial) lines.push(`   - S/N หัวพิมพ์ใหม่: ${dev.newSerial}`)
        }
        if (idx < devicesList.length - 1) {
          lines.push('')
        }
      })

      appendContact(lines)
      return lines.join('\n').trim()
    }

    case 'printhead': {
      const lines: string[] = []
      lines.push(`ดำเนินการเข้าตรวจสอบเครื่อง ${deviceHeader || '[ประเภท/ยี่ห้อ/รุ่น]'}`)
      if (serialLine) lines.push(serialLine)
      if (data.symptom) lines.push(`อาการ: ${data.symptom}`)
      if (data.resolution) lines.push(`การแก้ไข: ${data.resolution}`)
      
      if (data.isMileageUnknown) {
        lines.push(`ระยะหัวพิมพ์: (ไม่สามารถตรวจสอบระยะสะสมได้)`)
      } else if (data.mileage) {
        lines.push(`ระยะหัวพิมพ์: ${data.mileage} M.`)
      }
      
      if (data.oldSerial || data.newSerial) {
        lines.push(`ซีเรียลของหัวพิมพ์:`)
        if (data.oldSerial) lines.push(`- S/N: ${data.oldSerial} (หัวพิมพ์เก่า)`)
        if (data.newSerial) lines.push(`- S/N: ${data.newSerial} (หัวพิมพ์ใหม่)`)
      }

      appendContact(lines)
      return lines.join('\n')
    }

    case 'part_replacement': {
      const lines: string[] = []
      lines.push(`ดำเนินการเข้าตรวจสอบและเปลี่ยนอะไหล่เครื่อง ${deviceHeader || '[ประเภท/ยี่ห้อ/รุ่น]'}`)
      if (serialLine) lines.push(serialLine)
      if (data.symptom) lines.push(`อาการ: ${data.symptom}`)
      if (data.replacedPartName) lines.push(`อะไหล่ที่เปลี่ยน: ${data.replacedPartName}`)
      if (data.resolution) lines.push(`การแก้ไข: ${data.resolution}`)

      if (data.oldSerial || data.newSerial) {
        lines.push(`ซีเรียลอะไหล่:`)
        if (data.oldSerial) lines.push(`- S/N: ${data.oldSerial} (อะไหล่เก่า)`)
        if (data.newSerial) lines.push(`- S/N: ${data.newSerial} (อะไหล่ใหม่)`)
      }

      if (data.testResult) {
        lines.push(`ผลการทดสอบ: ${data.testResult}`)
      }

      appendContact(lines)
      return lines.join('\n')
    }

    case 'maintenance': {
      const lines: string[] = []
      lines.push(`ดำเนินการเข้าตรวจสอบและบำรุงรักษาเครื่อง ${deviceHeader || '[ประเภท/ยี่ห้อ/รุ่น]'}`)
      if (serialLine) lines.push(serialLine)
      if (data.symptom) lines.push(`อาการเสีย / สาเหตุที่รับแจ้ง: ${data.symptom}`)
      lines.push(`การดำเนินการ: ${data.resolution || 'ทำความสะอาดหัวพิมพ์, ลูกกลิ้ง และทดสอบระบบสั่งพิมพ์'}`)
      if (data.testResult) lines.push(`ผลการทดสอบ: ${data.testResult}`)
      if (data.customNotes) lines.push(`หมายเหตุ: ${data.customNotes}`)

      appendContact(lines)
      return lines.join('\n')
    }

    case 'firmware': {
      const lines: string[] = []
      lines.push(`ดำเนินการเข้าตรวจสอบและอัปเดตเฟิร์มแวร์เครื่อง ${deviceHeader || '[ประเภท/ยี่ห้อ/รุ่น]'}`)
      if (serialLine) lines.push(serialLine)
      if (data.firmwareOld || data.firmwareNew) {
        lines.push(`เฟิร์มแวร์: ${data.firmwareOld || '-'} -> ${data.firmwareNew || '-'}`)
      }
      lines.push(`การดำเนินการ: ${data.resolution || 'อัปเดตเฟิร์มแวร์ คาลิเบรทเซ็นเซอร์ และทดสอบการทำงาน'}`)
      if (data.testResult) lines.push(`ผลการทดสอบ: ${data.testResult}`)

      appendContact(lines)
      return lines.join('\n')
    }
  }
}
