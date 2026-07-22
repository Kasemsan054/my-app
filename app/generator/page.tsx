import prisma from '../lib/prisma'
import { requireAuth } from '../lib/auth'
import ServiceGeneratorClient from './ServiceGeneratorClient'

export const dynamic = 'force-dynamic'

export default async function GeneratorPage() {
  await requireAuth()

  const products = await prisma.product.findMany({
    orderBy: [{ brand: 'asc' }, { model: 'asc' }]
  })

  return <ServiceGeneratorClient products={JSON.parse(JSON.stringify(products))} />
}
