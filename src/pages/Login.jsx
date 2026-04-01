import React, { useState } from 'react'
import { Lock, Mail, Eye, EyeOff, ArrowRight, Leaf, Shield } from 'lucide-react'
import axios from 'axios'

const Login = ({ onLogin }) => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [retryCount, setRetryCount] = useState(0)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    
    try {
      const res = await axios.post('/auth/login', { email, password })
      if (res.data.user.role !== 'admin') {
        throw new Error('Access denied. Admin only.')
      }
      localStorage.setItem('token', res.data.token)
      localStorage.setItem('user', JSON.stringify(res.data.user))
      setRetryCount(0) // Reset retry count on success
      onLogin(res.data.user)
    } catch (err) {
      const isDbError = err.response?.data?.msg?.includes('Database connection') || 
                      err.response?.data?.msg?.includes('timeout')
      
      if (isDbError && retryCount < 3) {
        // Retry automatically for database errors
        const delay = Math.pow(2, retryCount) * 1000 // Exponential backoff: 1s, 2s, 4s
        setError(`Connection issue. Retrying in ${delay/1000} seconds...`)
        
        setTimeout(() => {
          setRetryCount(retryCount + 1)
          handleSubmit(e) // Retry the request
        }, delay)
      } else {
        setError(err.response?.data?.msg || err.message || 'Login failed. Please check your credentials.')
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="login-page">
      <div className="login-card">
        <div className="login-header">
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            marginBottom: '0.5rem'
          }}>
            <div className="logo-icon">
              <Leaf size={28} />
            </div>
          </div>
          <h1>Admin Portal</h1>
          <p>Enter your credentials to manage the farm.</p>
        </div>

        <form onSubmit={handleSubmit} className="login-form">
          {error && (
            <div className="error-message" style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '0.5rem',
              padding: '0.75rem',
              backgroundColor: 'rgba(239, 68, 68, 0.1)',
              border: '1px solid rgba(239, 68, 68, 0.2)',
              borderRadius: '8px',
              marginBottom: '1rem'
            }}>
              <AlertCircle size={16} style={{ color: '#ef4444', flexShrink: 0 }} />
              <span style={{ color: '#ef4444', fontSize: '0.875rem' }}>{error}</span>
              {error.includes('Retrying') && (
                <button 
                  type="button" 
                  className="btn btn-ghost" 
                  style={{ marginLeft: 'auto', fontSize: '0.75rem' }}
                  onClick={() => {
                    setRetryCount(0)
                    setError('')
                  }}
                >
                  Cancel Retry
                </button>
              )}
            </div>
          )}
          
          <div className="input-group" style={{display: 'flex', flexDirection: 'column',alignItems: 'flex-start'}}>
            <label>Email Address</label>
            <div className="input-wrapper" style={{width: '100%'}}>
              <Mail size={18} className="input-icon" />
              <input 
                type="email" 
                placeholder="admin@gpf.com" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="input-group" style={{display: 'flex', flexDirection: 'column',alignItems: 'flex-start'}}>
            <label>Password</label>
            <div className="input-wrapper" style={{width: '100%'}}>
              <Lock size={18} className="input-icon" />
              <input 
                type={showPassword ? 'text' : 'password'} 
                placeholder="Enter your password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <button 
                type="button" 
                className="eye-btn"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.875rem' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
              <input type="checkbox" style={{ cursor: 'pointer', accentColor: 'var(--primary)', width: '18px', height: '18px' }} />
              <span style={{ color: 'var(--text-secondary)' }}>Remember me</span>
            </label>
            <a href="#" style={{ color: 'var(--primary)', fontWeight: 500 }}>Forgot password?</a>
          </div>

          <button type="submit" className="btn btn-primary login-btn" disabled={loading}>
            {loading ? (
              <>
                <span style={{ 
                  width: '16px', 
                  height: '16px', 
                  border: '2px solid white', 
                  borderTopColor: 'transparent', 
                  borderRadius: '50%', 
                  animation: 'spin 1s linear infinite',
                  display: 'inline-block'
                }}></span>
                Authenticating...
              </>
            ) : (
              <>
                Sign In
                <ArrowRight size={18} />
              </>
            )}
          </button>
        </form>

        <div className="login-footer">
          <p style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
            <Shield size={14} />
            <span>Secured by GPF Farmer Management System</span>
          </p>
          <p style={{ marginTop: '0.5rem', fontSize: '0.75rem' }}>� 2026 All rights reserved.</p>
        </div>
      </div>
    </div>
  )
}

export default Login
