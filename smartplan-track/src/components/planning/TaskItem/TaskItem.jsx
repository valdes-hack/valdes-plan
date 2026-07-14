// src/components/planning/TaskItem/TaskItem.jsx - Ajouter l'affichage des notes
import React, { useState } from 'react'
import { format } from 'date-fns'
import { fr } from 'date-fns/locale'
import { FaEdit, FaTrash } from 'react-icons/fa'
import ValidationButtons from '@components/validation/ValidationButtons'
import ValidationNote from '@components/validation/ValidationNote'
import { TASK_STATUS } from '@types'
import './TaskItem.css'

const TaskItem = ({ task, onEdit, onDelete, onValidate }) => {
  const [showNote, setShowNote] = useState(false)
  const [selectedStatus, setSelectedStatus] = useState(null)

  // Récupérer la dernière note de validation pour cette tâche
  const getLastNote = () => {
    // La note est stockée dans l'objet task via les validations
    // Pour l'instant, on affiche une note si elle existe dans le champ note
    return task.note || null
  }

  const getStatusIcon = (status) => {
    const icons = {
      [TASK_STATUS.DONE]: '✅',
      [TASK_STATUS.INCOMPLETE]: '⏳',
      [TASK_STATUS.NOT_DONE]: '❌',
      [TASK_STATUS.PENDING]: '⏸️'
    }
    return icons[status] || '⏸️'
  }

  const getStatusLabel = (status) => {
    const labels = {
      [TASK_STATUS.DONE]: 'Fait',
      [TASK_STATUS.INCOMPLETE]: 'Incomplet',
      [TASK_STATUS.NOT_DONE]: 'Non fait',
      [TASK_STATUS.PENDING]: 'En attente'
    }
    return labels[status] || 'En attente'
  }

  const formatTime = (dateString) => {
    try {
      return format(new Date(dateString), 'HH:mm', { locale: fr })
    } catch {
      return ''
    }
  }

  const handleValidate = (taskId, status) => {
    setSelectedStatus(status)
    // Afficher la note pour Incomplet et Non fait
    if (status === TASK_STATUS.INCOMPLETE || status === TASK_STATUS.NOT_DONE) {
      setShowNote(true)
    } else {
      onValidate(taskId, status, '')
      setShowNote(false)
    }
  }

  const handleSaveNote = (taskId, note) => {
    if (selectedStatus) {
      onValidate(taskId, selectedStatus, note)
      setShowNote(false)
      setSelectedStatus(null)
    }
  }

  const handleCancelNote = () => {
    setShowNote(false)
    setSelectedStatus(null)
  }

  const lastNote = getLastNote()

  return (
    <div className={`task-item status-${task.status || TASK_STATUS.PENDING}`}>
      <div className="task-main">
        <div className="task-status-icon">
          {getStatusIcon(task.status)}
        </div>
        
        <div className="task-content">
          <h3 className="task-title">{task.title}</h3>
          {task.description && (
            <p className="task-description">{task.description}</p>
          )}
          {task.microObjective && (
            <div className="task-micro">
              🎯 {task.microObjective}
            </div>
          )}
          
          {/* Afficher la note si elle existe */}
          {lastNote && (
            <div className="task-note-display">
              <span className="note-label">📝 Note:</span>
              <span className="note-text">{lastNote}</span>
            </div>
          )}
          
          <div className="task-meta">
            <span className="task-time">
              🕐 {formatTime(task.startTime)} - {formatTime(task.endTime)}
            </span>
            <span className={`task-priority priority-${task.priority || 'medium'}`}>
              {task.priority || 'medium'}
            </span>
            <span className="task-status-label">
              {getStatusLabel(task.status)}
            </span>
            {task.notificationSound && (
              <span className="task-sound-badge" title={`Son : ${task.notificationSound}`}>
                🔔 {task.notificationSound}
              </span>
            )}
          </div>
          
          {showNote && (
            <ValidationNote
              taskId={task.id}
              onSave={handleSaveNote}
              onCancel={handleCancelNote}
            />
          )}
        </div>
      </div>
      
      <div className="task-actions">
        <ValidationButtons
          taskId={task.id}
          currentStatus={task.status}
          onValidate={handleValidate}
        />
        
        <div className="task-actions-buttons">
          <button 
            className="btn-edit"
            onClick={() => onEdit(task)}
            title="Modifier"
          >
            <FaEdit />
          </button>
          
          <button 
            className="btn-delete"
            onClick={() => onDelete(task.id)}
            title="Supprimer"
          >
            <FaTrash />
          </button>
        </div>
      </div>
    </div>
  )
}

export default TaskItem