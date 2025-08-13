'use client';

import { useEffect, useState } from 'react';

interface Star {
  id: number;
  x: number;
  y: number;
  size: number;
  speed: number;
  opacity: number;
  centerX?: number;
  centerY?: number;
  angle?: number;
  distance?: number;
}

interface SpaceBackgroundProps {
  isHyperspace?: boolean;
  onHyperspaceComplete?: () => void;
}

export function SpaceBackground({ isHyperspace = false, onHyperspaceComplete }: SpaceBackgroundProps) {
  const [stars, setStars] = useState<Star[]>([]);
  const [hyperspaceIntensity, setHyperspaceIntensity] = useState(0);
  const [whiteOverlay, setWhiteOverlay] = useState(0);
  const [whiteCircleRadius, setWhiteCircleRadius] = useState(0);

  useEffect(() => {
    // Generate initial stars
    const generateStars = (isHyperspaceMode = false) => {
      const newStars: Star[] = [];
      const starCount = isHyperspaceMode ? 200 : 100;
      const centerX = window.innerWidth / 2;
      const centerY = window.innerHeight / 2;
      
      for (let i = 0; i < starCount; i++) {
        if (isHyperspaceMode) {
          // Hyperspace stars - positioned radially from center
          const angle = Math.random() * Math.PI * 2;
          const distance = Math.random() * Math.min(centerX, centerY) * 0.1; // Start close to center
          newStars.push({
            id: i,
            x: centerX + Math.cos(angle) * distance,
            y: centerY + Math.sin(angle) * distance,
            size: Math.random() * 3 + 1, // Start bigger for faster white coverage
            speed: Math.random() * 2 + 1,
            opacity: Math.random() * 0.8 + 0.2,
            centerX,
            centerY,
            angle,
            distance,
          });
        } else {
          // Normal stars
          newStars.push({
            id: i,
            x: Math.random() * window.innerWidth,
            y: Math.random() * window.innerHeight,
            size: Math.random() * 2 + 1,
            speed: Math.random() * 0.6 + 0.2,
            opacity: Math.random() * 0.8 + 0.2,
          });
        }
      }
      setStars(newStars);
    };

    generateStars(isHyperspace);

    // Handle window resize
    const handleResize = () => {
      generateStars(isHyperspace);
    };

    window.addEventListener('resize', handleResize);

    // Animation loop
    const animateStars = () => {
      if (isHyperspace) {
        // Hyperspace animation - stars zoom outward from center toward user
        setStars(prevStars => {
          // Calculate exponential boost once for the entire frame
          const exponentialBoost = Math.pow(1.1, hyperspaceIntensity * 2);
          
          const updatedStars = prevStars.map(star => {
            if (!star.centerX || !star.centerY || star.angle === undefined || star.distance === undefined) return star;
            
            // Accelerate outward from center with exponential growth
            const baseAcceleration = star.speed * (3 + hyperspaceIntensity * 5);
            const acceleration = baseAcceleration * exponentialBoost;
            const newDistance = star.distance + acceleration;
            const newX = star.centerX + Math.cos(star.angle) * newDistance;
            const newY = star.centerY + Math.sin(star.angle) * newDistance;
            
            // Remove star if it goes off screen - don't respawn
            if (newX < -50 || newX > window.innerWidth + 50 || newY < -50 || newY > window.innerHeight + 50) {
              return null; // Remove this star
            }
            
            return {
              ...star,
              x: newX,
              y: newY,
              distance: newDistance,
              size: star.size + (0.3 * exponentialBoost), // Stars grow much faster and unlimited
            };
          }).filter(star => star !== null); // Remove stars that went off screen

          // Don't add new stars - let them disappear naturally

          return updatedStars;
        });
      } else {
        // Normal horizontal movement
        setStars(prevStars =>
          prevStars.map(star => ({
            ...star,
            x: star.x + star.speed,
            // Reset star position when it goes off screen
            ...(star.x > window.innerWidth + 10 && {
              x: -10,
              y: Math.random() * window.innerHeight,
            }),
          }))
        );
      }
    };

    const interval = setInterval(animateStars, isHyperspace ? 20 : 60); // Faster updates for smoother acceleration

    return () => {
      window.removeEventListener('resize', handleResize);
      clearInterval(interval);
    };
  }, [isHyperspace, hyperspaceIntensity]);

  // Hyperspace effect controller
  useEffect(() => {
    if (isHyperspace) {
      let intensity = 0;
      const hyperspaceInterval = setInterval(() => {
        intensity += 0.2; // Faster buildup for quicker acceleration
        setHyperspaceIntensity(intensity);
        
        // Grow white circle from center - slow initially, then faster after 2 seconds
        const maxRadius = Math.max(window.innerWidth, window.innerHeight) * 0.8; // Enough to cover screen
        const timeElapsed = intensity / 0.2 * 0.06; // Convert intensity to approximate seconds
        let circleRadius;
        
        if (timeElapsed < 2) {
          // Slow growth for first 2 seconds
          circleRadius = Math.min(intensity * 15, maxRadius);
        } else {
          // Accelerated growth after 2 seconds
          const baseRadius = 2 * 0.2 / 0.06 * 15; // Radius at 2 seconds
          const extraTime = timeElapsed - 2;
          circleRadius = Math.min(baseRadius + (extraTime * extraTime * 50), maxRadius);
        }
        
        setWhiteCircleRadius(circleRadius);
        
        // Complete effect when white circle covers screen
        if (circleRadius >= maxRadius) {
          // Turn entire screen white at the end
          setWhiteOverlay(1);
          clearInterval(hyperspaceInterval);
          setTimeout(() => {
            onHyperspaceComplete?.();
          }, 500);
        }
      }, 60); // Even faster updates

      return () => clearInterval(hyperspaceInterval);
    } else {
      setHyperspaceIntensity(0);
      setWhiteOverlay(0);
      setWhiteCircleRadius(0);
    }
  }, [isHyperspace, onHyperspaceComplete]);

  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none">
      {stars.map(star => {
        if (isHyperspace && star.centerX && star.centerY && star.angle !== undefined && star.distance !== undefined) {
          // Hyperspace stars with streaking effect toward user
          const streakLength = Math.min(star.distance * 0.5, 150);
          const streakOpacity = Math.min(star.opacity * (1 + hyperspaceIntensity * 0.5), 1);
          
          return (
            <div key={star.id}>
              {/* Star streak - pointing toward center */}
              <div
                className="absolute"
                style={{
                  left: `${star.x}px`,
                  top: `${star.y}px`,
                  width: `${Math.max(streakLength, 2)}px`,
                  height: `2px`,
                  opacity: streakOpacity * 0.7,
                  transform: `rotate(${(star.angle * 180) / Math.PI + 180}deg)`, // Point toward center
                  transformOrigin: '0 50%',
                  background: `linear-gradient(90deg, rgba(255,255,255,0) 0%, rgba(255,255,255,${streakOpacity * 0.8}) 70%, rgba(255,255,255,${streakOpacity}) 100%)`,
                }}
              />
              {/* Star point */}
              <div
                className="absolute rounded-full bg-white"
                style={{
                  left: `${star.x - star.size/2}px`,
                  top: `${star.y - star.size/2}px`,
                  width: `${star.size}px`,
                  height: `${star.size}px`,
                  opacity: streakOpacity,
                  boxShadow: `0 0 ${star.size * 4}px rgba(255,255,255,${streakOpacity * 0.6})`,
                }}
              />
            </div>
          );
        }
        
        // Normal stars
        return (
          <div
            key={star.id}
            className="absolute rounded-full bg-white"
            style={{
              left: `${star.x - star.size/2}px`,
              top: `${star.y - star.size/2}px`,
              width: `${star.size}px`,
              height: `${star.size}px`,
              opacity: star.opacity,
            }}
          />
        );
      })}
      
      {/* White circle that expands from center like a white black hole */}
      {whiteCircleRadius > 0 && (
        <div
          className="fixed rounded-full bg-white pointer-events-none"
          style={{
            left: '50%',
            top: '50%',
            width: `${whiteCircleRadius * 2}px`,
            height: `${whiteCircleRadius * 2}px`,
            transform: 'translate(-50%, -50%)',
            opacity: 0.9,
            boxShadow: `0 0 ${whiteCircleRadius * 0.3}px rgba(255,255,255,0.8), 0 0 ${whiteCircleRadius * 0.6}px rgba(255,255,255,0.4)`,
          }}
        />
      )}
      
      {/* Final white screen overlay */}
      {whiteOverlay > 0 && (
        <div
          className="fixed inset-0 bg-white pointer-events-none"
          style={{
            opacity: whiteOverlay,
          }}
        />
      )}
    </div>
  );
}
