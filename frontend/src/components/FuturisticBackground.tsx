/**
 * FUTURISTIC BACKGROUND ANIMATION
 * 
 * Subtle, elegant animated background with:
 * - Softly glowing purple rounded squares
 * - Thin connecting lines
 * - Slow parallax movement
 * - Multiple depth layers for 3D effect
 */

import React, { useEffect, useState } from 'react';

interface FloatingElement {
  id: number;
  x: number;
  y: number;
  size: number;
  opacity: number;
  delay: number;
  duration: number;
  layer: number; // 1 = far (slow), 2 = mid, 3 = near (faster)
}

interface FloatingLine {
  id: number;
  x1: number;
  y1: number;
  angle: number;
  length: number;
  opacity: number;
  delay: number;
  duration: number;
  layer: number;
}

export const FuturisticBackground: React.FC = () => {
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Generate floating squares
  const squares: FloatingElement[] = [
    // Far layer (slowest movement)
    { id: 1, x: 5, y: 10, size: 60, opacity: 0.03, delay: 0, duration: 25, layer: 1 },
    { id: 2, x: 85, y: 15, size: 80, opacity: 0.025, delay: 2, duration: 30, layer: 1 },
    { id: 3, x: 15, y: 60, size: 50, opacity: 0.035, delay: 5, duration: 28, layer: 1 },
    { id: 4, x: 75, y: 70, size: 70, opacity: 0.03, delay: 3, duration: 32, layer: 1 },
    
    // Mid layer
    { id: 5, x: 25, y: 25, size: 40, opacity: 0.04, delay: 1, duration: 20, layer: 2 },
    { id: 6, x: 70, y: 35, size: 35, opacity: 0.045, delay: 4, duration: 22, layer: 2 },
    { id: 7, x: 10, y: 80, size: 45, opacity: 0.04, delay: 2, duration: 18, layer: 2 },
    { id: 8, x: 90, y: 55, size: 30, opacity: 0.05, delay: 6, duration: 24, layer: 2 },
    
    // Near layer (fastest movement)
    { id: 9, x: 40, y: 20, size: 25, opacity: 0.06, delay: 0, duration: 15, layer: 3 },
    { id: 10, x: 60, y: 75, size: 20, opacity: 0.055, delay: 3, duration: 16, layer: 3 },
    { id: 11, x: 30, y: 50, size: 22, opacity: 0.05, delay: 5, duration: 14, layer: 3 },
    { id: 12, x: 80, y: 85, size: 28, opacity: 0.045, delay: 2, duration: 17, layer: 3 },
  ];

  // Generate thin lines
  const lines: FloatingLine[] = [
    // Diagonal lines at various angles
    { id: 1, x1: 10, y1: 20, angle: 45, length: 150, opacity: 0.04, delay: 0, duration: 30, layer: 1 },
    { id: 2, x1: 80, y1: 30, angle: -30, length: 120, opacity: 0.035, delay: 3, duration: 35, layer: 1 },
    { id: 3, x1: 20, y1: 70, angle: 60, length: 100, opacity: 0.03, delay: 5, duration: 28, layer: 1 },
    { id: 4, x1: 70, y1: 80, angle: -45, length: 130, opacity: 0.04, delay: 2, duration: 32, layer: 1 },
    
    { id: 5, x1: 35, y1: 15, angle: 30, length: 80, opacity: 0.05, delay: 1, duration: 22, layer: 2 },
    { id: 6, x1: 65, y1: 60, angle: -60, length: 90, opacity: 0.045, delay: 4, duration: 25, layer: 2 },
    { id: 7, x1: 15, y1: 45, angle: 15, length: 70, opacity: 0.04, delay: 6, duration: 20, layer: 2 },
    { id: 8, x1: 85, y1: 40, angle: -15, length: 85, opacity: 0.05, delay: 0, duration: 23, layer: 2 },
  ];

  // Calculate parallax offset based on layer
  const getParallaxOffset = (layer: number) => {
    const multiplier = layer === 1 ? 0.02 : layer === 2 ? 0.05 : 0.08;
    return scrollY * multiplier;
  };

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden" style={{ zIndex: 0 }}>
      {/* Gradient overlay for depth */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-background/50 to-background" />
      
      {/* Floating Squares */}
      {squares.map((square) => (
        <div
          key={`square-${square.id}`}
          className="absolute rounded-2xl"
          style={{
            left: `${square.x}%`,
            top: `${square.y}%`,
            width: square.size,
            height: square.size,
            opacity: square.opacity,
            background: `linear-gradient(135deg, 
              hsl(270 95% 60% / ${square.opacity * 15}) 0%, 
              hsl(270 80% 50% / ${square.opacity * 10}) 100%)`,
            boxShadow: `0 0 ${square.size * 0.8}px hsl(270 95% 60% / ${square.opacity * 8}),
                        inset 0 0 ${square.size * 0.3}px hsl(270 100% 70% / ${square.opacity * 5})`,
            transform: `translateY(${-getParallaxOffset(square.layer)}px) rotate(${12 + square.id * 3}deg)`,
            animation: `float-gentle ${square.duration}s ease-in-out infinite`,
            animationDelay: `${square.delay}s`,
            transition: 'transform 0.1s ease-out',
          }}
        />
      ))}
      
      {/* Thin Lines */}
      <svg className="absolute inset-0 w-full h-full">
        {lines.map((line) => {
          const x2 = line.x1 + Math.cos(line.angle * Math.PI / 180) * (line.length / 10);
          const y2 = line.y1 + Math.sin(line.angle * Math.PI / 180) * (line.length / 10);
          const parallaxY = getParallaxOffset(line.layer);
          
          return (
            <line
              key={`line-${line.id}`}
              x1={`${line.x1}%`}
              y1={`calc(${line.y1}% - ${parallaxY}px)`}
              x2={`${x2}%`}
              y2={`calc(${y2}% - ${parallaxY}px)`}
              stroke="url(#lineGradient)"
              strokeWidth="1"
              opacity={line.opacity}
              style={{
                animation: `line-drift ${line.duration}s ease-in-out infinite`,
                animationDelay: `${line.delay}s`,
              }}
            />
          );
        })}
        
        {/* Gradient definition for lines */}
        <defs>
          <linearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="hsl(270 95% 60%)" stopOpacity="0" />
            <stop offset="50%" stopColor="hsl(270 95% 60%)" stopOpacity="1" />
            <stop offset="100%" stopColor="hsl(270 95% 60%)" stopOpacity="0" />
          </linearGradient>
        </defs>
      </svg>
      
      {/* Soft glow orbs in background */}
      <div 
        className="absolute w-[500px] h-[500px] rounded-full blur-[120px]"
        style={{
          left: '10%',
          top: '20%',
          background: 'radial-gradient(circle, hsl(270 95% 60% / 0.08) 0%, transparent 70%)',
          transform: `translateY(${-scrollY * 0.03}px)`,
          animation: 'pulse-slow 8s ease-in-out infinite',
        }}
      />
      <div 
        className="absolute w-[600px] h-[600px] rounded-full blur-[150px]"
        style={{
          right: '5%',
          bottom: '10%',
          background: 'radial-gradient(circle, hsl(270 80% 50% / 0.06) 0%, transparent 70%)',
          transform: `translateY(${-scrollY * 0.02}px)`,
          animation: 'pulse-slow 10s ease-in-out infinite',
          animationDelay: '2s',
        }}
      />
      <div 
        className="absolute w-[400px] h-[400px] rounded-full blur-[100px]"
        style={{
          left: '50%',
          top: '50%',
          marginLeft: '-200px',
          marginTop: '-200px',
          background: 'radial-gradient(circle, hsl(280 90% 55% / 0.05) 0%, transparent 70%)',
          transform: `translateY(${-scrollY * 0.04}px)`,
          animation: 'pulse-slow 12s ease-in-out infinite',
          animationDelay: '4s',
        }}
      />
      
      {/* CSS Animations */}
      <style>{`
        @keyframes float-gentle {
          0%, 100% {
            transform: translateY(0px) rotate(var(--rotation, 12deg));
          }
          50% {
            transform: translateY(-20px) rotate(calc(var(--rotation, 12deg) + 5deg));
          }
        }
        
        @keyframes line-drift {
          0%, 100% {
            transform: translateX(0px) translateY(0px);
            opacity: var(--base-opacity, 0.04);
          }
          25% {
            transform: translateX(10px) translateY(-5px);
            opacity: calc(var(--base-opacity, 0.04) * 1.2);
          }
          50% {
            transform: translateX(5px) translateY(-10px);
            opacity: var(--base-opacity, 0.04);
          }
          75% {
            transform: translateX(-5px) translateY(-5px);
            opacity: calc(var(--base-opacity, 0.04) * 0.8);
          }
        }
        
        @keyframes pulse-slow {
          0%, 100% {
            opacity: 1;
            transform: scale(1);
          }
          50% {
            opacity: 0.7;
            transform: scale(1.05);
          }
        }
      `}</style>
    </div>
  );
};

export default FuturisticBackground;
