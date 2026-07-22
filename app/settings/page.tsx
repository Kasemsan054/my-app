import prisma from '@/app/lib/prisma'
import { requireAuth } from '@/app/lib/auth'
import SettingsClientPage from './SettingsClientPage'

export const dynamic = 'force-dynamic'

export default async function SettingsPage() {
  await requireAuth()

  const [companies, products] = await Promise.all([
    prisma.company.findMany({ include: { contacts: true }, orderBy: { name: 'asc' } }),
    prisma.product.findMany({ orderBy: { brand: 'asc' } })
  ])

  return <SettingsClientPage initialCompanies={JSON.parse(JSON.stringify(companies))} initialProducts={JSON.parse(JSON.stringify(products))} />
}
