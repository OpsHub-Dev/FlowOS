import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import AuthLayout from '../layouts/AuthLayout'
import { loginWithEmail, loginWithGoogle } from '../firebase'

export default function Login() {
  const navigate = useNavigate()
  const [form, setForm] = useState({ email: '', password: '' })
  const [showPass, setShowPass] = useState(false)
  const [loading, setLoading] = useState(false)
  const [googleLoading, setGoogleLoading] = useState(false)
  const [error, setError] = useState('')

  const set = (k) => (e) => setForm(f => ({ ...f, [k]: e.target.value }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    if (!form.email || !form.password) return setError('Please fill in all fields.')
    setLoading(true)
    try {
      await loginWithEmail(form.email, form.password)
      navigate('/dashboard')
    } catch (err) {
      setError(friendlyError(err.code))
    } finally {
      setLoading(false)
    }
  }

  const handleGoogle = async () => {
    setError('')
    setGoogleLoading(true)
    try {
      await loginWithGoogle()
      navigate('/dashboard')
    } catch (err) {
      setError(friendlyError(err.code))
    } finally {
      setGoogleLoading(false)
    }
  }

  return (
    <AuthLayout>
      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-1.5">Welcome back</h2>
        <p className="text-sm text-text3">Sign in to your FlowOS account</p>
      </div>

      {/* Google */}
      <button
        onClick={handleGoogle}
        disabled={googleLoading}
        className="w-full flex items-center justify-center gap-3 bg-surface border border-border rounded-xl py-2.5 text-sm font-medium hover:border-accent transition-all mb-5 disabled:opacity-60 cursor-pointer font-sora"
      >
        {googleLoading ? (
          <Spinner />
        ) : (
          <>
            <GoogleIcon />
            Continue with Google
          </>
        )}
      </button>

      <Divider />

      <form onSubmit={handleSubmit} className="space-y-4">
        <Field label="Email address" type="email" placeholder="you@company.com" value={form.email} onChange={set('email')} />
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="text-[10px] font-semibold text-text3 uppercase tracking-[.8px]">Password</label>
            <Link to="/forgot-password" className="text-[11px] text-accent hover:underline">Forgot password?</Link>
          </div>
          <div className="relative">
            <input
              type={showPass ? 'text' : 'password'}
              placeholder="••••••••"
              value={form.password}
              onChange={set('password')}
              className="w-full bg-surface2 border border-border rounded-xl px-4 py-2.5 text-sm text-text1 outline-none font-sora placeholder-text3 focus:border-accent transition-all pr-10"
            />
            <button type="button" onClick={() => setShowPass(s => !s)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-text3 hover:text-text1 transition-all text-base cursor-pointer">
              {showPass ? '🙈' : '👁️'}
            </button>
          </div>
        </div>

        {error && <ErrorMsg msg={error} />}

        <button
          type="submit"
          disabled={loading}
          className="w-full py-2.5 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-accent to-accent2 hover:opacity-90 transition-all disabled:opacity-60 flex items-center justify-center gap-2 cursor-pointer font-sora mt-2"
        >
          {loading ? <><Spinner /> Signing in…</> : 'Sign in'}
        </button>
      </form>

      <p className="text-center text-xs text-text3 mt-6">
        Don't have an account?{' '}
        <Link to="/register" className="text-accent font-semibold hover:underline">Create one free</Link>
      </p>
    </AuthLayout>
  )
}

// ── Sub-components ─────────────────────────────────────────

function Field({ label, type, placeholder, value, onChange }) {
  return (
    <div>
      <label className="block text-[10px] font-semibold text-text3 uppercase tracking-[.8px] mb-1.5">{label}</label>
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className="w-full bg-surface2 border border-border rounded-xl px-4 py-2.5 text-sm text-text1 outline-none font-sora placeholder-text3 focus:border-accent transition-all"
      />
    </div>
  )
}

function Divider() {
  return (
    <div className="flex items-center gap-3 my-5">
      <div className="flex-1 h-px bg-border" />
      <span className="text-[11px] text-text3">or continue with email</span>
      <div className="flex-1 h-px bg-border" />
    </div>
  )
}

function ErrorMsg({ msg }) {
  return (
    <div className="bg-accent5/10 border border-accent5/30 rounded-xl px-4 py-2.5 text-xs text-accent5 flex items-center gap-2">
      <span>⚠️</span> {msg}
    </div>
  )
}

function Spinner() {
  return (
    <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
    </svg>
  )
}

function GoogleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 48 48">
      <path fill="#FFC107" d="M43.6 20H24v8h11.3C33.6 33 29.3 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3 0 5.8 1.1 7.9 3l5.7-5.7C34 6.5 29.3 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20c11 0 20-8 20-20 0-1.3-.1-2.7-.4-4z"/>
      <path fill="#FF3D00" d="M6.3 14.7l6.6 4.8C14.5 16 19 13 24 13c3 0 5.8 1.1 7.9 3l5.7-5.7C34 6.5 29.3 4 24 4 16.3 4 9.7 8.3 6.3 14.7z"/>
      <path fill="#4CAF50" d="M24 44c5.2 0 9.9-1.9 13.4-5L31.8 34C29.9 35.3 27.1 36 24 36c-5.3 0-9.6-3-11.3-7.4L6 33.3C9.4 39.7 16.2 44 24 44z"/>
      <path fill="#1976D2" d="M43.6 20H24v8h11.3c-.9 2.4-2.5 4.4-4.5 5.8l5.6 4.9C40 35.1 44 30 44 24c0-1.3-.1-2.7-.4-4z"/>
    </svg>
  )
}

function friendlyError(code) {
  const map = {
    'auth/user-not-found': 'No account found with this email.',
    'auth/wrong-password': 'Incorrect password. Please try again.',
    'auth/invalid-email': 'Please enter a valid email address.',
    'auth/too-many-requests': 'Too many attempts. Please try again later.',
    'auth/invalid-credential': 'Invalid email or password.',
    'auth/popup-closed-by-user': 'Google sign-in was cancelled.',
    'auth/network-request-failed': 'Network error. Check your connection.',
  }
  return map[code] || 'Something went wrong. Please try again.'
}
