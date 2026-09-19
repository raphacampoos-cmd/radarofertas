'use client'

interface CategorySelectProps {
  categories: { id: number; slug: string; name: string; icon: string | null; count: number }[]
}

export function CategorySelect({ categories }: CategorySelectProps) {
  return (
    <select
      style={{
        width: '100%', padding: '0.6rem 0.75rem', borderRadius: '0.5rem',
        border: '1px solid var(--border)', background: 'var(--muted)',
        color: 'var(--foreground)', fontSize: '0.85rem',
      }}
      onChange={(e) => { if (e.target.value) window.location.href = e.target.value }}
      defaultValue=""
    >
      <option value="" disabled>Seleccionar categoria</option>
      {categories.map(cat => (
        <option key={cat.id} value={`/categoria/${cat.slug}`}>
          {cat.icon} {cat.name} ({cat.count})
        </option>
      ))}
    </select>
  )
}
