// src/hooks/useNotifications.js
import { useState, useEffect } from 'react'
import notificationService from '@services/notificationService'
import { useTasks } from './useTasks'

export const useNotifications = () => {
  const { tasks } = useTasks()
  const [permission, setPermission] = useState(Notification.permission || 'default')
  const [isSupported, setIsSupported] = useState('Notification' in window)

  useEffect(() => {
    // Mettre à jour le statut de permission
    const updatePermission = () => {
      setPermission(Notification.permission)
    }

    // Vérifier périodiquement
    const interval = setInterval(updatePermission, 1000)

    return () => clearInterval(interval)
  }, [])

  /**
   * Demander la permission
   */
  const requestPermission = async () => {
    const granted = await notificationService.requestPermission()
    setPermission(Notification.permission)
    return granted
  }

  /**
   * Envoyer une notification de test
   */
  const sendTestNotification = () => {
    notificationService.sendNotification(
      '✅ SmartPlan & Track',
      'Les notifications fonctionnent correctement !'
    )
  }

  /**
   * Programmer les notifications pour toutes les tâches
   */
  const scheduleAllNotifications = () => {
    notificationService.scheduleAllTasks(tasks)
  }

  /**
   * Annuler toutes les notifications
   */
  const cancelAllNotifications = () => {
    notificationService.cancelAllNotifications()
  }

  return {
    permission,
    isSupported,
    requestPermission,
    sendTestNotification,
    scheduleAllNotifications,
    cancelAllNotifications,
    isGranted: permission === 'granted'
  }
}