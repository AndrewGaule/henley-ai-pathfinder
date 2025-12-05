export type FocusArea = 
  | "Strategy and leadership"
  | "Operations and efficiency"
  | "Innovation and new business models"
  | "Data and platforms"
  | "Investment and ventures";

export type Track = FocusArea;

export type Readiness = "Early" | "Experimenting" | "Scaling";

export type Theme = 
  | "Cost and productivity"
  | "New revenue"
  | "Customer experience"
  | "Risk and regulation"
  | "Talent and skills";

export interface BasicDetails {
  name: string;
  organisation: string;
  role: string;
  focusArea: FocusArea;
}

export interface ConversationalAnswers {
  aiHope: string;
  aiStuck: string;
  aiTried: string;
  workshopSuccess: string;
}

export interface AIAnalysis {
  summary: string;
  track: Track;
  readiness: Readiness;
  themes: Theme[];
}

export interface Participant {
  id: string;
  timestamp: string;
  basicDetails: BasicDetails;
  answers: ConversationalAnswers;
  analysis: AIAnalysis;
}
