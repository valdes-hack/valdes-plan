// src/components/statistics/StatsCard/StatsCard.jsx
import React from 'react'
import './StatsCard.css'

const StatsCard = ({ icon, label, value, subtitle, color, gradient }) => {
  return (
    <div
      className="stats-card"
      style={{
        '--card-gradient': gradient || color || 'var(--accent)',
        '--icon-bg': color ? `${color}18` : 'var(--accent-light)'
      }}
    >
      <div className="stats-card-icon-wrap">
        {icon}
      </div>
      <div className="stats-card-content">
        <div className="stats-card-value">{value}</div>
        <div className="stats-card-label">{label}</div>
        {subtitle && <div className="stats-card-subtitle">{subtitle}</div>}
      </div>
    </div>
  )
}

export default StatsCard
