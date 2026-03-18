'use server';
/**
 * @fileOverview This file implements a Genkit flow for summarizing user reviews about voter registration centers.
 *
 * - summarizeRegistrationCenterReviews - A function that takes an array of reviews and returns a concise summary.
 * - SummarizeRegistrationCenterReviewsInput - The input type for the summarizeRegistrationCenterReviews function.
 * - SummarizeRegistrationCenterReviewsOutput - The return type for the summarizeRegistrationCenterReviews function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SummarizeRegistrationCenterReviewsInputSchema = z.object({
  reviews: z
    .array(z.string())
    .describe('An array of user reviews for a voter registration center.'),
});
export type SummarizeRegistrationCenterReviewsInput = z.infer<
  typeof SummarizeRegistrationCenterReviewsInputSchema
>;

const SummarizeRegistrationCenterReviewsOutputSchema = z.object({
  summary: z
    .string()
    .describe(
      'A concise summary of the user reviews, highlighting common issues and positive aspects.'
    ),
});
export type SummarizeRegistrationCenterReviewsOutput = z.infer<
  typeof SummarizeRegistrationCenterReviewsOutputSchema
>;

export async function summarizeRegistrationCenterReviews(
  input: SummarizeRegistrationCenterReviewsInput
): Promise<SummarizeRegistrationCenterReviewsOutput> {
  return summarizeRegistrationCenterReviewsFlow(input);
}

const summarizeReviewsPrompt = ai.definePrompt({
  name: 'summarizeReviewsPrompt',
  input: {schema: SummarizeRegistrationCenterReviewsInputSchema},
  output: {schema: SummarizeRegistrationCenterReviewsOutputSchema},
  prompt: `You are an AI assistant tasked with summarizing user feedback for voter registration centers.
Given a list of reviews, generate a concise summary that highlights common issues, recurring positive aspects, and any other notable trends.
Focus on providing a balanced overview that a potential voter can quickly understand to assess the registration center.

Reviews:
{{#each reviews}}
- {{{this}}}
{{/each}}`,
});

const summarizeRegistrationCenterReviewsFlow = ai.defineFlow(
  {
    name: 'summarizeRegistrationCenterReviewsFlow',
    inputSchema: SummarizeRegistrationCenterReviewsInputSchema,
    outputSchema: SummarizeRegistrationCenterReviewsOutputSchema,
  },
  async input => {
    const {output} = await summarizeReviewsPrompt(input);
    return output!;
  }
);
