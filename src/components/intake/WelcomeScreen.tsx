import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

interface WelcomeScreenProps {
  onStart: () => void;
}

export function WelcomeScreen({ onStart }: WelcomeScreenProps) {
  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <div className="max-w-xl w-full text-center animate-fade-in">
        <div className="mb-8">
          <div className="inline-block px-4 py-1.5 bg-accent text-accent-foreground rounded-full text-sm font-medium mb-6">
            Henley Business School
          </div>
          <h1 className="text-3xl md:text-4xl font-semibold text-foreground mb-4 leading-tight">
            AI Workshop Intake Assistant
          </h1>
          <p className="text-lg text-muted-foreground leading-relaxed">
            In about three minutes we will understand your AI priorities and suggest the right track for you. Your answers will be shared with the Henley programme team.
          </p>
        </div>
        
        <Button 
          onClick={onStart} 
          size="lg" 
          className="gap-2 px-8"
        >
          Start
          <ArrowRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
