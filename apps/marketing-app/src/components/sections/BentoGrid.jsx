import React from 'react';
import { GlassCard } from '../ui/glass-card';
import { motion } from 'framer-motion';
import { Gauge, Layers, ScanLine } from 'lucide-react';

export const BentoGrid = () => {
    return (
        <section id="features" className="py-24 px-4">
            <div className="max-w-6xl mx-auto">
                <div className="mb-16">
                    <h2 className="text-3xl font-light text-white mb-4">Deep Vision Technology</h2>
                    <p className="text-slate-400 max-w-xl">Our proprietary AI scans thousands of data points to visualize what the naked eye misses.</p>
                </div>

                {/* Removed fixed height constraint (h-[500px]) to allow natural content flow */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

                    {/* Card 1: Large Sentiment Analysis */}
                    <motion.div
                        className="md:col-span-2 md:row-span-2"
                        initial={{ opacity: 0, scale: 0.95 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5 }}
                    >
                        {/* Removed h-full to let card size to content */}
                        <GlassCard className="p-8 flex flex-col justify-between group h-full">
                            <div>
                                <div className="w-12 h-12 rounded-full bg-indigo-500/20 flex items-center justify-center mb-6 text-indigo-400">
                                    <Gauge className="w-6 h-6" />
                                </div>
                                <h3 className="text-2xl text-white font-light mb-2">AI Sentiment Engine</h3>
                                <p className="text-slate-400 font-light leading-relaxed max-w-md">
                                    Beyond price action. We analyze social volume, order book depth, and whale wallet movements to generate a composite Fear & Greed score in real-time.
                                </p>
                            </div>

                            {/* Visual Abstraction of Speedometer */}
                            <div className="mt-8 relative h-32 w-full bg-black/20 rounded-xl overflow-hidden flex items-end justify-center pb-4 border border-white/5">
                                <div className="absolute w-48 h-24 bg-gradient-to-t from-indigo-500/20 to-transparent rounded-t-full bottom-0" />
                                <motion.div
                                    animate={{ rotate: [0, 45, -20, 10, 0] }}
                                    transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
                                    className="w-1 h-20 bg-indigo-400 origin-bottom rounded-full z-10"
                                    style={{ transformOrigin: 'bottom center' }}
                                />
                                <div className="absolute bottom-0 w-4 h-4 bg-white rounded-full z-20 shadow-lg shadow-indigo-500/50" />
                            </div>
                        </GlassCard>
                    </motion.div>

                    {/* Card 2: Liquidity Zones */}
                    <motion.div
                        className="md:col-span-1"
                        initial={{ opacity: 0, x: 20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                    >
                        <GlassCard className="p-6 flex flex-col justify-between h-full">
                            <div className="flex justify-between items-start">
                                <div className="p-2 bg-cyan-500/10 rounded-lg text-cyan-400">
                                    <Layers className="w-5 h-5" />
                                </div>
                            </div>
                            <div className="mt-4">
                                <h3 className="text-lg text-white mb-1">Liquidity Heatmaps</h3>
                                <p className="text-sm text-slate-400">See where the stop losses are hiding.</p>
                            </div>
                            {/* Visual */}
                            <div className="mt-4 space-y-1">
                                <div className="h-1.5 w-full bg-cyan-500/10 rounded-full" />
                                <div className="h-1.5 w-2/3 bg-cyan-500/30 rounded-full" />
                                <div className="h-1.5 w-4/5 bg-cyan-500/60 rounded-full shadow-[0_0_10px_rgba(6,182,212,0.5)]" />
                                <div className="h-1.5 w-1/2 bg-cyan-500/20 rounded-full" />
                            </div>
                        </GlassCard>
                    </motion.div>

                    {/* Card 3: Multi-Timeframe */}
                    <motion.div
                        className="md:col-span-1"
                        initial={{ opacity: 0, x: 20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5, delay: 0.3 }}
                    >
                        <GlassCard className="p-6 flex flex-col justify-between h-full">
                            <div className="flex justify-between items-start">
                                <div className="p-2 bg-pink-500/10 rounded-lg text-pink-400">
                                    <ScanLine className="w-5 h-5" />
                                </div>
                            </div>
                            <div className="mt-4">
                                <h3 className="text-lg text-white mb-1">Fractal Alignment</h3>
                                <p className="text-sm text-slate-400">When 1H, 4H, and 1D agree.</p>
                            </div>
                            {/* Visual */}
                            <div className="mt-4 flex items-center justify-center gap-2">
                                {[1, 2, 3].map(i => (
                                    <div key={i} className="w-full h-8 border border-pink-500/30 bg-pink-500/5 rounded flex items-center justify-center">
                                        <div className="w-full h-px bg-pink-500/50 transform -rotate-12" />
                                    </div>
                                ))}
                            </div>
                        </GlassCard>
                    </motion.div>

                </div>
            </div>
        </section>
    );
};
