'use server';

/**
 * @fileOverview An AI agent that provides feedback on stressful situations.
 *
 * - getStressCopingFeedback - A function that provides feedback for coping with stress.
 * - StressCopingFeedbackInput - The input type for the getStressCopingFeedback function.
 * - StressCopingFeedbackOutput - The return type for the getStressCopingFeedback function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const StressCopingFeedbackInputSchema = z.object({
  situation: z.string().describe('The stressful situation described by the user.'),
});
export type StressCopingFeedbackInput = z.infer<typeof StressCopingFeedbackInputSchema>;

const StressCopingFeedbackOutputSchema = z.object({
  feedback: z.string().describe('Supportive and constructive feedback for the user to cope with their situation. Provide actionable, simple steps in a gentle and encouraging tone. Do not act as a medical professional. Format the feedback as a paragraph or bullet points.'),
});
export type StressCopingFeedbackOutput = z.infer<typeof StressCopingFeedbackOutputSchema>;

export async function getStressCopingFeedback(
  input: StressCopingFeedbackInput
): Promise<StressCopingFeedbackOutput> {
  return stressCopingFeedbackFlow(input);
}

const prompt = ai.definePrompt({
  name: 'stressCopingFeedbackPrompt',
  input: {schema: StressCopingFeedbackInputSchema},
  output: {schema: StressCopingFeedbackOutputSchema},
  prompt: `You are a friendly and supportive AI assistant in a student mental wellness app called DuckieMind. Your role is to be a gentle guide, like a caring friend.

A user is sharing a stressful situation with you. Your task is to provide supportive and constructive feedback to help them cope. Your tone should be gentle, encouraging, and calm.

IMPORTANT: You are NOT a medical professional. Do not provide medical advice, diagnoses, or therapy. Instead, offer simple, practical, and actionable coping strategies.

Situation:
"{{{situation}}}"

Please provide feedback that includes:
- Validation of their feelings.
- Gentle reframing of the situation, if appropriate.
- A few simple, actionable steps they can take right now (e.g., deep breathing, taking a short walk, writing down their thoughts).
- A positive and hopeful closing statement.

Present your feedback in a clear, easy-to-read format.`,
});

const stressCopingFeedbackFlow = ai.defineFlow(
  {
    name: 'stressCopingFeedbackFlow',
    inputSchema: StressCopingFeedbackInputSchema,
    outputSchema: StressCopingFeedbackOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
