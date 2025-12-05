import { AIAnalysis } from "@/types/participant";
import { CheckCircle, Target, Gauge, Tags } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface ResultScreenProps {
  analysis: AIAnalysis;
}

export function ResultScreen({ analysis }: ResultScreenProps) {
  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <div className="max-w-xl w-full animate-fade-in">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center h-14 w-14 rounded-full bg-accent mb-4">
            <CheckCircle className="h-7 w-7 text-primary" />
          </div>
          <h1 className="text-2xl md:text-3xl font-semibold text-foreground mb-2">
            Thank you, here is what we heard
          </h1>
        </div>

        <Card className="mb-6">
          <CardContent className="pt-6">
            <p className="text-foreground leading-relaxed">
              {analysis.summary}
            </p>
          </CardContent>
        </Card>

        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardContent className="pt-5 pb-5">
              <div className="flex items-center gap-2 text-muted-foreground mb-2">
                <Target className="h-4 w-4" />
                <span className="text-sm font-medium">Suggested track</span>
              </div>
              <p className="font-medium text-foreground">{analysis.track}</p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-5 pb-5">
              <div className="flex items-center gap-2 text-muted-foreground mb-2">
                <Gauge className="h-4 w-4" />
                <span className="text-sm font-medium">AI readiness</span>
              </div>
              <p className="font-medium text-foreground">{analysis.readiness}</p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-5 pb-5">
              <div className="flex items-center gap-2 text-muted-foreground mb-2">
                <Tags className="h-4 w-4" />
                <span className="text-sm font-medium">Priority themes</span>
              </div>
              <div className="flex flex-wrap gap-1">
                {analysis.themes.map((theme) => (
                  <Badge key={theme} variant="secondary" className="text-xs">
                    {theme}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        <p className="text-center text-muted-foreground text-sm mt-8">
          The Henley team will use this to tailor the workshop experience.
        </p>
      </div>
    </div>
  );
}
