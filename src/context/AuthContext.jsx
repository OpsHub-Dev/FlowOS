import { createContext, useContext, useEffect, useState } from 'react'
import { onAuthChange, logout } from '../firebase'
import { getUserProfile } from '../services/firebaseService'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(undefined)
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const unsub = onAuthChange(async (firebaseUser) => {
      setUser(firebaseUser)
      if (firebaseUser) {
        const prof = await getUserProfile(firebaseUser.uid)
        setProfile(prof)
      } else {
        setProfile(null)
      }
      setLoading(false)
    })
    return unsub
  }, [])

  const refreshProfile = async () => {
    if (user) {
      const prof = await getUserProfile(user.uid)
      setProfile(prof)
    }
  }

  const signOut = () => logout()
  const isAdmin   = profile?.role === 'Admin'
  const isManager = profile?.role === 'Manager'
  const isHQ      = isAdmin || isManager
  const isStaff   = !isHQ

  return (
    <AuthContext.Provider value={{ user, profile, loading, signOut, refreshProfile, isAdmin, isManager, isHQ, isStaff }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
