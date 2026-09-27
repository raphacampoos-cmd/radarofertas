import { sql, or, and, isNotNull, ne, eq, type SQL } from 'drizzle-orm'
import { offers } from '@radarofertas/db/schema'
import { MIN_QUALIFIED_DISCOUNT, isQualifiedOffer } from '@radarofertas/deal-engine'

export { MIN_QUALIFIED_DISCOUNT, isQualifiedOffer }

/**
 * Expressão SQL Drizzle para filtrar apenas ofertas qualificadas:
 * 1. Preço original definido (> 0) e desconto >= MIN_QUALIFIED_DISCOUNT (15%)
 * 2. Mínimo histórico confirmado (is_min_historic = true)
 * 3. Cupão promocional ativo
 */
export function qualifiedOfferCondition(minDiscount = MIN_QUALIFIED_DISCOUNT): SQL {
  return or(
    and(
      isNotNull(offers.priceOriginal),
      sql`CAST(${offers.priceOriginal} AS NUMERIC) > 0`,
      sql`CAST(COALESCE(${offers.discountPct}, '0') AS NUMERIC) >= ${minDiscount}`
    ),
    eq(offers.isMinHistoric, true),
    and(
      isNotNull(offers.couponCode),
      ne(offers.couponCode, '')
    )
  )!
}
