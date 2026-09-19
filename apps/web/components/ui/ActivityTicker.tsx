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
      display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap',
      background: 'var(--muted)', border: '1px solid var(--border)',
      borderRadius: '0.5rem', padding: '0.6rem 1rem',
      fontSize: '0.8rem', color: 'var(--muted-foreground)', marginBottom: '1rem',
    }}>
      <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontWeight: 700, color: 'var(--foreground)' }}>
        <span style={{ width: '8px', height: '8px', borderRadius: '9999px', background: '#22c55e', display: 'inline-block' }} />
        {online} {online === 1 ? 'pessoa' : 'pessoas'} no site agora
      </span>
      {activity && (
        <>
          <span>·</span>
          <span>
            🔥 alguém {activity.voteType === 'down' ? 'marcou como terminada' : 'deu fixe a'}{' '}
            <Link href={`/oferta/${activity.slug}`} style={{ color: 'var(--primary)', fontWeight: 600, textDecoration: 'none' }}>
              «{activity.title.length > 40 ? activity.title.slice(0, 40) + '…' : activity.title}»
            </Link>{' '}
            {formatTimeAgo(activity.votedAt)}
          </span>
        </>
      )}
    </div>
  )
}
