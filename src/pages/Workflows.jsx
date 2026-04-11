import { useState } from 'react'
import { useStore } from '../context/StoreContext'
import { Card, Badge, ProgressBar, TabRow, Btn } from '../components/UI'
import { Modal, FormField, Input, Select, ConfirmDialog, Toast, EmptyState } from '../components/FormComponents'

const ICONS = ['👤','💰','💻','🏖️','🏢','📦','🔧','📊','🎯','🚀','📝','🔗']
const DEPTS = ['HR Department','Finance','IT Department','Procurement','Engineering','Legal','Operations','Marketing']
const STATUSES = ['Active','Pending','In Review','Delayed','Archived']
const statusVariant = { Active:'green', Pending:'orange', 'In Review':'blue', Delayed:'red', Archived:'gray' }
const pctColor = (p) => p >= 70 ? 'green' : p >= 50 ? 'blue' : p >= 30 ? 'orange' : 'red'
const empty = { icon:'👤', name:'', dept:'', steps:'', status:'Active', pct:0 }

export default function Workflows() {
  const { state, dispatch } = useStore()
  const [tab, setTab] = useState('All')
  const [modal, setModal] = useState(null)
  const [form, setForm] = useState(empty)
  const [deleteId, setDeleteId] = useState(null)
  const [toast, setToast] = useState(null)

  const filtered = tab === 'Archived' ? state.workflows.filter(w => w.status === 'Archived')
    : state.workflows.filter(w => w.status !== 'Archived')

  const openCreate = () => { setForm(empty); setModal('create') }
  const openEdit = (w) => { setForm({ ...w, steps: String(w.steps) }); setModal(w) }

  const save = () => {
    if (!form.name.trim() || !form.dept) return setToast({ msg: 'Name and department are required.', type: 'error' })
    if (modal === 'create') dispatch({ type: 'ADD_WORKFLOW', payload: { ...form, steps: Number(form.steps)||1 } })
    else dispatch({ type: 'UPDATE_WORKFLOW', payload: { ...form, steps: Number(form.steps)||1 } })
    setToast({ msg: modal === 'create' ? 'Workflow created!' : 'Workflow updated!', type: 'success' })
    setModal(null)
  }

  const set = (k) => (e) => setForm(f => ({ ...f, [k]: e.target.value }))

  return (
    <div>
      <div className="flex items-center gap-3 mb-5">
        <TabRow tabs={['All','Archived']} active={tab} onChange={setTab} />
        <Btn onClick={openCreate} className="ml-auto">+ Create Workflow</Btn>
      </div>
      {filtered.length === 0 ? <EmptyState icon="⚡" title="No workflows yet" desc="Create your first workflow to get started." action="+ Create Workflow" onAction={openCreate} /> : (
        <div className="grid grid-cols-3 gap-4">
          {filtered.map(w => (
            <Card key={w.id}>
              <div className="flex items-start justify-between mb-2.5">
                <span className="text-2xl">{w.icon}</span>
                <Badge variant={statusVariant[w.status]||'gray'}>{w.status}</Badge>
              </div>
              <div className="text-[13px] font-bold mb-1">{w.name}</div>
              <div className="text-[11px] text-text3 mb-3">{w.steps} steps · {w.dept}</div>
              <ProgressBar value={w.pct} color={pctColor(w.pct)} />
              <div className="flex justify-between text-[10px] text-text3 mt-2 mb-4"><span>{w.instances} instances</span><span>{w.pct}%</span></div>
              <div className="flex gap-2 pt-3 border-t border-border">
                <button onClick={() => openEdit(w)} className="flex-1 py-1.5 rounded-lg text-[10px] font-semibold bg-surface2 border border-border text-text2 hover:border-accent hover:text-accent cursor-pointer transition-all font-sora">✏️ Edit</button>
                <button onClick={() => dispatch({ type:'UPDATE_WORKFLOW', payload:{...w, status: w.status==='Active'?'Pending':'Active'} })} className="flex-1 py-1.5 rounded-lg text-[10px] font-semibold bg-surface2 border border-border text-text2 hover:border-accent3 hover:text-accent3 cursor-pointer transition-all font-sora">{w.status==='Active'?'⏸ Pause':'▶ Activate'}</button>
                <button onClick={() => setDeleteId(w.id)} className="py-1.5 px-2.5 rounded-lg text-[10px] bg-surface2 border border-border text-text3 hover:border-accent5 hover:text-accent5 cursor-pointer transition-all">🗑</button>
              </div>
            </Card>
          ))}
          <div onClick={openCreate} className="bg-surface border border-dashed border-border rounded-xl flex flex-col items-center justify-center gap-2 min-h-[200px] cursor-pointer hover:border-accent transition-all group">
            <div className="text-3xl opacity-30 group-hover:opacity-60 transition-all">+</div>
            <div className="text-xs text-text3">Create New Workflow</div>
          </div>
        </div>
      )}
      {modal !== null && (
        <Modal title={modal === 'create' ? 'Create Workflow' : 'Edit Workflow'} onClose={() => setModal(null)}>
          <FormField label="Workflow Name" required><Input value={form.name} onChange={set('name')} placeholder="e.g. Employee Onboarding" /></FormField>
          <FormField label="Icon">
            <div className="flex flex-wrap gap-2">{ICONS.map(ic => <button key={ic} onClick={() => setForm(f=>({...f,icon:ic}))} className={`w-9 h-9 rounded-lg text-lg flex items-center justify-center cursor-pointer border transition-all ${form.icon===ic?'border-accent bg-accent/10':'border-border bg-surface2 hover:border-accent/50'}`}>{ic}</button>)}</div>
          </FormField>
          <FormField label="Department" required><Select value={form.dept} onChange={set('dept')} options={DEPTS} placeholder="Select department" /></FormField>
          <div className="grid grid-cols-2 gap-4">
            <FormField label="Steps"><Input type="number" value={form.steps} onChange={set('steps')} placeholder="5" /></FormField>
            <FormField label="Status"><Select value={form.status} onChange={set('status')} options={STATUSES} /></FormField>
          </div>
          <FormField label={`Completion: ${form.pct}%`}>
            <input type="range" min="0" max="100" value={form.pct} onChange={set('pct')} className="w-full accent-[#4f6ef7]" />
          </FormField>
          <div className="flex gap-3 pt-2">
            <Btn onClick={save} className="flex-1">{modal==='create'?'Create':'Save Changes'}</Btn>
            <Btn variant="ghost" onClick={() => setModal(null)} className="flex-1">Cancel</Btn>
          </div>
        </Modal>
      )}
      {deleteId && <ConfirmDialog message="Delete this workflow permanently?" onConfirm={() => { dispatch({type:'DELETE_WORKFLOW',payload:deleteId}); setDeleteId(null); setToast({msg:'Deleted.',type:'info'}) }} onCancel={() => setDeleteId(null)} />}
      {toast && <Toast message={toast.msg} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  )
}
