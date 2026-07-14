src/
├── assets/
│   ├── icons/          # Icônes PWA
│   ├── images/         # Images du projet
│   └── sounds/         # Fichiers audio pour notifications
│
├── components/
│   ├── common/         # Composants réutilisables
│   │   ├── Navigation/
│   │   │   ├── Navigation.jsx
│   │   │   ├── Navigation.css
│   │   │   └── index.js
│   │   ├── Layout/
│   │   │   ├── Layout.jsx
│   │   │   ├── Layout.css
│   │   │   └── index.js
│   │   ├── ThemeToggle/
│   │   │   ├── ThemeToggle.jsx
│   │   │   ├── ThemeToggle.css
│   │   │   └── index.js
│   │   ├── LanguageToggle/
│   │   │   ├── LanguageToggle.jsx
│   │   │   ├── LanguageToggle.css
│   │   │   └── index.js
│   │   └── ConnectionStatus/
│   │       ├── ConnectionStatus.jsx
│   │       ├── ConnectionStatus.css
│   │       └── index.js
│   │
│   ├── planning/       # Gestion du planning
│   │   ├── PlanningHeader/
│   │   │   ├── PlanningHeader.jsx
│   │   │   ├── PlanningHeader.css
│   │   │   └── index.js
│   │   ├── TaskList/
│   │   │   ├── TaskList.jsx
│   │   │   ├── TaskList.css
│   │   │   └── index.js
│   │   ├── TaskItem/
│   │   │   ├── TaskItem.jsx
│   │   │   ├── TaskItem.css
│   │   │   └── index.js
│   │   └── TaskForm/
│   │       ├── TaskForm.jsx
│   │       ├── TaskForm.css
│   │       └── index.js
│   │
│   ├── validation/     # Système de validation
│   │   ├── ValidationButtons/
│   │   │   ├── ValidationButtons.jsx
│   │   │   ├── ValidationButtons.css
│   │   │   └── index.js
│   │   └── ValidationNote/
│   │       ├── ValidationNote.jsx
│   │       ├── ValidationNote.css
│   │       └── index.js
│   │
│   ├── statistics/     # Statistiques
│   │   ├── StatsCard/
│   │   │   ├── StatsCard.jsx
│   │   │   ├── StatsCard.css
│   │   │   └── index.js
│   │   ├── WeeklyChart/
│   │   │   ├── WeeklyChart.jsx
│   │   │   ├── WeeklyChart.css
│   │   │   └── index.js
│   │   └── StreakBadge/
│   │       ├── StreakBadge.jsx
│   │       ├── StreakBadge.css
│   │       └── index.js
│   │
│   ├── auth/           # Authentification
│   │   ├── Login/
│   │   │   ├── Login.jsx
│   │   │   ├── Login.css
│   │   │   └── index.js
│   │   └── Register/
│   │       ├── Register.jsx
│   │       ├── Register.css
│   │       └── index.js
│   │
│   ├── ai/             # Fonctionnalités IA
│   │   ├── NaturalLanguageInput/
│   │   │   ├── NaturalLanguageInput.jsx
│   │   │   ├── NaturalLanguageInput.css
│   │   │   └── index.js
│   │   ├── PlanningPreview/
│   │   │   ├── PlanningPreview.jsx
│   │   │   ├── PlanningPreview.css
│   │   │   └── index.js
│   │   └── DailyReport/
│   │       ├── DailyReport.jsx
│   │       ├── DailyReport.css
│   │       └── index.js
│   │
│   ├── templates/      # Bibliothèque de modèles
│   │   ├── TemplateLibrary/
│   │   │   ├── TemplateLibrary.jsx
│   │   │   ├── TemplateLibrary.css
│   │   │   └── index.js
│   │   └── TemplateCard/
│   │       ├── TemplateCard.jsx
│   │       ├── TemplateCard.css
│   │       └── index.js
│   │
│   └── settings/       # Paramètres
│       ├── Settings.jsx
│       ├── Settings.css
│       └── index.js
│
├── pages/              # Pages principales
│   ├── Dashboard/
│   │   ├── Dashboard.jsx
│   │   ├── Dashboard.css
│   │   └── index.js
│   ├── Planning/
│   │   ├── Planning.jsx
│   │   ├── Planning.css
│   │   └── index.js
│   ├── Statistics/
│   │   ├── Statistics.jsx
│   │   ├── Statistics.css
│   │   └── index.js
│   └── Settings/
│       ├── Settings.jsx
│       ├── Settings.css
│       └── index.js
│
├── hooks/              # Hooks personnalisés
│   ├── useTasks.js
│   ├── useStatistics.js
│   ├── useValidation.js
│   ├── useAuth.js
│   ├── useTheme.js
│   ├── useLanguage.js
│   ├── useNotifications.js
│   └── index.js
│
├── store/              # Zustand Stores
│   ├── useAppStore.js      # Store principal
│   ├── useThemeStore.js    # Gestion du thème
│   ├── useLanguageStore.js # Gestion de la langue
│   └── index.js
│
├── services/           # Services (indépendants)
│   ├── db.js               # Configuration Dexie.js
│   ├── taskService.js      # CRUD tâches
│   ├── syncService.js      # Synchronisation
│   ├── migrationService.js # Migration des données
│   ├── aiService.js        # Appels IA
│   ├── notificationService.js # Notifications
│   ├── supabaseClient.js   # Client Supabase
│   └── index.js
│
├── utils/              # Utilitaires
│   ├── constants.js        # Constantes globales
│   ├── helpers.js          # Fonctions helpers
│   ├── validators.js       # Validation
│   ├── dateUtils.js        # Manipulation des dates
│   ├── translations.js     # Traductions EN/FR
│   └── index.js
│
├── types/              # Types (pour vérification)
│   ├── planning.types.js
│   ├── task.types.js
│   └── index.js
│
├── styles/             # Styles globaux
│   ├── themes/
│   │   ├── light.css       # Thème clair
│   │   └── dark.css        # Thème sombre
│   ├── variables.css       # Variables CSS
│   ├── global.css          # Styles globaux
│   └── index.css
│
├── App.jsx
├── App.css
├── main.jsx
└── index.css