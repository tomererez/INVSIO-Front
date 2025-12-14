
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Calculator, DollarSign, Percent, Target,
    TrendingUp, TrendingDown, ArrowRight, Save,
    RotateCcw, AlertTriangle, Crosshair, Scale,
    Plus, Trash2, Info, Settings, HelpCircle, Check, X,
    Shield, Layers
} from 'lucide-react';
import { GlassCard } from '../ui/GlassCard';
import { Button } from '../ui/Button';
import { api } from '../../lib/api';

// --- TYPES ---

interface TargetZone {
    id: number;
    r: string;
    percent: string; // % of remaining position
}

interface TargetResult {
    r: number;
    price: number;
    pnl: number;
    percentClosed: number;
    closeUnits: number;
    remainingUnits: number;
    distance: number;
}

interface CalculationResult {
    riskAmount: number;
    positionSizeUnits: number;
    positionSizeUsd: number;
    entryPrice: number;
    stopPrice: number;
    leverage: number;
    stopLossPercent: number;
    stopDistance: number;
    rrRatio: number;
    targets: TargetResult[];
    totalPotentialProfit: number;
    accountGrowth: number;
    isValid: boolean;
    error?: string;
}

// --- COMPONENTS ---

const CustomSlider: React.FC<{
    value: number;
    onChange: (val: number) => void;
    min?: number;
    max?: number;
    step?: number
}> = ({ value, onChange, min = 0.1, max = 10, step = 0.1 }) => {
    const percentage = ((value - min) / (max - min)) * 100;

    return (
        <div className="relative w-full h-6 flex items-center">
            <div className="absolute w-full h-1.5 bg-slate-700 rounded-full overflow-hidden">
                <div
                    className="h-full bg-gradient-to-r from-emerald-500 via-amber-500 to-rose-500 transition-all duration-100"
                    style={{ width: `${percentage}%` }}
                />
            </div>
            <input
                type="range"
                min={min}
                max={max}
                step={step}
                value={value}
                onChange={(e) => onChange(parseFloat(e.target.value))}
                className="absolute w-full h-full opacity-0 cursor-pointer"
            />
            <div
                className="absolute w-4 h-4 bg-white rounded-full shadow-[0_0_10px_rgba(255,255,255,0.5)] pointer-events-none transition-all duration-100 border-2 border-slate-900"
                style={{ left: `calc(${percentage}% - 8px)` }}
            />
        </div>
    );
};

