import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { ArrowRight, Activity, Zap } from 'lucide-react';
import { Button } from '../ui/button';
import { ComparisonSection } from './ComparisonSection';

export const Hero = () => {
    const containerRef = useRef(null);
    const { scrollY } = useScroll();

    // Scroll Animations (Parallax)
    const yBackground = useTransform(scrollY, [0, 1000], [0, 400]);
    const yText = useTransform(scrollY, [0, 500], [0, 200]);
    const opacityText = useTransform(scrollY, [0, 300], [1, 0]);
    const yPhone = useTransform(scrollY, [0, 1000], [0, -150]);

    return (
        <section ref={containerRef} className="relative min-h-screen flex flex-col items-center pt-32 px-4">

            {/* Background Aurora Effect (Parallax Layer) */}
            <motion.div
                style={{ y: yBackground }}
                className="absolute inset-0 z-0 pointer-events-none"
            >
                <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-indigo-500/20 rounded-full blur-[120px] mix-blend-screen animate-pulse" />
                <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-cyan-500/10 rounded-full blur-[100px] mix-blend-screen" />
            </motion.div>

            {/* Content (Text Layer with Parallax) */}
            <motion.div
                style={{ y: yText, opacity: opacityText }}
                className="relative z-10 text-center max-w-4xl mx-auto mb-16"
            >
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-medium tracking-wide text-cyan-400 mb-6 uppercase"
                >
                    <span className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-500"></span>
                    </span>
                    Live Market Intelligence
                </motion.div>

                <motion.h1
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.1, ease: "easeOut" }}
                    className="text-5xl md:text-7xl font-light tracking-tight text-white mb-6 leading-[1.1]"
                >
                    Your edge, now on <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-cyan-400 font-normal">autopilot.</span>
                </motion.h1>

                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                    className="text-lg md:text-xl text-slate-400 max-w-2xl mx-auto mb-10 leading-relaxed font-light"
                >
                    The Instagram of the market. Real-time AI analysis of order flow, liquidity, and sentiment in a simple, scrollable feed.
                </motion.p>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.3 }}
                    className="flex flex-col sm:flex-row items-center justify-center gap-4"
                >
                    <a href="http://localhost:5181" target="_blank" rel="noopener noreferrer">
                        <Button variant="primary" size="lg">
                            Launch App <ArrowRight className="w-5 h-5" />
                        </Button>
                    </a>
                    <Button variant="secondary" size="lg">
                        View Live Demo
                    </Button>
                </motion.div>
            </motion.div>

            {/* Phone Mockup Visual (Foreground Parallax) */}
            <motion.div
                style={{ y: yPhone }}
                initial={{ opacity: 0, scale: 0.9, rotateX: 20 }}
                animate={{ opacity: 1, scale: 1, rotateX: 0 }}
                transition={{ duration: 1, delay: 0.4, type: "spring" }}
                className="relative z-10 w-full max-w-[320px] md:max-w-[380px] perspective-1000 mb-[-100px] md:mb-[-150px]"
            >
                <div className="relative rounded-[3rem] border-8 border-slate-900 bg-[#02040A] shadow-2xl shadow-indigo-500/20 overflow-hidden aspect-[9/19.5]">
                    {/* Mockup Notch */}
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 h-7 w-32 bg-slate-900 rounded-b-2xl z-20"></div>

                    {/* Mockup Screen Content (Simulated Feed) */}
                    <div className="absolute inset-0 bg-gradient-to-b from-slate-900/50 to-[#02040A] flex flex-col">
                        {/* Status Bar */}
                        <div className="flex justify-between px-6 pt-3 pb-2 text-[10px] text-white font-medium">
                            <span>9:41</span>
                            <div className="flex gap-1">
                                <Activity className="w-3 h-3" />
                                <Zap className="w-3 h-3" />
                            </div>
                        </div>

                        {/* Simulated Animated Feed List */}
                        <div className="flex-1 p-4 space-y-3 overflow-hidden opacity-80 mask-image-b">
                            {[1, 2, 3].map((i) => (
                                <motion.div
                                    key={i}
                                    initial={{ y: 0 }}
                                    animate={{ y: -100 }}
                                    transition={{ duration: 10, repeat: Infinity, ease: "linear", repeatType: "loop" }}
                                    className="bg-white/5 border border-white/5 rounded-xl p-3 backdrop-blur-md"
                                >
                                    <div className="flex items-center justify-between mb-2">
                                        <div className="h-2 w-8 bg-slate-700 rounded-full" />
                                        <div className="h-2 w-16 bg-slate-700 rounded-full" />
                                    </div>
                                    <div className="h-16 bg-gradient-to-r from-indigo-500/10 to-transparent rounded-lg mb-2 relative overflow-hidden">
                                        <div className="absolute bottom-0 left-0 right-0 h-px bg-indigo-500/50" />
                                        <svg className="absolute inset-0 w-full h-full text-indigo-400" fill="none" viewBox="0 0 100 40">
                                            <path d="M0 30 Q 25 35 50 20 T 100 10" stroke="currentColor" strokeWidth="2" />
                                        </svg>
                                    </div>
                                    <div className="space-y-1">
                                        <div className="h-2 w-full bg-slate-800 rounded-full" />
                                        <div className="h-2 w-2/3 bg-slate-800 rounded-full" />
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </div>
            </motion.div>

            {/* Bridge Glow */}
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-indigo-500/5 rounded-full blur-[100px] -z-10" />

            {/* Joined Comparison Section */}
            <div className="w-full relative z-20 mt-20 md:mt-32">
                <ComparisonSection />
            </div>

        </section>
    );
};
