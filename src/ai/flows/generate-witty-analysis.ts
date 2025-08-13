'use server';
/**
 * @fileOverview Generates a witty analysis of a daily video, including 'Could Have Gone Better', 'Went Well', and 'Conclusion' sections.
 *
 * - generateWittyAnalysis - A function that generates the witty analysis.
 * - GenerateWittyAnalysisInput - The input type for the generateWittyAnalysis function.
 * - GenerateWittyAnalysisOutput - The return type for the generateWittyAnalysis function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateWittyAnalysisInputSchema = z.object({
  eventDetails: z.string().describe('Extracted event details from the daily video.'),
  outcomeDetails: z.string().describe('Extracted outcome details from the daily video.'),
});
export type GenerateWittyAnalysisInput = z.infer<typeof GenerateWittyAnalysisInputSchema>;

const GenerateWittyAnalysisOutputSchema = z.object({
  couldHaveGoneBetter: z.string().describe('A witty analysis of what could have gone better.'),
  wentWell: z.string().describe('A witty analysis of what went well.'),
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
  prompt: `You are a witty AI assistant that analyzes daily videos and provides insightful perspectives.

  Based on the event and outcome details provided, generate a witty analysis consisting of three sections:
  - Could Have Gone Better: Analyze what could have been improved in a humorous and lighthearted manner.
  - Went Well: Highlight the positive aspects and successes of the video in an amusing way.
  - Conclusion: Summarize the daily video with a witty conclusion that leaves the user with a fresh perspective.

  Event Details: {{{eventDetails}}}
  Outcome Details: {{{outcomeDetails}}}

  Please provide your witty analysis in the following format:
  {
    "couldHaveGoneBetter": "",
    "wentWell": "",
    "conclusion": ""
  }`,
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
