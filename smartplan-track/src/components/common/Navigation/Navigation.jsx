// src/components/common/Navigation/Navigation.jsx
import React from 'react'
import { NavLink } from 'react-router-dom'
import { FaHome, FaCalendar, FaChartBar, FaCog } from 'react-icons/fa'
import './Navigation.css'

const Navigation = () => {
  return (
    <nav className="navigation">
      <div className="nav-brand">
        <div className="brand-icon-wrap">📋</div>
        <div>
          <span className="brand-name">SmartPlan</span>
          <span className="brand-tagline">& Track</span>
        </div>
      </div>

      <span className="nav-section-label">Menu</span>

      <ul className="nav-links">
        <li>
          <NavLink to="/dashboard" className={({ isActive }) => isActive ? 'active' : ''}>
            <span className="nav-icon"><FaHome /></span>
            <span>Tableau de bord</span>
          </NavLink>
        </li>
        <li>
          <NavLink to="/planning" className={({ isActive }) => isActive ? 'active' : ''}>
            <span className="nav-icon"><FaCalendar /></span>
            <span>Planning</span>
          </NavLink>
        </li>
        <li>
          <NavLink to="/statistics" className={({ isActive }) => isActive ? 'active' : ''}>
            <span className="nav-icon"><FaChartBar /></span>
            <span>Statistiques</span>
          </NavLink>
        </li>
        <li>
          <NavLink to="/settings" className={({ isActive }) => isActive ? 'active' : ''}>
            <span className="nav-icon"><FaCog /></span>
            <span>Paramètres</span>
          </NavLink>
        </li>
      </ul>

      <div className="nav-footer">
        <div className="nav-status">
          <span className="status-dot offline"></span>
          <span className="status-text">Hors-ligne</span>
        </div>
      </div>
    </nav>
  )
}

export default Navigation
