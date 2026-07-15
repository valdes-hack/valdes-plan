// src/components/settings/NotificationSettings.jsx
import React, { useState } from 'react'
import { useNotifications } from '@hooks'
import { soundService }     from '@services/soundService'
import './NotificationSettings.css'

const NotificationSettings = () => {
  const {
    permission,
    isGranted,
    isSupported,
    isPushSupported,
    isSubscribed,
    isLoading,
    requestPermission,
    unsubscribe,
    sendTestNotification,
    scheduleAllNotifications,
  } = useNotifications()

  const [selectedSound, setSelectedSound] = useState(soundService.getCurrentSound())
  const [previewing,    setPreviewing]    = useState(null)
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

      {/* ── Statut ── */}
      <div className="settings-group">
        <div className="settings-row">
          <span className="settings-label">Statut</span>
          <span className={`settings-status ${isGranted ? 'granted' : 'denied'}`}>
            {isGranted ? '✅ Activées' : '❌ Désactivées'}
          </span>
        </div>

        {isPushSupported && isGranted && (
          <div className="settings-row">
            <span className="settings-label">Push background</span>
            <span className={`settings-status ${isSubscribed ? 'granted' : 'denied'}`}>
              {isSubscribed ? '📡 Abonné' : '📵 Non abonné'}
            </span>
          </div>
        )}
      </div>

      {/* ── Activation ── */}
      <div className="settings-group">
        {!isGranted ? (
          <button
            className="btn-request-permission"
            onClick={requestPermission}
            disabled={isLoading}
          >
            {isLoading ? '⏳ Activation...' : '🔔 Activer les notifications'}
          </button>
        ) : (
          <>
            {isPushSupported && !isSubscribed && (
              <button
                className="btn-request-permission"
                onClick={requestPermission}
                disabled={isLoading}
              >
                {isLoading ? '⏳ Abonnement...' : '📡 Activer les push background'}
              </button>
            )}

            <div className="settings-actions">
              <button
                className="btn-test-notification"
                onClick={sendTestNotification}
                disabled={isLoading}
              >
                🔔 Tester
              </button>
              <button
                className="btn-schedule-notifications"
                onClick={scheduleAllNotifications}
                disabled={isLoading}
              >
                📅 Programmer les rappels
              </button>
              {isSubscribed && (
                <button
                  className="btn-test-notification"
                  onClick={unsubscribe}
                  disabled={isLoading}
                  style={{ color: 'var(--danger)', borderColor: 'var(--danger-border)' }}
                >
                  📵 Se désabonner
                </button>
              )}
            </div>
          </>
        )}
      </div>

      {/* ── Son par défaut ── */}
      <div className="settings-group">
        <h4>🔊 Son par défaut</h4>
        <p className="sound-default-hint">
          Son pré-sélectionné à la création d'une tâche. Chaque tâche peut avoir son propre son.
        </p>
        <div className="sound-list">
          {sounds.map((sound) => {
            const isActive     = selectedSound === sound.id
            const isPreviewing = previewing    === sound.id
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

      {/* ── Info ── */}
      <div className="settings-info">
        <p>📱 Push background : visible même app fermée et écran verrouillé.</p>
        <p>💡 Sons synthétiques — fonctionnent hors ligne, aucun fichier requis.</p>
        <p>🍎 iOS : push nécessite d'installer l'app via "Ajouter à l'écran d'accueil" (iOS 16.4+).</p>
      </div>
    </div>
  )
}

export default NotificationSettings
