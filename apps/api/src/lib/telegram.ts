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

    const post = (method: 'sendPhoto' | 'sendMessage', body: Record<string, unknown>) =>
      fetch(`https://api.telegram.org/bot${TELEGRAM_TOKEN}/${method}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ chat_id: TELEGRAM_CHAT_ID, parse_mode: 'Markdown', ...body }),
      });

    let res: Response;
    if (offer.imageUrl) {
      res = await post('sendPhoto', { photo: offer.imageUrl, caption: text });
      if (!res.ok) {
        // A imagem pode já não existir na loja (404): enviar só o texto em vez de perder o alerta
        console.warn('Telegram: falha ao enviar a foto, a enviar só o texto:', await res.text());
        res = await post('sendMessage', { text, disable_web_page_preview: false });
      }
    } else {
      res = await post('sendMessage', { text, disable_web_page_preview: false });
    }

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

/**
 * Envia texto já formatado directamente para o canal — sem reformatar.
 * Usado pelo telegram-daily para controlar totalmente o copy da mensagem.
 */
export async function sendRawTelegram(text: string, imageUrl?: string) {
  const TOKEN = process.env.TELEGRAM_BOT_TOKEN || '8889237428:AAHE1qahwf3OkCZ9KHxXTVNkOoYSe7IDXpI'
  const CHAT = process.env.TELEGRAM_CHANNEL_ID || '@radarofertaspt'

  const post = (method: 'sendPhoto' | 'sendMessage', body: Record<string, unknown>) =>
    fetch(`https://api.telegram.org/bot${TOKEN}/${method}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ chat_id: CHAT, parse_mode: 'Markdown', ...body }),
    })

  try {
    let res: Response
    if (imageUrl) {
      res = await post('sendPhoto', { photo: imageUrl, caption: text })
      if (!res.ok) {
        console.warn('Telegram: imagem falhou, a enviar só texto.')
        res = await post('sendMessage', { text })
      }
    } else {
      res = await post('sendMessage', { text })
    }

    if (res.ok) {
      console.log('✅ Mensagem enviada para o Telegram.')
    } else {
      console.error('❌ Telegram error:', await res.text())
    }
  } catch (err) {
    console.error('Erro sendRawTelegram:', err)
  }
}
