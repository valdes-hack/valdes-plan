// src/components/statistics/WeeklyChart/WeeklyChart.jsx
import React from 'react'
import './WeeklyChart.css'

const WeeklyChart = ({ data }) => {
  if (!data || data.length === 0) {
    return (
      <div className="weekly-chart-empty">
        <span>📊</span>
        <p>Aucune donnée cette semaine</p>
      </div>
    )
  }

  const days = ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim']

  return (
    <div className="weekly-chart">
      <div className="chart-bars">
        {data.map((day, index) => {
          const dayIndex = new Date(day.date).getDay()
          const dayName = days[dayIndex === 0 ? 6 : dayIndex - 1]
          const height = Math.max((day.rate / 100) * 100, 4)
          const isEmpty = day.total === 0

          return (
            <div key={index} className="chart-bar-wrapper">
              <div
                className={`chart-bar ${isEmpty ? 'bar-empty' : ''}`}
                style={{ height: `${height}%` }}
              >
                <span className="chart-bar-tooltip">{day.rate}% · {day.done}/{day.total}</span>
              </div>
              <span className="chart-bar-label">{dayName}</span>
              <span className="chart-bar-tasks">{day.done}/{day.total}</span>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default WeeklyChart
