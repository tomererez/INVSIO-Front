import React, { useMemo } from 'react';

export const StarryBackground: React.FC = () => {
  // Generate stars only once
  const stars = useMemo(() => {
    return Array.from({ length: 100 }).map((_, i) => {
      const size = Math.random() * 2 + 1; // 1px to 3px
      const top = Math.random() * 100;
      const left = Math.random() * 100;
      const duration = Math.random() * 3 + 2; // 2s to 5s
      const delay = Math.random() * 5;
      const shouldBlink = Math.random() > 0.6; // 40% chance to blink

      return {
        id: i,
        style: {
          top: `${top}%`,
          left: `${left}%`,
          width: `${size}px`,
          height: `${size}px`,
          '--duration': `${duration}s`,
          '--delay': `${delay}s`,
        } as React.CSSProperties,
        className: `absolute bg-white rounded-full ${shouldBlink ? 'animate-twinkle' : 'opacity-60'}`,
      };
    });
  }, []);

  return (
    <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden bg-void">
      {/* 1. Deep Black Base (handled by bg-void) */}

      {/* 2. Blue Nebula - Bottom Left */}
      <div className="absolute bottom-[-10%] left-[-10%] w-[50vw] h-[50vw] bg-indigo-600/10 rounded-full blur-[120px] mix-blend-screen opacity-60" />
      
      {/* 3. Pink Nebula - Bottom Right */}
      <div className="absolute bottom-[-10%] right-[-10%] w-[50vw] h-[50vw] bg-pink-600/10 rounded-full blur-[120px] mix-blend-screen opacity-50" />

      {/* 4. The Stars */}
      {stars.map((star) => (
        <div 
          key={star.id} 
          className={star.className} 
          style={star.style} 
        />
      ))}
      
      {/* 5. Additional Ambient Vignette */}
      <div className="absolute inset-0 bg-gradient-to-t from-transparent via-transparent to-void/80" />
    </div>
  );
};