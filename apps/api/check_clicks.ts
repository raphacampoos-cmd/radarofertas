import { db } from '@radarofertas/db/client';
import { sql } from 'drizzle-orm';

async function run() {
  const res = await db.execute(sql`
    SELECT o.title, COUNT(c.id) as total_clicks 
    FROM clicks c 
    JOIN offers o ON c.offer_id = o.id 
    GROUP BY o.title 
    ORDER BY total_clicks DESC 
    LIMIT 10
  `);
  console.log(JSON.stringify(res, null, 2));
  process.exit(0);
}
run();
