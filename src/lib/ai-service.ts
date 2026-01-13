import { BasicDetails, ConversationalAnswers, AIAnalysis, Track, Readiness, Theme } from "@/types/participant";

// Mock AI service - replace with real API call when backend is connected
export async function analyzeParticipant(
  details: BasicDetails,
  answers: ConversationalAnswers
): Promise<AIAnalysis> {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 2000));

  // Determine track based on focus area
  const track: Track = details.focusArea;

  // Determine readiness based on what they've tried
  let readiness: Readiness = "Early";
  const triedAnswer = answers.aiTried.toLowerCase();
  if (triedAnswer.includes("scaling") || triedAnswer.includes("production") || triedAnswer.includes("deployed")) {
    readiness = "Scaling";
  } else if (triedAnswer.includes("pilot") || triedAnswer.includes("experiment") || triedAnswer.includes("tried") || triedAnswer.includes("tested")) {
    readiness = "Experimenting";
  }

  // Determine themes based on answers
  const allText = `${answers.aiHope} ${answers.aiStuck} ${answers.workshopSuccess}`.toLowerCase();
  const themes: Theme[] = [];
  
  if (allText.includes("cost") || allText.includes("efficien") || allText.includes("productiv")) {
    themes.push("Cost and productivity");
  }
  if (allText.includes("revenue") || allText.includes("growth") || allText.includes("sales")) {
    themes.push("New revenue");
  }
  if (allText.includes("customer") || allText.includes("experience") || allText.includes("service")) {
    themes.push("Customer experience");
  }
  if (allText.includes("risk") || allText.includes("regulat") || allText.includes("complian")) {
    themes.push("Risk and regulation");
  }
  if (allText.includes("talent") || allText.includes("skill") || allText.includes("team") || allText.includes("people")) {
    themes.push("Talent and skills");
  }

  // Ensure at least one theme
  if (themes.length === 0) {
    themes.push("Cost and productivity");
  }

  // Limit to 3 themes
  const finalThemes = themes.slice(0, 3);

  // Helper function to safely extract first sentence or truncate text
  const getFirstSentenceOrTruncate = (text: string, maxLength: number = 100): string => {
    const trimmed = text.trim();
    const firstSentence = trimmed.split(/[.!?]/)[0];
    if (firstSentence.length > 0 && firstSentence.length <= maxLength) {
      return firstSentence.toLowerCase();
    }
    // If no sentence delimiter or too long, truncate
    return trimmed.length > maxLength
      ? trimmed.substring(0, maxLength).toLowerCase() + '...'
      : trimmed.toLowerCase();
  };

  // Generate summary
  const summary = `${details.name} from ${details.organisation} is a ${details.role} focused on ${details.focusArea.toLowerCase()}. They are seeking to leverage AI for ${getFirstSentenceOrTruncate(answers.aiHope)}. Their primary challenge involves ${getFirstSentenceOrTruncate(answers.aiStuck)}, and they measure success by ${getFirstSentenceOrTruncate(answers.workshopSuccess)}.`;

  return {
    summary,
    track,
    readiness,
    themes: finalThemes
  };
}
