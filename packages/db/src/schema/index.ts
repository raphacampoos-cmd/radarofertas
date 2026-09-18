import {
  pgTable,
  serial,
  varchar,
  text,
  integer,
  decimal,
  boolean,
  timestamp,
  char,
  bigserial,
  jsonb,
  primaryKey,
  index,
  uniqueIndex,
} from 'drizzle-orm/pg-core'
import { relations } from 'drizzle-orm'

// ─────────────────────────────────────────────
// STORES
// ─────────────────────────────────────────────
export const stores = pgTable('stores', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 100 }).notNull(),
  slug: varchar('slug', { length: 100 }).notNull().unique(),
  logoUrl: text('logo_url'),
  website: text('website'),
  country: char('country', { length: 2 }).default('PT'),
  affiliateNetwork: varchar('affiliate_network', { length: 50 }), // 'amazon','awin','admitad','direct'
  affiliateTag: text('affiliate_tag'),
  commissionMin: decimal('commission_min', { precision: 5, scale: 4 }),
  commissionMax: decimal('commission_max', { precision: 5, scale: 4 }),
  reliability: decimal('reliability', { precision: 3, scale: 2 }).default('0.90'),
  active: boolean('active').default(true),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
}, (t) => [
  index('stores_slug_idx').on(t.slug),
  index('stores_active_idx').on(t.active),
])

// ─────────────────────────────────────────────
// CATEGORIES
// ─────────────────────────────────────────────
export const categories = pgTable('categories', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 100 }).notNull(),
  slug: varchar('slug', { length: 100 }).notNull().unique(),
  parentId: integer('parent_id').references((): any => categories.id),
  icon: varchar('icon', { length: 10 }), // emoji
  description: text('description'),
  sortOrder: integer('sort_order').default(0),
  active: boolean('active').default(true),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
}, (t) => [
  index('categories_slug_idx').on(t.slug),
  index('categories_parent_idx').on(t.parentId),
])

// ─────────────────────────────────────────────
// OFFERS
// ─────────────────────────────────────────────
export const offers = pgTable('offers', {
  id: serial('id').primaryKey(),
  title: varchar('title', { length: 500 }).notNull(),
  slug: varchar('slug', { length: 600 }).notNull().unique(),
  storeId: integer('store_id').notNull().references(() => stores.id),
  externalId: varchar('external_id', { length: 50 }), // ASIN ou ID externo
  priceCurrent: decimal('price_current', { precision: 10, scale: 2 }),
  priceOriginal: decimal('price_original', { precision: 10, scale: 2 }),
  priceMinimum: decimal('price_minimum', { precision: 10, scale: 2 }), // mínimo histórico
  discountPct: decimal('discount_pct', { precision: 5, scale: 2 }),
  couponCode: varchar('coupon_code', { length: 100 }),
  currency: char('currency', { length: 3 }).default('EUR'),
  imageUrl: text('image_url'),
  description: text('description'),
  affiliateUrl: text('affiliate_url').notNull(),
  dealScore: decimal('deal_score', { precision: 5, scale: 2 }).default('0'), // 0-100
  isMinHistoric: boolean('is_min_historic').default(false),
  availability: varchar('availability', { length: 20 }).default('InStock'),
  status: varchar('status', { length: 20 }).default('active'), // active|expired|out_of_stock|deleted
  expiresAt: timestamp('expires_at', { withTimezone: true }),
  clickCount: integer('click_count').default(0),
  source: varchar('source', { length: 50 }).default('editorial'), // editorial|community|auto
  publishedAt: timestamp('published_at', { withTimezone: true }).defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow(),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
}, (t) => [
  index('offers_store_id_idx').on(t.storeId),
  index('offers_status_idx').on(t.status),
  index('offers_published_at_idx').on(t.publishedAt),
  index('offers_deal_score_idx').on(t.dealScore),
  uniqueIndex('offers_slug_idx').on(t.slug),
  index('offers_external_id_idx').on(t.externalId),
])

// ─────────────────────────────────────────────
// OFFER_CATEGORIES (pivot M:N)
// ─────────────────────────────────────────────
export const offerCategories = pgTable('offer_categories', {
  offerId: integer('offer_id').notNull().references(() => offers.id, { onDelete: 'cascade' }),
  categoryId: integer('category_id').notNull().references(() => categories.id),
}, (t) => [
  primaryKey({ columns: [t.offerId, t.categoryId] }),
  index('offer_categories_offer_idx').on(t.offerId),
  index('offer_categories_category_idx').on(t.categoryId),
])

