// Trava de segurança para ambiente local: com DISABLE_BACKGROUND_JOBS=true o servidor
// só serve a API HTTP e NÃO arranca crons, rastreador de preços, WhatsApp, Discord nem
// Telegram. Sem isto, correr a API localmente contra a base de dados de produção
// dispara ações reais (mensagens públicas, scraping, roubo da sessão do WhatsApp).
export const BACKGROUND_JOBS_ENABLED = process.env.DISABLE_BACKGROUND_JOBS !== 'true'
