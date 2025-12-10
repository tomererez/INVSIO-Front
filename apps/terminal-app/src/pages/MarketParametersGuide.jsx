import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    TrendingUp, Activity, DollarSign, BarChart2,
    Layers, BookOpen, ArrowRight, CheckCircle2, Zap
} from 'lucide-react';
import { GlassCard } from '@/components/ui/glass-card';
import { useNavigate } from 'react-router-dom';

// --- ANIMATION COMPONENTS ---

const PriceActionVisual = () => {
    const [mode, setMode] = useState('bullish');

    useEffect(() => {
        const timer = setInterval(() => {
            setMode(prev => prev === 'bullish' ? 'bearish' : 'bullish');
        }, 5000); // Switch every 5 seconds
        return () => clearInterval(timer);
    }, []);

    return (
        <div className="relative w-full h-48 bg-black/20 rounded-xl overflow-hidden flex items-center justify-center border border-white/5">
            <div className="absolute inset-0 grid grid-cols-6 grid-rows-4 gap-4 opacity-10">
                {Array.from({ length: 24 }).map((_, i) => (
                    <div key={i} className="border-r border-b border-white/20" />
                ))}
            </div>

            {/* Dynamic Path */}
            <svg className="w-full h-full px-8 py-4 overflow-visible" viewBox="0 0 400 150" preserveAspectRatio="none">
                <AnimatePresence mode="wait">
                    {mode === 'bullish' ? (
                        <motion.g key="bullish">
                            {/* Bullish Path: Higher Highs, Higher Lows */}
                            {/* Start Bottom Left -> End Top Right */}
                            <motion.path
                                d="M 0 130 L 80 60 L 140 100 L 240 30 L 300 70 L 400 10"
                                fill="none"
                                stroke="#10b981"
                                strokeWidth="3"
                                initial={{ pathLength: 0, opacity: 0 }}
                                animate={{ pathLength: 1, opacity: 1 }}
                                exit={{ opacity: 0 }}
                                transition={{ duration: 2, ease: "easeInOut" }}
                            />
                            {/* Higher Low Markers */}
                            {[
                                { cx: 140, cy: 100 }, { cx: 300, cy: 70 }
                            ].map((pt, i) => (
                                <motion.circle
                                    key={i}
                                    cx={pt.cx}
                                    cy={pt.cy}
                                    r="5"
                                    fill="#10b981"
                                    stroke="#02040A"
                                    strokeWidth="2"
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    exit={{ scale: 0 }}
                                    transition={{ delay: 1 + (i * 0.5), duration: 0.3 }}
                                />
                            ))}
                        </motion.g>
                    ) : (
                        <motion.g key="bearish">
                            {/* Bearish Path: Lower Lows, Lower Highs */}
                            {/* Start Top Left -> End Bottom Right */}
                            <motion.path
                                d="M 0 20 L 80 90 L 140 50 L 240 120 L 300 80 L 400 140"
                                fill="none"
                                stroke="#f43f5e"
                                strokeWidth="3"
                                initial={{ pathLength: 0, opacity: 0 }}
                                animate={{ pathLength: 1, opacity: 1 }}
                                exit={{ opacity: 0 }}
                                transition={{ duration: 2, ease: "easeInOut" }}
                            />
                            {/* Lower High Markers */}
                            {[
                                { cx: 140, cy: 50 }, { cx: 300, cy: 80 }
                            ].map((pt, i) => (
                                <motion.circle
                                    key={i}
                                    cx={pt.cx}
                                    cy={pt.cy}
                                    r="5"
                                    fill="#f43f5e"
                                    stroke="#02040A"
                                    strokeWidth="2"
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    exit={{ scale: 0 }}
                                    transition={{ delay: 1 + (i * 0.5), duration: 0.3 }}
                                />
                            ))}
                        </motion.g>
                    )}
                </AnimatePresence>
            </svg>

            <div className="absolute bottom-4 right-4">
                <AnimatePresence mode="wait">
                    {mode === 'bullish' ? (
                        <motion.div
                            key="bullish-label"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-1 rounded border border-emerald-500/20 shadow-[0_0_10px_rgba(16,185,129,0.2)]"
                        >
                            HIGHER LOWS = BULLISH
                        </motion.div>
                    ) : (
                        <motion.div
                            key="bearish-label"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className="text-[10px] font-mono text-rose-400 bg-rose-500/10 px-2 py-1 rounded border border-rose-500/20 shadow-[0_0_10px_rgba(244,63,94,0.2)]"
                        >
                            LOWER HIGHS = BEARISH
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
};

const CVDVisual = () => {
    const SCAN_DURATION_MS = 2500; // How long the scanner line moves
    const CYCLE_DELAY_MS = 3500;   // How long the signal stays displayed before new scan (increased for readability)

    const [mode, setMode] = useState('bearish');
    const [showLabel, setShowLabel] = useState(false);

    const isBearish = mode === 'bearish';

    // Cycle: scan -> show signal -> switch mode -> new scan
    useEffect(() => {
        // At the start of each cycle – hide the signal
        setShowLabel(false);

        // After the scan ends – show the signal for the current mode
        const labelTimer = setTimeout(() => {
            setShowLabel(true);
        }, SCAN_DURATION_MS);

        // After scan + display time – switch mode and start new cycle
        const modeTimer = setTimeout(() => {
            setMode(prev => (prev === 'bearish' ? 'bullish' : 'bearish'));
        }, SCAN_DURATION_MS + CYCLE_DELAY_MS);

        return () => {
            clearTimeout(labelTimer);
            clearTimeout(modeTimer);
        };
    }, [mode]);

    return (
        <div className="relative w-full h-56 bg-black/20 rounded-xl overflow-hidden flex flex-col border border-white/5 group">
            {/* Background Grid */}
            <div className="absolute inset-0 grid grid-cols-6 gap-px opacity-10 pointer-events-none">
                {[...Array(6)].map((_, i) => <div key={i} className="bg-white/10 h-full w-px" />)}
                <div className="absolute inset-0 grid grid-rows-2 gap-px">
                    <div className="border-b border-white/10 w-full" />
                </div>
            </div>

            {/* PRICE PANEL (TOP) */}
            <div className="flex-1 relative flex items-center px-4 border-b border-white/5 bg-gradient-to-b from-white/[0.02] to-transparent">
                <div className="absolute top-2 left-2 flex items-center gap-1.5 z-10">
                    <div className={`w-1.5 h-1.5 rounded-full ${isBearish ? 'bg-emerald-500' : 'bg-rose-500'} transition-colors duration-500`} />
                    <span className={`text-[9px] font-bold ${isBearish ? 'text-emerald-500' : 'text-rose-500'} uppercase tracking-wider transition-colors duration-500`}>Price Action</span>
                </div>

                <svg className="w-full h-full overflow-visible" viewBox="0 0 600 100" preserveAspectRatio="none">
                    <AnimatePresence mode="wait">
                        {isBearish ? (
                            <motion.g key="bearish-price">
                                {/* Bearish Scenario: Price making Higher Highs */}
                                <motion.path
                                    d="M 0 80 C 100 80, 150 20, 200 20 C 250 20, 300 60, 350 60 C 400 60, 450 10, 500 10 C 550 10, 600 30, 600 30"
                                    fill="none"
                                    stroke="#10b981"
                                    strokeWidth="2"
                                    initial={{ pathLength: 0 }}
                                    animate={{ pathLength: 1 }}
                                    exit={{ opacity: 0 }}
                                    transition={{ duration: SCAN_DURATION_MS / 1000, ease: "linear" }}
                                />
                                {/* Peak Markers */}
                                <motion.circle cx="200" cy="20" r="3" fill="#10b981" initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.8 }} />
                                <motion.circle cx="500" cy="10" r="3" fill="#10b981" initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 2.1 }} />
                                <motion.line
                                    x1="200" y1="20" x2="500" y2="10"
                                    stroke="#10b981" strokeWidth="1" strokeDasharray="4 4"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 0.5 }}
                                    transition={{ delay: 2.1, duration: 0.4 }}
                                />
                            </motion.g>
                        ) : (
                            <motion.g key="bullish-price">
                                {/* Bullish Scenario: Price making Lower Lows */}
                                <motion.path
                                    d="M 0 20 C 100 20, 150 70, 200 70 C 250 70, 300 40, 350 40 C 400 40, 450 90, 500 90 C 550 90, 600 60, 600 60"
                                    fill="none"
                                    stroke="#f43f5e"
                                    strokeWidth="2"
                                    initial={{ pathLength: 0 }}
                                    animate={{ pathLength: 1 }}
                                    exit={{ opacity: 0 }}
                                    transition={{ duration: SCAN_DURATION_MS / 1000, ease: "linear" }}
                                />
                                <motion.circle cx="200" cy="70" r="3" fill="#f43f5e" initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.8 }} />
                                <motion.circle cx="500" cy="90" r="3" fill="#f43f5e" initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 2.1 }} />
                                <motion.line
                                    x1="200" y1="70" x2="500" y2="90"
                                    stroke="#f43f5e" strokeWidth="1" strokeDasharray="4 4"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 0.5 }}
                                    transition={{ delay: 2.1, duration: 0.4 }}
                                />
                            </motion.g>
                        )}
                    </AnimatePresence>
                </svg>
            </div>

            {/* CVD PANEL (BOTTOM) */}
            <div className="flex-1 relative flex items-center px-4 bg-gradient-to-b from-white/[0.02] to-transparent">
                <div className="absolute top-2 left-2 flex items-center gap-1.5 z-10">
                    <div className={`w-1.5 h-1.5 rounded-full ${isBearish ? 'bg-rose-500' : 'bg-emerald-500'} transition-colors duration-500`} />
                    <span className={`text-[9px] font-bold ${isBearish ? 'text-rose-500' : 'text-emerald-500'} uppercase tracking-wider transition-colors duration-500`}>CVD (Delta)</span>
                </div>

                <svg className="w-full h-full overflow-visible" viewBox="0 0 600 100" preserveAspectRatio="none">
                    <AnimatePresence mode="wait">
                        {isBearish ? (
                            <motion.g key="bearish-cvd">
                                {/* Bearish Scenario: CVD making Lower Highs (Divergence) */}
                                <motion.path
                                    d="M 0 80 C 100 80, 150 20, 200 20 C 250 20, 300 60, 350 60 C 400 60, 450 40, 500 40 C 550 40, 600 70, 600 70"
                                    fill="none"
                                    stroke="#f43f5e"
                                    strokeWidth="2"
                                    initial={{ pathLength: 0 }}
                                    animate={{ pathLength: 1 }}
                                    exit={{ opacity: 0 }}
                                    transition={{ duration: SCAN_DURATION_MS / 1000, ease: "linear" }}
                                />
                                <motion.circle cx="200" cy="20" r="3" fill="#f43f5e" initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.8 }} />
                                <motion.circle cx="500" cy="40" r="3" fill="#f43f5e" initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 2.1 }} />
                                <motion.line
                                    x1="200" y1="20" x2="500" y2="40"
                                    stroke="#f43f5e" strokeWidth="1" strokeDasharray="4 4"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 0.5 }}
                                    transition={{ delay: 2.1, duration: 0.4 }}
                                />
                            </motion.g>
                        ) : (
                            <motion.g key="bullish-cvd">
                                {/* Bullish Scenario: CVD making Higher Lows (Divergence) */}
                                <motion.path
                                    d="M 0 20 C 100 20, 150 70, 200 70 C 250 70, 300 40, 350 40 C 400 40, 450 50, 500 50 C 550 50, 600 30, 600 30"
                                    fill="none"
                                    stroke="#10b981"
                                    strokeWidth="2"
                                    initial={{ pathLength: 0 }}
                                    animate={{ pathLength: 1 }}
                                    exit={{ opacity: 0 }}
                                    transition={{ duration: SCAN_DURATION_MS / 1000, ease: "linear" }}
                                />
                                <motion.circle cx="200" cy="70" r="3" fill="#10b981" initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.8 }} />
                                <motion.circle cx="500" cy="50" r="3" fill="#10b981" initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 2.1 }} />
                                <motion.line
                                    x1="200" y1="70" x2="500" y2="50"
                                    stroke="#10b981" strokeWidth="1" strokeDasharray="4 4"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 0.5 }}
                                    transition={{ delay: 2.1, duration: 0.4 }}
                                />
                            </motion.g>
                        )}
                    </AnimatePresence>
                </svg>

                {/* Divergence Label - controlled by showLabel */}
                <div className="absolute bottom-3 right-3 z-20">
                    <AnimatePresence mode="wait">
                        {showLabel && (
                            isBearish ? (
                                <motion.div
                                    key="bearish-label"
                                    initial={{ opacity: 0, scale: 0.8, y: 10 }}
                                    animate={{ opacity: 1, scale: 1, y: 0 }}
                                    exit={{ opacity: 0, scale: 0.8, y: -10 }}
                                    className="bg-black/80 border border-rose-500/50 rounded-lg px-3 py-1.5 flex flex-col items-center shadow-[0_0_15px_rgba(244,63,94,0.3)] backdrop-blur-md"
                                >
                                    <div className="text-[9px] font-bold text-rose-400 uppercase tracking-widest mb-0.5">Signal Detected</div>
                                    <div className="text-xs font-bold text-white">Bearish Divergence</div>
                                </motion.div>
                            ) : (
                                <motion.div
                                    key="bullish-label"
                                    initial={{ opacity: 0, scale: 0.8, y: 10 }}
                                    animate={{ opacity: 1, scale: 1, y: 0 }}
                                    exit={{ opacity: 0, scale: 0.8, y: -10 }}
                                    className="bg-black/80 border border-emerald-500/50 rounded-lg px-3 py-1.5 flex flex-col items-center shadow-[0_0_15px_rgba(16,185,129,0.3)] backdrop-blur-md"
                                >
                                    <div className="text-[9px] font-bold text-emerald-400 uppercase tracking-widest mb-0.5">Signal Detected</div>
                                    <div className="text-xs font-bold text-white">Bullish Divergence</div>
                                </motion.div>
                            )
                        )}
                    </AnimatePresence>
                </div>
            </div>

            {/* Scanner Line – runs once per mode */}
            <motion.div
                key={mode} // Every time mode changes – the scan restarts
                className="absolute top-0 bottom-0 w-px bg-white/50 shadow-[0_0_10px_white] z-30"
                initial={{ left: "0%" }}
                animate={{ left: "100%" }}
                transition={{ duration: SCAN_DURATION_MS / 1000, ease: "linear" }}
            />
        </div>
    );
};


