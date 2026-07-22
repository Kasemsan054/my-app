import { PrismaClient } from '@prisma/client'
import { Pool } from 'pg'
import { PrismaPg } from '@prisma/adapter-pg'
import dotenv from 'dotenv'

dotenv.config()

const connectionString = process.env.DATABASE_URL
if (!connectionString) {
  console.error("No DATABASE_URL found in .env")
  process.exit(1)
}

const pool = new Pool({ connectionString })
const adapter = new PrismaPg(pool)
const prisma = new PrismaClient({ adapter })

const BRAND_MODELS_PRESETS = {
  'Godex': ['RT863i', 'G500', 'EZ120', 'HD830i', 'DT4x', 'ZX420i', 'RT700i', 'BP500L'],
  'Zebra': ['ZT411', 'ZT230', 'ZD220', 'ZD420', 'GK420t', 'ZT421', 'ZQ521', 'ZT610'],
  'Honeywell': ['PC42t', 'PM42', 'PX4i', 'CW45', 'Intermec PD43', 'EDA51'],
  'TSC': ['TTP-244 Pro', 'TA210', 'TE200', 'MB240T', 'MH241', 'TDP-225'],
  'Sato': ['CL4NX Plus', 'PW208NX', 'FX3-LX', 'CG408', 'WS408'],
  'Bixolon': ['SLP-TX400', 'SRP-350III', 'SPP-R200III', 'XD5-40t'],
  'Epson': ['TM-T82III', 'TM-U220B', 'TM-T88VI', 'LQ-310', 'L3250'],
  'HPRT': ['TP808', 'HT300', 'LPQ58', 'POS80'],
  'Datalogic': ['QuickScan QW2100', 'Gryphon GD4500', 'Powerscan PD9530'],
  'Fujitsu': ['fi-7160', 'fi-8170', 'fi-7260']
}

async function main() {
  console.log("Seeding products into Database...")

  const existingProducts = await prisma.product.findMany()
  const existingSet = new Set(existingProducts.map(p => `${p.brand}__${p.model}`))

  const toCreate = []

  Object.entries(BRAND_MODELS_PRESETS).forEach(([brand, models]) => {
    models.forEach(model => {
      const key = `${brand}__${model}`
      if (!existingSet.has(key)) {
        toCreate.push({ brand, model })
      }
    })
  })

  if (toCreate.length > 0) {
    const result = await prisma.product.createMany({
      data: toCreate
    })
    console.log(`Successfully seeded ${result.count} products into PostgreSQL!`)
  } else {
    console.log("All preset products already exist in Database.")
  }

  const total = await prisma.product.count()
  console.log(`Total products in database: ${total}`)

  await pool.end()
}

main().catch((err) => {
  console.error("Seeding error:", err)
  process.exit(1)
})
