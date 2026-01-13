import { SurveySection as SurveySectionType, Answer } from "@/types/survey";
import { QuestionRenderer } from "./QuestionRenderer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

interface SurveySectionProps {
  section: SurveySectionType;
  answers: Answer[];
  onAnswerChange: (answer: Answer) => void;
}

export function SurveySection({
  section,
  answers,
  onAnswerChange,
}: SurveySectionProps) {
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>{section.title}</CardTitle>
        {section.description && (
          <CardDescription>{section.description}</CardDescription>
        )}
      </CardHeader>
      <CardContent className="space-y-6">
        {section.questions.map((question) => (
          <QuestionRenderer
            key={question.id}
            question={question}
            answer={answers.find((a) => a.questionId === question.id)}
            onChange={onAnswerChange}
          />
        ))}
      </CardContent>
    </Card>
  );
}
