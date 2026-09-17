const API = "https://radarofertas-api-production.up.railway.app";
const KEY = "radar_admin_secret_change_in_production";

async function run() {
  console.log("A obter ofertas...");
  const res = await fetch(`${API}/api/offers?limit=100`);
  const data = await res.json();
  const offers = data.data || [];

  let deleted = 0;
  for (const o of offers) {
    if (o.imageUrl && (o.imageUrl.includes('/images/P/') || o.imageUrl.includes('placehold.co'))) {
      await fetch(`${API}/api/admin/offers/${o.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', 'x-admin-key': KEY },
        body: JSON.stringify({ status: 'deleted' })
      });
      deleted++;
    }
  }
  console.log(`🧹 Limpeza concluída: ${deleted} ofertas marcadas como apagadas.`);

  const newOffers = [
    {
      title: "Consola Sony PlayStation 5 Slim Digital Edition",
      storeId: 1, // Amazon
      priceCurrent: 399.99,
      priceOriginal: 449.99,
      affiliateUrl: "https://www.amazon.es/dp/B0CL5KNB9M?tag=radaroferta0c-21",
      imageUrl: "https://m.media-amazon.com/images/I/51FjXk0L+rL._AC_SL1500_.jpg",
      description: "A mais recente versão da PS5 (Modelo Slim), sem leitor de discos, 1TB de armazenamento. Ideal para poupar espaço.",
      categoryIds: [1, 2], // Gaming, Consolas
      source: "editorial"
    },
    {
      title: "Ninja AF100EU Air Fryer 3.8L - Fritadeira Sem Óleo",
      storeId: 1,
      priceCurrent: 99.99,
      priceOriginal: 149.99,
      affiliateUrl: "https://www.amazon.es/dp/B07WVMJHGZ?tag=radaroferta0c-21",
      imageUrl: "https://m.media-amazon.com/images/I/71R246k76OL._AC_SL1500_.jpg",
      description: "Uma das fritadeiras mais bem cotadas da Amazon. 1500W, cesto de 3.8L ideal para casais ou solteiros.",
      categoryIds: [5, 7], // Casa, Air Fryers
      source: "editorial"
    },
    {
      title: "Optimum Nutrition Gold Standard 100% Whey (Chocolate)",
      storeId: 1,
      priceCurrent: 54.99,
      priceOriginal: 74.99,
      affiliateUrl: "https://www.amazon.es/dp/B000QSNYGI?tag=radaroferta0c-21",
      imageUrl: "https://m.media-amazon.com/images/I/716uY16-J-L._AC_SL1500_.jpg",
      description: "Embalagem de 2.27kg (74 doses). A proteína de soro de leite mais vendida do mundo.",
      categoryIds: [8, 9], // Suplementacao, Proteinas
      source: "editorial"
    },
    {
      title: "iRobot Roomba i5+ (Robot Aspirador com Esvaziamento Automático)",
      storeId: 1,
      priceCurrent: 349.00,
      priceOriginal: 499.00,
      affiliateUrl: "https://www.amazon.es/dp/B09DD9HRNS?tag=radaroferta0c-21",
      imageUrl: "https://m.media-amazon.com/images/I/71pE4N2lqJL._AC_SL1500_.jpg",
      description: "Aspirador inteligente que se esvazia sozinho na torre. Navegação linha a linha e app iRobot Home.",
      categoryIds: [5, 6], // Casa, Robots de Limpeza
      source: "editorial"
    }
  ];

  console.log("A injetar ofertas com qualidade HQ...");
  for (const no of newOffers) {
    const r = await fetch(`${API}/api/admin/offers`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'x-admin-key': KEY },
      body: JSON.stringify(no)
    });
    const d = await r.json();
    if (r.ok) {
      console.log(`✅ Adicionada: ${no.title}`);
    } else {
      console.log(`❌ Falha na ${no.title}:`, d.error);
    }
    // Aguardar 3 segundos entre envios para o Telegram processar as fotos sem flood
    await new Promise(r => setTimeout(r, 3000));
  }
}

run().catch(console.error);