const RSIVisual = () => {
    const SCAN_DURATION_MS = 2500;
    const CYCLE_DELAY_MS = 3500;

    const [mode, setMode] = useState('bearish');
    const [showLabel, setShowLabel] = useState(false);

    const isBearish = mode === 'bearish';

    useEffect(() => {
        setShowLabel(false);

        const labelTimer = setTimeout(() => {
            setShowLabel(true);
        }, SCAN_DURATION_MS);

        const modeTimer = setTimeout(() => {
            setMode(prev => (prev === 'bearish' ? 'bullish' : 'bearish'));
        }, SCAN_DURATION_MS + CYCLE_DELAY_MS);

        return () => {
            clearTimeout(labelTimer);
            clearTimeout(modeTimer);
        };
    }, [mode]);

    return (
        <div className="relative w-full h-56 bg-black/20 rounded-xl overflow-hidden flex flex-col border border-white/5 group">
            {/* Background Grid */}
            <div className="absolute inset-0 grid grid-cols-6 gap-px opacity-10 pointer-events-none">
                {[...Array(6)].map((_, i) => <div key={i} className="bg-white/10 h-full w-px" />)}
                <div className="absolute inset-0 grid grid-rows-2 gap-px">
                    <div className="border-b border-white/10 w-full" />
                </div>
            </div>

            {/* PRICE PANEL (TOP) */}
            <div className="flex-1 relative flex items-center px-4 border-b border-white/5 bg-gradient-to-b from-white/[0.02] to-transparent">
                <div className="absolute top-2 left-2 flex items-center gap-1.5 z-10">
                    <div className={`w-1.5 h-1.5 rounded-full ${isBearish ? 'bg-emerald-500' : 'bg-rose-500'} transition-colors duration-500`} />
                    <span className={`text-[9px] font-bold ${isBearish ? 'text-emerald-500' : 'text-rose-500'} uppercase tracking-wider transition-colors duration-500`}>Price</span>
                </div>

                <svg className="w-full h-full overflow-visible" viewBox="0 0 600 100" preserveAspectRatio="none">
                    <AnimatePresence mode="wait">
                        {isBearish ? (
                            <motion.g key="bearish-price">
                                <motion.path
                                    d="M 0 80 C 100 80, 150 20, 200 20 C 250 20, 300 60, 350 60 C 400 60, 450 10, 500 10 C 550 10, 600 30, 600 30"
                                    fill="none"
                                    stroke="#10b981"
                                    strokeWidth="2"
                                    initial={{ pathLength: 0 }}
                                    animate={{ pathLength: 1 }}
                                    exit={{ opacity: 0 }}
                                    transition={{ duration: SCAN_DURATION_MS / 1000, ease: "linear" }}
                                />
                                <motion.line
                                    x1="200" y1="20" x2="500" y2="10"
                                    stroke="#10b981" strokeWidth="1" strokeDasharray="4 4"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 0.5 }}
                                    transition={{ delay: 2.1, duration: 0.4 }}
                                />
                            </motion.g>
                        ) : (
                            <motion.g key="bullish-price">
                                <motion.path
                                    d="M 0 20 C 100 20, 150 70, 200 70 C 250 70, 300 40, 350 40 C 400 40, 450 90, 500 90 C 550 90, 600 60, 600 60"
                                    fill="none"
                                    stroke="#f43f5e"
                                    strokeWidth="2"
                                    initial={{ pathLength: 0 }}
                                    animate={{ pathLength: 1 }}
                                    exit={{ opacity: 0 }}
                                    transition={{ duration: SCAN_DURATION_MS / 1000, ease: "linear" }}
                                />
                                <motion.line
                                    x1="200" y1="70" x2="500" y2="90"
                                    stroke="#f43f5e" strokeWidth="1" strokeDasharray="4 4"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 0.5 }}
                                    transition={{ delay: 2.1, duration: 0.4 }}
                                />
                            </motion.g>
                        )}
                    </AnimatePresence>
                </svg>
            </div>

            {/* RSI PANEL (BOTTOM) */}
            <div className="flex-1 relative flex items-center px-4 bg-gradient-to-b from-white/[0.02] to-transparent">
                <div className="absolute top-2 left-2 flex items-center gap-1.5 z-10">
                    <div className="w-1.5 h-1.5 rounded-full bg-purple-500" />
                    <span className="text-[9px] font-bold text-purple-500 uppercase tracking-wider">RSI (Momentum)</span>
                </div>

                {/* Overbought/Oversold Lines */}
                <div className="absolute top-[30%] left-0 right-0 border-t border-dashed border-white/10" />
                <div className="absolute bottom-[30%] left-0 right-0 border-t border-dashed border-white/10" />

                <svg className="w-full h-full overflow-visible" viewBox="0 0 600 100" preserveAspectRatio="none">
                    <AnimatePresence mode="wait">
                        {isBearish ? (
                            <motion.g key="bearish-rsi">
                                <motion.path
                                    d="M 0 70 C 100 70, 150 20, 200 20 C 250 20, 300 50, 350 50 C 400 50, 450 40, 500 40 C 550 40, 600 60, 600 60"
                                    fill="none"
                                    stroke="#a855f7"
                                    strokeWidth="2"
                                    initial={{ pathLength: 0 }}
                                    animate={{ pathLength: 1 }}
                                    exit={{ opacity: 0 }}
                                    transition={{ duration: SCAN_DURATION_MS / 1000, ease: "linear" }}
                                />
                                <motion.circle cx="200" cy="20" r="3" fill="#a855f7" initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.8 }} />
                                <motion.circle cx="500" cy="40" r="3" fill="#a855f7" initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 2.1 }} />
                                <motion.line
                                    x1="200" y1="20" x2="500" y2="40"
                                    stroke="#a855f7" strokeWidth="1" strokeDasharray="4 4"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 0.5 }}
                                    transition={{ delay: 2.1, duration: 0.4 }}
                                />
                            </motion.g>
                        ) : (
                            <motion.g key="bullish-rsi">
                                <motion.path
                                    d="M 0 30 C 100 30, 150 80, 200 80 C 250 80, 300 50, 350 50 C 400 50, 450 60, 500 60 C 550 60, 600 40, 600 40"
                                    fill="none"
                                    stroke="#a855f7"
                                    strokeWidth="2"
                                    initial={{ pathLength: 0 }}
                                    animate={{ pathLength: 1 }}
                                    exit={{ opacity: 0 }}
                                    transition={{ duration: SCAN_DURATION_MS / 1000, ease: "linear" }}
                                />
                                <motion.circle cx="200" cy="80" r="3" fill="#a855f7" initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.8 }} />
                                <motion.circle cx="500" cy="60" r="3" fill="#a855f7" initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 2.1 }} />
                                <motion.line
                                    x1="200" y1="80" x2="500" y2="60"
                                    stroke="#a855f7" strokeWidth="1" strokeDasharray="4 4"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 0.5 }}
                                    transition={{ delay: 2.1, duration: 0.4 }}
                                />
                            </motion.g>
                        )}
                    </AnimatePresence>
                </svg>

                {/* Signal Label - controlled by showLabel */}
                <div className="absolute bottom-3 right-3 z-20">
                    <AnimatePresence mode="wait">
                        {showLabel && (
                            isBearish ? (
                                <motion.div
                                    key="bearish-label"
                                    initial={{ opacity: 0, scale: 0.8, y: 10 }}
                                    animate={{ opacity: 1, scale: 1, y: 0 }}
                                    exit={{ opacity: 0, scale: 0.8, y: -10 }}
                                    className="bg-black/80 border border-purple-500/50 rounded-lg px-3 py-1.5 flex flex-col items-center shadow-[0_0_15px_rgba(168,85,247,0.3)] backdrop-blur-md"
                                >
                                    <div className="text-[9px] font-bold text-purple-400 uppercase tracking-widest mb-0.5">Momentum Signal</div>
                                    <div className="text-xs font-bold text-white">Bearish Divergence</div>
                                </motion.div>
                            ) : (
                                <motion.div
                                    key="bullish-label"
                                    initial={{ opacity: 0, scale: 0.8, y: 10 }}
                                    animate={{ opacity: 1, scale: 1, y: 0 }}
                                    exit={{ opacity: 0, scale: 0.8, y: -10 }}
                                    className="bg-black/80 border border-purple-500/50 rounded-lg px-3 py-1.5 flex flex-col items-center shadow-[0_0_15px_rgba(168,85,247,0.3)] backdrop-blur-md"
                                >
                                    <div className="text-[9px] font-bold text-purple-400 uppercase tracking-widest mb-0.5">Momentum Signal</div>
                                    <div className="text-xs font-bold text-white">Bullish Divergence</div>
                                </motion.div>
                            )
                        )}
                    </AnimatePresence>
                </div>
            </div>

            {/* Scanner Line – runs once per mode */}
            <motion.div
                key={mode}
                className="absolute top-0 bottom-0 w-px bg-white/50 shadow-[0_0_10px_white] z-30"
                initial={{ left: "0%" }}
                animate={{ left: "100%" }}
                transition={{ duration: SCAN_DURATION_MS / 1000, ease: "linear" }}
            />
        </div>
    );
};


