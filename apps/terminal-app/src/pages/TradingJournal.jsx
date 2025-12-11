import React, { useState, useMemo, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "@/api/client";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { GlassCard } from "@/components/ui/glass-card";
import {
  Search, Plus, Calendar as CalendarIcon, X, Upload,
  TrendingUp, TrendingDown, Filter, Download,
  ChevronLeft, ChevronRight, MoreHorizontal, ArrowUpRight, ArrowDownRight,
  Clock, Target, Zap, PieChart as PieChartIcon, BarChart3, CalendarDays, DollarSign,
  Activity, Wallet, CheckCircle
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { useLanguage } from "../components/LanguageContext";
import moment from "moment";
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, BarChart, Bar, ReferenceLine
} from 'recharts';

import AddTradeModal from "../components/trading-journal/AddTradeModal";
import ImportCSVModal from "../components/trading-journal/ImportCSVModal";
import TradeCard from "../components/trading-journal/TradeCard";
import AIInsightsButton from "../components/trading-journal/AIInsightsButton";
import { CryptoTicker } from "../components/trading-journal/CryptoTicker";
import { FeatureGate } from "../components/FeatureGate";

// --- HELPERS ---
const formatCurrency = (val) =>
  new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(val);

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-black/90 border border-white/10 p-3 rounded-lg shadow-xl backdrop-blur-md">
        <p className="text-slate-400 text-xs mb-1">{label}</p>
        <p className="text-white font-mono font-bold">
          {formatCurrency(payload[0].value)}
        </p>
      </div>
    );
  }
  return null;
};

// --- KPI CARD ---
const KPICard = ({ title, value, sub, colorClass, glowClass, icon: Icon }) => (
  <GlassCard className={`p-5 flex flex-col justify-between h-full relative overflow-hidden group ${glowClass}`}>
    <div className={`absolute top-0 right-0 p-3 opacity-10 group-hover:opacity-20 transition-opacity`}>
      <Icon className={`w-8 h-8 ${colorClass}`} />
    </div>
    <div>
      <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-2 flex items-center gap-2">
        <Icon className={`w-4 h-4 ${colorClass}`} />
        {title}
      </h3>
      <div className={`text-2xl font-mono font-bold tracking-tight mb-1 ${colorClass}`}>{value}</div>
      <div className="text-xs text-slate-400">{sub}</div>
    </div>
  </GlassCard>
);

// --- TRADE LIST ITEM ---
const TradeListItem = ({ trade }) => {
  const pnl = trade.pnl || 0;
  const isWin = pnl > 0;
  const pnlPercent = trade.pnl_percent || 0;

  return (
    <div className="flex items-center justify-between p-3 hover:bg-white/5 rounded-lg transition-colors border-b border-white/5 last:border-0 group">
      <div className="flex items-center gap-3">
        <div className={`p-2 rounded-lg ${isWin ? 'bg-emerald-500/10 text-emerald-400' : 'bg-rose-500/10 text-rose-400'} border border-white/5`}>
          {isWin ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownRight className="w-4 h-4" />}
        </div>
        <div>
          <div className="flex items-center gap-2">
            <span className="text-sm font-bold text-white">{trade.symbol}</span>
            <span className={`text-[10px] px-1.5 rounded border ${trade.side === 'long' ? 'border-emerald-500/30 text-emerald-400' : 'border-rose-500/30 text-rose-400'}`}>
              {trade.side?.toUpperCase()}
            </span>
          </div>
          <div className="text-[10px] text-slate-500 flex items-center gap-1">
            {trade.status === 'closed' ? 'Closed' : 'Open'} • {moment(trade.entry_time).format('MMM DD')}
          </div>
        </div>
      </div>
      <div className="text-right">
        <div className={`text-sm font-mono font-bold ${isWin ? 'text-emerald-400' : 'text-rose-400'}`}>
          {isWin ? '+' : ''}{formatCurrency(pnl)}
        </div>
        <div className={`text-[10px] ${isWin ? 'text-emerald-500/60' : 'text-rose-500/60'}`}>
          {pnlPercent > 0 ? '+' : ''}{pnlPercent.toFixed(1)}%
        </div>
      </div>
    </div>
  );
};

