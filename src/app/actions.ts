'use server';

import { extractVideoDetails } from '@/ai/flows/extract-video-details';
import { generateWittyAnalysis } from '@/ai/flows/generate-witty-analysis';
import type { GenerateWittyAnalysisOutput } from '@/ai/flows/generate-witty-analysis';
import { generateOverthinkingScenarios } from '@/ai/flows/generate-overthinking-scenarios';
import type { GenerateOverthinkingScenariosOutput } from '@/ai/flows/generate-overthinking-scenarios';
import { generateImageFromPrompt } from '@/ai/flows/generate-image-from-prompt';

export interface FullAnalysis extends GenerateWittyAnalysisOutput {
  overthinkingScenarios: GenerateOverthinkingScenariosOutput;
  wentWellImage: string;
  couldHaveGoneBetterImage: string;
}

export async function getWittyAnalysisForVideo(videoDataUri: string): Promise<FullAnalysis> {
  try {
    const { eventsAndOutcomes } = await extractVideoDetails({ videoDataUri });
    
    const eventDetails = eventsAndOutcomes.join('\n');

    if (!eventDetails || eventDetails.trim().length === 0) {
      throw new Error("Could not extract any meaningful events from the video.");
    }
    
    const [analysis, overthinkingScenarios] = await Promise.all([
      generateWittyAnalysis({ eventDetails }),
      generateOverthinkingScenarios({ eventDetails }),
    ]);

    const [wentWellImageResult, couldHaveGoneBetterImageResult] = await Promise.all([
        generateImageFromPrompt({ prompt: analysis.wentWell.main, videoDataUri }),
        generateImageFromPrompt({ prompt: analysis.couldHaveGoneBetter.main, videoDataUri })
    ]);
    
    return {
      ...analysis,
      overthinkingScenarios,
      wentWellImage: wentWellImageResult.imageDataUri,
      couldHaveGoneBetterImage: couldHaveGoneBetterImageResult.imageDataUri,
    };
  } catch (error) {
    console.error("Error getting witty analysis:", error);
    if (error instanceof Error) {
        throw new Error(`Failed to generate analysis: ${error.message}`);
    }
    throw new Error('An unknown error occurred during analysis.');
  }
}

export async function generateScenarioImage(prompt: string, videoDataUri: string) {
  try {
    const { imageDataUri } = await generateImageFromPrompt({ prompt, videoDataUri });
    return imageDataUri;
  } catch (error) {
    console.error("Error generating image:", error);
    if (error instanceof Error) {
      throw new Error(`Failed to generate image: ${error.message}`);
    }
    throw new Error('An unknown error occurred during image generation.');
  }
}
