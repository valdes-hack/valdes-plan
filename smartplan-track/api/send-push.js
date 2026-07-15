// api/send-push.js — Vercel Serverless Function
// Reçoit une tâche, récupère les subscriptions Supabase, envoie les push

import webpush from 'web-push'
import { createClient } from '@supabase/supabase-js'

// Configurer VAPID
webpush.setVapidDetails(
  process.env.VAPID_EMAIL,
  process.env.VITE_VAPID_PUBLIC_KEY,
  process.env.VAPID_PRIVATE_KEY
)

export default async function handler(req, res) {
  // CORS
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization')

  if (req.method === 'OPTIONS') return res.status(200).end()
  if (req.method !== 'POST')    return res.status(405).json({ error: 'Method not allowed' })

  try {
    const { userId, title, body, url, tag, taskId, requireInteraction } = req.body

    if (!userId || !title) {
      return res.status(400).json({ error: 'userId et title requis' })
    }

    // Supabase admin (clé service côté serveur uniquement)
    const supabase = createClient(
      process.env.VITE_SUPABASE_URL,
      process.env.SUPABASE_SERVICE_KEY  // clé service — jamais côté client
    )

    // Récupérer toutes les subscriptions de l'utilisateur
    const { data: subscriptions, error } = await supabase
      .from('push_subscriptions')
      .select('subscription')
      .eq('user_id', userId)

    if (error) throw error
    if (!subscriptions?.length) {
      return res.status(200).json({ sent: 0, message: 'Aucune subscription trouvée' })
    }

    // Payload de la notification
    const payload = JSON.stringify({
      title,
      body,
      url:                url || '/planning',
      tag:                tag || `task-${taskId || Date.now()}`,
      taskId:             taskId || null,
      requireInteraction: requireInteraction || false,
      icon:  '/icons/android/launchericon-192x192.png',
      badge: '/icons/android/launchericon-96x96.png',
    })

    // Envoyer à toutes les subscriptions
    const results = await Promise.allSettled(
      subscriptions.map(({ subscription }) =>
        webpush.sendNotification(subscription, payload)
      )
    )

    // Supprimer les subscriptions expirées (410 Gone)
    const expired = []
    results.forEach((result, i) => {
      if (result.status === 'rejected') {
        const status = result.reason?.statusCode
        if (status === 410 || status === 404) {
          expired.push(subscriptions[i].subscription.endpoint)
        }
      }
    })

    if (expired.length > 0) {
      await supabase
        .from('push_subscriptions')
        .delete()
        .in('endpoint', expired)
        .eq('user_id', userId)
    }

    const sent = results.filter(r => r.status === 'fulfilled').length
    return res.status(200).json({ sent, total: subscriptions.length })

  } catch (err) {
    console.error('[send-push] Error:', err)
    return res.status(500).json({ error: err.message })
  }
}
