import { useMemo } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { SurveyResponse, SurveyType } from "@/types/survey";

interface SurveyStatisticsProps {
  responses: SurveyResponse[];
  surveyType?: SurveyType;
}

export function SurveyStatistics({ responses, surveyType }: SurveyStatisticsProps) {
  const statistics = useMemo(() => {
    if (responses.length === 0) return null;

    // Calculate average completion time
    const completionTimes = responses
      .filter((r) => r.completionTime !== undefined)
      .map((r) => r.completionTime as number);

    const avgCompletionTime =
      completionTimes.length > 0
        ? completionTimes.reduce((a, b) => a + b, 0) / completionTimes.length
        : 0;

    // Collect all question statistics
    const questionStats: {
      [questionId: string]: {
        values: (string | number | string[])[];
        numericValues: number[];
        distribution: { [key: string]: number };
      };
    } = {};

    responses.forEach((response) => {
      response.answers.forEach((answer) => {
        if (!questionStats[answer.questionId]) {
          questionStats[answer.questionId] = {
            values: [],
            numericValues: [],
            distribution: {},
          };
        }

        questionStats[answer.questionId].values.push(answer.value);

        if (typeof answer.value === "number") {
          questionStats[answer.questionId].numericValues.push(answer.value);
          const key = String(answer.value);
          questionStats[answer.questionId].distribution[key] =
            (questionStats[answer.questionId].distribution[key] || 0) + 1;
        } else if (Array.isArray(answer.value)) {
          answer.value.forEach((val) => {
            questionStats[answer.questionId].distribution[val] =
              (questionStats[answer.questionId].distribution[val] || 0) + 1;
          });
        } else if (typeof answer.value === "string") {
          questionStats[answer.questionId].distribution[answer.value] =
            (questionStats[answer.questionId].distribution[answer.value] || 0) + 1;
        }
      });
    });

    // Calculate top answers for key questions
    const topAnswers: {
      questionId: string;
      label: string;
      items: { label: string; count: number; percentage: number }[];
    }[] = [];

    // Pre-workshop key questions
    if (!surveyType || surveyType === "pre-workshop") {
      if (questionStats["ai-familiarity"]?.numericValues.length > 0) {
        const avg =
          questionStats["ai-familiarity"].numericValues.reduce((a, b) => a + b, 0) /
          questionStats["ai-familiarity"].numericValues.length;
        topAnswers.push({
          questionId: "ai-familiarity",
          label: "Average AI Familiarity",
          items: [{ label: `${avg.toFixed(1)} / 5`, count: 0, percentage: (avg / 5) * 100 }],
        });
      }

      if (questionStats["role"]?.distribution) {
        const roleItems = Object.entries(questionStats["role"].distribution)
          .map(([label, count]) => ({
            label,
            count: count as number,
            percentage: ((count as number) / responses.length) * 100,
          }))
          .sort((a, b) => b.count - a.count)
          .slice(0, 5);

        if (roleItems.length > 0) {
          topAnswers.push({
            questionId: "role",
            label: "Top Roles",
            items: roleItems,
          });
        }
      }
    }

    // Post-workshop key questions
    if (!surveyType || surveyType === "post-workshop") {
      if (questionStats["overall-satisfaction"]?.numericValues.length > 0) {
        const avg =
          questionStats["overall-satisfaction"].numericValues.reduce((a, b) => a + b, 0) /
          questionStats["overall-satisfaction"].numericValues.length;
        topAnswers.push({
          questionId: "overall-satisfaction",
          label: "Average Satisfaction",
          items: [{ label: `${avg.toFixed(1)} / 5`, count: 0, percentage: (avg / 5) * 100 }],
        });
      }

      if (questionStats["knowledge-gained"]?.numericValues.length > 0) {
        const avg =
          questionStats["knowledge-gained"].numericValues.reduce((a, b) => a + b, 0) /
          questionStats["knowledge-gained"].numericValues.length;
        topAnswers.push({
          questionId: "knowledge-gained",
          label: "Average Knowledge Gain",
          items: [{ label: `${avg.toFixed(1)} / 5`, count: 0, percentage: (avg / 5) * 100 }],
        });
      }

      if (questionStats["recommendation"]?.numericValues.length > 0) {
        const avg =
          questionStats["recommendation"].numericValues.reduce((a, b) => a + b, 0) /
          questionStats["recommendation"].numericValues.length;
        topAnswers.push({
          questionId: "recommendation",
          label: "Average Recommendation Score",
          items: [{ label: `${avg.toFixed(1)} / 5`, count: 0, percentage: (avg / 5) * 100 }],
        });
      }
    }

    return {
      avgCompletionTime,
      topAnswers,
    };
  }, [responses, surveyType]);

  if (!statistics || responses.length === 0) {
    return null;
  }

  const formatDuration = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes}m ${remainingSeconds}s`;
  };

  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
      {/* Average Completion Time */}
      {statistics.avgCompletionTime > 0 && (
        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Avg. Completion Time</CardDescription>
            <CardTitle className="text-2xl">
              {formatDuration(statistics.avgCompletionTime)}
            </CardTitle>
          </CardHeader>
        </Card>
      )}

      {/* Top Answers */}
      {statistics.topAnswers.map((stat) => (
        <Card key={stat.questionId}>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">{stat.label}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {stat.items.map((item, index) => (
              <div key={index} className="space-y-1">
                <div className="flex items-center justify-between text-sm">
                  <span className="font-medium truncate">{item.label}</span>
                  {item.count > 0 && (
                    <span className="text-muted-foreground ml-2">{item.count}</span>
                  )}
                </div>
                {item.percentage > 0 && (
                  <Progress value={item.percentage} className="h-2" />
                )}
              </div>
            ))}
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
