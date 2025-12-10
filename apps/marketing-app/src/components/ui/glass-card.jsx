import React, { useRef, useState } from 'react';

export const GlassCard = ({
    children,
    className = '',
    hoverEffect = true,
    glowColor = 'rgba(255, 255, 255, 0.02)'
}) => {
    const divRef = useRef(null);
    const [position, setPosition] = useState({ x: 0, y: 0 });
    const [opacity, setOpacity] = useState(0);

    const handleMouseMove = (e) => {
        if (!divRef.current || !hoverEffect) return;

        const rect = divRef.current.getBoundingClientRect();
        setPosition({ x: e.clientX - rect.left, y: e.clientY - rect.top });
    };

    const handleMouseEnter = () => {
        if (hoverEffect) setOpacity(1);
    };

    const handleMouseLeave = () => {
        if (hoverEffect) setOpacity(0);
    };

    return (
        <div
            ref={divRef}
            onMouseMove={handleMouseMove}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            className={`
        relative overflow-hidden rounded-2xl border border-white/5 
        bg-gradient-to-br from-white/[0.03] to-transparent 
        backdrop-blur-xl transition-all duration-300
        ${hoverEffect ? 'hover:border-white/10 hover:-translate-y-1' : ''}
        ${className}
      `}
        >
            <div
                className="pointer-events-none absolute -inset-px opacity-0 transition duration-300"
                style={{
                    opacity,
                    background: `radial-gradient(150px circle at ${position.x}px ${position.y}px, ${glowColor}, transparent 40%)`,
                }}
            />
            <div className="relative h-full">{children}</div>
        </div>
    );
};
