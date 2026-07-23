import { ReturnTicketItem as TicketItem, WorksheetItem, UserItem } from '@/app/types'

export type { TicketItem, WorksheetItem, UserItem }

export interface HistoriesClientPageProps {
  initialTickets: TicketItem[]
  initialWorksheets: WorksheetItem[]
  currentUser: UserItem
}
