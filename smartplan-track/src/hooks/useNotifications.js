// src/hooks/useNotifications.js
import { useState, useEffect, useCallback } from 'react'
import notificationService from '@services/notificationService'
import pushService         from '@services/pushService'
import { useTasks }        from './useTasks'
import { useAuthStore }    from '@store'

export const useNotifications = () => {
  const { tasks }      = useTasks()
  const { user }       = useAuthStore()

  const [permission,    setPermission]    = useState(() =>
    typeof Notification !== 'undefined' ? Notification.permission : 'default'
  )
  const [isSubscribed,  setIsSubscribed]  = useState(false)
  const [isLoading,     setIsLoading]     = useState(false)
  const [isSupported]   = useState(() => 'Notification' in window)
  const [isPushSupported] = useState(() => pushService.isSupported())

  // Injecter le userId dans le service dès qu'on le connaît
  useEffect(() => {
    if (user?.id) {
      notificationService.setUserId(user.id)
    }
  }, [user?.id])

  // Vérifier si déjà subscrit au démarrage
  useEffect(() => {
    pushService.isSubscribed().then(setIsSubscribed)
  }, [])

  // Écouter les changements de permission
  useEffect(() => {
    const check = () => setPermission(Notification.permission)
    const interval = setInterval(check, 2000)
    return () => clearInterval(interval)
  }, [])

  // ── Actions ────────────────────────────────────────────────────────────────

  /**
   * Demande la permission + subscribe au Web Push
   */
  const requestPermission = useCallback(async () => {
    setIsLoading(true)
    try {
      const granted = await notificationService.requestAndSubscribe(user?.id)
      setPermission(Notification.permission)
      const subscribed = await pushService.isSubscribed()
      setIsSubscribed(subscribed)
      return granted
    } finally {
      setIsLoading(false)
    }
  }, [user?.id])

  /**
   * Désabonner du Web Push
   */
  const unsubscribe = useCallback(async () => {
    if (!user?.id) return
    setIsLoading(true)
    try {
      await pushService.unsubscribe(user.id)
      setIsSubscribed(false)
    } finally {
      setIsLoading(false)
    }
  }, [user?.id])

  /**
   * Envoyer une notification de test (locale + push)
   */
  const sendTestNotification = useCallback(async () => {
    await notificationService.sendNotification(
      '✅ SmartPlan & Track',
      'Les notifications fonctionnent — même hors de l\'app ! 🎉',
      { tag: 'test-notification', url: '/dashboard' }
    )
  }, [])

  /**
   * Programmer les rappels pour toutes les tâches futures
   */
  const scheduleAllNotifications = useCallback(() => {
    return notificationService.scheduleAllTasks(tasks)
  }, [tasks])

  /**
   * Annuler tous les rappels
   */
  const cancelAllNotifications = useCallback(() => {
    notificationService.cancelAllNotifications()
  }, [])

  return {
    // État
    permission,
    isGranted:       permission === 'granted',
    isSupported,
    isPushSupported,
    isSubscribed,
    isLoading,
    // Actions
    requestPermission,
    unsubscribe,
    sendTestNotification,
    scheduleAllNotifications,
    cancelAllNotifications,
  }
}
