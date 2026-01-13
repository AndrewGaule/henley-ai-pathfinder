import { useState } from "react";
import { SurveyForm } from "@/components/survey/SurveyForm";
import { SurveyComplete } from "@/components/survey/SurveyComplete";
import { SurveyResponse } from "@/types/survey";
import { postWorkshopSurvey } from "@/data/surveys";
import { saveSurveyResponse } from "@/lib/survey-storage";
import { useNavigate } from "react-router-dom";

export default function PostWorkshopSurvey() {
  const [isComplete, setIsComplete] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (response: SurveyResponse) => {
    try {
      await saveSurveyResponse(response);
      setIsComplete(true);
    } catch (error) {
      console.error("Failed to save survey response:", error);
      alert("Failed to submit survey. Please try again.");
    }
  };

  const handleClose = () => {
    navigate("/");
  };

  if (isComplete) {
    return <SurveyComplete surveyType="post-workshop" onClose={handleClose} />;
  }

  return (
    <SurveyForm
      survey={postWorkshopSurvey}
      onSubmit={handleSubmit}
      onCancel={() => navigate("/")}
    />
  );
}
