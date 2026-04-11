import { useState, useEffect } from 'react'
import { useAuth } from '../../context/AuthContext'
import { submitRequestFn, subscribeMyRequests, subscribeNotifications, markNotificationRead } from '../../services/firebaseService'
import { Modal, FormField, Input, Select, Textarea, Toast } from '../../components/FormComponents'
import { Badge } from '../../components/UI'

const REQUEST_TYPES = ['Leave Request', 'IT Asset Request', 'Purchase Request', 'Travel Request', 'Expense Claim', 'Training Request', 'Other']
const PRIORITIES = ['Low', 'Medium', 'High']
const statusV = { Pending: 'orange', Approved: 'green', Rejected: 'red', 'On Hold': 'gray' }

const emptyForm = { type: 'Leave Request', title: '', details: '', priority: 'Medium' }

export default function StaffPortal() {
  const { user, profile } = useAuth()
  const [requests, setRequests] = useState([])
  const [notifications, setNotifications] = useState([])
  const [modal, setModal] = useState(false)
  const [form, setForm] = useState(emptyForm)
  const [loading, setLoading] = useState(false)
  const [toast, setToast] = useState(null)
  const [tab, setTab] = useState('My Requests')

  useEffect(() => {
    if (!user) return
    const unsubReq = subscribeMyRequests(user.uid, setRequests)
    const unsubNotif = subscribeNotifications(user.uid, setNotifications)
    return () => { unsubReq(); unsubNotif() }
  }, [user])

  const unreadNotifs = notifications.filter(n => !n.read).length

  const submit = async () => {
    if (!form.title.trim() || !form.details.trim())
      return setToast({ msg: 'Title and details are required.', type: 'error' })
    setLoading(true)
    try {
      await submitRequestFn({ ...form, appUrl: window.location.origin })
      setToast({ msg: 'Request submitted to HQ!', type: 'success' })
      setModal(false)
      setForm(emptyForm)
    } catch (err) {
      setToast({ msg: err.message || 'Failed to submit request.', type: 'error' })
    } finally {
      setLoading(false)
    }
  }

  const set = (k) => (e) => setForm(f => ({ ...f, [k]: e.target.value }))

  const markRead = async (notif) => {
    if (!notif.read) await markNotificationRead(user.uid, notif.id)
  }

  return (
    <div className="min-h-screen bg-bg">
      {/* Header */}
      <header className="bg-surface border-b border-border px-6 py-4 flex items-center gap-4">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-accent to-accent2 flex items-center justify-center text-sm font-bold text-white">F</div>
          <span className="text-base font-bold">Flow<span className="text-accent">OS</span></span>
          <span className="text-text3 text-xs ml-1">· Employee Portal</span>
        </div>
        <div className="ml-auto flex items-center gap-3">
          <div className="text-xs text-text2 text-right">
            <div className="font-semibold">{profile?.name || user?.displayName || 'Employee'}</div>
            <div className="text-text3">{profile?.dept || 'Staff'}</div>
          </div>
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-accent to-accent2 flex items-center justify-center text-xs font-bold text-white">
            {(profile?.name || user?.displayName || 'U').split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)}
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto p-6">
        {/* Welcome */}
        <div className="mb-6">
          <h1 className="text-xl font-bold mb-1">Good day, {(profile?.name || user?.displayName || 'there').split(' ')[0]}! 👋</h1>
          <p className="text-sm text-text3">Submit requests and track their status below.</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-4 gap-4 mb-6">
          {[
            { label: 'Total Requests', value: requests.length, color: 'text-accent', icon: '📋' },
            { label: 'Pending', value: requests.filter(r => r.status === 'Pending').length, color: 'text-accent4', icon: '⏳' },
            { label: 'Approved', value: requests.filter(r => r.status === 'Approved').length, color: 'text-accent3', icon: '✅' },
            { label: 'Notifications', value: unreadNotifs, color: 'text-accent5', icon: '🔔' },
          ].map(s => (
            <div key={s.label} className="bg-surface border border-border rounded-xl p-4">
              <div className="text-xl mb-2">{s.icon}</div>
              <div className={`text-2xl font-bold font-mono ${s.color}`}>{s.value}</div>
              <div className="text-[11px] text-text3 mt-0.5">{s.label}</div>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex gap-1 bg-surface2 rounded-lg p-1">
            {['My Requests', `Notifications${unreadNotifs ? ` (${unreadNotifs})` : ''}`].map(t => (
              <button key={t} onClick={() => setTab(t.split(' (')[0])}
                className={`px-4 py-1.5 rounded-md text-xs font-medium cursor-pointer border-none font-sora transition-all ${tab === t.split(' (')[0] ? 'bg-surface text-text1 shadow' : 'bg-transparent text-text2 hover:text-text1'}`}>
                {t}
              </button>
            ))}
          </div>
          <button onClick={() => setModal(true)}
            className="px-4 py-2 rounded-xl text-xs font-semibold bg-gradient-to-r from-accent to-accent2 text-white hover:opacity-90 cursor-pointer font-sora transition-all">
            + New Request
          </button>
        </div>

        {/* My Requests */}
        {tab === 'My Requests' && (
          <div className="bg-surface border border-border rounded-xl overflow-hidden">
            {requests.length === 0 ? (
              <div className="text-center py-14">
                <div className="text-4xl mb-3 opacity-30">📋</div>
                <div className="text-sm font-bold mb-1">No requests yet</div>
                <div className="text-xs text-text3 mb-4">Submit your first request to HQ</div>
                <button onClick={() => setModal(true)} className="px-4 py-2 rounded-lg text-xs font-semibold bg-gradient-to-r from-accent to-accent2 text-white cursor-pointer font-sora">+ New Request</button>
              </div>
            ) : (
              <table className="w-full">
                <thead>
                  <tr>{['Type', 'Title', 'Priority', 'Status', 'Submitted', 'Response'].map(h => (
                    <th key={h} className="text-[10px] font-semibold uppercase tracking-[.8px] text-text3 px-4 py-3 text-left border-b border-border">{h}</th>
                  ))}</tr>
                </thead>
                <tbody>
                  {requests.map(r => (
                    <tr key={r.id} className="hover:bg-white/[.02]">
                      <td className="px-4 py-3 text-xs border-b border-border/60"><Badge variant="blue">{r.type}</Badge></td>
                      <td className="px-4 py-3 text-xs font-semibold border-b border-border/60">{r.title}</td>
                      <td className="px-4 py-3 border-b border-border/60"><Badge variant={r.priority === 'High' ? 'red' : r.priority === 'Medium' ? 'orange' : 'gray'}>{r.priority}</Badge></td>
                      <td className="px-4 py-3 border-b border-border/60"><Badge variant={statusV[r.status] || 'gray'}>{r.status}</Badge></td>
                      <td className="px-4 py-3 text-[11px] text-text3 border-b border-border/60">{r.createdAt?.toDate?.().toLocaleDateString() || 'Just now'}</td>
                      <td className="px-4 py-3 text-[11px] border-b border-border/60">
                        {r.comment ? <span className="text-text2 italic">"{r.comment.slice(0, 40)}{r.comment.length > 40 ? '…' : ''}"</span> : <span className="text-text3">—</span>}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        )}

        {/* Notifications */}
        {tab === 'Notifications' && (
          <div className="bg-surface border border-border rounded-xl overflow-hidden">
            {notifications.length === 0 ? (
              <div className="text-center py-14">
                <div className="text-4xl mb-3 opacity-30">🔔</div>
                <div className="text-sm font-bold mb-1">No notifications</div>
                <div className="text-xs text-text3">You'll be notified when HQ responds to your requests</div>
              </div>
            ) : notifications.map(n => (
              <div key={n.id} onClick={() => markRead(n)}
                className={`flex items-start gap-4 px-5 py-4 border-b border-border cursor-pointer transition-all hover:bg-surface2 ${!n.read ? 'bg-accent/[.04]' : ''}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm flex-shrink-0 mt-0.5 ${n.status === 'Approved' ? 'bg-accent3/20 text-accent3' : n.status === 'Rejected' ? 'bg-accent5/20 text-accent5' : 'bg-accent4/20 text-accent4'}`}>
                  {n.status === 'Approved' ? '✓' : n.status === 'Rejected' ? '✗' : '⏸'}
                </div>
                <div className="flex-1">
                  <div className="text-xs font-semibold mb-0.5">{n.title}</div>
                  <div className="text-[11px] text-text3">{n.body}</div>
                </div>
                {!n.read && <div className="w-2 h-2 bg-accent rounded-full mt-1.5 flex-shrink-0" />}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* New Request Modal */}
      {modal && (
        <Modal title="Submit New Request" onClose={() => setModal(false)}>
          <FormField label="Request Type" required>
            <Select value={form.type} onChange={set('type')} options={REQUEST_TYPES} />
          </FormField>
          <FormField label="Title" required>
            <Input value={form.title} onChange={set('title')} placeholder="Brief description of your request" />
          </FormField>
          <FormField label="Priority">
            <Select value={form.priority} onChange={set('priority')} options={PRIORITIES} />
          </FormField>
          <FormField label="Details" required>
            <Textarea value={form.details} onChange={set('details')} placeholder="Provide full details of your request. Include dates, quantities, or any relevant information..." rows={5} />
          </FormField>
          <div className="bg-surface2 border border-border rounded-lg px-4 py-3 mb-4 text-[11px] text-text3">
            💡 Your request will be sent to HQ for review. You'll receive an email notification when it's approved or rejected.
          </div>
          <div className="flex gap-3">
            <button onClick={submit} disabled={loading}
              className="flex-1 py-2.5 rounded-xl text-sm font-semibold bg-gradient-to-r from-accent to-accent2 text-white hover:opacity-90 disabled:opacity-60 cursor-pointer font-sora flex items-center justify-center gap-2 transition-all">
              {loading ? <><svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/></svg> Submitting…</> : '📤 Submit to HQ'}
            </button>
            <button onClick={() => setModal(false)} className="flex-1 py-2.5 rounded-xl text-sm font-semibold bg-surface2 border border-border text-text2 hover:text-text1 cursor-pointer font-sora transition-all">Cancel</button>
          </div>
        </Modal>
      )}

      {toast && <Toast message={toast.msg} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  )
}
