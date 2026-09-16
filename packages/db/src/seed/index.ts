import { db } from '../client.js'
import { stores, categories, offers, offerCategories, priceHistory } from '../schema/index.js'
import { sql } from 'drizzle-orm'

async function seed() {
  console.log('🌱 A iniciar seed da base de dados RadarOfertas...')

  // ─── LIMPAR (ordem inversa por FK) ────────────────────────────
  await db.execute(sql`TRUNCATE price_history, clicks, offer_categories, offers, categories, stores RESTART IDENTITY CASCADE`)
  console.log('✅ Tabelas limpas')

  // ─── LOJAS ────────────────────────────────────────────────────
  const [amazonEs] = await db.insert(stores).values({
    name: 'Amazon',
    slug: 'amazon',
    logoUrl: '/images/stores/amazon.svg',
    website: 'https://www.amazon.es',
    country: 'ES',
    affiliateNetwork: 'amazon',
    affiliateTag: 'radarofertas-21',
    commissionMin: '0.030',
    commissionMax: '0.100',
    reliability: '0.97',
    active: true,
  }).returning()

  const [prozis] = await db.insert(stores).values({
    name: 'Prozis',
    slug: 'prozis',
    logoUrl: '/images/stores/prozis.svg',
    website: 'https://www.prozis.com/pt',
    country: 'PT',
    affiliateNetwork: 'direct',
    affiliateTag: 'RADAROFERTAS',
    commissionMin: '0.080',
    commissionMax: '0.150',
    reliability: '0.95',
    active: true,
  }).returning()

  const [zumub] = await db.insert(stores).values({
    name: 'Zumub',
    slug: 'zumub',
    logoUrl: '/images/stores/zumub.svg',
    website: 'https://www.zumub.com/pt',
    country: 'PT',
    affiliateNetwork: 'direct',
    affiliateTag: 'RADAROFERTAS',
    commissionMin: '0.080',
    commissionMax: '0.120',
    reliability: '0.92',
    active: true,
  }).returning()

  const [worten] = await db.insert(stores).values({
    name: 'Worten',
    slug: 'worten',
    logoUrl: '/images/stores/worten.svg',
    website: 'https://www.worten.pt',
    country: 'PT',
    affiliateNetwork: 'awin',
    affiliateTag: '123456',
    commissionMin: '0.030',
    commissionMax: '0.070',
    reliability: '0.90',
    active: true,
  }).returning()

  const [pcdiga] = await db.insert(stores).values({
    name: 'PCDIGA',
    slug: 'pcdiga',
    logoUrl: '/images/stores/pcdiga.svg',
    website: 'https://www.pcdiga.com',
    country: 'PT',
    affiliateNetwork: 'direct',
    commissionMin: '0.030',
    commissionMax: '0.060',
    reliability: '0.90',
    active: true,
  }).returning()

  const [fnac] = await db.insert(stores).values({
    name: 'Fnac',
    slug: 'fnac',
    logoUrl: '/images/stores/fnac.svg',
    website: 'https://www.fnac.pt',
    country: 'PT',
    affiliateNetwork: 'awin',
    reliability: '0.88',
    active: true,
  }).returning()

  console.log(`✅ ${6} lojas criadas`)

  // ─── CATEGORIAS ───────────────────────────────────────────────
  // Categorias principais
  const [catGaming] = await db.insert(categories).values({
    name: 'Gaming',
    slug: 'gaming',
    icon: '🕹️',
    description: 'Consolas, jogos, periféricos e componentes PC gaming',
    sortOrder: 1,
    active: true,
  }).returning()

  const [catCasa] = await db.insert(categories).values({
    name: 'Casa & Electrodomésticos',
    slug: 'casa',
    icon: '🏡',
    description: 'Robots de limpeza, air fryers, cafeteiras e muito mais',
    sortOrder: 2,
    active: true,
  }).returning()

  const [catSupl] = await db.insert(categories).values({
    name: 'Suplementação',
    slug: 'suplementacao',
    icon: '💪',
    description: 'Proteínas, vitaminas, pré-treino e nutrição desportiva',
    sortOrder: 3,
    active: true,
  }).returning()

  // Subcategorias Gaming
  const [catConsolas] = await db.insert(categories).values({
    name: 'Consolas',
    slug: 'gaming-consolas',
    parentId: catGaming.id,
    icon: '🎮',
    sortOrder: 1,
    active: true,
  }).returning()

  const [catJogos] = await db.insert(categories).values({
    name: 'Jogos',
    slug: 'gaming-jogos',
    parentId: catGaming.id,
    icon: '💿',
    sortOrder: 2,
    active: true,
  }).returning()

  const [catPerifericos] = await db.insert(categories).values({
    name: 'Periféricos',
    slug: 'gaming-perifericos',
    parentId: catGaming.id,
    icon: '🖱️',
    sortOrder: 3,
    active: true,
  }).returning()

  // Subcategorias Casa
  const [catRobots] = await db.insert(categories).values({
    name: 'Robots de Limpeza',
    slug: 'casa-robots',
    parentId: catCasa.id,
    icon: '🤖',
    sortOrder: 1,
    active: true,
  }).returning()

  const [catAirFryers] = await db.insert(categories).values({
    name: 'Air Fryers',
    slug: 'casa-air-fryers',
    parentId: catCasa.id,
    icon: '🍟',
    sortOrder: 2,
    active: true,
  }).returning()

  // Subcategorias Suplementação
  const [catProteinas] = await db.insert(categories).values({
    name: 'Proteínas',
    slug: 'supl-proteinas',
    parentId: catSupl.id,
    icon: '🥛',
    sortOrder: 1,
    active: true,
  }).returning()

  const [catVitaminas] = await db.insert(categories).values({
    name: 'Vitaminas & Minerais',
    slug: 'supl-vitaminas',
    parentId: catSupl.id,
    icon: '💊',
    sortOrder: 2,
    active: true,
  }).returning()

  console.log(`✅ ${10} categorias criadas`)

  // ─── OFERTAS (10 iniciais) ────────────────────────────────────
  const offersData = [
    {
      title: 'PlayStation 5 Slim Digital Edition',
      slug: 'playstation-5-slim-digital-edition',
      storeId: amazonEs.id,
      externalId: 'B0CL5KNB9M',
      priceCurrent: '349.99',
      priceOriginal: '449.99',
      priceMinimum: '329.99',
      discountPct: '22.22',
      currency: 'EUR',
      imageUrl: 'https://placehold.co/400x400/1a1a2e/white?text=PS5+Slim',
      description: 'Consola PlayStation 5 Slim Digital Edition. Sem leitor de discos, mais compacta e leve. Perfeita para gaming digital.',
      affiliateUrl: 'https://www.amazon.es/dp/B0CL5KNB9M?tag=radarofertas-21',
      dealScore: '72.00',
      isMinHistoric: false,
      availability: 'InStock',
      status: 'active',
      source: 'editorial',
      categories: [catGaming.id, catConsolas.id],
    },
    {
      title: 'DualSense Wireless Controller Sony PS5 — Midnight Black',
      slug: 'dualsense-wireless-controller-sony-ps5-midnight-black',
      storeId: amazonEs.id,
      externalId: 'B08H99BPJN',
      priceCurrent: '54.99',
      priceOriginal: '69.99',
      priceMinimum: '49.99',
      discountPct: '21.43',
      currency: 'EUR',
      imageUrl: 'https://placehold.co/400x400/1a1a2e/white?text=DualSense',
      description: 'Comando DualSense para PlayStation 5 na cor Midnight Black. Com feedback háptico e gatilhos adaptáveis.',
      affiliateUrl: 'https://www.amazon.es/dp/B08H99BPJN?tag=radarofertas-21',
      dealScore: '65.00',
      isMinHistoric: false,
      availability: 'InStock',
      status: 'active',
      source: 'editorial',
      categories: [catGaming.id, catPerifericos.id],
    },
    {
      title: 'Roborock Q5 Pro+ Robô Aspirador e Esfregona 5500Pa — Branco',
      slug: 'roborock-q5-pro-robo-aspirador-esfregona-5500pa-branco',
      storeId: amazonEs.id,
      externalId: 'B0C9S72NW2',
      priceCurrent: '279.99',
      priceOriginal: '449.99',
      priceMinimum: '269.99',
      discountPct: '37.78',
      currency: 'EUR',
      imageUrl: 'https://placehold.co/400x400/e8f5e9/333?text=Roborock+Q5',
      description: 'Robot aspirador e esfregona com sucção de 5500Pa, navegação LiDAR, app e compatível com Alexa/Google Home.',
      affiliateUrl: 'https://www.amazon.es/dp/B0C9S72NW2?tag=radarofertas-21',
      dealScore: '88.00',
      isMinHistoric: true,
      availability: 'InStock',
      status: 'active',
      source: 'editorial',
      categories: [catCasa.id, catRobots.id],
    },
    {
      title: 'Xiaomi Smart Air Fryer Pro 4L — Preto',
      slug: 'xiaomi-smart-air-fryer-pro-4l-preto',
      storeId: amazonEs.id,
      externalId: 'B0BPS89YML',
      priceCurrent: '49.99',
      priceOriginal: '79.99',
      priceMinimum: '44.99',
      discountPct: '37.50',
      currency: 'EUR',
      imageUrl: 'https://placehold.co/400x400/fff3e0/333?text=Air+Fryer',
      description: 'Fritadeira sem óleo Xiaomi Smart Air Fryer Pro 4L. Controlo via app, 32 receitas integradas, 1500W.',
      affiliateUrl: 'https://www.amazon.es/dp/B0BPS89YML?tag=radarofertas-21',
      dealScore: '80.00',
      isMinHistoric: false,
      availability: 'InStock',
      status: 'active',
      source: 'editorial',
      categories: [catCasa.id, catAirFryers.id],
    },
    {
      title: 'Prozis Whey Protein 1kg — Chocolate',
      slug: 'prozis-whey-protein-1kg-chocolate',
      storeId: prozis.id,
      priceCurrent: '17.99',
      priceOriginal: '25.99',
      priceMinimum: '15.99',
      discountPct: '30.78',
      couponCode: 'RADAROFERTAS',
      currency: 'EUR',
      imageUrl: 'https://placehold.co/400x400/fce4ec/333?text=Whey+Prozis',
      description: 'Whey Protein concentrada 1kg sabor Chocolate. Com o cupão RADAROFERTAS tens 10% de desconto adicional + brinde surpresa.',
      affiliateUrl: 'https://www.prozis.com/pt/proteinas/whey-protein?ref=radarofertas',
      dealScore: '85.00',
      isMinHistoric: true,
      availability: 'InStock',
      status: 'active',
      source: 'editorial',
      categories: [catSupl.id, catProteinas.id],
    },
    {
      title: 'Prozis Vitamina C 1000mg + Zinco 120 Cápsulas',
      slug: 'prozis-vitamina-c-1000mg-zinco-120-capsulas',
      storeId: prozis.id,
      priceCurrent: '8.99',
      priceOriginal: '12.99',
      priceMinimum: '7.99',
      discountPct: '30.79',
      couponCode: 'RADAROFERTAS',
      currency: 'EUR',
      imageUrl: 'https://placehold.co/400x400/e8f5e9/333?text=Vitamina+C',
      description: 'Vitamina C 1000mg com Zinco — reforço do sistema imunitário. 120 cápsulas. Usa o cupão RADAROFERTAS.',
      affiliateUrl: 'https://www.prozis.com/pt/vitaminas/vitamina-c?ref=radarofertas',
      dealScore: '75.00',
      isMinHistoric: false,
      availability: 'InStock',
      status: 'active',
      source: 'editorial',
      categories: [catSupl.id, catVitaminas.id],
    },
    {
      title: 'Logitech G502 X PLUS Rato Gaming Sem Fios — Preto',
      slug: 'logitech-g502-x-plus-rato-gaming-sem-fios-preto',
      storeId: amazonEs.id,
      externalId: 'B0BJ7K6R5X',
      priceCurrent: '79.99',
      priceOriginal: '129.99',
      priceMinimum: '74.99',
      discountPct: '38.46',
      currency: 'EUR',
      imageUrl: 'https://placehold.co/400x400/1a1a2e/white?text=G502+X+PLUS',
      description: 'Rato gaming sem fios Logitech G502 X PLUS com sensor HERO 25K, LIGHTFORCE e LIGHTSPEED. Autonomia até 130h.',
      affiliateUrl: 'https://www.amazon.es/dp/B0BJ7K6R5X?tag=radarofertas-21',
      dealScore: '78.00',
      isMinHistoric: false,
      availability: 'InStock',
      status: 'active',
      source: 'editorial',
      categories: [catGaming.id, catPerifericos.id],
    },
    {
      title: 'Sony WH-1000XM5 Headphones Noise Cancelling — Preto',
      slug: 'sony-wh-1000xm5-headphones-noise-cancelling-preto',
      storeId: worten.id,
      priceCurrent: '249.99',
      priceOriginal: '349.99',
      priceMinimum: '229.99',
      discountPct: '28.57',
      currency: 'EUR',
      imageUrl: 'https://placehold.co/400x400/1a1a2e/white?text=WH-1000XM5',
      description: 'Headphones over-ear Sony WH-1000XM5 com cancelamento de ruído de ponta, 30h autonomia e LDAC. Preço mínimo em PT.',
      affiliateUrl: 'https://www.worten.pt/headphones-sony-wh1000xm5?ref=radar',
      dealScore: '82.00',
      isMinHistoric: false,
      availability: 'InStock',
      status: 'active',
      source: 'editorial',
      categories: [catGaming.id, catPerifericos.id],
    },
    {
      title: 'iRobot Roomba j7+ Robot Aspirador com Estação Auto-Vazio',
      slug: 'irobot-roomba-j7-plus-robot-aspirador-estacao-auto-vazio',
      storeId: amazonEs.id,
      externalId: 'B094NYRLRD',
      priceCurrent: '499.99',
      priceOriginal: '799.99',
      priceMinimum: '489.99',
      discountPct: '37.50',
      currency: 'EUR',
      imageUrl: 'https://placehold.co/400x400/e8f5e9/333?text=Roomba+j7%2B',
      description: 'Robot aspirador iRobot Roomba j7+ com estação de auto-esvaziamento. Evita obstáculos com PrecisionVision, app integrada.',
      affiliateUrl: 'https://www.amazon.es/dp/B094NYRLRD?tag=radarofertas-21',
      dealScore: '90.00',
      isMinHistoric: true,
      availability: 'InStock',
      status: 'active',
      source: 'editorial',
      categories: [catCasa.id, catRobots.id],
    },
    {
      title: 'Zumub Essential Omega 3 Fish Oil 240 Cápsulas',
      slug: 'zumub-essential-omega-3-fish-oil-240-capsulas',
      storeId: zumub.id,
      priceCurrent: '12.99',
      priceOriginal: '19.99',
      priceMinimum: '11.99',
      discountPct: '35.02',
      couponCode: 'RADAROFERTAS',
      currency: 'EUR',
      imageUrl: 'https://placehold.co/400x400/e3f2fd/333?text=Omega+3',
      description: 'Ómega 3 Fish Oil de alta pureza, 1000mg por cápsula. 240 cápsulas. Usa o cupão RADAROFERTAS para desconto extra.',
      affiliateUrl: 'https://www.zumub.com/pt/omega-3?ref=radarofertas',
      dealScore: '77.00',
      isMinHistoric: false,
      availability: 'InStock',
      status: 'active',
      source: 'editorial',
      categories: [catSupl.id, catVitaminas.id],
    },
  ]

  for (const offerData of offersData) {
    const { categories: catIds, ...offerFields } = offerData

    const [newOffer] = await db.insert(offers).values({
      ...offerFields,
      publishedAt: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000), // últimos 7 dias
    }).returning()

    // Associar categorias
    for (const catId of catIds) {
      await db.insert(offerCategories).values({
        offerId: newOffer.id,
        categoryId: catId,
      })
    }

    // Criar histórico de preços (últimos 30 dias, 1 ponto por dia)
    const basePrice = parseFloat(offerFields.priceOriginal || '0')
    const currentPrice = parseFloat(offerFields.priceCurrent || '0')
    const minPrice = parseFloat(offerFields.priceMinimum || '0')

    for (let daysAgo = 30; daysAgo >= 0; daysAgo--) {
      const recordedAt = new Date(Date.now() - daysAgo * 24 * 60 * 60 * 1000)
      let price: number

      if (daysAgo > 5) {
        // preço oscila em redor do original
        price = basePrice * (0.85 + Math.random() * 0.20)
      } else if (daysAgo > 0) {
        // desconto gradual
        price = basePrice * (0.80 + Math.random() * 0.10)
      } else {
        // hoje = preço atual
        price = currentPrice
      }

      const isMin = Math.abs(price - minPrice) < 1

      await db.insert(priceHistory).values({
        offerId: newOffer.id,
        storeId: offerFields.storeId,
        price: price.toFixed(2),
        isMinimum: isMin,
        source: 'seed',
        recordedAt,
      })
    }
  }

  console.log(`✅ ${offersData.length} ofertas criadas com histórico de preços`)
  console.log('🎉 Seed completo! RadarOfertas está pronto para desenvolvimento.')
  process.exit(0)
}

seed().catch((err) => {
  console.error('❌ Erro no seed:', err)
  process.exit(1)
})
