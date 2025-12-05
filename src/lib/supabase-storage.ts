import { supabase, ParticipantRow } from './supabase'
import { Participant } from '@/types/participant'

// Convert Participant to database row format
function participantToRow(participant: Participant): Omit<ParticipantRow, 'created_at' | 'updated_at'> {
  return {
    id: participant.id,
    timestamp: participant.timestamp,
    name: participant.basicDetails.name,
    organisation: participant.basicDetails.organisation,
    role: participant.basicDetails.role,
    focus_area: participant.basicDetails.focusArea,
    ai_hope: participant.answers.aiHope,
    ai_stuck: participant.answers.aiStuck,
    ai_tried: participant.answers.aiTried,
    workshop_success: participant.answers.workshopSuccess,
    summary: participant.analysis.summary,
    track: participant.analysis.track,
    readiness: participant.analysis.readiness,
    themes: participant.analysis.themes
  }
}

// Convert database row to Participant format
function rowToParticipant(row: ParticipantRow): Participant {
  return {
    id: row.id,
    timestamp: row.timestamp,
    basicDetails: {
      name: row.name,
      organisation: row.organisation,
      role: row.role,
      focusArea: row.focus_area as any
    },
    answers: {
      aiHope: row.ai_hope,
      aiStuck: row.ai_stuck,
      aiTried: row.ai_tried,
      workshopSuccess: row.workshop_success
    },
    analysis: {
      summary: row.summary,
      track: row.track as any,
      readiness: row.readiness as any,
      themes: row.themes as any[]
    }
  }
}

/**
 * Get all participants from Supabase
 * Sorted by timestamp descending (newest first)
 */
export async function getParticipants(): Promise<Participant[]> {
  try {
    const { data, error } = await supabase
      .from('participants')
      .select('*')
      .order('timestamp', { ascending: false })

    if (error) {
      console.error('Error fetching participants:', error)
      throw error
    }

    return data ? data.map(rowToParticipant) : []
  } catch (error) {
    console.error('Failed to get participants:', error)
    return []
  }
}

/**
 * Save a new participant to Supabase
 */
export async function saveParticipant(participant: Participant): Promise<void> {
  try {
    const row = participantToRow(participant)

    const { error } = await supabase
      .from('participants')
      .insert([row])

    if (error) {
      console.error('Error saving participant:', error)
      throw error
    }

    console.log('Participant saved successfully:', participant.id)
  } catch (error) {
    console.error('Failed to save participant:', error)
    throw error
  }
}

/**
 * Get a single participant by ID from Supabase
 */
export async function getParticipantById(id: string): Promise<Participant | undefined> {
  try {
    const { data, error } = await supabase
      .from('participants')
      .select('*')
      .eq('id', id)
      .single()

    if (error) {
      console.error('Error fetching participant:', error)
      return undefined
    }

    return data ? rowToParticipant(data) : undefined
  } catch (error) {
    console.error('Failed to get participant by ID:', error)
    return undefined
  }
}

/**
 * Export participants to CSV format
 * (Same as before, works with Participant array)
 */
export function exportToCSV(participants: Participant[]): string {
  const headers = [
    "ID",
    "Timestamp",
    "Name",
    "Organisation",
    "Role",
    "Focus Area",
    "AI Hope",
    "AI Stuck",
    "AI Tried",
    "Workshop Success",
    "Summary",
    "Track",
    "Readiness",
    "Themes"
  ]

  const escapeCSV = (value: string): string => {
    return `"${value.replace(/"/g, '""')}"`
  }

  const rows = participants.map(p => [
    p.id,
    p.timestamp,
    p.basicDetails.name,
    p.basicDetails.organisation,
    p.basicDetails.role,
    p.basicDetails.focusArea,
    escapeCSV(p.answers.aiHope),
    escapeCSV(p.answers.aiStuck),
    escapeCSV(p.answers.aiTried),
    escapeCSV(p.answers.workshopSuccess),
    escapeCSV(p.analysis.summary),
    p.analysis.track,
    p.analysis.readiness,
    escapeCSV(p.analysis.themes.join(", "))
  ])

  return [headers.join(","), ...rows.map(r => r.join(","))].join("\n")
}

/**
 * Check if Supabase is configured
 */
export function isSupabaseConfigured(): boolean {
  const url = import.meta.env.VITE_SUPABASE_URL
  const key = import.meta.env.VITE_SUPABASE_ANON_KEY
  return !!(url && key)
}
