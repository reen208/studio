"use server";

import { getPersonalizedStudyRecommendations, type PersonalizedStudyRecommendationsInput } from "@/ai/flows/personalized-study-recommendations";
import { getStressCopingFeedback, type StressCopingFeedbackInput } from "@/ai/flows/stress-coping-feedback";
import { z } from "zod";

const studyRecommendationsSchema = z.object({
  course: z.string().min(2, "Course name must be at least 2 characters."),
  learningStyle: z.string(),
  studyGoals: z.string().min(10, "Study goals must be at least 10 characters."),
});

const stressFeedbackSchema = z.object({
  situation: z.string().min(15, "Please describe your situation in at least 15 characters."),
});

type StudyState = {
  message?: string | null;
  recommendations?: string | null;
  errors?: {
    course?: string[];
    learningStyle?: string[];
    studyGoals?: string[];
  } | null;
};

type StressState = {
    message?: string | null;
    feedback?: string | null;
    errors?: {
      situation?: string[];
    } | null;
  };

export async function generateStudyRecommendationsAction(
  prevState: StudyState,
  formData: FormData,
): Promise<StudyState> {
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

export async function generateStressCopingFeedbackAction(
    prevState: StressState,
    formData: FormData,
  ): Promise<StressState> {
    const validatedFields = stressFeedbackSchema.safeParse({
      situation: formData.get("situation"),
    });
  
    if (!validatedFields.success) {
      return {
        errors: validatedFields.error.flatten().fieldErrors,
        message: "Validation failed. Please describe your situation.",
      };
    }
  
    try {
      const result = await getStressCopingFeedback(validatedFields.data as StressCopingFeedbackInput);
      if (result.feedback) {
        return { feedback: result.feedback, message: "Success!" };
      }
      return { message: "Could not generate feedback. Please try again." };
    } catch (error) {
      console.error(error);
      return { message: "An unexpected error occurred on the server." };
    }
}
