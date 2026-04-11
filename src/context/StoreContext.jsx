import { createContext, useContext, useReducer } from 'react'

// ── Initial Data ─────────────────────────────────────────────────────────────

const initialState = {
  workflows: [
    { id: 1, icon: '👤', name: 'Employee Onboarding', dept: 'HR Department', steps: 7, status: 'Active', pct: 72, instances: 18, created: '2024-01-10' },
    { id: 2, icon: '💰', name: 'Purchase Order Approval', dept: 'Finance', steps: 4, status: 'Pending', pct: 40, instances: 9, created: '2024-02-05' },
    { id: 3, icon: '💻', name: 'IT Asset Request', dept: 'IT Department', steps: 5, status: 'Active', pct: 60, instances: 6, created: '2024-02-20' },
    { id: 4, icon: '🏖️', name: 'Leave Approval', dept: 'HR Department', steps: 3, status: 'Active', pct: 90, instances: 33, created: '2024-03-01' },
    { id: 5, icon: '🏢', name: 'Vendor Registration', dept: 'Procurement', steps: 6, status: 'Delayed', pct: 25, instances: 2, created: '2024-03-15' },
  ],
  tasks: [
    { id: 1, title: 'Design new onboarding flow mockups', column: 'todo', dept: 'UX Design', assignee: 'SJ', priority: 'Medium', due: '2024-06-20' },
    { id: 2, title: 'Update vendor contract templates', column: 'todo', dept: 'Legal', assignee: 'KL', priority: 'Low', due: '2024-06-22' },
    { id: 3, title: 'Q3 budget planning document', column: 'todo', dept: 'Finance', assignee: 'AJ', priority: 'High', due: '2024-06-18' },
    { id: 4, title: 'Implement workflow automation for HR', column: 'inprogress', dept: 'Engineering', assignee: 'MR', priority: 'High', due: '2024-06-19' },
    { id: 5, title: 'Employee satisfaction survey rollout', column: 'inprogress', dept: 'HR', assignee: 'PM', priority: 'Medium', due: '2024-06-21' },
    { id: 6, title: 'API integration for payroll system', column: 'review', dept: 'Engineering', assignee: 'TK', priority: 'High', due: '2024-06-17' },
    { id: 7, title: 'Revise IT security policy document', column: 'review', dept: 'IT', assignee: 'SJ', priority: 'Medium', due: '2024-06-23' },
    { id: 8, title: 'Set up new employee email accounts', column: 'done', dept: 'IT', assignee: 'IT', priority: 'Low', due: '2024-06-10' },
    { id: 9, title: 'Q1 financial report published', column: 'done', dept: 'Finance', assignee: 'AJ', priority: 'High', due: '2024-06-12' },
  ],
  forms: [
    { id: 1, icon: '📋', name: 'Leave Request Form', dept: 'HR Department', fields: 6, status: 'Published', submissions: 147, created: '2024-01-15' },
    { id: 2, icon: '🛒', name: 'Purchase Request', dept: 'Finance', fields: 10, status: 'Published', submissions: 89, created: '2024-02-10' },
    { id: 3, icon: '💻', name: 'IT Asset Request', dept: 'IT Department', fields: 8, status: 'Draft', submissions: 23, created: '2024-03-05' },
  ],
  cases: [
    { id: 'CS-1041', title: 'Payroll discrepancy for June', cat: 'Finance', assignee: 'Alex J.', priority: 'High', status: 'Open', created: '2024-06-14', desc: 'Employee payroll amounts do not match approved figures for June 2024.' },
    { id: 'CS-1040', title: 'New hire laptop not delivered', cat: 'IT', assignee: 'IT Support', priority: 'Medium', status: 'In Progress', created: '2024-06-13', desc: 'Laptop ordered for new hire John Smith has not arrived after 2 weeks.' },
    { id: 'CS-1039', title: 'Vendor invoice mismatch #INV-2210', cat: 'Procurement', assignee: 'Sarah M.', priority: 'High', status: 'Open', created: '2024-06-12', desc: 'Invoice amount from TechSupply Co. does not match PO-4421.' },
    { id: 'CS-1038', title: 'Access request for ERP system', cat: 'IT', assignee: 'IT Support', priority: 'Low', status: 'Resolved', created: '2024-06-10', desc: 'New employee requires ERP access for Finance module.' },
    { id: 'CS-1037', title: 'Leave balance not updated in system', cat: 'HR', assignee: 'HR Team', priority: 'Medium', status: 'In Progress', created: '2024-06-09', desc: 'Annual leave balance not reflecting approved leave for Q1.' },
  ],
  team: [
    { id: 1, name: 'Alex Johnson', role: 'Admin', dept: 'Operations', email: 'alex@acme.com', workflows: 24, tasks: 147, grad: 'from-accent to-accent2', status: 'Active' },
    { id: 2, name: 'Sarah Mitchell', role: 'Manager', dept: 'Finance', email: 'sarah@acme.com', workflows: 18, tasks: 203, grad: 'from-accent3 to-emerald-600', status: 'Active' },
    { id: 3, name: 'Kevin Lee', role: 'Member', dept: 'HR', email: 'kevin@acme.com', workflows: 9, tasks: 88, grad: 'from-accent4 to-orange-600', status: 'Active' },
    { id: 4, name: 'Maya Raj', role: 'Member', dept: 'Engineering', email: 'maya@acme.com', workflows: 11, tasks: 119, grad: 'from-accent2 to-violet-700', status: 'Active' },
    { id: 5, name: 'Tom Kim', role: 'Member', dept: 'IT', email: 'tom@acme.com', workflows: 7, tasks: 74, grad: 'from-accent5 to-rose-700', status: 'Away' },
  ],
  inbox: [
    { id: 1, from: 'Finance Approval', title: 'Review Q2 Budget Report', preview: 'Action required: Approve or reject the Q2 financial report', time: '2h ago', unread: true, priority: 'High', due: 'Today, 5:00 PM', body: 'Please review the attached Q2 Budget Report and provide your approval or feedback by end of business today. The report covers revenue and expenditure across all departments for Q2 FY2024. Key highlights include a 14% increase in operational costs in Engineering and a 6% underspend in Marketing.', attachment: 'Q2_Budget_Report_2024.pdf', status: 'Pending' },
    { id: 2, from: 'IT Asset Request', title: 'Approve Laptop for New Hire', preview: 'MacBook Pro 14" requested by Engineering team', time: '5h ago', unread: true, priority: 'Medium', due: 'Jun 17', body: 'The Engineering team has requested a MacBook Pro 14" for a new hire starting next week. Please review and approve or reject this asset request.', attachment: 'asset_request_form.pdf', status: 'Pending' },
    { id: 3, from: 'Leave Approval', title: 'Leave Request — Sarah Mitchell', preview: 'Annual leave request for June 20–27 (5 days)', time: 'Yesterday', unread: false, priority: 'Low', due: 'Jun 16', body: 'Sarah Mitchell has requested annual leave from June 20 to June 27, 2024 (5 working days). Her current leave balance is 12 days. Please approve or reject this request.', attachment: null, status: 'Pending' },
    { id: 4, from: 'Vendor Registration', title: 'Confirm Vendor: TechSupply Co.', preview: 'Please verify and confirm vendor details before proceeding', time: 'Jun 13', unread: true, priority: 'Medium', due: 'Jun 19', body: 'A new vendor TechSupply Co. has submitted their registration. Please verify their business details, compliance documents, and bank information before approving.', attachment: 'vendor_docs.zip', status: 'Pending' },
    { id: 5, from: 'Employee Onboarding', title: 'Complete Onboarding Checklist', preview: '3 new hires require equipment and badge setup', time: 'Jun 12', unread: false, priority: 'High', due: 'Jun 15', body: 'Three new employees are starting next week and require onboarding setup including: laptop provisioning, email accounts, building access badges, and system access permissions.', attachment: 'onboarding_checklist.xlsx', status: 'Pending' },
  ],
  settings: {
    orgName: 'Acme Corporation',
    industry: 'Technology',
    timezone: 'UTC-5 (Eastern Time)',
    dateFormat: 'MM/DD/YYYY',
    notifications: { email: true, inApp: true, slack: true, sms: false },
    events: { taskAssigned: true, approvalRequest: true, slaBreach: true, workflowCompleted: false, formSubmission: false, memberInvited: true },
    security: { twoFactor: false, loginAlerts: true, sessionTimeout: true },
    integrations: { Gmail: true, Slack: true, 'Google Drive': false, 'Google Calendar': false, Jira: false, Zapier: false },
  },
  nextCaseId: 1042,
}