// ─────────────────────────────────────────────
// PRICE_HISTORY
// ─────────────────────────────────────────────
export const priceHistory = pgTable('price_history', {
  id: bigserial('id', { mode: 'bigint' }).primaryKey(),
  offerId: integer('offer_id').notNull().references(() => offers.id, { onDelete: 'cascade' }),
  storeId: integer('store_id').notNull().references(() => stores.id),
  price: decimal('price', { precision: 10, scale: 2 }).notNull(),
  isMinimum: boolean('is_minimum').default(false),
  source: varchar('source', { length: 50 }).default('cron'), // cron|api|manual
  recordedAt: timestamp('recorded_at', { withTimezone: true }).defaultNow(),
}, (t) => [
  index('price_history_offer_id_idx').on(t.offerId, t.recordedAt),
  index('price_history_recorded_at_idx').on(t.recordedAt),
])

// ─────────────────────────────────────────────
// CLICKS (tracking)
// ─────────────────────────────────────────────
export const clicks = pgTable('clicks', {
  id: bigserial('id', { mode: 'bigint' }).primaryKey(),
  offerId: integer('offer_id').notNull().references(() => offers.id),
  ipHash: varchar('ip_hash', { length: 64 }),
  userAgent: text('user_agent'),
  referrer: text('referrer'),
  channel: varchar('channel', { length: 50 }).default('web'), // web|telegram|email|extension
  clickedAt: timestamp('clicked_at', { withTimezone: true }).defaultNow(),
}, (t) => [
  index('clicks_offer_id_idx').on(t.offerId),
  index('clicks_clicked_at_idx').on(t.clickedAt),
])

// ─────────────────────────────────────────────
// SUBSCRIBERS (Newsletter)
// ─────────────────────────────────────────────
export const subscribers = pgTable('subscribers', {
  id: serial('id').primaryKey(),
  email: varchar('email', { length: 255 }).notNull().unique(),
  active: boolean('active').default(true),
  source: varchar('source', { length: 50 }).default('web'),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
}, (t) => [
  uniqueIndex('subscribers_email_idx').on(t.email),
  index('subscribers_active_idx').on(t.active),
])

// ─────────────────────────────────────────────
// RELATIONS
// ─────────────────────────────────────────────
export const storesRelations = relations(stores, ({ many }) => ({
  offers: many(offers),
  priceHistory: many(priceHistory),
}))

export const categoriesRelations = relations(categories, ({ one, many }) => ({
  parent: one(categories, {
    fields: [categories.parentId],
    references: [categories.id],
    relationName: 'parent_child',
  }),
  children: many(categories, { relationName: 'parent_child' }),
  offerCategories: many(offerCategories),
}))

export const offersRelations = relations(offers, ({ one, many }) => ({
  store: one(stores, {
    fields: [offers.storeId],
    references: [stores.id],
  }),
  offerCategories: many(offerCategories),
  priceHistory: many(priceHistory),
  clicks: many(clicks),
}))

export const offerCategoriesRelations = relations(offerCategories, ({ one }) => ({
  offer: one(offers, {
    fields: [offerCategories.offerId],
    references: [offers.id],
  }),
  category: one(categories, {
    fields: [offerCategories.categoryId],
    references: [categories.id],
  }),
}))

export const priceHistoryRelations = relations(priceHistory, ({ one }) => ({
  offer: one(offers, {
    fields: [priceHistory.offerId],
    references: [offers.id],
  }),
  store: one(stores, {
    fields: [priceHistory.storeId],
    references: [stores.id],
  }),
}))

export const clicksRelations = relations(clicks, ({ one }) => ({
  offer: one(offers, {
    fields: [clicks.offerId],
    references: [offers.id],
  }),
}))

export const comments = pgTable('comments', {
  id: serial('id').primaryKey(),
  offerId: integer('offer_id').notNull().references(() => offers.id, { onDelete: 'cascade' }),
  name: varchar('name', { length: 255 }).notNull(),
  email: varchar('email', { length: 255 }).notNull(),
  content: text('content').notNull(),
  status: varchar('status', { length: 50 }).notNull().default('pending'), // pending, approved, spam
  createdAt: timestamp('created_at').defaultNow().notNull(),
}, (t) => [
  index('comments_offer_idx').on(t.offerId),
  index('comments_status_idx').on(t.status),
])

export const commentsRelations = relations(comments, ({ one }) => ({
  offer: one(offers, {
    fields: [comments.offerId],
    references: [offers.id],
  }),
}))
