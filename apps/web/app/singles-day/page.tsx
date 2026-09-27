import type { Metadata } from 'next'
import { CAMPAIGNS } from '@/lib/campaigns'
import { getOffers, getCategories } from '@/lib/api'
import type { Offer } from '@/lib/types'
import { CampaignLanding } from '@/components/campaign/CampaignLanding'

const campaign = CAMPAIGNS['singles-day']

export const metadata: Metadata = {
  title: campaign.metaTitle,
  description: campaign.metaDescription,
  alternates: {
    canonical: campaign.canonicalUrl,
  },
  openGraph: {
    title: campaign.h1,
    description: campaign.metaDescription,
    url: campaign.canonicalUrl,
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: campaign.h1,
    description: campaign.metaDescription,
  },
}

export const dynamic = 'force-dynamic'

export default async function SinglesDayPage() {
  let offers: Offer[] = []
  let trackedStores: Array<{ name: string; slug: string; offerCount?: number }> = []

  try {
    const resOffers = await getOffers({ campaign: 'singles-day', qualified: true, limit: 100 })
    offers = resOffers.data || []
  } catch (err) {
    console.error('Erro ao carregar ofertas de Singles Day:', err)
  }

  try {
    const catRes = await getCategories()
    if (catRes.data?.stores) {
      trackedStores = catRes.data.stores
        .filter((s: any) => (s.count || 0) > 0)
        .map((s: any) => ({
          name: s.name,
          slug: s.slug,
          offerCount: s.count,
        }))
    }
  } catch (err) {
    console.error('Erro ao carregar lojas acompanhadas:', err)
  }

  return (
    <CampaignLanding
      campaign={campaign}
      offers={offers}
      trackedStores={trackedStores}
    />
  )
}
