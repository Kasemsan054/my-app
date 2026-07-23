import prisma from '@/app/lib/prisma'
import { requireAuth } from '@/app/lib/auth'
import HistoriesClientPage from './HistoriesClientPage'
import WithMaintenance from '../components/WithMaintenance'

export const dynamic = 'force-dynamic'

export default async function HistoriesPage() {
  const currentUser = await requireAuth()

  const [tickets, worksheets] = await Promise.all([
    prisma.returnTicket.findMany({
      include: {
        company: true,
        contact: true,
        product: true,
        primaryStaff: {
          select: { name: true, employeeId: true }
        }
      },
      orderBy: { createdAt: 'desc' }
    }),
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (prisma as any).worksheet ? (prisma as any).worksheet.findMany({
      orderBy: { createdAt: 'desc' }
    }).catch(() => []) : Promise.resolve([])
  ])

  return (
    <WithMaintenance path="/histories">
      <HistoriesClientPage
        initialTickets={JSON.parse(JSON.stringify(tickets))}
        initialWorksheets={JSON.parse(JSON.stringify(worksheets))}
        currentUser={currentUser}
      />
    </WithMaintenance>
  )
}
