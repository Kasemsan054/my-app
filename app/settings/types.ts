export interface Contact {
  id: number
  name: string
  phone: string
  companyId: number
}

export interface Company {
  id: number
  name: string
  branch: string
  brands?: string[]
  contacts: Contact[]
}

export interface Product {
  id: number
  brand: string
  model: string
}

export type DeleteTarget = {
  type: 'company' | 'contact' | 'product' | 'brand' | 'companyGroup'
  id: number | string
  name: string
} | null

export interface SettingsClientPageProps {
  initialCompanies: Company[]
  initialProducts: Product[]
}
