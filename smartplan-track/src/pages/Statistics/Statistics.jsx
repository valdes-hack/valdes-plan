// src/pages/Statistics/Statistics.jsx
import React, { useEffect } from 'react'
import { useStatistics } from '@hooks'
import StatsCard from '@components/statistics/StatsCard'
import WeeklyChart from '@components/statistics/WeeklyChart'
import StreakBadge from '@components/statistics/StreakBadge'
import './Statistics.css'

const Statistics = () => {
  const { 
    dailyStats, 
    getWeeklyStats, 
    streak, 
    xp,
    updateDailyStats 
  } = useStatistics()

  useEffect(() => {
    updateDailyStats()
  }, [])

  const weeklyData = getWeeklyStats()

  return (
    <div className="statistics-page">
      <div className="stats-header">
        <h1>📊 Statistiques</h1>
        <StreakBadge streak={streak} xp={xp} />
      </div>

      <div className="stats-grid">
        <StatsCard
          icon="📋"
          label="Tâches totales"
          value={dailyStats.total}
          color="#6B7280"
        />
        <StatsCard
          icon="✅"
          label="Tâches terminées"
          value={dailyStats.done}
          subtitle={`${dailyStats.completionRate}% de complétion`}
          color="#10B981"
        />
        <StatsCard
          icon="⏳"
          label="Tâches incomplètes"
          value={dailyStats.incomplete}
          color="#F59E0B"
        />
        <StatsCard
          icon="❌"
          label="Tâches non faites"
          value={dailyStats.notDone}
          color="#EF4444"
        />
      </div>

      <div className="stats-chart">
        <h2>📈 Évolution de la semaine</h2>
        <WeeklyChart data={weeklyData} />
      </div>

      <div className="stats-summary">
        <div className="summary-item">
          <span className="summary-label">Moyenne de complétion</span>
          <span className="summary-value">{dailyStats.completionRate}%</span>
        </div>
        <div className="summary-item">
          <span className="summary-label">Tâches par jour</span>
          <span className="summary-value">
            {weeklyData.reduce((acc, day) => acc + day.total, 0) / 7}
          </span>
        </div>
      </div>
    </div>
  )
}

export default Statistics