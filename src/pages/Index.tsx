import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ClipboardList, CheckCircle } from "lucide-react";

const Index = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-muted/30 flex items-center justify-center p-4">
      <div className="max-w-4xl w-full space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold text-foreground">
            AI Business Change Workshop Survey
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Welcome! Please select the appropriate survey based on your workshop participation.
          </p>
        </div>

        {/* Survey Options */}
        <div className="grid md:grid-cols-2 gap-6">
          {/* Pre-Workshop Survey */}
          <Card className="hover:shadow-lg transition-shadow cursor-pointer group">
            <CardHeader>
              <div className="flex items-center gap-3 mb-2">
                <div className="rounded-full bg-primary/10 p-3 group-hover:bg-primary/20 transition-colors">
                  <ClipboardList className="h-6 w-6 text-primary" />
                </div>
                <CardTitle className="text-2xl">Pre-Workshop Survey</CardTitle>
              </div>
              <CardDescription className="text-base">
                Complete this survey before attending the workshop
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Help us understand your current AI knowledge, expectations, and goals for the
                workshop. This will allow us to tailor the content to better meet your needs.
              </p>
              <ul className="text-sm text-muted-foreground space-y-1 list-disc list-inside">
                <li>Takes approximately 10-15 minutes</li>
                <li>Covers AI knowledge and experience</li>
                <li>Helps personalize your workshop experience</li>
              </ul>
              <Button
                onClick={() => navigate("/survey/pre-workshop")}
                className="w-full"
                size="lg"
              >
                Start Pre-Workshop Survey
              </Button>
            </CardContent>
          </Card>

          {/* Post-Workshop Survey */}
          <Card className="hover:shadow-lg transition-shadow cursor-pointer group">
            <CardHeader>
              <div className="flex items-center gap-3 mb-2">
                <div className="rounded-full bg-green-100 dark:bg-green-900/20 p-3 group-hover:bg-green-200 dark:group-hover:bg-green-900/30 transition-colors">
                  <CheckCircle className="h-6 w-6 text-green-600 dark:text-green-400" />
                </div>
                <CardTitle className="text-2xl">Post-Workshop Survey</CardTitle>
              </div>
              <CardDescription className="text-base">
                Complete this survey after attending the workshop
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Share your feedback about the workshop experience, what you learned, and how you
                plan to apply your new knowledge. Your insights help us improve future workshops.
              </p>
              <ul className="text-sm text-muted-foreground space-y-1 list-disc list-inside">
                <li>Takes approximately 10-15 minutes</li>
                <li>Feedback on content and delivery</li>
                <li>Helps improve future workshops</li>
              </ul>
              <Button
                onClick={() => navigate("/survey/post-workshop")}
                className="w-full"
                size="lg"
                variant="secondary"
              >
                Start Post-Workshop Survey
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Footer */}
        <div className="text-center">
          <p className="text-sm text-muted-foreground">
            Questions? Contact the workshop organizers for assistance.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Index;
