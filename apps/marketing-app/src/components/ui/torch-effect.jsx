import React, { useEffect } from 'react';
import { motion, useSpring, useMotionTemplate } from 'framer-motion';

export const TorchEffect = () => {
    // Spring physics for delayed motion (chasing effect)
    // damping: higher = less oscillation, lower = more oscillation
    // stiffness: higher = faster, lower = slower (more drag)
    // Spring physics for delayed motion (chasing effect)
    // damping: higher = less oscillation, lower = more oscillation
    // stiffness: higher = faster, lower = slower (more drag)
    const springConfig = { damping: 20, stiffness: 300, mass: 0.2 };
    const x = useSpring(0, springConfig);
    const y = useSpring(0, springConfig);

    useEffect(() => {
        const handleMouseMove = (e) => {
            x.set(e.clientX);
            y.set(e.clientY);
        };

        window.addEventListener('mousemove', handleMouseMove);
        return () => window.removeEventListener('mousemove', handleMouseMove);
    }, [x, y]);

    // Create the gradient background style dynamically
    // white, 6% opacity, 120px radius
    const background = useMotionTemplate`radial-gradient(120px circle at ${x}px ${y}px, rgba(255,255,255,0.06), transparent 100%)`;

    return (
        <motion.div
            className="fixed inset-0 z-50 pointer-events-none"
            style={{ background }}
        />
    );
};
