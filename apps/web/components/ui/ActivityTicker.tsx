'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { pingPresence, getRecentActivity } from '@/lib/api'
import { formatTimeAgo } from '@/lib/utils'
import type { RecentActivity } from '@/lib/types'

function getSessionId(): string {
  const key = 'radarofertas_session_id'
  try {
    let id = sessionStorage.getItem(key)
    if (!id) {
      id = Math.random().toString(36).slice(2) + Date.now().toString(36)
      sessionStorage.setItem(key, id)
    }
    return id
  } catch {
    return Math.random().toString(36).slice(2)
  }
}

export function ActivityTicker() {
  const [online, setOnline] = useState<number | null>(null)
  const [activity, setActivity] = useState<RecentActivity | null>(null)

  useEffect(() => {
    const sessionId = getSessionId()

    async function ping() {
      try {
        const res = await pingPresence(sessionId)
        setOnline(res.data.online)
      } catch {}
    }

    async function loadActivity() {
      try {
        const res = await getRecentActivity()
        setActivity(res.data)
      } catch {}
    }

    ping()
    loadActivity()
    const pingInterval = setInterval(ping, 30000)
    const activityInterval = setInterval(loadActivity, 60000)
    return () => { clearInterval(pingInterval); clearInterval(activityInterval) }
  }, [])

  if (online === null) return null

  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      gap: '0.65rem',
      flexWrap: 'wrap',
      background: 'rgba(255, 255, 255, 0.03)',
      border: '1px solid rgba(255, 255, 255, 0.07)',
      backdropFilter: 'blur(10px)',
      borderRadius: '0.65rem',
      padding: '0.5rem 1rem',
      fontSize: '0.78rem',
      color: '#94a3b8',
      marginBottom: '1.25rem',
    }}>
      <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.45rem', fontWeight: 700, color: '#f8fafc' }}>
        <span className="radar-beacon-dot" />
        <span style={{ fontFamily: 'monospace', color: '#10b981' }}>{online}</span> {online === 1 ? 'utilizador a poupar agora' : 'utilizadores a poupar agora'}
      </span>
      {activity && (
        <>
          <span style={{ color: 'rgba(255,255,255,0.2)' }}>•</span>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}>
            <span>🔥</span>
            <span>alguém {activity.voteType === 'down' ? 'marcou como expirada' : 'votou positivo em'}{' '}</span>
            <Link href={`/oferta/${activity.slug}`} style={{ color: '#fb923c', fontWeight: 600, textDecoration: 'none' }}>
              «{activity.title.length > 40 ? activity.title.slice(0, 40) + '…' : activity.title}»
            </Link>{' '}
            <span style={{ color: '#64748b', fontSize: '0.72rem', fontFamily: 'monospace' }}>
              ({formatTimeAgo(activity.votedAt)})
            </span>
          </span>
        </>
      )}
    </div>
  )
}
