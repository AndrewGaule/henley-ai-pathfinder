import { useState, useMemo } from "react";
import { Participant, Track, Readiness } from "@/types/participant";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { ParticipantDetail } from "./ParticipantDetail";
import { exportToCSV } from "@/lib/storage";
import { Download } from "lucide-react";

const TRACKS: Track[] = [
  "Strategy and leadership",
  "Operations and efficiency",
  "Innovation and new business models",
  "Data and platforms",
  "Investment and ventures"
];

const READINESS_LEVELS: Readiness[] = ["Early", "Experimenting", "Scaling"];

interface ParticipantsTableProps {
  participants: Participant[];
}

export function ParticipantsTable({ participants }: ParticipantsTableProps) {
  const [trackFilter, setTrackFilter] = useState<string>("all");
  const [readinessFilter, setReadinessFilter] = useState<string>("all");
  const [selectedParticipant, setSelectedParticipant] = useState<Participant | null>(null);

  const filteredParticipants = useMemo(() => {
    return participants.filter((p) => {
      if (trackFilter !== "all" && p.analysis.track !== trackFilter) return false;
      if (readinessFilter !== "all" && p.analysis.readiness !== readinessFilter) return false;
      return true;
    });
  }, [participants, trackFilter, readinessFilter]);

  const handleExport = () => {
    const csv = exportToCSV(filteredParticipants);
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `henley-participants-${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between">
        <div className="flex flex-wrap gap-3">
          <Select value={trackFilter} onValueChange={setTrackFilter}>
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="Filter by track" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All tracks</SelectItem>
              {TRACKS.map((track) => (
                <SelectItem key={track} value={track}>{track}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={readinessFilter} onValueChange={setReadinessFilter}>
            <SelectTrigger className="w-[160px]">
              <SelectValue placeholder="Filter by readiness" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All levels</SelectItem>
              {READINESS_LEVELS.map((level) => (
                <SelectItem key={level} value={level}>{level}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <Button onClick={handleExport} variant="outline" className="gap-2">
          <Download className="h-4 w-4" />
          Export CSV
        </Button>
      </div>

      <div className="border rounded-lg overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Organisation</TableHead>
              <TableHead className="hidden md:table-cell">Role</TableHead>
              <TableHead className="hidden lg:table-cell">Track</TableHead>
              <TableHead className="hidden sm:table-cell">Readiness</TableHead>
              <TableHead className="hidden xl:table-cell">Date</TableHead>
              <TableHead className="hidden lg:table-cell">Summary</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredParticipants.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center text-muted-foreground py-8">
                  No participants found
                </TableCell>
              </TableRow>
            ) : (
              filteredParticipants.map((p) => (
                <TableRow 
                  key={p.id} 
                  className="cursor-pointer hover:bg-muted/50"
                  onClick={() => setSelectedParticipant(p)}
                >
                  <TableCell className="font-medium">{p.basicDetails.name}</TableCell>
                  <TableCell>{p.basicDetails.organisation}</TableCell>
                  <TableCell className="hidden md:table-cell">{p.basicDetails.role}</TableCell>
                  <TableCell className="hidden lg:table-cell text-sm">{p.analysis.track}</TableCell>
                  <TableCell className="hidden sm:table-cell">{p.analysis.readiness}</TableCell>
                  <TableCell className="hidden xl:table-cell text-sm text-muted-foreground">
                    {new Date(p.timestamp).toLocaleDateString()}
                  </TableCell>
                  <TableCell className="hidden lg:table-cell text-sm text-muted-foreground max-w-[200px] truncate">
                    {p.analysis.summary.split('.')[0]}...
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <ParticipantDetail
        participant={selectedParticipant}
        open={!!selectedParticipant}
        onClose={() => setSelectedParticipant(null)}
      />
    </div>
  );
}
