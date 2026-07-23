import prisma from '../lib/prisma'
import { requireAuth } from '../lib/auth'
import ServiceGeneratorClient from './ServiceGeneratorClient'
import WithMaintenance from '../components/WithMaintenance'

export const dynamic = 'force-dynamic'

export default async function GeneratorPage() {
  await requireAuth()

  const products = await prisma.product.findMany({
    orderBy: [{ brand: 'asc' }, { model: 'asc' }]
  })

  return (
    <WithMaintenance path="/generator">
      <ServiceGeneratorClient products={JSON.parse(JSON.stringify(products))} />
    </WithMaintenance>
  )
}
