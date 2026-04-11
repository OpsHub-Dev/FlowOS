import { useState } from 'react'
import { useStore } from '../context/StoreContext'
import { Card, Badge, Btn } from '../components/UI'
import { Modal, FormField, Input, Select, ConfirmDialog, Toast, EmptyState } from '../components/FormComponents'

const ICONS = ['📋','🛒','💻','📝','📊','🎯','🔧','📦','🏢','👤']
const DEPTS = ['HR Department','Finance','IT Department','Procurement','Engineering','Legal','Operations']
const STATUSES = ['Draft','Published','Archived']
const statusV = { Published:'green', Draft:'gray', Archived:'orange' }
const empty = { icon:'📋', name:'', dept:'', fields:5, status:'Draft' }

export default function Forms() {
  const { state, dispatch } = useStore()
  const [modal, setModal] = useState(null)
  const [form, setForm] = useState(empty)
  const [deleteId, setDeleteId] = useState(null)
  const [toast, setToast] = useState(null)

  const openCreate = () => { setForm(empty); setModal('create') }
  const openEdit = (f) => { setForm({...f, fields: String(f.fields)}); setModal(f) }

  const save = () => {
    if (!form.name.trim() || !form.dept) return setToast({msg:'Name and department are required.',type:'error'})
    if (modal==='create') dispatch({type:'ADD_FORM', payload:{...form, fields:Number(form.fields)||1}})
    else dispatch({type:'UPDATE_FORM', payload:{...form, fields:Number(form.fields)||1}})
    setToast({msg: modal==='create'?'Form created!':'Form updated!', type:'success'})
    setModal(null)
  }
  const set = (k) => (e) => setForm(f=>({...f,[k]:e.target.value}))

  return (
    <div>
      <div className="flex gap-2.5 mb-5">
        <Btn onClick={openCreate}>+ Create Form</Btn>
      </div>
      {state.forms.length===0 ? <EmptyState icon="📝" title="No forms yet" desc="Create your first form." action="+ Create Form" onAction={openCreate} /> : (
        <div className="grid grid-cols-3 gap-4 mb-5">
          {state.forms.map(f=>(
            <Card key={f.id}>
              <div className="flex items-center justify-between mb-2.5">
                <span className="text-2xl">{f.icon}</span>
                <Badge variant={statusV[f.status]||'gray'}>{f.status}</Badge>
              </div>
              <div className="text-[13px] font-bold mb-1">{f.name}</div>
              <div className="text-[11px] text-text3 mb-3">{f.dept} · {f.fields} fields</div>
              <div className="text-xs text-text2 mb-4">📥 <strong className="text-text1">{f.submissions}</strong> submissions</div>
              <div className="flex gap-2 pt-3 border-t border-border">
                <button onClick={()=>openEdit(f)} className="flex-1 py-1.5 rounded-lg text-[10px] font-semibold bg-surface2 border border-border text-text2 hover:border-accent hover:text-accent cursor-pointer transition-all font-sora">✏️ Edit</button>
                <button onClick={()=>dispatch({type:'UPDATE_FORM',payload:{...f,status:f.status==='Published'?'Draft':'Published'}})} className="flex-1 py-1.5 rounded-lg text-[10px] font-semibold bg-surface2 border border-border text-text2 hover:border-accent3 hover:text-accent3 cursor-pointer transition-all font-sora">{f.status==='Published'?'Unpublish':'Publish'}</button>
                <button onClick={()=>setDeleteId(f.id)} className="py-1.5 px-2.5 rounded-lg text-[10px] bg-surface2 border border-border text-text3 hover:border-accent5 hover:text-accent5 cursor-pointer transition-all">🗑</button>
              </div>
            </Card>
          ))}
          <div onClick={openCreate} className="bg-surface border border-dashed border-border rounded-xl flex flex-col items-center justify-center gap-2 min-h-[160px] cursor-pointer hover:border-accent transition-all group">
            <div className="text-3xl opacity-30 group-hover:opacity-60 transition-all">+</div>
            <div className="text-xs text-text3">Create New Form</div>
          </div>
        </div>
      )}
      {modal!==null && (
        <Modal title={modal==='create'?'Create Form':'Edit Form'} onClose={()=>setModal(null)}>
          <FormField label="Form Name" required><Input value={form.name} onChange={set('name')} placeholder="e.g. Leave Request Form" /></FormField>
          <FormField label="Icon">
            <div className="flex flex-wrap gap-2">{ICONS.map(ic=><button key={ic} onClick={()=>setForm(f=>({...f,icon:ic}))} className={`w-9 h-9 rounded-lg text-lg flex items-center justify-center cursor-pointer border transition-all ${form.icon===ic?'border-accent bg-accent/10':'border-border bg-surface2 hover:border-accent/50'}`}>{ic}</button>)}</div>
          </FormField>
          <FormField label="Department" required><Select value={form.dept} onChange={set('dept')} options={DEPTS} placeholder="Select department" /></FormField>
          <div className="grid grid-cols-2 gap-4">
            <FormField label="Number of Fields"><Input type="number" value={form.fields} onChange={set('fields')} placeholder="5" /></FormField>
            <FormField label="Status"><Select value={form.status} onChange={set('status')} options={STATUSES} /></FormField>
          </div>
          <div className="flex gap-3 pt-2">
            <Btn onClick={save} className="flex-1">{modal==='create'?'Create Form':'Save Changes'}</Btn>
            <Btn variant="ghost" onClick={()=>setModal(null)} className="flex-1">Cancel</Btn>
          </div>
        </Modal>
      )}
      {deleteId && <ConfirmDialog message="Delete this form permanently?" onConfirm={()=>{dispatch({type:'DELETE_FORM',payload:deleteId});setDeleteId(null);setToast({msg:'Form deleted.',type:'info'})}} onCancel={()=>setDeleteId(null)} />}
      {toast && <Toast message={toast.msg} type={toast.type} onClose={()=>setToast(null)} />}
    </div>
  )
}
