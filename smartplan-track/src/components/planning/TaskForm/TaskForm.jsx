// src/components/planning/TaskForm/TaskForm.jsx
import React, { useState, useEffect } from 'react'
import { soundService } from '@services/soundService'
import './TaskForm.css'

const SOUNDS = soundService.getAvailableSounds()

const TaskForm = ({ initialData, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    startTime: '',
    endTime: '',
    priority: 'medium',
    microObjective: '',
    notificationSound: soundService.getCurrentSound()
  })

  const [previewSound, setPreviewSound] = useState(null)

  useEffect(() => {
    if (initialData) {
      setFormData({
        title:             initialData.title             || '',
        description:       initialData.description       || '',
        startTime:         initialData.startTime         || '',
        endTime:           initialData.endTime           || '',
        priority:          initialData.priority          || 'medium',
        microObjective:    initialData.microObjective    || '',
        notificationSound: initialData.notificationSound || soundService.getCurrentSound()
      })
    }
  }, [initialData])

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }

  /** Sélectionne un son + le prévisualise */
  const handleSoundSelect = (soundId) => {
    setFormData(prev => ({ ...prev, notificationSound: soundId }))
    setPreviewSound(soundId)
    soundService.playSound(soundId)
    // Reset l'indicateur de preview après 1.5s
    setTimeout(() => setPreviewSound(null), 1500)
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!formData.title.trim()) return

    const submitData = {
      ...formData,
      startTime: formData.startTime || new Date().toISOString(),
      endTime:   formData.endTime   || new Date().toISOString()
    }

    if (initialData) {
      onSubmit(initialData.id, submitData)
    } else {
      onSubmit(submitData)
    }
  }

  return (
    <div className="task-form-overlay" onClick={onCancel}>
      <div className="task-form" onClick={(e) => e.stopPropagation()}>

        {/* ── Header ── */}
        <div className="task-form-header">
          <h2>{initialData ? '✏️ Modifier la tâche' : '➕ Nouvelle tâche'}</h2>
          <button className="btn-close-form" onClick={onCancel} type="button">✕</button>
        </div>

        <form onSubmit={handleSubmit}>

          {/* ── Titre ── */}
          <div className="form-group">
            <label>Titre *</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="Ex: Réviser la cybersécurité"
              required
              autoFocus
            />
          </div>

          {/* ── Description ── */}
          <div className="form-group">
            <label>Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Détails de la tâche..."
              rows="2"
            />
          </div>

          {/* ── Horaires ── */}
          <div className="form-row">
            <div className="form-group">
              <label>Heure de début</label>
              <input
                type="datetime-local"
                name="startTime"
                value={formData.startTime}
                onChange={handleChange}
              />
            </div>
            <div className="form-group">
              <label>Heure de fin</label>
              <input
                type="datetime-local"
                name="endTime"
                value={formData.endTime}
                onChange={handleChange}
              />
            </div>
          </div>

          {/* ── Priorité + Micro-objectif ── */}
          <div className="form-row">
            <div className="form-group">
              <label>Priorité</label>
              <select name="priority" value={formData.priority} onChange={handleChange}>
                <option value="low">🟢 Basse</option>
                <option value="medium">🟡 Moyenne</option>
                <option value="high">🔴 Haute</option>
              </select>
            </div>
            <div className="form-group">
              <label>🎯 Micro-objectif</label>
              <input
                type="text"
                name="microObjective"
                value={formData.microObjective}
                onChange={handleChange}
                placeholder="Ex: Comprendre XSS"
              />
            </div>
          </div>

          {/* ── Sélecteur de son ── */}
          <div className="form-group">
            <label>🔔 Son de notification</label>
            <div className="sound-selector">
              {SOUNDS.map(sound => {
                const isActive    = formData.notificationSound === sound.id
                const isPreviewing = previewSound === sound.id
                return (
                  <button
                    key={sound.id}
                    type="button"
                    className={`sound-option ${isActive ? 'active' : ''} ${isPreviewing ? 'previewing' : ''}`}
                    onClick={() => handleSoundSelect(sound.id)}
                    title={sound.desc}
                  >
                    <span className="sound-option-icon">
                      {isPreviewing ? '▶️' : isActive ? '✓' : '🔔'}
                    </span>
                    <span className="sound-option-name">{sound.name}</span>
                    {isActive && <span className="sound-option-badge">sélectionné</span>}
                  </button>
                )
              })}
            </div>
            <p className="sound-hint">
              Cliquez pour prévisualiser • Le rappel se déclenchera 15 min avant et à l'heure exacte
            </p>
          </div>

          {/* ── Actions ── */}
          <div className="form-actions">
            <button type="button" className="btn-cancel" onClick={onCancel}>
              Annuler
            </button>
            <button type="submit" className="btn-submit">
              {initialData ? 'Mettre à jour' : 'Ajouter la tâche'}
            </button>
          </div>

        </form>
      </div>
    </div>
  )
}

export default TaskForm
