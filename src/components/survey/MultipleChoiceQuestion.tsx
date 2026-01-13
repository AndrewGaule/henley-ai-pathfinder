import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { MultipleChoiceQuestion as MultipleChoiceQuestionType } from "@/types/survey";

interface MultipleChoiceQuestionProps {
  question: MultipleChoiceQuestionType;
  value: string | string[];
  onChange: (value: string | string[]) => void;
}

export function MultipleChoiceQuestion({
  question,
  value,
  onChange,
}: MultipleChoiceQuestionProps) {
  const handleSingleChange = (newValue: string) => {
    onChange(newValue);
  };

  const handleMultipleChange = (option: string, checked: boolean) => {
    const currentValues = Array.isArray(value) ? value : [];
    if (checked) {
      onChange([...currentValues, option]);
    } else {
      onChange(currentValues.filter((v) => v !== option));
    }
  };

  if (question.allowMultiple) {
    return (
      <div className="space-y-3">
        <Label className="text-base font-medium">
          {question.text}
          {question.required && <span className="text-destructive ml-1">*</span>}
        </Label>
        <div className="space-y-2">
          {question.options.map((option) => (
            <div key={option} className="flex items-center space-x-2">
              <Checkbox
                id={`${question.id}-${option}`}
                checked={Array.isArray(value) && value.includes(option)}
                onCheckedChange={(checked) =>
                  handleMultipleChange(option, checked as boolean)
                }
              />
              <label
                htmlFor={`${question.id}-${option}`}
                className="text-sm font-normal leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
              >
                {option}
              </label>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <Label className="text-base font-medium">
        {question.text}
        {question.required && <span className="text-destructive ml-1">*</span>}
      </Label>
      <RadioGroup value={value as string} onValueChange={handleSingleChange}>
        {question.options.map((option) => (
          <div key={option} className="flex items-center space-x-2">
            <RadioGroupItem value={option} id={`${question.id}-${option}`} />
            <Label
              htmlFor={`${question.id}-${option}`}
              className="font-normal cursor-pointer"
            >
              {option}
            </Label>
          </div>
        ))}
      </RadioGroup>
    </div>
  );
}
