export default function AuthLayout({ children }) {
  const features = [
    { icon: '⚡', label: 'Workflow Automation', desc: 'Build and automate business processes in minutes' },
    { icon: '📋', label: 'Project Management', desc: 'Kanban boards, timelines, and task tracking' },
    { icon: '📊', label: 'Real-Time Analytics', desc: 'Insights and SLA monitoring across all workflows' },
  ]

  return (
    <div className="min-h-screen bg-bg flex overflow-hidden">
      {/* Left — Branding */}
      <div className="hidden lg:flex w-[480px] flex-shrink-0 flex-col relative overflow-hidden"
        style={{ background: 'linear-gradient(145deg, #0d0f14 0%, #111422 50%, #0e1120 100%)' }}>

        {/* Decorative blobs */}
        <div className="absolute top-[-80px] left-[-80px] w-72 h-72 rounded-full opacity-20"
          style={{ background: 'radial-gradient(circle, #4f6ef7, transparent 70%)' }} />
        <div className="absolute bottom-[-60px] right-[-60px] w-64 h-64 rounded-full opacity-15"
          style={{ background: 'radial-gradient(circle, #7c4dff, transparent 70%)' }} />
        <div className="absolute top-1/2 right-0 w-48 h-48 rounded-full opacity-10"
          style={{ background: 'radial-gradient(circle, #00d4a0, transparent 70%)' }} />

        {/* Grid pattern overlay */}
        <div className="absolute inset-0 opacity-[0.03]"
          style={{ backgroundImage: 'linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)', backgroundSize: '40px 40px' }} />

        <div className="relative z-10 flex flex-col h-full p-10">
          {/* Logo */}
          <div className="flex items-center gap-3 mb-16">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-accent to-accent2 flex items-center justify-center text-base font-bold text-white shadow-lg shadow-accent/30">F</div>
            <span className="text-xl font-bold tracking-tight">Flow<span className="text-accent">OS</span></span>
          </div>

          {/* Headline */}
          <div className="flex-1 flex flex-col justify-center">
            <h1 className="text-4xl font-bold leading-tight mb-4">
              Work smarter,<br />
              <span className="text-transparent bg-clip-text" style={{ backgroundImage: 'linear-gradient(135deg, #4f6ef7, #00d4a0)' }}>
                not harder.
              </span>
            </h1>
            <p className="text-sm text-text2 leading-relaxed mb-10 max-w-xs">
              FlowOS brings your workflows, projects, forms, and team into one unified platform.
            </p>

            {/* Features */}
            <div className="space-y-5">
              {features.map(f => (
                <div key={f.label} className="flex items-start gap-3.5">
                  <div className="w-9 h-9 rounded-lg bg-surface/80 border border-border flex items-center justify-center text-base flex-shrink-0 mt-0.5">
                    {f.icon}
                  </div>
                  <div>
                    <div className="text-xs font-semibold mb-0.5">{f.label}</div>
                    <div className="text-[11px] text-text3 leading-relaxed">{f.desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Testimonial */}
          <div className="bg-surface/50 border border-border/50 rounded-xl p-4 backdrop-blur-sm">
            <div className="text-xs text-text2 leading-relaxed mb-3 italic">
              "FlowOS cut our approval cycle time by 60%. Our HR and finance teams live in it every day."
            </div>
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-full bg-gradient-to-br from-accent3 to-emerald-600 flex items-center justify-center text-[10px] font-bold text-white">SM</div>
              <div>
                <div className="text-[11px] font-semibold">Sarah Mitchell</div>
                <div className="text-[10px] text-text3">Operations Manager, Acme Corp</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right — Form */}
      <div className="flex-1 flex items-center justify-center p-6 overflow-y-auto">
        <div className="w-full max-w-md">
          {/* Mobile logo */}
          <div className="flex items-center gap-2.5 mb-8 lg:hidden">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-accent to-accent2 flex items-center justify-center text-sm font-bold text-white">F</div>
            <span className="text-base font-bold">Flow<span className="text-accent">OS</span></span>
          </div>
          {children}
        </div>
      </div>
    </div>
  )
}
