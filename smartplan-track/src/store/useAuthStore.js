// src/store/useAuthStore.js
import { create } from 'zustand'
import { devtools, persist } from 'zustand/middleware'
import authService from '../services/authService'
import { supabase }  from '../services/supabaseClient'
import { showToast } from '@utils/toastUtils'

const useAuthStore = create(
  devtools(
    persist(
      (set, get) => ({
        // ── État ──────────────────────────────────────────────────────────────
        user:            null,
        session:         null,
        isLoading:       false,
        isAuthenticated: false,

        // ── Initialisation ────────────────────────────────────────────────────
        /**
         * Appelé au démarrage de l'app.
         * Récupère la session existante et branche le listener Supabase
         * pour réagir aux changements d'état auth en temps réel.
         */
        init: async () => {
          set({ isLoading: true })

          try {
            // 1. Récupérer la session courante
            const session = await authService.getSession()
            const user    = session?.user ?? null

            set({
              session,
              user,
              isAuthenticated: !!user,
              isLoading: false,
            })

            // 2. Écouter les changements d'état auth (token refresh, logout, OAuth callback…)
            supabase.auth.onAuthStateChange((_event, session) => {
              const user = session?.user ?? null
              set({
                session,
                user,
                isAuthenticated: !!user,
              })
            })

            return { user, session }
          } catch (error) {
            console.error('Erreur init auth:', error)
            set({ isLoading: false })
            return null
          }
        },

        // ── Inscription ───────────────────────────────────────────────────────
        signUp: async (email, password, metadata = {}) => {
          set({ isLoading: true })
          try {
            const data = await authService.signUp(email, password, metadata)

            // Supabase peut demander une confirmation email → session null
            if (data.session) {
              set({
                user:            data.user,
                session:         data.session,
                isAuthenticated: true,
              })
            }

            showToast.success('Inscription réussie ! Vérifiez votre email si nécessaire 🎉')
            set({ isLoading: false })
            return data
          } catch (error) {
            showToast.error(error.message || "Erreur lors de l'inscription")
            set({ isLoading: false })
            throw error
          }
        },

        // ── Connexion ─────────────────────────────────────────────────────────
        signIn: async (email, password) => {
          set({ isLoading: true })
          try {
            const data = await authService.signIn(email, password)

            set({
              user:            data.user,
              session:         data.session,
              isAuthenticated: true,
              isLoading:       false,
            })

            showToast.success(`Bon retour ! 👋`)
            return data
          } catch (error) {
            showToast.error(error.message || 'Email ou mot de passe incorrect')
            set({ isLoading: false })
            throw error
          }
        },

        // ── Connexion Google ──────────────────────────────────────────────────
        signInWithGoogle: async () => {
          set({ isLoading: true })
          try {
            await authService.signInWithGoogle()
            // Supabase redirige le navigateur → pas de set() ici
            // onAuthStateChange mettra à jour l'état après le retour
            set({ isLoading: false })
          } catch (error) {
            showToast.error(error.message || 'Erreur connexion Google')
            set({ isLoading: false })
            throw error
          }
        },

        // ── Déconnexion ───────────────────────────────────────────────────────
        signOut: async () => {
          set({ isLoading: true })
          try {
            await authService.signOut()
            set({
              user:            null,
              session:         null,
              isAuthenticated: false,
              isLoading:       false,
            })
            showToast.info('À bientôt ! 👋')
          } catch (error) {
            showToast.error('Erreur lors de la déconnexion')
            set({ isLoading: false })
          }
        },

        // ── Mise à jour du profil ─────────────────────────────────────────────
        updateProfile: async (updates) => {
          try {
            const data = await authService.updateProfile(updates)
            set({ user: data.user })
            showToast.success('Profil mis à jour !')
            return data
          } catch (error) {
            showToast.error(error.message || 'Erreur lors de la mise à jour')
            throw error
          }
        },

        // ── Reset password ────────────────────────────────────────────────────
        resetPassword: async (email) => {
          try {
            await authService.resetPassword(email)
            showToast.success('Email de réinitialisation envoyé !')
          } catch (error) {
            showToast.error(error.message || 'Erreur lors de la réinitialisation')
            throw error
          }
        },
      }),
      {
        name: 'auth-storage',
        // Ne persiste que ce qui est nécessaire — pas la session (token JWT)
        // Supabase gère lui-même la persistence du token dans localStorage
        partialize: (state) => ({
          user:            state.user,
          isAuthenticated: state.isAuthenticated,
        }),
      }
    ),
    { name: 'AuthStore' }
  )
)

export default useAuthStore
