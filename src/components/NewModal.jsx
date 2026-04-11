export default function NewModal({ onClose, navigate }) {
  const options = [
    { icon: '⚡', label: 'Workflow', desc: 'Automate a process', to: '/workflows', color: 'hover:border-accent' },
    { icon: '📋', label: 'Project', desc: 'Track work on a board', to: '/projects', color: 'hover:border-accent3' },
    { icon: '📝', label: 'Form', desc: 'Collect data & requests', to: '/forms', color: 'hover:border-accent4' },
    { icon: '🗂️', label: 'Case', desc: 'Manage a ticket', to: '/cases', color: 'hover:border-accent5' },
  ]

  return (
    <div
      className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center"
      onClick={onClose}
    >
      <div
        className="bg-surface border border-border rounded-2xl p-7 w-[420px] max-w-[90vw]"
        onClick={e => e.stopPropagation()}
      >
        <div className="text-base font-bold mb-1">Create New</div>
        <div className="text-xs text-text3 mb-5">Choose what you'd like to create</div>
        <div className="grid grid-cols-2 gap-3 mb-5">
          {options.map(opt => (
            <div
              key={opt.to}
              onClick={() => { onClose(); navigate(opt.to); }}
              className={`bg-surface2 border border-border rounded-xl p-5 text-center cursor-pointer transition-all ${opt.color}`}
            >
              <div className="text-3xl mb-2">{opt.icon}</div>
              <div className="text-xs font-bold">{opt.label}</div>
              <div className="text-[10px] text-text3 mt-1">{opt.desc}</div>
            </div>
          ))}
        </div>
        <button
          onClick={onClose}
          className="w-full py-2 rounded-lg text-xs font-semibold bg-surface2 border border-border text-text2 hover:text-text1 transition-all cursor-pointer font-sora"
        >
          Cancel
        </button>
      </div>
    </div>
  )
}
