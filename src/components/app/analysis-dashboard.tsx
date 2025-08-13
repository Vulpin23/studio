'use client';

import { useState, useTransition, useRef, useEffect } from 'react';
import { Upload, Sparkles, Lock, Unlock, Loader2, Info, Camera } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { getWittyAnalysisForVideo, generateScenarioImage } from '@/app/actions';
import type { FullAnalysis } from '@/app/actions';
import { cn } from '@/lib/utils';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Separator } from '@/components/ui/separator';

function OverthinkingCard({ scenario, onGenerate, generatedImage, isGenerating }: {
  scenario: string;
  onGenerate: () => void;
  generatedImage: string | null;
  isGenerating: boolean;
}) {
  return (
    <Card className="flex flex-col">
      <CardHeader>
        <CardTitle className="font-headline text-2xl flex items-center gap-2">Overthinking Box</CardTitle>
      </CardHeader>
      <CardContent className="flex-grow flex flex-col gap-4">
        <p className="text-base flex-grow">{scenario}</p>
        {generatedImage ? (
          <img src={generatedImage} className="w-full aspect-video object-cover rounded-md" alt="Generated scenario" />
        ) : (
          <Button onClick={onGenerate} disabled={isGenerating}>
            {isGenerating ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Camera className="mr-2 h-4 w-4" />}
            {isGenerating ? 'Generating...' : 'Generate Image'}
          </Button>
        )}
      </CardContent>
    </Card>
  );
}


