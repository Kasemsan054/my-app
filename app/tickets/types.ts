import { ReturnTicketItem as TicketItem, WorksheetItem, UserItem } from '@/app/types'

export type { TicketItem, WorksheetItem, UserItem }

export interface TicketsClientPageProps {
  initialTickets: TicketItem[]
  initialWorksheets: WorksheetItem[]
  currentUser: UserItem
}

export type TicketKindItem = 
  | { kind: 'TICKET'; data: TicketItem; date: Date }
  | { kind: 'WORKSHEET'; data: WorksheetItem; date: Date }

export type DeleteTargetType = { type: 'TICKET' | 'WORKSHEET'; id: string; title: string } | null
