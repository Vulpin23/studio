'use server';
/**
 * @fileOverview This flow generates a short video from a text prompt using Veo.
 *
 * - generateVideoFromPrompt - A function that handles the video generation.
 * - GenerateVideoFromPromptInput - The input type for the function.
 * - GenerateVideoFromPromptOutput - The return type for the function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';
import { googleAI } from '@genkit-ai/googleai';

export const GenerateVideoFromPromptInputSchema = z.object({
  prompt: z.string().describe('The text prompt for the video generation.'),
});
export type GenerateVideoFromPromptInput = z.infer<typeof GenerateVideoFromPromptInputSchema>;

export const GenerateVideoFromPromptOutputSchema = z.object({
  videoDataUri: z.string().describe("The generated video as a data URI."),
});
export type GenerateVideoFromPromptOutput = z.infer<typeof GenerateVideoFromPromptOutputSchema>;

export async function generateVideoFromPrompt(input: GenerateVideoFromPromptInput): Promise<GenerateVideoFromPromptOutput> {
  return generateVideoFromPromptFlow(input);
}

const generateVideoFromPromptFlow = ai.defineFlow(
  {
    name: 'generateVideoFromPromptFlow',
    inputSchema: GenerateVideoFromPromptInputSchema,
    outputSchema: GenerateVideoFromPromptOutputSchema,
  },
  async ({ prompt }) => {
    let { operation } = await ai.generate({
      model: googleAI.model('veo-2.0-generate-001'),
      prompt,
      config: {
        durationSeconds: 5,
        aspectRatio: '16:9',
      },
    });

    if (!operation) {
      throw new Error('Expected the model to return an operation');
    }

    // Wait for the operation to complete
    while (!operation.done) {
      await new Promise((resolve) => setTimeout(resolve, 5000));
      operation = await ai.checkOperation(operation);
    }

    if (operation.error) {
      throw new Error(`Failed to generate video: ${operation.error.message}`);
    }

    const videoPart = operation.output?.message?.content.find((p) => !!p.media);
    if (!videoPart || !videoPart.media) {
      throw new Error('Failed to find the generated video in the operation result');
    }

    const fetchResponse = await fetch(`${videoPart.media.url}&key=${process.env.GEMINI_API_KEY}`);
    if (!fetchResponse.ok) {
        throw new Error(`Failed to download video: ${fetchResponse.statusText}`);
    }
    const videoBuffer = await fetchResponse.arrayBuffer();
    const base64 = Buffer.from(videoBuffer).toString('base64');

    return { videoDataUri: `data:video/mp4;base64,${base64}` };
  }
);
