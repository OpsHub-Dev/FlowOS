import { useState, useEffect } from 'react'
import { useStore } from '../context/StoreContext'
import { useAuth } from '../context/AuthContext'
import { Btn, Badge } from '../components/UI'
import { Modal, FormField, Input, Select, ConfirmDialog, Toast, EmptyState } from '../components/FormComponents'
import { sendInviteFn, getAllUsers, deleteUser, updateUserProfile } from '../services/firebaseService'

const ROLES = ['Admin','Manager','Member','Viewer']
const DEPTS = ['Engineering','HR','Finance','IT','Legal','Design','Marketing','Operations']
const GRADS = ['from-accent to-accent2','from-accent3 to-emerald-600','from-accent4 to-orange-600','from-accent2 to-violet-700','from-accent5 to-rose-700','from-teal-500 to-cyan-600']
const STATUS_V = { Active:'green', Away:'orange', Inactive:'gray' }
const emptyForm = { name:'', email:'', role:'Member', dept:'', status:'Active' }

export default function Team() {
  const { user } = useAuth()
  const [members, setMembers] = useState([])
  const [modal, setModal] = useState(null)
  const [form, setForm] = useState(emptyForm)
  const [deleteId, setDeleteId] = useState(null)
  const [toast, setToast] = useState(null)
  const [sending, setSending] = useState(false)

  useEffect(() => {
    getAllUsers().then(setMembers)
  }, [])

  const openCreate = () => { setForm(emptyForm); setModal('create') }
  const openEdit = (m) => { setForm({...m}); setModal(m) }

  const save = async () => {
    if (!form.name.trim() || !form.email.trim()) return setToast({msg:'Name and email are required.',type:'error'})
    if (modal === 'create') {
      setSending(true)
      try {
        await sendInviteFn({
          email: form.email, name: form.name, role: form.role,
          dept: form.dept, orgName: 'FlowOS', appUrl: window.location.origin
        })
        setToast({msg:`Invite sent to ${form.email}!`, type:'success'})
        const updated = await getAllUsers()
        setMembers(updated)
      } catch(err) {
        setToast({msg: err.message || 'Failed to send invite.', type:'error'})
      } finally { setSending(false) }
    } else {
      await updateUserProfile(form.id || form.uid, { name:form.name, role:form.role, dept:form.dept, status:form.status })
      setToast({msg:'Member updated!', type:'success'})
      const updated = await getAllUsers()
      setMembers(updated)
    }
    setModal(null)
  }

  const confirmDelete = async () => {
    await deleteUser(deleteId)
    setMembers(m => m.filter(x => (x.id||x.uid) !== deleteId))
    setDeleteId(null)
    setToast({msg:'Member removed.', type:'info'})
  }

  const set = (k) => (e) => setForm(f=>({...f,[k]:e.target.value}))
  const initials = (name) => (name||'U').split(' ').map(n=>n[0]).join('').toUpperCase().slice(0,2)

  return (
    <div>
      <div className="flex gap-2.5 mb-5">
        <Btn onClick={openCreate}>+ Invite Member</Btn>
        <div className="ml-auto text-xs text-text3 flex items-center">{members.length} members</div>
      </div>
      {members.length===0 ? <EmptyState icon="👥" title="No team members" desc="Invite your first team member." action="+ Invite Member" onAction={openCreate} /> : (
        <div className="grid grid-cols-3 gap-4">
          {members.map((m,i)=>{
            const id = m.id||m.uid
            return (
              <div key={id} className="bg-surface border border-border rounded-xl p-5 text-center hover:border-accent transition-all">
                <div className={`w-[52px] h-[52px] rounded-full bg-gradient-to-br ${GRADS[i%GRADS.length]} flex items-center justify-center text-lg font-bold text-white mx-auto mb-3`}>{initials(m.name)}</div>
                <div className="text-[13px] font-bold mb-0.5">{m.name}</div>
                <div className="text-[11px] text-text3 mb-1">{m.role} · {m.dept}</div>
                <div className="text-[10px] text-text3 mb-2">{m.email}</div>
                <div className="mb-3"><Badge variant={STATUS_V[m.status]||'gray'}>{m.status||'Active'}</Badge></div>
                <div className="flex gap-2">
                  <button onClick={()=>openEdit({...m, id})} className="flex-1 py-1.5 rounded-lg text-[10px] font-semibold bg-surface2 border border-border text-text2 hover:border-accent hover:text-accent cursor-pointer transition-all font-sora">Edit</button>
                  <button onClick={()=>setDeleteId(id)} className="py-1.5 px-2.5 rounded-lg text-[10px] bg-surface2 border border-border text-text3 hover:border-accent5 hover:text-accent5 cursor-pointer transition-all">🗑</button>
                </div>
              </div>
            )
          })}
          <div onClick={openCreate} className="bg-surface border border-dashed border-border rounded-xl flex flex-col items-center justify-center gap-2 min-h-[200px] cursor-pointer hover:border-accent transition-all">
            <div className="text-3xl opacity-30">+</div>
            <div className="text-xs text-text3">Invite a Team Member</div>
          </div>
        </div>
      )}
      {modal!==null && (
        <Modal title={modal==='create'?'Invite Member':'Edit Member'} onClose={()=>setModal(null)}>
          {modal==='create' && (
            <div className="bg-accent/10 border border-accent/20 rounded-xl px-4 py-3 mb-4 text-[11px] text-text2">
              📧 An invitation email will be sent to this address with a registration link.
            </div>
          )}
          <FormField label="Full Name" required><Input value={form.name} onChange={set('name')} placeholder="e.g. Alex Johnson" /></FormField>
          <FormField label="Email" required><Input type="email" value={form.email} onChange={set('email')} placeholder="alex@company.com" disabled={modal!=='create'} /></FormField>
          <div className="grid grid-cols-2 gap-4">
            <FormField label="Role"><Select value={form.role} onChange={set('role')} options={ROLES} /></FormField>
            <FormField label="Department"><Select value={form.dept} onChange={set('dept')} options={DEPTS} placeholder="Select dept" /></FormField>
            {modal!=='create' && <FormField label="Status"><Select value={form.status} onChange={set('status')} options={['Active','Away','Inactive']} /></FormField>}
          </div>
          <div className="flex gap-3 pt-2">
            <button onClick={save} disabled={sending} className="flex-1 py-2.5 rounded-xl text-sm font-semibold bg-gradient-to-r from-accent to-accent2 text-white hover:opacity-90 disabled:opacity-60 cursor-pointer font-sora flex items-center justify-center gap-2 transition-all">
              {sending ? <><svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/></svg> Sending…</> : modal==='create'?'Send Invite':'Save Changes'}
            </button>
            <Btn variant="ghost" onClick={()=>setModal(null)} className="flex-1">Cancel</Btn>
          </div>
        </Modal>
      )}
      {deleteId && <ConfirmDialog message="Remove this member from the team?" onConfirm={confirmDelete} onCancel={()=>setDeleteId(null)} />}
      {toast && <Toast message={toast.msg} type={toast.type} onClose={()=>setToast(null)} />}
    </div>
  )
}
