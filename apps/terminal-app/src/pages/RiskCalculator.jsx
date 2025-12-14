
import React, { useState, useEffect, useMemo, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Calculator, DollarSign, Percent, Target,
  TrendingUp, TrendingDown, ArrowRight, Save,
  RotateCcw, AlertTriangle, Crosshair, Scale,
  Plus, Trash2, Info, Settings, HelpCircle, Check, X,
  Shield, Layers
} from 'lucide-react';
import { useLanguage } from "../components/LanguageContext";
import { api } from "@/api/client";
import { useQuery } from "@tanstack/react-query";
import { Link, useNavigate } from "react-router-dom";
import { createPageUrl } from "../utils";
import { FeatureGate } from "../components/FeatureGate";
import AddTradeModal from "../components/trading-journal/AddTradeModal";
import { PageHeader } from "../components/PageHeader";
import { GlassCard } from "@/components/ui/glass-card";

// --- UI COMPONENTS ---



const Button = ({
  variant = 'primary',
  size = 'md',
  children,
  className = '',
  ...props
}) => {
  const baseClasses = "relative font-medium transition-all duration-300 flex items-center justify-center gap-2 overflow-hidden group rounded-full select-none";

  const sizeClasses = {
    sm: "px-4 py-2 text-xs",
    md: "px-6 py-3 text-sm",
    lg: "px-8 py-4 text-base"
  };

  const variants = {
    primary: "bg-gradient-to-r from-indigo-600 via-indigo-500 to-cyan-500 text-white shadow-[0_4px_20px_rgba(79,70,229,0.3)] hover:shadow-[0_4px_25px_rgba(6,182,212,0.4)] border border-white/10",
    secondary: "bg-white/5 hover:bg-white/10 text-slate-200 border border-white/10 backdrop-blur-sm shadow-sm",
    outline: "bg-transparent border border-slate-700 text-slate-400 hover:text-white hover:border-slate-500 hover:bg-white/5",
    ghost: "bg-transparent text-slate-400 hover:text-white hover:bg-white/5",
    destructive: "bg-rose-500/10 text-rose-400 hover:bg-rose-500/20"
  };

  return (
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className={`${baseClasses} ${sizeClasses[size]} ${variants[variant] || variants.primary} ${className}`}
      {...props}
    >
      {variant === 'primary' && (
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-in-out" />
      )}
      <span className="relative z-10 flex items-center gap-2">{children}</span>
    </motion.button>
  );
};

