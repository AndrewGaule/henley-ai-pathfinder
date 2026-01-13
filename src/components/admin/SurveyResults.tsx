import { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download, RefreshCw } from "lucide-react";
import { SurveyResponse } from "@/types/survey";
import { getSurveyResponses, downloadCSV } from "@/lib/survey-storage";
import { SurveyResponsesTable } from "./SurveyResponsesTable";
import { SurveyStatistics } from "./SurveyStatistics";

export function SurveyResults() {
  const [responses, setResponses] = useState<SurveyResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"all" | "pre-workshop" | "post-workshop">("all");

  const loadResponses = async () => {
    setLoading(true);
    try {
      const data = await getSurveyResponses();
      setResponses(data);
    } catch (error) {
      console.error("Failed to load survey responses:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadResponses();
  }, []);

  const filteredResponses = responses.filter((r) => {
    if (activeTab === "all") return true;
    return r.surveyType === activeTab;
  });

  const preWorkshopResponses = responses.filter((r) => r.surveyType === "pre-workshop");
  const postWorkshopResponses = responses.filter((r) => r.surveyType === "post-workshop");

  const handleExportCSV = () => {
    if (activeTab === "all") {
      downloadCSV(responses, "pre-workshop");
    } else {
      downloadCSV(filteredResponses, activeTab);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Survey Results</h2>
          <p className="text-sm text-muted-foreground">
            View and analyze workshop survey responses
          </p>
        </div>
        <div className="flex gap-2">
          <Button onClick={loadResponses} variant="outline" size="sm" className="gap-2">
            <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
            Refresh
          </Button>
          <Button
            onClick={handleExportCSV}
            variant="outline"
            size="sm"
            className="gap-2"
            disabled={filteredResponses.length === 0}
          >
            <Download className="h-4 w-4" />
            Export CSV
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Total Responses</CardDescription>
            <CardTitle className="text-3xl">{responses.length}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Pre-Workshop</CardDescription>
            <CardTitle className="text-3xl">{preWorkshopResponses.length}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Post-Workshop</CardDescription>
            <CardTitle className="text-3xl">{postWorkshopResponses.length}</CardTitle>
          </CardHeader>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as typeof activeTab)}>
        <TabsList className="grid w-full max-w-md grid-cols-3">
          <TabsTrigger value="all">All ({responses.length})</TabsTrigger>
          <TabsTrigger value="pre-workshop">
            Pre-Workshop ({preWorkshopResponses.length})
          </TabsTrigger>
          <TabsTrigger value="post-workshop">
            Post-Workshop ({postWorkshopResponses.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-4">
          <SurveyStatistics responses={responses} />
          <SurveyResponsesTable responses={responses} onRefresh={loadResponses} />
        </TabsContent>

        <TabsContent value="pre-workshop" className="space-y-4">
          <SurveyStatistics responses={preWorkshopResponses} surveyType="pre-workshop" />
          <SurveyResponsesTable responses={preWorkshopResponses} onRefresh={loadResponses} />
        </TabsContent>

        <TabsContent value="post-workshop" className="space-y-4">
          <SurveyStatistics responses={postWorkshopResponses} surveyType="post-workshop" />
          <SurveyResponsesTable responses={postWorkshopResponses} onRefresh={loadResponses} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
