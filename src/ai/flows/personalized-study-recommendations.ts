'use server';

/**
 * @fileOverview A personalized study method recommendation AI agent.
 *
 * - getPersonalizedStudyRecommendations - A function that provides personalized study method recommendations.
 * - PersonalizedStudyRecommendationsInput - The input type for the getPersonalizedStudyRecommendations function.
 * - PersonalizedStudyRecommendationsOutput - The return type for the getPersonalizedStudyRecommendations function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const PersonalizedStudyRecommendationsInputSchema = z.object({
  course: z.string().describe('The course for which study recommendations are needed.'),
  learningStyle: z.string().describe('The preferred learning style of the student (e.g., visual, auditory, kinesthetic).'),
  studyGoals: z.string().describe('The specific study goals of the student (e.g., improve grades, pass exams, master concepts).'),
});
export type PersonalizedStudyRecommendationsInput = z.infer<typeof PersonalizedStudyRecommendationsInputSchema>;

const PersonalizedStudyRecommendationsOutputSchema = z.object({
  recommendations: z.string().describe('Personalized study method recommendations based on the provided information.'),
});
export type PersonalizedStudyRecommendationsOutput = z.infer<typeof PersonalizedStudyRecommendationsOutputSchema>;

export async function getPersonalizedStudyRecommendations(
  input: PersonalizedStudyRecommendationsInput
): Promise<PersonalizedStudyRecommendationsOutput> {
  return personalizedStudyRecommendationsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'personalizedStudyRecommendationsPrompt',
  input: {schema: PersonalizedStudyRecommendationsInputSchema},
  output: {schema: PersonalizedStudyRecommendationsOutputSchema},
  prompt: `You are an AI assistant designed to provide personalized study method recommendations to students.

  Based on the student's course, learning style, and study goals, provide tailored study method recommendations.

  Course: {{{course}}}
  Learning Style: {{{learningStyle}}}
  Study Goals: {{{studyGoals}}}

  Recommendations:`,
});

const personalizedStudyRecommendationsFlow = ai.defineFlow(
  {
    name: 'personalizedStudyRecommendationsFlow',
    inputSchema: PersonalizedStudyRecommendationsInputSchema,
    outputSchema: PersonalizedStudyRecommendationsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
