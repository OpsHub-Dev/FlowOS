import {
  BarChart, Bar, LineChart, Line, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from 'recharts'
import { StatCard, Card, ProgressBar } from '../components/UI'

const barData = [
  { month: 'Jan', completions: 62 }, { month: 'Feb', completions: 78 },
  { month: 'Mar', completions: 55 }, { month: 'Apr', completions: 84 },
  { month: 'May', completions: 71 }, { month: 'Jun', completions: 98 },
]

const lineData = [
  { month: 'Jan', submissions: 210 }, { month: 'Feb', submissions: 245 },
  { month: 'Mar', submissions: 198 }, { month: 'Apr', submissions: 280 },
  { month: 'May', submissions: 310 }, { month: 'Jun', submissions: 342 },
]

const pieData = [
  { name: 'HR', value: 35, color: '#4f6ef7' },
  { name: 'Finance', value: 25, color: '#00d4a0' },
  { name: 'IT', value: 20, color: '#f7934c' },
  { name: 'Other', value: 20, color: '#7c4dff' },
]

const efficiency = [
  { name: 'Employee Onboarding', runs: 48, avgTime: '3.2 days', sla: 94, color: 'green' },
  { name: 'Purchase Order Approval', runs: 112, avgTime: '1.8 days', sla: 88, color: 'green' },
  { name: 'IT Asset Request', runs: 67, avgTime: '2.5 days', sla: 72, color: 'orange' },
  { name: 'Vendor Registration', runs: 23, avgTime: '6.1 days', sla: 58, color: 'red' },
]

const tooltipStyle = { backgroundColor: '#1a1e2a', border: '1px solid #232838', borderRadius: 8, fontSize: 12 }

export default function Analytics() {
  return (
    <div>
      <div className="grid grid-cols-4 gap-4 mb-6">
        <StatCard label="Workflows Completed" value="412" change="↑ 18% this month" icon="⚡" topColor="blue" />
        <StatCard label="Avg. Cycle Time" value="2.4d" change="↓ 0.3d improvement" icon="⏱️" topColor="green" />
        <StatCard label="SLA Breaches" value="7" change="↑ 2 more than last month" icon="⚠️" topColor="orange" />
        <StatCard label="Satisfaction Score" value="4.7" change="↑ 0.2 pts" icon="😊" topColor="red" />
      </div>

      <div className="grid grid-cols-3 gap-4 mb-6">
        {/* Bar Chart */}
        <Card>
          <h3 className="text-xs font-bold mb-4">Workflow Completions by Month</h3>
          <ResponsiveContainer width="100%" height={160}>
            <BarChart data={barData} barSize={24}>
              <CartesianGrid strokeDasharray="3 3" stroke="#232838" vertical={false} />
              <XAxis dataKey="month" tick={{ fontSize: 10, fill: '#555c78' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 10, fill: '#555c78' }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={tooltipStyle} cursor={{ fill: 'rgba(79,110,247,.06)' }} />
              <Bar dataKey="completions" fill="url(#barGrad)" radius={[4,4,0,0]} />
              <defs>
                <linearGradient id="barGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#4f6ef7" />
                  <stop offset="100%" stopColor="#7c4dff" stopOpacity=".5" />
                </linearGradient>
              </defs>
            </BarChart>
          </ResponsiveContainer>
        </Card>

        {/* Pie Chart */}
        <Card>
          <h3 className="text-xs font-bold mb-4">Workflows by Department</h3>
          <ResponsiveContainer width="100%" height={160}>
            <PieChart>
              <Pie data={pieData} cx="40%" cy="50%" innerRadius={40} outerRadius={65} paddingAngle={3} dataKey="value">
                {pieData.map((entry, i) => <Cell key={i} fill={entry.color} />)}
              </Pie>
              <Tooltip contentStyle={tooltipStyle} formatter={(v, n) => [`${v}%`, n]} />
              <Legend
                layout="vertical" align="right" verticalAlign="middle"
                formatter={(v) => <span style={{ fontSize: 11, color: '#8a90a8' }}>{v}</span>}
                iconType="circle" iconSize={8}
              />
            </PieChart>
          </ResponsiveContainer>
        </Card>

        {/* Line Chart */}
        <Card>
          <h3 className="text-xs font-bold mb-4">Form Submissions Trend</h3>
          <ResponsiveContainer width="100%" height={160}>
            <LineChart data={lineData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#232838" vertical={false} />
              <XAxis dataKey="month" tick={{ fontSize: 10, fill: '#555c78' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 10, fill: '#555c78' }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={tooltipStyle} />
              <defs>
                <linearGradient id="lineGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#00d4a0" stopOpacity=".3" />
                  <stop offset="100%" stopColor="#00d4a0" stopOpacity="0" />
                </linearGradient>
              </defs>
              <Line type="monotone" dataKey="submissions" stroke="#00d4a0" strokeWidth={2} dot={{ fill: '#00d4a0', r: 3 }} />
            </LineChart>
          </ResponsiveContainer>
        </Card>
      </div>

      {/* Efficiency Table */}
      <Card>
        <h3 className="text-sm font-bold mb-4">Process Efficiency Report</h3>
        <table className="w-full">
          <thead>
            <tr>{['Workflow','Total Runs','Avg Time','SLA Met','Efficiency'].map(h => (
              <th key={h} className="text-[10px] font-semibold uppercase tracking-[.8px] text-text3 px-3 py-2 text-left border-b border-border">{h}</th>
            ))}</tr>
          </thead>
          <tbody>
            {efficiency.map(e => (
              <tr key={e.name} className="hover:bg-white/[.02]">
                <td className="px-3 py-3 text-xs font-semibold border-b border-border/60">{e.name}</td>
                <td className="px-3 py-3 text-xs font-mono border-b border-border/60">{e.runs}</td>
                <td className="px-3 py-3 text-xs text-text3 border-b border-border/60">{e.avgTime}</td>
                <td className="px-3 py-3 border-b border-border/60">
                  <span className={`text-xs font-semibold ${e.sla >= 85 ? 'text-accent3' : e.sla >= 70 ? 'text-accent4' : 'text-accent5'}`}>{e.sla}%</span>
                </td>
                <td className="px-3 py-3 border-b border-border/60">
                  <div className="flex items-center gap-2">
                    <div className="w-24"><ProgressBar value={e.sla} color={e.color} /></div>
                    <span className="text-[10px] text-text3">{e.sla}%</span>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </div>
  )
}
