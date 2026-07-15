// src/services/notificationService.js
/**
 * NotificationService — orchestrateur central des notifications
 *
 * DEUX modes :
 *  - App ouverte  → setTimeout + Notification API locale (avec son)
 *  - App fermée   → Web Push via pushService → Vercel API → service worker
 */
import soundService from './soundService'
import pushService  from './pushService'

class NotificationService {
  constructor() {
    /** Map<taskId, timeoutId[]> — timers actifs (app ouverte) */
    this._timers = new Map()
    /** Notifications Web locales ouvertes */
    this._notifications = []
    /** userId courant — injecté par le store au login */
    this._userId = null
  }

  // ── Configuration ──────────────────────────────────────────────────────────

  setUserId(userId) { this._userId = userId }

  // ── Permissions ────────────────────────────────────────────────────────────

  isSupported()  { return 'Notification' in window }
  isPushSupported() { return pushService.isSupported() }

  async requestPermission() {
    if (!this.isSupported()) return false
    if (Notification.permission === 'granted') return true
    if (Notification.permission !== 'denied') {
      const result = await Notification.requestPermission()
      return result === 'granted'
    }
    return false
  }

  /**
   * Demande la permission + s'abonne aux Push si userId connu.
   */
  async requestAndSubscribe(userId) {
    const granted = await this.requestPermission()
    if (!granted) return false

    const uid = userId || this._userId
    if (uid && pushService.isSupported()) {
      await pushService.subscribe(uid)
    }
    return granted
  }

  // ── Notification locale (app ouverte) ──────────────────────────────────────

  /**
   * Affiche une notification locale via Notification API + son.
   * Fonctionne uniquement quand l'app est au premier plan / onglet actif.
   */
  sendLocalNotification(title, body, options = {}, soundId = null) {
    soundService.playSound(soundId || soundService.getCurrentSound())

    if (!this.isSupported() || Notification.permission !== 'granted') return null

    const notif = new Notification(title, {
      body,
      icon:  '/icons/android/launchericon-192x192.png',
      badge: '/icons/android/launchericon-96x96.png',
      tag:   options.tag || 'smartplan',
      ...options,
    })

    this._notifications.push(notif)
    setTimeout(() => notif.close(), 7000)
    return notif
  }

  // ── Push notification (app fermée / background) ────────────────────────────

  /**
   * Envoie un push via l'API serveur.
   * Visible même app fermée, sur écran verrouillé.
   */
  async sendPushNotification({ title, body, url, tag, taskId, requireInteraction, soundId }) {
    if (!this._userId) {
      // Fallback local si pas de userId
      this.sendLocalNotification(title, body, { tag }, soundId)
      return
    }

    // Toujours jouer le son si l'app est ouverte
    if (document.visibilityState === 'visible') {
      soundService.playSound(soundId || soundService.getCurrentSound())
    }

    // Envoyer le push background via API
    await pushService.sendPushViaAPI({
      userId: this._userId,
      title,
      body,
      url:                url    || '/planning',
      tag:                tag    || 'smartplan',
      taskId:             taskId || null,
      requireInteraction: requireInteraction || false,
    })
  }

  // ── Notification combinée (locale + push) ──────────────────────────────────

  /**
   * Méthode principale : envoie toujours les deux.
   * Si l'app est ouverte → notification locale visible immédiatement.
   * Le push background est aussi envoyé pour les autres appareils.
   */
  async sendNotification(title, body, options = {}, soundId = null) {
    // Notification locale (immédiate si app ouverte)
    this.sendLocalNotification(title, body, options, soundId)

    // Push serveur (background sur tous les appareils)
    await this.sendPushNotification({
      title,
      body,
      url:                options.url,
      tag:                options.tag,
      taskId:             options.taskId,
      requireInteraction: options.requireInteraction,
      soundId,
    })
  }

  // ── Programmation des rappels de tâches ────────────────────────────────────

  /**
   * Programme les rappels pour UNE tâche.
   * - 15 min avant l'heure de début
   * - À l'heure exacte
   */
  scheduleTask(task) {
    if (!task?.startTime) return

    this.cancelTask(task.id)

    const startMs = new Date(task.startTime).getTime()
    const nowMs   = Date.now()
    const soundId = task.notificationSound || null
    const timers  = []

    // Rappel 15 min avant
    const before15 = startMs - 15 * 60 * 1000 - nowMs
    if (before15 > 0) {
      const t = setTimeout(async () => {
        await this.sendNotification(
          '⏰ Dans 15 minutes',
          `"${task.title}" commence bientôt !`,
          { tag: `task-pre-${task.id}`, url: '/planning', taskId: task.id },
          soundId
        )
      }, before15)
      timers.push(t)
    }

    // Rappel à l'heure exacte
    const atTime = startMs - nowMs
    if (atTime > 0) {
      const t = setTimeout(async () => {
        await this.sendNotification(
          `🚀 C'est l'heure !`,
          `"${task.title}" — c'est maintenant !`,
          {
            tag:                `task-now-${task.id}`,
            url:                '/planning',
            taskId:             task.id,
            requireInteraction: true,
          },
          soundId
        )
      }, atTime)
      timers.push(t)
    }

    if (timers.length > 0) {
      this._timers.set(task.id, timers)
      console.log(
        `[Notif] "${task.title}" — ${timers.length} rappel(s). Son: ${soundId || 'défaut'}`
      )
    }
  }

  /** Programme les rappels pour toutes les tâches futures. */
  scheduleAllTasks(tasks) {
    let count = 0
    tasks.forEach(task => {
      if (task.startTime && new Date(task.startTime).getTime() > Date.now()) {
        this.scheduleTask(task)
        count++
      }
    })

    if (count > 0) {
      this.sendLocalNotification(
        '📅 SmartPlan',
        `${count} tâche(s) programmée(s) avec rappels`
      )
    }
    return count
  }

  /** Annule les timers d'une tâche. */
  cancelTask(taskId) {
    const timers = this._timers.get(taskId)
    if (timers) {
      timers.forEach(clearTimeout)
      this._timers.delete(taskId)
    }
  }

  /** Annule tous les timers. */
  cancelAllNotifications() {
    this._timers.forEach(timers => timers.forEach(clearTimeout))
    this._timers.clear()
    this._notifications.forEach(n => n.close())
    this._notifications = []
  }
}

export default new NotificationService()
