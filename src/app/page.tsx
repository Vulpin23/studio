'use client';

import { useState } from 'react';
import { AnalysisDashboard } from '@/components/app/analysis-dashboard';
import { SpaceBackground } from '@/components/app/space-background';

export default function Home() {
  const [isHyperspace, setIsHyperspace] = useState(false);
  const [showWhiteScreen, setShowWhiteScreen] = useState(false);

  const handleAnalyzeStart = () => {
    setIsHyperspace(true);
  };

  const handleHyperspaceComplete = () => {
    setIsHyperspace(false);
    setShowWhiteScreen(true);
    // Stay white with no text
  };

  if (showWhiteScreen) {
    return (
      <main className="flex min-h-screen bg-black relative">
        {/* White screen that matches the white circle styling */}
        <div
          className="fixed inset-0 bg-white"
          style={{
            opacity: 0.9,
            boxShadow: `0 0 100px rgba(255,255,255,0.8), 0 0 200px rgba(255,255,255,0.4)`,
          }}
        />
      </main>
    );
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4 sm:p-8 md:p-12 bg-black text-white relative overflow-hidden">
      <SpaceBackground 
        isHyperspace={isHyperspace} 
        onHyperspaceComplete={handleHyperspaceComplete}
      />
      <div className={`relative z-10 transition-opacity duration-500 ${isHyperspace ? 'opacity-0' : 'opacity-100'}`}>
        <AnalysisDashboard onAnalyzeStart={handleAnalyzeStart} />
      </div>
    </main>
  );
}
