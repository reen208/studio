'use server';

/**
 * @fileOverview An AI agent that generates a study schedule based on a list of exams.
 *
 * - getStudyScheduleRecommendations - A function that provides study schedule recommendations.
 * - StudyScheduleRecommendationsInput - The input type for the getStudyScheduleRecommendations function.
 * - StudyScheduleRecommendationsOutput - The return type for the getStudyScheduleRecommendations function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ExamSchema = z.object({
    title: z.string().describe('The title of the exam.'),
    date: z.string().describe('The date of the exam.'),
});

const StudyScheduleRecommendationsInputSchema = z.object({
  exams: z.array(ExamSchema).describe('A list of upcoming exams with their titles and dates.'),
});
export type StudyScheduleRecommendationsInput = z.infer<typeof StudyScheduleRecommendationsInputSchema>;

const StudyScheduleRecommendationsOutputSchema = z.object({
  schedule: z.string().describe('A detailed study schedule in Markdown format. The schedule should be broken down by dates leading up to the exams, suggesting what to study and when. It should be encouraging and easy to follow.'),
});
export type StudyScheduleRecommendationsOutput = z.infer<typeof StudyScheduleRecommendationsOutputSchema>;

export async function getStudyScheduleRecommendations(
  input: StudyScheduleRecommendationsInput
): Promise<StudyScheduleRecommendationsOutput> {
  return studyScheduleRecommendationsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'studyScheduleRecommendationsPrompt',
  input: {schema: StudyScheduleRecommendationsInputSchema},
  output: {schema: StudyScheduleRecommendationsOutputSchema},
  prompt: `You are an expert academic advisor and study planner AI for the DuckieMind app. Your goal is to help students create a manageable and effective study schedule to prepare for their upcoming exams.

You will be given a list of exams with their titles and dates. Create a detailed, day-by-day study schedule that helps the user prepare for these exams without getting overwhelmed.

Your schedule should:
- Be encouraging and use a positive tone.
- Start from today (or the next day) and go up to the last exam date.
- Prioritize subjects with earlier exam dates, but also allocate time for later exams.
- Break down study sessions into manageable chunks (e.g., "Review Chapter 3 of Psychology," "Practice 10 math problems").
- Include suggestions for breaks and relaxation.
- Be formatted in clear, easy-to-read Markdown. Use headings for dates and bullet points for tasks.

Here are the user's exams:
{{#each exams}}
- {{title}} on {{date}}
{{/each}}

Generate the study schedule now.`,
});

const studyScheduleRecommendationsFlow = ai.defineFlow(
  {
    name: 'studyScheduleRecommendationsFlow',
    inputSchema: StudyScheduleRecommendationsInputSchema,
    outputSchema: StudyScheduleRecommendationsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
