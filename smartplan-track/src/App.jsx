// src/App.jsx
import React, { useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

import Layout from '@components/common/Layout'
import Dashboard from '@pages/Dashboard'
import Planning from '@pages/Planning'
import Statistics from '@pages/Statistics'
import Settings from '@pages/Settings'

import { useAppStore, useThemeStore } from '@store'
import '@styles/index.css'

function App() {
  const { initialize, isLoading } = useAppStore()
  const { theme } = useThemeStore()

  // Apply theme to <html> attribute
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
  }, [theme])

  useEffect(() => {
    initialize()
  }, [])

  if (isLoading) {
    return (
      <div className="loading-screen">
        <div className="loader">⏳</div>
        <p>Chargement de SmartPlan...</p>
      </div>
    )
  }

  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Navigate to="/dashboard" />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/planning" element={<Planning />} />
          <Route path="/statistics" element={<Statistics />} />
          <Route path="/settings" element={<Settings />} />
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
      </Layout>
    </Router>
  )
}

export default App
