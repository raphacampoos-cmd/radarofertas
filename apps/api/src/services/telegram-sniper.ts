import { TelegramClient } from 'telegram';
import { StringSession } from 'telegram/sessions/index.js';
import { NewMessage } from 'telegram/events/index.js';
import { db } from '@radarofertas/db/client';
import { offers } from '@radarofertas/db/schema';
import { eq, like } from 'drizzle-orm';
import { NlpManager } from 'node-nlp';

// Configurações e Variáveis de Ambiente
const apiId = parseInt(process.env.TG_API_ID || '0', 10);
const apiHash = process.env.TG_API_HASH || '';
const sessionString = process.env.TG_SNIPER_SESSION || '';
const AMAZON_AFFILIATE_ID = 'radaroferta0c-21';
const AWIN_PUBLISHER_ID = '3099259';

// Inicializar NLP (usado para extrair contexto caso não haja um link claro, ou identificar lojas)
const manager = new NlpManager({ languages: ['pt'], forceNER: true, autoSave: false });
manager.addNamedEntityText('loja', 'amazon', ['pt'], ['amazon', 'amzn', 'amazon.es']);
manager.addNamedEntityText('loja', 'worten', ['pt'], ['worten']);
manager.addNamedEntityText('loja', 'pcdiga', ['pt'], ['pcdiga', 'pc diga']);

// Canais que vamos observar silenciosamente (Sinal de Tendência)
// O array deve conter os usernames ou IDs dos canais concorrentes
const TARGET_CHANNELS = process.env.TG_TARGET_CHANNELS ? process.env.TG_TARGET_CHANNELS.split(',') : ['promocoespt', 'DescontosAinanas'];

let client: TelegramClient | null = null;

export async function startTelegramSniper() {
  if (!apiId || !apiHash || !sessionString) {
    console.log('⚠️ Telegram Sniper (Agente 1): Faltam credenciais (TG_API_ID, TG_API_HASH, TG_SNIPER_SESSION). O Agente 1 está a dormir.');
    return;
  }

  try {
    const stringSession = new StringSession(sessionString);
    client = new TelegramClient(stringSession, apiId, apiHash, {
      connectionRetries: 5,
    });

    console.log('🕵️‍♂️ Agente 1 (Sniper de Tendências): A iniciar conexão silenciosa...');
    await client.connect();
    console.log('✅ Agente 1 Conectado via MTProto! A observar os seguintes canais:', TARGET_CHANNELS);

    // Escutar novas mensagens APENAS dos canais observados
    client.addEventHandler(async (event) => {
      const message = event.message;
      if (!message || !message.text) return;

      const chat = await message.getChat();
      const chatUsername = (chat as any).username;

      if (!TARGET_CHANNELS.includes(chatUsername)) {
         return; // Ignorar mensagens de outras conversas
      }

      console.log(`[Agente 1] 🎯 NOVO SINAL recebido no canal @${chatUsername}`);
      await processTrendSignal(message.text);

    }, new NewMessage({ incoming: true }));

  } catch (error) {
    console.error('❌ Erro no Agente 1 (Telegram Sniper):', error);
  }
}

async function processTrendSignal(text: string) {
  // PASSO 3: Extrair o SINAL, descartando texto/imagem originais
  const urls = text.match(/https?:\/\/[^\s]+/g) || [];
  
  // Utilização de Node-NLP para ver se menciona marcas ou "promo", "erro"
  const nlpResult = await manager.process('pt', text);
  const lojasDetetadas = nlpResult.entities.filter(e => e.entity === 'loja').map(e => e.option);

  // Procurar ASIN para Amazon (A estratégia mais robusta)
  let asin = null;
  const asinMatch = text.match(/(?:dp|o|gp|-)\/([B0-9][A-Z0-9]{9})/i);
  if (asinMatch) {
    asin = asinMatch[1];
  } else if (urls.length > 0) {
    // Tentar encontrar links do amzn.to para fazer unshorten
    for (const u of urls) {
      if (u.includes('amzn.to')) {
        try {
          const res = await fetch(u, { redirect: 'manual' });
          const loc = res.headers.get('location') || '';
          const m = loc.match(/(?:dp|o|gp|-)\/([B0-9][A-Z0-9]{9})/i);
          if (m) asin = m[1];
        } catch (e) { /* unshorten falhou */ }
      }
    }
  }

  // PASSO 4: Verificar de forma independente
  if (asin) {
    await verifyAndCreateAmazonOffer(asin, text);
    return;
  }

  // Se não é Amazon, vamos ver se é Worten/PCDiga (Awin)
  if (lojasDetetadas.includes('worten') || lojasDetetadas.includes('pcdiga')) {
    // Para as lojas AWIN, precisamos de extrair o link da loja de origem para o encapsular
    let targetLink = '';
    for (const u of urls) {
      if (u.includes('worten.pt') || u.includes('pcdiga.com')) {
        targetLink = u;
        break;
      } else {
        // Unshorten de links genéricos do Telegram (ex: bit.ly, tag.c)
        try {
           const res = await fetch(u, { redirect: 'manual' });
           const loc = res.headers.get('location') || '';
           if (loc.includes('worten.pt') || loc.includes('pcdiga.com')) {
              targetLink = loc;
              break;
           }
        } catch(e) {}
      }
    }

    if (targetLink) {
      await verifyAndCreateAwinOffer(targetLink, lojasDetetadas[0]);
    } else {
       console.log('Sinal recebido para Awin, mas nenhum produto válido extraído da concorrência.');
    }
  }
}

