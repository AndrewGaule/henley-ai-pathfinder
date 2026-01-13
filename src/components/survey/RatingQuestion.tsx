import { Label } from "@/components/ui/label";
import { RatingQuestion as RatingQuestionType } from "@/types/survey";
import { cn } from "@/lib/utils";

interface RatingQuestionProps {
  question: RatingQuestionType;
  value: number | null;
  onChange: (value: number) => void;
}

export function RatingQuestion({
  question,
  value,
  onChange,
}: RatingQuestionProps) {
  return (
    <div className="space-y-3">
      <Label className="text-base font-medium">
        {question.text}
        {question.required && <span className="text-destructive ml-1">*</span>}
      </Label>

      <div className="space-y-4">
        <div className="flex items-center justify-between gap-2">
          {Array.from({ length: question.scale }, (_, i) => i + 1).map((rating) => (
            <button
              key={rating}
              type="button"
              onClick={() => onChange(rating)}
              className={cn(
                "flex items-center justify-center w-12 h-12 rounded-lg border-2 transition-all font-semibold text-lg",
                "hover:border-primary hover:bg-primary/10",
                "focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2",
                value === rating
                  ? "border-primary bg-primary text-primary-foreground"
                  : "border-muted-foreground/30 bg-background text-foreground"
              )}
              aria-label={`Rating ${rating} out of ${question.scale}`}
            >
              {rating}
            </button>
          ))}
        </div>

        {question.labels && (
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>{question.labels.low}</span>
            <span>{question.labels.high}</span>
          </div>
        )}
      </div>
    </div>
  );
}
