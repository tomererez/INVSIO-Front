
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Calculator, DollarSign, Percent, Target, 
  TrendingUp, TrendingDown, ArrowRight, Save, 
  RotateCcw, AlertTriangle, Crosshair, Scale
} from 'lucide-react';
import { GlassCard } from '../ui/GlassCard';
import { Button } from '../ui/Button';
import { api } from '../../lib/api';

// --- TYPES ---

interface CalculationResult {
  riskAmount: number;
  positionSizeUnits: number;
  positionSizeUsd: number;
  leverage: number; // Simplified estimation
  riskReward: number;
  potentialProfit: number;
  stopLossPercent: number;
  isValid: boolean;
  error?: string;
}

// --- COMPONENTS ---

const InputGroup: React.FC<{ 
  label: string; 
  value: string | number; 
  onChange: (val: string) => void;
  icon?: React.ReactNode;
  suffix?: string;
  placeholder?: string;
  type?: "number" | "text";
}> = ({ label, value, onChange, icon, suffix, placeholder, type = "number" }) => (
  <div className="space-y-2">
    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
      {icon && <span className="text-slate-400">{icon}</span>}
      {label}
    </label>
    <div className="relative group">
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-white font-mono placeholder:text-slate-600 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none transition-all group-hover:border-white/20"
        placeholder={placeholder}
      />
      {suffix && (
        <span className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 text-xs font-medium">
          {suffix}
        </span>
      )}
    </div>
  </div>
);

const ResultCard: React.FC<{ label: string; value: string; sub?: string; color: string; delay?: number }> = ({ label, value, sub, color, delay = 0 }) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.95 }}
    animate={{ opacity: 1, scale: 1 }}
    transition={{ delay, duration: 0.3 }}
    className={`p-5 rounded-xl border ${color} bg-opacity-5 relative overflow-hidden`}
  >
    <div className={`absolute top-0 right-0 p-2 opacity-10`}>
      <Scale className="w-12 h-12" />
    </div>
    <div className="text-xs text-slate-400 uppercase tracking-wider mb-1">{label}</div>
    <div className="text-2xl font-bold text-white mb-1 font-mono tracking-tight">{value}</div>
    {sub && <div className="text-xs opacity-70">{sub}</div>}
  </motion.div>
);

