// src/pages/Register/Register.jsx
import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuthStore } from '@store'
import './Register.css'

const Register = () => {
  const navigate = useNavigate()
  const { signUp, isLoading } = useAuthStore()

  const [fullName,         setFullName]         = useState('')
  const [email,            setEmail]            = useState('')
  const [password,         setPassword]         = useState('')
  const [confirmPassword,  setConfirmPassword]  = useState('')
  const [showPw,           setShowPw]           = useState(false)
  const [error,            setError]            = useState('')
  const [success,          setSuccess]          = useState(false)

  const validate = () => {
    if (!email.trim())            return 'Email requis'
    if (!/\S+@\S+\.\S+/.test(email)) return 'Email invalide'
    if (password.length < 6)     return 'Le mot de passe doit contenir au moins 6 caractères'
    if (password !== confirmPassword) return 'Les mots de passe ne correspondent pas'
    return null
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    const validationError = validate()
    if (validationError) { setError(validationError); return }

    try {
      const data = await signUp(email, password, { full_name: fullName })

      // Supabase peut exiger une confirmation email → pas de session immédiate
      if (data?.session) {
        navigate('/dashboard', { replace: true })
      } else {
        // Email de confirmation envoyé
        setSuccess(true)
      }
    } catch (err) {
      setError(err.message || "Erreur lors de l'inscription")
    }
  }

  // ── Vue confirmation email ──────────────────────────────────────────────────
  if (success) {
    return (
      <div className="auth-page">
        <div className="auth-card" style={{ textAlign: 'center' }}>
          <div className="auth-header">
            <span style={{ fontSize: '56px', display: 'block', marginBottom: '16px' }}>📬</span>
            <h1>Vérifiez votre email</h1>
            <p>Un lien de confirmation a été envoyé à <strong>{email}</strong></p>
          </div>
          <p style={{ color: 'var(--text-muted)', fontSize: '13px', marginTop: '16px' }}>
            Cliquez sur le lien dans l'email pour activer votre compte, puis connectez-vous.
          </p>
          <Link
            to="/login"
            style={{
              display: 'block', marginTop: '24px',
              padding: '12px', borderRadius: 'var(--radius)',
              background: 'linear-gradient(135deg, var(--accent), #7c6cf0)',
              color: '#fff', fontWeight: '700', textDecoration: 'none',
              boxShadow: 'var(--accent-glow)'
            }}
          >
            Aller à la connexion
          </Link>
        </div>
      </div>
    )
  }

  // ── Formulaire d'inscription ───────────────────────────────────────────────
  return (
    <div className="auth-page">
      <div className="auth-card">

        <div className="auth-header">
          <span className="auth-brand">🚀</span>
          <h1>Créer un compte</h1>
          <p>Commencez votre aventure SmartPlan</p>
        </div>

        {error && <div className="auth-error">{error}</div>}

        <form onSubmit={handleSubmit} className="auth-form" noValidate>

          <div className="form-group">
            <label htmlFor="reg-name">Nom complet</label>
            <input
              id="reg-name"
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="Jean Dupont"
              autoComplete="name"
            />
          </div>

          <div className="form-group">
            <label htmlFor="reg-email">Email *</label>
            <input
              id="reg-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="exemple@email.com"
              autoComplete="email"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="reg-password">Mot de passe *</label>
            <div style={{ position: 'relative' }}>
              <input
                id="reg-password"
                type={showPw ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Minimum 6 caractères"
                autoComplete="new-password"
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
                aria-label={showPw ? 'Masquer' : 'Afficher'}
              >
                {showPw ? '🙈' : '👁️'}
              </button>
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="reg-confirm">Confirmer le mot de passe *</label>
            <input
              id="reg-confirm"
              type={showPw ? 'text' : 'password'}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Répétez le mot de passe"
              autoComplete="new-password"
              required
            />
          </div>

          <button type="submit" className="btn-auth" disabled={isLoading}>
            {isLoading ? "⏳ Inscription..." : "Créer mon compte"}
          </button>

        </form>

        <p className="auth-footer">
          Déjà un compte ?{' '}
          <Link to="/login">Se connecter</Link>
        </p>

      </div>
    </div>
  )
}

export default Register
