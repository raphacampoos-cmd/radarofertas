import { GoogleGenAI } from '@google/genai'
import { db } from '@radarofertas/db/client'
import { articles } from '@radarofertas/db/schema'

export async function generateSeoArticle(offer: any) {
  const apiKey = process.env.GEMINI_API_KEY
  if (!apiKey) {
    console.warn('[AI Article] GEMINI_API_KEY não configurada. A saltar geração de artigo.')
    return
  }

  try {
    console.log(`[AI Article] A gerar artigo para a oferta: ${offer.title}`)
    const ai = new GoogleGenAI({ apiKey })

    const prompt = `
És um copywriter especialista em SEO e comércio eletrónico. O site RadarOfertas acaba de adicionar um novo produto em promoção. 
Escreve um artigo SEO atrativo, convincente e otimizado para o Google (com cerca de 300-500 palavras) sobre este produto. 

Produto: ${offer.title}
Preço Atual: €${offer.priceCurrent}
Preço Original: €${offer.priceOriginal || 'Não especificado'}
Loja: ${offer.store?.name || 'Desconhecida'}

Regras do Artigo:
1. Começa com um título apelativo e clickbait positivo (formata o título como um cabeçalho Markdown de nível 1: # Título)
2. Usa cabeçalhos de nível 2 e 3 (## e ###) para separar as secções.
3. Menciona as principais vantagens do produto.
4. Foca-te em porque o preço atual é uma excelente oportunidade (fala da poupança se houver preço original).
5. Usa formatação Markdown (negritos, listas) para facilitar a leitura.
6. Usa um tom entusiasmado, focado em poupança e Portugal. 
7. Termina com uma chamada à ação (CTA) para o leitor aproveitar a oferta no RadarOfertas antes que esgote.
    `

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
    })

    const content = response.text
    if (!content) throw new Error('Conteúdo vazio gerado pela IA.')

    // Tentar extrair o título do markdown (primeira linha que começa com #)
    let title = offer.title
    const titleMatch = content.match(/^#\s+(.+)$/m)
    if (titleMatch && titleMatch[1]) {
      title = titleMatch[1].trim()
    }

    // Gerar um slug baseado no título
    const slug = title
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '')

    // Guardar no banco de dados
    await db.insert(articles).values({
      title,
      slug: `${slug}-${Math.floor(Math.random() * 10000)}`, // evitar slugs duplicados
      content,
      coverImage: offer.imageUrl,
      published: true, // Já publica automaticamente!
    })

    console.log(`[AI Article] Artigo guardado com sucesso: ${slug}`)
  } catch (error) {
    console.error('[AI Article] Erro ao gerar artigo:', error)
  }
}
