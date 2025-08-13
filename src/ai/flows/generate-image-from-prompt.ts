'use server';
/**
 * @fileOverview This flow generates an image from a text prompt and a reference video.
 *
 * - generateImageFromPrompt - A function that handles the image generation.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const GenerateImageFromPromptInputSchema = z.object({
  prompt: z.string().describe('The text prompt for the image generation.'),
  videoDataUri: z
    .string()
    .describe(
      "A video as a data URI to be used as reference. Format: 'data:<mimetype>;base64,<encoded_data>'"
    ),
});

const GenerateImageFromPromptOutputSchema = z.object({
  imageDataUri: z.string().describe("The generated image as a data URI."),
});

export async function generateImageFromPrompt(input: z.infer<typeof GenerateImageFromPromptInputSchema>): Promise<z.infer<typeof GenerateImageFromPromptOutputSchema>> {
  return generateImageFromPromptFlow(input);
}

const generateImageFromPromptFlow = ai.defineFlow(
  {
    name: 'generateImageFromPromptFlow',
    inputSchema: GenerateImageFromPromptInputSchema,
    outputSchema: GenerateImageFromPromptOutputSchema,
  },
  async ({ prompt, videoDataUri }) => {
    const { media } = await ai.generate({
      model: 'googleai/gemini-2.0-flash-preview-image-generation',
      prompt: [
        { media: { url: videoDataUri } },
        { text: `Using the people and context from the provided video, generate an image that vividly represents the following scenario: "${prompt}"` },
      ],
      config: {
        responseModalities: ['TEXT', 'IMAGE'],
      },
    });
    
    if (!media?.url) {
      throw new Error('Image generation failed to return an image.');
    }

    return { imageDataUri: media.url };
  }
);
