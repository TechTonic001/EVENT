import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { login } from '../lib/api.js'
import { setToken } from '../lib/auth.js'

function LockIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M7 11V8a5 5 0 0 1 10 0v3"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <path
        d="M6 11h12v10H6V11Z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function ShieldIcon() {
  return (
    <svg width="26" height="26" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M12 2 20 6v6c0 5-3.3 9.4-8 10-4.7-.6-8-5-8-10V6l8-4Z"
        stroke="white"
        strokeWidth="2"
        strokeLinejoin="round"
      />
    </svg>
  )
}

export default function AdminLogin() {
  const nav = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [remember, setRemember] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function onSubmit(e) {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const res = await login(email, password)
      setToken(res.token)
      if (!remember) {
        // token still stored for MVP; checkbox is visual to match design
      }
      nav('/dashboard')
    } catch (err) {
      setError(err.message || 'Login failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="loginPage">
      <div className="loginTop">
        <div className="title">EventPro Admin</div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, color: '#64748b', fontSize: 13, fontWeight: 700 }}>
          Support <LockIcon />
        </div>
      </div>

      <div className="loginMain">
        <div className="loginCard">
          <div className="loginHero">
            <div className="loginShield">
              <ShieldIcon />
            </div>
          </div>

          <div className="loginBody">
            <h1>Administrator Access</h1>
            <p>Secure portal for platform management</p>

            <form className="form" onSubmit={onSubmit}>
              <div className="field">
                <label>Admin Email</label>
                <div className="input">
                  <span style={{ color: '#94a3b8', fontWeight: 900 }}>@</span>
                  <input
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    type="email"
                    placeholder="input your email"
                    autoComplete="username"
                    required
                  />
                </div>
              </div>

              <div className="field">
                <label>Password</label>
                <div className="input">
                  <span style={{ color: '#94a3b8', fontWeight: 900, display: 'grid', placeItems: 'center' }}>
                    <LockIcon />
                  </span>
                  <input
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    type="password"
                    placeholder="••••••••"
                    autoComplete="current-password"
                    required
                  />
                </div>
              </div>

              <div className="checkboxRow">
                <input id="remember" type="checkbox" checked={remember} onChange={(e) => setRemember(e.target.checked)} />
                <label htmlFor="remember">Remember device for 24h</label>
              </div>

              <button className="primaryBtn" type="submit" disabled={loading}>
                {loading ? 'Signing in...' : 'Secure Login'}
              </button>

              {error ? <div className="errorText">{error}</div> : null}

              <div style={{ marginTop: 12, textAlign: 'center', fontSize: 12, fontWeight: 800, color: '#334155' }}>
                <span style={{ color: '#64748b' }}>ⓘ</span> Forgot Admin Credentials?
              </div>
            </form>

            <div className="loginFooter">
              <span>ⓘ AES-256 ENCRYPTED</span>
              <span>•</span>
              <span>ⓘ MFA ENABLED</span>
            </div>
          </div>
        </div>
      </div>

      <div style={{ height: 72, borderTop: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 22px', color: '#64748b', fontSize: 12 }}>
        <div>© 2024 EventPro Management. Secure Admin Portal.</div>
        <div style={{ display: 'flex', gap: 18 }}>
          <a href="#" onClick={(e) => e.preventDefault()}>
            Privacy Policy
          </a>
          <a href="#" onClick={(e) => e.preventDefault()}>
            Security Standards
          </a>
          <a href="#" onClick={(e) => e.preventDefault()}>
            System Status
          </a>
        </div>
      </div>
    </div>
  )
}

