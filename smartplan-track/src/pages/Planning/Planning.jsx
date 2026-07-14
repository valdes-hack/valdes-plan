// src/pages/Planning/Planning.jsx
import React, { useState, useEffect } from 'react'
import { useTasks, useStatistics } from '@hooks'
import TaskItem from '@components/planning/TaskItem'
import TaskForm from '@components/planning/TaskForm'
import ConfirmModal from '@components/common/ConfirmModal'
import './Planning.css'

const Planning = () => {
  const { tasks, addTask, updateTask, deleteTask, validateTask, loadTasks } = useTasks()
  const { dailyStats, updateDailyStats } = useStatistics()
  
  const [showForm, setShowForm] = useState(false)
  const [editingTask, setEditingTask] = useState(null)
  const [filter, setFilter] = useState('all')
  const [deleteModalOpen, setDeleteModalOpen] = useState(false)
  const [taskToDelete, setTaskToDelete] = useState(null)

  useEffect(() => {
    loadTasks()
    updateDailyStats()
  }, [])

  // Filtrer les tâches
  const filteredTasks = tasks.filter(task => {
    if (filter === 'all') return true
    return task.status === filter
  })

  const handleAddTask = (taskData) => {
    addTask(taskData)
    setShowForm(false)
  }

  const handleEditTask = (task) => {
    setEditingTask(task)
    setShowForm(true)
  }

  const handleUpdateTask = (id, updates) => {
    updateTask(id, updates)
    setShowForm(false)
    setEditingTask(null)
  }

  const handleCancelForm = () => {
    setShowForm(false)
    setEditingTask(null)
  }

  /**
   * Ouvrir le modal de confirmation de suppression
   */
  const handleDeleteClick = (task) => {
    setTaskToDelete(task)
    setDeleteModalOpen(true)
  }

  /**
   * Confirmer la suppression
   */
  const handleConfirmDelete = () => {
    if (taskToDelete) {
      deleteTask(taskToDelete.id)
      setTaskToDelete(null)
    }
    setDeleteModalOpen(false)
  }

  /**
   * Annuler la suppression
   */
  const handleCancelDelete = () => {
    setTaskToDelete(null)
    setDeleteModalOpen(false)
  }

  const getFilterLabel = (filterKey) => {
    const labels = {
      all: 'Toutes',
      pending: 'En attente',
      done: 'Terminées',
      incomplete: 'Incomplètes',
      not_done: 'Non faites'
    }
    return labels[filterKey] || filterKey
  }

  return (
    <div className="planning-page">
      <div className="planning-header">
        <div>
          <h1>📅 Planning</h1>
          <p className="planning-subtitle">
            {dailyStats.total} tâches aujourd'hui • {dailyStats.completionRate}% complétées
          </p>
        </div>
        <div className="planning-header-actions">
          <button 
            className="btn-add-task"
            onClick={() => {
              setEditingTask(null)
              setShowForm(true)
            }}
          >
            + Nouvelle tâche
          </button>
        </div>
      </div>

      <div className="planning-controls">
        <div className="filter-buttons">
          {['all', 'pending', 'done', 'incomplete', 'not_done'].map((f) => (
            <button
              key={f}
              className={`filter-btn ${filter === f ? 'active' : ''}`}
              onClick={() => setFilter(f)}
            >
              {getFilterLabel(f)}
              {f !== 'all' && (
                <span className="filter-count">
                  {tasks.filter(t => t.status === f).length}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {showForm && (
        <TaskForm
          initialData={editingTask}
          onSubmit={editingTask ? handleUpdateTask : handleAddTask}
          onCancel={handleCancelForm}
        />
      )}

      <div className="task-list-container">
        {filteredTasks.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon">📋</div>
            <h3>Aucune tâche {filter !== 'all' ? getFilterLabel(filter).toLowerCase() : ''}</h3>
            <p>Commencez par ajouter votre première tâche !</p>
            <button 
              className="btn-add-task-empty"
              onClick={() => {
                setEditingTask(null)
                setShowForm(true)
              }}
            >
              + Ajouter une tâche
            </button>
          </div>
        ) : (
          filteredTasks.map(task => (
            <TaskItem
              key={task.id}
              task={task}
              onEdit={handleEditTask}
              onDelete={handleDeleteClick}
              onValidate={validateTask}
            />
          ))
        )}
      </div>

      {/* Modal de confirmation de suppression */}
      <ConfirmModal
        isOpen={deleteModalOpen}
        onConfirm={handleConfirmDelete}
        onCancel={handleCancelDelete}
        title="⚠️ Confirmation de suppression"
        message={`Voulez-vous vraiment supprimer la tâche "${taskToDelete?.title || ''}" ? Cette action est irréversible.`}
        confirmText="Supprimer"
        cancelText="Annuler"
        confirmColor="danger"
        icon="🗑️"
      />
    </div>
  )
}

export default Planning