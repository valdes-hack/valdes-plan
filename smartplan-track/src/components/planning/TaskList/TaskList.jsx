// src/components/planning/TaskList/TaskList.jsx
import React from 'react'
import TaskItem from '../TaskItem'
import './TaskList.css'

const TaskList = ({ tasks, onEdit, onDelete, onValidate }) => {
  if (tasks.length === 0) {
    return (
      <div className="task-list-empty">
        <p>Aucune tâche à afficher</p>
      </div>
    )
  }

  return (
    <div className="task-list">
      {tasks.map(task => (
        <TaskItem
          key={task.id}
          task={task}
          onEdit={onEdit}
          onDelete={onDelete}
          onValidate={onValidate}
        />
      ))}
    </div>
  )
}

export default TaskList