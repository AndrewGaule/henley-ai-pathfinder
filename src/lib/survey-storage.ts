import { SurveyResponse, SurveyStatistics } from "@/types/survey";

const STORAGE_KEY = "survey_responses";
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3001/api";

// LocalStorage functions (for development/fallback)
export function saveSurveyResponseLocally(response: SurveyResponse): void {
  try {
    const existing = getSurveyResponsesLocally();
    existing.push(response);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(existing));
  } catch (error) {
    console.error("Failed to save survey response locally:", error);
    throw error;
  }
}

export function getSurveyResponsesLocally(): SurveyResponse[] {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error("Failed to get survey responses locally:", error);
    return [];
  }
}

export function clearSurveyResponsesLocally(): void {
  localStorage.removeItem(STORAGE_KEY);
}

// API functions (for production with backend)
export async function saveSurveyResponse(response: SurveyResponse): Promise<void> {
  // Try API first, fallback to localStorage
  try {
    const apiResponse = await fetch(`${API_URL}/surveys/responses`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(response),
    });

    if (!apiResponse.ok) {
      throw new Error(`API error: ${apiResponse.statusText}`);
    }
  } catch (error) {
    console.warn("API not available, using localStorage:", error);
    saveSurveyResponseLocally(response);
  }
}

export async function getSurveyResponses(): Promise<SurveyResponse[]> {
  // Try API first, fallback to localStorage
  try {
    const response = await fetch(`${API_URL}/surveys/responses`);

    if (!response.ok) {
      throw new Error(`API error: ${response.statusText}`);
    }

    const data = await response.json();
    return data.responses || [];
  } catch (error) {
    console.warn("API not available, using localStorage:", error);
    return getSurveyResponsesLocally();
  }
}

export async function getSurveyResponsesByType(type: "pre-workshop" | "post-workshop"): Promise<SurveyResponse[]> {
  const responses = await getSurveyResponses();
  return responses.filter((r) => r.surveyType === type);
}

export async function getSurveyStatistics(): Promise<SurveyStatistics> {
  const responses = await getSurveyResponses();

  const totalResponses = responses.length;
  const completionTimes = responses
    .filter((r) => r.completionTime !== undefined)
    .map((r) => r.completionTime as number);

  const averageCompletionTime =
    completionTimes.length > 0
      ? completionTimes.reduce((a, b) => a + b, 0) / completionTimes.length
      : undefined;

  // Calculate question statistics
  const questionStats: SurveyStatistics["questionStats"] = {};

  responses.forEach((response) => {
    response.answers.forEach((answer) => {
      if (!questionStats[answer.questionId]) {
        questionStats[answer.questionId] = {
          totalAnswers: 0,
          distribution: {},
        };
      }

      questionStats[answer.questionId].totalAnswers++;

      // Handle different answer types
      if (typeof answer.value === "number") {
        // Rating question
        if (!questionStats[answer.questionId].average) {
          questionStats[answer.questionId].average = 0;
        }
        const currentAvg = questionStats[answer.questionId].average || 0;
        const count = questionStats[answer.questionId].totalAnswers;
        questionStats[answer.questionId].average =
          (currentAvg * (count - 1) + answer.value) / count;
      } else if (Array.isArray(answer.value)) {
        // Multiple choice (multiple answers)
        answer.value.forEach((val) => {
          if (!questionStats[answer.questionId].distribution) {
            questionStats[answer.questionId].distribution = {};
          }
          questionStats[answer.questionId].distribution![val] =
            (questionStats[answer.questionId].distribution![val] || 0) + 1;
        });
      } else if (typeof answer.value === "string") {
        // Could be single choice or text
        // For single choice, track distribution
        const stats = questionStats[answer.questionId];
        if (!stats.distribution) {
          stats.distribution = {};
        }
        stats.distribution[answer.value] =
          (stats.distribution[answer.value] || 0) + 1;

        // Also collect text responses
        if (!stats.responses) {
          stats.responses = [];
        }
        stats.responses.push(answer.value);
      }
    });
  });

  return {
    totalResponses,
    averageCompletionTime,
    questionStats,
  };
}

export function exportToCSV(responses: SurveyResponse[], surveyType: "pre-workshop" | "post-workshop"): string {
  if (responses.length === 0) {
    return "";
  }

  // Get all unique question IDs
  const questionIds = new Set<string>();
  responses.forEach((response) => {
    response.answers.forEach((answer) => {
      questionIds.add(answer.questionId);
    });
  });

  // Create header row
  const headers = [
    "Response ID",
    "Timestamp",
    "Participant Name",
    "Participant Email",
    "Organization",
    "Completion Time (seconds)",
    ...Array.from(questionIds),
  ];

  // Create data rows
  const rows = responses.map((response) => {
    const row = [
      response.id,
      response.timestamp,
      response.participantName,
      response.participantEmail,
      response.participantOrganization || "",
      response.completionTime?.toString() || "",
    ];

    // Add answers in the same order as headers
    questionIds.forEach((questionId) => {
      const answer = response.answers.find((a) => a.questionId === questionId);
      if (answer) {
        if (Array.isArray(answer.value)) {
          row.push(answer.value.join("; "));
        } else {
          row.push(String(answer.value));
        }
      } else {
        row.push("");
      }
    });

    return row;
  });

  // Combine headers and rows
  const csvContent = [headers, ...rows]
    .map((row) =>
      row.map((cell) => {
        // Escape quotes and wrap in quotes if contains comma, quote, or newline
        const cellStr = String(cell);
        if (cellStr.includes(",") || cellStr.includes('"') || cellStr.includes("\n")) {
          return `"${cellStr.replace(/"/g, '""')}"`;
        }
        return cellStr;
      }).join(",")
    )
    .join("\n");

  return csvContent;
}

export function downloadCSV(responses: SurveyResponse[], surveyType: "pre-workshop" | "post-workshop"): void {
  const csv = exportToCSV(responses, surveyType);
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const link = document.createElement("a");
  const url = URL.createObjectURL(blob);

  link.setAttribute("href", url);
  link.setAttribute("download", `${surveyType}-survey-responses-${new Date().toISOString().split("T")[0]}.csv`);
  link.style.visibility = "hidden";

  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
