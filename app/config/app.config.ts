export const appConfig = {
  appName: 'QSP Service System',
  company: {
    name: 'QSP Company',
    logoUrl: '/logo.png', // Add your actual logo path here if needed
    adminEmail: process.env.NEXT_PUBLIC_ADMIN_EMAIL || 'kasemsan.c@quadel.co.th',
  },
  ui: {
    sidebar: {
      title: 'QSP Service',
      subtitle: 'System',
    },
    settings: {
      title: 'ตั้งค่าข้อมูลหลัก',
      description: 'จัดการข้อมูลบริษัท, อุปกรณ์, และยี่ห้อสินค้าสำหรับใช้ในระบบ',
      companySectionTitle: 'ข้อมูลบริษัท / ลูกค้า (Company & Contacts)',
      productSectionTitle: 'ข้อมูลสินค้า / อุปกรณ์ (Products & Brands)',
    },
    tickets: {
      title: 'ศูนย์รวมประวัติเอกสารและใบงาน',
      description: 'รวมประวัติใบแจ้งเปิดงานซ่อม และใบบันทึกผลการดำเนินงาน (Worksheet) ไว้ในที่เดียวเพื่อความสะดวกในการค้นหา',
      emptyTitle: 'ไม่พบประวัติเอกสารที่คุณค้นหา',
      emptyDescription: 'ลองเปลี่ยนคำค้นหา หรือสลับประเภทแท็บเอกสารด้านบน',
    },
    histories: {
      title: 'ประวัติการดำเนินงานย้อนหลัง',
      description: 'เรียงลำดับประวัติเอกสารย้อนหลังตามเวลาที่บันทึกข้อมูล',
      emptyTitle: 'ไม่พบประวัติย้อนหลังที่คุณค้นหา',
      emptyDescription: 'ลองเปลี่ยนคำค้นหา หรือสลับประเภทแท็บเอกสารด้านบน',
    },
    generator: {
      title: 'ระบบสร้างประโยคสรุปการทำงานซ่อม',
      description: 'สร้างประโยครายงานเฉพาะแบบ ปรับแต่งข้อความอิสระ และคัดลอกเฉพาะบางจุดได้ทันที',
    },
    worksheet: {
      title: 'สร้างใบงานบริการ (Worksheet)',
      description: 'บันทึกรายละเอียดการดำเนินงานและผลการซ่อม/บริการ',
    },
    common: {
      searchPlaceholder: 'ค้นหา...',
      copyAllButton: 'คัดลอกทั้งหมด (Copy All)',
      copySuccess: 'คัดลอกสำเร็จ!',
      cancel: 'ยกเลิก',
      save: 'บันทึก',
      delete: 'ลบ',
      confirmDelete: 'ยืนยันลบข้อมูล',
      viewDetails: 'ดูรายละเอียด'
    }
  }
}
