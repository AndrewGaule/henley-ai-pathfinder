import { useState } from "react";
import { WelcomeScreen } from "@/components/intake/WelcomeScreen";
import { BasicDetailsForm } from "@/components/intake/BasicDetailsForm";
import { ConversationalQuestions } from "@/components/intake/ConversationalQuestions";
import { ProcessingScreen } from "@/components/intake/ProcessingScreen";
import { ResultScreen } from "@/components/intake/ResultScreen";
import { analyzeParticipant } from "@/lib/ai-service";
import { saveParticipant, isSupabaseConfigured } from "@/lib/supabase-storage";
import { saveParticipant as saveParticipantLocal } from "@/lib/storage";
import type { BasicDetails, ConversationalAnswers, AIAnalysis } from "@/types/participant";

type Step = "welcome" | "details" | "questions" | "processing" | "result";

const Index = () => {
  const [step, setStep] = useState<Step>("welcome");
  const [basicDetails, setBasicDetails] = useState<BasicDetails | null>(null);
  const [answers, setAnswers] = useState<ConversationalAnswers | null>(null);
  const [analysis, setAnalysis] = useState<AIAnalysis | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleStart = () => {
    setStep("details");
  };

  const handleDetailsSubmit = (details: BasicDetails) => {
    setBasicDetails(details);
    setStep("questions");
  };

  const handleQuestionsSubmit = async (conversationalAnswers: ConversationalAnswers) => {
    setAnswers(conversationalAnswers);
    setStep("processing");
    setError(null);

    try {
      const result = await analyzeParticipant(basicDetails!, conversationalAnswers);
      setAnalysis(result);

      const participant = {
        id: crypto.randomUUID(),
        timestamp: new Date().toISOString(),
        basicDetails: basicDetails!,
        answers: conversationalAnswers,
        analysis: result,
      };

      // Try to save to Supabase first, fallback to localStorage
      if (isSupabaseConfigured()) {
        try {
          await saveParticipant(participant);
          console.log('Participant saved to Supabase');
        } catch (supabaseError) {
          console.error('Supabase save failed, falling back to localStorage:', supabaseError);
          saveParticipantLocal(participant);
        }
      } else {
        console.log('Supabase not configured, saving to localStorage');
        saveParticipantLocal(participant);
      }

      setStep("result");
    } catch (err) {
      setError("Something went wrong. Please try again.");
      setStep("questions");
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {step === "welcome" && <WelcomeScreen onStart={handleStart} />}
      {step === "details" && <BasicDetailsForm onSubmit={handleDetailsSubmit} />}
      {step === "questions" && (
        <ConversationalQuestions onSubmit={handleQuestionsSubmit} />
      )}
      {step === "processing" && <ProcessingScreen />}
      {step === "result" && analysis && <ResultScreen analysis={analysis} />}
      
      {error && (
        <div className="fixed bottom-4 left-1/2 -translate-x-1/2 bg-destructive text-destructive-foreground px-4 py-2 rounded-md">
          {error}
        </div>
      )}
    </div>
  );
};

export default Index;
