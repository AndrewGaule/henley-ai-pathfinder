export type QuestionType = 'multiple-choice' | 'rating' | 'text';

export type SurveyType = 'pre-workshop' | 'post-workshop';

export interface BaseQuestion {
  id: string;
  text: string;
  type: QuestionType;
  required: boolean;
}

export interface MultipleChoiceQuestion extends BaseQuestion {
  type: 'multiple-choice';
  options: string[];
  allowMultiple?: boolean;
}

export interface RatingQuestion extends BaseQuestion {
  type: 'rating';
  scale: number; // e.g., 5 for 1-5 scale
  labels?: {
    low: string;
    high: string;
  };
}

export interface TextQuestion extends BaseQuestion {
  type: 'text';
  multiline?: boolean;
  placeholder?: string;
}

export type Question = MultipleChoiceQuestion | RatingQuestion | TextQuestion;

export interface SurveySection {
  id: string;
  title: string;
  description?: string;
  questions: Question[];
}

export interface Survey {
  id: string;
  type: SurveyType;
  title: string;
  description: string;
  sections: SurveySection[];
}

export interface Answer {
  questionId: string;
  value: string | string[] | number;
}

export interface SurveyResponse {
  id: string;
  surveyId: string;
  surveyType: SurveyType;
  participantName: string;
  participantEmail: string;
  participantOrganization?: string;
  answers: Answer[];
  timestamp: string;
  completionTime?: number; // in seconds
}

export interface SurveyStatistics {
  totalResponses: number;
  averageCompletionTime?: number;
  questionStats: {
    [questionId: string]: {
      totalAnswers: number;
      distribution?: { [key: string]: number }; // For multiple choice
      average?: number; // For ratings
      responses?: string[]; // For text
    };
  };
}
