// src/services/taskService.js
import db from './db'
import { v4 as uuidv4 } from 'uuid'

/**
 * Service de gestion des tâches
 * Toutes les opérations sont effectuées en local (IndexedDB)
 */
export const taskService = {
  /**
   * Créer une nouvelle tâche
   * @param {Object} taskData - Données de la tâche
   * @returns {Promise<Task>} Tâche créée
   */
  create: async (taskData) => {
    const newTask = {
      id: uuidv4(),
      planningId:        taskData.planningId        || null,
      title:             taskData.title,
      description:       taskData.description       || '',
      startTime:         taskData.startTime         || new Date().toISOString(),
      endTime:           taskData.endTime           || new Date().toISOString(),
      status:            taskData.status            || 'pending',
      priority:          taskData.priority          || 'medium',
      microObjective:    taskData.microObjective    || '',
      notificationSound: taskData.notificationSound || null,
      createdAt:         new Date().toISOString(),
      updatedAt:         new Date().toISOString()
    }
    
    await db.tasks.add(newTask)
    return newTask
  },

  /**
   * Récupérer toutes les tâches
   * @returns {Promise<Task[]>} Liste des tâches
   */
  getAll: async () => {
    return await db.tasks.toArray()
  },

  /**
   * Récupérer une tâche par son ID
   * @param {string} id - ID de la tâche
   * @returns {Promise<Task>} Tâche trouvée
   */
  getById: async (id) => {
    return await db.tasks.get(id)
  },

  /**
   * Récupérer les tâches d'un planning
   * @param {string} planningId - ID du planning
   * @returns {Promise<Task[]>} Liste des tâches du planning
   */
  getByPlanning: async (planningId) => {
    return await db.tasks.where('planningId').equals(planningId).toArray()
  },

  /**
   * Récupérer les tâches du jour
   * @returns {Promise<Task[]>} Liste des tâches du jour
   */
  getTodayTasks: async () => {
    const today = new Date().toDateString()
    const allTasks = await db.tasks.toArray()
    return allTasks.filter(task => 
      new Date(task.createdAt).toDateString() === today
    )
  },

  /**
   * Mettre à jour une tâche
   * @param {string} id - ID de la tâche
   * @param {Object} updates - Champs à mettre à jour
   * @returns {Promise<number>} Nombre de mises à jour
   */
  update: async (id, updates) => {
    const updateData = {
      ...updates,
      updatedAt: new Date().toISOString()
    }
    return await db.tasks.update(id, updateData)
  },

  /**
   * Supprimer une tâche
   * @param {string} id - ID de la tâche
   * @returns {Promise<void>}
   */
  delete: async (id) => {
    return await db.tasks.delete(id)
  },

  /**
   * Valider une tâche (changement de statut)
   * @param {string} id - ID de la tâche
   * @param {string} status - Nouveau statut
   * @param {string} note - Note qualitative
   * @returns {Promise<Object>} Résultat de la validation
   */
  validate: async (id, status, note = '') => {
    // Mettre à jour la tâche
    await db.tasks.update(id, {
      status: status,
      updatedAt: new Date().toISOString()
    })

    // Créer une validation dans l'historique
    const validation = {
      id: uuidv4(),
      taskId: id,
      status: status,
      note: note,
      date: new Date().toISOString()
    }
    await db.validations.add(validation)

    return validation
  },

  /**
   * Récupérer les statistiques du jour
   * @returns {Promise<Object>} Statistiques
   */
  getTodayStats: async () => {
    const todayTasks = await taskService.getTodayTasks()
    const total = todayTasks.length
    const done = todayTasks.filter(t => t.status === 'done').length
    const incomplete = todayTasks.filter(t => t.status === 'incomplete').length
    const notDone = todayTasks.filter(t => t.status === 'not_done').length
    
    return {
      total,
      done,
      incomplete,
      notDone,
      completionRate: total ? Math.round((done / total) * 100) : 0
    }
  }
}

export default taskService