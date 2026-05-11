
import { PrismaPg } from '@prisma/adapter-pg'
import 'dotenv/config'
import { Prisma, PrismaClient } from 'src/prisma/generated/client'

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL,
})

const prisma = new PrismaClient({ adapter })

async function upsertMedia(tx: Prisma.TransactionClient, url?: string) {
  if (!url) return

  await tx.media.upsert({
    where: { url },
    update: {},
    create: {
      url,
      name: url.split('/').pop() || 'unknown',
      title: null,
      description: null,
      type: 'image',
      folder: 'root',
    },
  })
}

async function main() {
  await prisma.$transaction(async (tx) => {
    // TOUR
    const tours = await tx.tour.findMany()
    for (const t of tours) {
      await upsertMedia(tx, t.mainImageUrl ?? undefined)
      await upsertMedia(tx, t.videoThumbnailUrl ?? undefined)
      for (const url of t.additionalImageUrls ?? []) {
        await upsertMedia(tx, url)
      }
    }

    // PAGE
    const pages = await tx.page.findMany()
    for (const p of pages) {
      await upsertMedia(tx, p.mainImageUrl ?? undefined)
      for (const url of p.additionalImageUrls ?? []) {
        await upsertMedia(tx, url)
      }
    }

    // BLOG
    const blogs = await tx.blog.findMany()
    for (const b of blogs) {
      await upsertMedia(tx, b.mainImageUrl ?? undefined)
      for (const url of b.additionalImageUrls ?? []) {
        await upsertMedia(tx, url)
      }
    }

    // TOUR CATEGORY
    const tourCategories = await tx.tourCategory.findMany()
    for (const c of tourCategories) {
      await upsertMedia(tx, c.mainImageUrl ?? undefined)
      await upsertMedia(tx, c.videoThumbnailUrl ?? undefined)
    }

    // BLOG CATEGORY
    const blogCategories = await tx.blogCategory.findMany()
    for (const c of blogCategories) {
      await upsertMedia(tx, c.mainImageUrl ?? undefined)
    }
  })

  console.log('Media migration completed successfully')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })