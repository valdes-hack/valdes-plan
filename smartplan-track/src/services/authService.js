// src/services/authService.js
import { supabase } from './supabaseClient'

const authService = {
  /** Inscription email/mot de passe */
  signUp: async (email, password, metadata = {}) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { full_name: metadata.full_name || '', ...metadata } }
    })
    if (error) throw error
    return data
  },

  /** Connexion email/mot de passe */
  signIn: async (email, password) => {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) throw error
    return data
  },

  /** Connexion OAuth Google */
  signInWithGoogle: async () => {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: window.location.origin }
    })
    if (error) throw error
    return data
  },

  /** Déconnexion */
  signOut: async () => {
    const { error } = await supabase.auth.signOut()
    if (error) throw error
  },

  /** Session courante */
  getSession: async () => {
    const { data: { session }, error } = await supabase.auth.getSession()
    if (error) return null
    return session
  },

  /** Utilisateur courant */
  getCurrentUser: async () => {
    const { data: { user }, error } = await supabase.auth.getUser()
    if (error) return null
    return user
  },

  /** Envoi email de reset */
  resetPassword: async (email) => {
    const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`
    })
    if (error) throw error
    return data
  },

  /** Nouveau mot de passe */
  updatePassword: async (newPassword) => {
    const { data, error } = await supabase.auth.updateUser({ password: newPassword })
    if (error) throw error
    return data
  },

  /** Mise à jour du profil */
  updateProfile: async (updates) => {
    const { data, error } = await supabase.auth.updateUser({ data: updates })
    if (error) throw error
    return data
  },

  /** Vérifie si une session existe */
  isAuthenticated: async () => {
    const session = await authService.getSession()
    return !!session
  }
}

export default authService
