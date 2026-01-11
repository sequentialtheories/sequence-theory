/**
 * FUTURISTIC BACKGROUND ANIMATION
 * 
 * Visible, elegant animated background with:
 * - Glowing purple rounded squares
 * - Thin connecting lines
 * - Slow parallax movement
 * - Multiple depth layers for 3D effect
 * 
 * ENHANCED: Much higher visibility while maintaining elegance
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

  // Generate floating squares - MUCH HIGHER OPACITY for visibility
  const squares: FloatingElement[] = [
    // Far layer (slowest movement)
    { id: 1, x: 5, y: 10, size: 120, opacity: 0.25, delay: 0, duration: 20, layer: 1 },
    { id: 2, x: 85, y: 15, size: 150, opacity: 0.2, delay: 2, duration: 25, layer: 1 },
    { id: 3, x: 15, y: 60, size: 100, opacity: 0.22, delay: 5, duration: 22, layer: 1 },
    { id: 4, x: 75, y: 70, size: 130, opacity: 0.18, delay: 3, duration: 28, layer: 1 },
    
    // Mid layer
    { id: 5, x: 25, y: 25, size: 80, opacity: 0.28, delay: 1, duration: 16, layer: 2 },
    { id: 6, x: 70, y: 35, size: 70, opacity: 0.25, delay: 4, duration: 18, layer: 2 },
    { id: 7, x: 10, y: 80, size: 90, opacity: 0.22, delay: 2, duration: 14, layer: 2 },
    { id: 8, x: 90, y: 55, size: 65, opacity: 0.28, delay: 6, duration: 20, layer: 2 },
    
    // Near layer (fastest movement)
    { id: 9, x: 40, y: 20, size: 55, opacity: 0.32, delay: 0, duration: 12, layer: 3 },
    { id: 10, x: 60, y: 75, size: 50, opacity: 0.28, delay: 3, duration: 13, layer: 3 },
    { id: 11, x: 30, y: 50, size: 52, opacity: 0.26, delay: 5, duration: 11, layer: 3 },
    { id: 12, x: 80, y: 85, size: 58, opacity: 0.24, delay: 2, duration: 14, layer: 3 },
  ];

  // Generate thin lines - HIGHER OPACITY
  const lines: FloatingLine[] = [
    { id: 1, x1: 10, y1: 20, angle: 45, length: 250, opacity: 0.25, delay: 0, duration: 25, layer: 1 },
    { id: 2, x1: 80, y1: 30, angle: -30, length: 220, opacity: 0.22, delay: 3, duration: 30, layer: 1 },
    { id: 3, x1: 20, y1: 70, angle: 60, length: 200, opacity: 0.2, delay: 5, duration: 22, layer: 1 },
    { id: 4, x1: 70, y1: 80, angle: -45, length: 230, opacity: 0.24, delay: 2, duration: 28, layer: 1 },
    
    { id: 5, x1: 35, y1: 15, angle: 30, length: 180, opacity: 0.28, delay: 1, duration: 18, layer: 2 },
    { id: 6, x1: 65, y1: 60, angle: -60, length: 190, opacity: 0.25, delay: 4, duration: 20, layer: 2 },
    { id: 7, x1: 15, y1: 45, angle: 15, length: 160, opacity: 0.22, delay: 6, duration: 16, layer: 2 },
    { id: 8, x1: 85, y1: 40, angle: -15, length: 170, opacity: 0.28, delay: 0, duration: 19, layer: 2 },
  ];

  const getParallaxOffset = (layer: number) => {
    const multiplier = layer === 1 ? 0.03 : layer === 2 ? 0.06 : 0.1;
    return scrollY * multiplier;
  };

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden" style={{ zIndex: 0 }}>
      {/* Floating Squares with prominent glow */}
      {squares.map((square) => (
        <div
          key={`square-${square.id}`}
          className="absolute rounded-3xl"
          style={{
            left: `${square.x}%`,
            top: `${square.y}%`,
            width: square.size,
            height: square.size,
            background: `linear-gradient(135deg, 
              hsl(270 80% 60% / ${square.opacity}) 0%, 
              hsl(280 70% 50% / ${square.opacity * 0.7}) 100%)`,
            boxShadow: `0 0 ${square.size * 0.8}px hsl(270 90% 60% / ${square.opacity * 0.5}),
                        0 0 ${square.size * 1.5}px hsl(270 90% 60% / ${square.opacity * 0.3}),
                        inset 0 0 ${square.size * 0.3}px hsl(270 100% 80% / ${square.opacity * 0.2})`,
            transform: `translateY(${-getParallaxOffset(square.layer)}px) rotate(${12 + square.id * 3}deg)`,
            animation: `float-gentle ${square.duration}s ease-in-out infinite`,
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
          const x2 = line.x1 + Math.cos(line.angle * Math.PI / 180) * (line.length / 6);
          const y2 = line.y1 + Math.sin(line.angle * Math.PI / 180) * (line.length / 6);
          const parallaxY = getParallaxOffset(line.layer);
          
          return (
            <line
              key={`line-${line.id}`}
              x1={`${line.x1}%`}
              y1={`${line.y1}%`}
              x2={`${x2}%`}
              y2={`${y2}%`}
              stroke="url(#lineGradientPurple)"
              strokeWidth="2"
              opacity={line.opacity}
              style={{
                transform: `translateY(${-parallaxY}px)`,
                animation: `line-drift ${line.duration}s ease-in-out infinite`,
                animationDelay: `${line.delay}s`,
              }}
            />
          );
        })}
      </svg>
      
      {/* Large soft glow orbs - MORE VISIBLE */}
      <div 
        className="absolute rounded-full"
        style={{
          left: '0%',
          top: '10%',
          width: '500px',
          height: '500px',
          background: 'radial-gradient(circle, hsl(270 90% 60% / 0.35) 0%, hsl(270 90% 60% / 0.15) 40%, transparent 70%)',
          filter: 'blur(60px)',
          transform: `translateY(${-scrollY * 0.03}px)`,
          animation: 'pulse-slow 8s ease-in-out infinite',
        }}
      />
      <div 
        className="absolute rounded-full"
        style={{
          right: '-5%',
          bottom: '15%',
          width: '600px',
          height: '600px',
          background: 'radial-gradient(circle, hsl(280 85% 55% / 0.3) 0%, hsl(280 85% 55% / 0.12) 40%, transparent 70%)',
          filter: 'blur(80px)',
          transform: `translateY(${-scrollY * 0.02}px)`,
          animation: 'pulse-slow 10s ease-in-out infinite',
          animationDelay: '3s',
        }}
      />
      <div 
        className="absolute rounded-full"
        style={{
          left: '35%',
          top: '35%',
          width: '450px',
          height: '450px',
          background: 'radial-gradient(circle, hsl(265 95% 60% / 0.25) 0%, hsl(265 95% 60% / 0.1) 40%, transparent 70%)',
          filter: 'blur(50px)',
          transform: `translateY(${-scrollY * 0.04}px)`,
          animation: 'pulse-slow 12s ease-in-out infinite',
          animationDelay: '5s',
        }}
      />
      
      {/* Additional accent orbs for more visual interest */}
      <div 
        className="absolute rounded-full"
        style={{
          right: '25%',
          top: '5%',
          width: '300px',
          height: '300px',
          background: 'radial-gradient(circle, hsl(260 90% 65% / 0.2) 0%, transparent 60%)',
          filter: 'blur(40px)',
          transform: `translateY(${-scrollY * 0.05}px)`,
          animation: 'pulse-slow 9s ease-in-out infinite',
          animationDelay: '2s',
        }}
      />
      <div 
        className="absolute rounded-full"
        style={{
          left: '60%',
          bottom: '5%',
          width: '350px',
          height: '350px',
          background: 'radial-gradient(circle, hsl(275 85% 55% / 0.22) 0%, transparent 60%)',
          filter: 'blur(45px)',
          transform: `translateY(${-scrollY * 0.04}px)`,
          animation: 'pulse-slow 11s ease-in-out infinite',
          animationDelay: '4s',
        }}
      />
      
      {/* CSS Animations as global styles */}
      <style>{`
        @keyframes float-gentle {
          0%, 100% {
            transform: translateY(0px) rotate(var(--rotation, 15deg));
          }
          50% {
            transform: translateY(-30px) rotate(var(--rotation, 15deg));
          }
        }
        
        @keyframes line-drift {
          0%, 100% {
            transform: translateX(0px) translateY(0px);
          }
          33% {
            transform: translateX(20px) translateY(-12px);
          }
          66% {
            transform: translateX(-15px) translateY(-20px);
          }
        }
        
        @keyframes pulse-slow {
          0%, 100% {
            opacity: 1;
            transform: scale(1);
          }
          50% {
            opacity: 0.7;
            transform: scale(1.1);
          }
        }
      `}</style>
    </div>
  );
};

export default FuturisticBackground;
