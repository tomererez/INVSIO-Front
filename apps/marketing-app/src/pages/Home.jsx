import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Hero } from "../components/sections/Hero";
import { BentoGrid } from "../components/sections/BentoGrid";
import { Testimonials } from "../components/sections/Testimonials";
import { GlassCard } from '../components/ui/glass-card';
import { Button } from '../components/ui/button';
import { config } from '@/config';

export default function Home() {
    const navigate = useNavigate();
    const TERMINAL_URL = config.TERMINAL_URL;

    return (
        <div className="relative min-h-screen overflow-x-hidden">
            <Hero />
            <Testimonials />
            <BentoGrid />

            {/* FINAL CTA: NEBULA DESIGN */}
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
                    <h2 className="text-5xl md:text-7xl font-light text-white mb-8 tracking-tight leading-tight">
                        Trade with <span className="text-transparent bg-clip-text bg-gradient-to-br from-indigo-300 to-cyan-300 font-normal">Institutional Vision.</span>
                    </h2>

                    <p className="text-xl text-slate-400 mb-10 leading-relaxed font-light max-w-2xl mx-auto">
                        Stop trading blind. Get the data that moves the market. <br className="hidden md:block" />
                        Join the smart money today.
                    </p>

                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                        <a href={TERMINAL_URL} target="_blank" rel="noopener noreferrer">
                            <Button variant="primary" size="lg" className="min-w-[200px] h-14 text-lg shadow-[0_0_40px_rgba(79,70,229,0.4)] hover:shadow-[0_0_60px_rgba(79,70,229,0.6)] border-indigo-500/50">
                                Launch Terminal <ArrowRight className="w-5 h-5 ml-2" />
                            </Button>
                        </a>
                        <Button
                            variant="secondary"
                            size="lg"
                            className="min-w-[200px] h-14 text-lg bg-white/5 border-white/10 hover:bg-white/10"
                            onClick={() => navigate('/pricing')}
                        >
                            View Pricing
                        </Button>
                    </div>
                </motion.div>
            </section>
        </div>
    );
}
