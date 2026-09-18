import { db } from '@radarofertas/db/client';
import { categories, offers, offerCategories } from '@radarofertas/db/schema';
import { eq, isNull } from 'drizzle-orm';

const REQUIRED_CATEGORIES = [
  { name: 'Gaming', slug: 'gaming', icon: '🎮' },
  { name: 'Tecnologia & Informática', slug: 'tecnologia-e-informatica', icon: '💻' },
  { name: 'Smartphones & Acessórios', slug: 'smartphones-e-acessorios', icon: '📱' },
  { name: 'Casa & Eletrodomésticos', slug: 'casa-e-eletrodomesticos', icon: '🏠' },
  { name: 'Beleza & Saúde', slug: 'beleza-e-saude', icon: '🧴' },
  { name: 'Desporto & Ar Livre', slug: 'desporto-e-ar-livre', icon: '⚽' },
  { name: 'Suplementação', slug: 'suplementacao', icon: '💪' },
  { name: 'Eletrónica Recondicionada', slug: 'eletronica-recondicionada', icon: '♻️' },
  { name: 'Brinquedos & Bebé', slug: 'brinquedos-e-bebe', icon: '🧸' }
];

export async function seedAndCleanupCategories() {
  console.log('--- INICIANDO SEED DE CATEGORIAS ---');
  let fallbackCategoryId = null;

  for (let i = 0; i < REQUIRED_CATEGORIES.length; i++) {
    const cat = REQUIRED_CATEGORIES[i];
    const existing = await db.select().from(categories).where(eq(categories.slug, cat.slug));
    
    let catId;
    if (existing.length === 0) {
      console.log(`Criando categoria: ${cat.name}`);
      const inserted = await db.insert(categories).values({
        name: cat.name,
        slug: cat.slug,
        icon: cat.icon,
        active: true,
        sortOrder: i
      }).returning({ id: categories.id });
      catId = inserted[0].id;
    } else {
      catId = existing[0].id;
      // Atualizar sortOrder se necessário
      await db.update(categories).set({ sortOrder: i, icon: cat.icon }).where(eq(categories.id, catId));
    }

    if (cat.slug === 'tecnologia-e-informatica') {
      fallbackCategoryId = catId;
    }
  }

  console.log('--- LIMPANDO OFERTAS SEM CATEGORIA ---');
  const allOffers = await db.select().from(offers);
  for (const offer of allOffers) {
    const rels = await db.select().from(offerCategories).where(eq(offerCategories.offerId, offer.id));
    if (rels.length === 0 && fallbackCategoryId) {
      console.log(`Oferta [${offer.title}] sem categoria. Atribuindo Fallback (Tecnologia).`);
      await db.insert(offerCategories).values({
        offerId: offer.id,
        categoryId: fallbackCategoryId
      });
    }
  }
  
  console.log('--- CONCLUIDO ---');
  process.exit(0);
}

seedAndCleanupCategories().catch(console.error);
