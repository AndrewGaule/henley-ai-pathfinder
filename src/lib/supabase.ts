import { createClient } from '@supabase/supabase-js'

// Get Supabase credentials from environment variables
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

// Create Supabase client only if environment variables are set
export const supabase = (supabaseUrl && supabaseAnonKey)
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null

// Log warning if Supabase is not configured (only in development)
if (!supabase && import.meta.env.DEV) {
  console.warn('⚠️ Supabase not configured. App will use localStorage instead.')
  console.warn('To use Supabase, set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY environment variables.')
}

// Database types for TypeScript
export interface ParticipantRow {
  id: string
  timestamp: string
  name: string
  organisation: string
  role: string
  focus_area: string
  ai_hope: string
  ai_stuck: string
  ai_tried: string
  workshop_success: string
  summary: string
  track: string
  readiness: string
  themes: string[] // JSONB stored as array
  created_at: string
  updated_at: string
}
