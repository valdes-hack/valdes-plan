// src/hooks/useValidation.js
import { useAppStore } from '@store'
import { TASK_STATUS } from '@types'

/**
 * Hook pour gérer les validations
 */
export const useValidation = () => {
  const {
    validateTask,
    validations
  } = useAppStore()

  const getStatusLabel = (status) => {
    const labels = {
      [TASK_STATUS.PENDING]: 'En attente',
      [TASK_STATUS.DONE]: 'Fait',
      [TASK_STATUS.INCOMPLETE]: 'Incomplet',
      [TASK_STATUS.NOT_DONE]: 'Non fait'
    }
    return labels[status] || status
  }

  const getStatusColor = (status) => {
    const colors = {
      [TASK_STATUS.PENDING]: '#6B7280',
      [TASK_STATUS.DONE]: '#10B981',
      [TASK_STATUS.INCOMPLETE]: '#F59E0B',
      [TASK_STATUS.NOT_DONE]: '#EF4444'
    }
    return colors[status] || '#6B7280'
  }

  return {
    validateTask,
    validations,
    getStatusLabel,
    getStatusColor
  }
}