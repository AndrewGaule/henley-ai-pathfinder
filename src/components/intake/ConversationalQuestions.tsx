import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { ConversationalAnswers } from "@/types/participant";
import { ArrowRight, Send } from "lucide-react";

const QUESTIONS = [
  {
    key: "aiHope",
    question: "What is the main way you hope AI can help your organisation in the next twelve months?"
  },
  {
    key: "aiStuck",
    question: "Where do you feel most stuck today with AI?"
  },
  {
    key: "aiTried",
    question: "What have you already tried, if anything, with AI in your team or organisation?"
  },
  {
    key: "workshopSuccess",
    question: "What would success from this workshop look like for you personally?"
  }
] as const;

interface ConversationalQuestionsProps {
  onSubmit: (answers: ConversationalAnswers) => void;
}

export function ConversationalQuestions({ onSubmit }: ConversationalQuestionsProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<ConversationalAnswers>({
    aiHope: "",
    aiStuck: "",
    aiTried: "",
    workshopSuccess: ""
  });
  const [error, setError] = useState("");

  const currentQuestion = QUESTIONS[currentIndex];
  const isLastQuestion = currentIndex === QUESTIONS.length - 1;

  const handleNext = () => {
    const currentAnswer = answers[currentQuestion.key].trim();
    if (!currentAnswer) {
      setError("Please provide an answer before continuing");
      return;
    }
    setError("");

    if (isLastQuestion) {
      onSubmit(answers);
    } else {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && e.metaKey) {
      handleNext();
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <div className="max-w-lg w-full animate-fade-in" key={currentIndex}>
        <div className="mb-8">
          <p className="text-sm text-muted-foreground mb-2">
            Question {currentIndex + 1} of {QUESTIONS.length}
          </p>
          <div className="flex gap-1 mb-6">
            {QUESTIONS.map((_, i) => (
              <div 
                key={i} 
                className={`h-1 flex-1 rounded-full transition-colors ${
                  i <= currentIndex ? "bg-primary" : "bg-muted"
                }`}
              />
            ))}
          </div>
          <h2 className="text-xl md:text-2xl font-medium text-foreground leading-relaxed">
            {currentQuestion.question}
          </h2>
        </div>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="answer" className="sr-only">Your answer</Label>
            <Textarea
              id="answer"
              value={answers[currentQuestion.key]}
              onChange={(e) => {
                setAnswers({ ...answers, [currentQuestion.key]: e.target.value });
                setError("");
              }}
              onKeyDown={handleKeyDown}
              placeholder="Type your answer here..."
              className={`min-h-[140px] resize-none ${error ? "border-destructive" : ""}`}
              autoFocus
            />
            {error && <p className="text-sm text-destructive">{error}</p>}
          </div>

          <Button onClick={handleNext} className="w-full gap-2">
            {isLastQuestion ? (
              <>
                Submit
                <Send className="h-4 w-4" />
              </>
            ) : (
              <>
                Continue
                <ArrowRight className="h-4 w-4" />
              </>
            )}
          </Button>

          <p className="text-xs text-muted-foreground text-center">
            Press ⌘ + Enter to continue
          </p>
        </div>
      </div>
    </div>
  );
}
