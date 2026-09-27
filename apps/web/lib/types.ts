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
  seoText?: string | null
  seoFaqs?: Array<{ question: string; answer: string }> | null
  seoTitle?: string | null
  seoDescription?: string | null
  activeOffersCount?: number
  totalOffersCount?: number
  couponsCount?: number
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
  titlePt?: string | null
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
  descriptionPt?: string | null
  affiliateUrl: string
  dealScore: string | null
  isMinHistoric: boolean
  availability: string
  status: string
  expiresAt: string | null
  clickCount: number
  publishedAt: string
  updatedAt: string
  upvotes?: number
  downvotes?: number
  commentCount?: number
  store: Pick<Store, 'id' | 'name' | 'slug' | 'logoUrl'>
  categories?: Category[]
}

export interface RecentComment {
  id: number
  name: string
  content: string
  createdAt: string
  offer: {
    slug: string
    title: string
    imageUrl: string | null
  }
}

export interface RecentActivity {
  title: string
  slug: string
  voteType: 'up' | 'down' | null
  votedAt: string
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
