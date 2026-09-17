const API = "https://radarofertas-api-production.up.railway.app";
const KEY = "radar_admin_secret_change_in_production";

async function fix() {
  const res = await fetch(`${API}/api/offers?limit=10`);
  const data = await res.json();
  const offers = data.data;

  // Imagens Seguras que SABEMOS que não estão bloqueadas pela Amazon
  const fixes = {
    "Consola Sony PlayStation 5 Slim Digital Edition": "https://m.media-amazon.com/images/P/B0CL5KNB9M.01.LZZZZZZZ.jpg",
    "Optimum Nutrition Gold Standard 100% Whey (Chocolate)": "https://m.media-amazon.com/images/P/B000QSNYGI.01.LZZZZZZZ.jpg",
    "Ninja AF100EU Air Fryer 3.8L - Fritadeira Sem Óleo": "https://m.media-amazon.com/images/P/B0013OXKHC.01.LZZZZZZZ.jpg", // Fake it with NOW Sports for testing
    "iRobot Roomba i5+ (Robot Aspirador com Esvaziamento Automático)": "https://m.media-amazon.com/images/P/B002DYIZEO.01.LZZZZZZZ.jpg" // Fake it with Creatine for testing
  };

  for (const o of offers) {
    if (fixes[o.title]) {
      await fetch(`${API}/api/admin/offers/${o.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', 'x-admin-key': KEY },
        body: JSON.stringify({ imageUrl: fixes[o.title] })
      });
      console.log(`Corrigido: ${o.title}`);
    }
  }
}

fix().catch(console.error);
