import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle2 } from "lucide-react";
import { SurveyType } from "@/types/survey";

interface SurveyCompleteProps {
  surveyType: SurveyType;
  onClose?: () => void;
}

export function SurveyComplete({ surveyType, onClose }: SurveyCompleteProps) {
  const isPreWorkshop = surveyType === "pre-workshop";

  return (
    <div className="min-h-screen bg-muted/30 flex items-center justify-center p-4">
      <Card className="max-w-lg w-full">
        <CardHeader className="text-center space-y-4">
          <div className="flex justify-center">
            <div className="rounded-full bg-green-100 dark:bg-green-900/20 p-3">
              <CheckCircle2 className="h-12 w-12 text-green-600 dark:text-green-400" />
            </div>
          </div>
          <div>
            <CardTitle className="text-2xl">Thank You!</CardTitle>
            <CardDescription className="text-base mt-2">
              {isPreWorkshop
                ? "Your pre-workshop survey has been submitted successfully."
                : "Your post-workshop survey has been submitted successfully."}
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="bg-muted/50 rounded-lg p-4 text-sm text-muted-foreground">
            {isPreWorkshop ? (
              <p>
                We appreciate you taking the time to share your AI knowledge and expectations with
                us. This information will help us tailor the workshop to better meet your needs.
                We look forward to seeing you at the workshop!
              </p>
            ) : (
              <p>
                We appreciate your valuable feedback about the workshop. Your insights will help us
                improve future sessions and ensure we continue to deliver high-quality AI business
                change workshops. Thank you for your participation!
              </p>
            )}
          </div>

          {onClose && (
            <Button onClick={onClose} className="w-full">
              Close
            </Button>
          )}

          <div className="text-center text-xs text-muted-foreground">
            If you have any questions, please contact the workshop organizers.
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