const OIVisual = () => {
    const SCAN_DURATION_MS = 2500;
    const CYCLE_DELAY_MS = 3500;

    const [mode, setMode] = useState('short_covering');
    const [showLabel, setShowLabel] = useState(false);

    const isShortCovering = mode === 'short_covering';

    useEffect(() => {
        setShowLabel(false);

        const labelTimer = setTimeout(() => {
            setShowLabel(true);
        }, SCAN_DURATION_MS);

        const modeTimer = setTimeout(() => {
            setMode(prev => (prev === 'short_covering' ? 'new_money' : 'short_covering'));
        }, SCAN_DURATION_MS + CYCLE_DELAY_MS);

        return () => {
            clearTimeout(labelTimer);
            clearTimeout(modeTimer);
        };
    }, [mode]);

    return (
        <div className="relative w-full h-56 bg-black/20 rounded-xl overflow-hidden flex flex-col border border-white/5 group">
            {/* Background Grid */}
            <div className="absolute inset-0 grid grid-cols-6 gap-px opacity-10 pointer-events-none">
                {[...Array(6)].map((_, i) => <div key={i} className="bg-white/10 h-full w-px" />)}
                <div className="absolute inset-0 grid grid-rows-2 gap-px">
                    <div className="border-b border-white/10 w-full" />
                </div>
            </div>

            {/* PRICE PANEL (TOP) */}
            <div className="flex-1 relative flex items-center px-4 border-b border-white/5 bg-gradient-to-b from-white/[0.02] to-transparent">
                <div className="absolute top-2 left-2 flex items-center gap-1.5 z-10">
                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                    <span className="text-[9px] font-bold text-emerald-500 uppercase tracking-wider">Price (Rising)</span>
                </div>

                <svg className="w-full h-full overflow-visible" viewBox="0 0 600 100" preserveAspectRatio="none">
                    <motion.g key={mode}>
                        <motion.path
                            d="M 0 80 C 100 80, 150 50, 200 50 C 250 50, 300 40, 350 40 C 400 40, 450 20, 500 20 C 550 20, 600 10, 600 10"
                            fill="none"
                            stroke="#10b981"
                            strokeWidth="2"
                            initial={{ pathLength: 0 }}
                            animate={{ pathLength: 1 }}
                            transition={{ duration: SCAN_DURATION_MS / 1000, ease: "linear" }}
                        />
                        <motion.circle cx="550" cy="15" r="3" fill="#10b981" initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 2.3 }} />
                    </motion.g>
                </svg>
            </div>

            {/* OPEN INTEREST PANEL (BOTTOM) */}
            <div className="flex-1 relative flex items-center px-4 bg-gradient-to-b from-white/[0.02] to-transparent">
                <div className="absolute top-2 left-2 flex items-center gap-1.5 z-10">
                    <div className={`w-1.5 h-1.5 rounded-full ${isShortCovering ? 'bg-rose-500' : 'bg-indigo-500'} transition-colors duration-500`} />
                    <span className={`text-[9px] font-bold ${isShortCovering ? 'text-rose-500' : 'text-indigo-500'} uppercase tracking-wider transition-colors duration-500`}>Open Interest</span>
                </div>

                <svg className="w-full h-full overflow-visible" viewBox="0 0 600 100" preserveAspectRatio="none">
                    <AnimatePresence mode="wait">
                        {isShortCovering ? (
                            <motion.g key="oi-down">
                                <motion.path
                                    d="M 0 20 C 100 20, 150 40, 200 40 C 250 40, 300 50, 350 50 C 400 50, 450 70, 500 70 C 550 70, 600 85, 600 85"
                                    fill="none"
                                    stroke="#f43f5e"
                                    strokeWidth="2"
                                    initial={{ pathLength: 0 }}
                                    animate={{ pathLength: 1 }}
                                    exit={{ opacity: 0 }}
                                    transition={{ duration: SCAN_DURATION_MS / 1000, ease: "linear" }}
                                />
                                <motion.path d="M 590 80 L 600 85 L 590 90" stroke="#f43f5e" fill="none" strokeWidth="2" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 2.3 }} />
                            </motion.g>
                        ) : (
                            <motion.g key="oi-up">
                                <motion.path
                                    d="M 0 80 C 100 80, 150 60, 200 60 C 250 60, 300 50, 350 50 C 400 50, 450 30, 500 30 C 550 30, 600 15, 600 15"
                                    fill="none"
                                    stroke="#6366f1"
                                    strokeWidth="2"
                                    initial={{ pathLength: 0 }}
                                    animate={{ pathLength: 1 }}
                                    exit={{ opacity: 0 }}
                                    transition={{ duration: SCAN_DURATION_MS / 1000, ease: "linear" }}
                                />
                                <motion.path d="M 590 20 L 600 15 L 590 10" stroke="#6366f1" fill="none" strokeWidth="2" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 2.3 }} />
                            </motion.g>
                        )}
                    </AnimatePresence>
                </svg>

                {/* Context Label - controlled by showLabel */}
                <div className="absolute bottom-3 right-3 z-20">
                    <AnimatePresence mode="wait">
                        {showLabel && (
                            isShortCovering ? (
                                <motion.div
                                    key="short-cover-label"
                                    initial={{ opacity: 0, scale: 0.8, y: 10 }}
                                    animate={{ opacity: 1, scale: 1, y: 0 }}
                                    exit={{ opacity: 0, scale: 0.8, y: -10 }}
                                    className="bg-black/80 border border-rose-500/50 rounded-lg px-3 py-1.5 flex flex-col items-center shadow-[0_0_15px_rgba(244,63,94,0.3)] backdrop-blur-md"
                                >
                                    <div className="text-[9px] font-bold text-rose-400 uppercase tracking-widest mb-0.5">Interpretation</div>
                                    <div className="text-xs font-bold text-white">Shorts Closing</div>
                                    <div className="text-[9px] text-slate-400">Price Up + OI Down</div>
                                </motion.div>
                            ) : (
                                <motion.div
                                    key="new-money-label"
                                    initial={{ opacity: 0, scale: 0.8, y: 10 }}
                                    animate={{ opacity: 1, scale: 1, y: 0 }}
                                    exit={{ opacity: 0, scale: 0.8, y: -10 }}
                                    className="bg-black/80 border border-indigo-500/50 rounded-lg px-3 py-1.5 flex flex-col items-center shadow-[0_0_15px_rgba(99,102,241,0.3)] backdrop-blur-md"
                                >
                                    <div className="text-[9px] font-bold text-indigo-400 uppercase tracking-widest mb-0.5">Interpretation</div>
                                    <div className="text-xs font-bold text-white">New Money Entering</div>
                                    <div className="text-[9px] text-slate-400">Price Up + OI Up</div>
                                </motion.div>
                            )
                        )}
                    </AnimatePresence>
                </div>
            </div>

            {/* Scanner Line – runs once per mode */}
            <motion.div
                key={mode}
                className="absolute top-0 bottom-0 w-px bg-white/50 shadow-[0_0_10px_white] z-30"
                initial={{ left: "0%" }}
                animate={{ left: "100%" }}
                transition={{ duration: SCAN_DURATION_MS / 1000, ease: "linear" }}
            />
        </div>
    );
};


