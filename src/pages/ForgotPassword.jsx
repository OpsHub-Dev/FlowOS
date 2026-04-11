import { useState } from 'react'
import { Link } from 'react-router-dom'
import AuthLayout from '../layouts/AuthLayout'
import { resetPassword } from '../firebase'

export default function ForgotPassword() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    if (!email) return setError('Please enter your email address.')
    setLoading(true)
    try {
      await resetPassword(email)
      setSent(true)
    } catch (err) {
      setError(friendlyError(err.code))
    } finally {
      setLoading(false)
    }
  }

  return (
    <AuthLayout>
      {!sent ? (
        <>
          {/* Back link */}
          <Link to="/login" className="inline-flex items-center gap-1.5 text-xs text-text3 hover:text-text1 transition-all mb-8 group">
            <span className="group-hover:-translate-x-0.5 transition-transform">←</span> Back to sign in
          </Link>

          <div className="mb-8">
            <div className="w-12 h-12 rounded-2xl bg-accent/10 border border-accent/20 flex items-center justify-center text-xl mb-5">🔑</div>
            <h2 className="text-2xl font-bold mb-1.5">Forgot your password?</h2>
            <p className="text-sm text-text3 leading-relaxed">
              No worries! Enter your email and we'll send you a link to reset your password.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-[10px] font-semibold text-text3 uppercase tracking-[.8px] mb-1.5">Email address</label>
              <input
                type="email"
                placeholder="you@company.com"
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="w-full bg-surface2 border border-border rounded-xl px-4 py-2.5 text-sm text-text1 outline-none font-sora placeholder-text3 focus:border-accent transition-all"
              />
            </div>

            {error && (
              <div className="bg-accent5/10 border border-accent5/30 rounded-xl px-4 py-2.5 text-xs text-accent5 flex items-center gap-2">
                <span>⚠️</span> {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-accent to-accent2 hover:opacity-90 transition-all disabled:opacity-60 flex items-center justify-center gap-2 cursor-pointer font-sora"
            >
              {loading ? (
                <>
                  <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
                  </svg>
                  Sending…
                </>
              ) : 'Send Reset Link'}
            </button>
          </form>

          <p className="text-center text-xs text-text3 mt-6">
            Remember your password?{' '}
            <Link to="/login" className="text-accent font-semibold hover:underline">Sign in</Link>
          </p>
        </>
      ) : (
        /* Success state */
        <>
          <Link to="/login" className="inline-flex items-center gap-1.5 text-xs text-text3 hover:text-text1 transition-all mb-8 group">
            <span className="group-hover:-translate-x-0.5 transition-transform">←</span> Back to sign in
          </Link>

          <div className="text-center py-4">
            <div className="w-16 h-16 rounded-2xl bg-accent3/10 border border-accent3/20 flex items-center justify-center text-3xl mx-auto mb-6">📬</div>
            <h2 className="text-2xl font-bold mb-2">Check your email</h2>
            <p className="text-sm text-text3 leading-relaxed mb-2">
              We sent a password reset link to
            </p>
            <p className="text-sm font-semibold text-text1 mb-6">{email}</p>
            <p className="text-xs text-text3 leading-relaxed mb-8">
              Didn't receive it? Check your spam folder or{' '}
              <span
                onClick={() => { setSent(false) }}
                className="text-accent cursor-pointer hover:underline"
              >
                try a different email
              </span>
              .
            </p>

            {/* Resend */}
            <button
              onClick={handleSubmit}
              disabled={loading}
              className="w-full py-2.5 rounded-xl text-sm font-semibold bg-surface border border-border text-text2 hover:text-text1 hover:border-accent transition-all cursor-pointer font-sora"
            >
              Resend email
            </button>
          </div>
        </>
      )}
    </AuthLayout>
  )
}

function friendlyError(code) {
  const map = {
    'auth/user-not-found': 'No account found with this email address.',
    'auth/invalid-email': 'Please enter a valid email address.',
    'auth/too-many-requests': 'Too many requests. Please wait a moment.',
    'auth/network-request-failed': 'Network error. Check your connection.',
  }
  return map[code] || 'Something went wrong. Please try again.'
}
