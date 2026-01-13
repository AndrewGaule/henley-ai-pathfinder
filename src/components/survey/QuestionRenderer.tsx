import { Question, Answer } from "@/types/survey";
import { MultipleChoiceQuestion } from "./MultipleChoiceQuestion";
import { RatingQuestion } from "./RatingQuestion";
import { TextQuestion } from "./TextQuestion";

interface QuestionRendererProps {
  question: Question;
  answer: Answer | undefined;
  onChange: (answer: Answer) => void;
}

export function QuestionRenderer({
  question,
  answer,
  onChange,
}: QuestionRendererProps) {
  const handleChange = (value: string | string[] | number) => {
    onChange({
      questionId: question.id,
      value,
    });
  };

  const currentValue = answer?.value ?? (question.type === 'multiple-choice' && question.allowMultiple ? [] : question.type === 'rating' ? null : '');

  switch (question.type) {
    case "multiple-choice":
      return (
        <MultipleChoiceQuestion
          question={question}
          value={currentValue as string | string[]}
          onChange={handleChange}
        />
      );

    case "rating":
      return (
        <RatingQuestion
          question={question}
          value={currentValue as number | null}
          onChange={handleChange}
        />
      );

    case "text":
      return (
        <TextQuestion
          question={question}
          value={currentValue as string}
          onChange={handleChange}
        />
      );

    default:
      return null;
  }
}
