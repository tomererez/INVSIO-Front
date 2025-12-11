import React, { useRef, useState, useEffect } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { ArrowRight, Activity, Zap, TrendingUp, TrendingDown } from 'lucide-react';
import { Button } from '../ui/button';
import { ComparisonSection } from './ComparisonSection';
import { config } from '@/config';
import { AlertsSkeleton } from '../AlertsSkeleton';

// Alert data for the phone mockup
const ALERTS = [
    {
        title: "BTC Liquidity Sweep",
        subtext: "Sweep below 94,200 → OI compression + CVD reversal.",
        bias: "LONG",
        confidence: "86%"
    },
    {
        title: "Smart Money Absorption",
        subtext: "Sell-off absorbed → strong CVD divergence.",
        bias: "LONG",
        confidence: "78%"
    },
    {
        title: "Trend Shift Trigger",
        subtext: "Structure weakening + volatility lift-off.",
        bias: "SHORT",
        confidence: "72%"
    }
];

export const Hero = () => {
    const containerRef = useRef(null);
    const { scrollY } = useScroll();
    const [isAlertsLoading, setIsAlertsLoading] = useState(true);

    // Simulate alerts loading (e.g., data fetch or animation readiness)
    useEffect(() => {
        const timer = setTimeout(() => setIsAlertsLoading(false), 100);
        return () => clearTimeout(timer);
    }, []);

    // Scroll Animations (Parallax)
    const yBackground = useTransform(scrollY, [0, 1000], [0, 400]);
    const yText = useTransform(scrollY, [0, 500], [0, 200]);
    const opacityText = useTransform(scrollY, [0, 300], [1, 0]);
    const yPhone = useTransform(scrollY, [0, 1000], [0, -150]);

    const TERMINAL_URL = config.TERMINAL_URL;

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
                className="relative z-10 text-center max-w-5xl mx-auto mb-16"
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
                    Smart Money Edge.<br />
                    <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-cyan-400 font-normal">In the palm of your hand.</span>
                </motion.h1>

                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                    className="text-lg md:text-xl text-slate-400 max-w-3xl mx-auto mb-10 leading-relaxed font-light"
                >
                    Your all-in-one trading system: AI-driven market intelligence, behavioral analysis, and precision risk management unified to elevate every decision you make.
                </motion.p>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.3 }}
                    className="flex flex-col sm:flex-row items-center justify-center gap-4"
                >
                    <a href={TERMINAL_URL} target="_blank" rel="noopener noreferrer">
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
                style={{ y: yPhone, willChange: 'transform', transform: 'translateZ(0)' }}
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

                        {/* Simulated Animated Feed List - Now with real alert content */}
                        <div className="flex-1 p-4 relative overflow-hidden mask-image-b min-h-[340px]">
                            {isAlertsLoading ? (
                                <AlertsSkeleton />
                            ) : (
                                <div className="space-y-3">
                                    {ALERTS.map((alert, i) => (
                                        <motion.div
                                            key={i}
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            transition={{ delay: 0.5 + (i * 0.15), duration: 0.4 }}
                                            className="bg-white/5 border border-white/5 rounded-xl p-4 backdrop-blur-md hover:bg-white/10 transition-colors"
                                            style={{ minHeight: '96px' }} // Reserve exact space
                                        >
                                            <div className="flex items-center justify-between mb-2">
                                                <div className="flex items-center gap-2">
                                                    {alert.bias === 'LONG' ? (
                                                        <TrendingUp className="w-3.5 h-3.5 text-emerald-400" />
                                                    ) : (
                                                        <TrendingDown className="w-3.5 h-3.5 text-rose-400" />
                                                    )}
                                                    <h3 className="text-white text-xs font-semibold tracking-wide">{alert.title}</h3>
                                                </div>
                                                <div className={`text-[9px] font-bold px-1.5 py-0.5 rounded border ${alert.bias === 'LONG'
                                                    ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400'
                                                    : 'bg-rose-500/10 border-rose-500/20 text-rose-400'
                                                    }`}>
                                                    {alert.bias} {alert.confidence}
                                                </div>
                                            </div>

                                            <p className="text-[11px] text-slate-400 leading-snug mb-3 font-light">
                                                {alert.subtext.split('→').map((part, idx, arr) => (
                                                    <React.Fragment key={idx}>
                                                        {part.trim()}
                                                        {idx < arr.length - 1 && <span className="text-slate-600 mx-1">→</span>}
                                                    </React.Fragment>
                                                ))}
                                            </p>

                                            {/* Confidence Bar */}
                                            <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
                                                <motion.div
                                                    initial={{ width: 0 }}
                                                    animate={{ width: alert.confidence }}
                                                    transition={{ delay: 1.5 + (i * 0.2), duration: 1 }}
                                                    className={`h-full rounded-full ${alert.bias === 'LONG' ? 'bg-emerald-500' : 'bg-rose-500'
                                                        }`}
                                                />
                                            </div>
                                        </motion.div>
                                    ))}

                                    {/* Faded partial card at bottom to imply more content */}
                                    <div className="bg-white/5 border border-white/5 rounded-xl p-4 backdrop-blur-md opacity-30">
                                        <div className="h-3 w-24 bg-slate-700 rounded-full mb-2" />
                                        <div className="h-2 w-full bg-slate-800 rounded-full" />
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Bottom Nav Hint */}
                        <div className="h-12 border-t border-white/5 bg-black/40 backdrop-blur-md flex justify-around items-center px-6">
                            <div className="w-4 h-4 rounded-full bg-indigo-500/20" />
                            <div className="w-4 h-4 rounded-full bg-white/5" />
                            <div className="w-4 h-4 rounded-full bg-white/5" />
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
