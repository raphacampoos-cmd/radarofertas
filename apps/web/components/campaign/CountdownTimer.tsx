'use client'

import { useState, useEffect } from 'react'

interface CountdownTimerProps {
  targetDate: string
}

interface TimeLeft {
  days: number
  hours: number
  minutes: number
  seconds: number
  hasEnded: boolean
}

export function CountdownTimer({ targetDate }: CountdownTimerProps) {
  const [timeLeft, setTimeLeft] = useState<TimeLeft | null>(null)

  useEffect(() => {
    function calculateTime(): TimeLeft {
      const difference = new Date(targetDate).getTime() - new Date().getTime()
      if (difference <= 0) {
        return { days: 0, hours: 0, minutes: 0, seconds: 0, hasEnded: true }
      }

      return {
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / 1000 / 60) % 60),
        seconds: Math.floor((difference / 1000) % 60),
        hasEnded: false,
      }
    }

    setTimeLeft(calculateTime())

    const interval = setInterval(() => {
      setTimeLeft(calculateTime())
    }, 1000)

    return () => clearInterval(interval)
  }, [targetDate])

  if (!timeLeft) {
    return (
      <div style={{
        display: 'flex',
        gap: '0.75rem',
        justifyContent: 'center',
        padding: '1.25rem 0',
      }}>
        <div style={{ color: 'var(--muted-foreground)', fontSize: '0.9rem' }}>A carregar contagem...</div>
      </div>
    )
  }

  if (timeLeft.hasEnded) {
    return (
      <div style={{
        background: 'rgba(34, 197, 94, 0.1)',
        border: '1px solid rgba(34, 197, 94, 0.3)',
        borderRadius: 'var(--radius)',
        padding: '1rem 1.5rem',
        textAlign: 'center',
        color: '#22c55e',
        fontWeight: 700,
        fontSize: '1.1rem',
      }}>
        ⚡ O evento está a decorrer! Descobre as melhores oportunidades abaixo.
      </div>
    )
  }

  const items = [
    { label: 'Dias', value: String(timeLeft.days).padStart(2, '0') },
    { label: 'Horas', value: String(timeLeft.hours).padStart(2, '0') },
    { label: 'Minutos', value: String(timeLeft.minutes).padStart(2, '0') },
    { label: 'Segundos', value: String(timeLeft.seconds).padStart(2, '0') },
  ]

  return (
    <div style={{
      display: 'flex',
      gap: '0.75rem',
      justifyContent: 'center',
      flexWrap: 'wrap',
      margin: '1.5rem 0',
    }}>
      {items.map((item, idx) => (
        <div
          key={item.label}
          style={{
            background: 'var(--card)',
            border: '1px solid var(--border)',
            borderRadius: '0.75rem',
            padding: '0.75rem 1.25rem',
            minWidth: '80px',
            textAlign: 'center',
            boxShadow: '0 4px 15px rgba(0,0,0,0.2)',
          }}
        >
          <div style={{
            fontSize: '2rem',
            fontWeight: 900,
            color: '#f97316',
            lineHeight: 1.1,
            fontVariantNumeric: 'tabular-nums',
          }}>
            {item.value}
          </div>
          <div style={{
            fontSize: '0.75rem',
            color: 'var(--muted-foreground)',
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
            marginTop: '0.25rem',
            fontWeight: 600,
          }}>
            {item.label}
          </div>
        </div>
      ))}
    </div>
  )
}
