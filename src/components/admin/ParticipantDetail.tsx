import { Participant } from "@/types/participant";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

interface ParticipantDetailProps {
  participant: Participant | null;
  open: boolean;
  onClose: () => void;
}

export function ParticipantDetail({ participant, open, onClose }: ParticipantDetailProps) {
  if (!participant) return null;

  const { basicDetails, answers, analysis } = participant;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{basicDetails.name}</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          <section>
            <h3 className="text-sm font-medium text-muted-foreground mb-2">Basic Details</h3>
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div>
                <span className="text-muted-foreground">Organisation:</span>
                <p className="font-medium">{basicDetails.organisation}</p>
              </div>
              <div>
                <span className="text-muted-foreground">Role:</span>
                <p className="font-medium">{basicDetails.role}</p>
              </div>
              <div>
                <span className="text-muted-foreground">Focus Area:</span>
                <p className="font-medium">{basicDetails.focusArea}</p>
              </div>
              <div>
                <span className="text-muted-foreground">Submitted:</span>
                <p className="font-medium">{new Date(participant.timestamp).toLocaleString()}</p>
              </div>
            </div>
          </section>

          <Separator />

          <section>
            <h3 className="text-sm font-medium text-muted-foreground mb-3">Responses</h3>
            <div className="space-y-4">
              <div>
                <p className="text-xs text-muted-foreground mb-1">AI hopes for next 12 months</p>
                <p className="text-sm">{answers.aiHope}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground mb-1">Where they feel stuck</p>
                <p className="text-sm">{answers.aiStuck}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground mb-1">What they've tried</p>
                <p className="text-sm">{answers.aiTried}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground mb-1">Success definition</p>
                <p className="text-sm">{answers.workshopSuccess}</p>
              </div>
            </div>
          </section>

          <Separator />

          <section>
            <h3 className="text-sm font-medium text-muted-foreground mb-3">AI Analysis</h3>
            <p className="text-sm mb-4">{analysis.summary}</p>
            <div className="flex flex-wrap gap-4 text-sm">
              <div>
                <span className="text-muted-foreground">Track:</span>
                <Badge variant="outline" className="ml-2">{analysis.track}</Badge>
              </div>
              <div>
                <span className="text-muted-foreground">Readiness:</span>
                <Badge variant="outline" className="ml-2">{analysis.readiness}</Badge>
              </div>
            </div>
            <div className="mt-3">
              <span className="text-sm text-muted-foreground">Themes:</span>
              <div className="flex flex-wrap gap-1 mt-1">
                {analysis.themes.map((theme) => (
                  <Badge key={theme} variant="secondary">{theme}</Badge>
                ))}
              </div>
            </div>
          </section>
        </div>
      </DialogContent>
    </Dialog>
  );
}
