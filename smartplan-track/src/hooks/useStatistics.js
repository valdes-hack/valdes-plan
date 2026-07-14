// src/hooks/useStatistics.js
import { useAppStore } from '@store'

/**
 * Hook pour gérer les statistiques
 */
export const useStatistics = () => {
  const {
    dailyStats,
    getTodayStats,
    getWeeklyStats,
    streak,
    xp,
    updateDailyStats
  } = useAppStore()

  return {
    dailyStats,
    getTodayStats,
    getWeeklyStats,
    streak,
    xp,
    updateDailyStats
  }
}