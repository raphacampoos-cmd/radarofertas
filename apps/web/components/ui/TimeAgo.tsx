'use client'

import { useEffect, useState } from 'react'
import { formatTimeAgo } from '@/lib/utils'

// Calcula o tempo relativo ("há 18 minutos") só depois de montar no cliente.
// Fazer isso durante o SSR causa mismatch de hidratação, porque o texto muda
// entre o momento em que o servidor renderiza e o momento em que o cliente hidrata.
export function TimeAgo({ date }: { date: string }) {
  const [text, setText] = useState<string | null>(null)

  useEffect(() => {
    setText(formatTimeAgo(date))
  }, [date])

  return <>{text ?? ' '}</>
}
