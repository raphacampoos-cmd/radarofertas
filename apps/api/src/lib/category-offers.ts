import { db } from '@radarofertas/db/client'
import { categories, offerCategories } from '@radarofertas/db/schema'
import { eq, inArray } from 'drizzle-orm'

// IDs das ofertas que pertencem a uma categoria OU às suas subcategorias.
export async function offerIdsForCategory(categoryId: number): Promise<number[]> {
  const children = await db.select({ id: categories.id }).from(categories).where(eq(categories.parentId, categoryId))
  const categoryIds = [categoryId, ...children.map((c) => c.id)]

  const rows = await db
    .select({ offerId: offerCategories.offerId })
    .from(offerCategories)
    .where(inArray(offerCategories.categoryId, categoryIds))

  return [...new Set(rows.map((r) => r.offerId))]
}