export const PositionCalculator: React.FC = () => {
  // Form State
  const [direction, setDirection] = useState<'Long' | 'Short'>('Long');
  const [accountBalance, setAccountBalance] = useState<string>('10000');
  const [riskPercent, setRiskPercent] = useState<string>('1.0');
  const [entryPrice, setEntryPrice] = useState<string>('');
  const [stopLoss, setStopLoss] = useState<string>('');
  const [takeProfit, setTakeProfit] = useState<string>('');
  
  // Results State
  const [result, setResult] = useState<CalculationResult | null>(null);
  const [isSaved, setIsSaved] = useState(false);

  // Auto-Calculate Effect
  useEffect(() => {
    calculate();
  }, [direction, accountBalance, riskPercent, entryPrice, stopLoss, takeProfit]);

  const calculate = () => {
    const balance = parseFloat(accountBalance);
    const risk = parseFloat(riskPercent);
    const entry = parseFloat(entryPrice);
    const stop = parseFloat(stopLoss);
    const target = parseFloat(takeProfit);

    if (!balance || !entry || !stop) {
      setResult(null);
      return;
    }

    // Logic
    const riskAmount = balance * (risk / 100);
    const priceDiff = Math.abs(entry - stop);
    
    // Validation
    if ((direction === 'Long' && stop >= entry) || (direction === 'Short' && stop <= entry)) {
        setResult({
            riskAmount: 0, positionSizeUnits: 0, positionSizeUsd: 0, leverage: 0, riskReward: 0, potentialProfit: 0, stopLossPercent: 0,
            isValid: false,
            error: "Invalid Stop Loss for direction"
        });
        return;
    }

    const stopLossPercent = (priceDiff / entry) * 100;
    const positionSizeUsd = riskAmount / (stopLossPercent / 100);
    const positionSizeUnits = positionSizeUsd / entry;
    
    // R:R
    let rr = 0;
    let potentialProfit = 0;
    if (target) {
        const rewardDiff = Math.abs(target - entry);
        rr = rewardDiff / priceDiff;
        potentialProfit = rr * riskAmount;
    }

    setResult({
      riskAmount,
      positionSizeUnits,
      positionSizeUsd,
      leverage: 1, // Simplified, assume spot or calculate based on margin later
      riskReward: rr,
      potentialProfit,
      stopLossPercent,
      isValid: true
    });
    setIsSaved(false);
  };

  const handleSaveToJournal = async () => {
    if (!result || !result.isValid) return;
    
    // Simulate API call
    await api.journal.createTrade({
        symbol: "CALCULATED", // Would be an input in real app
        direction: direction.toLowerCase(),
        entry_price: entryPrice,
        exit_price: takeProfit, // Target as plan
        stop_loss: stopLoss,
        quantity: result.positionSizeUnits,
        status: 'open',
        notes: `Planned via Calculator. Risk: $${result.riskAmount.toFixed(2)} (${riskPercent}%)`
    });
    
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
  };

  const resetForm = () => {
      setEntryPrice('');
      setStopLoss('');
      setTakeProfit('');
      setResult(null);
      setIsSaved(false);
  };

  return (
    <div className="min-h-screen pt-24 pb-12 px-4 md:px-8 max-w-[1600px] mx-auto animate-in fade-in duration-500">
      
      {/* Header */}
      <div className="mb-10 flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
            <h1 className="text-3xl font-light text-white mb-2 flex items-center gap-3">
                <Calculator className="w-8 h-8 text-indigo-400" />
                Position Calculator
            </h1>
            <p className="text-slate-400 text-sm">Precision risk management engine. Never trade blindly.</p>
        </div>
        <div className="flex gap-2">
            <Button variant="secondary" size="sm" onClick={resetForm}>
                <RotateCcw className="w-3.5 h-3.5 mr-2" /> Reset
            </Button>
        </div>
      </div>

      <div className="grid lg:grid-cols-12 gap-8 items-start">
        
        {/* LEFT: INPUTS COCKPIT */}
        <div className="lg:col-span-5 space-y-6">
            <GlassCard className="p-6 md:p-8 border-indigo-500/20">
                
                {/* Account Settings */}
                <div className="grid grid-cols-2 gap-4 mb-8">
                    <InputGroup 
                        label="Account Equity" 
                        value={accountBalance} 
                        onChange={setAccountBalance}
                        icon={<DollarSign className="w-3.5 h-3.5" />}
                        suffix="USD"
                    />
                    <InputGroup 
                        label="Risk Model" 
                        value={riskPercent} 
                        onChange={setRiskPercent}
                        icon={<Percent className="w-3.5 h-3.5" />}
                        suffix="RISK"
                    />
                </div>

                <div className="h-px bg-white/5 w-full mb-8" />

                {/* Trade Parameters */}
                <div className="space-y-6">
                    {/* Direction Toggle */}
                    <div className="p-1 bg-black/40 rounded-xl border border-white/5 grid grid-cols-2 gap-1">
                        <button
                            onClick={() => setDirection('Long')}
                            className={`flex items-center justify-center gap-2 py-3 rounded-lg text-sm font-bold transition-all ${
                                direction === 'Long' 
                                ? 'bg-emerald-500/20 text-emerald-400 shadow-sm border border-emerald-500/20' 
                                : 'text-slate-500 hover:text-slate-300'
                            }`}
                        >
                            <TrendingUp className="w-4 h-4" /> LONG
                        </button>
                        <button
                            onClick={() => setDirection('Short')}
                            className={`flex items-center justify-center gap-2 py-3 rounded-lg text-sm font-bold transition-all ${
                                direction === 'Short' 
                                ? 'bg-rose-500/20 text-rose-400 shadow-sm border border-rose-500/20' 
                                : 'text-slate-500 hover:text-slate-300'
                            }`}
                        >
                            <TrendingDown className="w-4 h-4" /> SHORT
                        </button>
                    </div>

                    <InputGroup 
                        label="Entry Price" 
                        value={entryPrice} 
                        onChange={setEntryPrice}
                        icon={<Crosshair className="w-3.5 h-3.5" />}
                        placeholder="0.00"
                    />

                    <div className="grid grid-cols-2 gap-4">
                        <InputGroup 
                            label="Stop Loss" 
                            value={stopLoss} 
                            onChange={setStopLoss}
                            icon={<AlertTriangle className="w-3.5 h-3.5" />}
                            placeholder="0.00"
                        />
                        <InputGroup 
                            label="Take Profit" 
                            value={takeProfit} 
                            onChange={setTakeProfit}
                            icon={<Target className="w-3.5 h-3.5" />}
                            placeholder="(Optional)"
                        />
                    </div>
                </div>

            </GlassCard>
        </div>

        {/* RIGHT: RESULTS HUD */}
        <div className="lg:col-span-7 space-y-6">
            <AnimatePresence mode="wait">
                {result && result.isValid ? (
                    <motion.div
                        key="results"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 20 }}
                        className="space-y-6"
                    >
                        {/* Primary Outcome Card */}
                        <GlassCard className="p-8 border-emerald-500/20 bg-emerald-900/5 relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-[300px] h-[300px] bg-emerald-500/10 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/3 pointer-events-none" />
                            
                            <div className="relative z-10 flex flex-col md:flex-row justify-between items-center gap-8">
                                <div className="text-center md:text-left">
                                    <h3 className="text-slate-400 text-sm font-medium uppercase tracking-widest mb-2">Recommended Position Size</h3>
                                    <div className="text-5xl md:text-6xl font-light text-white tracking-tight mb-2">
                                        <span className="text-emerald-400">$</span>{result.positionSizeUsd.toLocaleString(undefined, { maximumFractionDigits: 2 })}
                                    </div>
                                    <div className="inline-flex items-center px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-mono text-slate-300">
                                        {result.positionSizeUnits.toFixed(4)} UNITS
                                    </div>
                                </div>

                                <div className="flex flex-col gap-2 w-full md:w-auto">
                                    <Button 
                                        variant="primary" 
                                        size="lg"
                                        onClick={handleSaveToJournal}
                                        className={`w-full md:w-auto ${isSaved ? 'bg-emerald-600 border-emerald-500' : ''}`}
                                    >
                                        {isSaved ? (
                                            <>Saved to Journal <Save className="w-4 h-4 ml-2" /></>
                                        ) : (
                                            <>Log to Journal <ArrowRight className="w-4 h-4 ml-2" /></>
                                        )}
                                    </Button>
                                </div>
                            </div>
                        </GlassCard>

                        {/* Metrics Grid */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            <ResultCard 
                                label="Risk Amount" 
                                value={`$${result.riskAmount.toFixed(2)}`}
                                sub={`${riskPercent}% of Equity`}
                                color="border-rose-500/30 bg-rose-500/5"
                                delay={0.1}
                            />
                            <ResultCard 
                                label="Stop Distance" 
                                value={`${result.stopLossPercent.toFixed(2)}%`}
                                sub="Price movement"
                                color="border-amber-500/30 bg-amber-500/5"
                                delay={0.2}
                            />
                            <ResultCard 
                                label="Reward Ratio" 
                                value={result.riskReward > 0 ? `${result.riskReward.toFixed(2)}R` : '-'}
                                sub={result.riskReward >= 2 ? "Excellent" : result.riskReward >= 1 ? "Acceptable" : "Poor"}
                                color={result.riskReward >= 2 ? "border-emerald-500/30 bg-emerald-500/5" : "border-slate-500/30 bg-slate-500/5"}
                                delay={0.3}
                            />
                            <ResultCard 
                                label="Potential Profit" 
                                value={result.potentialProfit > 0 ? `$${result.potentialProfit.toFixed(2)}` : '-'}
                                sub="If target hit"
                                color="border-cyan-500/30 bg-cyan-500/5"
                                delay={0.4}
                            />
                        </div>

                        {/* Strategy Tip */}
                        {result.riskReward < 1.5 && result.riskReward > 0 && (
                            <motion.div 
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-start gap-3"
                            >
                                <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                                <div>
                                    <h4 className="text-amber-400 text-sm font-bold">Low R:R Ratio Detected</h4>
                                    <p className="text-amber-200/70 text-xs mt-1">
                                        This setup offers less than 1.5R. Professional traders typically seek setups with at least 2R to maintain positive expectancy over time. Consider tightening your stop or finding a better entry.
                                    </p>
                                </div>
                            </motion.div>
                        )}

                    </motion.div>
                ) : (
                    <motion.div
                        key="placeholder"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="h-full min-h-[400px] flex flex-col items-center justify-center text-center p-8 border-2 border-dashed border-white/5 rounded-3xl"
                    >
                        <div className="w-20 h-20 rounded-full bg-white/5 flex items-center justify-center mb-6">
                            <Crosshair className="w-10 h-10 text-slate-600" />
                        </div>
                        <h3 className="text-xl font-light text-white mb-2">Ready to Calculate</h3>
                        <p className="text-slate-500 max-w-sm">
                            Enter your trade parameters on the left to instantly generate a risk-optimized position sizing plan.
                        </p>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>

      </div>
    </div>
  );
};
