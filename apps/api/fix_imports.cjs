const fs = require('fs');
let c = fs.readFileSync('src/routes/admin.ts', 'utf16le');
if(!c.includes('import')) c = fs.readFileSync('src/routes/admin.ts', 'utf8');

c = c.replace(
  `import { offers, clicks, priceHistory, subscribers, comments } from '@radarofertas/db/schema'`, 
  `import { offers, clicks, priceHistory, subscribers, comments, categories, offerCategories } from '@radarofertas/db/schema'`
);

fs.writeFileSync('src/routes/admin.ts', c, 'utf8');
