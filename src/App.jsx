import { Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import { StoreProvider } from './context/StoreContext'
import { useAuth } from './context/AuthContext'
import ProtectedRoute from './components/ProtectedRoute'
import AppLayout from './layouts/AppLayout'
import StaffPortal from './pages/staff/StaffPortal'

import Login from './pages/Login'
import Register from './pages/Register'
import ForgotPassword from './pages/ForgotPassword'
import Dashboard from './pages/Dashboard'
import Workflows from './pages/Workflows'
import Projects from './pages/Projects'
import Forms from './pages/Forms'
import Cases from './pages/Cases'
import Inbox from './pages/Inbox'
import Analytics from './pages/Analytics'
import Team from './pages/Team'
import Settings from './pages/Settings'

// Smart root — sends HQ to dashboard, staff to portal
function RootRedirect() {
  const { isHQ, isStaff, loading } = useAuth()
  if (loading) return null
  if (isStaff) return <Navigate to="/portal" replace />
  return <Navigate to="/dashboard" replace />
}

export default function App() {
  return (
    <AuthProvider>
      <StoreProvider>
        <Routes>
          {/* Public */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />

          {/* Staff portal */}
          <Route path="/portal" element={<ProtectedRoute><StaffPortal /></ProtectedRoute>} />

          {/* HQ / Admin app */}
          <Route path="/" element={<ProtectedRoute><AppLayout /></ProtectedRoute>}>
            <Route index element={<RootRedirect />} />
            <Route path="dashboard"  element={<Dashboard />} />
            <Route path="workflows"  element={<Workflows />} />
            <Route path="projects"   element={<Projects />} />
            <Route path="forms"      element={<Forms />} />
            <Route path="cases"      element={<Cases />} />
            <Route path="inbox"      element={<Inbox />} />
            <Route path="analytics"  element={<Analytics />} />
            <Route path="team"       element={<Team />} />
            <Route path="settings"   element={<Settings />} />
          </Route>

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </StoreProvider>
    </AuthProvider>
  )
}
