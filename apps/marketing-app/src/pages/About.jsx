import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import {
    Brain, Shield, Crosshair, Zap,
    Target, Users, TrendingUp, Lock,
    ArrowRight, Quote, Check, X,
    Activity, Layers
} from 'lucide-react';
import { GlassCard } from '../components/ui/glass-card';
import { Button } from '../components/ui/button';
import { config } from '@/config';

// --- VISUAL COMPONENTS ---

const GlowingOrb = ({ color, className }) => (
    <div className={`absolute rounded-full blur-[100px] mix-blend-screen pointer-events-none opacity-20 ${className}`} style={{ background: color }} />
);

const SectionHeading = ({ children, align = 'center' }) => (
    <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className={`mb-12 ${align === 'center' ? 'text-center' : align === 'left' ? 'text-left' : 'text-right'}`}
    >
        {children}
    </motion.div>
);

const StatNumber = ({ value, label }) => (
    <div className="text-center">
        <div className="text-3xl md:text-5xl font-light text-white mb-1 tracking-tight">{value}</div>
        <div className="text-xs text-slate-500 uppercase tracking-widest">{label}</div>
    </div>
);

// --- SECTIONS ---

export default function About() {
    const containerRef = useRef(null);
    const { scrollYProgress } = useScroll({ target: containerRef });

    const yParallax = useTransform(scrollYProgress, [0, 1], [0, -100]);
    const TERMINAL_URL = config.TERMINAL_URL;

    return (
        <div ref={containerRef} className="relative min-h-screen">

            {/* Background Ambience */}
            <div className="fixed inset-0 pointer-events-none">
                <GlowingOrb color="#4F46E5" className="top-0 left-0 w-[800px] h-[800px] -translate-x-1/2 -translate-y-1/2" />
                <GlowingOrb color="#06B6D4" className="bottom-0 right-0 w-[600px] h-[600px] translate-x-1/2 translate-y-1/2" />
            </div>

            {/* 1. CINEMATIC INTRO */}
            <section className="relative pt-48 pb-32 px-6">
                <div className="max-w-5xl mx-auto text-center relative z-10">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.8 }}
                        className="inline-block mb-6"
                    >
                        <div className="px-4 py-1.5 rounded-full border border-indigo-500/30 bg-indigo-500/10 text-indigo-300 text-xs font-medium tracking-widest uppercase backdrop-blur-md">
                            The MarketFlow Manifesto
                        </div>
                    </motion.div>

                    <motion.h1
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1, duration: 0.8 }}
                        className="text-5xl md:text-8xl font-light text-white leading-[0.95] tracking-tight mb-8"
                    >
                        Retail is playing <br />
                        <span className="font-medium text-transparent bg-clip-text bg-gradient-to-r from-slate-500 to-slate-700">Blindfolded.</span>
                    </motion.h1>

                    <motion.p
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2, duration: 0.8 }}
                        className="text-lg md:text-2xl text-slate-400 font-light max-w-3xl mx-auto leading-relaxed"
                    >
                        We built <span className="text-white">MarketFlow</span> to remove the blindfold.
                        To replace "gut feeling" with institutional-grade vision.
                    </motion.p>
                </div>

                {/* Floating Metrics Strip */}
                <motion.div
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4, duration: 0.8 }}
                    className="mt-24 max-w-4xl mx-auto"
                >
                    <GlassCard className="p-8 border-white/5 bg-white/[0.02] h-fit">
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 divide-x divide-white/5">
                            <StatNumber value="24/7" label="Market Coverage" />
                            <StatNumber value="<50ms" label="Data Latency" />
                            <StatNumber value="$2B+" label="Volume Analyzed" />
                            <StatNumber value="100%" label="Transparency" />
                        </div>
                    </GlassCard>
                </motion.div>
            </section>

            {/* 2. THE PROBLEM / SOLUTION (Split Flow) */}
            <section className="py-32 px-6 relative">
                <div className="max-w-7xl mx-auto">
                    {/* Added items-start to prevent height stretching */}
                    <div className="grid md:grid-cols-2 gap-20 items-start">
                        {/* Left: The Reality */}
                        <motion.div
                            initial={{ opacity: 0, x: -50 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            className="h-fit"
                        >
                            <h2 className="text-4xl text-white font-light mb-6">The Institutional <span className="text-indigo-400">Edge</span></h2>
                            <p className="text-slate-400 text-lg leading-relaxed mb-8 border-l-2 border-indigo-500/50 pl-6">
                                Smart money doesn't guess. They have order flow visibility, liquidity heatmaps, and high-frequency algorithms.
                                <br /><br />
                                Meanwhile, retail traders stare at lagging indicators on a naked chart, wondering why they got stopped out.
                            </p>
                            <div className="flex gap-4">
                                <div className="p-4 rounded-2xl bg-white/5 border border-white/5 flex-1">
                                    <Activity className="w-6 h-6 text-rose-400 mb-2" />
                                    <div className="text-sm text-slate-400">Retail Speed</div>
                                    <div className="text-white font-mono">Reactive</div>
                                </div>
                                <div className="p-4 rounded-2xl bg-indigo-500/10 border border-indigo-500/30 flex-1">
                                    <Zap className="w-6 h-6 text-indigo-400 mb-2" />
                                    <div className="text-sm text-indigo-200">Our Speed</div>
                                    <div className="text-white font-mono">Predictive</div>
                                </div>
                            </div>
                        </motion.div>

                        {/* Right: The Solution Visual */}
                        <motion.div
                            style={{ y: yParallax }}
                            className="relative h-fit"
                        >
                            <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-cyan-500 blur-[80px] opacity-20" />
                            {/* Removed aspect-square, added min-h to maintain shape but prevent excessive stretching */}
                            <GlassCard className="relative p-1 border-white/10 min-h-[400px] flex items-center justify-center h-fit">
                                <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20" />

                                {/* Abstract HUD Interface */}
                                <div className="relative w-full h-full p-8 flex flex-col justify-between gap-8">
                                    <div className="flex justify-between items-center border-b border-white/10 pb-4">
                                        <div className="flex gap-2">
                                            <div className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
                                            <div className="w-2 h-2 rounded-full bg-amber-500" />
                                            <div className="w-2 h-2 rounded-full bg-emerald-500" />
                                        </div>
                                        <div className="font-mono text-xs text-indigo-400">SYSTEM_ACTIVE</div>
                                    </div>
                                    <div className="space-y-4 flex-1">
                                        <div className="h-2 bg-white/10 rounded-full w-3/4" />
                                        <div className="h-2 bg-white/10 rounded-full w-1/2" />
                                        <div className="h-32 bg-gradient-to-r from-indigo-500/20 to-transparent rounded-lg border border-indigo-500/20 relative overflow-hidden">
                                            <div className="absolute top-1/2 left-0 w-full h-px bg-indigo-400/50" />
                                            <Activity className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-indigo-400 w-8 h-8" />
                                        </div>
                                    </div>
                                    <div className="flex justify-between text-xs font-mono text-slate-500 pt-4 border-t border-white/10">
                                        <span>OI: +12.5%</span>
                                        <span>CVD: BULLISH</span>
                                    </div>
                                </div>
                            </GlassCard>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* 3. CORE INTELLIGENCE (Holographic Cards) */}
            <section className="py-32 px-6 bg-white/[0.02]">
                <div className="max-w-7xl mx-auto">
                    <SectionHeading>
                        <h2 className="text-3xl md:text-5xl font-light text-white mb-4">Deep Vision <span className="text-cyan-400">Intelligence</span></h2>
                        <p className="text-slate-400">We analyze the hidden data layers of the market.</p>
                    </SectionHeading>

                    {/* items-start prevents cards from stretching to match tallest neighbor */}
                    <div className="grid md:grid-cols-4 gap-6 items-start">
                        {[
                            { icon: <Brain className="w-6 h-6" />, title: "Smart Money", desc: "Whale wallet tracking & institutional order flow analysis." },
                            { icon: <Layers className="w-6 h-6" />, title: "Liquidity", desc: "Heatmaps revealing where stop losses and liquidations are hunting." },
                            { icon: <Crosshair className="w-6 h-6" />, title: "Execution", desc: "Precision entry/exit calculators based on volatility." },
                            { icon: <Shield className="w-6 h-6" />, title: "Risk Armor", desc: "Dynamic position sizing to prevent ruin." }
                        ].map((item, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.1 }}
                                className="group h-fit"
                            >
                                <div className="p-8 rounded-2xl bg-gradient-to-b from-white/5 to-transparent border border-white/5 hover:border-cyan-500/30 hover:bg-white/10 transition-all duration-300 relative overflow-hidden h-fit">
                                    <div className="absolute top-0 right-0 p-3 opacity-10 group-hover:opacity-100 transition-opacity duration-300">
                                        <ArrowRight className="w-4 h-4 text-cyan-400 -rotate-45" />
                                    </div>
                                    <div className="w-12 h-12 rounded-xl bg-black/40 border border-white/10 flex items-center justify-center text-white mb-6 group-hover:scale-110 group-hover:text-cyan-400 transition-all duration-300">
                                        {item.icon}
                                    </div>
                                    <h3 className="text-lg font-medium text-white mb-3">{item.title}</h3>
                                    <p className="text-sm text-slate-400 leading-relaxed group-hover:text-slate-300 transition-colors">
                                        {item.desc}
                                    </p>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>



            {/* 5. FOUNDER'S NOTE (Minimalist) */}
            <section className="py-24 px-6">
                <div className="max-w-3xl mx-auto">
                    <motion.div
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true }}
                        className="relative pl-8 md:pl-16 py-8 border-l border-indigo-500/30"
                    >
                        <Quote className="absolute top-0 left-0 -translate-x-1/2 -translate-y-1/2 w-10 h-10 text-indigo-500 bg-void p-2 border border-indigo-500/30 rounded-full" />

                        <h3 className="text-sm font-bold text-indigo-400 uppercase tracking-widest mb-6">Mission Control</h3>

                        <p className="text-xl md:text-2xl text-slate-300 font-light italic leading-relaxed mb-8">
                            "I didn't build MarketFlow to sell you signals. I built it because I was tired of retail traders being the liquidity for institutions. Real trading isn't about guessing; it's about seeing the board clearly."
                        </p>

                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-full bg-slate-800 flex items-center justify-center text-white font-bold border border-white/10">
                                T
                            </div>
                            <div>
                                <div className="text-white font-medium">Tomer</div>
                                <div className="text-slate-500 text-sm">Founder, MarketFlow</div>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* 6. FINAL CTA */}
            <section className="relative py-48 px-6 mt-10 flex flex-col items-center justify-center">

                {/* Central Nebula Gradient - Extended container for smooth edges */}
                <div className="absolute -inset-40 pointer-events-none overflow-visible">
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-indigo-500/15 rounded-full blur-[150px]" />
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[300px] bg-cyan-400/8 rounded-full blur-[120px]" />
                </div>

                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="w-full max-w-4xl mx-auto relative z-10 text-center"
                >
                    <h2 className="text-4xl md:text-5xl font-light text-white mb-6 tracking-tight">
                        Stop Guessing. <br /><span className="text-indigo-400 font-normal">Start Knowing.</span>
                    </h2>

                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-8">
                        <a href={config.TERMINAL_URL} target="_blank" rel="noopener noreferrer">
                            <Button variant="primary" size="lg" className="min-w-[180px] shadow-[0_0_30px_rgba(79,70,229,0.3)] hover:shadow-[0_0_50px_rgba(79,70,229,0.5)] border-indigo-500/50">
                                Launch Terminal <ArrowRight className="w-4 h-4 ml-2" />
                            </Button>
                        </a>
                        <Button
                            variant="secondary"
                            size="lg"
                            className="min-w-[180px] bg-white/5 border-white/10 hover:bg-white/10"
                            onClick={() => window.location.href = '/features'}
                        >
                            View Features
                        </Button>
                    </div>
                </motion.div>
            </section>

        </div>
    );
};