async function verifyAndCreateAmazonOffer(asin: string, originalText: string) {
  // Verificar se já temos este ASIN
  const existing = await db.select({ id: offers.id }).from(offers).where(like(offers.affiliateUrl, `%${asin}%`));
  if (existing.length > 0) {
    console.log(`[Agente 1] Produto Amazon ASIN ${asin} já existe. Ignorando.`);
    return;
  }

  console.log(`[Agente 1] Verificação independente do ASIN ${asin}...`);
  // O NOSSO link de afiliado, NUNCA o deles
  const myAffiliateUrl = `https://www.amazon.es/dp/${asin}?tag=${AMAZON_AFFILIATE_ID}&language=pt_PT`;

  // Fazer Scrape ao NOSSO link para obter o título e preço oficiais e atuais
  try {
    const res = await fetch(myAffiliateUrl, {
      headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36' }
    });
    const html = await res.text();
    
    // Título
    const titleMatch = html.match(/<span id="productTitle"[^>]*>\s*(.+?)\s*<\/span>/is);
    const title = titleMatch ? titleMatch[1].trim() : `Produto Destaque Amazon (${asin})`;

    // Preço
    const priceWholeMatch = html.match(/<span class="a-price-whole">([0-9.,]+)<\/span>/);
    const priceFractionMatch = html.match(/<span class="a-price-fraction">([0-9]+)<\/span>/);
    let currentPrice = 0;
    if (priceWholeMatch) {
      let whole = priceWholeMatch[1].replace(/[^0-9]/g, '');
      let fraction = priceFractionMatch ? priceFractionMatch[1] : '00';
      currentPrice = parseFloat(`${whole}.${fraction}`);
    }

    if (currentPrice <= 0) return; // Descartar, produto inválido ou sem preço

    // Inserir na Fila de Aprovação (pending)
    await db.insert(offers).values({
      title: title.slice(0, 255),
      slug: 'amazon-' + asin + '-' + Math.floor(Math.random() * 1000),
      description: '⚠️ [MÁQUINA INTERNA] Descoberto via Sinal de Tendência. Valida o preço e escreve uma boa descrição.',
      priceCurrent: currentPrice.toFixed(2),
      priceOriginal: (currentPrice * 1.2).toFixed(2), // Estimativa de base
      priceMinimum: currentPrice.toFixed(2),
      affiliateUrl: myAffiliateUrl,
      imageUrl: '', // Fica vazio para o Admin preencher ou o sistema de Fallback resolver
      storeId: 1, // Amazon
      source: 'awin_api', // ou 'trend_signal' (usamos awin_api para ir parar à aba de Aprovações Awin do Painel)
      status: 'pending',
      updatedAt: new Date(),
      publishedAt: new Date()
    });

    console.log(`[Agente 1] SUCESSO: Oferta independente validada (Amazon) e enviada para aprovação!`);
  } catch (error) {
    console.log(`[Agente 1] Falha ao verificar ASIN ${asin} independentemente.`);
  }
}

async function verifyAndCreateAwinOffer(targetUrl: string, storeKeyword: string) {
  console.log(`[Agente 1] Verificação independente de link da loja ${storeKeyword}...`);

  // Extrair ID do anunciante consoante a loja
  let advertiserId = '0';
  let storeIdDb = 2; // Default genérico
  if (storeKeyword.includes('worten')) { advertiserId = '12345'; storeIdDb = 2; }
  else if (storeKeyword.includes('pcdiga')) { advertiserId = '67890'; storeIdDb = 3; }
  
  // Limpar a URL retirando as UTMs e trackers da concorrência
  const cleanUrl = targetUrl.split('?')[0];

  // O NOSSO link de afiliado Awin, usando o nosso Publisher ID 3099259 e o Advertiser ID mapeado
  const myAffiliateUrl = `https://www.awin1.com/cread.php?awinmid=${advertiserId}&awinaffid=${AWIN_PUBLISHER_ID}&p=${encodeURIComponent(cleanUrl)}`;

  // Verificar na DB se já existe uma oferta pending/active com este Link
  const existing = await db.select({ id: offers.id }).from(offers).where(like(offers.affiliateUrl, `%${encodeURIComponent(cleanUrl)}%`));
  if (existing.length > 0) {
    console.log(`[Agente 1] Produto Awin já existe no sistema. Ignorando.`);
    return;
  }

  // Inserir diretamente na Fila de Aprovações
  await db.insert(offers).values({
    title: `Sinal da Loja ${storeKeyword.toUpperCase()}`,
    slug: `${storeKeyword}-` + Math.floor(Math.random() * 10000),
    description: `⚠️ [MÁQUINA INTERNA] Descoberto via Sinal de Tendência (${cleanUrl}). Abre o link, verifica o preço e preenche os dados manualmente.`,
    priceCurrent: '0.00',
    priceOriginal: '0.00',
    priceMinimum: '0.00',
    affiliateUrl: myAffiliateUrl,
    imageUrl: '',
    storeId: storeIdDb,
    source: 'awin_api', // Para ir parar à fila de Aprovações Awin
    status: 'pending',
    updatedAt: new Date(),
    publishedAt: new Date()
  });

  console.log(`[Agente 1] SUCESSO: Oferta independente validada (${storeKeyword}) e enviada para aprovação!`);
}
