import { Participant } from "@/types/participant";

const STORAGE_KEY = "henley_participants";

export function getParticipants(): Participant[] {
  const data = localStorage.getItem(STORAGE_KEY);
  if (!data) return [];
  try {
    return JSON.parse(data);
  } catch {
    return [];
  }
}

export function saveParticipant(participant: Participant): void {
  const participants = getParticipants();
  participants.unshift(participant);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(participants));
}

export function getParticipantById(id: string): Participant | undefined {
  return getParticipants().find(p => p.id === id);
}

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
  ];

  const rows = participants.map(p => [
    p.id,
    p.timestamp,
    p.basicDetails.name,
    p.basicDetails.organisation,
    p.basicDetails.role,
    p.basicDetails.focusArea,
    `"${p.answers.aiHope.replace(/"/g, '""')}"`,
    `"${p.answers.aiStuck.replace(/"/g, '""')}"`,
    `"${p.answers.aiTried.replace(/"/g, '""')}"`,
    `"${p.answers.workshopSuccess.replace(/"/g, '""')}"`,
    `"${p.analysis.summary.replace(/"/g, '""')}"`,
    p.analysis.track,
    p.analysis.readiness,
    `"${p.analysis.themes.join(", ")}"`
  ]);

  return [headers.join(","), ...rows.map(r => r.join(","))].join("\n");
}
