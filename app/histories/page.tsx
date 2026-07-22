import prisma from '@/app/lib/prisma'
import { requireAuth } from '@/app/lib/auth'
import HistoriesClientPage from './HistoriesClientPage'

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
    (prisma as any).worksheet ? (prisma as any).worksheet.findMany({
      orderBy: { createdAt: 'desc' }
    }).catch(() => []) : Promise.resolve([])
  ])

  return (
    <HistoriesClientPage
      initialTickets={JSON.parse(JSON.stringify(tickets))}
      initialWorksheets={JSON.parse(JSON.stringify(worksheets))}
      currentUser={currentUser}
    />
  )
}
