import { useEffect } from 'react'

// ── Modal wrapper ─────────────────────────────────────────────────────────────
export function Modal({ title, onClose, children, width = 'max-w-lg' }) {
  useEffect(() => {
    const handler = (e) => e.key === 'Escape' && onClose()
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [onClose])

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className={`bg-surface border border-border rounded-2xl w-full ${width} max-h-[90vh] overflow-y-auto`} onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between px-6 py-4 border-b border-border sticky top-0 bg-surface z-10">
          <h2 className="text-sm font-bold">{title}</h2>
          <button onClick={onClose} className="text-text3 hover:text-text1 text-xl leading-none cursor-pointer transition-all">×</button>
        </div>
        <div className="p-6">{children}</div>
      </div>
    </div>
  )
}

// ── Form field ────────────────────────────────────────────────────────────────
export function FormField({ label, required, children }) {
  return (
    <div className="mb-4">
      <label className="block text-[10px] font-semibold text-text3 uppercase tracking-[.8px] mb-1.5">
        {label}{required && <span className="text-accent5 ml-0.5">*</span>}
      </label>
      {children}
    </div>
  )
}

// ── Input ─────────────────────────────────────────────────────────────────────
export function Input({ value, onChange, placeholder, type = 'text', ...rest }) {
  return (
    <input
      type={type}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className="w-full bg-surface2 border border-border rounded-lg px-3 py-2 text-xs text-text1 outline-none font-sora placeholder-text3 focus:border-accent transition-all"
      {...rest}
    />
  )
}

// ── Select ────────────────────────────────────────────────────────────────────
export function Select({ value, onChange, options, placeholder }) {
  return (
    <select
      value={value}
      onChange={onChange}
      className="w-full bg-surface2 border border-border rounded-lg px-3 py-2 text-xs text-text1 outline-none font-sora focus:border-accent transition-all"
    >
      {placeholder && <option value="">{placeholder}</option>}
      {options.map(o => (
        <option key={typeof o === 'string' ? o : o.value} value={typeof o === 'string' ? o : o.value}>
          {typeof o === 'string' ? o : o.label}
        </option>
      ))}
    </select>
  )
}

// ── Textarea ──────────────────────────────────────────────────────────────────
export function Textarea({ value, onChange, placeholder, rows = 3 }) {
  return (
    <textarea
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      rows={rows}
      className="w-full bg-surface2 border border-border rounded-lg px-3 py-2 text-xs text-text1 outline-none font-sora placeholder-text3 focus:border-accent transition-all resize-none"
    />
  )
}

// ── Confirm Delete Dialog ─────────────────────────────────────────────────────
export function ConfirmDialog({ message, onConfirm, onCancel }) {
  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-[60] flex items-center justify-center p-4" onClick={onCancel}>
      <div className="bg-surface border border-border rounded-2xl w-full max-w-sm p-6" onClick={e => e.stopPropagation()}>
        <div className="text-2xl mb-3 text-center">🗑️</div>
        <h3 className="text-sm font-bold text-center mb-2">Confirm Delete</h3>
        <p className="text-xs text-text3 text-center mb-6">{message}</p>
        <div className="flex gap-3">
          <button onClick={onCancel} className="flex-1 py-2 rounded-lg text-xs font-semibold bg-surface2 border border-border text-text2 hover:text-text1 cursor-pointer font-sora transition-all">Cancel</button>
          <button onClick={onConfirm} className="flex-1 py-2 rounded-lg text-xs font-semibold bg-accent5 text-white hover:opacity-90 cursor-pointer font-sora transition-all">Delete</button>
        </div>
      </div>
    </div>
  )
}

// ── Toast notification ────────────────────────────────────────────────────────
export function Toast({ message, type = 'success', onClose }) {
  useEffect(() => {
    const t = setTimeout(onClose, 3000)
    return () => clearTimeout(t)
  }, [onClose])

  const colors = { success: 'border-accent3 text-accent3', error: 'border-accent5 text-accent5', info: 'border-accent text-accent' }
  const icons = { success: '✓', error: '✗', info: 'ℹ' }

  return (
    <div className={`fixed bottom-6 right-6 z-[70] bg-surface border ${colors[type]} rounded-xl px-4 py-3 flex items-center gap-3 shadow-xl animate-[fadeUp_.25s_ease]`}>
      <span className="font-bold">{icons[type]}</span>
      <span className="text-xs text-text1">{message}</span>
      <button onClick={onClose} className="text-text3 hover:text-text1 ml-2 cursor-pointer">×</button>
    </div>
  )
}

// ── Empty state ───────────────────────────────────────────────────────────────
export function EmptyState({ icon, title, desc, action, onAction }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <div className="text-4xl mb-4 opacity-40">{icon}</div>
      <div className="text-sm font-bold mb-1">{title}</div>
      <div className="text-xs text-text3 mb-5">{desc}</div>
      {action && (
        <button onClick={onAction} className="px-4 py-2 rounded-lg text-xs font-semibold bg-gradient-to-r from-accent to-accent2 text-white hover:opacity-90 cursor-pointer font-sora transition-all">
          {action}
        </button>
      )}
    </div>
  )
}
