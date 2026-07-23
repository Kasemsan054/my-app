import { generateSentence } from '../app/lib/sentenceTemplates.ts'

const testData = {
  deviceType: 'Barcode Printer',
  brand: 'HPRT',
  model: 'HT800',
  serialNo: 'HT800023280476',
  symptom: 'ไฟเข้าบ้าง ไม่เข้าบ้าง',
  resolution: 'เปลี่ยนหัวพิมพ์ใหม่ และทดสอบการใช้งานตัวเครื่องสามารถใช้งานได้ปกติ',
  mileage: '119,166',
  isMileageUnknown: false,
  oldSerial: 'T7FV00324200007',
  newSerial: 'T7FV00324150013',
  replacedPartName: 'ชุดหัวพิมพ์ใหม่',
  testResult: 'เครื่องสามารถใช้งานได้ปกติ',
  firmwareOld: 'V1.02',
  firmwareNew: 'V2.05',
  customNotes: 'ดำเนินการเข้าตรวจสอบเครื่อง Barcode Printer HPRT HT800...',
  devices: [
    { serialNo: 'HT800023280476', symptom: 'ไฟเข้าบ้าง ไม่เข้าบ้าง' },
    { serialNo: 'HT800023280473', symptom: 'ปรินกระโดดในบางครั้ง' }
  ],
  contactName: 'ยศวัจน์ สมบูรณ์',
  contactPosition: 'เจ้าหน้าที่คลัง',
  contactPhone: '0949191626'
}

const templates = ['multi_device', 'printhead', 'part_replacement', 'maintenance', 'firmware', 'custom']

console.log('--- START AUTOMATED TEMPLATE VERIFICATION ---')

templates.forEach(t => {
  const result = generateSentence(t, testData)
  console.log(`\n=== TEMPLATE: ${t} ===`)
  console.log(result)
  if (!result) {
    console.error(`❌ FAILED: ${t} output is empty!`)
    process.exit(1)
  }
})

console.log('\n✅ ALL TEMPLATES PASSED VERIFICATION!')
