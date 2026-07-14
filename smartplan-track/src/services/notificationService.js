// src/services/notificationService.js
import soundService from './soundService'

/**
 * NotificationService
 * Gère les notifications Web + les sons associés.
 * Chaque tâche peut avoir son propre son (task.notificationSound).
 * Les timers sont stockés en mémoire pour pouvoir être annulés.
 */
class NotificationService {
  constructor() {
    /** Map<taskId, timeoutId[]> — timers actifs par tâche */
    this._timers = new Map()
    /** Notifications Web ouvertes */
    this._notifications = []
  }

  // ─── Permissions ───────────────────────────────────────────────────────────

  isSupported() {
    return 'Notification' in window
  }

  async requestPermission() {
    if (!this.isSupported()) return false
    if (Notification.permission === 'granted') return true
    if (Notification.permission !== 'denied') {
      const result = await Notification.requestPermission()
      return result === 'granted'
    }
    return false
  }

  // ─── Envoi d'une notification ──────────────────────────────────────────────

  /**
   * Envoie une notification Web + joue le son associé.
   * @param {string} title
   * @param {string} body
   * @param {object} options  — options Web Notification standard
   * @param {string} soundId  — identifiant du son à jouer (peut être null)
   */
  sendNotification(title, body, options = {}, soundId = null) {
    // Jouer le son en premier (pas besoin de permission)
    soundService.playSound(soundId || soundService.getCurrentSound())

    // Notification Web si permission accordée
    if (!this.isSupported() || Notification.permission !== 'granted') return null

    const notif = new Notification(title, {
      body,
      icon: '/icons/android/launchericon-192x192.png',
      badge: '/icons/android/launchericon-96x96.png',
      tag: options.tag || 'smartplan',
      ...options
    })

    this._notifications.push(notif)
    setTimeout(() => notif.close(), 6000)
    return notif
  }

  // ─── Programmer / annuler les rappels d'une tâche ─────────────────────────

  /**
   * Programme les rappels pour UNE tâche.
   * Rappels : 15 min avant + à l'heure exacte.
   * @param {object} task — objet tâche complet (doit avoir .startTime et .notificationSound)
   */
  scheduleTask(task) {
    if (!task?.startTime) return

    // Annuler les anciens timers pour cette tâche
    this.cancelTask(task.id)

    const startMs   = new Date(task.startTime).getTime()
    const nowMs     = Date.now()
    const soundId   = task.notificationSound || null
    const timers    = []

    // Rappel 15 min avant
    const before15 = startMs - 15 * 60 * 1000 - nowMs
    if (before15 > 0) {
      const t = setTimeout(() => {
        this.sendNotification(
          '⏰ Dans 15 minutes',
          `"${task.title}" commence bientôt !`,
          { tag: `task-pre-${task.id}` },
          soundId
        )
      }, before15)
      timers.push(t)
    }

    // Rappel à l'heure exacte
    const atTime = startMs - nowMs
    if (atTime > 0) {
      const t = setTimeout(() => {
        this.sendNotification(
          `🚀 C'est l'heure !`,
          `"${task.title}" — c'est maintenant !`,
          { tag: `task-now-${task.id}`, requireInteraction: true },
          soundId
        )
      }, atTime)
      timers.push(t)
    }

    if (timers.length > 0) {
      this._timers.set(task.id, timers)
      console.log(
        `[Notif] Tâche "${task.title}" — ${timers.length} rappel(s) programmé(s). Son : ${soundId || 'défaut'}`
      )
    }
  }

  /**
   * Programme les rappels pour un tableau de tâches.
   * @param {object[]} tasks
   */
  scheduleAllTasks(tasks) {
    let count = 0
    tasks.forEach(task => {
      const startMs = new Date(task.startTime).getTime()
      if (startMs > Date.now()) {
        this.scheduleTask(task)
        count++
      }
    })

    this.sendNotification(
      '📅 SmartPlan',
      `${count} tâche(s) programmée(s) avec rappels`
    )
  }

  /**
   * Annule tous les timers d'une tâche.
   * @param {string} taskId
   */
  cancelTask(taskId) {
    const timers = this._timers.get(taskId)
    if (timers) {
      timers.forEach(clearTimeout)
      this._timers.delete(taskId)
    }
  }

  /**
   * Annule tous les timers actifs.
   */
  cancelAllNotifications() {
    this._timers.forEach(timers => timers.forEach(clearTimeout))
    this._timers.clear()
    this._notifications.forEach(n => n.close())
    this._notifications = []
  }

  /** @deprecated Utilise scheduleTask à la place */
  scheduleTaskNotification(task) {
    this.scheduleTask(task)
  }
}

export default new NotificationService()
