// src/pages/Dashboard/Dashboard.jsx
import React, { useEffect } from 'react'
import { useStatistics } from '@hooks'
import StatsCard from '@components/statistics/StatsCard'
import StreakBadge from '@components/statistics/StreakBadge'
import WeeklyChart from '@components/statistics/WeeklyChart'
import './Dashboard.css'

const Dashboard = () => {
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
    <div className="dashboard-page">
      <div className="dashboard-header">
        <div className="dashboard-header-left">
          <h1>Tableau de bord 📊</h1>
          <p className="dashboard-subtitle">Bienvenue sur SmartPlan & Track</p>
        </div>
        <StreakBadge streak={streak} xp={xp} />
      </div>

      <div className="dashboard-stats">
        <StatsCard
          icon="📋"
          label="Tâches aujourd'hui"
          value={dailyStats.total}
          color="var(--status-pending)"
          gradient="linear-gradient(135deg, #8e8ea0, #636380)"
        />
        <StatsCard
          icon="✅"
          label="Taux de complétion"
          value={`${dailyStats.completionRate}%`}
          subtitle={`${dailyStats.done} terminées sur ${dailyStats.total}`}
          color="var(--success)"
          gradient="linear-gradient(135deg, #34c759, #20a344)"
        />
        <StatsCard
          icon="🔥"
          label="Série en cours"
          value={`${streak} jours`}
          color="var(--warning)"
          gradient="linear-gradient(135deg, #ff9f0a, #e08800)"
        />
      </div>

      <div className="dashboard-chart">
        <h2>📈 Performance de la semaine</h2>
        <WeeklyChart data={weeklyData} />
      </div>

      <div className="dashboard-quick-actions">
        <h2>⚡ Actions rapides</h2>
        <div className="quick-actions-grid">
          <a href="/planning" className="quick-action">
            <span className="quick-action-icon">📅</span>
            <span>Voir mon planning</span>
          </a>
          <a href="/statistics" className="quick-action">
            <span className="quick-action-icon">📊</span>
            <span>Analyser mes statistiques</span>
          </a>
        </div>
      </div>
    </div>
  )
}

export default Dashboard
