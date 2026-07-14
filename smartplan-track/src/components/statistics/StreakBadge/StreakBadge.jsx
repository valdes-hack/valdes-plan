// src/components/statistics/StreakBadge/StreakBadge.jsx
import React from 'react'
import { FaFire, FaStar } from 'react-icons/fa'
import './StreakBadge.css'

const StreakBadge = ({ streak, xp }) => {
  return (
    <div className="streak-badge">
      <div className="streak-item">
        <div className="streak-icon fire">
          <FaFire />
        </div>
        <div className="streak-info">
          <span className="streak-value">{streak}</span>
          <span className="streak-label">jours de suite</span>
        </div>
      </div>
      
      <div className="streak-divider"></div>
      
      <div className="streak-item">
        <div className="streak-icon star">
          <FaStar />
        </div>
        <div className="streak-info">
          <span className="streak-value">{xp}</span>
          <span className="streak-label">XP</span>
        </div>
      </div>
    </div>
  )
}

export default StreakBadge