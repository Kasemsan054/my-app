import { PrismaClient } from '@prisma/client'
import { Pool } from 'pg'
import { PrismaPg } from '@prisma/adapter-pg'

const prismaClientSingleton = () => {
  const connectionString = process.env.DATABASE_URL
  const pool = new Pool({ 
    connectionString,
    max: 15,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 5000
  })
  const adapter = new PrismaPg(pool)

  return new PrismaClient({ adapter })
}

declare global {
  var prisma: undefined | ReturnType<typeof prismaClientSingleton>
}

// Re-instantiate if cached global prisma lacks newly added models
const getPrisma = () => {
  if (!globalThis.prisma || !('worksheet' in globalThis.prisma)) {
    globalThis.prisma = prismaClientSingleton()
  }
  return globalThis.prisma
}

const prisma = getPrisma()
export default prisma