export const PositionCalculator: React.FC = () => {
    // --- STATE ---
    const [accountBalance, setAccountBalance] = useState<number>(10000); // Default placeholder
    const [riskPercent, setRiskPercent] = useState<number>(1.0); // Default 1%
    const [direction, setDirection] = useState<'Long' | 'Short'>('Long');
    const [btcMode, setBtcMode] = useState(false);

    // Price Settings
    const [priceMode, setPriceMode] = useState<'entry_stop' | 'percent'>('entry_stop');
    const [entryPrice, setEntryPrice] = useState<string>('');
    const [stopPrice, setStopPrice] = useState<string>('');
    const [stopPercent, setStopPercent] = useState<string>('');

    // Targets
    const [targets, setTargets] = useState<TargetZone[]>([
        { id: 1, r: '3', percent: '50' },
        { id: 2, r: '4', percent: '50' },
        { id: 3, r: '5', percent: '100' }
    ]);

    const [smartScaleIn, setSmartScaleIn] = useState(false);
    const [result, setResult] = useState<CalculationResult | null>(null);

    // --- ACTIONS ---

    const handleAddTarget = () => {
        const nextR = targets.length > 0 ? parseFloat(targets[targets.length - 1].r) + 1 : 1;
        setTargets([...targets, { id: Date.now(), r: nextR.toString(), percent: '100' }]);
    };

    const handleRemoveTarget = (id: number) => {
        setTargets(targets.filter(t => t.id !== id));
    };

    const handleCalculate = () => {
        const entry = parseFloat(entryPrice);
        let stop = 0;

        if (priceMode === 'entry_stop') {
            stop = parseFloat(stopPrice);
        } else {
            // Calculate stop based on percent
            const pct = parseFloat(stopPercent);
            if (entry && pct) {
                stop = direction === 'Long'
                    ? entry * (1 - pct / 100)
                    : entry * (1 + pct / 100);
            }
        }

        if (!entry || !stop || !accountBalance) return;

        // Basic Validation
        if (direction === 'Long' && stop >= entry) {
            alert("For Longs, Stop Price must be below Entry Price.");
            return;
        }
        if (direction === 'Short' && stop <= entry) {
            alert("For Shorts, Stop Price must be above Entry Price.");
            return;
        }

        const riskAmount = accountBalance * (riskPercent / 100);
        const priceDiff = Math.abs(entry - stop);
        const stopLossPercent = (priceDiff / entry) * 100;

        const positionSizeUsd = riskAmount / (stopLossPercent / 100);
        const positionSizeUnits = positionSizeUsd / entry;

        // Calculate Targets
        let totalProfit = 0;
        let currentUnits = positionSizeUnits;

        const calculatedTargets: TargetResult[] = targets.map(t => {
            const r = parseFloat(t.r);
            const percentClose = parseFloat(t.percent) / 100;

            const targetPrice = direction === 'Long'
                ? entry + (priceDiff * r)
                : entry - (priceDiff * r);

            const distance = Math.abs(targetPrice - entry) * currentUnits; // Simplified distance value for display

            const unitsToClose = currentUnits * percentClose;

            // Profit for this chunk = (Target Price - Entry Price) * Units Sold
            // For shorts: (Entry - Target) * Units Sold
            const priceDelta = Math.abs(targetPrice - entry);
            const targetPnl = priceDelta * unitsToClose;

            totalProfit += targetPnl;
            const remaining = currentUnits - unitsToClose;

            const resultItem = {
                r,
                price: targetPrice,
                pnl: targetPnl,
                percentClosed: parseFloat(t.percent),
                closeUnits: unitsToClose,
                remainingUnits: remaining,
                distance: priceDelta * positionSizeUnits // Total distance value if full pos
            };

            currentUnits = remaining;
            return resultItem;
        });

        // Avg R:R roughly based on total profit vs risk
        const rrRatio = totalProfit / riskAmount;

        setResult({
            riskAmount,
            positionSizeUnits,
            positionSizeUsd,
            entryPrice: entry,
            stopPrice: stop,
            leverage: 1, // Placeholder
            stopLossPercent,
            stopDistance: priceDiff,
            rrRatio,
            targets: calculatedTargets,
            totalPotentialProfit: totalProfit,
            accountGrowth: (totalProfit / accountBalance) * 100,
            isValid: true
        });
    };

    return (
        <div className="min-h-screen pt-24 pb-12 px-4 md:px-8 max-w-[1600px] mx-auto animate-in fade-in duration-500">

            <div className="text-center mb-10">
                <h1 className="text-3xl md:text-4xl font-semibold text-white mb-2">Professional Position Calculator</h1>
                <p className="text-slate-400 text-sm">Smart 1R Calculation & Risk Management</p>
            </div>

            <div className="grid lg:grid-cols-12 gap-8">

                {/* --- LEFT COLUMN: INPUTS --- */}
                <div className="lg:col-span-6 xl:col-span-5 space-y-6">
                    <GlassCard className="p-6 h-fit border-white/5 bg-white/[0.02]">

                        {/* 1. TRADE SETUP */}
                        <div className="space-y-4">
                            <h3 className="text-lg font-medium text-white">Trade Setup</h3>

                            {/* Warning Banner */}
                            <div className="bg-amber-500/10 border border-amber-500/20 rounded-lg p-3 flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <AlertTriangle className="w-4 h-4 text-amber-500" />
                                    <span className="text-xs text-amber-200">No portfolio set in settings - using default $10,000</span>
                                </div>
                                <button className="text-[10px] bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 px-2 py-1 rounded transition-colors flex items-center gap-1">
                                    Go to Settings <ArrowRight className="w-3 h-3" />
                                </button>
                            </div>

                            {/* Risk Slider */}
                            <div className="bg-card border border-white/5 rounded-xl p-5">
                                <div className="flex justify-between items-center mb-4">
                                    <label className="text-sm font-bold text-white">Risk Percent: <span className="text-rose-400">{riskPercent}%</span></label>
                                    <span className="text-xs text-slate-500">${(accountBalance * (riskPercent / 100)).toFixed(0)}</span>
                                </div>
                                <CustomSlider value={riskPercent} onChange={setRiskPercent} min={0.1} max={10} step={0.1} />
                                <div className="flex justify-between mt-2 text-[10px] text-slate-500">
                                    <span>0.5%</span>
                                    <span>10%</span>
                                </div>
                            </div>

                            {/* Direction */}
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-slate-400">Direction</label>
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => setDirection('Long')}
                                        className={`flex-1 py-3 rounded-lg font-bold text-sm flex items-center justify-center gap-2 transition-all ${direction === 'Long'
                                                ? 'bg-emerald-600 text-white shadow-[0_0_15px_rgba(16,185,129,0.4)]'
                                                : 'bg-white/5 text-slate-400 hover:bg-white/10'
                                            }`}
                                    >
                                        <TrendingUp className="w-4 h-4" /> Long
                                    </button>
                                    <button
                                        onClick={() => setDirection('Short')}
                                        className={`flex-1 py-3 rounded-lg font-bold text-sm flex items-center justify-center gap-2 transition-all ${direction === 'Short'
                                                ? 'bg-rose-600 text-white shadow-[0_0_15px_rgba(244,63,94,0.4)]'
                                                : 'bg-white/5 text-slate-400 hover:bg-white/10'
                                            }`}
                                    >
                                        <TrendingDown className="w-4 h-4" /> Short
                                    </button>
                                </div>
                            </div>

                            {/* BTC Mode */}
                            <div
                                onClick={() => setBtcMode(!btcMode)}
                                className={`p-3 rounded-xl border transition-all cursor-pointer flex items-center gap-3 ${btcMode ? 'bg-indigo-500/20 border-indigo-500/40' : 'bg-white/5 border-white/5 hover:border-white/10'
                                    }`}
                            >
                                <div className={`w-5 h-5 rounded border flex items-center justify-center transition-colors ${btcMode ? 'bg-indigo-500 border-indigo-500' : 'border-slate-500'}`}>
                                    {btcMode && <Check className="w-3.5 h-3.5 text-white" />}
                                </div>
                                <div className="flex-1">
                                    <div className="text-sm font-medium text-white flex items-center gap-2">
                                        BTC Mode {btcMode && <span className="text-[10px] bg-indigo-500 px-1.5 rounded text-white">ON</span>}
                                    </div>
                                    <div className="text-[10px] text-slate-400">Tips for wider stop and lower leverage (doesn't change calculations)</div>
                                </div>
                            </div>
                        </div>

                        {/* 2. PRICE SETTINGS */}
                        <div className="space-y-4 pt-4 border-t border-white/5 mt-4">
                            <div className="flex items-center justify-between">
                                <h3 className="text-lg font-medium text-white">Price Settings</h3>
                                <div className="flex bg-white/5 rounded-lg p-0.5">
                                    <button
                                        onClick={() => setPriceMode('percent')}
                                        className={`text-[10px] px-3 py-1 rounded-md transition-all ${priceMode === 'percent' ? 'bg-slate-700 text-white shadow' : 'text-slate-500'}`}
                                    >
                                        % + Entry
                                    </button>
                                    <button
                                        onClick={() => setPriceMode('entry_stop')}
                                        className={`text-[10px] px-3 py-1 rounded-md transition-all ${priceMode === 'entry_stop' ? 'bg-slate-700 text-white shadow' : 'text-slate-500'}`}
                                    >
                                        Entry + Stop
                                    </button>
                                </div>
                            </div>

                            <div className="space-y-3">
                                <div>
                                    <label className="text-xs text-slate-400 mb-1.5 block">Entry Price ($)</label>
                                    <input
                                        type="number"
                                        value={entryPrice}
                                        onChange={(e) => setEntryPrice(e.target.value)}
                                        placeholder="0.00"
                                        className="w-full bg-[#1e293b] border border-slate-700 rounded-lg px-4 py-3 text-white focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none transition-all placeholder:text-slate-600"
                                    />
                                </div>

                                {priceMode === 'entry_stop' ? (
                                    <div>
                                        <label className="text-xs text-slate-400 mb-1.5 block">Stop Price ($)</label>
                                        <input
                                            type="number"
                                            value={stopPrice}
                                            onChange={(e) => setStopPrice(e.target.value)}
                                            placeholder="0.00"
                                            className="w-full bg-[#1e293b] border border-slate-700 rounded-lg px-4 py-3 text-white focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none transition-all placeholder:text-slate-600"
                                        />
                                    </div>
                                ) : (
                                    <div>
                                        <label className="text-xs text-slate-400 mb-1.5 block">Stop Loss (%)</label>
                                        <input
                                            type="number"
                                            value={stopPercent}
                                            onChange={(e) => setStopPercent(e.target.value)}
                                            placeholder="1.5"
                                            className="w-full bg-[#1e293b] border border-slate-700 rounded-lg px-4 py-3 text-white focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none transition-all placeholder:text-slate-600"
                                        />
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* 3. TARGETS */}
                        <div className="space-y-4 pt-4 border-t border-white/5 mt-4">
                            <div className="flex items-center justify-between">
                                <h3 className="text-lg font-medium text-white">Targets (R-Multiples)</h3>
                                <button
                                    onClick={handleAddTarget}
                                    className="bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold px-3 py-1.5 rounded-lg flex items-center gap-1 transition-colors"
                                >
                                    <Plus className="w-3 h-3" /> Add Target
                                </button>
                            </div>

                            <div className="space-y-2">
                                <div className="grid grid-cols-12 gap-2 text-[10px] text-slate-500 uppercase font-bold px-2">
                                    <div className="col-span-3">R</div>
                                    <div className="col-span-7">% of Remaining</div>
                                    <div className="col-span-2 text-right">Action</div>
                                </div>

                                {targets.map((target) => (
                                    <div key={target.id} className="grid grid-cols-12 gap-2 items-center bg-white/5 border border-white/5 rounded-lg p-2">
                                        <div className="col-span-3 relative">
                                            <input
                                                type="number"
                                                value={target.r}
                                                onChange={(e) => {
                                                    const newTargets = targets.map(t => t.id === target.id ? { ...t, r: e.target.value } : t);
                                                    setTargets(newTargets);
                                                }}
                                                className="w-full bg-black/40 border border-white/10 rounded px-2 py-1.5 text-sm text-white focus:border-indigo-500 outline-none"
                                            />
                                        </div>
                                        <div className="col-span-7 relative">
                                            <input
                                                type="number"
                                                value={target.percent}
                                                onChange={(e) => {
                                                    const newTargets = targets.map(t => t.id === target.id ? { ...t, percent: e.target.value } : t);
                                                    setTargets(newTargets);
                                                }}
                                                className="w-full bg-black/40 border border-white/10 rounded px-2 py-1.5 text-sm text-white focus:border-indigo-500 outline-none"
                                            />
                                            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-500">%</span>
                                        </div>
                                        <div className="col-span-2 flex justify-end">
                                            <button
                                                onClick={() => handleRemoveTarget(target.id)}
                                                className="p-1.5 bg-rose-500/10 text-rose-400 rounded hover:bg-rose-500/20 transition-colors"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className="flex items-start gap-2 text-[10px] text-amber-200/60 bg-amber-500/5 p-2 rounded">
                                <Info className="w-3 h-3 mt-0.5 shrink-0" />
                                <p>
                                    Each target closes % of **remaining position** (not original). <br />
                                    Default: R3=50% of all, R4=50% of remaining, R5=100% of remaining.
                                </p>
                            </div>
                        </div>

                        {/* 4. SMART SCALE IN */}
                        <div
                            onClick={() => setSmartScaleIn(!smartScaleIn)}
                            className="bg-indigo-900/10 border border-indigo-500/20 rounded-lg p-3 flex items-center justify-between cursor-pointer hover:bg-indigo-900/20 transition-colors mt-4"
                        >
                            <span className="text-sm font-medium text-white">Smart Scale-In</span>
                            <div className={`w-5 h-5 rounded border flex items-center justify-center transition-colors ${smartScaleIn ? 'bg-indigo-500 border-indigo-500' : 'border-slate-500'}`}>
                                {smartScaleIn && <Check className="w-3.5 h-3.5 text-white" />}
                            </div>
                        </div>

                        {/* 5. CALCULATE BUTTON */}
                        <Button onClick={handleCalculate} variant="primary" size="lg" className="w-full bg-cyan-600 hover:bg-cyan-500 border-cyan-500/50 mt-6">
                            <Calculator className="w-4 h-4 mr-2" /> Calculate
                        </Button>
                    </GlassCard>
                </div>

                {/* --- RIGHT COLUMN: RESULTS --- */}
                <div className="lg:col-span-6 xl:col-span-7">
                    <AnimatePresence mode="wait">
                        {result ? (
                            <motion.div
                                key="result"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: 20 }}
                                className="h-full space-y-4"
                            >
                                {/* 1. TRADE SUMMARY CARD */}
                                <GlassCard className="p-6 border-white/10 bg-[#0B0F19]">
                                    <div className="flex items-center gap-3 mb-6">
                                        <Shield className="w-5 h-5 text-indigo-400" />
                                        <h3 className="text-xl font-bold text-white">Trade Summary</h3>
                                    </div>

                                    {/* Two Top Boxes */}
                                    <div className="grid grid-cols-2 gap-4 mb-6">
                                        {/* Max Risk */}
                                        <div className="border border-rose-500/30 bg-rose-500/10 rounded-xl p-4 relative overflow-hidden">
                                            <div className="flex items-center gap-2 mb-2">
                                                <Shield className="w-4 h-4 text-rose-400" />
                                                <span className="text-xs text-rose-300 font-bold uppercase tracking-wider">Max Risk</span>
                                            </div>
                                            <div className="text-3xl font-mono font-bold text-rose-400 mb-1">
                                                ${result.riskAmount.toLocaleString()}
                                            </div>
                                            <div className="text-xs text-rose-300/70">
                                                {riskPercent}% of Portfolio
                                            </div>
                                        </div>

                                        {/* Expected Profit */}
                                        <div className="border border-emerald-500/30 bg-emerald-500/10 rounded-xl p-4 relative overflow-hidden">
                                            <div className="flex items-center gap-2 mb-2">
                                                <DollarSign className="w-4 h-4 text-emerald-400" />
                                                <span className="text-xs text-emerald-300 font-bold uppercase tracking-wider">Expected Profit</span>
                                            </div>
                                            <div className="text-3xl font-mono font-bold text-emerald-400 mb-1">
                                                ${result.totalPotentialProfit.toLocaleString(undefined, { maximumFractionDigits: 2 })}
                                            </div>
                                            <div className="text-xs text-emerald-300/70">
                                                {result.accountGrowth.toFixed(2)}% Acc. Growth
                                            </div>
                                        </div>
                                    </div>

                                    {/* Details List */}
                                    <div className="space-y-3 text-sm">
                                        <div className="flex justify-between items-center py-2 border-b border-white/5">
                                            <span className="text-slate-400">Quantity (Units)</span>
                                            <span className="text-white font-mono font-bold">{result.positionSizeUnits.toFixed(4)}</span>
                                        </div>
                                        <div className="flex justify-between items-center py-2 border-b border-white/5">
                                            <span className="text-slate-400">Nominal Exposure</span>
                                            <span className="text-white font-mono font-bold">${result.positionSizeUsd.toLocaleString(undefined, { maximumFractionDigits: 0 })}</span>
                                        </div>
                                        <div className="flex justify-between items-center py-2 border-b border-white/5">
                                            <span className="text-slate-400">Stop Price</span>
                                            <span className="text-white font-mono font-bold">${result.stopPrice.toLocaleString()}</span>
                                        </div>
                                        <div className="flex justify-between items-center py-2 border-b border-white/5">
                                            <span className="text-slate-400">Stop Distance</span>
                                            <span className="text-white font-mono font-bold">${result.stopDistance.toFixed(2)} ({result.stopLossPercent.toFixed(2)}%)</span>
                                        </div>
                                        <div className="flex justify-between items-center pt-2">
                                            <span className="text-slate-400">Risk/Reward Ratio</span>
                                            <span className="text-emerald-400 font-mono font-bold">{result.rrRatio.toFixed(2)}</span>
                                        </div>
                                    </div>
                                </GlassCard>

                                {/* 2. PROFIT TARGETS CARD */}
                                <GlassCard className="p-6 border-white/10 bg-[#0B0F19]">
                                    <div className="flex items-center gap-3 mb-6">
                                        <Target className="w-5 h-5 text-emerald-400" />
                                        <h3 className="text-xl font-bold text-white">Profit Targets</h3>
                                    </div>

                                    <div className="space-y-4">
                                        {result.targets.map((t, i) => (
                                            <div key={i} className="bg-white/5 rounded-xl p-4 border border-white/5">
                                                {/* Target Header */}
                                                <div className="flex justify-between items-center mb-3">
                                                    <span className="text-lg font-bold text-emerald-400 font-mono">{t.r}R</span>
                                                    <div className="text-[10px] text-slate-300 font-medium bg-white/10 px-2 py-1 rounded">
                                                        Manage <span className="text-white font-bold">{t.percentClosed}%</span>
                                                    </div>
                                                </div>

                                                {/* Target Grid */}
                                                <div className="grid grid-cols-2 gap-y-2 text-xs">
                                                    <div className="text-slate-500">Price:</div>
                                                    <div className="text-white font-mono text-right">${t.price.toLocaleString(undefined, { maximumFractionDigits: 2 })}</div>

                                                    <div className="text-slate-500">Distance:</div>
                                                    <div className="text-white font-mono text-right">${t.distance.toFixed(2)}</div>

                                                    <div className="text-slate-500">Close Qty:</div>
                                                    <div className="text-white font-mono text-right">{t.closeUnits.toFixed(4)}</div>

                                                    <div className="text-slate-500">Remaining:</div>
                                                    <div className="text-white font-mono text-right">{t.remainingUnits.toFixed(4)}</div>

                                                    <div className="text-slate-500 font-bold pt-1">Profit:</div>
                                                    <div className="text-emerald-400 font-mono font-bold text-right pt-1">+${t.pnl.toFixed(2)}</div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </GlassCard>

                                {/* 3. SAVE ACTION */}
                                <div className="pt-2">
                                    <Button className="w-full bg-emerald-600 hover:bg-emerald-500 border-emerald-500/50 py-4 text-base shadow-lg shadow-emerald-900/20 group">
                                        <Save className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform" />
                                        Save Trade
                                    </Button>
                                    <p className="text-center text-xs text-slate-500 mt-3">Save detailed trade plan to journal</p>
                                </div>

                            </motion.div>
                        ) : (
                            <motion.div
                                key="empty"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="h-full min-h-[500px] flex flex-col items-center justify-center text-center p-8 bg-[#02040A] rounded-3xl border-2 border-dashed border-slate-800"
                            >
                                <div className="w-24 h-24 rounded-full bg-slate-800/50 flex items-center justify-center mb-6">
                                    <Calculator className="w-10 h-10 text-slate-600" />
                                </div>
                                <h3 className="text-2xl font-light text-white mb-2">Enter details and calculate</h3>
                                <p className="text-slate-500 text-sm max-w-xs">
                                    Fill in the parameters on the left to generate your comprehensive risk plan.
                                </p>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

            </div>
        </div>
    );
};
