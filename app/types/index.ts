export interface UserItem {
  employeeId: string
  name: string
  role: string
  isFirstLogin?: boolean
}

export interface ContactItem {
  id: number
  name: string
  phone: string
  companyId?: number
}

export interface CompanyItem {
  id: number
  name: string
  brands?: string[]
  contacts: ContactItem[]
}

export interface ProductItem {
  id: number
  brand: string
  model: string
}

export interface ReturnTicketItem {
  id: string
  ticket_no: string
  receive_date: string
  status_date: string
  status: string
  co_staff_names?: string
  serial_no?: string
  problem_symptom?: string
  included_accessories?: string
  remark?: string
  file_path?: string
  createdAt: string
  company: { id: number; name: string }
  contact: { id: number; name: string; phone: string }
  product: { id: number; brand: string; model: string }
  primaryStaff: { name: string; employeeId: string }
}

export interface WorksheetItem {
  id: string
  worksheet_no: string
  doc_types: string[]
  customer_name: string
  address?: string
  province?: string
  installation_spot?: string
  service_date: string
  start_time: string
  end_time: string
  product_type: string
  brand: string
  model: string
  serial_no?: string
  warranty_status: string
  symptom?: string
  work_details: string
  remarks?: string
  job_status: string[]
  technician_name: string
  contact_person?: string
  contact_position?: string
  contact_phone?: string
  signature_data?: string
  createdAt: string
}

export interface SentenceData {
  deviceType: string
  brand: string
  model: string
  serialNo: string
  symptom: string
  resolution: string
  mileage?: string
  oldSerial?: string
  newSerial?: string
  replacedPartName?: string
  testResult?: string
  firmwareOld?: string
  firmwareNew?: string
  customNotes?: string
}

export type TemplateId = 'printhead' | 'part_replacement' | 'maintenance' | 'firmware' | 'custom'

export interface SentenceTemplate {
  id: TemplateId
  name: string
  description: string
  badge: string
}
