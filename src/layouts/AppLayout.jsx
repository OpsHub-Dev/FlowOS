import { useState } from 'react'
import { Outlet, NavLink, useNavigate } from 'react-router-dom'
import NewModal from '../components/NewModal'
import { useAuth } from '../context/AuthContext'

const NAV = [
  { label: 'Overview', items: [
    { icon: '⬡', label: 'Dashboard', to: '/dashboard' },
    { icon: '📥', label: 'Inbox', to: '/inbox', badge: 5, badgeColor: 'bg-accent5' },
  ]},
  { label: 'Work', items: [
    { icon: '⚡', label: 'Workflows', to: '/workflows' },
    { icon: '📋', label: 'Projects', to: '/projects', badge: 3, badgeColor: 'bg-accent3' },
    { icon: '📝', label: 'Forms', to: '/forms' },
    { icon: '🗂️', label: 'Cases', to: '/cases' },
  ]},
  { label: 'Insights', items: [
    { icon: '📊', label: 'Analytics', to: '/analytics' },
    { icon: '👥', label: 'Team', to: '/team' },
  ]},
  { label: 'System', items: [
    { icon: '⚙️', label: 'Settings', to: '/settings' },
  ]},
]

const PAGE_TITLES = {
  '/dashboard': 'Dashboard', '/inbox': 'Inbox', '/workflows': 'Workflows',
  '/projects': 'Projects', '/forms': 'Forms', '/cases': 'Case Management',
  '/analytics': 'Analytics', '/team': 'Team', '/settings': 'Settings',
}

export default function AppLayout() {
  const [modal, setModal] = useState(false)
  const navigate = useNavigate()
  const { user, signOut } = useAuth()

  const title = PAGE_TITLES[window.location.pathname] || 'FlowOS'
  const displayName = user?.displayName || user?.email?.split('@')[0] || 'User'
  const initials = displayName.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
  const handleSignOut = async () => { await signOut(); navigate('/login') }

  return (
    <div className="flex h-screen overflow-hidden">
      {/* SIDEBAR */}
      <aside className="w-[220px] flex-shrink-0 bg-surface border-r border-border flex flex-col h-screen">
        {/* Logo */}
        <div className="flex items-center gap-2.5 px-5 py-[22px] border-b border-border">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-accent to-accent2 flex items-center justify-center text-sm font-bold text-white flex-shrink-0">F</div>
          <span className="text-[15px] font-bold tracking-tight">Flow<span className="text-accent">OS</span></span>
        </div>

        {/* Nav */}
        <nav className="flex-1 overflow-y-auto py-2">
          {NAV.map(section => (
            <div key={section.label} className="px-3 py-2">
              <div className="text-[9px] font-semibold tracking-[1.5px] text-text3 uppercase px-2 pb-2">{section.label}</div>
              {section.items.map(item => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  className={({ isActive }) =>
                    `flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-[13px] font-medium mb-0.5 relative transition-all duration-150 cursor-pointer
                    ${isActive ? 'nav-active' : 'text-text2 hover:bg-surface2 hover:text-text1'}`
                  }
                >
                  <span className="text-base w-5 text-center">{item.icon}</span>
                  <span>{item.label}</span>
                  {item.badge && (
                    <span className={`ml-auto text-[9px] font-bold px-1.5 py-0.5 rounded-full text-white ${item.badgeColor}`}>
                      {item.badge}
                    </span>
                  )}
                </NavLink>
              ))}
            </div>
          ))}
        </nav>

        {/* User */}
        <div className="border-t border-border p-3">
          <div className="flex items-center gap-2.5 px-2.5 py-2 rounded-lg cursor-pointer hover:bg-surface2 transition-all">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-accent to-accent2 flex items-center justify-center text-xs font-bold text-white flex-shrink-0">{initials}</div>
            <div className="flex-1 min-w-0">
              <div className="text-xs font-semibold truncate">{displayName}</div>
              <div className="text-[10px] text-text3">Pro Plan</div>
            </div>
            <button onClick={handleSignOut} title="Sign out" className="text-text3 hover:text-accent5 transition-all text-sm cursor-pointer">⏻</button>
          </div>
        </div>
      </aside>

      {/* MAIN */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Topbar */}
        <header className="h-14 bg-surface border-b border-border flex items-center px-6 gap-4 flex-shrink-0">
          <span className="text-base font-bold">{title}</span>
          <div className="flex items-center gap-2 bg-surface2 border border-border rounded-lg px-3 h-[34px] max-w-xs flex-1 ml-4">
            <span className="text-sm">🔍</span>
            <input
              type="text"
              placeholder="Search workflows, tasks, forms…"
              className="bg-transparent border-none outline-none text-xs text-text1 placeholder-text3 flex-1 font-sora"
            />
          </div>
          <div className="ml-auto flex items-center gap-2.5">
            <button className="w-[34px] h-[34px] bg-surface2 border border-border rounded-lg flex items-center justify-center text-base hover:border-accent hover:text-accent transition-all relative">
              🔔
              <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-accent5 rounded-full border-2 border-surface"></span>
            </button>
            <button className="w-[34px] h-[34px] bg-surface2 border border-border rounded-lg flex items-center justify-center text-base hover:border-accent hover:text-accent transition-all">❓</button>
            <button
              onClick={() => setModal(true)}
              className="px-4 py-1.5 rounded-lg text-xs font-semibold bg-gradient-to-r from-accent to-accent2 text-white hover:opacity-90 transition-all"
            >
              + New
            </button>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto p-6 bg-bg">
          <div className="page-enter">
            <Outlet />
          </div>
        </main>
      </div>

      {modal && <NewModal onClose={() => setModal(false)} navigate={navigate} />}
    </div>
  )
}
