// ─────────────────────────────────────────────
// DEAL SCORE ENGINE — RadarOfertas
// Calcula um score de 0 a 100 para cada oferta
// ─────────────────────────────────────────────

export interface DealScoreInput {
  /** Preço atual da oferta em EUR */
  priceCurrent: number
  /** Preço de referência / PVP original */
  priceOriginal: number
  /** Mínimo histórico registado (null se < 7 dias de dados) */
  priceMinHistoric: number | null
  /** Média dos últimos 90 dias (null se sem dados) */
  priceAvg90Days: number | null
  /** Fiabilidade da loja (0-1), padrão 0.85 */
  storeReliability?: number
  /** Dias até expiração (null = sem expiração conhecida) */
  daysUntilExpiry?: number | null
  /** Taxa de comissão (ex: 0.08 = 8%) */
  commissionRate?: number
}

export interface DealScoreResult {
  score: number          // 0-100
  label: DealLabel
  breakdown: {
    discountScore: number
    historyScore: number
    avgScore: number
    storeScore: number
    urgencyScore: number
    commissionScore: number
  }
  isHistoricMinimum: boolean
}

export type DealLabel = '🔥 Histórico' | '⚡ Excelente' | '👍 Bom' | '💬 Regular' | '❄️ Fraco'

export function calculateDealScore(input: DealScoreInput): DealScoreResult {
  const {
    priceCurrent,
    priceOriginal,
    priceMinHistoric,
    priceAvg90Days,
    storeReliability = 0.85,
    daysUntilExpiry = null,
    commissionRate = 0.04,
  } = input

  // Guardar de divisão por zero
  if (priceOriginal <= 0 || priceCurrent <= 0) {
    return { score: 0, label: '❄️ Fraco', breakdown: { discountScore: 0, historyScore: 0, avgScore: 0, storeScore: 0, urgencyScore: 0, commissionScore: 0 }, isHistoricMinimum: false }
  }

  // ── 1. Desconto Real (30% do score) ──────────────────────────
  // Max útil: 70% de desconto → score 1.0
  const discountRaw = (priceOriginal - priceCurrent) / priceOriginal
  const discountScore = Math.min(1.0, Math.max(0, discountRaw / 0.70))

  // ── 2. Distância do Mínimo Histórico (25%) ───────────────────
  let historyScore = 0.40 // neutro se sem dados suficientes
  let isHistoricMinimum = false
  if (priceMinHistoric !== null && priceMinHistoric > 0) {
    historyScore = Math.max(0, 1 - (priceCurrent / priceMinHistoric) + 0.05)
    historyScore = Math.min(1.0, historyScore)
    isHistoricMinimum = priceCurrent <= priceMinHistoric * 1.01 // tolerância 1%
  }

  // ── 3. Vs. Média 90 dias (15%) ───────────────────────────────
  let avgScore = 0.30 // neutro se sem dados
  if (priceAvg90Days !== null && priceAvg90Days > 0) {
    avgScore = Math.max(0, 1 - (priceCurrent / priceAvg90Days) + 0.10)
    avgScore = Math.min(1.0, avgScore)
  }

  // ── 4. Qualidade da Loja (15%) ───────────────────────────────
  const storeScore = Math.min(1.0, Math.max(0, storeReliability))

  // ── 5. Urgência (10%) ────────────────────────────────────────
  let urgencyScore = 0.30 // neutro sem data
  if (daysUntilExpiry !== null) {
    if (daysUntilExpiry <= 0) {
      urgencyScore = 0 // expirada
    } else if (daysUntilExpiry <= 1) {
      urgencyScore = 1.0 // expira hoje/amanhã
    } else if (daysUntilExpiry <= 3) {
      urgencyScore = 0.8
    } else if (daysUntilExpiry <= 7) {
      urgencyScore = 0.6
    } else {
      urgencyScore = Math.max(0.1, 1 - (daysUntilExpiry / 30))
    }
  }

  // ── 6. Potencial de Comissão (5%) ────────────────────────────
  // Normaliza: 12% = score 1.0
  const commissionScore = Math.min(1.0, commissionRate / 0.12)

  // ── Score Final Ponderado ─────────────────────────────────────
  const rawScore =
    discountScore  * 0.30 +
    historyScore   * 0.25 +
    avgScore       * 0.15 +
    storeScore     * 0.15 +
    urgencyScore   * 0.10 +
    commissionScore * 0.05

  // Bónus histórico: +5 pontos se for mínimo confirmado
  const bonus = isHistoricMinimum ? 0.05 : 0
  const finalScore = Math.round(Math.min(1.0, rawScore + bonus) * 100)

  return {
    score: finalScore,
    label: getDealLabel(finalScore),
    breakdown: {
      discountScore: Math.round(discountScore * 100),
      historyScore: Math.round(historyScore * 100),
      avgScore: Math.round(avgScore * 100),
      storeScore: Math.round(storeScore * 100),
      urgencyScore: Math.round(urgencyScore * 100),
      commissionScore: Math.round(commissionScore * 100),
    },
    isHistoricMinimum,
  }
}

export function getDealLabel(score: number): DealLabel {
  if (score >= 85) return '🔥 Histórico'
  if (score >= 65) return '⚡ Excelente'
  if (score >= 45) return '👍 Bom'
  if (score >= 25) return '💬 Regular'
  return '❄️ Fraco'
}

/** Cor CSS correspondente ao label */
export function getDealColor(label: DealLabel): string {
  switch (label) {
    case '🔥 Histórico': return '#dc2626' // red-600
    case '⚡ Excelente':  return '#d97706' // amber-600
    case '👍 Bom':        return '#16a34a' // green-600
    case '💬 Regular':    return '#2563eb' // blue-600
    case '❄️ Fraco':      return '#6b7280' // gray-500
  }
}

/** Calcula percentagem de desconto formatada */
export function formatDiscount(current: number, original: number): string {
  if (original <= 0) return '0%'
  const pct = Math.round(((original - current) / original) * 100)
  return `-${pct}%`
}

/** Determina se preço está próximo do mínimo histórico */
export function isNearHistoricMin(current: number, min: number | null, thresholdPct = 0.05): boolean {
  if (min === null) return false
  return current <= min * (1 + thresholdPct)
}
