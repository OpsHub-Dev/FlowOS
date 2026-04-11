import { useState } from 'react'
import { useStore } from '../context/StoreContext'
import { TabRow, Btn } from '../components/UI'
import { Modal, FormField, Input, Select, ConfirmDialog, Toast, EmptyState } from '../components/FormComponents'

const COLS = [
  { id:'todo', label:'To Do', color:'bg-text3' },
  { id:'inprogress', label:'In Progress', color:'bg-accent' },
  { id:'review', label:'In Review', color:'bg-accent2' },
  { id:'done', label:'Done', color:'bg-accent3' },
]
const PRIORITIES = ['Low','Medium','High']
const DEPTS = ['Engineering','HR','Finance','IT','Legal','Design','Marketing','Operations']
const prioColor = { High:'text-accent5', Medium:'text-accent4', Low:'text-text3' }
const empty = { title:'', dept:'', assignee:'', priority:'Medium', due:'', column:'todo' }

function KanbanCard({ task, onEdit, onDelete, onMove }) {
  return (
    <div className={`bg-surface2 border border-border rounded-lg p-3 cursor-pointer hover:border-accent transition-all ${task.column==='done'?'opacity-60':''}`}>
      <div className={`text-xs font-semibold mb-1.5 ${task.column==='done'?'line-through':''}`}>{task.title}</div>
      <div className="text-[10px] text-text3 mb-2">{task.dept}{task.due ? ` · ${task.due}` : ''}</div>
      <div className="flex items-center justify-between">
        <div className="w-5 h-5 rounded-full bg-gradient-to-br from-accent to-accent2 flex items-center justify-center text-[9px] font-bold text-white">{task.assignee?.slice(0,2).toUpperCase()||'??'}</div>
        <span className={`text-[9px] font-semibold ${prioColor[task.priority]}`}>● {task.priority}</span>
      </div>
      <div className="flex gap-1.5 mt-2 pt-2 border-t border-border/50">
        <button onClick={() => onEdit(task)} className="flex-1 text-[9px] py-1 rounded bg-surface border border-border text-text3 hover:text-accent hover:border-accent cursor-pointer transition-all">Edit</button>
        {task.column !== 'done' && <button onClick={() => onMove(task)} className="flex-1 text-[9px] py-1 rounded bg-surface border border-border text-text3 hover:text-accent3 hover:border-accent3 cursor-pointer transition-all">→ Move</button>}
        <button onClick={() => onDelete(task.id)} className="text-[9px] py-1 px-1.5 rounded bg-surface border border-border text-text3 hover:text-accent5 hover:border-accent5 cursor-pointer transition-all">🗑</button>
      </div>
    </div>
  )
}

