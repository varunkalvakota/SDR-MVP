import { createClient } from '@supabase/supabase-js'

// Your Supabase credentials - using environment variables
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://upctqvobvdgqqyxrjajp.supabase.co'
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVwY3Rxdm9idmRncXF5eHJqYWpwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQ2OTE1MDYsImV4cCI6MjA3MDI2NzUwNn0.RrY3DQ5UsRia-ZWZKuO5PCRPm1TqTJWM0BYIPLvzGQg'

if (supabaseAnonKey.includes('service_role')) {
  console.error('🚨 SECURITY WARNING: Never use service_role key in frontend code!')
  throw new Error('Invalid key type detected')
}

// Create Supabase client
const supabase = createClient(supabaseUrl, supabaseAnonKey)

export { supabase }

export const auth = {
  signUp: async (email, password, userData = {}) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: userData
      }
    })
    return { data, error }
  },

  signIn: async (email, password) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })
    return { data, error }
  },

  signOut: async () => {
    const { error } = await supabase.auth.signOut()
    return { error }
  },

  resetPasswordForEmail: async (email, options = {}) => {
    const { data, error } = await supabase.auth.resetPasswordForEmail(email, options)
    return { data, error }
  },

  getCurrentUser: () => {
    return supabase.auth.getUser()
  },

  onAuthStateChange: (callback) => {
    return supabase.auth.onAuthStateChange(callback)
  }
}