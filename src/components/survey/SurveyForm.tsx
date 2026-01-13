import { useState } from "react";
import { Survey, Answer, SurveyResponse } from "@/types/survey";
import { SurveySection } from "./SurveySection";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { ChevronLeft, ChevronRight, Check } from "lucide-react";
import { cn } from "@/lib/utils";

interface SurveyFormProps {
  survey: Survey;
  onSubmit: (response: SurveyResponse) => void;
  onCancel?: () => void;
}

export function SurveyForm({ survey, onSubmit, onCancel }: SurveyFormProps) {
  const [currentSectionIndex, setCurrentSectionIndex] = useState(0);
  const [answers, setAnswers] = useState<Answer[]>([]);
  const [startTime] = useState(Date.now());

  const currentSection = survey.sections[currentSectionIndex];
  const isFirstSection = currentSectionIndex === 0;
  const isLastSection = currentSectionIndex === survey.sections.length - 1;
  const progress = ((currentSectionIndex + 1) / survey.sections.length) * 100;

  const handleAnswerChange = (answer: Answer) => {
    setAnswers((prev) => {
      const existing = prev.findIndex((a) => a.questionId === answer.questionId);
      if (existing >= 0) {
        const updated = [...prev];
        updated[existing] = answer;
        return updated;
      }
      return [...prev, answer];
    });
  };

  const validateCurrentSection = (): boolean => {
    const requiredQuestions = currentSection.questions.filter((q) => q.required);
    const answeredRequired = requiredQuestions.every((q) => {
      const answer = answers.find((a) => a.questionId === q.id);
      if (!answer) return false;

      // Check if answer has a valid value
      if (Array.isArray(answer.value)) {
        return answer.value.length > 0;
      }
      return answer.value !== null && answer.value !== undefined && answer.value !== '';
    });

    return answeredRequired;
  };

  const handleNext = () => {
    if (!validateCurrentSection()) {
      alert("Please answer all required questions before continuing.");
      return;
    }

    if (isLastSection) {
      handleSubmit();
    } else {
      setCurrentSectionIndex((prev) => prev + 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handleBack = () => {
    if (!isFirstSection) {
      setCurrentSectionIndex((prev) => prev - 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handleSubmit = () => {
    if (!validateCurrentSection()) {
      alert("Please answer all required questions before submitting.");
      return;
    }

    // Get participant info from first section
    const nameAnswer = answers.find((a) => a.questionId === "name");
    const emailAnswer = answers.find((a) => a.questionId === "email");
    const orgAnswer = answers.find((a) => a.questionId === "organization");

    const response: SurveyResponse = {
      id: crypto.randomUUID(),
      surveyId: survey.id,
      surveyType: survey.type,
      participantName: (nameAnswer?.value as string) || "Anonymous",
      participantEmail: (emailAnswer?.value as string) || "",
      participantOrganization: orgAnswer?.value as string,
      answers,
      timestamp: new Date().toISOString(),
      completionTime: Math.floor((Date.now() - startTime) / 1000),
    };

    onSubmit(response);
  };

  return (
    <div className="min-h-screen bg-muted/30 py-8 px-4">
      <div className="max-w-3xl mx-auto space-y-6">
        {/* Header */}
        <div className="bg-card rounded-lg border p-6 space-y-4">
          <div>
            <h1 className="text-3xl font-bold text-foreground">{survey.title}</h1>
            <p className="text-muted-foreground mt-2">{survey.description}</p>
          </div>

          {/* Progress */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">
                Section {currentSectionIndex + 1} of {survey.sections.length}
              </span>
              <span className="font-medium">{Math.round(progress)}% Complete</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>

          {/* Section indicators */}
          <div className="flex gap-2 overflow-x-auto pb-2">
            {survey.sections.map((section, index) => (
              <button
                key={section.id}
                onClick={() => setCurrentSectionIndex(index)}
                className={cn(
                  "px-3 py-1.5 rounded-md text-xs font-medium whitespace-nowrap transition-colors",
                  index === currentSectionIndex
                    ? "bg-primary text-primary-foreground"
                    : index < currentSectionIndex
                    ? "bg-primary/20 text-primary"
                    : "bg-muted text-muted-foreground hover:bg-muted/80"
                )}
              >
                {section.title}
              </button>
            ))}
          </div>
        </div>

        {/* Current Section */}
        <SurveySection
          section={currentSection}
          answers={answers}
          onAnswerChange={handleAnswerChange}
        />

        {/* Navigation */}
        <div className="flex items-center justify-between gap-4 bg-card rounded-lg border p-4">
          <Button
            variant="outline"
            onClick={handleBack}
            disabled={isFirstSection}
            className="gap-2"
          >
            <ChevronLeft className="h-4 w-4" />
            Back
          </Button>

          <div className="flex gap-2">
            {onCancel && (
              <Button variant="ghost" onClick={onCancel}>
                Cancel
              </Button>
            )}
            <Button onClick={handleNext} className="gap-2">
              {isLastSection ? (
                <>
                  <Check className="h-4 w-4" />
                  Submit Survey
                </>
              ) : (
                <>
                  Next
                  <ChevronRight className="h-4 w-4" />
                </>
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
