'use server';

/**
 * @fileOverview Generates two "overthinking" scenarios based on video events.
 * 
 * - generateOverthinkingScenarios - A function that generates two alternative scenarios.
 * - GenerateOverthinkingScenariosInput - The input type for the function.
 * - GenerateOverthinkingScenariosOutput - The return type for the function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const GenerateOverthinkingScenariosInputSchema = z.object({
  eventDetails: z.string().describe('The key events from the video.'),
});
type GenerateOverthinkingScenariosInput = z.infer<typeof GenerateOverthinkingScenariosInputSchema>;

const GenerateOverthinkingScenariosOutputSchema = z.object({
  scenario1: z.string().describe("A wild, imaginative, and funny 'what if' scenario based on the events."),
  scenario2: z.string().describe("Another wild, imaginative, and funny 'what if' scenario based on the events."),
});
export type GenerateOverthinkingScenariosOutput = z.infer<typeof GenerateOverthinkingScenariosOutputSchema>;

export async function generateOverthinkingScenarios(input: GenerateOverthinkingScenariosInput): Promise<GenerateOverthinkingScenariosOutput> {
  return generateOverthinkingScenariosFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateOverthinkingScenariosPrompt',
  input: { schema: GenerateOverthinkingScenariosInputSchema },
  output: { schema: GenerateOverthinkingScenariosOutputSchema },
  prompt: `You are an expert at overthinking and coming up with hilarious, absurd, and imaginative alternative scenarios.
Based on the following events, generate two distinct "what if" scenarios. Let your imagination run wild.

Events:
{{{eventDetails}}}
  `,
});

const generateOverthinkingScenariosFlow = ai.defineFlow(
  {
    name: 'generateOverthinkingScenariosFlow',
    inputSchema: GenerateOverthinkingScenariosInputSchema,
    outputSchema: GenerateOverthinkingScenariosOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    return output!;
  }
);