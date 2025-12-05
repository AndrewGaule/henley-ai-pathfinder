import { createClient } from '@supabase/supabase-js'

// Get Supabase credentials from environment variables
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

// Validate that environment variables are set
if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Missing Supabase environment variables!')
  console.error('Please set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in your .env file')
}

// Create Supabase client
export const supabase = createClient(supabaseUrl || '', supabaseAnonKey || '')

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
