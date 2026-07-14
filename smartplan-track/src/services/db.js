// src/services/db.js
import Dexie from 'dexie'

const db = new Dexie('SmartPlanDB')

// Version 1 — schéma d'origine (ne pas modifier)
db.version(1).stores({
  plannings:   'id, title, createdAt, updatedAt, isActive',
  tasks:       'id, planningId, title, status, priority, startTime, endTime, createdAt, updatedAt',
  validations: 'id, taskId, status, date',
  syncQueue:   '++id, action, entityType, entityId, synced, timestamp'
})

// Version 2 — ajout de l'index notificationSound sur tasks
db.version(2).stores({
  plannings:   'id, title, createdAt, updatedAt, isActive',
  tasks:       'id, planningId, title, status, priority, notificationSound, startTime, endTime, createdAt, updatedAt',
  validations: 'id, taskId, status, date',
  syncQueue:   '++id, action, entityType, entityId, synced, timestamp'
})

export default db
