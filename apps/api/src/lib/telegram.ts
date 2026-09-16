const TELEGRAM_TOKEN = process.env.TELEGRAM_BOT_TOKEN || '8889237428:AAHE1qahwf3OkCZ9KHxXTVNkOoYSe7IDXpI';
// Canal público
export let TELEGRAM_CHAT_ID = process.env.TELEGRAM_CHANNEL_ID || '@radarofertaspt'; 

export function setTelegramChannel(channel: string) {
  TELEGRAM_CHAT_ID = channel;
}

export async function sendTelegramAlert(offer: {
  title: string;
  priceCurrent: string | number;
  priceOriginal?: string | number;
  discountPct?: string | number;
  affiliateUrl: string;
  imageUrl?: string;
  couponCode?: string;
}) {
  if (!TELEGRAM_CHAT_ID || TELEGRAM_CHAT_ID.includes('substituir')) {
    console.log('Telegram não configurado. Ignorando envio.');
    return;
  }

  try {
    let text = `🚨 *OFERTA DETETADA!* 🚨\n\n`;
    text += `📦 *${offer.title}*\n\n`;
    
    const current = Number(offer.priceCurrent);
    const original = offer.priceOriginal ? Number(offer.priceOriginal) : 0;

    if (original > current) {
      const discount = Math.round(((original - current) / original) * 100);
      text += `💰 Preço: *€${current.toFixed(2)}* ~~(antes €${original.toFixed(2)})~~\n`;
      text += `📉 Desconto: *${discount}%*\n`;
    } else {
      text += `💰 Preço: *€${current.toFixed(2)}*\n`;
    }
    
    if (offer.couponCode) {
      text += `🎟️ Cupão: \`${offer.couponCode}\`\n`;
    }
    
    text += `\n🛒 *Compra aqui:* [Aceder à Loja](${offer.affiliateUrl})`;

    const url = offer.imageUrl 
      ? `https://api.telegram.org/bot${TELEGRAM_TOKEN}/sendPhoto` 
      : `https://api.telegram.org/bot${TELEGRAM_TOKEN}/sendMessage`;
    
    const payload: any = {
      chat_id: TELEGRAM_CHAT_ID,
      parse_mode: 'Markdown',
    };

    if (offer.imageUrl) {
      payload.photo = offer.imageUrl;
      payload.caption = text;
    } else {
      payload.text = text;
      // desativar preview de link se não houver foto para ficar mais limpo
      payload.disable_web_page_preview = false; 
    }

    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      const err = await res.text();
      console.error('Erro na API do Telegram:', err);
    } else {
      console.log('✅ Alerta enviado para o Telegram com sucesso!');
    }
  } catch (err) {
    console.error('Erro ao enviar mensagem para o Telegram:', err);
  }
}
