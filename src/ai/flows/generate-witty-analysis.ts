'use server';
/**
 * @fileOverview Generates a witty analysis of a daily video, including 'Could Have Gone Better', 'Went Well', and 'Conclusion' sections, each with a "devil's advocate" take.
 *
 * - generateWittyAnalysis - A function that generates the witty analysis.
 * - GenerateWittyAnalysisInput - The input type for the generateWittyAnalysis function.
 * - GenerateWittyAnalysisOutput - The return type for the generateWittyAnalysis function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateWittyAnalysisInputSchema = z.object({
  eventDetails: z.string().describe('Extracted event details from the daily video.'),
});
type GenerateWittyAnalysisInput = z.infer<typeof GenerateWittyAnalysisInputSchema>;

const AnalysisWithDevilsAdvocateSchema = z.object({
  main: z.string().describe('The primary analysis for a section.'),
  devilsAdvocate: z.string().describe("A witty, contrary devil's advocate perspective on the analysis."),
});

const GenerateWittyAnalysisOutputSchema = z.object({
  couldHaveGoneBetter: AnalysisWithDevilsAdvocateSchema,
  wentWell: AnalysisWithDevilsAdvocateSchema,
  conclusion: z.string().describe('A witty conclusion summarizing the daily video.'),
});
export type GenerateWittyAnalysisOutput = z.infer<typeof GenerateWittyAnalysisOutputSchema>;

export async function generateWittyAnalysis(input: GenerateWittyAnalysisInput): Promise<GenerateWittyAnalysisOutput> {
  return generateWittyAnalysisFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateWittyAnalysisPrompt',
  input: {schema: GenerateWittyAnalysisInputSchema},
  output: {schema: GenerateWittyAnalysisOutputSchema},
  prompt: `You are a witty AI assistant that analyzes daily videos and provides insightful perspectives. You have a talent for playing devil's advocate.

  Based on the event details provided, generate a witty analysis consisting of three sections:
  - Went Well: Highlight the positive aspects and successes. Then, provide a devil's advocate take that pokes holes in the success in a humorous way.
  - Could Have Gone Better: Analyze what could have been improved. Then, provide a devil's advocate take that humorously justifies why it was actually for the best.
  - Conclusion: Summarize the daily video with a witty conclusion that leaves the user with a fresh perspective.

  Event Details: {{{eventDetails}}}
  `,
});

const generateWittyAnalysisFlow = ai.defineFlow(
  {
    name: 'generateWittyAnalysisFlow',
    inputSchema: GenerateWittyAnalysisInputSchema,
    outputSchema: GenerateWittyAnalysisOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);