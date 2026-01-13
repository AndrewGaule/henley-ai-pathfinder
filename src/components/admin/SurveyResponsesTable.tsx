import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Eye } from "lucide-react";
import { SurveyResponse } from "@/types/survey";
import { format } from "date-fns";

interface SurveyResponsesTableProps {
  responses: SurveyResponse[];
  onRefresh: () => void;
}

export function SurveyResponsesTable({ responses, onRefresh }: SurveyResponsesTableProps) {
  const [selectedResponse, setSelectedResponse] = useState<SurveyResponse | null>(null);

  const formatDuration = (seconds: number | undefined) => {
    if (!seconds) return "N/A";
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}m ${remainingSeconds}s`;
  };

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Survey Responses</CardTitle>
        </CardHeader>
        <CardContent>
          {responses.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No survey responses yet
            </div>
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Participant</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Organization</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Submitted</TableHead>
                    <TableHead>Duration</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {responses.map((response) => (
                    <TableRow key={response.id}>
                      <TableCell className="font-medium">
                        {response.participantName}
                      </TableCell>
                      <TableCell>{response.participantEmail}</TableCell>
                      <TableCell>{response.participantOrganization || "-"}</TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            response.surveyType === "pre-workshop"
                              ? "default"
                              : "secondary"
                          }
                        >
                          {response.surveyType === "pre-workshop" ? "Pre" : "Post"}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {format(new Date(response.timestamp), "MMM d, yyyy HH:mm")}
                      </TableCell>
                      <TableCell>{formatDuration(response.completionTime)}</TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setSelectedResponse(response)}
                          className="gap-2"
                        >
                          <Eye className="h-4 w-4" />
                          View
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Response Details Dialog */}
      <Dialog open={!!selectedResponse} onOpenChange={() => setSelectedResponse(null)}>
        <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Survey Response Details</DialogTitle>
            <DialogDescription>
              {selectedResponse?.participantName} -{" "}
              {selectedResponse &&
                format(new Date(selectedResponse.timestamp), "MMM d, yyyy HH:mm")}
            </DialogDescription>
          </DialogHeader>

          {selectedResponse && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4 p-4 bg-muted/50 rounded-lg">
                <div>
                  <p className="text-sm text-muted-foreground">Email</p>
                  <p className="font-medium">{selectedResponse.participantEmail}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Organization</p>
                  <p className="font-medium">
                    {selectedResponse.participantOrganization || "N/A"}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Survey Type</p>
                  <Badge
                    variant={
                      selectedResponse.surveyType === "pre-workshop"
                        ? "default"
                        : "secondary"
                    }
                  >
                    {selectedResponse.surveyType === "pre-workshop"
                      ? "Pre-Workshop"
                      : "Post-Workshop"}
                  </Badge>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Completion Time</p>
                  <p className="font-medium">
                    {formatDuration(selectedResponse.completionTime)}
                  </p>
                </div>
              </div>

              <div className="space-y-3">
                <h4 className="font-semibold">Answers</h4>
                {selectedResponse.answers.map((answer, index) => (
                  <div key={index} className="p-3 border rounded-lg">
                    <p className="text-sm font-medium text-muted-foreground mb-1">
                      {answer.questionId}
                    </p>
                    <p className="text-sm">
                      {Array.isArray(answer.value)
                        ? answer.value.join(", ")
                        : String(answer.value)}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
