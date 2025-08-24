import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  define: {
    // Ensure environment variables are available
    'process.env': {},
    // Explicitly define VITE_ environment variables
    'import.meta.env.VITE_AI_API_KEY': JSON.stringify(process.env.VITE_AI_API_KEY),
    'import.meta.env.VITE_SUPABASE_URL': JSON.stringify(process.env.VITE_SUPABASE_URL),
    'import.meta.env.VITE_SUPABASE_ANON_KEY': JSON.stringify(process.env.VITE_SUPABASE_ANON_KEY)
  }
})