'use server';

import { extractVideoDetails } from '@/ai/flows/extract-video-details';
import { generateWittyAnalysis, GenerateWittyAnalysisOutput } from '@/ai/flows/generate-witty-analysis';
import { generateOverthinkingScenarios, GenerateOverthinkingScenariosOutput } from '@/ai/flows/generate-overthinking-scenarios';
import { generateVideoFromPrompt } from '@/ai/flows/generate-video-from-prompt';

export interface FullAnalysis extends GenerateWittyAnalysisOutput {
  overthinkingScenarios: GenerateOverthinkingScenariosOutput;
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
    
    return {
      ...analysis,
      overthinkingScenarios
    };
  } catch (error) {
    console.error("Error getting witty analysis:", error);
    if (error instanceof Error) {
        throw new Error(`Failed to generate analysis: ${error.message}`);
    }
    throw new Error('An unknown error occurred during analysis.');
  }
}

export async function generateScenarioVideo(prompt: string) {
  try {
    const { videoDataUri } = await generateVideoFromPrompt({ prompt });
    return videoDataUri;
  } catch (error) {
    console.error("Error generating video:", error);
    if (error instanceof Error) {
      throw new Error(`Failed to generate video: ${error.message}`);
    }
    throw new Error('An unknown error occurred during video generation.');
  }
}
