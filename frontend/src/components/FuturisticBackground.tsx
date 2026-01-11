/**
 * FUTURISTIC BACKGROUND ANIMATION
 * 
 * Subtle, elegant animated background with:
 * - Softly glowing purple rounded squares
 * - Thin connecting lines
 * - Slow parallax movement
 * - Multiple depth layers for 3D effect
 * 
 * ENHANCED: Increased visibility while maintaining elegance
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
  layer: number;
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

  // Generate floating squares - INCREASED OPACITY for better visibility
  const squares: FloatingElement[] = [
    // Far layer (slowest movement)
    { id: 1, x: 5, y: 10, size: 80, opacity: 0.08, delay: 0, duration: 25, layer: 1 },
    { id: 2, x: 85, y: 15, size: 100, opacity: 0.06, delay: 2, duration: 30, layer: 1 },
    { id: 3, x: 15, y: 60, size: 70, opacity: 0.07, delay: 5, duration: 28, layer: 1 },
    { id: 4, x: 75, y: 70, size: 90, opacity: 0.06, delay: 3, duration: 32, layer: 1 },
    
    // Mid layer
    { id: 5, x: 25, y: 25, size: 50, opacity: 0.09, delay: 1, duration: 20, layer: 2 },
    { id: 6, x: 70, y: 35, size: 45, opacity: 0.08, delay: 4, duration: 22, layer: 2 },
    { id: 7, x: 10, y: 80, size: 55, opacity: 0.07, delay: 2, duration: 18, layer: 2 },
    { id: 8, x: 90, y: 55, size: 40, opacity: 0.09, delay: 6, duration: 24, layer: 2 },
    
    // Near layer (fastest movement)
    { id: 9, x: 40, y: 20, size: 35, opacity: 0.1, delay: 0, duration: 15, layer: 3 },
    { id: 10, x: 60, y: 75, size: 30, opacity: 0.09, delay: 3, duration: 16, layer: 3 },
    { id: 11, x: 30, y: 50, size: 32, opacity: 0.08, delay: 5, duration: 14, layer: 3 },
    { id: 12, x: 80, y: 85, size: 38, opacity: 0.07, delay: 2, duration: 17, layer: 3 },
  ];

  // Generate thin lines - INCREASED OPACITY
  const lines: FloatingLine[] = [
    { id: 1, x1: 10, y1: 20, angle: 45, length: 200, opacity: 0.08, delay: 0, duration: 30, layer: 1 },
    { id: 2, x1: 80, y1: 30, angle: -30, length: 180, opacity: 0.07, delay: 3, duration: 35, layer: 1 },
    { id: 3, x1: 20, y1: 70, angle: 60, length: 150, opacity: 0.06, delay: 5, duration: 28, layer: 1 },
    { id: 4, x1: 70, y1: 80, angle: -45, length: 170, opacity: 0.08, delay: 2, duration: 32, layer: 1 },
    
    { id: 5, x1: 35, y1: 15, angle: 30, length: 120, opacity: 0.09, delay: 1, duration: 22, layer: 2 },
    { id: 6, x1: 65, y1: 60, angle: -60, length: 130, opacity: 0.08, delay: 4, duration: 25, layer: 2 },
    { id: 7, x1: 15, y1: 45, angle: 15, length: 100, opacity: 0.07, delay: 6, duration: 20, layer: 2 },
    { id: 8, x1: 85, y1: 40, angle: -15, length: 110, opacity: 0.09, delay: 0, duration: 23, layer: 2 },
  ];

  const getParallaxOffset = (layer: number) => {
    const multiplier = layer === 1 ? 0.02 : layer === 2 ? 0.05 : 0.08;
    return scrollY * multiplier;
  };

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden" style={{ zIndex: 1 }}>
      {/* Floating Squares with enhanced glow */}
      {squares.map((square) => (
        <div
          key={`square-${square.id}`}
          className="absolute rounded-2xl animate-float-gentle"
          style={{
            left: `${square.x}%`,
            top: `${square.y}%`,
            width: square.size,
            height: square.size,
            background: `linear-gradient(135deg, 
              hsl(270 80% 65% / ${square.opacity}) 0%, 
              hsl(280 70% 55% / ${square.opacity * 0.7}) 100%)`,
            boxShadow: `0 0 ${square.size}px hsl(270 90% 60% / ${square.opacity * 0.6}),
                        0 0 ${square.size * 2}px hsl(270 90% 60% / ${square.opacity * 0.3})`,
            transform: `translateY(${-getParallaxOffset(square.layer)}px) rotate(${12 + square.id * 3}deg)`,
            animationDuration: `${square.duration}s`,
            animationDelay: `${square.delay}s`,
            transition: 'transform 0.15s ease-out',
          }}
        />
      ))}
      
      {/* Thin Lines SVG */}
      <svg className="absolute inset-0 w-full h-full" style={{ overflow: 'visible' }}>
        <defs>
          <linearGradient id="lineGradientPurple" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="hsl(270 90% 65%)" stopOpacity="0" />
            <stop offset="50%" stopColor="hsl(270 90% 65%)" stopOpacity="1" />
            <stop offset="100%" stopColor="hsl(270 90% 65%)" stopOpacity="0" />
          </linearGradient>
        </defs>
        {lines.map((line) => {
          const x2 = line.x1 + Math.cos(line.angle * Math.PI / 180) * (line.length / 8);
          const y2 = line.y1 + Math.sin(line.angle * Math.PI / 180) * (line.length / 8);
          const parallaxY = getParallaxOffset(line.layer);
          
          return (
            <line
              key={`line-${line.id}`}
              x1={`${line.x1}%`}
              y1={`${line.y1}%`}
              x2={`${x2}%`}
              y2={`${y2}%`}
              stroke="url(#lineGradientPurple)"
              strokeWidth="1.5"
              opacity={line.opacity}
              className="animate-line-drift"
              style={{
                transform: `translateY(${-parallaxY}px)`,
                animationDuration: `${line.duration}s`,
                animationDelay: `${line.delay}s`,
              }}
            />
          );
        })}
      </svg>
      
      {/* Large soft glow orbs - ENHANCED */}
      <div 
        className="absolute rounded-full blur-[100px] animate-pulse-slow"
        style={{
          left: '5%',
          top: '15%',
          width: '400px',
          height: '400px',
          background: 'radial-gradient(circle, hsl(270 90% 60% / 0.15) 0%, transparent 70%)',
          transform: `translateY(${-scrollY * 0.03}px)`,
        }}
      />
      <div 
        className="absolute rounded-full blur-[120px] animate-pulse-slow"
        style={{
          right: '0%',
          bottom: '20%',
          width: '500px',
          height: '500px',
          background: 'radial-gradient(circle, hsl(280 85% 55% / 0.12) 0%, transparent 70%)',
          transform: `translateY(${-scrollY * 0.02}px)`,
          animationDelay: '3s',
        }}
      />
      <div 
        className="absolute rounded-full blur-[80px] animate-pulse-slow"
        style={{
          left: '40%',
          top: '40%',
          width: '350px',
          height: '350px',
          background: 'radial-gradient(circle, hsl(265 95% 60% / 0.1) 0%, transparent 70%)',
          transform: `translateY(${-scrollY * 0.04}px)`,
          animationDelay: '5s',
        }}
      />
      
      {/* CSS Animations as global styles */}
      <style>{`
        @keyframes float-gentle {
          0%, 100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-25px);
          }
        }
        
        @keyframes line-drift {
          0%, 100% {
            transform: translateX(0px) translateY(0px);
          }
          33% {
            transform: translateX(15px) translateY(-8px);
          }
          66% {
            transform: translateX(-10px) translateY(-15px);
          }
        }
        
        @keyframes pulse-slow {
          0%, 100% {
            opacity: 1;
            transform: scale(1);
          }
          50% {
            opacity: 0.6;
            transform: scale(1.08);
          }
        }
        
        .animate-float-gentle {
          animation: float-gentle ease-in-out infinite;
        }
        
        .animate-line-drift {
          animation: line-drift ease-in-out infinite;
        }
        
        .animate-pulse-slow {
          animation: pulse-slow 10s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
};

export default FuturisticBackground;
