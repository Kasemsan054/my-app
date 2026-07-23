import { ProductItem } from '@/app/types'

export interface WorksheetFormProps {
  currentUser?: {
    employeeId: string
    name: string
    role: string
  } | null
  products?: ProductItem[]
}

export const DOC_TYPES_OPTIONS = [
  'ติดตั้งเครื่อง',
  'ซ่อมเครื่อง',
  'รับเครื่องกลับ',
  'Demo',
  'PM/ซ่อมบำรุงรักษาเครื่อง',
  'Training',
  'ส่งตัวเครื่อง',
  'เปลี่ยนอุปกรณ์',
  'Stand By',
  'Visit',
  'อื่นๆ'
]

export const JOB_STATUS_OPTIONS = [
  'อยู่ในเงื่อนไขการบริการ',
  'อยู่นอกเงื่อนไขการบริการ',
  'เครื่องใช้งานได้เรียบร้อย',
  'เครื่องยังใช้งานไม่ได้',
  'นำเครื่องลูกค้ากลับและบริษัทมีเครื่องทดแทน',
  'นำเครื่องกลับไม่มีเครื่องทดแทน'
]
