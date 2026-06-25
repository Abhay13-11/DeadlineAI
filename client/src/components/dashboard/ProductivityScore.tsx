interface Props { score: number }

export function ProductivityScore({ score }: Props) {
  const clamp = Math.min(100, Math.max(0, score))
  const color = clamp >= 70 ? '#22C55E' : clamp >= 40 ? '#F59E0B' : '#EF4444'
  const label = clamp >= 70 ? 'Excellent' : clamp >= 40 ? 'Good' : 'Needs work'
  const r = 28
  const circ = 2 * Math.PI * r
  const dash = (clamp / 100) * circ

  return (
    <div className="flex items-center gap-4">
      <div className="relative w-16 h-16">
        <svg viewBox="0 0 64 64" className="-rotate-90 w-16 h-16">
          <circle cx="32" cy="32" r={r} fill="none" stroke="rgb(var(--border))" strokeWidth="6" />
          <circle
            cx="32" cy="32" r={r} fill="none"
            stroke={color} strokeWidth="6"
            strokeDasharray={`${dash} ${circ}`}
            strokeLinecap="round"
            style={{ transition: 'stroke-dasharray 0.6s ease' }}
          />
        </svg>
        <span className="absolute inset-0 flex items-center justify-center text-sm font-bold text-text-primary">
          {clamp}%
        </span>
      </div>
      <div>
        <p className="font-semibold text-text-primary text-sm">{label}</p>
        <p className="text-text-muted text-xs">Completion rate</p>
      </div>
    </div>
  )
}
