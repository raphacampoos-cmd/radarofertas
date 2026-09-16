'use client'

import { LineChart, Line, XAxis, YAxis, Tooltip, ReferenceLine, ResponsiveContainer } from 'recharts'
import { format } from 'date-fns'
import { pt } from 'date-fns/locale'
import type { PricePoint } from '@/lib/types'
import { formatPrice } from '@/lib/utils'

interface PriceHistoryProps {
  history: PricePoint[]
  currentPrice: number
  minPrice: number | null
}

export function PriceHistory({ history, currentPrice, minPrice }: PriceHistoryProps) {
  if (history.length < 2) {
    return (
      <div style={{
        background: 'var(--muted)',
        borderRadius: 'var(--radius)',
        padding: '1.5rem',
        textAlign: 'center',
        color: 'var(--muted-foreground)',
        fontSize: '0.875rem',
      }}>
        📊 Histórico de preços disponível em breve (menos de 7 dias de dados)
      </div>
    )
  }

  const chartData = history.map(point => ({
    date: format(new Date(point.recordedAt), 'dd/MM', { locale: pt }),
    price: parseFloat(point.price),
    isMin: point.isMinimum,
  }))

  const prices = chartData.map(d => d.price)
  const minValue = Math.min(...prices)
  const maxValue = Math.max(...prices)
  const padding = (maxValue - minValue) * 0.15

  return (
    <div>
      <h3 style={{ fontWeight: 700, marginBottom: '1rem', fontSize: '1rem' }}>
        📊 Histórico de Preços ({history.length} dias)
      </h3>

      <ResponsiveContainer width="100%" height={200}>
        <LineChart data={chartData} margin={{ top: 5, right: 10, bottom: 5, left: 10 }}>
          <XAxis
            dataKey="date"
            tick={{ fontSize: 11, fill: 'var(--muted-foreground)' }}
            tickLine={false}
            axisLine={false}
            interval="preserveStartEnd"
          />
          <YAxis
            domain={[minValue - padding, maxValue + padding]}
            tick={{ fontSize: 11, fill: 'var(--muted-foreground)' }}
            tickLine={false}
            axisLine={false}
            tickFormatter={(v) => `€${v.toFixed(0)}`}
            width={55}
          />
          <Tooltip
            formatter={(value: number) => [formatPrice(value), 'Preço']}
            labelStyle={{ color: 'var(--foreground)', fontWeight: 600 }}
            contentStyle={{
              background: 'var(--card)',
              border: '1px solid var(--border)',
              borderRadius: '0.5rem',
              fontSize: '0.85rem',
            }}
          />
          {minPrice && (
            <ReferenceLine
              y={minPrice}
              stroke="#16a34a"
              strokeDasharray="4 4"
              label={{ value: `Mín: ${formatPrice(minPrice)}`, position: 'right', fontSize: 10, fill: '#16a34a' }}
            />
          )}
          <Line
            type="monotone"
            dataKey="price"
            stroke="#dc2626"
            strokeWidth={2}
            dot={false}
            activeDot={{ r: 4, fill: '#dc2626' }}
          />
        </LineChart>
      </ResponsiveContainer>

      {/* Estatísticas */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(3, 1fr)',
        gap: '0.75rem',
        marginTop: '0.75rem',
      }}>
        {[
          { label: 'Preço Atual', value: formatPrice(currentPrice), color: '#dc2626' },
          { label: 'Mínimo Histórico', value: minPrice ? formatPrice(minPrice) : 'N/D', color: '#16a34a' },
          { label: 'Máximo Registado', value: formatPrice(maxValue), color: '#6b7280' },
        ].map(stat => (
          <div key={stat.label} style={{
            background: 'var(--muted)',
            borderRadius: '0.5rem',
            padding: '0.75rem',
            textAlign: 'center',
          }}>
            <div style={{ fontSize: '1rem', fontWeight: 800, color: stat.color }}>{stat.value}</div>
            <div style={{ fontSize: '0.7rem', color: 'var(--muted-foreground)', marginTop: '0.2rem' }}>{stat.label}</div>
          </div>
        ))}
      </div>
    </div>
  )
}
