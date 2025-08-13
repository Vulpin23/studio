'use client';

import { useState } from 'react';
import { AnalysisDashboard } from '@/components/app/analysis-dashboard';
import { SpaceBackground } from '@/components/app/space-background';

export default function Home() {
  const [isHyperspace, setIsHyperspace] = useState(false);
  const [showWhiteScreen, setShowWhiteScreen] = useState(false);
  const [showAngel, setShowAngel] = useState(false);
  const [showFireEffects, setShowFireEffects] = useState(false);
  const [showLoading, setShowLoading] = useState(false);

  const handleAnalyzeStart = () => {
    setIsHyperspace(true);
  };

  const handleHyperspaceComplete = () => {
    setIsHyperspace(false);
    setShowWhiteScreen(true);
    // Fade in angel and fire effects together after a short delay
    setTimeout(() => {
      setShowAngel(true);
      setShowFireEffects(true);
    }, 1000);
  };

  if (showLoading) {
    return (
      <main className="flex min-h-screen bg-black text-white relative overflow-hidden items-center justify-center">
        <SpaceBackground />
        <div className="relative z-10 text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-white mx-auto mb-4"></div>
          <h2 className="text-2xl font-headline text-white mb-2">Analyzing Your Day...</h2>
          <p className="text-lg text-gray-300">Generating good & bad scenarios</p>
          <div className="mt-6 w-64 bg-gray-700 rounded-full h-2 mx-auto">
            <div className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full animate-pulse" style={{
              width: '100%',
              animation: 'loadingBar 15s linear forwards'
            }}></div>
          </div>
        </div>
      </main>
    );
  }

  if (showWhiteScreen) {
    return (
      <main className="flex min-h-screen bg-white relative">
        {/* Angel image fading in on the far left */}
        {showAngel && (
          <img
            src="/angel3.png"
            alt="Angel"
            className={`fixed left-0 top-1/2 transform -translate-y-1/2 transition-opacity duration-2000 z-10 ${
              showAngel ? 'opacity-100' : 'opacity-0'
            }`}
            style={{
              maxHeight: '50vh', // Made smaller (was 60vh)
              width: 'auto',
            }}
          />
        )}
        {/* Star video to the right of the angel */}
        {showAngel && (
          <video
            src="/star.mp4"
            autoPlay
            loop
            muted
            playsInline
            className={`fixed left-80 top-1/2 transform -translate-y-1/2 transition-opacity duration-2000 z-10 ${
              showAngel ? 'opacity-100' : 'opacity-0'
            }`}
            style={{
              maxHeight: '40vh',
              width: 'auto',
            }}
          />
        )}
        {/* Campfire explosion video on the right side */}
        {showAngel && (
          <video
            src="/campfireexplosion.mp4"
            autoPlay
            loop
            muted
            playsInline
            className={`fixed right-72 top-1/2 transform -translate-y-1/2 transition-opacity duration-2000 z-10 ${
              showAngel ? 'opacity-100' : 'opacity-0'
            }`}
            style={{
              maxHeight: '30vh',
              width: 'auto',
            }}
          />
        )}
        {/* Devil image on the right side */}
        {showAngel && (
          <img
            src="/devil.png"
            alt="Devil"
            className={`fixed right-0 top-1/2 transform -translate-y-1/2 transition-opacity duration-2000 z-20 ${
              showAngel ? 'opacity-100' : 'opacity-0'
            }`}
            style={{
              maxHeight: '50vh',
              width: 'auto',
            }}
          />
        )}
        {/* Dynamic fire effects around the whole screen */}
        {showFireEffects && (
          <>
            {/* Top edge fire waves */}
            <div
              className={`fixed top-0 left-0 w-full transition-opacity duration-1000 z-5 ${
                showFireEffects ? 'opacity-60' : 'opacity-0'
              }`}
              style={{
                height: '150px',
                background: 'linear-gradient(180deg, rgba(255,69,0,0.7) 0%, rgba(255,140,0,0.5) 40%, rgba(255,215,0,0.3) 70%, transparent 100%)',
                filter: 'blur(15px)',
                animation: 'fireWave 3s ease-in-out infinite alternate',
                clipPath: 'polygon(0 0, 100% 0, 95% 60%, 85% 80%, 75% 70%, 65% 90%, 55% 75%, 45% 85%, 35% 70%, 25% 80%, 15% 65%, 5% 75%, 0 60%)',
              }}
            />
            
            {/* Bottom edge fire waves */}
            <div
              className={`fixed bottom-0 left-0 w-full transition-opacity duration-1000 z-5 ${
                showFireEffects ? 'opacity-50' : 'opacity-0'
              }`}
              style={{
                height: '120px',
                background: 'linear-gradient(0deg, rgba(255,0,0,0.8) 0%, rgba(255,69,0,0.6) 30%, rgba(255,140,0,0.4) 60%, transparent 100%)',
                filter: 'blur(12px)',
                animation: 'fireWave 2.5s ease-in-out infinite alternate-reverse',
                clipPath: 'polygon(0 100%, 10% 40%, 20% 60%, 30% 35%, 40% 55%, 50% 30%, 60% 50%, 70% 25%, 80% 45%, 90% 20%, 95% 40%, 100% 100%)',
              }}
            />

            {/* Left edge fire tongues */}
            <div
              className={`fixed left-0 top-0 h-full transition-opacity duration-1000 z-5 ${
                showFireEffects ? 'opacity-40' : 'opacity-0'
              }`}
              style={{
                width: '100px',
                background: 'linear-gradient(90deg, rgba(255,140,0,0.6) 0%, rgba(255,215,0,0.4) 50%, transparent 100%)',
                filter: 'blur(10px)',
                animation: 'fireTongue 4s ease-in-out infinite alternate',
                clipPath: 'polygon(0 0, 70% 5%, 80% 15%, 60% 25%, 75% 35%, 50% 45%, 70% 55%, 45% 65%, 65% 75%, 40% 85%, 60% 95%, 0 100%)',
              }}
            />

            {/* Right edge fire tongues */}
            <div
              className={`fixed right-0 top-0 h-full transition-opacity duration-1000 z-5 ${
                showFireEffects ? 'opacity-45' : 'opacity-0'
              }`}
              style={{
                width: '120px',
                background: 'linear-gradient(270deg, rgba(255,69,0,0.7) 0%, rgba(255,140,0,0.5) 40%, transparent 100%)',
                filter: 'blur(12px)',
                animation: 'fireTongue 3.5s ease-in-out infinite alternate-reverse',
                clipPath: 'polygon(100% 0, 30% 10%, 40% 20%, 25% 30%, 45% 40%, 20% 50%, 40% 60%, 15% 70%, 35% 80%, 10% 90%, 30% 100%, 100% 100%)',
              }}
            />

            {/* Floating fire particles across screen */}
            <div
              className={`fixed top-1/4 left-1/4 transition-opacity duration-1000 z-5 ${
                showFireEffects ? 'opacity-30' : 'opacity-0'
              }`}
              style={{
                width: '60px',
                height: '80px',
                background: 'radial-gradient(ellipse, rgba(255,215,0,0.8) 0%, rgba(255,140,0,0.4) 60%, transparent 100%)',
                borderRadius: '60% 40% 70% 30%',
                filter: 'blur(8px)',
                animation: 'floatingFire 5s ease-in-out infinite',
              }}
            />
            
            <div
              className={`fixed top-3/4 right-1/3 transition-opacity duration-1000 z-5 ${
                showFireEffects ? 'opacity-35' : 'opacity-0'
              }`}
              style={{
                width: '70px',
                height: '90px',
                background: 'radial-gradient(ellipse, rgba(255,69,0,0.7) 0%, rgba(255,215,0,0.3) 70%, transparent 100%)',
                borderRadius: '50% 60% 40% 70%',
                filter: 'blur(10px)',
                animation: 'floatingFire 4s ease-in-out infinite reverse',
              }}
            />

            <div
              className={`fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 transition-opacity duration-1000 z-5 ${
                showFireEffects ? 'opacity-25' : 'opacity-0'
              }`}
              style={{
                width: '100px',
                height: '120px',
                background: 'radial-gradient(ellipse, rgba(255,140,0,0.6) 0%, rgba(255,215,0,0.2) 80%, transparent 100%)',
                borderRadius: '70% 30% 60% 40%',
                filter: 'blur(15px)',
                animation: 'floatingFire 6s ease-in-out infinite alternate',
              }}
            />
          </>
        )}
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
