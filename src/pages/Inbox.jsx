import { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import { Badge, Btn } from '../components/UI'
import { Toast } from '../components/FormComponents'
import { subscribeInbox, markInboxRead, getRequestDetail, respondRequestFn } from '../services/firebaseService'
import { Modal, FormField, Textarea } from '../components/FormComponents'

const prioV = { High:'red', Medium:'orange', Low:'gray' }

export default function Inbox() {
  const { user, isHQ } = useAuth()
  const [items, setItems] = useState([])
  const [activeId, setActiveId] = useState(null)
  const [detail, setDetail] = useState(null)
  const [toast, setToast] = useState(null)
  const [commentModal, setCommentModal] = useState(false)
  const [comment, setComment] = useState('')
  const [pendingAction, setPendingAction] = useState(null)
  const [acting, setActing] = useState(false)

  useEffect(() => {
    if (!user) return
    return subscribeInbox(user.uid, (inbox) => {
      setItems(inbox)
      if (!activeId && inbox.length > 0) setActiveId(inbox[0].id)
    })
  }, [user])

  useEffect(() => {
    if (!activeId) return
    const item = items.find(i => i.id === activeId)
    if (!item) return
    if (item.unread) markInboxRead(user.uid, activeId)
    if (item.requestId) getRequestDetail(item.requestId).then(setDetail)
    else setDetail(null)
  }, [activeId, items])

  const respond = async (status) => {
    if (!detail) return
    setActing(true)
    try {
      await respondRequestFn({ requestId: detail.id, status, comment })
      setToast({ msg: `Request ${status}!`, type: status==='Approved'?'success':'info' })
      setCommentModal(false)
      setComment('')
      setDetail(d => d ? {...d, status} : d)
    } catch(err) {
      setToast({ msg: err.message || 'Action failed.', type: 'error' })
    } finally { setActing(false) }
  }

  const handleAction = (status) => {
    setPendingAction(status)
    setCommentModal(true)
  }

  const active = items.find(i => i.id === activeId)
  const unread = items.filter(i => i.unread).length

  return (
    <div className="grid grid-cols-[280px_1fr] gap-0 h-[calc(100vh-56px-48px)] -m-6 mt-0">
      <div className="border-r border-border overflow-y-auto bg-surface">
        <div className="flex gap-2 p-3 border-b border-border flex-wrap">
          <span className="bg-surface2 border border-accent text-accent text-[11px] px-3 py-1 rounded-md">All ({items.length})</span>
          {unread > 0 && <span className="border border-border text-text3 text-[11px] px-3 py-1 rounded-md">Unread ({unread})</span>}
        </div>
        {items.length === 0 ? (
          <div className="text-xs text-text3 text-center py-12">
            <div className="text-3xl mb-3 opacity-30">📭</div>
            Inbox is empty
          </div>
        ) : items.map(item => (
          <div key={item.id} onClick={()=>setActiveId(item.id)}
            className={`px-4 py-3.5 border-b border-border cursor-pointer relative transition-all ${activeId===item.id?'bg-accent/[.08] border-l-2 border-l-accent':'hover:bg-surface2'}`}>
            <div className="flex justify-between mb-1">
              <span className="text-[10px] text-text2 font-medium">{item.from}</span>
              <span className="text-[10px] text-text3">{item.createdAt?.toDate?.().toLocaleDateString()||'Recent'}</span>
            </div>
            <div className="text-xs font-semibold mb-1">{item.title}</div>
            <div className="text-[11px] text-text3 truncate">{item.preview}</div>
            {item.status !== 'Pending' && <div className={`text-[9px] font-bold mt-1 ${item.status==='Approved'?'text-accent3':item.status==='Rejected'?'text-accent5':'text-accent4'}`}>{item.status}</div>}
            {item.unread && <div className="absolute right-4 top-1/2 -translate-y-1/2 w-2 h-2 bg-accent rounded-full"/>}
          </div>
        ))}
      </div>

      {active ? (
        <div className="p-6 overflow-y-auto">
          <div className="mb-5 pb-4 border-b border-border">
            <h1 className="text-lg font-bold mb-2">{active.title}</h1>
            <div className="flex flex-wrap gap-4">
              <div className="text-[11px] text-text2">From: <span className="font-medium text-text1">{active.from}</span>{active.fromDept ? ` · ${active.fromDept}` : ''}</div>
              <div className="text-[11px] text-text2">Type: <span className="font-medium text-text1">{active.type}</span></div>
              <div className="text-[11px] text-text2">Priority: <Badge variant={prioV[active.priority]||'gray'}>{active.priority}</Badge></div>
              <div className="text-[11px] text-text2">Status: <span className={`font-semibold ${active.status==='Approved'?'text-accent3':active.status==='Rejected'?'text-accent5':'text-accent4'}`}>{detail?.status||active.status}</span></div>
            </div>
          </div>

          {detail ? (
            <>
              <div className="text-[13px] text-text2 leading-relaxed mb-5 whitespace-pre-line">{detail.details}</div>
              {detail.comment && (
                <div className="bg-surface2 border-l-2 border-accent rounded-r-xl px-4 py-3 mb-5">
                  <div className="text-[10px] text-text3 mb-1">HQ Response</div>
                  <div className="text-xs text-text2 italic">"{detail.comment}"</div>
                  <div className="text-[10px] text-text3 mt-1">— {detail.respondedByName}</div>
                </div>
              )}
              {isHQ && (detail?.status === 'Pending' || !detail?.status) ? (
                <div className="flex gap-2.5">
                  <button onClick={()=>handleAction('Approved')} className="px-5 py-2.5 rounded-xl text-sm font-semibold bg-gradient-to-r from-accent3 to-emerald-600 text-white hover:opacity-90 cursor-pointer font-sora transition-all">✓ Approve</button>
                  <button onClick={()=>handleAction('Rejected')} className="px-5 py-2.5 rounded-xl text-sm font-semibold bg-surface2 border border-accent5/40 text-accent5 hover:bg-accent5/10 cursor-pointer font-sora transition-all">✗ Reject</button>
                  <button onClick={()=>handleAction('On Hold')} className="px-5 py-2.5 rounded-xl text-sm font-semibold bg-surface2 border border-border text-text2 hover:border-accent cursor-pointer font-sora transition-all">⏸ Hold</button>
                </div>
              ) : isHQ ? (
                <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold border ${detail?.status==='Approved'?'bg-accent3/10 border-accent3/30 text-accent3':detail?.status==='Rejected'?'bg-accent5/10 border-accent5/30 text-accent5':'bg-accent4/10 border-accent4/30 text-accent4'}`}>
                  {detail?.status==='Approved'?'✓':detail?.status==='Rejected'?'✗':'⏸'} {detail?.status}
                </div>
              ) : (
                <div className="bg-surface2 border border-border rounded-xl px-4 py-3 text-xs text-text3">
                  Your request is being reviewed by HQ. You'll receive an email when it's processed.
                </div>
              )}
            </>
          ) : (
            <div className="text-xs text-text3">Loading request details…</div>
          )}
        </div>
      ) : (
        <div className="flex items-center justify-center text-xs text-text3 flex-col gap-2">
          <div className="text-3xl opacity-20">📬</div>
          <span>Select a message to view</span>
        </div>
      )}

      {commentModal && (
        <Modal title={`${pendingAction} Request`} onClose={()=>setCommentModal(false)}>
          <div className={`text-sm font-semibold mb-4 ${pendingAction==='Approved'?'text-accent3':pendingAction==='Rejected'?'text-accent5':'text-accent4'}`}>
            {pendingAction==='Approved'?'✓':pendingAction==='Rejected'?'✗':'⏸'} You are about to {pendingAction?.toLowerCase()} this request.
          </div>
          <FormField label="Comment (optional — sent to staff via email)">
            <Textarea value={comment} onChange={e=>setComment(e.target.value)} placeholder={pendingAction==='Approved'?'Great work, approved!':pendingAction==='Rejected'?'Please resubmit with more details.':'Waiting for additional info…'} rows={3} />
          </FormField>
          <div className="flex gap-3 pt-2">
            <button onClick={()=>respond(pendingAction)} disabled={acting}
              className={`flex-1 py-2.5 rounded-xl text-sm font-semibold text-white cursor-pointer font-sora transition-all flex items-center justify-center gap-2 ${pendingAction==='Approved'?'bg-gradient-to-r from-accent3 to-emerald-600':pendingAction==='Rejected'?'bg-accent5':'bg-accent4'} hover:opacity-90 disabled:opacity-60`}>
              {acting?<><svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/></svg>Processing…</>:`Confirm ${pendingAction}`}
            </button>
            <Btn variant="ghost" onClick={()=>setCommentModal(false)} className="flex-1">Cancel</Btn>
          </div>
        </Modal>
      )}
      {toast && <Toast message={toast.msg} type={toast.type} onClose={()=>setToast(null)} />}
    </div>
  )
}
