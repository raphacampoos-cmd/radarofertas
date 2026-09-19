import { makeWASocket, DisconnectReason, initAuthCreds, BufferJSON, proto } from '@whiskeysockets/baileys'
import { Boom } from '@hapi/boom'
import pino from 'pino'
import QRCode from 'qrcode'
import { db } from '@radarofertas/db/client'
import { sql } from 'drizzle-orm'
import { BACKGROUND_JOBS_ENABLED } from './jobs.js'

export let waSocket: ReturnType<typeof makeWASocket> | null = null
export let waQrCode: string | null = null
export let waStatus: 'disconnected' | 'connecting' | 'qr_ready' | 'connected' = 'disconnected'

async function readData(key: string) {
  const rows: any = await db.execute(sql`SELECT value FROM whatsapp_auth WHERE key = ${key}`)
  const row = Array.isArray(rows) ? rows[0] : rows?.rows?.[0]
  if (!row) return null
  try { return JSON.parse(row.value, BufferJSON.reviver) } catch { return null }
}

async function writeData(key: string, value: any) {
  const s = JSON.stringify(value, BufferJSON.replacer)
  await db.execute(sql`INSERT INTO whatsapp_auth (key, value, updated_at) VALUES (${key}, ${s}, NOW()) ON CONFLICT (key) DO UPDATE SET value = ${s}, updated_at = NOW()`)
}

async function removeData(key: string) {
  await db.execute(sql`DELETE FROM whatsapp_auth WHERE key = ${key}`)
}

async function useDBAuthState() {
  const creds = (await readData('creds')) || initAuthCreds()
  return {
    state: {
      creds,
      keys: {
        get: async (type: string, ids: string[]) => {
          const data: any = {}
          for (const id of ids) {
            let v = await readData(`${type}-${id}`)
            if (type === 'app-state-sync-key' && v) v = proto.Message.AppStateSyncKeyData.fromObject(v)
            data[id] = v
          }
          return data
        },
        set: async (data: any) => {
          for (const type in data) for (const id in data[type]) {
            if (data[type][id]) await writeData(`${type}-${id}`, data[type][id])
            else await removeData(`${type}-${id}`)
          }
        }
      }
    },
    saveCreds: async () => writeData('creds', creds)
  }
}

export async function initWhatsApp() {
  // Já existe um socket a ligar/ligado: abrir outro com as mesmas credenciais faz o
  // WhatsApp substituir a sessão em loop (cada instância expulsa a outra).
  if (waSocket) return
  waStatus = 'connecting'; waQrCode = null
  const { state, saveCreds } = await useDBAuthState()
  const socket = makeWASocket({ auth: state, printQRInTerminal: true, logger: pino({ level: 'silent' }) as any, browser: ['RadarOfertas','Chrome','1.0.0'] })
  waSocket = socket
  socket.ev.on('creds.update', saveCreds)
  socket.ev.on('connection.update', async ({ connection, lastDisconnect, qr }) => {
    if (qr) { waStatus = 'qr_ready'; waQrCode = await QRCode.toDataURL(qr); console.log('QR gerado') }
    if (connection === 'close') {
      const code = (lastDisconnect?.error as Boom)?.output?.statusCode
      waStatus = 'disconnected'; waQrCode = null
      if (waSocket === socket) waSocket = null

      if (code === DisconnectReason.connectionReplaced) {
        // Outra instância (ex.: produção) assumiu a sessão. Não reconectar, senão ficam a expulsar-se mutuamente.
        console.warn('WhatsApp: sessão substituída por outra instância. Não vou reconectar automaticamente.')
        return
      }
      if (code !== DisconnectReason.loggedOut) setTimeout(() => initWhatsApp().catch(console.error), 5000)
      else { await db.execute(sql`DELETE FROM whatsapp_auth`); setTimeout(() => initWhatsApp().catch(console.error), 2000) }
    } else if (connection === 'open') {
      if (waStatus !== 'connected') console.log('WA conectado!')
      waStatus = 'connected'; waQrCode = null
    }
  })
}

export async function sendWhatsAppMessage(to: string, text: string, imageUrl?: string) {
  if (waStatus !== 'connected' || !waSocket) { if (BACKGROUND_JOBS_ENABLED) initWhatsApp().catch(console.error); return false }
  try {
    const jid = to.includes('@') ? to : `${to}@s.whatsapp.net`
    if (imageUrl) await waSocket.sendMessage(jid, { image: { url: imageUrl }, caption: text })
    else await waSocket.sendMessage(jid, { text })
    return true
  } catch (e) { console.error('WA send error:', e); return false }
}

if (BACKGROUND_JOBS_ENABLED) initWhatsApp().catch(console.error)