const FundingVisual = () => {
    return (
        <div className="relative w-full h-48 bg-black/20 rounded-xl overflow-hidden flex flex-col items-center justify-center border border-white/5 p-6">
            <div className="w-full h-2 bg-white/10 rounded-full relative mb-8">
                <div className="absolute left-1/2 top-0 bottom-0 w-0.5 bg-white/20 -translate-x-1/2 h-4 -mt-1" />
                <motion.div
                    className="absolute top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.5)] border-2 border-white"
                    initial={{ left: "50%" }}
                    whileInView={{ left: ["50%", "80%", "50%", "20%", "50%"] }}
                    transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                />
            </div>

            <div className="flex justify-between w-full text-[10px] uppercase font-bold tracking-wider">
                <div className="text-rose-400 text-center">
                    Shorts Pay Longs<br />(Negative)
                </div>
                <div className="text-emerald-400 text-center">
                    Longs Pay Shorts<br />(Positive)
                </div>
            </div>

            <div className="mt-6 text-xs text-slate-400 text-center">
                Extreme rates often signal potential reversals.
            </div>
        </div>
    );
};

const VolumeVisual = () => {
    const SCAN_DURATION_MS = 2500;
    const CYCLE_DELAY_MS = 3500;

    const [mode, setMode] = useState('conviction');
    const [showLabel, setShowLabel] = useState(false);

    const isConviction = mode === 'conviction';

    useEffect(() => {
        setShowLabel(false);

        const labelTimer = setTimeout(() => {
            setShowLabel(true);
        }, SCAN_DURATION_MS);

        const modeTimer = setTimeout(() => {
            setMode(prev => (prev === 'conviction' ? 'divergence' : 'conviction'));
        }, SCAN_DURATION_MS + CYCLE_DELAY_MS);

        return () => {
            clearTimeout(labelTimer);
            clearTimeout(modeTimer);
        };
    }, [mode]);

    // Use useMemo to generate stable random heights for the bars
    const barData = useMemo(() => {
        return Array.from({ length: 24 }).map((_, i) => ({
            convictionHeight: (i >= 12 && i <= 16) ? 70 + Math.random() * 25 : 15 + Math.random() * 15,
            divergenceHeight: (i >= 12 && i <= 16) ? 20 + Math.random() * 10 : 15 + Math.random() * 15,
        }));
    }, []);

    return (
        <div className="relative w-full h-64 bg-black/20 rounded-xl overflow-hidden flex flex-col border border-white/5 group">
            {/* Background Grid */}
            <div className="absolute inset-0 grid grid-cols-6 gap-px opacity-10 pointer-events-none">
                {[...Array(6)].map((_, i) => <div key={i} className="bg-white/10 h-full w-px" />)}
            </div>

            {/* PRICE PANEL (TOP 60%) */}
            <div className="h-[60%] relative flex items-center px-4 border-b border-white/5 bg-gradient-to-b from-white/[0.02] to-transparent">
                {/* Resistance Line */}
                <div className="absolute top-[40%] left-0 right-0 border-t border-dashed border-white/20">
                    <span className="absolute right-2 -top-3 text-[9px] text-slate-500 uppercase">Resistance</span>
                </div>

                <div className="absolute top-2 left-2 flex items-center gap-1.5 z-10">
                    <div className={`w-1.5 h-1.5 rounded-full ${isConviction ? 'bg-emerald-500' : 'bg-rose-500'} transition-colors duration-500`} />
                    <span className={`text-[9px] font-bold ${isConviction ? 'text-emerald-500' : 'text-rose-500'} uppercase tracking-wider transition-colors duration-500`}>
                        {isConviction ? 'Breakout' : 'Fakeout'}
                    </span>
                </div>

                <svg className="w-full h-full overflow-visible" viewBox="0 0 600 100" preserveAspectRatio="none">
                    <AnimatePresence mode="wait">
                        {isConviction ? (
                            <motion.g key="conviction-price">
                                <motion.path
                                    d="M 0 80 L 100 75 L 200 80 L 250 40 L 300 30 L 400 20 L 500 25 L 600 15"
                                    fill="none"
                                    stroke="#10b981"
                                    strokeWidth="3"
                                    initial={{ pathLength: 0 }}
                                    animate={{ pathLength: 1 }}
                                    exit={{ opacity: 0 }}
                                    transition={{ duration: SCAN_DURATION_MS / 1000, ease: "linear" }}
                                />
                            </motion.g>
                        ) : (
                            <motion.g key="divergence-price">
                                <motion.path
                                    d="M 0 80 L 100 78 L 200 80 L 280 40 L 350 35 L 450 60 L 550 90 L 600 95"
                                    fill="none"
                                    stroke="#f43f5e"
                                    strokeWidth="3"
                                    initial={{ pathLength: 0 }}
                                    animate={{ pathLength: 1 }}
                                    exit={{ opacity: 0 }}
                                    transition={{ duration: SCAN_DURATION_MS / 1000, ease: "linear" }}
                                />
                            </motion.g>
                        )}
                    </AnimatePresence>
                </svg>
            </div>

            {/* VOLUME PANEL (BOTTOM 40%) */}
            <div className="h-[40%] relative px-4 flex items-end justify-between gap-1 pb-0 bg-black/40">
                <div className="absolute top-2 left-2 flex items-center gap-1.5 z-10">
                    <div className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                    <span className="text-[9px] font-bold text-amber-500 uppercase tracking-wider">Volume Profile</span>
                </div>

                {/* Render Bars */}
                {barData.map((data, i) => {
                    const height = isConviction ? data.convictionHeight : data.divergenceHeight;

                    let color = "bg-slate-700";
                    if (isConviction) {
                        if (i >= 12 && i <= 16) color = "bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]";
                        else if (i > 16) color = "bg-emerald-500/50";
                    } else {
                        if (i >= 12 && i <= 16) color = "bg-rose-500 shadow-[0_0_10px_rgba(244,63,94,0.5)]";
                        else if (i > 16) color = "bg-rose-500/50";
                    }

                    return (
                        <motion.div
                            key={`${mode}-${i}`}
                            className={`w-full rounded-t-sm ${color}`}
                            initial={{ height: 10 }}
                            animate={{ height: `${height}%` }}
                            transition={{ duration: 0.5, delay: i * 0.04 }}
                        />
                    )
                })}

                {/* Signal Label - controlled by showLabel */}
                <div className="absolute top-[-20px] right-3 z-20">
                    <AnimatePresence mode="wait">
                        {showLabel && (
                            isConviction ? (
                                <motion.div
                                    key="conviction-label"
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -10 }}
                                    className="bg-black/80 border border-emerald-500/50 rounded-lg px-3 py-1.5 flex flex-col items-center shadow-[0_0_15px_rgba(16,185,129,0.3)] backdrop-blur-md"
                                >
                                    <div className="text-[9px] font-bold text-emerald-400 uppercase tracking-widest mb-0.5">Analysis</div>
                                    <div className="text-xs font-bold text-white">Valid Breakout</div>
                                </motion.div>
                            ) : (
                                <motion.div
                                    key="divergence-label"
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -10 }}
                                    className="bg-black/80 border border-rose-500/50 rounded-lg px-3 py-1.5 flex flex-col items-center shadow-[0_0_15px_rgba(244,63,94,0.3)] backdrop-blur-md"
                                >
                                    <div className="text-[9px] font-bold text-rose-400 uppercase tracking-widest mb-0.5">Analysis</div>
                                    <div className="text-xs font-bold text-white">Weak / Fakeout</div>
                                </motion.div>
                            )
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </div>
    );
};



