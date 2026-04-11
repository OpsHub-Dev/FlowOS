import { useState } from 'react'
import { useStore } from '../context/StoreContext'
import { Card, Badge, TabRow, Btn } from '../components/UI'
import { Modal, FormField, Input, Select, Textarea, ConfirmDialog, Toast, EmptyState } from '../components/FormComponents'

const CATS = ['Finance','IT','HR','Procurement','Legal','Operations']
const PRIORITIES = ['Low','Medium','High']
const STATUSES = ['Open','In Progress','Resolved','Closed']
const statusV = { Open:'orange', 'In Progress':'blue', Resolved:'green', Closed:'gray' }
const prioV = { High:'red', Medium:'orange', Low:'gray' }
const catV = { Finance:'purple', IT:'blue', HR:'green', Procurement:'orange', Legal:'gray', Operations:'blue' }
const empty = { title:'', cat:'IT', assignee:'', priority:'Medium', status:'Open', desc:'' }

export default function Cases() {
  const { state, dispatch } = useStore()
  const [tab, setTab] = useState('All')
  const [modal, setModal] = useState(null)
  const [detail, setDetail] = useState(null)
  const [form, setForm] = useState(empty)
  const [deleteId, setDeleteId] = useState(null)
  const [toast, setToast] = useState(null)

  const filtered = tab === 'All' ? state.cases : state.cases.filter(c => c.status === tab)

  const openCreate = () => { setForm(empty); setModal('create') }
  const openEdit = (c) => { setForm({...c}); setModal(c) }

  const save = () => {
    if (!form.title.trim()) return setToast({msg:'Title is required.',type:'error'})
    if (modal==='create') dispatch({type:'ADD_CASE', payload:form})
    else dispatch({type:'UPDATE_CASE', payload:form})
    setToast({msg: modal==='create'?'Case created!':'Case updated!', type:'success'})
    setModal(null)
  }
  const set = (k) => (e) => setForm(f=>({...f,[k]:e.target.value}))

  return (
    <div>
      <div className="flex items-center gap-3 mb-5">
        <TabRow tabs={['All','Open','In Progress','Resolved']} active={tab} onChange={setTab} />
        <Btn onClick={openCreate} className="ml-auto">+ New Case</Btn>
      </div>

      {filtered.length===0 ? <EmptyState icon="🗂️" title="No cases" desc="Create your first case." action="+ New Case" onAction={openCreate} /> : (
        <div className="bg-surface border border-border rounded-xl overflow-hidden">
          <table className="w-full">
            <thead><tr>{['#','Title','Category','Assignee','Priority','Status','Created','Actions'].map(h=><th key={h} className="text-[10px] font-semibold uppercase tracking-[.8px] text-text3 px-3 py-3 text-left border-b border-border">{h}</th>)}</tr></thead>
            <tbody>
              {filtered.map(c=>(
                <tr key={c.id} className="hover:bg-white/[.02]">
                  <td className="px-3 py-3 text-[11px] font-mono text-text3 border-b border-border/60">#{c.id}</td>
                  <td className="px-3 py-3 text-xs font-semibold border-b border-border/60 cursor-pointer text-accent hover:underline" onClick={()=>setDetail(c)}>{c.title}</td>
                  <td className="px-3 py-3 border-b border-border/60"><Badge variant={catV[c.cat]||'blue'}>{c.cat}</Badge></td>
                  <td className="px-3 py-3 text-xs text-text3 border-b border-border/60">{c.assignee}</td>
                  <td className="px-3 py-3 border-b border-border/60"><Badge variant={prioV[c.priority]}>{c.priority}</Badge></td>
                  <td className="px-3 py-3 border-b border-border/60"><Badge variant={statusV[c.status]}>{c.status}</Badge></td>
                  <td className="px-3 py-3 text-[11px] text-text3 border-b border-border/60">{c.created}</td>
                  <td className="px-3 py-3 border-b border-border/60">
                    <div className="flex gap-1.5">
                      <button onClick={()=>openEdit(c)} className="text-[10px] px-2 py-1 rounded bg-surface2 border border-border text-text2 hover:border-accent hover:text-accent cursor-pointer transition-all">Edit</button>
                      <button onClick={()=>setDeleteId(c.id)} className="text-[10px] px-2 py-1 rounded bg-surface2 border border-border text-text3 hover:border-accent5 hover:text-accent5 cursor-pointer transition-all">Delete</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Detail view */}
      {detail && (
        <Modal title={`Case #${detail.id}`} onClose={()=>setDetail(null)} width="max-w-xl">
          <div className="flex gap-2 flex-wrap mb-4">
            <Badge variant={prioV[detail.priority]}>{detail.priority}</Badge>
            <Badge variant={statusV[detail.status]}>{detail.status}</Badge>
            <Badge variant={catV[detail.cat]||'blue'}>{detail.cat}</Badge>
          </div>
          <h3 className="text-sm font-bold mb-2">{detail.title}</h3>
          <p className="text-xs text-text2 leading-relaxed mb-4">{detail.desc || 'No description provided.'}</p>
          <div className="grid grid-cols-2 gap-3 text-xs mb-4">
            <div><span className="text-text3">Assignee: </span><span className="font-semibold">{detail.assignee}</span></div>
            <div><span className="text-text3">Created: </span><span className="font-semibold">{detail.created}</span></div>
          </div>
          <div className="flex gap-2">
            <Btn onClick={()=>{openEdit(detail);setDetail(null)}}>Edit Case</Btn>
            <select value={detail.status} onChange={e=>{dispatch({type:'UPDATE_CASE',payload:{...detail,status:e.target.value}});setDetail({...detail,status:e.target.value})}} className="px-3 py-1.5 rounded-lg text-xs bg-surface2 border border-border text-text1 outline-none font-sora cursor-pointer">
              {STATUSES.map(s=><option key={s}>{s}</option>)}
            </select>
          </div>
        </Modal>
      )}

      {modal!==null && (
        <Modal title={modal==='create'?'New Case':'Edit Case'} onClose={()=>setModal(null)}>
          <FormField label="Title" required><Input value={form.title} onChange={set('title')} placeholder="Describe the issue" /></FormField>
          <div className="grid grid-cols-2 gap-4">
            <FormField label="Category"><Select value={form.cat} onChange={set('cat')} options={CATS} /></FormField>
            <FormField label="Assignee"><Input value={form.assignee} onChange={set('assignee')} placeholder="Name" /></FormField>
            <FormField label="Priority"><Select value={form.priority} onChange={set('priority')} options={PRIORITIES} /></FormField>
            <FormField label="Status"><Select value={form.status} onChange={set('status')} options={STATUSES} /></FormField>
          </div>
          <FormField label="Description"><Textarea value={form.desc} onChange={set('desc')} placeholder="Describe the case in detail..." rows={4} /></FormField>
          <div className="flex gap-3 pt-2">
            <Btn onClick={save} className="flex-1">{modal==='create'?'Create Case':'Save Changes'}</Btn>
            <Btn variant="ghost" onClick={()=>setModal(null)} className="flex-1">Cancel</Btn>
          </div>
        </Modal>
      )}
      {deleteId && <ConfirmDialog message="Delete this case permanently?" onConfirm={()=>{dispatch({type:'DELETE_CASE',payload:deleteId});setDeleteId(null);setToast({msg:'Case deleted.',type:'info'})}} onCancel={()=>setDeleteId(null)} />}
      {toast && <Toast message={toast.msg} type={toast.type} onClose={()=>setToast(null)} />}
    </div>
  )
}
