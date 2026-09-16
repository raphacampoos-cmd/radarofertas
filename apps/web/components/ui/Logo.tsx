export function Logo({ className, width = 160, height = 40 }: { className?: string, width?: number, height?: number }) {
  return (
    <svg 
      className={className} 
      width={width} 
      height={height} 
      viewBox="0 0 160 40" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Círculos de Radar / Ondas */}
      <circle cx="20" cy="24" r="14" stroke="currentColor" strokeWidth="2.5" opacity="0.2" />
      <circle cx="20" cy="24" r="9" stroke="currentColor" strokeWidth="2.5" opacity="0.5" />
      <circle cx="20" cy="24" r="4" fill="#ef4444" /> {/* Pontinho vermelho do radar */}
      
      {/* Vareta do Radar (animada com CSS se quisermos depois) */}
      <path d="M20 24L29 15" stroke="#ef4444" strokeWidth="2.5" strokeLinecap="round" />

      {/* Texto Radar */}
      <text x="42" y="29" fill="currentColor" fontFamily="system-ui, -apple-system, sans-serif" fontWeight="800" fontSize="22" letterSpacing="-0.03em">
        Radar<tspan fill="#ef4444">Ofertas</tspan>
      </text>
    </svg>
  )
}
