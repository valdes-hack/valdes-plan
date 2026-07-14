// src/hooks/useTasks.js
import { useAppStore } from '@store'

/**
 * Hook pour gérer les tâches
 */
export const useTasks = () => {
  const {
    tasks,
    addTask,
    updateTask,
    deleteTask,
    validateTask,
    loadTasks
  } = useAppStore()

  return {
    tasks,
    addTask,
    updateTask,
    deleteTask,
    validateTask,
    loadTasks
  }
}