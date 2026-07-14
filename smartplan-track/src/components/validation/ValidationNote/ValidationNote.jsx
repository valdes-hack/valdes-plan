// src/components/validation/ValidationNote/ValidationNote.jsx
import React, { useState, useEffect, useRef } from 'react'
import './ValidationNote.css'

const ValidationNote = ({ taskId, onSave, onCancel }) => {
  const [note, setNote] = useState('')
  const [isOpen, setIsOpen] = useState(true)
  const textareaRef = useRef(null)

  useEffect(() => {
    // Auto-focus sur le textarea
    if (isOpen && textareaRef.current) {
      textareaRef.current.focus()
    }
  }, [isOpen])

  const handleSubmit = () => {
    if (note.trim()) {
      onSave(taskId, note)
      setNote('')
      setIsOpen(false)
    } else {
      // Si note vide, on ferme quand même
      onSave(taskId, '')
      setIsOpen(false)
    }
  }

  const handleCancel = () => {
    setNote('')
    setIsOpen(false)
    if (onCancel) onCancel()
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && e.ctrlKey) {
      handleSubmit()
    }
    if (e.key === 'Escape') {
      handleCancel()
    }
  }

  if (!isOpen) {
    return null // Ne rien afficher si fermé
  }

  return (
    <div className="validation-note-wrapper">
      <div className="validation-note">
        <div className="note-header">
          <span className="note-icon">📝</span>
          <span className="note-title">Ajouter une note justificative</span>
          <button className="note-close" onClick={handleCancel}>✕</button>
        </div>
        
        <textarea
          ref={textareaRef}
          className="note-input"
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder="Qu'as-tu appris ? / Qu'est-ce qui t'a bloqué ?"
          rows={3}
          onKeyDown={handleKeyDown}
        />
        
        <div className="note-actions">
          <button className="btn-note-cancel" onClick={handleCancel}>
            Annuler
          </button>
          <button 
            className="btn-note-save" 
            onClick={handleSubmit}
          >
            Sauvegarder
          </button>
        </div>
        <div className="note-hint">
          <span>Ctrl+Enter pour sauvegarder • Esc pour annuler</span>
        </div>
      </div>
    </div>
  )
}

export default ValidationNote