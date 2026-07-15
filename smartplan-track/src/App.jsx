// src/App.jsx
import React, { useEffect, useState } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

import Layout      from '@components/common/Layout'
import Dashboard   from '@pages/Dashboard'
import Planning    from '@pages/Planning'
import Statistics  from '@pages/Statistics'
import Settings    from '@pages/Settings'
import Login       from '@pages/Login/Login'
import Register    from '@pages/Register/Register'

import { useAppStore, useAuthStore, useThemeStore } from '@store'

import '@styles/index.css'

// ── Guard : redirige vers /login si non authentifié ──────────────────────────
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated } = useAuthStore()
  return isAuthenticated ? children : <Navigate to="/login" replace />
}

// ── Guard : redirige vers /dashboard si déjà connecté ────────────────────────
const PublicRoute = ({ children }) => {
  const { isAuthenticated } = useAuthStore()
  return isAuthenticated ? <Navigate to="/dashboard" replace /> : children
}

// ─────────────────────────────────────────────────────────────────────────────
function App() {
  const { initialize }       = useAppStore()
  const { init }             = useAuthStore()
  const { theme }            = useThemeStore()
  const [appReady, setAppReady] = useState(false)

  // Appliquer le thème sur <html>
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
  }, [theme])

  // Initialisation séquentielle : auth d'abord, puis données locales
  useEffect(() => {
    const boot = async () => {
      await init()          // vérifie la session Supabase
      await initialize()    // charge les tâches IndexedDB
      setAppReady(true)
    }
    boot()
  }, [])

  if (!appReady) {
    return (
      <div className="loading-screen">
        <div className="loader">⏳</div>
        <p>Chargement de SmartPlan...</p>
      </div>
    )
  }

  return (
    <Router>
      <Routes>
        {/* ── Routes publiques ── */}
        <Route path="/login"    element={<PublicRoute><Login /></PublicRoute>} />
        <Route path="/register" element={<PublicRoute><Register /></PublicRoute>} />

        {/* ── Routes protégées ── */}
        <Route path="/" element={
          <ProtectedRoute>
            <Layout>
              <Routes>
                <Route index element={<Navigate to="/dashboard" replace />} />
              </Routes>
            </Layout>
          </ProtectedRoute>
        } />

        <Route path="/dashboard" element={
          <ProtectedRoute>
            <Layout><Dashboard /></Layout>
          </ProtectedRoute>
        } />
        <Route path="/planning" element={
          <ProtectedRoute>
            <Layout><Planning /></Layout>
          </ProtectedRoute>
        } />
        <Route path="/statistics" element={
          <ProtectedRoute>
            <Layout><Statistics /></Layout>
          </ProtectedRoute>
        } />
        <Route path="/settings" element={
          <ProtectedRoute>
            <Layout><Settings /></Layout>
          </ProtectedRoute>
        } />

        {/* ── Fallback ── */}
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>

      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme={theme === 'dark' ? 'dark' : 'light'}
      />
    </Router>
  )
}

export default App
