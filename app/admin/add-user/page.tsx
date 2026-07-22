import prisma from '@/app/lib/prisma'
import { requireAdmin } from '@/app/lib/auth'
import AdminUserClientPage from './AdminUserClientPage'

export const dynamic = 'force-dynamic'

export default async function AddUserPage() {
  const currentUser = await requireAdmin()

  const users = await prisma.user.findMany({
    select: {
      employeeId: true,
      name: true,
      role: true,
      isFirstLogin: true,
    },
    orderBy: { name: 'asc' }
  })

  return <AdminUserClientPage users={JSON.parse(JSON.stringify(users))} currentUser={currentUser} />
}