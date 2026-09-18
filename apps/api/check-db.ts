import { db } from '@radarofertas/db/client';
import { categories, stores, offers } from '@radarofertas/db/schema';
import { eq, sql } from 'drizzle-orm';

async function main() {
  const cats = await db.select().from(categories);
  console.log('Categories:', cats);
  
  const st = await db.select().from(stores);
  console.log('Stores:', st);
  
  const totalOffers = await db.select({ count: sql`count(*)` }).from(offers).where(eq(offers.status, 'active'));
  console.log('Total Active Offers:', totalOffers);
  
  process.exit(0);
}
main();
