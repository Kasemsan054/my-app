import { SentenceData, TemplateId } from '@/app/lib/sentenceTemplates'
import { ProductItem } from '@/app/types'

export interface HistoryItem {
  id: string
  templateName: string
  text: string
  createdAt: string
}

export interface ServiceGeneratorClientProps {
  products?: ProductItem[]
}

export type { SentenceData, TemplateId, ProductItem }