const CustomSlider = ({ value, onChange, min = 0.1, max = 10, step = 0.1 }) => {
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

export default function RiskCalculator() {
  const { t, language } = useLanguage();
  const [theme, setTheme] = useState('light');

  useEffect(() => {
    const currentTheme = document.documentElement.getAttribute('data-theme') || 'light';
    setTheme(currentTheme);

    const observer = new MutationObserver(() => {
      const newTheme = document.documentElement.getAttribute('data-theme') || 'light';
      setTheme(newTheme);
    });

    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
    return () => observer.disconnect();
  }, []);

  const isDark = theme === 'dark'; // We will enforce dark mode UI mainly, but keep this logic

  // Fetch settings and trades
  const { data: settingsList = [] } = useQuery({
    queryKey: ['settings'],
    queryFn: () => api.entities.Settings.list(),
  });

  const { data: trades = [] } = useQuery({
    queryKey: ['trades'],
    queryFn: () => api.entities.Trade.list(),
  });

  const { data: user, isLoading: userLoading } = useQuery({
    queryKey: ['currentUser'],
    queryFn: () => api.auth.me(),
  });

  const navigate = useNavigate();

  useEffect(() => {
    if (!userLoading && !user) {
      navigate('/login');
    }
  }, [user, userLoading, navigate]);

  const settings = settingsList[0] || null;

  // Calculate current equity
  const currentEquity = useMemo(() => {
    if (!settings?.initial_equity) return null;
    const closedTrades = trades.filter(t => t.status === 'closed');
    const totalPnL = closedTrades.reduce((sum, t) => sum + (t.pnl || 0), 0);
    return settings.initial_equity + totalPnL;
  }, [settings, trades]);

  // Portfolio mode toggle
  const [useCurrentEquity, setUseCurrentEquity] = useState(true);

  // Basic Inputs
  const [equityUsd, setEquityUsd] = useState("");
  const [riskPct, setRiskPct] = useState(1.0); // Changed default to 1.0 to match new UI
  const [side, setSide] = useState("long"); // 'long' | 'short'
  const [priceMode, setPriceMode] = useState("entry_stop"); // 'entry_stop' | 'entry_stop_pct' | 'entry_notional'

  // Price Inputs
  const [entryPrice, setEntryPrice] = useState("");
  const [stopPrice, setStopPrice] = useState("");
  const [stopPct, setStopPct] = useState(1.5);
  const [notionalUsd, setNotionalUsd] = useState("");

  // Advanced Settings
  const [qtyStep, setQtyStep] = useState(0.0001);
  const [priceTick, setPriceTick] = useState(0.01);
  const [minNotional, setMinNotional] = useState(5);
  const [btcMode, setBtcMode] = useState(false);

  // Targets
  const [targetsR, setTargetsR] = useState([3, 4, 5]);
  const [partials, setPartials] = useState([0.5, 0.5, 1]); // Stored as 0-1 fraction. UI displays %

  // Scale-In
  const [enableScaleIn, setEnableScaleIn] = useState(false);
  const [scaleInTriggerR, setScaleInTriggerR] = useState(3);
  const [scaleInFraction, setScaleInFraction] = useState(0.5);

  // Results
  const [results, setResults] = useState(null);
  const [warnings, setWarnings] = useState([]);
  const [showAddTradeModal, setShowAddTradeModal] = useState(false);

  // Auto-fill equity when settings change or toggle changes
  useEffect(() => {
    if (useCurrentEquity && currentEquity !== null) {
      setEquityUsd(currentEquity.toFixed(2));
    } else if (!useCurrentEquity && equityUsd === currentEquity?.toFixed(2)) {
      setEquityUsd("");
    }
  }, [useCurrentEquity, currentEquity]);

  // Helper Functions
  const floorToStep = (value, step) => {
    return Math.floor(value / step) * step;
  };

  const roundToTick = (value, tick) => {
    return Math.round(value / tick) * tick;
  };

  const updateTargetR = (index, value) => {
    const newTargets = [...targetsR];
    newTargets[index] = parseFloat(value) || 0;
    setTargetsR(newTargets);
  };

  const updatePartial = (index, value) => {
    const newPartials = [...partials];
    newPartials[index] = parseFloat(value) / 100 || 0; // Value from UI is %
    setPartials(newPartials);
  };

  const addTarget = () => {
    setTargetsR([...targetsR, targetsR[targetsR.length - 1] + 1]);
    setPartials([...partials, 1]); // Default to 100% for new? Or 0? Reference implies 100% for last.
  };

  const removeTarget = (index) => {
    if (targetsR.length > 1) {
      setTargetsR(targetsR.filter((_, i) => i !== index));
      setPartials(partials.filter((_, i) => i !== index));
    }
  };

  const calculate = () => {
    const warns = [];
    const equity = parseFloat(equityUsd);
    const risk = riskPct / 100;
    const entry = parseFloat(entryPrice);

    if (!equity || equity <= 0) {
      warns.push("Portfolio size must be positive");
      setWarnings(warns); setResults(null); return;
    }
    if (risk <= 0 || risk > 0.1) {
      warns.push("Risk percent must be between 0.1% and 10%");
      setWarnings(warns); setResults(null); return;
    }
    if (!entry || entry <= 0) {
      warns.push("Entry price must be positive");
      setWarnings(warns); setResults(null); return;
    }

    let calculatedStopPrice;
    let distance;
    let qty;
    let calculatedNotional;

    if (priceMode === "entry_stop") {
      const stop = parseFloat(stopPrice);
      if (!stop || stop <= 0) {
        warns.push("Stop price must be positive");
        setWarnings(warns); setResults(null); return;
      }
      if (entry === stop) {
        warns.push("Entry and stop cannot be the same");
        setWarnings(warns); setResults(null); return;
      }
      calculatedStopPrice = stop;
      distance = Math.abs(entry - stop);

      const oneRUsd = Math.round(equity * risk * 100) / 100;
      const qtyRaw = oneRUsd / distance;
      qty = floorToStep(qtyRaw, qtyStep);
      calculatedNotional = Math.round(qty * entry * 100) / 100;

    } else if (priceMode === "entry_stop_pct") {
      const stopPctValue = stopPct / 100;
      if (stopPctValue <= 0 || stopPctValue > 0.2) {
        warns.push("Stop percent must be between 0.1% and 20%");
        setWarnings(warns); setResults(null); return;
      }
      if (side === "long") {
        calculatedStopPrice = entry * (1 - stopPctValue);
      } else {
        calculatedStopPrice = entry * (1 + stopPctValue);
      }
      distance = Math.abs(entry - calculatedStopPrice);
      const oneRUsd = Math.round(equity * risk * 100) / 100;
      const qtyRaw = oneRUsd / distance;
      qty = floorToStep(qtyRaw, qtyStep);
      calculatedNotional = Math.round(qty * entry * 100) / 100;
    } else {
      // entry_notional
      const notional = parseFloat(notionalUsd);
      if (!notional || notional <= 0) {
        warns.push("Notional exposure must be positive");
        setWarnings(warns); setResults(null); return;
      }
      calculatedNotional = notional;
      qty = notional / entry;
      const oneRUsd = Math.round(equity * risk * 100) / 100;
      const stopPctValue = oneRUsd / notional;
      if (side === "long") {
        calculatedStopPrice = entry * (1 - stopPctValue);
      } else {
        calculatedStopPrice = entry * (1 + stopPctValue);
      }
      distance = Math.abs(entry - calculatedStopPrice);
    }

    const oneRUsd = Math.round(equity * risk * 100) / 100;

    if (qty <= 0) {
      warns.push("Calculated quantity is 0");
      setWarnings(warns); setResults(null); return;
    }
    if (calculatedNotional < minNotional) {
      warns.push(`Notional too low (${calculatedNotional.toFixed(2)}$ < ${minNotional}$)`);
    }

    const targetResults = [];
    let remainingQuantity = qty;

    for (let i = 0; i < targetsR.length; i++) {
      const R = targetsR[i];
      const allocation = partials[i];
      const partialQty = remainingQuantity * allocation;
      const targetPrice = side === "long"
        ? roundToTick(entry + R * distance, priceTick)
        : roundToTick(entry - R * distance, priceTick);

      const priceChange = side === "long" ? targetPrice - entry : entry - targetPrice;
      const partialPnl = Math.round(partialQty * priceChange * 100) / 100;

      targetResults.push({
        R: R,
        price: targetPrice,
        partial_qty: partialQty,
        partial_pnl_usd: partialPnl,
        remaining_before: remainingQuantity,
        remaining_after: remainingQuantity - partialQty
      });
      remainingQuantity -= partialQty;
    }

    const plannedTotalPnl = targetResults.reduce((sum, t) => sum + t.partial_pnl_usd, 0);
    const riskRewardRatio = oneRUsd > 0 ? plannedTotalPnl / oneRUsd : 0;

    // Scale-In Logic
    let scaleInResult = { enabled: enableScaleIn, allowed: null, new_qty_if_applied: null, new_notional: null, note: "" };
    if (enableScaleIn) {
      const triggerReached = targetsR.some(r => r >= scaleInTriggerR);
      if (!triggerReached) {
        scaleInResult.allowed = false;
        scaleInResult.note = `Scale-In triggers closer than target`;
      } else {
        const additionalQty = qty * scaleInFraction;
        const newQtyTotal = qty + additionalQty;
        scaleInResult.allowed = true;
        scaleInResult.new_qty_if_applied = newQtyTotal;
        scaleInResult.new_notional = Math.round(newQtyTotal * entry * 100) / 100;
      }
    }

    setResults({
      one_R_usd: oneRUsd,
      qty: qty,
      notional_usd: calculatedNotional,
      stop_price: calculatedStopPrice,
      distance: distance,
      targets: targetResults,
      planned_total_pnl_usd: plannedTotalPnl,
      risk_reward_ratio: riskRewardRatio,
      scale_in: scaleInResult
    });
    setWarnings(warns);
  };

  // Formatters for display
  const stopLossPercent = results ? (results.distance / parseFloat(entryPrice) * 100) : 0;

  return (
    <FeatureGate feature="full_calculator">
      <div
        dir={language === 'he' ? 'rtl' : 'ltr'}
        className="min-h-screen pt-24 pb-12 px-4 md:px-8 max-w-[1600px] mx-auto animate-in fade-in duration-500"
      >

        <PageHeader
          title="Professional"
          highlightText="Position Calculator"
          subtitle="Smart 1R Calculation & Risk Management"
          variant="emerald"
        />

        <div className="grid lg:grid-cols-12 gap-8">

          {/* --- LEFT COLUMN: INPUTS --- */}
          <div className="lg:col-span-6 xl:col-span-5 space-y-6">
            <GlassCard className="p-6 h-fit border-white/5 bg-white/[0.02]">

              {/* 1. TRADE SETUP */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium text-white">Trade Setup</h3>

                {/* Warning Banner / Settings Link */}
                {(!currentEquity || !useCurrentEquity) && (
                  <div className="bg-amber-500/10 border border-amber-500/20 rounded-lg p-3 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <AlertTriangle className="w-4 h-4 text-amber-500" />
                      <span className="text-xs text-amber-200">
                        {useCurrentEquity ? "No portfolio set in settings" : "Using Manual Portfolio Input"}
                      </span>
                    </div>
                    <Link to={createPageUrl("Settings")} className="text-[10px] bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 px-2 py-1 rounded transition-colors flex items-center gap-1">
                      Go to Settings <ArrowRight className="w-3 h-3" />
                    </Link>
                  </div>
                )}

                {/* Manual Equity Input */}
                {!useCurrentEquity && (
                  <div>
                    <label className="text-xs text-slate-400 mb-1.5 block">Portfolio Balance ($)</label>
                    <input
                      type="number"
                      value={equityUsd}
                      onChange={(e) => setEquityUsd(e.target.value)}
                      placeholder="10000"
                      className="w-full bg-[#1e293b] border border-slate-700 rounded-lg px-4 py-3 text-white focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none transition-all placeholder:text-slate-600"
                    />
                  </div>
                )}

                {/* Toggle Portfolio */}
                {currentEquity !== null && (
                  <div onClick={() => setUseCurrentEquity(!useCurrentEquity)} className="cursor-pointer text-xs flex items-center gap-2 text-slate-500 hover:text-white transition-colors">
                    <div className={`w-3 h-3 rounded-full border ${useCurrentEquity ? 'bg-indigo-500 border-indigo-500' : 'border-slate-500'}`}></div>
                    Use Live Portfolio Balance (${currentEquity.toLocaleString()})
                  </div>
                )}

                {/* Risk Slider */}
                <div className="bg-card border border-white/5 rounded-xl p-5">
                  <div className="flex justify-between items-center mb-4">
                    <label className="text-sm font-bold text-white">Risk Percent: <span className="text-rose-400">{riskPct}%</span></label>
                    <span className="text-xs text-slate-500">${equityUsd ? (parseFloat(equityUsd) * (riskPct / 100)).toFixed(0) : '0'}</span>
                  </div>
                  <CustomSlider value={riskPct} onChange={setRiskPct} min={0.1} max={10} step={0.1} />
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
                      onClick={() => setSide('long')}
                      className={`flex-1 py-3 rounded-lg font-bold text-sm flex items-center justify-center gap-2 transition-all ${side === 'long'
                        ? 'bg-emerald-600 text-white shadow-[0_0_15px_rgba(16,185,129,0.4)]'
                        : 'bg-white/5 text-slate-400 hover:bg-white/10'
                        }`}
                    >
                      <TrendingUp className="w-4 h-4" /> Long
                    </button>
                    <button
                      onClick={() => setSide('short')}
                      className={`flex-1 py-3 rounded-lg font-bold text-sm flex items-center justify-center gap-2 transition-all ${side === 'short'
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
                    <div className="text-[10px] text-slate-400">Tips for wider stop and lower leverage</div>
                  </div>
                </div>
              </div>

              {/* 2. PRICE SETTINGS */}
              <div className="space-y-4 pt-4 border-t border-white/5 mt-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-medium text-white">Price Settings</h3>
                  <div className="flex bg-white/5 rounded-lg p-0.5">
                    <button
                      onClick={() => setPriceMode('entry_stop_pct')}
                      className={`text-[10px] px-3 py-1 rounded-md transition-all ${priceMode === 'entry_stop_pct' ? 'bg-slate-700 text-white shadow' : 'text-slate-500'}`}
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
                        value={stopPct}
                        onChange={(e) => setStopPct(e.target.value)}
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
                    onClick={addTarget}
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

                  {targetsR.map((r, i) => (
                    <div key={i} className="grid grid-cols-12 gap-2 items-center bg-white/5 border border-white/5 rounded-lg p-2">
                      <div className="col-span-3 relative">
                        <input
                          type="number"
                          value={r}
                          onChange={(e) => updateTargetR(i, e.target.value)}
                          className="w-full bg-black/40 border border-white/10 rounded px-2 py-1.5 text-sm text-white focus:border-indigo-500 outline-none"
                        />
                      </div>
                      <div className="col-span-7 relative">
                        <input
                          type="number"
                          value={(partials[i] * 100).toFixed(0)}
                          onChange={(e) => updatePartial(i, e.target.value)}
                          className="w-full bg-black/40 border border-white/10 rounded px-2 py-1.5 text-sm text-white focus:border-indigo-500 outline-none"
                        />
                        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-500">%</span>
                      </div>
                      <div className="col-span-2 flex justify-end">
                        <button
                          onClick={() => removeTarget(i)}
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
                onClick={() => setEnableScaleIn(!enableScaleIn)}
                className="bg-indigo-900/10 border border-indigo-500/20 rounded-lg p-3 flex items-center justify-between cursor-pointer hover:bg-indigo-900/20 transition-colors mt-4"
              >
                <span className="text-sm font-medium text-white">Smart Scale-In</span>
                <div className={`w-5 h-5 rounded border flex items-center justify-center transition-colors ${enableScaleIn ? 'bg-indigo-500 border-indigo-500' : 'border-slate-500'}`}>
                  {enableScaleIn && <Check className="w-3.5 h-3.5 text-white" />}
                </div>
              </div>

              {/* 5. CALCULATE BUTTON */}
              <Button onClick={calculate} variant="primary" size="lg" className="w-full bg-cyan-600 hover:bg-cyan-500 border-cyan-500/50 mt-6">
                <Calculator className="w-4 h-4 mr-2" /> Calculate
              </Button>
            </GlassCard>
          </div>

          {/* --- RIGHT COLUMN: RESULTS --- */}
          <div className="lg:col-span-6 xl:col-span-7">
            <AnimatePresence mode="wait">
              {results ? (
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
                          ${results.one_R_usd.toLocaleString()}
                        </div>
                        <div className="text-xs text-rose-300/70">
                          {riskPct}% of Portfolio
                        </div>
                      </div>

                      {/* Expected Profit */}
                      <div className="border border-emerald-500/30 bg-emerald-500/10 rounded-xl p-4 relative overflow-hidden">
                        <div className="flex items-center gap-2 mb-2">
                          <DollarSign className="w-4 h-4 text-emerald-400" />
                          <span className="text-xs text-emerald-300 font-bold uppercase tracking-wider">Expected Profit</span>
                        </div>
                        <div className="text-3xl font-mono font-bold text-emerald-400 mb-1">
                          ${results.planned_total_pnl_usd.toLocaleString(undefined, { maximumFractionDigits: 2 })}
                        </div>
                        <div className="text-xs text-emerald-300/70">
                          Growth: {((results.planned_total_pnl_usd / parseFloat(equityUsd)) * 100).toFixed(2)}%
                        </div>
                      </div>
                    </div>

                    {/* Details List */}
                    <div className="space-y-3 text-sm">
                      <div className="flex justify-between items-center py-2 border-b border-white/5">
                        <span className="text-slate-400">Quantity (Units)</span>
                        <span className="text-white font-mono font-bold">{results.qty.toFixed(4)}</span>
                      </div>
                      <div className="flex justify-between items-center py-2 border-b border-white/5">
                        <span className="text-slate-400">Nominal Exposure</span>
                        <span className="text-white font-mono font-bold">${results.notional_usd.toLocaleString(undefined, { maximumFractionDigits: 0 })}</span>
                      </div>
                      <div className="flex justify-between items-center py-2 border-b border-white/5">
                        <span className="text-slate-400">Stop Price</span>
                        <span className="text-white font-mono font-bold">${results.stop_price.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between items-center py-2 border-b border-white/5">
                        <span className="text-slate-400">Stop Distance</span>
                        <span className="text-white font-mono font-bold">${results.distance.toFixed(2)} ({stopLossPercent.toFixed(2)}%)</span>
                      </div>
                      <div className="flex justify-between items-center pt-2">
                        <span className="text-slate-400">Risk/Reward Ratio</span>
                        <span className="text-emerald-400 font-mono font-bold">{results.risk_reward_ratio.toFixed(2)}</span>
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
                      {results.targets.map((t, i) => (
                        <div key={i} className="bg-white/5 rounded-xl p-4 border border-white/5">
                          {/* Target Header */}
                          <div className="flex justify-between items-center mb-3">
                            <span className="text-lg font-bold text-emerald-400 font-mono">{t.R}R</span>
                            <div className="text-[10px] text-slate-300 font-medium bg-white/10 px-2 py-1 rounded">
                              Close <span className="text-white font-bold">{(t.partial_qty / t.remaining_before * 100).toFixed(0)}%</span> of remaining
                            </div>
                          </div>

                          {/* Target Grid */}
                          <div className="grid grid-cols-2 gap-y-2 text-xs">
                            <div className="text-slate-500">Price:</div>
                            <div className="text-white font-mono text-right">${t.price.toLocaleString(undefined, { maximumFractionDigits: 2 })}</div>

                            <div className="text-slate-500">Close Qty:</div>
                            <div className="text-white font-mono text-right">{t.partial_qty.toFixed(4)}</div>

                            <div className="text-slate-500">Remaining:</div>
                            <div className="text-white font-mono text-right">{t.remaining_after.toFixed(4)}</div>

                            <div className="text-slate-500 font-bold pt-1">Profit:</div>
                            <div className="text-emerald-400 font-mono font-bold text-right pt-1">+${t.partial_pnl_usd.toFixed(2)}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </GlassCard>

                  {/* 3. SAVE ACTION */}
                  <div className="pt-2">
                    <Button
                      onClick={() => setShowAddTradeModal(true)}
                      className="w-full bg-emerald-600 hover:bg-emerald-500 border-emerald-500/50 py-4 text-base shadow-lg shadow-emerald-900/20 group"
                    >
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
                  {warnings.length > 0 && (
                    <div className="mt-6 p-4 bg-red-900/20 border border-red-500/30 rounded-xl text-left">
                      <p className="text-red-400 font-bold mb-2 text-sm flex items-center gap-2"><AlertTriangle size={14} /> Errors:</p>
                      <ul className="text-xs text-red-300 list-disc ml-4 space-y-1">
                        {warnings.map((w, i) => <li key={i}>{w}</li>)}
                      </ul>
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

        </div>

        {showAddTradeModal && results && (
          <AddTradeModal
            onClose={() => setShowAddTradeModal(false)}
            prefillData={{
              direction: side,
              entry_price: entryPrice,
              stop_loss: results.stop_price,
              quantity: results.qty,
              position_size_usd: results.notional_usd,
              risk_amount: results.one_R_usd,
              risk_reward_ratio: results.risk_reward_ratio
            }}
          />
        )}
      </div>
    </FeatureGate>
  );
}
