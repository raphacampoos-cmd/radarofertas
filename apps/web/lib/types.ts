// Tipos partilhados para a API e o frontend
export interface Store {
  id: number
  name: string
  slug: string
  logoUrl: string | null
  website: string | null
  affiliateNetwork: string | null
  commissionMin: string | null
  commissionMax: string | null
  reliability: string | null
  active: boolean
}

export interface Category {
  id: number
  name: string
  slug: string
  parentId: number | null
  icon: string | null
  description: string | null
  sortOrder: number
  children?: Category[]
}

export interface Offer {
  id: number
  title: string
  slug: string
  storeId: number
  externalId: string | null
  priceCurrent: string | null
  priceOriginal: string | null
  priceMinimum: string | null
  discountPct: string | null
  couponCode: string | null
  currency: string
  imageUrl: string | null
  description: string | null
  affiliateUrl: string
  dealScore: string | null
  isMinHistoric: boolean
  availability: string
  status: string
  expiresAt: string | null
  clickCount: number
  publishedAt: string
  updatedAt: string
  store: Pick<Store, 'id' | 'name' | 'slug' | 'logoUrl'>
  categories?: Category[]
}

export interface PricePoint {
  price: string
  isMinimum: boolean
  recordedAt: string
}

export interface PriceStats {
  avg90Days: number | null
  pointCount: number
  minRecorded: number | null
  maxRecorded: number | null
}

export interface PaginationMeta {
  page: number
  limit: number
  total: number
  totalPages: number
}

export interface ApiResponse<T> {
  data: T
  pagination?: PaginationMeta
}