export default function Projects() {
  const { state, dispatch } = useStore()
  const [tab, setTab] = useState('Board')
  const [modal, setModal] = useState(null)
  const [form, setForm] = useState(empty)
  const [deleteId, setDeleteId] = useState(null)
  const [toast, setToast] = useState(null)

  const openCreate = (col='todo') => { setForm({...empty, column:col}); setModal('create') }
  const openEdit = (t) => { setForm({...t}); setModal(t) }

  const save = () => {
    if (!form.title.trim()) return setToast({msg:'Task title is required.',type:'error'})
    if (modal==='create') dispatch({type:'ADD_TASK', payload:form})
    else dispatch({type:'UPDATE_TASK', payload:form})
    setToast({msg: modal==='create'?'Task created!':'Task updated!', type:'success'})
    setModal(null)
  }

  const moveNext = (task) => {
    const order = ['todo','inprogress','review','done']
    const next = order[order.indexOf(task.column)+1]
    if (next) { dispatch({type:'MOVE_TASK', payload:{id:task.id, column:next}}); setToast({msg:`Moved to ${COLS.find(c=>c.id===next)?.label}`,type:'info'}) }
  }

  const set = (k) => (e) => setForm(f=>({...f,[k]:e.target.value}))

  return (
    <div>
      <div className="flex items-center gap-3 mb-5">
        <TabRow tabs={['Board','List']} active={tab} onChange={setTab} />
        <Btn onClick={() => openCreate()} className="ml-auto">+ Add Task</Btn>
      </div>

      {tab === 'Board' ? (
        <div className="grid grid-cols-4 gap-3.5">
          {COLS.map(col => {
            const cards = state.tasks.filter(t => t.column === col.id)
            return (
              <div key={col.id} className="bg-surface border border-border rounded-xl overflow-hidden">
                <div className="flex items-center gap-2 px-4 py-3.5 border-b border-border">
                  <div className={`w-2 h-2 rounded-full ${col.color}`} />
                  <span className="text-xs font-bold">{col.label}</span>
                  <span className="ml-auto bg-surface2 px-2 py-0.5 rounded-full text-[10px] font-semibold text-text3">{cards.length}</span>
                </div>
                <div className="p-3 flex flex-col gap-2 min-h-[180px]">
                  {cards.length===0 ? <div className="text-[10px] text-text3 text-center py-6">No tasks</div> : cards.map(t => <KanbanCard key={t.id} task={t} onEdit={openEdit} onDelete={setDeleteId} onMove={moveNext} />)}
                </div>
                <div onClick={() => openCreate(col.id)} className="px-3 py-2.5 border-t border-border text-[11px] text-text3 cursor-pointer hover:text-accent hover:bg-accent/5 transition-all">+ Add card</div>
              </div>
            )
          })}
        </div>
      ) : (
        <div className="bg-surface border border-border rounded-xl overflow-hidden">
          <table className="w-full">
            <thead><tr>{['Task','Dept','Assignee','Priority','Status','Actions'].map(h=><th key={h} className="text-[10px] font-semibold uppercase tracking-[.8px] text-text3 px-3 py-3 text-left border-b border-border">{h}</th>)}</tr></thead>
            <tbody>
              {state.tasks.length===0 ? <tr><td colSpan={6} className="text-center py-10 text-xs text-text3">No tasks yet</td></tr> :
              state.tasks.map(t=>(
                <tr key={t.id} className="hover:bg-white/[.02]">
                  <td className="px-3 py-2.5 text-xs font-semibold border-b border-border/60">{t.title}</td>
                  <td className="px-3 py-2.5 text-xs text-text3 border-b border-border/60">{t.dept}</td>
                  <td className="px-3 py-2.5 text-xs text-text3 border-b border-border/60">{t.assignee}</td>
                  <td className="px-3 py-2.5 border-b border-border/60"><span className={`text-xs font-semibold ${prioColor[t.priority]}`}>{t.priority}</span></td>
                  <td className="px-3 py-2.5 text-xs text-text3 border-b border-border/60 capitalize">{COLS.find(c=>c.id===t.column)?.label}</td>
                  <td className="px-3 py-2.5 border-b border-border/60">
                    <div className="flex gap-1.5">
                      <button onClick={()=>openEdit(t)} className="text-[10px] px-2 py-1 rounded bg-surface2 border border-border text-text2 hover:border-accent hover:text-accent cursor-pointer transition-all">Edit</button>
                      <button onClick={()=>setDeleteId(t.id)} className="text-[10px] px-2 py-1 rounded bg-surface2 border border-border text-text3 hover:border-accent5 hover:text-accent5 cursor-pointer transition-all">Delete</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {modal!==null && (
        <Modal title={modal==='create'?'Add Task':'Edit Task'} onClose={()=>setModal(null)}>
          <FormField label="Task Title" required><Input value={form.title} onChange={set('title')} placeholder="e.g. Design mockups" /></FormField>
          <div className="grid grid-cols-2 gap-4">
            <FormField label="Department"><Select value={form.dept} onChange={set('dept')} options={DEPTS} placeholder="Select dept" /></FormField>
            <FormField label="Assignee"><Input value={form.assignee} onChange={set('assignee')} placeholder="Initials or name" /></FormField>
            <FormField label="Priority"><Select value={form.priority} onChange={set('priority')} options={PRIORITIES} /></FormField>
            <FormField label="Status"><Select value={form.column} onChange={set('column')} options={COLS.map(c=>({value:c.id,label:c.label}))} /></FormField>
          </div>
          <FormField label="Due Date"><Input type="date" value={form.due} onChange={set('due')} /></FormField>
          <div className="flex gap-3 pt-2">
            <Btn onClick={save} className="flex-1">{modal==='create'?'Add Task':'Save Changes'}</Btn>
            <Btn variant="ghost" onClick={()=>setModal(null)} className="flex-1">Cancel</Btn>
          </div>
        </Modal>
      )}
      {deleteId && <ConfirmDialog message="Delete this task permanently?" onConfirm={()=>{dispatch({type:'DELETE_TASK',payload:deleteId});setDeleteId(null);setToast({msg:'Task deleted.',type:'info'})}} onCancel={()=>setDeleteId(null)} />}
      {toast && <Toast message={toast.msg} type={toast.type} onClose={()=>setToast(null)} />}
    </div>
  )
}
