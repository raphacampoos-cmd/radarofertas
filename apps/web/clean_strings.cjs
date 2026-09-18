const fs = require('fs');
let c = fs.readFileSync('app/admin/page.tsx', 'utf8');

c = c.replace(/\\\/api\/admin\/trigger-discovery\\/, "`${API_URL}/api/admin/trigger-discovery`");
c = c.replace(/\\\/api\/admin\/trigger-newsletter\\/, "`${API_URL}/api/admin/trigger-newsletter`");
c = c.replace(/\\\/api\/admin\/offers\/pending\\/, "`${API_URL}/api/admin/offers/pending`");
c = c.replace(/\\\/api\/admin\/offers\\\/\\\/approve\\/, "`${API_URL}/api/admin/offers/${id}/approve`");
c = c.replace(/\\\/api\/admin\/offers\/\\/, "`${API_URL}/api/admin/offers/${id}`");
c = c.replace(/\\Queres aprovar "\\" e enviar para os subscritores agora mesmo?\\/, "`Queres aprovar \\"${title}\\" e enviar para os subscritores agora mesmo?`");
c = c.replace(/\\Queres aprovar \\"\\/, "`Queres aprovar \\"");
c = c.replace(/\\" e enviar para os subscritores agora mesmo?\\/, "\\\" e enviar para os subscritores agora mesmo?`");

fs.writeFileSync('app/admin/page.tsx', c, 'utf8');
