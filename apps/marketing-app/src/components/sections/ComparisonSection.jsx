import React from 'react';
import { motion } from 'framer-motion';
import { X, Check } from 'lucide-react';
import { GlassCard } from '../ui/glass-card';

export const ComparisonSection = () => {
    return (
        <section className="py-20 px-6 relative">
            <div className="max-w-6xl mx-auto">
                <div className="grid md:grid-cols-2 gap-8 relative items-start">

                    {/* VS Badge */}
                    <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-10 hidden md:flex w-16 h-16 rounded-full bg-void border border-white/10 items-center justify-center font-bold text-white shadow-xl">
                        VS
                    </div>

                    {/* The Gambler */}
                    <GlassCard className="p-10 border-rose-500/20 bg-rose-950/5 relative overflow-hidden h-full" hoverEffect={false}>
                        <div className="absolute -right-10 -top-10 w-40 h-40 bg-rose-500/10 rounded-full blur-[50px]" />
                        <div className="relative z-10">
                            <div className="flex items-center gap-3 mb-8 opacity-70">
                                <X className="w-8 h-8 text-rose-500" />
                                <h3 className="text-2xl font-light text-white">The Gambler</h3>
                            </div>
                            <ul className="space-y-6">
                                {[
                                    "Enters on emotion instead of signals",
                                    "No risk model, no plan, just hope",
                                    "Over-leverages to “speed up” profits",
                                    "Trades inside noise instead of structure",
                                    "Blames the market instead of tracking mistakes"
                                ].map((item, i) => (
                                    <li key={i} className="flex gap-4 text-rose-200/60 items-start">
                                        <span className="w-1.5 h-1.5 rounded-full bg-rose-500/50 mt-2 shrink-0" />
                                        {item}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </GlassCard>

                    {/* The INVSIO Trader */}
                    <GlassCard className="p-10 border-emerald-500/20 bg-emerald-950/5 relative overflow-hidden h-full" hoverEffect={false}>
                        <div className="absolute -left-10 -top-10 w-40 h-40 bg-emerald-500/10 rounded-full blur-[50px]" />
                        <div className="relative z-10">
                            <div className="flex items-center gap-3 mb-8">
                                <Check className="w-8 h-8 text-emerald-500" />
                                <h3 className="text-2xl font-light text-white">The INVSIO Trader</h3>
                            </div>
                            <ul className="space-y-6">
                                {[
                                    "Waits for sweeps, imbalances, and real displacement",
                                    "Uses fixed risk parameters and sizing logic",
                                    "Acts on quantified data — OI, CVD, liquidity zones",
                                    "Operates from HTF bias, executes on precision",
                                    "Logs every trade and iterates like a professional system"
                                ].map((item, i) => (
                                    <li key={i} className="flex gap-4 text-emerald-100/80 items-start font-medium">
                                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-2 shrink-0" />
                                        {item}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </GlassCard>

                </div>
            </div>
        </section>
    );
};