export function AnalysisDashboard() {
  const [analysis, setAnalysis] = useState<FullAnalysis | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [betterViewed, setBetterViewed] = useState(false);
  const [worseViewed, setWorseViewed] = useState(false);
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [videoPreview, setVideoPreview] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const [generatingImage, setGeneratingImage] = useState<'scenario1' | 'scenario2' | null>(null);
  const [generatedImages, setGeneratedImages] = useState<{scenario1: string | null; scenario2: string | null}>({ scenario1: null, scenario2: null });
  const [videoDataUri, setVideoDataUri] = useState<string | null>(null);

  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const isUnlocked = betterViewed && worseViewed;

  useEffect(() => {
    if (isUnlocked) {
      toast({
        title: "Conclusion Unlocked!",
        description: "You've faced the good and the bad. Time for the punchline.",
      });
    }
  }, [isUnlocked, toast]);
  
  const resetState = () => {
    setAnalysis(null);
    setError(null);
    setBetterViewed(false);
    setWorseViewed(false);
    setGeneratedImages({ scenario1: null, scenario2: null });
    setGeneratingImage(null);
    setVideoDataUri(null);
  }

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setVideoFile(file);
      resetState();
      const previewUrl = URL.createObjectURL(file);
      setVideoPreview(previewUrl);

      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onloadend = () => {
        setVideoDataUri(reader.result as string);
      };
    }
  };
  
  const handleAnalyzeClick = () => {
    if (!videoFile || !videoDataUri) {
      toast({
        title: 'No video selected',
        description: 'Please select a video file to analyze.',
        variant: 'destructive',
      });
      return;
    }

    resetState();
    setVideoDataUri(videoDataUri); // re-set it because resetState clears it

    startTransition(async () => {
      try {
        const result = await getWittyAnalysisForVideo(videoDataUri);
        setAnalysis(result);
      } catch (e) {
        const errorMessage = e instanceof Error ? e.message : 'An unknown error occurred.';
        setError(errorMessage);
        toast({
          title: 'Analysis Failed',
          description: errorMessage,
          variant: 'destructive',
        });
      }
    });
  };

  const handleCardClick = (card: 'better' | 'worse') => {
    if (card === 'better') setBetterViewed(true);
    if (card === 'worse') setWorseViewed(true);
  };
  
  const handleGenerateImage = (scenarioKey: 'scenario1' | 'scenario2') => {
    if (!analysis || !videoDataUri) return;
    const prompt = analysis.overthinkingScenarios[scenarioKey];
    setGeneratingImage(scenarioKey);
    startTransition(async () => {
      try {
        const imageDataUri = await generateScenarioImage(prompt, videoDataUri);
        setGeneratedImages(prev => ({...prev, [scenarioKey]: imageDataUri}));
      } catch (e) {
        const errorMessage = e instanceof Error ? e.message : 'An unknown error occurred.';
        toast({
          title: 'Image Generation Failed',
          description: errorMessage,
          variant: 'destructive',
        });
      } finally {
        setGeneratingImage(null);
      }
    });
  }

  return (
    <div className="w-full max-w-7xl mx-auto flex flex-col items-center gap-8">
      <header className="text-center">
        <h1 className="text-5xl md:text-6xl font-headline text-primary">Overthinking.ai</h1>
        <p className="mt-2 text-lg text-muted-foreground">Turn your day into a witty breakdown.</p>
      </header>

      <Card className="w-full max-w-lg p-6">
        <div className="flex flex-col items-center gap-4">
            <div
                className="w-full h-48 border-2 border-dashed rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-primary transition-colors"
                onClick={() => fileInputRef.current?.click()}
            >
                {videoPreview ? (
                    <video src={videoPreview} className="h-full w-full object-contain rounded-md" controls />
                ) : (
                    <>
                        <Upload className="w-12 h-12 text-muted-foreground" />
                        <p className="mt-2 text-muted-foreground">Click to upload a video</p>
                    </>
                )}
            </div>
          <Input
            ref={fileInputRef}
            type="file"
            accept="video/*"
            onChange={handleFileChange}
            className="hidden"
          />
          <Button onClick={handleAnalyzeClick} disabled={isPending || !videoFile} className="w-full">
            {isPending && !generatingImage ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Sparkles className="mr-2 h-4 w-4" />}
            {isPending && !generatingImage ? 'Overthinking...' : 'Analyze My Day'}
          </Button>
        </div>
      </Card>

      {error && !isPending && (
        <Alert variant="destructive" className="w-full max-w-4xl">
            <Info className="h-4 w-4" />
          <AlertTitle>Oops! Something went wrong.</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {analysis && (
        <section className="w-full max-w-7xl grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-in fade-in duration-500">
          <Card
            onClick={() => handleCardClick('worse')}
            className={cn("cursor-pointer transition-all duration-300 hover:shadow-lg hover:scale-105", worseViewed && "ring-2 ring-primary")}
          >
            <CardHeader>
              <CardTitle className="font-headline text-2xl">Could've Gone Better</CardTitle>
            </CardHeader>
            <CardContent>
              <img src={analysis.couldHaveGoneBetterImage} alt="Could've gone better" className="w-full aspect-video object-cover rounded-md mb-4" />
              <p className="text-base">{analysis.couldHaveGoneBetter.main}</p>
              <Separator className="my-4" />
              <CardDescription className="italic">
                <span className="font-semibold not-italic">Devil's Advocate:</span> {analysis.couldHaveGoneBetter.devilsAdvocate}
              </CardDescription>
            </CardContent>
          </Card>
          <Card
            onClick={() => handleCardClick('better')}
            className={cn("cursor-pointer transition-all duration-300 hover:shadow-lg hover:scale-105", betterViewed && "ring-2 ring-primary")}
          >
            <CardHeader>
              <CardTitle className="font-headline text-2xl">Went Well</CardTitle>
            </CardHeader>
            <CardContent>
              <img src={analysis.wentWellImage} alt="Went well" className="w-full aspect-video object-cover rounded-md mb-4" />
              <p className="text-base">{analysis.wentWell.main}</p>
              <Separator className="my-4" />
              <CardDescription className="italic">
                 <span className="font-semibold not-italic">Devil's Advocate:</span> {analysis.wentWell.devilsAdvocate}
              </CardDescription>
            </CardContent>
          </Card>
          <div className="relative">
             <Card className={cn(
                "transition-all duration-700 ease-in-out",
                !isUnlocked && "blur-md opacity-60"
             )}>
                <CardHeader>
                <CardTitle className="font-headline text-2xl">Conclusion</CardTitle>
                </CardHeader>
                <CardContent>
                <p className="text-base">{analysis.conclusion}</p>
                </CardContent>
            </Card>
            {!isUnlocked && (
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-background/50 rounded-lg">
                    <Lock className="w-16 h-16 text-primary" />
                    <p className="mt-4 font-semibold text-center text-foreground">Click the other two cards to unlock</p>
                </div>
            )}
            {isUnlocked && (
                <div className="absolute -top-3 -right-3">
                    <span className="relative flex h-8 w-8">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-8 w-8 bg-accent items-center justify-center">
                            <Unlock className="w-5 h-5 text-accent-foreground" />
                        </span>
                    </span>
                </div>
            )}
          </div>
        </section>
      )}

      {analysis && (
         <section className="w-full max-w-7xl mt-4 grid grid-cols-1 md:grid-cols-2 gap-6 animate-in fade-in duration-500">
            <OverthinkingCard
                scenario={analysis.overthinkingScenarios.scenario1}
                onGenerate={() => handleGenerateImage('scenario1')}
                generatedImage={generatedImages.scenario1}
                isGenerating={generatingImage === 'scenario1'}
                />
            <OverthinkingCard
                scenario={analysis.overthinkingScenarios.scenario2}
                onGenerate={() => handleGenerateImage('scenario2')}
                generatedImage={generatedImages.scenario2}
                isGenerating={generatingImage === 'scenario2'}
                />
         </section>
      )}

    </div>
  );
}
