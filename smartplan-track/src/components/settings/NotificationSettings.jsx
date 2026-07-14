// src/components/settings/NotificationSettings.jsx
import React, { useState } from 'react'
import { useNotifications } from '@hooks'
import { soundService } from '@services/soundService'
import './NotificationSettings.css'

const NotificationSettings = () => {
  const {
    permission,
    isSupported,
    isGranted,
    requestPermission,
    sendTestNotification,
    scheduleAllNotifications
  } = useNotifications()

  const [selectedSound, setSelectedSound] = useState(soundService.getCurrentSound())
  const [previewing, setPreviewing]       = useState(null)
  const sounds = soundService.getAvailableSounds()

  const handleSoundChange = (soundId) => {
    setSelectedSound(soundId)
    soundService.setSound(soundId)
    setPreviewing(soundId)
    soundService.playSound(soundId)
    setTimeout(() => setPreviewing(null), 1500)
  }

  if (!isSupported) {
    return (
      <div className="notification-settings">
        <p>⚠️ Les notifications ne sont pas supportées par ce navigateur.</p>
      </div>
    )
  }

  return (
    <div className="notification-settings">
      <h3>🔔 Notifications</h3>

      {/* Status + activation */}
      <div className="settings-group">
        <div className="settings-row">
          <span className="settings-label">Statut des notifications</span>
          <span className={`settings-status ${isGranted ? 'granted' : 'denied'}`}>
            {isGranted ? '✅ Activées' : '❌ Désactivées'}
          </span>
        </div>

        {!isGranted && (
          <button className="btn-request-permission" onClick={requestPermission}>
            🔔 Activer les notifications
          </button>
        )}

        {isGranted && (
          <div className="settings-actions">
            <button className="btn-test-notification" onClick={sendTestNotification}>
              🔔 Tester
            </button>
            <button className="btn-schedule-notifications" onClick={scheduleAllNotifications}>
              📅 Programmer tous les rappels
            </button>
          </div>
        )}
      </div>

      {/* Sélecteur de son par défaut */}
      <div className="settings-group">
        <h4>🔊 Son par défaut</h4>
        <p className="sound-default-hint">
          Ce son sera pré-sélectionné lors de la création d'une tâche.
          Vous pouvez choisir un son différent par tâche.
        </p>
        <div className="sound-list">
          {sounds.map((sound) => {
            const isActive    = selectedSound === sound.id
            const isPreviewing = previewing === sound.id
            return (
              <button
                key={sound.id}
                className={`sound-btn ${isActive ? 'active' : ''} ${isPreviewing ? 'previewing' : ''}`}
                onClick={() => handleSoundChange(sound.id)}
              >
                <span className="sound-icon">
                  {isPreviewing ? '▶️' : isActive ? '✓' : '🔔'}
                </span>
                <div className="sound-info">
                  <span className="sound-name">{sound.name}</span>
                  <span className="sound-desc">{sound.desc}</span>
                </div>
                {isActive && <span className="sound-check">Par défaut</span>}
              </button>
            )
          })}
        </div>
      </div>

      {/* Info */}
      <div className="settings-info">
        <p>💡 Les sons fonctionnent sans connexion internet — tout est synthétisé localement.</p>
        <p>📱 Sur iOS, les notifications Push nécessitent iOS 16.4+.</p>
      </div>
    </div>
  )
}

export default NotificationSettings
