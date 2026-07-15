// src/services/supabaseClient.js
import { createClient } from '@supabase/supabase-js'

const supabaseUrl     = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  console.error(
    '❌ Variables Supabase manquantes dans .env\n' +
    'VITE_SUPABASE_URL et VITE_SUPABASE_ANON_KEY sont requis.'
  )
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
