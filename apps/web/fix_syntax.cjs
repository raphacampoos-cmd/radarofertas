const fs = require('fs');

let c = fs.readFileSync('app/admin/page.tsx', 'utf8');

c = c.replace(/\\\/api\/admin\/trigger-discovery\\/, "'/api/admin/trigger-discovery'");
c = c.replace(/\\\/api\/admin\/trigger-newsletter\\/, "'/api/admin/trigger-newsletter'");
c = c.replace(/\\\/api\/admin\/offers\/pending\\/, "'/api/admin/offers/pending'");
c = c.replace(/\\\/api\/admin\/offers\\\/\\\/approve\\/, "`/api/admin/offers/${id}/approve`");
c = c.replace(/\\\/api\/admin\/offers\/\\/, "`/api/admin/offers/${id}`");
c = c.replace(/\\Queres aprovar "\\" e enviar para os subscritores agora mesmo?\\/, "`Queres aprovar \\"${title}\\" e enviar para os subscritores agora mesmo?`");

fs.writeFileSync('app/admin/page.tsx', c, 'utf8');
