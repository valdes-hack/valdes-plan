// src/pages/Login/Login.jsx
import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuthStore } from '@store'
import './Login.css'

const Login = () => {
  const navigate = useNavigate()
  const { signIn, signInWithGoogle, isLoading } = useAuthStore()

  const [email, setEmail]       = useState('')
  const [password, setPassword] = useState('')
  const [error, setError]       = useState('')
  const [showPw, setShowPw]     = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    try {
      await signIn(email, password)
      navigate('/dashboard', { replace: true })
    } catch (err) {
      setError(err.message || 'Email ou mot de passe incorrect')
    }
  }

  const handleGoogle = async () => {
    setError('')
    try {
      await signInWithGoogle()
      // Supabase gère la redirection — pas de navigate() ici
    } catch (err) {
      setError(err.message || 'Erreur connexion Google')
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-card">

        {/* Brand */}
        <div className="auth-header">
          <span className="auth-brand">📋</span>
          <h1>SmartPlan</h1>
          <p>Connectez-vous à votre compte</p>
        </div>

        {/* Erreur */}
        {error && <div className="auth-error">{error}</div>}

        {/* Formulaire */}
        <form onSubmit={handleSubmit} className="auth-form" noValidate>

          <div className="form-group">
            <label htmlFor="login-email">Email</label>
            <input
              id="login-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="exemple@email.com"
              autoComplete="email"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="login-password">Mot de passe</label>
            <div style={{ position: 'relative' }}>
              <input
                id="login-password"
                type={showPw ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                autoComplete="current-password"
                required
                style={{ paddingRight: '42px' }}
              />
              <button
                type="button"
                onClick={() => setShowPw(v => !v)}
                style={{
                  position: 'absolute', right: '12px', top: '50%',
                  transform: 'translateY(-50%)', background: 'none',
                  border: 'none', cursor: 'pointer', fontSize: '16px',
                  color: 'var(--text-muted)', padding: 0, minHeight: 0, minWidth: 0
                }}
                aria-label={showPw ? 'Masquer le mot de passe' : 'Afficher le mot de passe'}
              >
                {showPw ? '🙈' : '👁️'}
              </button>
            </div>
          </div>

          {/* Mot de passe oublié */}
          <div className="auth-forgot">
            <Link to="/reset-password">Mot de passe oublié ?</Link>
          </div>

          <button type="submit" className="btn-auth" disabled={isLoading}>
            {isLoading ? '⏳ Connexion...' : 'Se connecter'}
          </button>
        </form>

        {/* Séparateur */}
        <div className="auth-divider"><span>ou</span></div>

        {/* Google */}
        <button className="btn-google" onClick={handleGoogle} disabled={isLoading} type="button">
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
            <path d="M17.64 9.205c0-.639-.057-1.252-.164-1.841H9v3.481h4.844a4.14 4.14 0 0 1-1.796 2.716v2.259h2.908c1.702-1.567 2.684-3.875 2.684-6.615Z" fill="#4285F4"/>
            <path d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18Z" fill="#34A853"/>
            <path d="M3.964 10.71A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.042l3.007-2.332Z" fill="#FBBC05"/>
            <path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.958L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58Z" fill="#EA4335"/>
          </svg>
          Continuer avec Google
        </button>

        {/* Lien inscription */}
        <p className="auth-footer">
          Pas encore de compte ?{' '}
          <Link to="/register">S'inscrire gratuitement</Link>
        </p>

      </div>
    </div>
  )
}

export default Login
