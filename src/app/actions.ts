'use server';

import { extractVideoDetails } from '@/ai/flows/extract-video-details';
import { generateWittyAnalysis, GenerateWittyAnalysisOutput } from '@/ai/flows/generate-witty-analysis';

export async function getWittyAnalysisForVideo(videoDataUri: string): Promise<GenerateWittyAnalysisOutput> {
  try {
    const { eventsAndOutcomes } = await extractVideoDetails({ videoDataUri });
    
    const eventDetails = eventsAndOutcomes.join('\n');
    const outcomeDetails = eventsAndOutcomes.join('\n');

    if (!eventDetails) {
      throw new Error("Could not extract any events from the video.");
    }
    
    const analysis = await generateWittyAnalysis({
      eventDetails,
      outcomeDetails,
    });
    
    return analysis;
  } catch (error) {
    console.error("Error getting witty analysis:", error);
    if (error instanceof Error) {
        throw new Error(`Failed to generate analysis: ${error.message}`);
    }
    throw new Error('An unknown error occurred during analysis.');
  }
}