export default function TradingJournal() {
  const { t, language } = useLanguage();
  const [search, setSearch] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);
  const [showImportModal, setShowImportModal] = useState(false);
  const [filterStatus, setFilterStatus] = useState("all");
  const [dateRange, setDateRange] = useState({ from: null, to: null });
  const [showDatePicker, setShowDatePicker] = useState(false);

  // Time Range States for charts
  const [cumulativeRange, setCumulativeRange] = useState('1M');
  const [portfolioRange, setPortfolioRange] = useState('1M');

  // Current month for calendar
  const [currentMonth, setCurrentMonth] = useState(moment());

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

  const { data: trades = [] } = useQuery({
    queryKey: ['trades'],
    queryFn: () => api.entities.Trade.list('-entry_time'),
  });

  const filteredTrades = useMemo(() => {
    return trades.filter(trade => {
      const matchesSearch = !search || trade.symbol?.toLowerCase().includes(search.toLowerCase());
      const matchesStatus = filterStatus === "all" || trade.status === filterStatus;

      let matchesDateRange = true;
      if (dateRange.from || dateRange.to) {
        const tradeDate = moment(trade.entry_time);
        if (dateRange.from && dateRange.to) {
          matchesDateRange = tradeDate.isBetween(moment(dateRange.from), moment(dateRange.to), 'day', '[]');
        } else if (dateRange.from) {
          matchesDateRange = tradeDate.isSameOrAfter(moment(dateRange.from), 'day');
        } else if (dateRange.to) {
          matchesDateRange = tradeDate.isSameOrBefore(moment(dateRange.to), 'day');
        }
      }

      return matchesSearch && matchesStatus && matchesDateRange;
    });
  }, [trades, search, filterStatus, dateRange]);

  const stats = useMemo(() => {
    const closedTrades = filteredTrades.filter(t => t.status === "closed");
    const winningTrades = closedTrades.filter(t => (t.pnl || 0) > 0);
    const losingTrades = closedTrades.filter(t => (t.pnl || 0) < 0);
    const totalPnL = closedTrades.reduce((sum, t) => sum + (t.pnl || 0), 0);
    const totalWins = winningTrades.reduce((sum, t) => sum + (t.pnl || 0), 0);
    const totalLosses = Math.abs(losingTrades.reduce((sum, t) => sum + (t.pnl || 0), 0));
    const avgWin = winningTrades.length > 0 ? totalWins / winningTrades.length : 0;
    const avgLoss = losingTrades.length > 0 ? totalLosses / losingTrades.length : 0;
    const winRate = closedTrades.length > 0 ? (winningTrades.length / closedTrades.length) * 100 : 0;
    const profitFactor = totalLosses > 0 ? totalWins / totalLosses : totalWins > 0 ? totalWins : 0;
    const expectancy = closedTrades.length > 0 ? totalPnL / closedTrades.length : 0;

    // Calculate unrealized PnL from open trades
    const openTrades = filteredTrades.filter(t => t.status === "open");
    const unrealizedPnL = openTrades.reduce((sum, t) => sum + (t.unrealized_pnl || 0), 0);

    return {
      totalTrades: filteredTrades.length,
      openTrades: openTrades.length,
      closedTrades: closedTrades.length,
      totalPnL,
      unrealizedPnL,
      winRate,
      avgWin,
      avgLoss,
      profitFactor,
      expectancy,
      winningTrades: winningTrades.length,
      losingTrades: losingTrades.length
    };
  }, [filteredTrades]);

  // Generate chart data from trades
  const equityData = useMemo(() => {
    if (filteredTrades.length === 0) return [];

    const sortedTrades = [...filteredTrades]
      .filter(t => t.status === 'closed')
      .sort((a, b) => new Date(a.entry_time) - new Date(b.entry_time));

    let equity = 0;
    return sortedTrades.map(t => {
      equity += (t.pnl || 0);
      return {
        date: moment(t.entry_time).format('MMM DD'),
        value: equity
      };
    });
  }, [filteredTrades]);

  // Daily PnL data
  const dailyPnLData = useMemo(() => {
    const closedTrades = filteredTrades.filter(t => t.status === 'closed');
    const dailyMap = {};

    closedTrades.forEach(t => {
      const day = moment(t.entry_time).format('MMM DD');
      if (!dailyMap[day]) dailyMap[day] = 0;
      dailyMap[day] += (t.pnl || 0);
    });

    let cumulative = 0;
    return Object.entries(dailyMap).map(([date, pnl]) => {
      cumulative += pnl;
      return { date, pnl, cumulative };
    });
  }, [filteredTrades]);

  // Asset breakdown
  const assetData = useMemo(() => {
    const assetMap = {};
    filteredTrades.filter(t => t.status === 'closed').forEach(t => {
      const asset = t.symbol?.split('/')[0] || 'Unknown';
      if (!assetMap[asset]) assetMap[asset] = 0;
      assetMap[asset] += (t.pnl || 0);
    });

    const colors = ['#10b981', '#06b6d4', '#6366f1', '#f59e0b', '#ef4444', '#a855f7'];
    return Object.entries(assetMap)
      .map(([name, value], i) => ({ name, value, color: colors[i % colors.length] }))
      .slice(0, 6);
  }, [filteredTrades]);

  // Calendar data
  const calendarData = useMemo(() => {
    const startOfMonth = currentMonth.clone().startOf('month');
    const endOfMonth = currentMonth.clone().endOf('month');
    const startOfCalendar = startOfMonth.clone().startOf('week');
    const endOfCalendar = endOfMonth.clone().endOf('week');

    const days = [];
    const current = startOfCalendar.clone();

    while (current.isSameOrBefore(endOfCalendar)) {
      const dayTrades = filteredTrades.filter(t =>
        moment(t.entry_time).isSame(current, 'day') && t.status === 'closed'
      );
      const dayPnL = dayTrades.reduce((sum, t) => sum + (t.pnl || 0), 0);

      days.push({
        day: current.date(),
        isCurrentMonth: current.isSame(currentMonth, 'month'),
        pnl: dayPnL,
        trades: dayTrades.length
      });
      current.add(1, 'day');
    }

    return days;
  }, [filteredTrades, currentMonth]);

  // Streak calculation - based on DAILY performance, not individual trades
  const streak = useMemo(() => {
    // Build daily PnL map from closed trades
    const dailyPnLMap = {};
    filteredTrades
      .filter(t => t.status === 'closed')
      .forEach(t => {
        const day = moment(t.entry_time).format('YYYY-MM-DD');
        if (!dailyPnLMap[day]) dailyPnLMap[day] = 0;
        dailyPnLMap[day] += (t.pnl || 0);
      });

    // Convert to sorted array (most recent first)
    const dailyPnL = Object.entries(dailyPnLMap)
      .map(([date, pnl]) => ({ date, pnl }))
      .sort((a, b) => new Date(b.date) - new Date(a.date));

    if (dailyPnL.length === 0) return { count: 0, type: 'none' };

    // Determine streak type from most recent day
    const isWinning = dailyPnL[0].pnl > 0;
    let count = 0;

    // Count consecutive days with same result
    for (const day of dailyPnL) {
      const dayWin = day.pnl > 0;
      if (dayWin === isWinning) {
        count++;
      } else {
        break;
      }
    }

    return { count, type: isWinning ? 'winning' : 'losing' };
  }, [filteredTrades]);

  const clearDateRange = () => {
    setDateRange({ from: null, to: null });
  };

  const formatDateRange = () => {
    if (dateRange.from && dateRange.to) {
      return `${moment(dateRange.from).format('DD/MM/YY')} - ${moment(dateRange.to).format('DD/MM/YY')}`;
    } else if (dateRange.from) {
      return `From ${moment(dateRange.from).format('DD/MM/YY')}`;
    } else if (dateRange.to) {
      return `To ${moment(dateRange.to).format('DD/MM/YY')}`;
    }
    return 'Date Range';
  };

  return (
    <div className="min-h-screen bg-transparent" dir={language === 'he' ? 'rtl' : 'ltr'}>
      <div className="pt-[72px]">
        <CryptoTicker />
      </div>
      <div className="pb-12 pt-6 px-4 md:px-6 max-w-[1600px] mx-auto">
        {/* AI Insights Button */}
        <FeatureGate feature="ai_trade_coach_standard">
          <AIInsightsButton trades={trades} />
        </FeatureGate>

        {/* 1. HEADER */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-light text-white mb-1">Professional Trading Journal</h1>
            <p className="text-slate-400 text-sm">
              Hello {user?.full_name?.split(' ')[0] || 'Trader'}! Document and analyze your trading
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Popover open={showDatePicker} onOpenChange={setShowDatePicker}>
              <PopoverTrigger asChild>
                <Button variant="secondary" size="sm" className="bg-white/5 border-white/10 text-slate-300 hover:bg-white/10">
                  <CalendarIcon className="w-3.5 h-3.5 mr-2" />
                  {formatDateRange()}
                  {(dateRange.from || dateRange.to) && (
                    <X className="w-3 h-3 ml-2 hover:text-red-400" onClick={(e) => { e.stopPropagation(); clearDateRange(); }} />
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-4 bg-slate-900 border-slate-800" align="end">
                <div className="space-y-4">
                  <div className="text-sm font-semibold text-white mb-2">Select Date Range</div>
                  <div className="flex gap-4">
                    <div>
                      <label className="text-xs text-slate-400 mb-1 block">From</label>
                      <Calendar
                        mode="single"
                        selected={dateRange.from}
                        onSelect={(date) => setDateRange(prev => ({ ...prev, from: date }))}
                        className="rounded-md border border-slate-800 bg-slate-900"
                      />
                    </div>
                    <div>
                      <label className="text-xs text-slate-400 mb-1 block">To</label>
                      <Calendar
                        mode="single"
                        selected={dateRange.to}
                        onSelect={(date) => setDateRange(prev => ({ ...prev, to: date }))}
                        disabled={(date) => dateRange.from && date < dateRange.from}
                        className="rounded-md border border-slate-800 bg-slate-900"
                      />
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline" onClick={() => { clearDateRange(); setShowDatePicker(false); }} className="flex-1 bg-slate-800 hover:bg-slate-700 text-white border-slate-700">
                      Clear
                    </Button>
                    <Button size="sm" onClick={() => setShowDatePicker(false)} className="flex-1 bg-emerald-600 hover:bg-emerald-500 text-white">
                      Apply
                    </Button>
                  </div>
                </div>
              </PopoverContent>
            </Popover>

            <FeatureGate feature="csv_import">
              <Button onClick={() => setShowImportModal(true)} variant="secondary" size="sm" className="bg-white/5 border-white/10 text-slate-300 hover:bg-white/10">
                <Download className="w-3.5 h-3.5 mr-2" /> Import CSV
              </Button>
            </FeatureGate>

            <Button onClick={() => setShowAddModal(true)} size="sm" className="bg-emerald-600 hover:bg-emerald-500 border-emerald-500/50 shadow-lg shadow-emerald-900/20">
              <Plus className="w-3.5 h-3.5 mr-2" /> New Trade
            </Button>
          </div>
        </div>

        {/* 2. KPI CARDS */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <KPICard
            title="Total PnL"
            value={`${stats.totalPnL >= 0 ? '+' : ''}${formatCurrency(stats.totalPnL)}`}
            sub="Realized + Unrealized"
            colorClass={stats.totalPnL >= 0 ? "text-emerald-400" : "text-rose-400"}
            glowClass={stats.totalPnL >= 0 ? "shadow-[0_0_20px_rgba(16,185,129,0.15)] border-emerald-500/20" : "shadow-[0_0_20px_rgba(244,63,94,0.15)] border-rose-500/20"}
            icon={Wallet}
          />
          <KPICard
            title="Realized PnL"
            value={`${stats.totalPnL >= 0 ? '+' : ''}${formatCurrency(stats.totalPnL)}`}
            sub={`From ${stats.closedTrades} closed trades`}
            colorClass={stats.totalPnL >= 0 ? "text-emerald-400" : "text-rose-400"}
            glowClass={stats.totalPnL >= 0 ? "shadow-[0_0_20px_rgba(16,185,129,0.15)] border-emerald-500/20" : "shadow-[0_0_20px_rgba(244,63,94,0.15)] border-rose-500/20"}
            icon={CheckCircle}
          />
          <KPICard
            title="Unrealized PnL"
            value={`${stats.unrealizedPnL >= 0 ? '+' : ''}${formatCurrency(stats.unrealizedPnL)}`}
            sub={`${stats.openTrades} open positions`}
            colorClass="text-indigo-400"
            glowClass="shadow-[0_0_20px_rgba(99,102,241,0.15)] border-indigo-500/20"
            icon={Activity}
          />
        </div>

        {/* 3. CHARTS ROW 1 */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          {/* Portfolio Growth */}
          <GlassCard className="lg:col-span-2 p-6 flex flex-col">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-sm font-bold text-white flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-indigo-400" /> Portfolio Growth Over Time
              </h2>
              <div className="flex bg-white/5 rounded-lg p-0.5">
                {(['7D', '1M', '1Y', 'YTD']).map(range => (
                  <button
                    key={range}
                    onClick={() => setPortfolioRange(range)}
                    className={`px-3 py-1 text-[10px] font-bold rounded-md transition-colors ${portfolioRange === range ? 'bg-indigo-500 text-white shadow' : 'text-slate-500 hover:text-slate-300'}`}
                  >
                    {range}
                  </button>
                ))}
              </div>
            </div>
            <div className="h-[250px] w-full">
              {equityData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={equityData} margin={{ top: 10, right: 10, left: 10, bottom: 0 }}>
                    <defs>
                      <linearGradient id="colorEquity" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                    <XAxis dataKey="date" stroke="#475569" fontSize={10} tickLine={false} axisLine={false} minTickGap={30} />
                    <YAxis stroke="#475569" fontSize={10} tickLine={false} axisLine={false} tickFormatter={(val) => `$${val}`} width={50} />
                    <Tooltip content={<CustomTooltip />} cursor={{ stroke: 'rgba(255,255,255,0.1)', strokeWidth: 1 }} />
                    <Area type="monotone" dataKey="value" stroke="#6366f1" strokeWidth={2} fill="url(#colorEquity)" />
                  </AreaChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-full flex items-center justify-center text-slate-500 text-sm">
                  No trade data available
                </div>
              )}
            </div>
          </GlassCard>

          {/* Asset Allocation */}
          <GlassCard className="p-6 flex flex-col">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-sm font-bold text-white flex items-center gap-2">
                <PieChartIcon className="w-4 h-4 text-cyan-400" /> PnL Breakdown by Asset
              </h2>
            </div>
            <div className="h-[200px] w-full relative">
              {assetData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={assetData} cx="50%" cy="50%" innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value" stroke="none">
                      {assetData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.value > 0 ? entry.color : '#334155'} />
                      ))}
                    </Pie>
                    <Tooltip content={<CustomTooltip />} />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-full flex items-center justify-center text-slate-500 text-sm">
                  No asset data
                </div>
              )}
              {assetData.length > 0 && (
                <div className="absolute inset-0 flex items-center justify-center flex-col pointer-events-none">
                  <span className="text-2xl font-bold text-white">{assetData.length}</span>
                  <span className="text-[10px] text-slate-500 uppercase">Assets</span>
                </div>
              )}
            </div>
            <div className="mt-auto space-y-2">
              {assetData.slice(0, 3).map(asset => (
                <div key={asset.name} className="flex justify-between items-center text-xs">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full" style={{ backgroundColor: asset.value > 0 ? asset.color : '#334155' }} />
                    <span className="text-slate-300">{asset.name}</span>
                  </div>
                  <span className={`font-mono ${asset.value > 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                    {asset.value > 0 ? '+' : ''}{formatCurrency(asset.value)}
                  </span>
                </div>
              ))}
            </div>
          </GlassCard>
        </div>

        {/* 4. STATS STRIP */}
        <div className="grid grid-cols-2 md:grid-cols-6 gap-4 mb-6">
          {[
            { label: 'Win Rate', val: `${stats.winRate.toFixed(1)}%`, icon: Target },
            { label: 'Win/Loss', val: `${stats.winningTrades}/${stats.losingTrades}`, icon: CalendarDays },
            { label: 'Profit Factor', val: stats.profitFactor.toFixed(2), icon: BarChart3 },
            { label: 'Expectancy', val: formatCurrency(stats.expectancy), icon: Zap },
            { label: 'Avg Win', val: formatCurrency(stats.avgWin), icon: TrendingUp },
            { label: 'Total Trades', val: stats.totalTrades, icon: Activity, highlight: true },
          ].map((stat, i) => (
            <div key={i} className={`p-4 rounded-xl border flex flex-col justify-center ${stat.highlight ? 'bg-emerald-500/10 border-emerald-500/20' : 'bg-white/5 border-white/5'}`}>
              <div className="text-[10px] text-slate-500 uppercase tracking-wider mb-1 flex items-center gap-1">
                <stat.icon className="w-3 h-3" /> {stat.label}
              </div>
              <div className={`text-lg font-mono font-bold ${stat.highlight ? 'text-emerald-400' : 'text-white'}`}>{stat.val}</div>
            </div>
          ))}
        </div>

        {/* 5. CHARTS ROW 2 */}
        <FeatureGate feature="full_dashboard">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-6">
            {/* Cumulative PnL Line */}
            <GlassCard className="lg:col-span-2 p-6 h-[300px]">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Daily Net Cumulative PnL</h2>
                <div className="flex bg-white/5 rounded-lg p-0.5">
                  {(['7D', '14D', '1M']).map(range => (
                    <button
                      key={range}
                      onClick={() => setCumulativeRange(range)}
                      className={`px-3 py-1 text-[10px] font-bold rounded-md transition-colors ${cumulativeRange === range ? 'bg-indigo-500 text-white shadow' : 'text-slate-500 hover:text-slate-300'}`}
                    >
                      {range}
                    </button>
                  ))}
                </div>
              </div>
              <ResponsiveContainer width="100%" height="85%">
                <AreaChart data={dailyPnLData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorCum" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.2} />
                      <stop offset="95%" stopColor="#06b6d4" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                  <XAxis dataKey="date" stroke="#475569" fontSize={10} tickLine={false} axisLine={false} minTickGap={20} />
                  <YAxis stroke="#475569" fontSize={10} tickLine={false} axisLine={false} width={45} tickFormatter={(val) => `$${val}`} />
                  <Tooltip content={<CustomTooltip />} />
                  <Area type="monotone" dataKey="cumulative" stroke="#06b6d4" strokeWidth={2} fill="url(#colorCum)" />
                </AreaChart>
              </ResponsiveContainer>
            </GlassCard>

            {/* Net Daily PnL Bar */}
            <GlassCard className="lg:col-span-1 p-6 h-[300px]">
              <h2 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-6">Net Daily PnL</h2>
              <ResponsiveContainer width="100%" height="85%">
                <BarChart data={dailyPnLData.slice(-14)} margin={{ top: 20, right: 10, left: 0, bottom: 5 }}>
                  <defs>
                    <linearGradient id="winGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#10b981" stopOpacity={0.8} />
                      <stop offset="100%" stopColor="#10b981" stopOpacity={0.4} />
                    </linearGradient>
                    <linearGradient id="lossGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#ef4444" stopOpacity={0.8} />
                      <stop offset="100%" stopColor="#ef4444" stopOpacity={0.4} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                  <XAxis dataKey="date" stroke="#475569" fontSize={9} tickLine={false} axisLine={false} interval={3} />
                  <YAxis stroke="#475569" fontSize={9} tickLine={false} axisLine={false} width={30} tickFormatter={(val) => `$${Math.round(val)}`} />
                  <ReferenceLine y={0} stroke="#475569" strokeDasharray="3 3" />
                  <Tooltip content={<CustomTooltip />} cursor={{ fill: 'white', opacity: 0.05 }} />
                  <Bar dataKey="pnl" radius={[4, 4, 4, 4]}>
                    {dailyPnLData.slice(-14).map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.pnl > 0 ? "url(#winGradient)" : "url(#lossGradient)"} stroke={entry.pnl > 0 ? "#10b981" : "#ef4444"} strokeWidth={1} strokeOpacity={0.5} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </GlassCard>

            {/* Streak Card */}
            <GlassCard className={`lg:col-span-1 p-6 relative overflow-hidden flex flex-col items-center justify-center text-center ${streak.type === 'winning' ? 'bg-emerald-900/10 border-emerald-500/20' : streak.type === 'losing' ? 'bg-rose-900/10 border-rose-500/20' : 'bg-white/5 border-white/10'}`}>
              <div className={`absolute inset-0 ${streak.type === 'winning' ? 'bg-emerald-500/5' : streak.type === 'losing' ? 'bg-rose-500/5' : 'bg-white/5'} blur-xl pointer-events-none`} />
              <div className="relative z-10 flex flex-col items-center justify-center h-full">
                <div className={`w-16 h-16 rounded-full ${streak.type === 'winning' ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' : streak.type === 'losing' ? 'bg-rose-500/10 border-rose-500/20 text-rose-400' : 'bg-white/10 border-white/20 text-slate-400'} flex items-center justify-center mb-6 border shadow-[0_0_20px_rgba(16,185,129,0.2)]`}>
                  <Zap className="w-8 h-8 fill-current" />
                </div>
                <div className={`text-sm font-medium ${streak.type === 'winning' ? 'text-emerald-200' : streak.type === 'losing' ? 'text-rose-200' : 'text-slate-300'} mb-2`}>
                  {streak.type === 'winning' ? 'Winning Streak' : streak.type === 'losing' ? 'Losing Streak' : 'No Streak'}
                </div>
                <div className="text-5xl font-bold text-white mb-2">{streak.count}</div>
                <div className={`text-xs ${streak.type === 'winning' ? 'text-emerald-400/60' : streak.type === 'losing' ? 'text-rose-400/60' : 'text-slate-500'} uppercase tracking-wider mb-2`}>Trades</div>
                <div className="mt-auto pt-8 border-t border-white/10 w-full px-4 text-center">
                  <p className="text-[10px] text-slate-400 italic">"Consistency is the key to success."</p>
                </div>
              </div>
            </GlassCard>
          </div>
        </FeatureGate>

        {/* 6. BOTTOM SECTION: CALENDAR & TRADES */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          {/* CALENDAR */}
          <div className="xl:col-span-2">
            <GlassCard className="p-0 h-full overflow-hidden">
              {/* Calendar Header Stats */}
              <div className="grid grid-cols-4 divide-x divide-white/5 border-b border-white/5 bg-white/[0.02]">
                <div className="p-4 text-center">
                  <div className="text-[10px] text-slate-500 uppercase font-bold">Total PnL</div>
                  <div className={`text-sm font-mono font-bold ${stats.totalPnL >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>{formatCurrency(stats.totalPnL)}</div>
                </div>
                <div className="p-4 text-center">
                  <div className="text-[10px] text-slate-500 uppercase font-bold">Win Days</div>
                  <div className="text-sm font-mono text-white font-bold">{calendarData.filter(d => d.pnl > 0).length}</div>
                </div>
                <div className="p-4 text-center">
                  <div className="text-[10px] text-slate-500 uppercase font-bold">Loss Days</div>
                  <div className="text-sm font-mono text-white font-bold">{calendarData.filter(d => d.pnl < 0).length}</div>
                </div>
                <div className="p-4 text-center">
                  <div className="text-[10px] text-slate-500 uppercase font-bold">Win Rate</div>
                  <div className="text-sm font-mono text-white font-bold">{stats.winRate.toFixed(0)}%</div>
                </div>
              </div>

              {/* Calendar Nav */}
              <div className="p-4 flex items-center justify-between">
                <h3 className="text-white flex items-center gap-2 font-light text-lg">
                  <CalendarIcon className="w-5 h-5 text-indigo-400" /> {currentMonth.format('MMMM YYYY')}
                </h3>
                <div className="flex gap-1">
                  <button onClick={() => setCurrentMonth(m => m.clone().subtract(1, 'month'))} className="p-1.5 hover:bg-white/5 rounded-lg text-slate-400 hover:text-white transition-colors">
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <button onClick={() => setCurrentMonth(m => m.clone().add(1, 'month'))} className="p-1.5 hover:bg-white/5 rounded-lg text-slate-400 hover:text-white transition-colors">
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Calendar Grid */}
              <div className="p-4 pt-0">
                <div className="grid grid-cols-7 mb-2 text-center">
                  {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(d => (
                    <div key={d} className="text-[10px] text-slate-600 font-bold uppercase tracking-wider py-2">{d}</div>
                  ))}
                </div>
                <div className="grid grid-cols-7 gap-2">
                  {calendarData.map((day, i) => (
                    <div
                      key={i}
                      className={`relative h-24 border rounded-xl p-2 transition-all group flex flex-col justify-between
                      ${!day.isCurrentMonth ? 'border-transparent bg-transparent opacity-20 pointer-events-none' :
                          day.pnl > 0 ? 'bg-emerald-500/5 border-emerald-500/20 hover:bg-emerald-500/10' :
                            day.pnl < 0 ? 'bg-rose-500/5 border-rose-500/20 hover:bg-rose-500/10' :
                              'bg-white/[0.02] border-white/5 hover:bg-white/5'}`}
                    >
                      <div className="flex justify-between items-start">
                        <span className={`text-xs font-medium ${day.isCurrentMonth ? 'text-slate-400' : 'text-slate-800'}`}>
                          {day.day}
                        </span>
                      </div>
                      {day.pnl !== 0 && (
                        <div className="text-right">
                          <div className={`text-sm font-mono font-bold ${day.pnl > 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                            {day.pnl > 0 ? '+' : ''}{Math.round(day.pnl)}$
                          </div>
                          <div className="text-[9px] text-slate-500">{day.trades} trades</div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </GlassCard>
          </div>

          {/* RECENT TRADES */}
          <div className="xl:col-span-1 h-full">
            <GlassCard className="h-full flex flex-col p-0">
              <div className="p-4 border-b border-white/5 flex items-center justify-between bg-white/[0.02]">
                <h2 className="text-sm font-bold text-white">Recently Closed Trades</h2>
                <button className="p-1 hover:bg-white/5 rounded text-slate-400 hover:text-white" aria-label="More options">
                  <MoreHorizontal className="w-4 h-4" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto max-h-[600px] custom-scrollbar p-2 space-y-1">
                {filteredTrades.filter(t => t.status === 'closed').slice(0, 10).map((trade) => (
                  <TradeListItem key={trade.id} trade={trade} />
                ))}
                {filteredTrades.filter(t => t.status === 'closed').length === 0 && (
                  <div className="text-center py-12 text-slate-500 text-sm">No recent trades found.</div>
                )}
              </div>

              <div className="p-3 border-t border-white/5 bg-white/[0.02] text-center">
                <button className="text-xs text-indigo-400 hover:text-white transition-colors font-medium">View All History</button>
              </div>
            </GlassCard>
          </div>
        </div>

        {/* Modals */}
        <AnimatePresence>
          {showAddModal && <AddTradeModal onClose={() => setShowAddModal(false)} />}
        </AnimatePresence>

        <FeatureGate feature="csv_import">
          <AnimatePresence>
            {showImportModal && <ImportCSVModal onClose={() => setShowImportModal(false)} />}
          </AnimatePresence>
        </FeatureGate>
      </div>
    </div>
  );
}
