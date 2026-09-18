'use client';
import { useEffect, useId, useRef, useState } from 'react';

type DealScoreTooltipProps = { children: React.ReactNode; text?: string };

const DEFAULT_TEXT = 'O Deal Score (0-100) resume o quão vantajosa é esta oferta, avaliando o desconto atual, o histórico de preços (mínimo absoluto e média dos últimos 90 dias), a fiabilidade da loja e a urgência da promoção. É uma orientação automática e não substitui a verificação do preço final.';

export function DealScoreTooltip({ children, text = DEFAULT_TEXT }: DealScoreTooltipProps) {
  const [open, setOpen] = useState(false);
  const tooltipId = useId();
  const wrapperRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (!open) return;
    function handleOutside(e: MouseEvent | TouchEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) setOpen(false);
    }
    function handleEscape(e: KeyboardEvent) { if (e.key === 'Escape') setOpen(false); }
    document.addEventListener('touchstart', handleOutside);
    document.addEventListener('mousedown', handleOutside);
    document.addEventListener('keydown', handleEscape);
    return () => {
      document.removeEventListener('touchstart', handleOutside);
      document.removeEventListener('mousedown', handleOutside);
      document.removeEventListener('keydown', handleEscape);
    };
  }, [open]);

  return (
    <span ref={wrapperRef} style={{ position: 'relative', display: 'inline-flex' }}
      onMouseEnter={() => setOpen(true)} onMouseLeave={() => setOpen(false)}>
      <button type="button" aria-describedby={tooltipId} aria-expanded={open}
        onClick={(e) => { e.preventDefault(); setOpen(v => !v); }} onFocus={() => setOpen(true)} onBlur={() => setOpen(false)}
        style={{ background: 'none', border: 'none', padding: 0, cursor: 'help', font: 'inherit', color: 'inherit' }}>
        {children}
      </button>
      {open && (
        <span id={tooltipId} role="tooltip" style={{
          position: 'absolute', bottom: 'calc(100% + 8px)', left: '50%', transform: 'translateX(-50%)',
          width: 250, maxWidth: '85vw', padding: '12px', borderRadius: 'var(--radius)',
          background: 'var(--foreground)', color: 'var(--background)', fontSize: '0.75rem', lineHeight: 1.5,
          boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.2), 0 8px 10px -6px rgba(0, 0, 0, 0.1)', zIndex: 50, textAlign: 'left',
          pointerEvents: 'none'
        }}>
          {text}
        </span>
      )}
    </span>
  );
}
