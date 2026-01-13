import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { TextQuestion as TextQuestionType } from "@/types/survey";

interface TextQuestionProps {
  question: TextQuestionType;
  value: string;
  onChange: (value: string) => void;
}

export function TextQuestion({
  question,
  value,
  onChange,
}: TextQuestionProps) {
  return (
    <div className="space-y-3">
      <Label htmlFor={question.id} className="text-base font-medium">
        {question.text}
        {question.required && <span className="text-destructive ml-1">*</span>}
      </Label>

      {question.multiline ? (
        <Textarea
          id={question.id}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={question.placeholder}
          className="min-h-[120px] resize-y"
          required={question.required}
        />
      ) : (
        <Input
          id={question.id}
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={question.placeholder}
          required={question.required}
        />
      )}
    </div>
  );
}
