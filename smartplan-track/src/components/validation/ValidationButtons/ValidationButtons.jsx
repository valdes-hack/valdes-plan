// src/components/validation/ValidationButtons/ValidationButtons.jsx
import React from 'react'
import { FaCheck, FaClock, FaTimes } from 'react-icons/fa'
import { TASK_STATUS } from '@types'
import './ValidationButtons.css'

const ValidationButtons = ({ taskId, currentStatus, onValidate }) => {
  const handleValidate = (status) => {
    if (status === currentStatus) return
    onValidate(taskId, status)
  }

  return (
    <div className="validation-buttons">
      <button
        className={`btn-validate done ${currentStatus === TASK_STATUS.DONE ? 'active' : ''}`}
        onClick={() => handleValidate(TASK_STATUS.DONE)}
        title="Marquer comme fait"
      >
        <FaCheck />
        <span>Fait</span>
      </button>
      
      <button
        className={`btn-validate incomplete ${currentStatus === TASK_STATUS.INCOMPLETE ? 'active' : ''}`}
        onClick={() => handleValidate(TASK_STATUS.INCOMPLETE)}
        title="Marquer comme incomplet"
      >
        <FaClock />
        <span>Incomplet</span>
      </button>
      
      <button
        className={`btn-validate notdone ${currentStatus === TASK_STATUS.NOT_DONE ? 'active' : ''}`}
        onClick={() => handleValidate(TASK_STATUS.NOT_DONE)}
        title="Marquer comme non fait"
      >
        <FaTimes />
        <span>Non fait</span>
      </button>
    </div>
  )
}

export default ValidationButtons