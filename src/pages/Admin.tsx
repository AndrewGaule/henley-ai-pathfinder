import { useState, useEffect } from "react";
import { AdminLogin } from "@/components/admin/AdminLogin";
import { ParticipantsTable } from "@/components/admin/ParticipantsTable";
import { isAuthenticated, logout } from "@/lib/auth";
import { getParticipants as getParticipantsSupabase, isSupabaseConfigured } from "@/lib/supabase-storage";
import { getParticipants as getParticipantsLocal } from "@/lib/storage";
import { Participant } from "@/types/participant";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";

export default function Admin() {
  const [authenticated, setAuthenticated] = useState(isAuthenticated());
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const loadParticipants = async () => {
      if (authenticated) {
        setLoading(true);
        try {
          if (isSupabaseConfigured()) {
            const data = await getParticipantsSupabase();
            setParticipants(data);
            console.log('Loaded participants from Supabase:', data.length);
          } else {
            const data = getParticipantsLocal();
            setParticipants(data);
            console.log('Loaded participants from localStorage:', data.length);
          }
        } catch (error) {
          console.error('Error loading participants, falling back to localStorage:', error);
          const data = getParticipantsLocal();
          setParticipants(data);
        } finally {
          setLoading(false);
        }
      }
    };

    loadParticipants();
  }, [authenticated]);

  const handleLogout = () => {
    logout();
    setAuthenticated(false);
  };

  if (!authenticated) {
    return <AdminLogin onLogin={() => setAuthenticated(true)} />;
  }

  return (
    <div className="min-h-screen bg-muted/30">
      <header className="bg-card border-b">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-xl font-semibold text-foreground">Staff Dashboard</h1>
            <p className="text-sm text-muted-foreground">
              {participants.length} participant{participants.length !== 1 ? "s" : ""}
            </p>
          </div>
          <Button variant="outline" size="sm" onClick={handleLogout} className="gap-2">
            <LogOut className="h-4 w-4" />
            Logout
          </Button>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6">
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <p className="text-muted-foreground">Loading participants...</p>
          </div>
        ) : (
          <ParticipantsTable participants={participants} />
        )}
      </main>
    </div>
  );
}
