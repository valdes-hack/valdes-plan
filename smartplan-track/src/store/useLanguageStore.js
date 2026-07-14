// src/store/useLanguageStore.js
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const useLanguageStore = create(
  persist(
    set => ({
      language: 'fr', // 'fr' | 'en'

      toggleLanguage: () =>
        set(state => ({
          language: state.language === 'fr' ? 'en' : 'fr',
        })),

      setLanguage: language => set({ language }),
    }),
    {
      name: 'language-storage',
    }
  )
);

export default useLanguageStore;
