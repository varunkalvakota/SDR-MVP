import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://placeholder.supabase.co'
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.placeholder'

if (supabaseAnonKey.includes('service_role')) {
  console.error('🚨 SECURITY WARNING: Never use service_role key in frontend code!')
  throw new Error('Invalid key type detected')
}

const hasRealCredentials = 
  supabaseUrl !== 'https://placeholder.supabase.co' && 
  supabaseAnonKey !== 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.placeholder' &&
  supabaseUrl.includes('supabase.co') && 
  supabaseAnonKey.length > 50

let supabase

if (hasRealCredentials) {
  supabase = createClient(supabaseUrl, supabaseAnonKey)
} else {
  supabase = {
    auth: {
      signUp: () => Promise.resolve({ 
        data: null, 
        error: { message: 'Please configure Supabase credentials in your .env file' } 
      }),
      signInWithPassword: () => Promise.resolve({ 
        data: null, 
        error: { message: 'Please configure Supabase credentials in your .env file' } 
      }),
      signOut: () => Promise.resolve({ error: null }),
      resetPasswordForEmail: () => Promise.resolve({ 
        data: null, 
        error: { message: 'Please configure Supabase credentials in your .env file' } 
      }),
      getUser: () => Promise.resolve({ data: { user: null } }),
      onAuthStateChange: (callback) => {
        setTimeout(() => callback('SIGNED_OUT', null), 0)
        return { 
          data: { 
            subscription: { 
              unsubscribe: () => {} 
            } 
          } 
        }
      }
    }
  }
}

export { supabase }

export const auth = {
  signUp: async (email, password, userData = {}) => {
    console.log('Signing up with user data:', userData)
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: userData
      }
    })
    console.log('Signup response:', { data, error })
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