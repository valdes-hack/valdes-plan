// src/utils/translations.js
export const translations = {
  en: {
    // Navigation
    nav: {
      dashboard: 'Dashboard',
      planning: 'Planning',
      statistics: 'Statistics',
      settings: 'Settings',
    },
    // Common
    common: {
      add: 'Add',
      edit: 'Edit',
      delete: 'Delete',
      cancel: 'Cancel',
      save: 'Save',
      loading: 'Loading...',
      offline: 'Offline',
      online: 'Online',
    },
    // Tasks
    task: {
      title: 'Title',
      description: 'Description',
      startTime: 'Start Time',
      endTime: 'End Time',
      priority: 'Priority',
      low: 'Low',
      medium: 'Medium',
      high: 'High',
      microObjective: 'Micro-Objective',
      status: {
        pending: 'Pending',
        done: 'Done',
        incomplete: 'Incomplete',
        notDone: 'Not Done',
      },
    },
    // Validation
    validation: {
      done: 'Done',
      incomplete: 'Incomplete',
      notDone: 'Not Done',
      note: 'What did you learn? / What blocked you?',
    },
    // Statistics
    stats: {
      today: 'Today',
      week: 'Week',
      tasks: 'Tasks',
      completed: 'Completed',
      completionRate: 'Completion Rate',
      streak: 'Streak',
      xp: 'XP',
    },
  },
  fr: {
    // Navigation
    nav: {
      dashboard: 'Tableau de bord',
      planning: 'Planning',
      statistics: 'Statistiques',
      settings: 'Paramètres',
    },
    // Common
    common: {
      add: 'Ajouter',
      edit: 'Modifier',
      delete: 'Supprimer',
      cancel: 'Annuler',
      save: 'Enregistrer',
      loading: 'Chargement...',
      offline: 'Hors-ligne',
      online: 'En ligne',
    },
    // Tasks
    task: {
      title: 'Titre',
      description: 'Description',
      startTime: 'Heure de début',
      endTime: 'Heure de fin',
      priority: 'Priorité',
      low: 'Basse',
      medium: 'Moyenne',
      high: 'Haute',
      microObjective: 'Micro-objectif',
      status: {
        pending: 'En attente',
        done: 'Fait',
        incomplete: 'Incomplet',
        notDone: 'Non fait',
      },
    },
    // Validation
    validation: {
      done: 'Fait',
      incomplete: 'Incomplet',
      notDone: 'Non fait',
      note: "Qu'as-tu appris ? / Qu'est-ce qui t'a bloqué ?",
    },
    // Statistics
    stats: {
      today: "Aujourd'hui",
      week: 'Semaine',
      tasks: 'Tâches',
      completed: 'Terminées',
      completionRate: 'Taux de complétion',
      streak: 'Série',
      xp: 'XP',
    },
  },
};

export const getTranslation = (lang, key) => {
  const keys = key.split('.');
  let result = translations[lang];
  for (const k of keys) {
    result = result?.[k];
  }
  return result || key;
};
