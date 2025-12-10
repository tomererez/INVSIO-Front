
import { useState, useEffect, useMemo } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { motion, AnimatePresence } from "framer-motion";
import { Calculator, TrendingUp, TrendingDown, DollarSign, Target, Shield, AlertTriangle, Info } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useLanguage } from "../components/LanguageContext";
import AddTradeModal from "../components/trading-journal/AddTradeModal";
import { api } from "@/api/client";
import { useQuery } from "@tanstack/react-query";
import { Link, useNavigate } from "react-router-dom";
import { createPageUrl } from "../utils";
import { FeatureGate } from "../components/FeatureGate";

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

  const isDark = theme === 'dark';

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
  const [riskPct, setRiskPct] = useState(4);
  const [side, setSide] = useState("long");
  const [priceMode, setPriceMode] = useState("entry_stop");

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
  const [partials, setPartials] = useState([0.5, 0.5, 1]);

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
      // If switched from using current equity, clear it or allow manual input
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
    newPartials[index] = parseFloat(value) / 100 || 0;
    setPartials(newPartials);
  };

  const addTarget = () => {
    setTargetsR([...targetsR, targetsR[targetsR.length - 1] + 1]);
    setPartials([...partials, 0]);
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

    // Validations
    if (!equity || equity <= 0) {
      warns.push("גודל התיק חייב להיות חיובי");
      setWarnings(warns);
      setResults(null);
      return;
    }

    if (risk <= 0 || risk > 0.1) {
      warns.push("אחוז הסיכון חייב להיות בין 0.5% ל-10%");
      setWarnings(warns);
      setResults(null);
      return;
    }

    if (!entry || entry <= 0) {
      warns.push("מחיר הכניסה חייב להיות חיובי");
      setWarnings(warns);
      setResults(null);
      return;
    }

    // Calculate Stop Price and Distance
    let calculatedStopPrice;
    let distance;
    let qty;
    let calculatedNotional;

    if (priceMode === "entry_stop") {
      const stop = parseFloat(stopPrice);
      if (!stop || stop <= 0) {
        warns.push("מחיר הסטופ חייב להיות חיובי");
        setWarnings(warns);
        setResults(null);
        return;
      }
      if (entry === stop) {
        warns.push("מחיר הכניסה והסטופ לא יכולים להיות זהים");
        setWarnings(warns);
        setResults(null);
        return;
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
        warns.push("אחוז הסטופ חייב להיות בין 0.1% ל-20%");
        setWarnings(warns);
        setResults(null);
        return;
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

    } else { // priceMode === "entry_notional"
      const notional = parseFloat(notionalUsd);
      if (!notional || notional <= 0) {
        warns.push("החשיפה הנומינלית חייבת להיות חיובית");
        setWarnings(warns);
        setResults(null);
        return;
      }

      calculatedNotional = notional;
      qty = notional / entry;

      // Calculate stop based on notional and risk
      const oneRUsd = Math.round(equity * risk * 100) / 100;
      // notional * stop_percent = oneR
      // stop_percent = oneR / notional
      const stopPctValue = oneRUsd / notional;

      if (side === "long") {
        calculatedStopPrice = entry * (1 - stopPctValue);
      } else {
        calculatedStopPrice = entry * (1 + stopPctValue);
      }
      distance = Math.abs(entry - calculatedStopPrice);
    }

    // Calculate 1R
    const oneRUsd = Math.round(equity * risk * 100) / 100;

    if (qty <= 0) {
      warns.push("הכמות המחושבת היא 0 - נסה להתאים את הפרמטרים");
      setWarnings(warns);
      setResults(null);
      return;
    }

    if (calculatedNotional < minNotional) {
      warns.push(`החשיפה הנומינלית (${calculatedNotional.toFixed(2)}$) נמוכה מהמינימום הנדרש (${minNotional}$)`);
    }

    // Calculate Targets
    const targetResults = [];
    let remainingQuantity = qty;

    for (let i = 0; i < targetsR.length; i++) {
      const R = targetsR[i];
      const allocation = partials[i];

      const partialQty = remainingQuantity * allocation;

      const targetPrice = side === "long"
        ? roundToTick(entry + R * distance, priceTick)
        : roundToTick(entry - R * distance, priceTick);

      const priceChange = side === "long"
        ? targetPrice - entry
        : entry - targetPrice;
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
    let scaleInResult = {
      enabled: enableScaleIn,
      allowed: null,
      new_qty_if_applied: null,
      new_notional: null,
      note: ""
    };

    if (enableScaleIn) {
      const triggerReached = targetsR.some(r => r >= scaleInTriggerR);

      if (!triggerReached) {
        scaleInResult.allowed = false;
        scaleInResult.note = `Scale-In יופעל רק כאשר הושג יעד R${scaleInTriggerR}`;
      } else {
        const additionalQty = qty * scaleInFraction;
        const newQtyTotal = qty + additionalQty;
        const newNotional = Math.round(newQtyTotal * entry * 100) / 100;

        scaleInResult.allowed = true;
        scaleInResult.new_qty_if_applied = newQtyTotal;
        scaleInResult.new_notional = newNotional;
        scaleInResult.note = `✓ Scale-In מאושר ב-R${scaleInTriggerR}`;
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

  return (
    <div className={`min-h-screen ${isDark ? 'bg-gradient-to-br from-gray-950 via-gray-900 to-black' : 'bg-gradient-to-br from-gray-50 via-white to-gray-100'}`} dir={language === 'he' ? 'rtl' : 'ltr'}>
      {/* Hero Section */}
      <div className={`relative overflow-hidden border-b ${isDark ? 'border-gray-800/50 bg-gradient-to-b from-gray-900' : 'border-gray-200 bg-gradient-to-b from-white/50'} to-transparent`}>
        <div className="absolute inset-0 bg-grid-pattern opacity-5" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 py-12 sm:py-16">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <div className="flex items-center justify-center gap-3 mb-4 sm:mb-6">
              <div className="w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-r from-blue-500 to-cyan-600 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-500/30">
                <Calculator className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
              </div>
            </div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-3 sm:mb-4 bg-gradient-to-l from-blue-400 via-cyan-400 to-teal-400 bg-clip-text text-transparent px-4">
              {t('riskCalculator.title')}
            </h1>
            <p className={`text-base sm:text-lg md:text-xl ${isDark ? 'text-gray-300' : 'text-gray-700'} font-semibold px-4`}>
              {t('riskCalculator.subtitle')}
            </p>
          </motion.div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
        <FeatureGate feature="full_calculator">
          <div className="grid lg:grid-cols-2 gap-6 sm:gap-8">
            {/* Left Column - Inputs */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="space-y-6"
            >
              {/* Basic Inputs */}
              <Card className={`${isDark ? 'bg-gray-900/50 border-gray-800' : 'bg-white border-gray-200 shadow-lg'} backdrop-blur-sm shadow-2xl`}>
                <CardContent className="p-4 sm:p-6">
                  <h2 className={`text-lg sm:text-xl font-bold mb-4 sm:mb-6 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                    {t('riskCalculator.tradeSetup')}
                  </h2>

                  {/* Portfolio Toggle */}
                  {currentEquity !== null && (
                    <div className={`mb-4 ${isDark ? 'bg-gradient-to-br from-blue-900/20 to-cyan-900/20 border-blue-500/30' : 'bg-gradient-to-br from-blue-50 to-cyan-50 border-blue-300'} border rounded-lg p-4`}>
                      <div className="flex items-center justify-between mb-3">
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={useCurrentEquity}
                            onChange={(e) => {
                              setUseCurrentEquity(e.target.checked);
                              if (e.target.checked) {
                                setEquityUsd(currentEquity.toFixed(2));
                              } else {
                                setEquityUsd("");
                              }
                            }}
                            className="w-5 h-5"
                          />
                          <span className={`font-semibold text-sm ${isDark ? 'text-white' : 'text-gray-900'}`}>
                            {t('riskCalculator.useCurrentPortfolio')}
                          </span>
                        </label>
                      </div>
                      {useCurrentEquity && (
                        <div className={`${isDark ? 'bg-blue-500/10' : 'bg-blue-100'} rounded-lg p-3`}>
                          <p className={`${isDark ? 'text-xs text-blue-300' : 'text-xs text-blue-700'} mb-1`}>
                            {t('riskCalculator.currentPortfolio')}
                          </p>
                          <p className={`${isDark ? 'text-xl font-bold text-blue-400' : 'text-xl font-bold text-blue-800'}`}>
                            ${currentEquity.toLocaleString()}
                          </p>
                          <p className={`${isDark ? 'text-xs text-slate-400' : 'text-xs text-gray-600'} mt-1`}>
                            {t('riskCalculator.portfolioNote')}
                          </p>
                        </div>
                      )}
                    </div>
                  )}

                  {currentEquity === null && (
                    <div className={`mb-4 ${isDark ? 'bg-orange-900/20 border-orange-500/30' : 'bg-orange-50 border-orange-300'} border rounded-lg p-4`}>
                      <div className="flex items-start gap-3">
                        <AlertTriangle className={`${isDark ? 'text-orange-400' : 'text-orange-600'} w-5 h-5 flex-shrink-0 mt-0.5`} />
                        <div>
                          <p className={`${isDark ? 'text-orange-300' : 'text-orange-700'} text-sm font-semibold mb-1`}>
                            {t('riskCalculator.noSettingsWarning')}
                          </p>
                          <Link to={createPageUrl("Settings")}>
                            <Button size="sm" variant="outline" className={`mt-2 text-xs ${isDark ? '' : 'text-gray-800 border-gray-300 hover:bg-gray-100'}`}>
                              {language === 'he' ? 'עבור להגדרות' : 'Go to Settings'} →
                            </Button>
                          </Link>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Equity Input */}
                  {!useCurrentEquity && (
                    <div className="mb-4 sm:mb-6">
                      <label className={`block font-bold mb-2 text-sm sm:text-base ${isDark ? 'text-white' : 'text-gray-900'}`}>
                        {t('riskCalculator.manualPortfolioSize')}
                      </label>
                      <Input
                        type="number"
                        value={equityUsd}
                        onChange={(e) => setEquityUsd(e.target.value)}
                        placeholder="10000"
                        className={`h-10 sm:h-12 text-base font-semibold ${isDark ? 'bg-gray-800 border-gray-600 text-white placeholder:text-gray-500' : 'bg-white border-gray-300 text-gray-900 placeholder:text-gray-400'}`}
                      />
                    </div>
                  )}

                  {/* Risk % Slider */}
                  <div className="mb-4 sm:mb-6">
                    <label className={`block font-bold mb-2 text-sm sm:text-base ${isDark ? 'text-white' : 'text-gray-900'}`}>
                      {t('riskCalculator.riskPercent')}: <span className="text-red-500 text-xl sm:text-2xl font-bold">{riskPct}%</span>
                    </label>
                    <input
                      type="range"
                      min="0.5"
                      max="10"
                      step="0.5"
                      value={riskPct}
                      onChange={(e) => setRiskPct(parseFloat(e.target.value))}
                      className="w-full h-3 rounded-lg appearance-none cursor-pointer"
                      style={{
                        background: language === 'he'
                          ? `linear-gradient(to left, #ef4444 0%, #ef4444 ${((riskPct - 0.5) / 9.5) * 100}%, #374151 ${((riskPct - 0.5) / 9.5) * 100}%, #374151 100%)`
                          : `linear-gradient(to right, #ef4444 0%, #ef4444 ${((riskPct - 0.5) / 9.5) * 100}%, #374151 ${((riskPct - 0.5) / 9.5) * 100}%, #374151 100%)`
                      }}
                    />
                    <div className={`flex justify-between text-xs sm:text-sm ${isDark ? 'text-gray-300' : 'text-gray-700'} mt-2`}>
                      <span>0.5%</span>
                      <span>10%</span>
                    </div>
                    {equityUsd && !isNaN(parseFloat(equityUsd)) && (
                      <div className="mt-2 text-center text-red-500 font-bold text-sm sm:text-base">
                        1R = ${(parseFloat(equityUsd) * (riskPct / 100)).toFixed(2)}
                      </div>
                    )}
                  </div>

                  {/* Side */}
                  <div className="mb-4 sm:mb-6">
                    <label className={`block font-bold mb-2 text-sm sm:text-base ${isDark ? 'text-white' : 'text-gray-900'}`}>
                      {t('riskCalculator.direction')}
                    </label>
                    <div className="flex gap-3 sm:gap-4">
                      <Button
                        onClick={() => setSide("long")}
                        className={`flex-1 h-12 sm:h-14 text-base sm:text-lg font-semibold ${side === "long"
                          ? "bg-green-600 hover:bg-green-700"
                          : `${isDark ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-200 hover:bg-gray-300 text-gray-800'}`
                          }`}
                      >
                        <TrendingUp className="w-4 h-4 sm:w-5 sm:h-5 ml-2" />
                        {t('riskCalculator.long')}
                      </Button>
                      <Button
                        onClick={() => setSide("short")}
                        className={`flex-1 h-12 sm:h-14 text-base sm:text-lg font-semibold ${side === "short"
                          ? "bg-red-600 hover:bg-red-700"
                          : `${isDark ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-200 hover:bg-gray-300 text-gray-800'}`
                          }`}
                      >
                        <TrendingDown className="w-4 h-4 sm:w-5 sm:h-5 ml-2" />
                        {t('riskCalculator.short')}
                      </Button>
                    </div>
                  </div>

                  {/* BTC Mode Toggle */}
                  <div className={`${isDark ? 'bg-blue-500/10 border-blue-500/30' : 'bg-blue-50 border-blue-300'} border rounded-lg p-3 sm:p-4`}>
                    <label className="flex items-center gap-3 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={btcMode}
                        onChange={(e) => setBtcMode(e.target.checked)}
                        className="w-5 h-5"
                      />
                      <div className="flex-1">
                        <span className={`font-bold text-sm sm:text-base ${isDark ? 'text-white' : 'text-gray-900'}`}>{t('riskCalculator.btcMode')}</span>
                        <p className={`text-xs sm:text-sm mt-1 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                          {t('riskCalculator.btcModeDesc')}
                        </p>
                      </div>
                    </label>
                  </div>
                </CardContent>
              </Card>

              {/* Price Settings - 3 אפשרויות */}
              <Card className={`${isDark ? 'bg-gray-900/50 border-gray-800' : 'bg-white border-gray-200 shadow-lg'} backdrop-blur-sm shadow-2xl`}>
                <CardContent className="p-4 sm:p-6">
                  <h2 className={`text-lg sm:text-xl font-bold mb-4 sm:mb-6 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                    {t('riskCalculator.priceSettings')}
                  </h2>

                  <Tabs value={priceMode} onValueChange={setPriceMode} className="w-full">
                    <TabsList className={`grid w-full grid-cols-3 p-1 mb-4 ${isDark ? 'bg-gray-800' : 'bg-gray-100'}`}>
                      <TabsTrigger
                        value="entry_stop"
                        className={`data-[state=active]:bg-cyan-600 data-[state=active]:text-white text-xs sm:text-sm ${isDark ? '' : 'text-gray-700 data-[state=active]:text-white'}`}
                      >
                        כניסה + סטופ
                      </TabsTrigger>
                      <TabsTrigger
                        value="entry_stop_pct"
                        className={`data-[state=active]:bg-cyan-600 data-[state=active]:text-white text-xs sm:text-sm ${isDark ? '' : 'text-gray-700 data-[state=active]:text-white'}`}
                      >
                        כניסה + %
                      </TabsTrigger>
                      <TabsTrigger
                        value="entry_notional"
                        className={`data-[state=active]:bg-cyan-600 data-[state=active]:text-white text-xs sm:text-sm ${isDark ? '' : 'text-gray-700 data-[state=active]:text-white'}`}
                      >
                        כניסה + חשיפה
                      </TabsTrigger>
                    </TabsList>

                    <TabsContent value="entry_stop" className="space-y-4">
                      <div>
                        <label className={`block font-semibold mb-2 text-sm sm:text-base ${isDark ? 'text-white' : 'text-gray-900'}`}>
                          {t('riskCalculator.entryPrice')}
                        </label>
                        <Input
                          type="number"
                          value={entryPrice}
                          onChange={(e) => setEntryPrice(e.target.value)}
                          placeholder="100000"
                          className={`h-10 sm:h-12 text-base ${isDark ? 'bg-gray-800 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'}`}
                        />
                      </div>
                      <div>
                        <label className={`block font-semibold mb-2 text-sm sm:text-base ${isDark ? 'text-white' : 'text-gray-900'}`}>
                          {t('riskCalculator.stopPrice')}
                        </label>
                        <Input
                          type="number"
                          value={stopPrice}
                          onChange={(e) => setStopPrice(e.target.value)}
                          placeholder="98000"
                          className={`h-10 sm:h-12 text-base ${isDark ? 'bg-gray-800 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'}`}
                        />
                      </div>
                    </TabsContent>

                    <TabsContent value="entry_stop_pct" className="space-y-4">
                      <div>
                        <label className={`block font-semibold mb-2 text-sm sm:text-base ${isDark ? 'text-white' : 'text-gray-900'}`}>
                          {t('riskCalculator.entryPrice')}
                        </label>
                        <Input
                          type="number"
                          value={entryPrice}
                          onChange={(e) => setEntryPrice(e.target.value)}
                          placeholder="100000"
                          className={`h-10 sm:h-12 text-base ${isDark ? 'bg-gray-800 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'}`}
                        />
                      </div>
                      <div>
                        <label className={`block font-semibold mb-2 text-sm sm:text-base ${isDark ? 'text-white' : 'text-gray-900'}`}>
                          {t('riskCalculator.stopPercent')}: <span className={`${isDark ? 'text-orange-400' : 'text-orange-600'}`}>{stopPct}%</span>
                        </label>
                        <input
                          type="range"
                          min="0.1"
                          max="20"
                          step="0.1"
                          value={stopPct}
                          onChange={(e) => setStopPct(parseFloat(e.target.value))}
                          className="w-full h-3 rounded-lg appearance-none cursor-pointer"
                          style={{
                            background: language === 'he'
                              ? `linear-gradient(to left, #f97316 0%, #f97316 ${((stopPct - 0.1) / 19.9) * 100}%, #374151 ${((stopPct - 0.1) / 19.9) * 100}%, #374151 100%)`
                              : `linear-gradient(to right, #f97316 0%, #f97316 ${((stopPct - 0.1) / 19.9) * 100}%, #374151 ${((stopPct - 0.1) / 19.9) * 100}%, #374151 100%)`
                          }}
                        />
                        <div className={`flex justify-between text-xs sm:text-sm ${isDark ? 'text-gray-300' : 'text-gray-700'} mt-2`}>
                          <span>{language === 'he' ? '20%' : '0.1%'}</span>
                          <span>{language === 'he' ? '0.1%' : '20%'}</span>
                        </div>
                      </div>
                    </TabsContent>

                    <TabsContent value="entry_notional" className="space-y-4">
                      <div>
                        <label className={`block font-semibold mb-2 text-sm sm:text-base ${isDark ? 'text-white' : 'text-gray-900'}`}>
                          {t('riskCalculator.entryPrice')}
                        </label>
                        <Input
                          type="number"
                          value={entryPrice}
                          onChange={(e) => setEntryPrice(e.target.value)}
                          placeholder="100000"
                          className={`h-10 sm:h-12 text-base ${isDark ? 'bg-gray-800 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'}`}
                        />
                      </div>
                      <div>
                        <label className={`block font-semibold mb-2 text-sm sm:text-base ${isDark ? 'text-white' : 'text-gray-900'}`}>
                          חשיפה נומינלית ($)
                        </label>
                        <Input
                          type="number"
                          value={notionalUsd}
                          onChange={(e) => setNotionalUsd(e.target.value)}
                          placeholder="10000"
                          className={`h-10 sm:h-12 text-base ${isDark ? 'bg-gray-800 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'}`}
                        />
                        <p className={`${isDark ? 'text-xs text-gray-400' : 'text-xs text-gray-600'} mt-2`}>
                          💡 הזן את סכום החשיפה הכולל שלך (אחרי מינוף). הסטופ לוס יחושב אוטומטית לפי הסיכון שלך.
                        </p>
                      </div>
                    </TabsContent>
                  </Tabs>
                </CardContent>
              </Card>

              {/* Targets */}
              <Card className={`${isDark ? 'bg-gray-900/50 border-gray-800' : 'bg-white border-gray-200 shadow-lg'} backdrop-blur-sm shadow-2xl`}>
                <CardContent className="p-4 sm:p-6">
                  <div className="flex items-center justify-between mb-4 sm:mb-6">
                    <h2 className={`text-lg sm:text-xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                      {t('riskCalculator.targets')}
                    </h2>
                    <Button
                      onClick={addTarget}
                      size="sm"
                      className="bg-blue-600 hover:bg-blue-700 text-xs sm:text-sm"
                    >
                      {t('riskCalculator.addTarget')}
                    </Button>
                  </div>

                  <div className="space-y-3 sm:space-y-4">
                    {targetsR.map((r, index) => (
                      <div key={index} className={`${isDark ? 'bg-gray-800/50' : 'bg-gray-100'} p-3 sm:p-4 rounded-lg`}>
                        <div className="grid grid-cols-3 gap-2 sm:gap-3">
                          <div>
                            <label className={`block text-xs sm:text-sm mb-1 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>R</label>
                            <Input
                              type="number"
                              value={r}
                              onChange={(e) => updateTargetR(index, e.target.value)}
                              className={`h-9 sm:h-10 text-sm ${isDark ? 'bg-gray-700 border-gray-600 text-white' : 'bg-gray-50 border-gray-300 text-gray-900'}`}
                            />
                          </div>
                          <div>
                            <label className={`block text-xs sm:text-sm mb-1 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                              % {index === 0 ? t('riskCalculator.fromAll') : t('riskCalculator.fromRemaining')}
                            </label>
                            <Input
                              type="number"
                              value={(partials[index] * 100).toFixed(0)}
                              onChange={(e) => updatePartial(index, parseFloat(e.target.value))}
                              className={`h-9 sm:h-10 text-sm ${isDark ? 'bg-gray-700 border-gray-600 text-white' : 'bg-gray-50 border-gray-300 text-gray-900'}`}
                            />
                          </div>
                          <div className="flex items-end">
                            {targetsR.length > 1 && (
                              <Button
                                onClick={() => removeTarget(index)}
                                variant="destructive"
                                size="sm"
                                className="w-full h-9 sm:h-10 text-xs sm:text-sm"
                              >
                                {t('riskCalculator.remove')}
                              </Button>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className={`mt-4 p-2 sm:p-3 rounded ${isDark ? 'text-xs sm:text-sm text-gray-400 bg-blue-500/10' : 'text-xs sm:text-sm text-blue-800 bg-blue-50'}`}>
                    💡 {t('riskCalculator.tpNote')}<br />
                    {t('riskCalculator.tpDefault')}
                  </div>
                </CardContent>
              </Card>

              {/* Scale-In */}
              <Card className={`${isDark ? 'bg-gradient-to-br from-purple-900/20 to-pink-900/20 border-purple-500/30' : 'bg-gradient-to-br from-purple-50 to-pink-50 border-purple-300'}`}>
                <CardContent className="p-4 sm:p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className={`text-lg sm:text-xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                      {t('riskCalculator.scaleIn')}
                    </h2>
                    <label className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={enableScaleIn}
                        onChange={(e) => setEnableScaleIn(e.target.checked)}
                        className="w-5 h-5"
                      />
                    </label>
                  </div>

                  {enableScaleIn && (
                    <div className="space-y-4">
                      <div>
                        <label className={`block font-semibold mb-2 text-sm ${isDark ? 'text-white' : 'text-gray-900'}`}>
                          {t('riskCalculator.triggerR')}
                        </label>
                        <Input
                          type="number"
                          value={scaleInTriggerR}
                          onChange={(e) => setScaleInTriggerR(parseFloat(e.target.value))}
                          className={`h-10 text-base ${isDark ? 'bg-gray-800 border-gray-600 text-white' : 'bg-gray-100 border-gray-300 text-gray-900'}`}
                        />
                      </div>
                      <div>
                        <label className={`block font-semibold mb-2 text-sm ${isDark ? 'text-white' : 'text-gray-900'}`}>
                          {t('riskCalculator.additionalQty')}: <span className={`${isDark ? 'text-purple-400' : 'text-purple-600'}`}>{scaleInFraction * 100}%</span>
                        </label>
                        <input
                          type="range"
                          min="0.1"
                          max="1"
                          step="0.1"
                          value={scaleInFraction}
                          onChange={(e) => setScaleInFraction(parseFloat(e.target.value))}
                          className="w-full h-3 rounded-lg"
                        />
                      </div>
                      <div className={`${isDark ? 'text-xs text-gray-400 bg-purple-500/10' : 'text-xs text-purple-800 bg-purple-50'} p-3 rounded`}>
                        ⚠️ {t('riskCalculator.scaleInWarning')}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Calculate Button */}
              <Button
                onClick={calculate}
                className="w-full h-12 sm:h-14 text-base sm:text-lg font-bold bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 shadow-lg"
              >
                <Calculator className="w-5 h-5 ml-2" />
                {t('riskCalculator.calculate')}
              </Button>
            </motion.div>

            {/* Right Column - Results */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <AnimatePresence mode="wait">
                {results ? (
                  <motion.div
                    key="results"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="space-y-4 sm:space-y-6"
                  >
                    {/* Warnings */}
                    {warnings.length > 0 && (
                      <Card className={`${isDark ? 'bg-red-900/20 border-red-500/30' : 'bg-red-50 border-red-300'}`}>
                        <CardContent className="p-4 sm:p-6">
                          <div className="flex items-start gap-3">
                            <AlertTriangle className={`w-5 h-5 flex-shrink-0 mt-0.5 ${isDark ? 'text-red-400' : 'text-red-600'}`} />
                            <div className="space-y-2">
                              {warnings.map((warn, i) => (
                                <p key={i} className={`${isDark ? 'text-red-300' : 'text-red-700'} text-sm`}>{warn}</p>
                              ))}
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    )}

                    {/* Summary */}
                    <Card className={`${isDark ? 'bg-gradient-to-br from-blue-900/30 to-cyan-900/30 border-blue-500/30' : 'bg-gradient-to-br from-blue-50 to-cyan-50 border-blue-300 shadow-xl'}`}>
                      <CardContent className="p-4 sm:p-6">
                        <h2 className={`text-xl sm:text-2xl font-bold mb-4 sm:mb-6 flex items-center gap-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                          <Shield className="w-5 h-5 sm:w-6 sm:h-6 text-blue-500" />
                          {t('riskCalculator.summary')}
                        </h2>

                        <div className="grid grid-cols-2 gap-3 sm:gap-4 mb-4 sm:mb-6">
                          <div className={`${isDark ? 'bg-red-500/10 border-2 border-red-500/30' : 'bg-red-50 border-2 border-red-300'} rounded-lg p-3 sm:p-4`}>
                            <div className="flex items-center gap-2 mb-2">
                              <Shield className="w-5 h-5 text-red-500" />
                              <span className="text-red-500 font-semibold text-xs sm:text-sm">סיכון מקסימלי</span>
                            </div>
                            <div className="text-xl sm:text-2xl font-bold text-red-500">
                              ${results.one_R_usd}
                            </div>
                            <div className="text-red-500 text-sm">
                              {riskPct}% מהתיק
                            </div>
                          </div>

                          <div className={`${isDark ? 'bg-green-500/10 border-2 border-green-500/30' : 'bg-green-50 border-2 border-green-300'} rounded-lg p-3 sm:p-4`}>
                            <div className="flex items-center gap-2 mb-2">
                              <DollarSign className="w-5 h-5 text-green-500" />
                              <span className="text-green-500 font-semibold text-xs sm:text-sm">רווח צפוי</span>
                            </div>
                            <div className="text-xl sm:text-2xl font-bold text-green-500">
                              ${results.planned_total_pnl_usd.toFixed(2)}
                            </div>
                            {equityUsd && !isNaN(parseFloat(equityUsd)) && parseFloat(equityUsd) > 0 && (
                              <div className="text-green-500 text-sm">
                                {((results.planned_total_pnl_usd / parseFloat(equityUsd)) * 100).toFixed(2)}% ROI
                              </div>
                            )}
                          </div>
                        </div>

                        <div className="space-y-2 sm:space-y-3 text-sm sm:text-base">
                          <div className={`flex justify-between ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                            <span>כמות:</span>
                            <span className={`${isDark ? 'text-white font-semibold' : 'text-gray-900 font-bold'}`}>{results.qty.toFixed(4)}</span>
                          </div>
                          <div className={`flex justify-between ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                            <span>חשיפה נומינלית:</span>
                            <span className={`${isDark ? 'text-white font-semibold' : 'text-gray-900 font-bold'}`}>${results.notional_usd}</span>
                          </div>
                          <div className={`flex justify-between ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                            <span>מחיר סטופ:</span>
                            <span className={`${isDark ? 'text-white font-semibold' : 'text-gray-900 font-bold'}`}>${results.stop_price.toFixed(2)}</span>
                          </div>
                          <div className={`flex justify-between ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                            <span>מרחק סטופ:</span>
                            <span className={`${isDark ? 'text-white font-semibold' : 'text-gray-900 font-bold'}`}>${results.distance.toFixed(2)}</span>
                          </div>
                          <div className={`flex justify-between ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                            <span>יחס סיכון-תגמול:</span>
                            <span className={`${isDark ? 'text-white font-semibold' : 'text-gray-900 font-bold'}`}>{results.risk_reward_ratio.toFixed(2)}</span>
                          </div>
                        </div>

                        {btcMode && (
                          <div className={`${isDark ? 'mt-4 bg-blue-500/10 border border-blue-500/30 rounded-lg p-3 text-xs sm:text-sm text-blue-300' : 'mt-4 bg-blue-50 border border-blue-300 rounded-lg p-3 text-xs sm:text-sm text-blue-700'}`}>
                            <Info className="w-4 h-4 inline ml-1" />
                            מצב BTC: שקול סטופ רחב יותר (3-5%)
                          </div>
                        )}
                      </CardContent>
                    </Card>

                    {/* Targets */}
                    <Card className={`${isDark ? 'bg-gray-900/50 border-gray-800' : 'bg-white border-gray-200 shadow-lg'}`}>
                      <CardContent className="p-4 sm:p-6">
                        <h3 className={`text-lg sm:text-xl font-bold mb-4 flex items-center gap-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                          <Target className="w-5 h-5 text-green-500" />
                          יעדי רווח
                        </h3>
                        <div className="space-y-3 sm:space-y-4">
                          {results.targets.map((target, i) => (
                            <div key={i} className={`${isDark ? 'bg-gray-800/50' : 'bg-gray-100'} rounded-lg p-3 sm:p-4`}>
                              <div className="flex justify-between items-start mb-2">
                                <span className="text-green-500 font-bold text-base sm:text-lg">
                                  {target.R}R
                                </span>
                                <div className="text-right">
                                  <div className={`${isDark ? 'text-gray-400' : 'text-gray-600'} text-xs`}>
                                    {i === 0 ? 'מהכל' : 'מהנותר'}
                                  </div>
                                  <div className={`${isDark ? 'text-white font-semibold' : 'text-gray-900 font-bold'} text-sm`}>
                                    {(partials[i] * 100).toFixed(0)}%
                                  </div>
                                </div>
                              </div>
                              <div className="space-y-1 sm:space-y-2 text-xs sm:text-sm">
                                <div className="flex justify-between">
                                  <span className={`${isDark ? 'text-gray-300' : 'text-gray-700'}`}>מחיר:</span>
                                  <span className={`${isDark ? 'text-white font-semibold' : 'text-gray-900 font-bold'}`}>${target.price.toLocaleString()}</span>
                                </div>
                                <div className="flex justify-between">
                                  <span className={`${isDark ? 'text-gray-300' : 'text-gray-700'}`}>מרחק:</span>
                                  <span className={`${isDark ? 'text-white font-semibold' : 'text-gray-900 font-bold'}`}>${((target.R * results.distance)).toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between">
                                  <span className={`${isDark ? 'text-gray-300' : 'text-gray-700'}`}>כמות לסגירה:</span>
                                  <span className={`${isDark ? 'text-gray-400' : 'text-gray-600'}`}>{target.partial_qty.toFixed(4)}</span>
                                </div>
                                {target.remaining_after !== undefined && (
                                  <div className="flex justify-between">
                                    <span className={`${isDark ? 'text-gray-300' : 'text-gray-700'}`}>נותר אחרי:</span>
                                    <span className={`${isDark ? 'text-gray-400' : 'text-gray-600'}`}>{target.remaining_after.toFixed(4)}</span>
                                  </div>
                                )}
                                <div className="flex justify-between pt-2 border-t border-gray-700">
                                  <span className={`${isDark ? 'text-gray-300 font-semibold' : 'text-gray-700 font-bold'}`}>רווח:</span>
                                  <span className="text-green-500 font-bold text-base">
                                    ${target.partial_pnl_usd.toFixed(2)}
                                  </span>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>

                    {/* Scale-In Result */}
                    {results.scale_in.enabled && (
                      <Card className={`${results.scale_in.allowed
                        ? (isDark ? "bg-purple-900/20 border-purple-500/30" : "bg-purple-50 border-purple-300")
                        : (isDark ? "bg-red-900/20 border-red-500/30" : "bg-red-50 border-red-300")
                        }`}>
                        <CardContent className="p-4 sm:p-6">
                          <h3 className={`text-lg sm:text-xl font-bold mb-4 ${results.scale_in.allowed ? (isDark ? "text-purple-300" : "text-purple-700") : (isDark ? "text-red-300" : "text-red-700")
                            }`}>
                            {results.scale_in.allowed ? "✓ Scale-In מאושר" : "✗ Scale-In לא מומלץ"}
                          </h3>
                          <p className={`text-sm mb-4 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                            {results.scale_in.note}
                          </p>
                          {results.scale_in.allowed && (
                            <div className="space-y-2 text-sm">
                              <div className="flex justify-between">
                                <span className={`${isDark ? 'text-gray-300' : 'text-gray-700'}`}>כמות חדשה:</span>
                                <span className={`${isDark ? 'text-white font-semibold' : 'text-gray-900 font-bold'}`}>
                                  {results.scale_in.new_qty_if_applied.toFixed(4)}
                                </span>
                              </div>
                              <div className="flex justify-between">
                                <span className={`${isDark ? 'text-gray-300' : 'text-gray-700'}`}>חשיפה חדשה:</span>
                                <span className={`${isDark ? 'text-white font-semibold' : 'text-gray-900 font-bold'}`}>
                                  ${results.scale_in.new_notional}
                                </span>
                              </div>
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    )}

                    {/* Save Trade Button */}
                    <Card className={`${isDark ? 'bg-gradient-to-br from-emerald-900/20 to-teal-900/20 border-emerald-500/30' : 'bg-gradient-to-br from-emerald-50 to-teal-50 border-emerald-300'}`}>
                      <CardContent className="p-4 sm:p-6">
                        <Button
                          onClick={() => setShowAddTradeModal(true)}
                          className="w-full h-12 sm:h-14 text-base sm:text-lg font-bold bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700"
                        >
                          💾 שמור עסקה ביומן המסחר
                        </Button>
                        <p className={`text-xs sm:text-sm mt-3 text-center ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                          שמור את פרטי העסקה המחושבת ליומן המסחר שלך
                        </p>
                      </CardContent>
                    </Card>
                  </motion.div>
                ) : (
                  <Card className={`${isDark ? 'bg-gray-900/30 border-gray-800/50' : 'bg-white border-gray-200 shadow-lg'} h-full flex items-center justify-center min-h-[400px] sm:min-h-[600px]`}>
                    <CardContent className="text-center p-8 sm:p-12">
                      <div className={`w-20 h-20 sm:w-24 sm:h-24 ${isDark ? 'bg-gray-800/50' : 'bg-gray-100'} rounded-full flex items-center justify-center mx-auto mb-6`}>
                        <Calculator className={`w-10 h-10 sm:w-12 sm:h-12 ${isDark ? 'text-gray-600' : 'text-gray-400'}`} />
                      </div>
                      <h3 className={`text-xl sm:text-2xl font-bold mb-3 ${isDark ? 'text-gray-400' : 'text-gray-700'}`}>
                        הזן פרטים וחשב
                      </h3>
                      <p className={`text-sm sm:text-base max-w-md mx-auto font-semibold ${isDark ? 'text-gray-500' : 'text-gray-600'}`}>
                        מלא את הפרמטרים ולחץ על 'חשב' לקבלת ניתוח מלא
                      </p>
                    </CardContent>
                  </Card>
                )}
              </AnimatePresence>
            </motion.div>
          </div>
        </FeatureGate>
      </div>

      {/* Info Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 pb-12">
        <Card className={`${isDark ? 'bg-gradient-to-br from-gray-900/50 to-gray-800/50 border-gray-700' : 'bg-gradient-to-br from-gray-50 to-gray-100 border-gray-300'}`}>
          <CardContent className="p-4 sm:p-6">
            <h3 className={`text-base sm:text-lg font-semibold mb-3 ${isDark ? 'text-blue-300' : 'text-blue-700'}`}>
              💡 איך המחשבון עובד?
            </h3>
            <ul className={`${isDark ? 'text-slate-300' : 'text-slate-700'} space-y-2 text-xs sm:text-sm`}>
              <li className="flex items-start gap-2">
                <span className={`${isDark ? 'text-emerald-400' : 'text-emerald-600'} mt-1`}>✓</span>
                <span><strong>1R:</strong> המערכת מחשבת את הסיכון המוחלט (1R) לפי אחוז הסיכון מהתיק</span>
              </li>
              <li className="flex items-start gap-2">
                <span className={`${isDark ? 'text-emerald-400' : 'text-emerald-600'} mt-1`}>✓</span>
                <span><strong>כמות:</strong> הכמות מחושבת כך שההפסד בסטופ יהיה בדיוק 1R</span>
              </li>
              <li className="flex items-start gap-2">
                <span className={`${isDark ? 'text-emerald-400' : 'text-emerald-600'} mt-1`}>✓</span>
                <span><strong>יעדי R:</strong> כל יעד R מחושב כמכפילה של המרחק לסטופ</span>
              </li>
              <li className="flex items-start gap-2">
                <span className={`${isDark ? 'text-emerald-400' : 'text-emerald-600'} mt-1`}>✓</span>
                <span><strong>Scale-In:</strong> מתבצע רק אם הושג היעד המוגדר</span>
              </li>
            </ul>
          </CardContent>
        </Card>
      </div>

      {/* Add Trade Modal */}
      {showAddTradeModal && results && (
        <AddTradeModal
          onClose={() => setShowAddTradeModal(false)}
          prefillData={{
            direction: side,
            entry_price: parseFloat(entryPrice),
            stop_loss: results.stop_price,
            quantity: results.qty,
            position_size_usd: results.notional_usd,
            risk_amount: results.one_R_usd,
            risk_reward_ratio: results.risk_reward_ratio,
            take_profit_levels: results.targets.map((t, index) => ({
              price: t.price,
              percentage: partials[index] * 100
            })),
          }}
        />
      )}
    </div>
  );
}
