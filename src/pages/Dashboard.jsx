import { useNavigate } from 'react-router-dom'
import { StatCard, Card, SectionHeader, Badge, ProgressBar, Btn } from '../components/UI'

const workflows = [
  { name: 'Employee Onboarding', status: 'Active', statusV: 'green', pct: 72, due: 'Jun 20' },
  { name: 'Purchase Order Approval', status: 'Pending', statusV: 'orange', pct: 40, due: 'Jun 18' },
  { name: 'IT Asset Request', status: 'In Review', statusV: 'blue', pct: 60, due: 'Jun 22' },
  { name: 'Leave Approval', status: 'Active', statusV: 'green', pct: 90, due: 'Jun 16' },
  { name: 'Vendor Registration', status: 'Delayed', statusV: 'red', pct: 25, due: 'Jun 14 !' },
]

const activity = [
  { color: 'bg-accent3', text: <><strong>Sarah M.</strong> approved Purchase Order #PO-4421</>, time: '2 min ago' },
  { color: 'bg-accent', text: <><strong>IT Team</strong> submitted new asset request for MacBook Pro</>, time: '18 min ago' },
  { color: 'bg-accent4', text: <><strong>HR Dept.</strong> launched Onboarding for <strong>3 new hires</strong></>, time: '1 hr ago' },
  { color: 'bg-accent5', text: <><strong>Vendor Registration</strong> missed SLA by 2 days</>, time: '3 hr ago' },
  { color: 'bg-accent2', text: <><strong>Alex J.</strong> created a new <strong>Leave Approval</strong> form</>, time: 'Yesterday' },
]

const tasks = [
  { name: 'Review Q2 Budget Report', workflow: 'Finance Approval', by: 'CFO Office', prio: 'red', due: 'Today', dueColor: 'text-accent5' },
  { name: 'Approve IT Asset — MacBook', workflow: 'IT Asset Request', by: 'IT Team', prio: 'orange', due: 'Jun 17', dueColor: 'text-text3' },
  { name: 'Confirm Vendor Details', workflow: 'Vendor Registration', by: 'Procurement', prio: 'blue', due: 'Jun 19', dueColor: 'text-text3' },
]

const pctColor = (p) => p >= 70 ? 'green' : p >= 50 ? 'blue' : p >= 30 ? 'orange' : 'red'

export default function Dashboard() {
  const navigate = useNavigate()
  return (
    <div>
      {/* Stats */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        <StatCard label="Active Workflows" value="24" change="↑ 3 this week" icon="⚡" topColor="blue" />
        <StatCard label="Tasks Completed" value="187" change="↑ 12% vs last month" icon="✅" topColor="green" />
        <StatCard label="Pending Approvals" value="9" change="↑ 2 overdue" icon="⏳" topColor="orange" />
        <StatCard label="Form Submissions" value="342" change="↑ 28 today" icon="📋" topColor="red" />
      </div>

      <div className="grid grid-cols-2 gap-4 mb-6">
        {/* Workflows */}
        <Card>
          <SectionHeader title="Active Workflows" action="View all →" onAction={() => navigate('/workflows')} />
          <table className="w-full">
            <thead>
              <tr>{['Workflow','Status','Progress','Due'].map(h => (
                <th key={h} className="text-[10px] font-semibold uppercase tracking-[.8px] text-text3 px-2 py-1.5 text-left border-b border-border">{h}</th>
              ))}</tr>
            </thead>
            <tbody>
              {workflows.map(w => (
                <tr key={w.name} className="hover:bg-white/[.02]">
                  <td className="px-2 py-2.5 text-xs font-semibold border-b border-border/60">{w.name}</td>
                  <td className="px-2 py-2.5 border-b border-border/60"><Badge variant={w.statusV}>{w.status}</Badge></td>
                  <td className="px-2 py-2.5 border-b border-border/60">
                    <div className="flex items-center gap-2">
                      <div className="w-20"><ProgressBar value={w.pct} color={pctColor(w.pct)} /></div>
                      <span className="text-[10px] text-text3">{w.pct}%</span>
                    </div>
                  </td>
                  <td className={`px-2 py-2.5 border-b border-border/60 text-[11px] ${w.statusV === 'red' ? 'text-accent5' : 'text-text3'}`}>{w.due}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>

        {/* Activity */}
        <Card>
          <SectionHeader title="Recent Activity" />
          {activity.map((a, i) => (
            <div key={i} className="flex gap-3 py-2.5 border-b border-border/60 last:border-0">
              <div className={`w-2 h-2 rounded-full mt-1.5 flex-shrink-0 ${a.color}`} />
              <div>
                <div className="text-xs text-text2 leading-relaxed">{a.text}</div>
                <div className="text-[10px] text-text3 mt-0.5">{a.time}</div>
              </div>
            </div>
          ))}
        </Card>
      </div>

      {/* My Tasks */}
      <Card>
        <SectionHeader title="My Pending Tasks" action="Open Inbox →" onAction={() => navigate('/inbox')} />
        <table className="w-full">
          <thead>
            <tr>{['Task','Workflow','Assigned By','Priority','Due Date','Action'].map(h => (
              <th key={h} className="text-[10px] font-semibold uppercase tracking-[.8px] text-text3 px-3 py-2 text-left border-b border-border">{h}</th>
            ))}</tr>
          </thead>
          <tbody>
            {tasks.map(t => (
              <tr key={t.name} className="hover:bg-white/[.02]">
                <td className="px-3 py-2.5 text-xs font-semibold border-b border-border/60">{t.name}</td>
                <td className="px-3 py-2.5 text-xs text-text3 border-b border-border/60">{t.workflow}</td>
                <td className="px-3 py-2.5 text-xs text-text3 border-b border-border/60">{t.by}</td>
                <td className="px-3 py-2.5 border-b border-border/60"><Badge variant={t.prio}>{t.prio === 'red' ? 'High' : t.prio === 'orange' ? 'Medium' : 'Low'}</Badge></td>
                <td className={`px-3 py-2.5 text-xs border-b border-border/60 ${t.dueColor}`}>{t.due}</td>
                <td className="px-3 py-2.5 border-b border-border/60">
                  <Btn size="sm" variant={t.prio === 'red' ? 'primary' : 'ghost'}>
                    {t.prio === 'red' ? 'Review' : t.prio === 'orange' ? 'Approve' : 'View'}
                  </Btn>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </div>
  )
}
