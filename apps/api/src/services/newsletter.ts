import { Resend } from 'resend'
import { db } from '@radarofertas/db/client'
import { offers, subscribers } from '@radarofertas/db/schema'
import { eq, desc, and } from 'drizzle-orm'

// Gerador do Design do Email
function generateNewsletterHtml(topOffers: any[]) {
// ... keep html generator unchanged
  const offersHtml = topOffers.map(offer => `
    <div style="background: #ffffff; border-radius: 12px; padding: 20px; margin-bottom: 20px; border: 1px solid #e2e8f0; display: flex; align-items: center; gap: 20px;">
      <div style="flex-shrink: 0; width: 120px; height: 120px; background: #f8fafc; border-radius: 8px; display: flex; align-items: center; justify-content: center; overflow: hidden;">
        ${offer.imageUrl ? `<img src="${offer.imageUrl}" alt="${offer.title}" style="max-width: 100%; max-height: 100%; object-fit: contain;" />` : '📦'}
      </div>
      <div style="flex-grow: 1;">
        <h3 style="margin: 0 0 8px 0; font-size: 16px; color: #0f172a; line-height: 1.4;">${offer.title}</h3>
        <div style="display: flex; align-items: baseline; gap: 8px; margin-bottom: 12px;">
          <span style="font-size: 24px; font-weight: 800; color: #ef4444;">€${offer.priceCurrent}</span>
          <span style="font-size: 14px; color: #94a3b8; text-decoration: line-through;">€${offer.priceOriginal}</span>
          <span style="background: #fef2f2; color: #ef4444; padding: 4px 8px; border-radius: 4px; font-size: 12px; font-weight: bold;">-${offer.discountPct}%</span>
        </div>
        <a href="https://radarofertas-psi.vercel.app/oferta/${offer.slug}" style="display: inline-block; background: #f97316; color: #ffffff; text-decoration: none; padding: 10px 20px; border-radius: 6px; font-weight: bold; font-size: 14px;">🛒 Ver Pechincha</a>
      </div>
    </div>
  `).join('')

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
    </head>
    <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #f1f5f9; padding: 20px; margin: 0;">
      <div style="max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);">
        <!-- Header -->
        <div style="background: #0f172a; padding: 30px 20px; text-align: center;">
          <h1 style="color: #ffffff; margin: 0; font-size: 24px;">RadarOfertas PT</h1>
          <p style="color: #94a3b8; margin: 10px 0 0 0; font-size: 16px;">O Top 5 Pechinchas da Semana 🔥</p>
        </div>
        
        <!-- Body -->
        <div style="padding: 30px 20px; background: #f8fafc;">
          <p style="font-size: 16px; color: #334155; margin-bottom: 30px;">Olá! Como prometido, os nossos robôs vasculharam milhares de preços e encontraram as quedas mais brutais dos últimos dias. Aqui estão elas:</p>
          
          ${offersHtml}

          <div style="text-align: center; margin-top: 40px;">
            <a href="https://radarofertas-psi.vercel.app" style="color: #f97316; text-decoration: none; font-weight: bold; font-size: 16px;">Ver mais de 100 ofertas no site 🎯</a>
          </div>
        </div>

        <!-- Footer -->
        <div style="background: #e2e8f0; padding: 20px; text-align: center; font-size: 12px; color: #64748b;">
          <p style="margin: 0;">Recebeste este email porque te inscreveste no RadarOfertas.</p>
          <p style="margin: 10px 0 0 0;">© ${new Date().getFullYear()} RadarOfertas PT</p>
        </div>
      </div>
    </body>
    </html>
  `
}

export async function sendWeeklyNewsletter(isTest = false, testEmail?: string) {
  const apiKey = process.env.RESEND_API_KEY
  if (!apiKey || apiKey.includes('dummy')) {
    console.log('⚠️ RESEND_API_KEY não configurada. A cancelar envio da newsletter.')
    return { success: false, error: 'API Key do Resend em falta.' }
  }

  // Inicialização Correta: Só criamos a instância se a chave existir e for válida.
  const resend = new Resend(apiKey)

  try {
    // 1. Ir buscar o TOP 5 Ofertas Ativas
    const topOffers = await db.select()
      .from(offers)
      .where(eq(offers.status, 'active'))
      .orderBy(desc(offers.dealScore))
      .limit(5)

    if (topOffers.length === 0) return { success: false, error: 'Sem ofertas para enviar.' }

    // 2. Gerar o HTML
    const htmlContent = generateNewsletterHtml(topOffers)

    // 3. Descobrir para quem enviar
    let recipients: string[] = []
    
    if (isTest && testEmail) {
      recipients = [testEmail]
    } else {
      const allSubscribers = await db.select().from(subscribers)
      recipients = allSubscribers.map(sub => sub.email)
    }

    if (recipients.length === 0) return { success: false, error: 'Sem subscritores.' }

    // 4. Enviar os emails via Resend
    // Nota: O Resend prefere batch ou BCC para listas. Para simplificar o teste, vamos usar a API normal.
    // O domínio "onboarding@resend.dev" só serve para testes (para o teu próprio email). 
    // Quando tiveres um domínio verificado no Resend, metes ex: "RadarOfertas <newsletter@radarofertas.pt>"
    const fromEmail = process.env.RESEND_FROM_EMAIL || 'RadarOfertas <onboarding@resend.dev>'

    const result = await resend.emails.send({
      from: fromEmail,
      to: isTest ? recipients : ['newsletter@radarofertas.pt'], // Se for teste vai p/ ti, se não usa bcc
      bcc: !isTest ? recipients : undefined,
      subject: '🔥 O Top 5 Pechinchas desta Semana chegou!',
      html: htmlContent
    })

    console.log(`✅ Newsletter enviada! Teste: ${isTest}, Destinatários: ${recipients.length}`)
    return { success: true, result }

  } catch (err) {
    console.error('❌ Erro a enviar newsletter:', err)
    return { success: false, error: err }
  }
}
