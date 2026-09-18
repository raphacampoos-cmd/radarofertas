import { getDealLabel, getDealColor, type DealLabel } from '@radarofertas/deal-engine'
import { DealScoreTooltip } from './DealScoreTooltip'

interface DealScoreBadgeProps {
  score: number
  compact?: boolean
  showBreakdown?: boolean
}

export function DealScoreBadge({ score, compact = false, showBreakdown = false }: DealScoreBadgeProps) {
  const label = getDealLabel(score) as DealLabel
  const color = getDealColor(label)

  if (compact) {
    return (
      <DealScoreTooltip>
        <div style={{
          background: color,
          color: '#fff',
          borderRadius: '9999px',
          padding: '0.2rem 0.5rem',
          fontSize: '0.7rem',
          fontWeight: 800,
          letterSpacing: '0.02em',
          display: 'flex',
          alignItems: 'center',
          gap: '0.2rem',
        }}>
          <span>{score}</span>
        </div>
      </DealScoreTooltip>
    )
  }

  return (
    <DealScoreTooltip>
      <div style={{
        border: `2px solid ${color}`,
        borderRadius: 'var(--radius)',
        padding: '1rem',
        textAlign: 'center',
      }}>
        <div style={{
          fontSize: '2.5rem',
          fontWeight: 900,
          color,
          lineHeight: 1,
          marginBottom: '0.25rem',
        }}>
          {score}
        </div>
        <div style={{ fontSize: '0.75rem', color: 'var(--muted-foreground)', marginBottom: '0.5rem' }}>
          de 100
        </div>
        <div style={{
          background: color,
          color: '#fff',
          borderRadius: '9999px',
          padding: '0.25rem 0.75rem',
          fontSize: '0.8rem',
          fontWeight: 700,
          display: 'inline-block',
        }}>
          {label}
        </div>

        {/* Barra de progresso */}
        <div style={{
          marginTop: '0.75rem',
          background: 'var(--muted)',
          borderRadius: '9999px',
          height: '6px',
          overflow: 'hidden',
        }}>
          <div style={{
            width: `${score}%`,
            height: '100%',
            background: color,
            borderRadius: '9999px',
            transition: 'width 0.5s ease',
          }} />
        </div>

        <p style={{ fontSize: '0.7rem', color: 'var(--muted-foreground)', marginTop: '0.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px' }}>
          <span>ℹ️</span> Deal Score RadarOfertas
        </p>
      </div>
    </DealScoreTooltip>
  )
}
