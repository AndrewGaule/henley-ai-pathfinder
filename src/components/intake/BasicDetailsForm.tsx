import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { BasicDetails, FocusArea } from "@/types/participant";
import { ArrowRight } from "lucide-react";

const FOCUS_AREAS: FocusArea[] = [
  "Strategy and leadership",
  "Operations and efficiency",
  "Innovation and new business models",
  "Data and platforms",
  "Investment and ventures"
];

interface BasicDetailsFormProps {
  onSubmit: (details: BasicDetails) => void;
}

export function BasicDetailsForm({ onSubmit }: BasicDetailsFormProps) {
  const [name, setName] = useState("");
  const [organisation, setOrganisation] = useState("");
  const [role, setRole] = useState("");
  const [focusArea, setFocusArea] = useState<FocusArea | "">("");
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!name.trim()) newErrors.name = "Name is required";
    if (!organisation.trim()) newErrors.organisation = "Organisation is required";
    if (!role.trim()) newErrors.role = "Role is required";
    if (!focusArea) newErrors.focusArea = "Please select a focus area";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      onSubmit({
        name: name.trim(),
        organisation: organisation.trim(),
        role: role.trim(),
        focusArea: focusArea as FocusArea
      });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <div className="max-w-md w-full animate-fade-in">
        <div className="mb-8">
          <p className="text-sm text-muted-foreground mb-2">Step 1 of 3</p>
          <h2 className="text-2xl font-semibold text-foreground">Tell us about yourself</h2>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-2">
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your full name"
              className={errors.name ? "border-destructive" : ""}
            />
            {errors.name && <p className="text-sm text-destructive">{errors.name}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="organisation">Organisation</Label>
            <Input
              id="organisation"
              value={organisation}
              onChange={(e) => setOrganisation(e.target.value)}
              placeholder="Your company or organisation"
              className={errors.organisation ? "border-destructive" : ""}
            />
            {errors.organisation && <p className="text-sm text-destructive">{errors.organisation}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="role">Role</Label>
            <Input
              id="role"
              value={role}
              onChange={(e) => setRole(e.target.value)}
              placeholder="Your job title"
              className={errors.role ? "border-destructive" : ""}
            />
            {errors.role && <p className="text-sm text-destructive">{errors.role}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="focusArea">Main focus area</Label>
            <Select value={focusArea} onValueChange={(v) => setFocusArea(v as FocusArea)}>
              <SelectTrigger className={errors.focusArea ? "border-destructive" : ""}>
                <SelectValue placeholder="Select your main focus" />
              </SelectTrigger>
              <SelectContent>
                {FOCUS_AREAS.map((area) => (
                  <SelectItem key={area} value={area}>{area}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.focusArea && <p className="text-sm text-destructive">{errors.focusArea}</p>}
          </div>

          <Button type="submit" className="w-full gap-2">
            Continue
            <ArrowRight className="h-4 w-4" />
          </Button>
        </form>
      </div>
    </div>
  );
}
