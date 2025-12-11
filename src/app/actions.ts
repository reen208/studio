"use server";

import { getPersonalizedStudyRecommendations, type PersonalizedStudyRecommendationsInput } from "@/ai/flows/personalized-study-recommendations";
import { z } from "zod";

const studyRecommendationsSchema = z.object({
  course: z.string().min(2, "Course name must be at least 2 characters."),
  learningStyle: z.string(),
  studyGoals: z.string().min(10, "Study goals must be at least 10 characters."),
});

type State = {
  message?: string | null;
  recommendations?: string | null;
  errors?: {
    course?: string[];
    learningStyle?: string[];
    studyGoals?: string[];
  } | null;
};

export async function generateStudyRecommendationsAction(
  prevState: State,
  formData: FormData,
): Promise<State> {
  const validatedFields = studyRecommendationsSchema.safeParse({
    course: formData.get("course"),
    learningStyle: formData.get("learningStyle"),
    studyGoals: formData.get("studyGoals"),
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: "Validation failed. Please check your inputs.",
    };
  }

  try {
    const result = await getPersonalizedStudyRecommendations(validatedFields.data as PersonalizedStudyRecommendationsInput);
    if (result.recommendations) {
      return { recommendations: result.recommendations, message: "Success!" };
    }
    return { message: "Could not generate recommendations. Please try again." };
  } catch (error) {
    console.error(error);
    return { message: "An unexpected error occurred on the server." };
  }
}
