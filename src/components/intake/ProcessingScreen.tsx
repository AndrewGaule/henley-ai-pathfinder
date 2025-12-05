import { Loader2 } from "lucide-react";

export function ProcessingScreen() {
  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <div className="text-center animate-fade-in">
        <Loader2 className="h-10 w-10 animate-spin text-primary mx-auto mb-4" />
        <h2 className="text-xl font-medium text-foreground mb-2">
          Analysing your responses
        </h2>
        <p className="text-muted-foreground">
          This will only take a moment...
        </p>
      </div>
    </div>
  );
}
