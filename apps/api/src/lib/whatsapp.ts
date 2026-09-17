import { makeWASocket, useMultiFileAuthState, DisconnectReason } from '@whiskeysockets/baileys';
import { Boom } from '@hapi/boom';
import pino from 'pino';
import QRCode from 'qrcode';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Vamos guardar a sessão na pasta temporária ou local para não estar sempre a pedir QR
const AUTH_DIR = path.join(__dirname, '../../whatsapp_auth');

export let waSocket: ReturnType<typeof makeWASocket> | null = null;
export let waQrCode: string | null = null;
export let waStatus: 'disconnected' | 'connecting' | 'qr_ready' | 'connected' = 'disconnected';

export async function initWhatsApp() {
  waStatus = 'connecting';
  
  const { state, saveCreds } = await useMultiFileAuthState(AUTH_DIR);

  waSocket = makeWASocket({
    auth: state,
    printQRInTerminal: true,
    logger: pino({ level: 'silent' }) as any,
    browser: ['RadarOfertas', 'Chrome', '1.0.0']
  });

  waSocket.ev.on('creds.update', saveCreds);

  waSocket.ev.on('connection.update', async (update) => {
    const { connection, lastDisconnect, qr } = update;

    if (qr) {
      waStatus = 'qr_ready';
      // Gerar o Base64 do QR code para enviar para a Dashboard
      waQrCode = await QRCode.toDataURL(qr);
      console.log('WhatsApp QR Code gerado. Pronto para leitura.');
    }

    if (connection === 'close') {
      const shouldReconnect = (lastDisconnect?.error as Boom)?.output?.statusCode !== DisconnectReason.loggedOut;
      console.log('Ligação do WhatsApp caiu. Motivo:', lastDisconnect?.error, 'Tentar de novo?', shouldReconnect);
      
      waStatus = 'disconnected';
      waQrCode = null;
      waSocket = null;

      if (shouldReconnect) {
        setTimeout(initWhatsApp, 5000);
      } else {
        console.log('WhatsApp deslogado. É preciso apagar a pasta auth e ler novo QR.');
        fs.rmSync(AUTH_DIR, { recursive: true, force: true });
        setTimeout(initWhatsApp, 2000);
      }
    } else if (connection === 'open') {
      console.log('✅ WhatsApp conectado com sucesso!');
      waStatus = 'connected';
      waQrCode = null;
    }
  });
}

// Função para disparar a mensagem para um número ou grupo
export async function sendWhatsAppMessage(to: string, text: string, imageUrl?: string) {
  if (waStatus !== 'connected' || !waSocket) {
    console.error('Tentativa de enviar mensagem WhatsApp falhou: Bot não conectado.');
    return false;
  }

  try {
    // Formatar o número para o padrão do Baileys (com @s.whatsapp.net ou @g.us)
    let jid = to;
    if (!jid.includes('@')) {
      jid = `${jid}@s.whatsapp.net`; 
    }

    if (imageUrl) {
      await waSocket.sendMessage(jid, {
        image: { url: imageUrl },
        caption: text
      });
    } else {
      await waSocket.sendMessage(jid, { text });
    }
    return true;
  } catch (err) {
    console.error('Erro ao enviar mensagem WhatsApp:', err);
    return false;
  }
}