// ── Reducer ───────────────────────────────────────────────────────────────────

function reducer(state, action) {
  switch (action.type) {
    // WORKFLOWS
    case 'ADD_WORKFLOW':
      return { ...state, workflows: [...state.workflows, { ...action.payload, id: Date.now(), pct: 0, instances: 0 }] }
    case 'UPDATE_WORKFLOW':
      return { ...state, workflows: state.workflows.map(w => w.id === action.payload.id ? { ...w, ...action.payload } : w) }
    case 'DELETE_WORKFLOW':
      return { ...state, workflows: state.workflows.filter(w => w.id !== action.payload) }

    // TASKS
    case 'ADD_TASK':
      return { ...state, tasks: [...state.tasks, { ...action.payload, id: Date.now() }] }
    case 'UPDATE_TASK':
      return { ...state, tasks: state.tasks.map(t => t.id === action.payload.id ? { ...t, ...action.payload } : t) }
    case 'MOVE_TASK':
      return { ...state, tasks: state.tasks.map(t => t.id === action.payload.id ? { ...t, column: action.payload.column } : t) }
    case 'DELETE_TASK':
      return { ...state, tasks: state.tasks.filter(t => t.id !== action.payload) }

    // FORMS
    case 'ADD_FORM':
      return { ...state, forms: [...state.forms, { ...action.payload, id: Date.now(), submissions: 0 }] }
    case 'UPDATE_FORM':
      return { ...state, forms: state.forms.map(f => f.id === action.payload.id ? { ...f, ...action.payload } : f) }
    case 'DELETE_FORM':
      return { ...state, forms: state.forms.filter(f => f.id !== action.payload) }

    // CASES
    case 'ADD_CASE':
      return {
        ...state,
        cases: [...state.cases, { ...action.payload, id: `CS-${state.nextCaseId}`, created: new Date().toISOString().slice(0, 10) }],
        nextCaseId: state.nextCaseId + 1,
      }
    case 'UPDATE_CASE':
      return { ...state, cases: state.cases.map(c => c.id === action.payload.id ? { ...c, ...action.payload } : c) }
    case 'DELETE_CASE':
      return { ...state, cases: state.cases.filter(c => c.id !== action.payload) }

    // TEAM
    case 'ADD_MEMBER':
      return { ...state, team: [...state.team, { ...action.payload, id: Date.now(), workflows: 0, tasks: 0, grad: 'from-accent to-accent2', status: 'Active' }] }
    case 'UPDATE_MEMBER':
      return { ...state, team: state.team.map(m => m.id === action.payload.id ? { ...m, ...action.payload } : m) }
    case 'DELETE_MEMBER':
      return { ...state, team: state.team.filter(m => m.id !== action.payload) }

    // INBOX
    case 'MARK_READ':
      return { ...state, inbox: state.inbox.map(i => i.id === action.payload ? { ...i, unread: false } : i) }
    case 'UPDATE_INBOX_STATUS':
      return { ...state, inbox: state.inbox.map(i => i.id === action.payload.id ? { ...i, status: action.payload.status, unread: false } : i) }

    // SETTINGS
    case 'UPDATE_SETTINGS':
      return { ...state, settings: { ...state.settings, ...action.payload } }
    case 'TOGGLE_NOTIFICATION':
      return { ...state, settings: { ...state.settings, notifications: { ...state.settings.notifications, [action.payload]: !state.settings.notifications[action.payload] } } }
    case 'TOGGLE_EVENT':
      return { ...state, settings: { ...state.settings, events: { ...state.settings.events, [action.payload]: !state.settings.events[action.payload] } } }
    case 'TOGGLE_SECURITY':
      return { ...state, settings: { ...state.settings, security: { ...state.settings.security, [action.payload]: !state.settings.security[action.payload] } } }
    case 'TOGGLE_INTEGRATION':
      return { ...state, settings: { ...state.settings, integrations: { ...state.settings.integrations, [action.payload]: !state.settings.integrations[action.payload] } } }

    default:
      return state
  }
}

// ── Context ───────────────────────────────────────────────────────────────────

const StoreContext = createContext(null)

export function StoreProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState)
  return <StoreContext.Provider value={{ state, dispatch }}>{children}</StoreContext.Provider>
}

export const useStore = () => useContext(StoreContext)
