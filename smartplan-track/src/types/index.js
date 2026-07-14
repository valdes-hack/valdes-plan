// src/types/index.js

/**
 * Représente un planning
 * @typedef {Object} Planning
 * @property {string} id - Identifiant unique (UUID)
 * @property {string} title - Titre du planning
 * @property {string} description - Description
 * @property {string} createdAt - Date de création (ISO)
 * @property {string} updatedAt - Date de dernière modification (ISO)
 * @property {boolean} isActive - Planning actif ou non
 */

/**
 * Représente une tâche
 * @typedef {Object} Task
 * @property {string} id - Identifiant unique (UUID)
 * @property {string} planningId - ID du planning parent
 * @property {string} title - Titre de la tâche
 * @property {string} description - Description détaillée
 * @property {string} startTime - Heure de début (ISO)
 * @property {string} endTime - Heure de fin (ISO)
 * @property {'pending'|'done'|'incomplete'|'not_done'} status - Statut de la tâche
 * @property {'low'|'medium'|'high'} priority - Priorité
 * @property {string} microObjective - Micro-objectif associé
 * @property {string} createdAt - Date de création (ISO)
 * @property {string} updatedAt - Date de dernière modification (ISO)
 */

/**
 * Représente une validation
 * @typedef {Object} Validation
 * @property {string} id - Identifiant unique (UUID)
 * @property {string} taskId - ID de la tâche validée
 * @property {string} status - Statut validé
 * @property {string} note - Note qualitative
 * @property {string} date - Date de validation (ISO)
 */

/**
 * Représente une entrée dans la file de synchronisation
 * @typedef {Object} SyncQueue
 * @property {number} id - Identifiant auto-incrémenté
 * @property {'CREATE'|'UPDATE'|'DELETE'|'VALIDATE'} action - Type d'action
 * @property {'task'|'planning'|'validation'} entityType - Type d'entité
 * @property {string} entityId - ID de l'entité
 * @property {*} data - Données de l'action
 * @property {string} timestamp - Horodatage (ISO)
 * @property {boolean} synced - Synchronisé ou non
 */

/**
 * Représente les statistiques utilisateur
 * @typedef {Object} UserStats
 * @property {number} streak - Nombre de jours consécutifs
 * @property {number} xp - Points d'expérience
 * @property {string} lastUpdated - Dernière mise à jour (ISO)
 */

export const TASK_STATUS = {
  PENDING: 'pending',
  DONE: 'done',
  INCOMPLETE: 'incomplete',
  NOT_DONE: 'not_done'
}

export const TASK_PRIORITY = {
  LOW: 'low',
  MEDIUM: 'medium',
  HIGH: 'high'
}

export const SYNC_ACTIONS = {
  CREATE: 'CREATE',
  UPDATE: 'UPDATE',
  DELETE: 'DELETE',
  VALIDATE: 'VALIDATE'
}

export const ENTITY_TYPES = {
  TASK: 'task',
  PLANNING: 'planning',
  VALIDATION: 'validation'
}