// --- SECTION COMPONENT ---

const GuideSection = ({ title, sub, icon: Icon, color, children, visual }) => (
    <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-50px" }}
        className="mb-12 last:mb-0"
    >
        <div className="flex items-center gap-3 mb-6">
            <div className={`p-3 rounded-xl bg-${color}-500/10 text-${color}-400 border border-${color}-500/20`}>
                <Icon className="w-6 h-6" />
            </div>
            <div>
                <h2 className="text-2xl font-light text-white">{title}</h2>
                <p className="text-sm text-slate-400">{sub}</p>
            </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
            <div className="space-y-6">
                {children}
            </div>
            <div>
                <div className="sticky top-24">
                    <div className="mb-2 flex justify-between items-center">
                        <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Visual Guide</span>
                        <span className={`text-[10px] px-2 py-0.5 rounded-full bg-${color}-500/10 text-${color}-400 border border-${color}-500/20`}>Live Concept</span>
                    </div>
                    {visual}
                </div>
            </div>
        </div>
    </motion.div>
);

const ChecklistItem = ({ children }) => (
    <div className="flex gap-3 items-start p-4 rounded-xl bg-white/5 border border-white/5 hover:bg-white/[0.07] transition-colors">
        <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
        <div className="text-sm text-slate-300 leading-relaxed">
            {children}
        </div>
    </div>
);

