import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { ConversationalAnswers } from "@/types/participant";
import { ArrowRight, Send, Mic, MicOff } from "lucide-react";
import { useSpeechRecognition } from "@/hooks/use-speech-recognition";

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

  // Voice input hook
  const {
    isListening,
    isSupported,
    transcript,
    startListening,
    stopListening,
    resetTranscript,
    error: voiceError
  } = useSpeechRecognition({
    onResult: (text) => {
      // Update the current answer with voice transcript
      setAnswers({ ...answers, [currentQuestion.key]: text });
    },
    continuous: false,
    interimResults: true
  });

  // Reset transcript when moving to next question
  useEffect(() => {
    resetTranscript();
  }, [currentIndex]);

  const toggleVoiceInput = () => {
    if (isListening) {
      stopListening();
    } else {
      startListening();
    }
  };

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
            <div className="relative">
              <Textarea
                id="answer"
                value={answers[currentQuestion.key]}
                onChange={(e) => {
                  setAnswers({ ...answers, [currentQuestion.key]: e.target.value });
                  setError("");
                }}
                onKeyDown={handleKeyDown}
                placeholder={isListening ? "Listening... speak now" : "Type your answer here or click the microphone to speak"}
                className={`min-h-[140px] resize-none pr-12 ${error ? "border-destructive" : ""} ${isListening ? "border-primary ring-2 ring-primary/20" : ""}`}
                autoFocus
              />
              {isSupported && (
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={toggleVoiceInput}
                  className={`absolute right-2 top-2 ${isListening ? "text-primary animate-pulse" : "text-muted-foreground hover:text-foreground"}`}
                  title={isListening ? "Stop recording" : "Start voice input"}
                >
                  {isListening ? (
                    <MicOff className="h-5 w-5" />
                  ) : (
                    <Mic className="h-5 w-5" />
                  )}
                </Button>
              )}
            </div>
            {error && <p className="text-sm text-destructive">{error}</p>}
            {voiceError && <p className="text-sm text-destructive">{voiceError}</p>}
            {isListening && (
              <p className="text-sm text-primary animate-pulse flex items-center gap-2">
                <span className="inline-block w-2 h-2 bg-primary rounded-full animate-ping"></span>
                Listening... speak your answer
              </p>
            )}
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
            {isSupported ? (
              <>Press ⌘ + Enter to continue • Click <Mic className="inline h-3 w-3" /> to use voice input</>
            ) : (
              "Press ⌘ + Enter to continue"
            )}
          </p>
        </div>
      </div>
    </div>
  );
}
