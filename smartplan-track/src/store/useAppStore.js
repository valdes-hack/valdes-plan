// src/store/useAppStore.js
import { create } from 'zustand'
import { devtools, persist } from 'zustand/middleware'
import { taskService } from '@services'
import notificationService from '@services/notificationService'
import { TASK_STATUS } from '@types'
import { showToast } from '@utils/toastUtils'

const useAppStore = create(
  devtools(
    persist(
      (set, get) => ({
        // ===== ÉTAT =====
        plannings: [],
        currentPlanningId: null,
        tasks: [],
        validations: [],
        user: null,
        isConnected: false,
        isOffline: true,
        isLoading: false,
        streak: 0,
        xp: 0,
        dailyStats: {
          total: 0,
          done: 0,
          incomplete: 0,
          notDone: 0,
          completionRate: 0
        },

        // ===== ACTIONS POUR LES PLANNINGS =====

        /**
         * Récupérer tous les plannings
         */
        loadPlannings: async () => {
          set({ isLoading: true })
          try {
            // À implémenter avec db.plannings
            const plannings = []
            set({ plannings, isLoading: false })
            return plannings
          } catch (error) {
            console.error('Erreur chargement plannings:', error)
            set({ isLoading: false })
            return []
          }
        },

        /**
         * Créer un nouveau planning
         */
        createPlanning: async (planningData) => {
          try {
            const newPlanning = {
              id: crypto.randomUUID ? crypto.randomUUID() : Date.now().toString(),
              title: planningData.title || 'Nouveau planning',
              description: planningData.description || '',
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
              isActive: true
            }
            
            // À implémenter avec db.plannings.add
            set((state) => ({
              plannings: [...state.plannings, newPlanning],
              currentPlanningId: state.currentPlanningId || newPlanning.id
            }))
            
            showToast.success(`Planning "${newPlanning.title}" créé avec succès !`)
            return newPlanning
          } catch (error) {
            console.error('Erreur création planning:', error)
            showToast.error('Erreur lors de la création du planning')
            return null
          }
        },

        /**
         * Définir le planning actif
         */
        setCurrentPlanning: (id) => {
          set({ currentPlanningId: id })
        },

        // ===== ACTIONS POUR LES TÂCHES =====

        /**
         * Charger toutes les tâches
         */
        loadTasks: async () => {
          try {
            const tasks = await taskService.getAll()
            set({ tasks })
            return tasks
          } catch (error) {
            console.error('Erreur chargement tâches:', error)
            showToast.error('Erreur lors du chargement des tâches')
            return []
          }
        },

        /**
         * Ajouter une tâche
         */
        addTask: async (taskData) => {
          try {
            const newTask = await taskService.create({
              ...taskData,
              planningId: taskData.planningId || get().currentPlanningId
            })
            
            set((state) => ({
              tasks: [...state.tasks, newTask]
            }))
            
            // Programmer la notification si une heure de début est définie
            notificationService.scheduleTask(newTask)
            
            // Mettre à jour les stats
            await get().updateDailyStats()
            
            showToast.success(`Tâche "${newTask.title}" ajoutée avec succès !`)
            return newTask
          } catch (error) {
            console.error('Erreur ajout tâche:', error)
            showToast.error('Erreur lors de l\'ajout de la tâche')
            return null
          }
        },

        /**
         * Mettre à jour une tâche
         */
        updateTask: async (id, updates) => {
          try {
            await taskService.update(id, updates)
            
            set((state) => ({
              tasks: state.tasks.map(task =>
                task.id === id ? { ...task, ...updates, updatedAt: new Date().toISOString() } : task
              )
            }))
            
            // Reprogrammer la notification avec les nouvelles données
            const updatedTask = get().tasks.find(t => t.id === id)
            if (updatedTask) {
              notificationService.scheduleTask(updatedTask)
            }
            
            // Mettre à jour les stats
            await get().updateDailyStats()
            
            showToast.success('Tâche mise à jour avec succès !')
          } catch (error) {
            console.error('Erreur mise à jour tâche:', error)
            showToast.error('Erreur lors de la mise à jour de la tâche')
          }
        },

        /**
         * Supprimer une tâche
         */
        deleteTask: async (id) => {
          try {
            const task = get().tasks.find(t => t.id === id)
            await taskService.delete(id)
            
            // Annuler les notifications de cette tâche
            notificationService.cancelTask(id)
            
            set((state) => ({
              tasks: state.tasks.filter(task => task.id !== id)
            }))
            
            // Mettre à jour les stats
            await get().updateDailyStats()
            
            showToast.info(`Tâche "${task?.title || ''}" supprimée`)
          } catch (error) {
            console.error('Erreur suppression tâche:', error)
            showToast.error('Erreur lors de la suppression de la tâche')
          }
        },

        /**
         * Valider une tâche (3 états)
         */
        validateTask: async (id, status, note = '') => {
          try {
            const task = get().tasks.find(t => t.id === id)
            const validation = await taskService.validate(id, status, note)
            
            set((state) => ({
              tasks: state.tasks.map(task =>
                task.id === id ? { ...task, status, updatedAt: new Date().toISOString(), note } : task
              ),
              validations: [...state.validations, validation]
            }))
            
            // Mettre à jour les streaks et XP
            await get().updateStreakAndXP(status)
            
            // Mettre à jour les stats
            await get().updateDailyStats()
            
            const statusLabels = {
              'done': 'Fait ✅',
              'incomplete': 'Incomplet ⏳',
              'not_done': 'Non fait ❌'
            }
            
            if (note) {
              showToast.success(`Tâche "${task?.title || ''}" marquée comme ${statusLabels[status] || status} avec note`)
            } else {
              showToast.success(`Tâche "${task?.title || ''}" marquée comme ${statusLabels[status] || status}`)
            }
          } catch (error) {
            console.error('Erreur validation tâche:', error)
            showToast.error('Erreur lors de la validation de la tâche')
          }
        },

        // ===== STREAKS ET XP =====

        /**
         * Mettre à jour les streaks et XP
         */
        updateStreakAndXP: async (status) => {
          const state = get()
          let newStreak = state.streak
          let newXP = state.xp
          
          if (status === TASK_STATUS.DONE) {
            newStreak += 1
            newXP += 10
            showToast.info(`🔥 Streak: ${newStreak} jours ! +10 XP`)
          } else if (status === TASK_STATUS.INCOMPLETE) {
            newStreak = 0
            newXP += 2
            showToast.warning(`Streak réinitialisé ! +2 XP pour l'effort`)
          } else if (status === TASK_STATUS.NOT_DONE) {
            newStreak = 0
            showToast.warning(`Streak réinitialisé !`)
          }
          
          set({ streak: newStreak, xp: newXP })
          
          // Sauvegarder les stats
          localStorage.setItem('userStats', JSON.stringify({
            streak: newStreak,
            xp: newXP,
            lastUpdated: new Date().toISOString()
          }))
        },

        // ===== STATISTIQUES =====

        /**
         * Mettre à jour les statistiques du jour
         */
        updateDailyStats: async () => {
          try {
            const stats = await taskService.getTodayStats()
            set({ dailyStats: stats })
          } catch (error) {
            console.error('Erreur mise à jour stats:', error)
          }
        },

        /**
         * Obtenir les statistiques du jour (synchrone)
         */
        getTodayStats: () => {
          const state = get()
          const today = new Date().toDateString()
          const todayTasks = state.tasks.filter(t =>
            new Date(t.createdAt).toDateString() === today
          )
          
          const total = todayTasks.length
          const done = todayTasks.filter(t => t.status === TASK_STATUS.DONE).length
          const incomplete = todayTasks.filter(t => t.status === TASK_STATUS.INCOMPLETE).length
          const notDone = todayTasks.filter(t => t.status === TASK_STATUS.NOT_DONE).length
          
          return {
            total,
            done,
            incomplete,
            notDone,
            completionRate: total ? Math.round((done / total) * 100) : 0
          }
        },

        /**
         * Obtenir les statistiques de la semaine
         */
        getWeeklyStats: () => {
          const state = get()
          const last7Days = []
          
          for (let i = 6; i >= 0; i--) {
            const date = new Date()
            date.setDate(date.getDate() - i)
            const dateStr = date.toDateString()
            
            const dayTasks = state.tasks.filter(t =>
              new Date(t.createdAt).toDateString() === dateStr
            )
            
            const total = dayTasks.length
            const done = dayTasks.filter(t => t.status === TASK_STATUS.DONE).length
            
            last7Days.push({
              date: dateStr,
              total,
              done,
              rate: total ? Math.round((done / total) * 100) : 0
            })
          }
          
          return last7Days
        },

        // ===== INITIALISATION =====

        /**
         * Initialiser l'application
         */
        initialize: async () => {
          set({ isLoading: true })
          
          try {
            // Charger les tâches
            await get().loadTasks()
          } catch (error) {
            console.error('Erreur chargement tâches:', error)
          }
          
          try {
            // Charger les statistiques utilisateur
            const savedStats = localStorage.getItem('userStats')
            if (savedStats) {
              const stats = JSON.parse(savedStats)
              set({
                streak: stats.streak || 0,
                xp: stats.xp || 0
              })
            }
          } catch (error) {
            console.error('Erreur chargement stats:', error)
          }
          
          try {
            // Mettre à jour les stats du jour
            await get().updateDailyStats()
          } catch (error) {
            console.error('Erreur update stats:', error)
          }
          
          try {
            // Reprogrammer les notifications pour les tâches futures
            const tasks = get().tasks
            const now   = Date.now()
            const futureTasks = tasks.filter(t =>
              t.startTime && new Date(t.startTime).getTime() > now
            )

            // Injecter le userId dans le service de notifications
            // (récupéré depuis useAuthStore si disponible)
            try {
              const { useAuthStore } = await import('./useAuthStore')
              const userId = useAuthStore.getState().user?.id
              if (userId) notificationService.setUserId(userId)
            } catch { /* silent */ }

            futureTasks.forEach(task => notificationService.scheduleTask(task))
            if (futureTasks.length > 0) {
              console.log(`[Init] ${futureTasks.length} notification(s) reprogrammée(s)`)
            }
          } catch (error) {
            console.error('Erreur reprogrammation notifications:', error)
          }
          
          try {
            // Détecter l'état de la connexion
            const isOnline = navigator.onLine
            set({ isOffline: !isOnline })
          } catch (error) {
            console.error('Erreur détection connexion:', error)
          }
          
          // Toujours désactiver le chargement
          set({ isLoading: false })
        }
      }),
      {
        name: 'smartplan-storage',
        partialize: (state) => ({
          // Ce qu'on persiste dans localStorage
          streak: state.streak,
          xp: state.xp,
          plannings: state.plannings,
          currentPlanningId: state.currentPlanningId
        })
      }
    ),
    { name: 'SmartPlanStore' }
  )
)

export default useAppStore