export default function MarketParametersGuide() {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen pt-32 pb-20 px-6 max-w-6xl mx-auto relative cursor-default">

            {/* Header */}
            <div className="text-center mb-20 relative z-10">
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-emerald-300 text-[10px] font-bold uppercase tracking-widest mb-6 backdrop-blur-md"
                >
                    <BookOpen className="w-3.5 h-3.5" /> Educational Resources
                </motion.div>
                <motion.h1
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-5xl md:text-6xl font-light text-white mb-6"
                >
                    Market Parameters <span className="text-emerald-400 font-normal">Guide</span>
                </motion.h1>
                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="text-xl text-slate-400 font-light max-w-2xl mx-auto"
                >
                    Master the institutional metrics that drive market decisions. <br />
                    Stop guessing. Start reading the flow.
                </motion.p>
            </div>

            {/* CONTENT BLOCKS */}
            <div className="relative z-10 space-y-20">

                {/* 1. PRICE ACTION */}
                <GuideSection
                    title="Price Action"
                    sub="Understanding market trends and momentum"
                    icon={TrendingUp}
                    color="emerald"
                    visual={<PriceActionVisual />}
                >
                    <ChecklistItem>
                        <strong className="text-white block mb-1">Uptrend:</strong> Higher highs and higher lows indicate bullish momentum. Look for entries at the higher low.
                    </ChecklistItem>
                    <ChecklistItem>
                        <strong className="text-white block mb-1">Downtrend:</strong> Lower highs and lower lows signal bearish pressure. Short rallies into lower highs.
                    </ChecklistItem>
                    <ChecklistItem>
                        <strong className="text-white block mb-1">Range:</strong> Price consolidates between support and resistance. Buy low, sell high until breakout.
                    </ChecklistItem>
                    <ChecklistItem>
                        <strong className="text-white block mb-1">Breakout:</strong> Price breaks through key levels with strong volume. Wait for a retest for confirmation.
                    </ChecklistItem>
                </GuideSection>

                {/* 2. CVD */}
                <GuideSection
                    title="Cumulative Volume Delta (CVD)"
                    sub="Measure real-time buying vs selling pressure"
                    icon={Activity}
                    color="rose"
                    visual={<CVDVisual />}
                >
                    <p className="text-slate-400 text-sm mb-4">CVD tracks the cumulative difference between buying and selling volume. It reveals who is aggressive in the market.</p>
                    <ChecklistItem>
                        <strong className="text-white">Positive CVD:</strong> Aggressive buyers stepping in at market price.
                    </ChecklistItem>
                    <ChecklistItem>
                        <strong className="text-white">Negative CVD:</strong> Aggressive sellers dumping at market price.
                    </ChecklistItem>
                    <ChecklistItem>
                        <strong className="text-white">CVD Divergence:</strong> Price moves up but CVD falls (bearish signal). This indicates a lack of buyer support for the move.
                    </ChecklistItem>
                    <ChecklistItem>
                        <strong className="text-white">CVD Confirmation:</strong> Price and CVD move together (trend strength).
                    </ChecklistItem>
                </GuideSection>

                {/* 3. RSI (New) */}
                <GuideSection
                    title="Relative Strength Index (RSI)"
                    sub="Momentum oscillator measuring speed and change of price movements"
                    icon={Zap}
                    color="purple"
                    visual={<RSIVisual />}
                >
                    <p className="text-slate-400 text-sm mb-4">RSI measures the speed and magnitude of recent price changes to evaluate overvalued or undervalued conditions.</p>
                    <ChecklistItem>
                        <strong className="text-white">Overbought ({'>'}70):</strong> Asset may be primed for a trend reversal or corrective pullback.
                    </ChecklistItem>
                    <ChecklistItem>
                        <strong className="text-white">Oversold ({'<'}30):</strong> Asset may be undervalued and primed for a bounce.
                    </ChecklistItem>
                    <ChecklistItem>
                        <strong className="text-white">RSI Divergence:</strong> Similar to CVD, if Price makes a higher high but RSI makes a lower high, momentum is fading (Bearish).
                    </ChecklistItem>
                    <ChecklistItem>
                        <strong className="text-white">Trend Confirmation:</strong> In strong trends, RSI can stay overbought/oversold for long periods. Divergence is the key invalidation signal.
                    </ChecklistItem>
                </GuideSection>

                {/* 4. OPEN INTEREST */}
                <GuideSection
                    title="Open Interest"
                    sub="Track institutional positioning and commitment"
                    icon={DollarSign}
                    color="indigo"
                    visual={<OIVisual />}
                >
                    <p className="text-slate-400 text-sm mb-4">Open Interest (OI) represents the total number of outstanding derivative contracts. It shows capital flow.</p>
                    <ChecklistItem>
                        <strong className="text-white block mb-1">Rising OI + Price Up:</strong> New longs entering, strong bullish momentum.
                    </ChecklistItem>
                    <ChecklistItem>
                        <strong className="text-white block mb-1">Rising OI + Price Down:</strong> New shorts entering, strong bearish pressure.
                    </ChecklistItem>
                    <ChecklistItem>
                        <strong className="text-white block mb-1">Falling OI + Price Up:</strong> Shorts covering, potential exhaustion or squeeze.
                    </ChecklistItem>
                    <ChecklistItem>
                        <strong className="text-white block mb-1">Falling OI + Price Down:</strong> Longs closing, potential bottom forming.
                    </ChecklistItem>
                </GuideSection>

                {/* 5. FUNDING RATE */}
                <GuideSection
                    title="Funding Rate"
                    sub="Understand perpetual futures market sentiment"
                    icon={Layers}
                    color="cyan"
                    visual={<FundingVisual />}
                >
                    <ChecklistItem>
                        <strong className="text-white">Positive Funding:</strong> Longs pay shorts, indicating bullish sentiment. Extremely high positive funding can lead to long squeezes.
                    </ChecklistItem>
                    <ChecklistItem>
                        <strong className="text-white">Negative Funding:</strong> Shorts pay longs, indicating bearish sentiment. Extremely negative funding can lead to short squeezes.
                    </ChecklistItem>
                    <ChecklistItem>
                        <strong className="text-white">Extreme Rates:</strong> Often signal potential reversals or liquidations as the crowd piles into one side.
                    </ChecklistItem>
                    <ChecklistItem>
                        <strong className="text-white">Neutral Funding:</strong> Balanced market with no clear directional bias.
                    </ChecklistItem>
                </GuideSection>

                {/* 6. VOLUME ANALYSIS */}
                <GuideSection
                    title="Volume Analysis"
                    sub="Identify institutional activity and liquidity"
                    icon={BarChart2}
                    color="amber"
                    visual={<VolumeVisual />}
                >
                    <ChecklistItem>
                        <strong className="text-white">High Volume + Price Move:</strong> Strong conviction in direction. This validates the breakout or trend.
                    </ChecklistItem>
                    <ChecklistItem>
                        <strong className="text-white">Low Volume + Price Move:</strong> Weak move, likely to reverse. Lack of participation.
                    </ChecklistItem>
                    <ChecklistItem>
                        <strong className="text-white">Volume Spikes:</strong> Often indicate institutional activity, news events, or stops being triggered.
                    </ChecklistItem>
                    <ChecklistItem>
                        <strong className="text-white">Volume Divergence:</strong> Price rises on low volume (bearish signal).
                    </ChecklistItem>
                </GuideSection>

            </div>

            {/* Footer CTA */}
            <div className="mt-32 text-center">
                <GlassCard className="p-10 border-indigo-500/20 bg-indigo-900/5 inline-block">
                    <h3 className="text-2xl text-white font-light mb-4">Ready to apply this knowledge?</h3>
                    <div className="flex justify-center">
                        <button
                            onClick={() => navigate('/dashboard')}
                            className="px-6 py-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg flex items-center gap-2 transition-colors"
                        >
                            Launch Dashboard <ArrowRight className="w-4 h-4" />
                        </button>
                    </div>
                </GlassCard>
            </div>

        </div>
    );
}
