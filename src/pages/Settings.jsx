import { useState } from 'react'
import { useStore } from '../context/StoreContext'
import { Card, Btn, Toggle } from '../components/UI'
import { Toast } from '../components/FormComponents'

const NAV = ['General','Notifications','Integrations','Security','Billing','API & Webhooks']
const INTEGRATIONS = [
  {name:'Gmail',icon:'📧',desc:'Sync emails and trigger workflows'},
  {name:'Slack',icon:'💬',desc:'Push notifications to Slack channels'},
  {name:'Google Drive',icon:'📁',desc:'Attach and manage files in workflows'},
  {name:'Google Calendar',icon:'📅',desc:'Schedule tasks and deadlines'},
  {name:'Jira',icon:'🪣',desc:'Sync issues and project tasks'},
  {name:'Zapier',icon:'🔗',desc:'Connect 5000+ apps via Zapier'},
]

export default function Settings() {
  const { state, dispatch } = useStore()
  const [nav, setNav] = useState('General')
  const [toast, setToast] = useState(null)
  const s = state.settings

  const update = (payload) => dispatch({type:'UPDATE_SETTINGS', payload})
  const save = () => setToast({msg:'Settings saved!', type:'success'})

  return (
    <div className="grid grid-cols-[200px_1fr] gap-5">
      <div>
        <div className="text-[10px] font-semibold text-text3 uppercase tracking-[.8px] mb-2.5 px-1">Settings</div>
        {NAV.map(item=>(
          <div key={item} onClick={()=>setNav(item)}
            className={`px-3 py-2 rounded-lg text-xs font-medium cursor-pointer mb-0.5 transition-all ${nav===item?'bg-accent/10 text-accent':'text-text2 hover:bg-surface2 hover:text-text1'}`}>
            {item}
          </div>
        ))}
      </div>
      <div>
        {nav==='General' && (
          <>
            <h2 className="text-sm font-bold mb-3.5">Organization</h2>
            <Card className="mb-5">
              <div className="grid grid-cols-2 gap-4">
                {[['Organization Name','orgName','text','Acme Corp'],['Industry','industry','text','Technology'],['Timezone','timezone','text','UTC-5'],['Date Format','dateFormat','text','MM/DD/YYYY']].map(([label,key,type,ph])=>(
                  <div key={key}>
                    <div className="text-[10px] font-semibold text-text3 uppercase tracking-[.8px] mb-1.5">{label}</div>
                    <input value={s[key]||''} onChange={e=>update({[key]:e.target.value})} placeholder={ph}
                      className="w-full bg-surface2 border border-border rounded-lg px-3 py-2 text-xs text-text1 outline-none font-sora focus:border-accent transition-all" />
                  </div>
                ))}
              </div>
            </Card>
            <div className="flex gap-2.5"><Btn onClick={save}>Save Changes</Btn><Btn variant="ghost">Cancel</Btn></div>
          </>
        )}
        {nav==='Notifications' && (
          <>
            <h2 className="text-sm font-bold mb-3.5">Notification Channels</h2>
            <Card className="mb-5">
              {Object.entries(s.notifications).map(([key,val])=>(
                <div key={key} className="flex items-center justify-between py-3 border-b border-border last:border-0">
                  <div className="text-xs font-semibold capitalize">{key.replace(/([A-Z])/g,' $1')}</div>
                  <Toggle on={val} onChange={()=>dispatch({type:'TOGGLE_NOTIFICATION',payload:key})} />
                </div>
              ))}
            </Card>
            <h2 className="text-sm font-bold mb-3.5">Notification Events</h2>
            <Card>
              {Object.entries(s.events).map(([key,val])=>(
                <div key={key} className="flex items-center justify-between py-3 border-b border-border last:border-0">
                  <div className="text-xs font-medium capitalize">{key.replace(/([A-Z])/g,' $1')}</div>
                  <Toggle on={val} onChange={()=>dispatch({type:'TOGGLE_EVENT',payload:key})} />
                </div>
              ))}
            </Card>
          </>
        )}
        {nav==='Integrations' && (
          <>
            <h2 className="text-sm font-bold mb-3.5">Connected Apps</h2>
            <div className="grid grid-cols-2 gap-4">
              {INTEGRATIONS.map(intg=>{
                const on = s.integrations[intg.name]||false
                return (
                  <Card key={intg.name} className="flex items-center gap-4">
                    <div className="text-2xl flex-shrink-0">{intg.icon}</div>
                    <div className="flex-1 min-w-0">
                      <div className="text-xs font-bold">{intg.name}</div>
                      <div className="text-[11px] text-text3 truncate">{intg.desc}</div>
                    </div>
                    <button onClick={()=>dispatch({type:'TOGGLE_INTEGRATION',payload:intg.name})}
                      className={`text-[10px] font-semibold px-3 py-1.5 rounded-lg border cursor-pointer transition-all font-sora ${on?'border-accent5/40 text-accent5 hover:bg-accent5/10':'bg-gradient-to-r from-accent to-accent2 text-white border-transparent hover:opacity-90'}`}>
                      {on?'Disconnect':'Connect'}
                    </button>
                  </Card>
                )
              })}
            </div>
          </>
        )}
        {nav==='Security' && (
          <>
            <h2 className="text-sm font-bold mb-3.5">Security Settings</h2>
            <Card className="mb-5">
              {Object.entries(s.security).map(([key,val])=>(
                <div key={key} className="flex items-center justify-between py-3 border-b border-border last:border-0">
                  <div className="text-xs font-semibold capitalize">{key.replace(/([A-Z])/g,' $1')}</div>
                  <Toggle on={val} onChange={()=>dispatch({type:'TOGGLE_SECURITY',payload:key})} />
                </div>
              ))}
            </Card>
            <h2 className="text-sm font-bold mb-3.5">Change Password</h2>
            <Card>
              {['Current Password','New Password','Confirm New Password'].map(label=>(
                <div key={label} className="mb-3 last:mb-0">
                  <div className="text-[10px] font-semibold text-text3 uppercase tracking-[.8px] mb-1.5">{label}</div>
                  <input type="password" placeholder="••••••••" className="w-full bg-surface2 border border-border rounded-lg px-3 py-2 text-xs text-text1 outline-none font-sora focus:border-accent transition-all" />
                </div>
              ))}
              <div className="mt-4"><Btn onClick={()=>setToast({msg:'Password updated!',type:'success'})}>Update Password</Btn></div>
            </Card>
          </>
        )}
        {nav==='Billing' && (
          <>
            <h2 className="text-sm font-bold mb-3.5">Current Plan</h2>
            <Card className="mb-5">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-base font-bold text-accent mb-1">Pro Plan</div>
                  <div className="text-xs text-text3">$49/month · Up to 25 team members</div>
                </div>
                <Btn variant="ghost">Upgrade</Btn>
              </div>
              <div className="grid grid-cols-3 gap-4 mt-4 pt-4 border-t border-border">
                {[['Members',`${state.team.length} / 25`],['Workflows',`${state.workflows.length} / ∞`],['Storage','4.2 GB / 20 GB']].map(([k,v])=>(
                  <div key={k}><div className="text-[10px] text-text3 mb-1">{k}</div><div className="text-xs font-semibold">{v}</div></div>
                ))}
              </div>
            </Card>
            <h2 className="text-sm font-bold mb-3.5">Billing History</h2>
            <Card className="p-0 overflow-hidden">
              <table className="w-full">
                <thead><tr>{['Date','Description','Amount','Status',''].map(h=><th key={h} className="text-[10px] font-semibold uppercase tracking-[.8px] text-text3 px-4 py-3 text-left border-b border-border">{h}</th>)}</tr></thead>
                <tbody>
                  {[['Jun 1, 2024','Pro Plan','$49.00'],['May 1, 2024','Pro Plan','$49.00'],['Apr 1, 2024','Pro Plan','$49.00']].map(([d,desc,amt])=>(
                    <tr key={d} className="hover:bg-white/[.02]">
                      <td className="px-4 py-3 text-xs text-text3 border-b border-border/60">{d}</td>
                      <td className="px-4 py-3 text-xs border-b border-border/60">{desc}</td>
                      <td className="px-4 py-3 text-xs font-mono border-b border-border/60">{amt}</td>
                      <td className="px-4 py-3 border-b border-border/60"><span className="text-[10px] font-semibold text-accent3">✓ Paid</span></td>
                      <td className="px-4 py-3 border-b border-border/60"><Btn size="sm" variant="ghost">Receipt</Btn></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </Card>
          </>
        )}
        {nav==='API & Webhooks' && (
          <>
            <h2 className="text-sm font-bold mb-3.5">API Keys</h2>
            <Card className="mb-5">
              {[{name:'Production Key',key:'fos_live_••••••••3f9a',last:'2 min ago'},{name:'Staging Key',key:'fos_test_••••••••8c2d',last:'3 days ago'}].map(k=>(
                <div key={k.name} className="flex items-center gap-4 py-3 border-b border-border last:border-0">
                  <div className="flex-1">
                    <div className="text-xs font-semibold mb-0.5">{k.name}</div>
                    <div className="font-mono text-[11px] text-text3">{k.key}</div>
                  </div>
                  <div className="text-[10px] text-text3">Last used {k.last}</div>
                  <Btn size="sm" variant="ghost" onClick={()=>setToast({msg:'Key revoked.',type:'info'})}>Revoke</Btn>
                </div>
              ))}
              <div className="pt-3"><Btn size="sm" onClick={()=>setToast({msg:'New API key generated!',type:'success'})}>+ Generate New Key</Btn></div>
            </Card>
            <h2 className="text-sm font-bold mb-3.5">Webhooks</h2>
            <Card>
              <div className="bg-surface2 border border-border rounded-lg p-3 mb-3 font-mono text-[11px] text-text3">POST https://your-app.com/webhooks/flowos</div>
              <div className="flex gap-2">
                <input placeholder="Enter webhook URL…" className="flex-1 bg-surface2 border border-border rounded-lg px-3 py-2 text-xs text-text1 outline-none font-sora focus:border-accent transition-all" />
                <Btn onClick={()=>setToast({msg:'Webhook added!',type:'success'})}>Add</Btn>
              </div>
            </Card>
          </>
        )}
      </div>
      {toast && <Toast message={toast.msg} type={toast.type} onClose={()=>setToast(null)} />}
    </div>
  )
}
