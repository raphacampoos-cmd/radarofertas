const API = process.env.API_URL || "https://radarofertas-api-production.up.railway.app";
const KEY = process.env.ADMIN_KEY || "radar_admin_secret_change_in_production";
const UA = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36";

async function extractAmazonPrice(html) {
  // Tentar encontrar o preço no formato europeu (ex: 54,99)
  const priceWholeMatch = html.match(/<span class="a-price-whole">([0-9.,]+)<\/span>/);
  const priceFractionMatch = html.match(/<span class="a-price-fraction">([0-9]+)<\/span>/);
  
  if (priceWholeMatch) {
    let whole = priceWholeMatch[1].replace(/[^0-9]/g, '');
    let fraction = priceFractionMatch ? priceFractionMatch[1] : '00';
    return parseFloat(`${whole}.${fraction}`);
  }

  // Fallback para meta tags ou scripts
  const offscreenMatch = html.match(/<span class="a-offscreen">[^\d]*([0-9.,]+)[^\d]*<\/span>/);
  if (offscreenMatch) {
    return parseFloat(offscreenMatch[1].replace(',', '.'));
  }

  return null;
}

async function checkPrice(offer) {
  try {
    const res = await fetch(offer.affiliateUrl, {
      headers: {
        'User-Agent': UA,
        'Accept': 'text/html',
        'Accept-Language': 'pt-PT,pt;q=0.9'
      },
      signal: AbortSignal.timeout(15000)
    });
    
    if (!res.ok) return null;
    const html = await res.text();
    let currentPrice = null;

    if (offer.affiliateUrl.includes('amazon')) {
      currentPrice = await extractAmazonPrice(html);
    } 
    // Espaço para adicionar scrapers da Worten, PCDiga, etc futuramente
    
    return currentPrice;
  } catch (e) {
    return null;
  }
}

async function main() {
  console.log(`🤖 Iniciando Agente Rastreador de Preços...`);
  
  // 1. Obter ofertas da nossa API
  const allOffers = [];
  for (let p = 1; p <= 5; p++) {
    const res = await fetch(`${API}/api/offers?limit=20&page=${p}`);
    const json = await res.json();
    allOffers.push(...json.data);
    if (json.data.length < 20) break;
  }

  console.log(`📦 Encontradas ${allOffers.length} ofertas para rastrear.`);
  let updatedCount = 0;

  for (const offer of allOffers) {
    if (!offer.affiliateUrl || !offer.affiliateUrl.includes('amazon')) continue; // Por agora focado na Amazon

    const oldPrice = parseFloat(offer.priceCurrent);
    console.log(`\n🔍 Verificando: ${offer.title.slice(0,40)} (Atual: ${oldPrice}€)`);
    
    const newPrice = await checkPrice(offer);
    
    if (newPrice && newPrice > 0) {
      if (newPrice < oldPrice) {
        console.log(`   📉 BAIXOU! De ${oldPrice}€ para ${newPrice}€! A atualizar...`);
        
        // Atualizar na API
        await fetch(`${API}/api/admin/offers/${offer.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json', 'x-admin-key': KEY },
          body: JSON.stringify({ priceCurrent: newPrice })
        });
        updatedCount++;
      } else if (newPrice > oldPrice) {
        console.log(`   📈 Subiu para ${newPrice}€. (Ignorando atualização automática de subidas por agora)`);
      } else {
        console.log(`   ⏸️ Preço manteve-se (${newPrice}€).`);
      }
    } else {
      console.log(`   ⚠️ Não foi possível extrair o preço (Amazon bot-check).`);
    }

    // Esperar 3 segundos para não ser bloqueado
    await new Promise(r => setTimeout(r, 3000));
  }

  console.log(`\n✅ Relatório: ${updatedCount} preços atualizados.`);
}

main().catch(console.error);
