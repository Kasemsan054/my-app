export interface VersionChangeItem {
  type: 'feature' | 'fix' | 'improvement'
  description: string
}

export interface VersionLog {
  version: string
  date: string
  title: string
  summary: string
  changes: VersionChangeItem[]
}

export const CURRENT_VERSION = '1.1.0'

export const CHANGELOG_HISTORY: VersionLog[] = [
  {
    version: '1.1.0',
    date: '24 กรกฎาคม 2569',
    title: 'อัปเดตระบบส่งอีเมล ThaibulkSMS & ปรับปรุงการเชื่อมต่อฐานข้อมูล',
    summary: 'แก้ไขระบบส่งอีเมลใบแจ้งซ่อมพร้อมไฟล์แนบ PDF และเพิ่มระบบแจ้งเตือนการอัปเดตเวอร์ชันบนหน้าเว็บ',
    changes: [
      {
        type: 'fix',
        description: 'แก้ไขระบบเชื่อมต่อฐานข้อมูล Supabase (SSL) ป้องกันข้อผิดพลาด ECONNREFUSED'
      },
      {
        type: 'fix',
        description: 'ปรับปรุงฟังก์ชันอัปโหลดไฟล์แนบ PDF และการส่งอีเมลผ่าน ThaibulkSMS API'
      },
      {
        type: 'improvement',
        description: 'เพิ่มข้อความแจ้งเตือนที่ชัดเจนเมื่อไม่ได้ระบุอีเมลผู้รับหรือยังไม่ได้ตั้งค่าผู้รับเริ่มต้น'
      },
      {
        type: 'feature',
        description: 'เพิ่มระบบจัดการเวอร์ชันเว็บไซต์ (App Versioning) บันทึกประวัติ Log และแจ้งเตือนบนหน้าเว็บ'
      }
    ]
  },
  {
    version: '1.0.0',
    date: '15 กรกฎาคม 2569',
    title: 'เปิดใช้งานระบบ QSP Service System อย่างเป็นทางการ',
    summary: 'เวอร์ชันแรกเริ่มต้นของระบบงานบริการและจัดการใบซ่อม QSP Service System',
    changes: [
      {
        type: 'feature',
        description: 'ระบบออกใบแจ้งเปิดงานซ่อมพร้อมสร้างไฟล์ PDF สวยงาม'
      },
      {
        type: 'feature',
        description: 'ระบบออกใบงานบริการ (Worksheet) พร้อมลายเซ็นดิจิทัล'
      },
      {
        type: 'feature',
        description: 'ระบบเครื่องมือช่วยสร้างประโยครายงานผลการซ่อม (Report Generator)'
      },
      {
        type: 'feature',
        description: 'ศูนย์รวมประวัติเอกสารย้อนหลัง ค้นหาง่าย และตั้งค่าข้อมูลบริษัท/สินค้า'
      }
    ]
  }
]
