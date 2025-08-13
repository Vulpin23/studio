'use server';

/**
 * @fileOverview This flow extracts key events and their outcomes from an uploaded video using GenAI.
 *
 * - extractVideoDetails - A function that handles the video detail extraction process.
 * - ExtractVideoDetailsInput - The input type for the extractVideoDetails function.
 * - ExtractVideoDetailsOutput - The return type for the extractVideoDetails function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ExtractVideoDetailsInputSchema = z.object({
  videoDataUri: z
    .string()
    .describe(
      "A video as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'" // Corrected the format description
    ),
});
type ExtractVideoDetailsInput = z.infer<typeof ExtractVideoDetailsInputSchema>;

const ExtractVideoDetailsOutputSchema = z.object({
  eventsAndOutcomes: z.array(z.string()).describe('Key events and their outcomes extracted from the video. If no specific events are identifiable, provide a general summary of the video content.'),
});
export type ExtractVideoDetailsOutput = z.infer<typeof ExtractVideoDetailsOutputSchema>;

export async function extractVideoDetails(input: ExtractVideoDetailsInput): Promise<ExtractVideoDetailsOutput> {
  return extractVideoDetailsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'extractVideoDetailsPrompt',
  input: {schema: ExtractVideoDetailsInputSchema},
  output: {schema: ExtractVideoDetailsOutputSchema},
  prompt: `You are an AI assistant that extracts key events and their outcomes from videos.

  Analyze the video provided as a data URI and identify the key events and their corresponding outcomes.
  Return a list of strings, where each string describes an event and its outcome.
  If you cannot determine specific events, provide a general summary of what is happening in the video.

  Video: {{media url=videoDataUri}}
  `,
});

const extractVideoDetailsFlow = ai.defineFlow(
  {
    name: 'extractVideoDetailsFlow',
    inputSchema: ExtractVideoDetailsInputSchema,
    outputSchema: ExtractVideoDetailsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);