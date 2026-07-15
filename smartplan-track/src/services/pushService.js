// src/services/pushService.js
/**
 * PushService — gère la subscription Web Push côté client
 *
 * Flux complet :
 *  1. requestPermission()          → demande la permission navigateur
 *  2. subscribe(userId)            → souscrit au push server + sauvegarde en Supabase
 *  3. unsubscribe(userId)          → supprime la subscription
 *  4. sendPushViaAPI(...)          → déclenche un push via la Vercel API
 */
import { supabase } from './supabaseClient'

const VAPID_PUBLIC_KEY = import.meta.env.VITE_VAPID_PUBLIC_KEY
const API_BASE         = import.meta.env.VITE_API_URL || ''   // '' = même origin (Vercel)

// ── Helpers ──────────────────────────────────────────────────────────────────

/** Convertit une base64url string en Uint8Array (requis par pushManager.subscribe) */
function urlBase64ToUint8Array(base64String) {
  const padding  = '='.repeat((4 - (base64String.length % 4)) % 4)
  const base64   = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/')
  const rawData  = atob(base64)
  return Uint8Array.from([...rawData].map(c => c.charCodeAt(0)))
}

// ─────────────────────────────────────────────────────────────────────────────

class PushService {
  // ── Permissions ─────────────────────────────────────────────────────────────

  isSupported() {
    return 'PushManager' in window && 'serviceWorker' in navigator
  }

  async getPermission() {
    if (!this.isSupported()) return 'unsupported'
    return Notification.permission
  }

  async requestPermission() {
    if (!this.isSupported()) return false
    const result = await Notification.requestPermission()
    return result === 'granted'
  }

  // ── Service Worker ───────────────────────────────────────────────────────────

  async getRegistration() {
    if (!('serviceWorker' in navigator)) return null
    try {
      const reg = await navigator.serviceWorker.ready
      return reg
    } catch {
      return null
    }
  }

  // ── Subscribe ────────────────────────────────────────────────────────────────

  /**
   * Souscrit aux push notifications et sauvegarde la subscription en Supabase.
   * @param {string} userId  — UUID Supabase de l'utilisateur connecté
   * @returns {PushSubscription|null}
   */
  async subscribe(userId) {
    if (!this.isSupported()) {
      console.warn('[Push] PushManager non supporté')
      return null
    }

    if (!VAPID_PUBLIC_KEY) {
      console.error('[Push] VITE_VAPID_PUBLIC_KEY manquant dans .env')
      return null
    }

    try {
      const reg = await this.getRegistration()
      if (!reg) throw new Error('Service Worker non enregistré')

      // Vérifier si déjà subscrit
      const existing = await reg.pushManager.getSubscription()
      if (existing) {
        // Mettre à jour la subscription en base quand même
        await this._saveSubscription(userId, existing)
        return existing
      }

      // Nouvelle subscription
      const subscription = await reg.pushManager.subscribe({
        userVisibleOnly:      true,
        applicationServerKey: urlBase64ToUint8Array(VAPID_PUBLIC_KEY),
      })

      await this._saveSubscription(userId, subscription)
      console.log('[Push] Subscription créée et sauvegardée ✅')
      return subscription

    } catch (err) {
      console.error('[Push] Erreur subscribe:', err)
      return null
    }
  }

  /**
   * Sauvegarde la subscription dans Supabase table `push_subscriptions`.
   */
  async _saveSubscription(userId, subscription) {
    const subJson = subscription.toJSON()

    const { error } = await supabase
      .from('push_subscriptions')
      .upsert(
        {
          user_id:  userId,
          endpoint: subJson.endpoint,
          subscription: subJson,
          updated_at: new Date().toISOString(),
        },
        { onConflict: 'endpoint' }
      )

    if (error) console.error('[Push] Erreur save subscription:', error)
  }

  // ── Unsubscribe ──────────────────────────────────────────────────────────────

  /**
   * Supprime la subscription du navigateur et de Supabase.
   * @param {string} userId
   */
  async unsubscribe(userId) {
    try {
      const reg = await this.getRegistration()
      const sub = await reg?.pushManager.getSubscription()

      if (sub) {
        const endpoint = sub.endpoint
        await sub.unsubscribe()

        // Supprimer de Supabase
        await supabase
          .from('push_subscriptions')
          .delete()
          .eq('endpoint', endpoint)
          .eq('user_id', userId)
      }

      console.log('[Push] Unsubscribed ✅')
    } catch (err) {
      console.error('[Push] Erreur unsubscribe:', err)
    }
  }

  // ── Déclencher un push via API ────────────────────────────────────────────────

  /**
   * Envoie une notification push à un utilisateur via la Vercel API.
   * Peut être appelé depuis le client (pas besoin d'être connecté à l'app).
   *
   * @param {object} params
   * @param {string} params.userId
   * @param {string} params.title
   * @param {string} params.body
   * @param {string} [params.url]
   * @param {string} [params.tag]
   * @param {string} [params.taskId]
   * @param {boolean} [params.requireInteraction]
   */
  async sendPushViaAPI({ userId, title, body, url, tag, taskId, requireInteraction }) {
    try {
      const response = await fetch(`${API_BASE}/api/send-push`, {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, title, body, url, tag, taskId, requireInteraction }),
      })

      if (!response.ok) {
        const err = await response.json()
        throw new Error(err.message || 'Erreur API push')
      }

      const result = await response.json()
      console.log(`[Push] Envoyé à ${result.sent}/${result.total} subscription(s)`)
      return result
    } catch (err) {
      console.error('[Push] Erreur sendPushViaAPI:', err)
      return null
    }
  }

  // ── Vérifier l'état de la subscription ──────────────────────────────────────

  async isSubscribed() {
    try {
      const reg = await this.getRegistration()
      const sub = await reg?.pushManager.getSubscription()
      return !!sub
    } catch {
      return false
    }
  }
}

export const pushService = new PushService()
export default pushService
