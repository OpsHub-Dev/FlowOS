// Badge
export function Badge({ children, variant = 'blue' }) {
  const variants = {
    blue:   'bg-accent/15 text-accent',
    green:  'bg-accent3/15 text-accent3',
    orange: 'bg-accent4/15 text-accent4',
    red:    'bg-accent5/15 text-accent5',
    purple: 'bg-accent2/15 text-accent2',
    gray:   'bg-text2/10 text-text2',
  }
  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold ${variants[variant]}`}>
      <span className="w-1 h-1 rounded-full bg-current" />
      {children}
    </span>
  )
}

// Progress Bar
export function ProgressBar({ value, color = 'var(--tw-gradient-from)' }) {
  const colors = {
    blue:   'bg-accent',
    green:  'bg-accent3',
    orange: 'bg-accent4',
    red:    'bg-accent5',
  }
  return (
    <div className="h-1.5 bg-border rounded-full overflow-hidden">
      <div className={`h-full rounded-full transition-all ${colors[color] || 'bg-accent'}`} style={{ width: `${value}%` }} />
    </div>
  )
}

// Card
export function Card({ children, className = '', onClick }) {
  return (
    <div
      onClick={onClick}
      className={`bg-surface border border-border rounded-xl p-5 ${onClick ? 'cursor-pointer hover:border-accent transition-all' : ''} ${className}`}
    >
      {children}
    </div>
  )
}

// Stat Card
export function StatCard({ label, value, change, icon, topColor }) {
  const tops = {
    blue:   'from-accent to-accent2',
    green:  'from-accent3 to-emerald-600',
    orange: 'from-accent4 to-orange-600',
    red:    'from-accent5 to-rose-700',
  }
  return (
    <div className="bg-surface border border-border rounded-xl p-5 relative overflow-hidden hover:border-accent transition-all hover:-translate-y-0.5">
      <div className={`absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r ${tops[topColor]}`} />
      <div className="absolute right-4 top-4 text-3xl opacity-[0.15]">{icon}</div>
      <div className="text-[11px] font-semibold tracking-[0.8px] uppercase text-text3">{label}</div>
      <div className="text-3xl font-bold my-1.5 font-mono">{value}</div>
      <div className={`text-[11px] ${change?.startsWith('↓') || change?.includes('overdue') || change?.includes('more') ? 'text-accent5' : 'text-accent3'}`}>{change}</div>
    </div>
  )
}

// Section Header
export function SectionHeader({ title, action, onAction }) {
  return (
    <div className="flex items-center justify-between mb-3.5">
      <h2 className="text-sm font-bold">{title}</h2>
      {action && <span onClick={onAction} className="text-[11px] text-accent cursor-pointer hover:underline">{action}</span>}
    </div>
  )
}

// Button
export function Btn({ children, variant = 'primary', onClick, className = '', size = 'md' }) {
  const sizes = { sm: 'px-3 py-1 text-[10px]', md: 'px-4 py-1.5 text-xs', lg: 'px-5 py-2 text-sm' }
  const variants = {
    primary: 'bg-gradient-to-r from-accent to-accent2 text-white hover:opacity-90',
    ghost:   'bg-surface2 text-text2 border border-border hover:text-text1 hover:border-accent',
    danger:  'bg-surface2 text-accent5 border border-border hover:border-accent5',
  }
  return (
    <button onClick={onClick} className={`${sizes[size]} ${variants[variant]} rounded-lg font-semibold font-sora transition-all cursor-pointer ${className}`}>
      {children}
    </button>
  )
}

// Tab Row
export function TabRow({ tabs, active, onChange }) {
  return (
    <div className="flex gap-1 bg-surface2 rounded-lg p-1 w-fit mb-5">
      {tabs.map(t => (
        <button
          key={t}
          onClick={() => onChange(t)}
          className={`px-4 py-1.5 rounded-md text-xs font-medium cursor-pointer border-none font-sora transition-all
            ${active === t ? 'bg-surface text-text1 shadow-md' : 'bg-transparent text-text2 hover:text-text1'}`}
        >
          {t}
        </button>
      ))}
    </div>
  )
}

// Table
export function Table({ headers, rows }) {
  return (
    <table className="w-full border-collapse">
      <thead>
        <tr>
          {headers.map(h => (
            <th key={h} className="text-[10px] font-semibold uppercase tracking-[0.8px] text-text3 px-3 py-2 text-left border-b border-border">{h}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {rows.map((row, i) => (
          <tr key={i} className="hover:bg-white/[0.02] group">
            {row.map((cell, j) => (
              <td key={j} className="px-3 py-[11px] text-xs border-b border-border/60 last:border-0 align-middle">{cell}</td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  )
}

// Toggle
export function Toggle({ on, onChange }) {
  return (
    <div
      onClick={() => onChange(!on)}
      className={`w-9 h-5 rounded-full cursor-pointer relative transition-all ${on ? 'bg-accent' : 'bg-border'}`}
    >
      <div className={`absolute w-3.5 h-3.5 bg-white rounded-full top-[3px] transition-all ${on ? 'left-[19px]' : 'left-[3px]'}`} />
    </div>
  )
}
