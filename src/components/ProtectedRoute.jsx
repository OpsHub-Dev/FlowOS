import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function ProtectedRoute({ children }) {
  const { user, loading } = useAuth()

  if (loading) {
    return (
      <div className="min-h-screen bg-bg flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-accent to-accent2 flex items-center justify-center text-lg font-bold text-white animate-pulse">F</div>
          <div className="text-xs text-text3 font-sora">Loading FlowOS…</div>
        </div>
      </div>
    )
  }

  if (!user) return <Navigate to="/login" replace />
  return children
}
