// src/components/common/ConfirmModal/ConfirmModal.jsx
import React from 'react'
import { FaExclamationTriangle, FaTimes } from 'react-icons/fa'
import './ConfirmModal.css'

const ConfirmModal = ({ 
  isOpen, 
  onConfirm, 
  onCancel, 
  title = 'Confirmation',
  message = 'Voulez-vous vraiment effectuer cette action ?',
  confirmText = 'Confirmer',
  cancelText = 'Annuler',
  confirmColor = 'danger',
  icon = '⚠️'
}) => {
  if (!isOpen) return null

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      onCancel()
    }
  }

  return (
    <div className="confirm-modal-overlay" onClick={handleOverlayClick}>
      <div className="confirm-modal">
        <button className="confirm-modal-close" onClick={onCancel}>
          <FaTimes />
        </button>
        
        <div className="confirm-modal-icon">
          {icon}
        </div>
        
        <h2 className="confirm-modal-title">{title}</h2>
        <p className="confirm-modal-message">{message}</p>
        
        <div className="confirm-modal-actions">
          <button 
            className="confirm-modal-btn cancel"
            onClick={onCancel}
          >
            {cancelText}
          </button>
          <button 
            className={`confirm-modal-btn confirm ${confirmColor}`}
            onClick={onConfirm}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  )
}

export default ConfirmModal