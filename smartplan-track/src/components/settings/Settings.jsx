// src/pages/Settings/Settings.jsx
import React, { useState } from 'react'
import { useThemeStore, useLanguageStore } from '@store'
import { NotificationSettings } from '@components/settings'
import './Settings.css'

const Settings = () => {
  const { theme, toggleTheme } = useThemeStore()
  const { language, toggleLanguage } = useLanguageStore()

  return (
    <div className="settings-page">
      <h1>⚙️ Paramètres</h1>
      
      <div className="settings-grid">
        {/* Section Thème */}
        <div className="settings-card">
          <h2>🎨 Apparence</h2>
          <div className="settings-item">
            <span className="settings-label">Thème</span>
            <button 
              className="settings-btn theme-btn"
              onClick={toggleTheme}
            >
              {theme === 'light' ? '🌙 Mode sombre' : '☀️ Mode clair'}
            </button>
          </div>
        </div>

        {/* Section Langue */}
        <div className="settings-card">
          <h2>🌍 Langue</h2>
          <div className="settings-item">
            <span className="settings-label">Langue</span>
            <button 
              className="settings-btn lang-btn"
              onClick={toggleLanguage}
            >
              {language === 'fr' ? '🇬🇧 English' : '🇫🇷 Français'}
            </button>
          </div>
        </div>

        {/* Section Notifications */}
        <div className="settings-card full-width">
          <NotificationSettings />
        </div>

        {/* Section À propos */}
        <div className="settings-card">
          <h2>ℹ️ À propos</h2>
          <div className="settings-info">
            <p><strong>SmartPlan & Track</strong> v2.0</p>
            <p>Assistant de planification intelligent</p>
            <p className="settings-version">Local-First • PWA • IA</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Settings