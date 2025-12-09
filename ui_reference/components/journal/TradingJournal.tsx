
import React, { useEffect, useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  TrendingUp, TrendingDown, Calendar as CalendarIcon, Filter,
  Download, Plus, Search, ChevronLeft, ChevronRight,
  MoreHorizontal, ArrowUpRight, ArrowDownRight, Clock, Target,
  Zap, PieChart as PieChartIcon, BarChart3, CalendarDays, DollarSign,
  Layers, Activity
} from 'lucide-react';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, BarChart, Bar, ReferenceLine
} from 'recharts';

import { GlassCard } from '../ui/GlassCard';
import { Button } from '../ui/Button';
import { api } from '../../lib/api';
import { Trade, DailyMetric } from '../../types';
import { AddTradeModal } from './modals/AddTradeModal';
import { ImportCSVModal } from './modals/ImportCSVModal';
import { AIInsightsButton } from './AIInsightsButton';

// --- MOCK CHART DATA ---
const EQUITY_DATA = [
  { date: 'Nov 01', value: 1000 }, { date: 'Nov 03', value: 1200 }, { date: 'Nov 05', value: 1150 },
  { date: 'Nov 07', value: 1400 }, { date: 'Nov 09', value: 1350 }, { date: 'Nov 11', value: 1600 },
  { date: 'Nov 13', value: 1580 }, { date: 'Nov 15', value: 1800 }, { date: 'Nov 17', value: 1750 },
  { date: 'Nov 19', value: 2100 }, { date: 'Nov 21', value: 2050 }, { date: 'Nov 23', value: 2400 },
  { date: 'Nov 25', value: 2350 }, { date: 'Nov 27', value: 2708 }
];

const ASSET_DATA = [
  { name: 'BTC', value: 788.84, color: '#10b981' },
  { name: 'ETH', value: 119.85, color: '#06b6d4' },
  { name: 'SOL', value: -39.35, color: '#ef4444' },
  { name: 'HYPE', value: -80.50, color: '#f59e0b' },
];

// Generate 30 days of data
const DAILY_PNL_RAW = Array.from({ length: 30 }, (_, i) => {
  const date = new Date();
  date.setDate(date.getDate() - (29 - i));
  return {
    date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    displayLabel: `${date.toLocaleDateString('en-US', { weekday: 'short' })} ${date.getDate()}`,
    pnl: Math.random() > 0.45 ? Math.random() * 250 : Math.random() * -180,
    cumulative: 0
  };
});

let cum = 0;
DAILY_PNL_RAW.forEach(d => {
  cum += d.pnl;
  d.cumulative = cum;
});

// --- HELPERS ---
const formatCurrency = (val: number) =>
  new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(val);

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-void border border-white/10 p-3 rounded-lg shadow-xl backdrop-blur-md">
        <p className="text-slate-400 text-xs mb-1">{label}</p>
        <p className="text-white font-mono font-bold">
          {formatCurrency(payload[0].value)}
        </p>
      </div>
    );
  }
  return null;
};

// --- COMPONENTS ---

const KPICard = ({ title, value, sub, colorClass, glowClass, icon: Icon }: { title: string, value: string, sub: string, colorClass: string, glowClass: string, icon: any }) => (
  <GlassCard className={`p-5 flex flex-col justify-between h-full relative overflow-hidden group border ${glowClass.replace('shadow-', 'border-').replace('/10', '/20')} ${glowClass}`}>
    <div className={`absolute top-0 right-0 p-3 opacity-10 group-hover:opacity-20 transition-opacity ${colorClass}`}>
      <Icon className="w-8 h-8" />
    </div>
    <div>
      <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 flex items-center gap-2">
        <Icon className={`w-4 h-4 ${colorClass.replace('bg-', 'text-')}`} />
        {title}
      </h3>
      <div className={`text-2xl font-mono font-bold tracking-tight mb-1 ${colorClass.replace('bg-', 'text-')}`}>{value}</div>
      <div className="text-xs text-slate-400">{sub}</div>
    </div>
  </GlassCard>
);

const TradeListItem = ({ trade }: { trade: Trade }) => {
  const isWin = trade.pnl > 0;
  return (
    <div className="flex items-center justify-between p-3 hover:bg-white/5 rounded-lg transition-colors border-b border-white/5 last:border-0 group">
      <div className="flex items-center gap-3">
        <div className={`p-2 rounded-lg ${isWin ? 'bg-emerald-500/10 text-emerald-400' : 'bg-rose-500/10 text-rose-400'} border border-white/5`}>
          {isWin ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownRight className="w-4 h-4" />}
        </div>
        <div>
          <div className="flex items-center gap-2">
            <span className="text-sm font-bold text-white">{trade.asset}</span>
            <span className={`text-[10px] px-1.5 rounded border ${trade.type === 'Long' ? 'border-emerald-500/30 text-emerald-400' : 'border-rose-500/30 text-rose-400'}`}>
              {trade.type}
            </span>
          </div>
          <div className="text-[10px] text-slate-500 flex items-center gap-1">
            {trade.status === 'Closed' ? 'Closed' : 'Open'} • {trade.entryDate.split(' ')[0]}
          </div>
        </div>
      </div>
      <div className="text-right">
        <div className={`text-sm font-mono font-bold ${isWin ? 'text-emerald-400' : 'text-rose-400'}`}>
          {isWin ? '+' : ''}{formatCurrency(trade.pnl)}
        </div>
        <div className={`text-[10px] ${isWin ? 'text-emerald-500/60' : 'text-rose-500/60'}`}>
          {trade.pnlPercent > 0 ? '+' : ''}{trade.pnlPercent}%
        </div>
      </div>
    </div>
  );
};

export const TradingJournal: React.FC = () => {
  const [trades, setTrades] = useState<Trade[]>([]);
  const [calendar, setCalendar] = useState<DailyMetric[]>([]);
  const [loading, setLoading] = useState(true);

  // Time Range States
  const [cumulativeRange, setCumulativeRange] = useState<'7D' | '14D' | '1M'>('1M');
  const [portfolioRange, setPortfolioRange] = useState<'7D' | '1M' | '1Y' | 'YTD'>('1M');

  const [showAddModal, setShowAddModal] = useState(false);
  const [showImportModal, setShowImportModal] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [tradesData, calendarData] = await Promise.all([
          api.journal.getTrades(),
          api.journal.getCalendarMetrics()
        ]);
        setTrades(tradesData);
        setCalendar(calendarData);
        setLoading(false);
      } catch (err) {
        console.error(err);
        setLoading(false);
      }
    };
    loadData();
  }, []);

  // Filter Data based on range for Cumulative Chart
  const filteredCumulativeData = useMemo(() => {
    const days = cumulativeRange === '7D' ? 7 : cumulativeRange === '14D' ? 14 : 30;
    return DAILY_PNL_RAW.slice(-days);
  }, [cumulativeRange]);

  // Filter Data based on range for Portfolio Chart
  const filteredPortfolioData = useMemo(() => {
    // For this mock implementation, we'll just slice the array to simulate different ranges
    if (portfolioRange === '7D') return EQUITY_DATA.slice(-7);
    if (portfolioRange === '1M') return EQUITY_DATA; // Mock data is ~1 month
    return EQUITY_DATA; // Default to full dataset for 1Y/YTD
  }, [portfolioRange]);

  // Stats Calculation
  const stats = useMemo(() => {
    const closedTrades = trades.filter(t => t.status === "Closed");
    const totalPnL = closedTrades.reduce((sum, t) => sum + t.pnl, 0);
    const wins = closedTrades.filter(t => t.pnl > 0);
    const winRate = closedTrades.length > 0 ? (wins.length / closedTrades.length) * 100 : 0;

    return {
      totalPnL,
      winRate,
      winCount: wins.length,
      lossCount: closedTrades.length - wins.length,
      profitFactor: 1.70, // Mock for visual matching
      avgProfit: 88.53, // Mock
      expectancy: 12.65 // Mock
    };
  }, [trades]);

  if (loading) return <div className="min-h-screen pt-24 flex justify-center"><div className="w-8 h-8 border-2 border-indigo-500 rounded-full animate-spin border-t-transparent" /></div>;

  return (
    <div className="min-h-screen pt-24 pb-12 px-4 md:px-6 max-w-[1600px] mx-auto animate-in fade-in duration-500">
      <AIInsightsButton trades={trades} />

      {/* 1. HEADER */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-light text-white mb-1">Professional Trading Journal</h1>
          <p className="text-slate-400 text-sm">Hello Tomer! Document and analyze your trading</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button variant="secondary" size="sm" className="bg-white/5 border-white/10 text-slate-300">
            <CalendarIcon className="w-3.5 h-3.5 mr-2" /> Date Range
          </Button>
          <Button onClick={() => setShowImportModal(true)} variant="secondary" size="sm" className="bg-white/5 border-white/10 text-slate-300">
            <Download className="w-3.5 h-3.5 mr-2" /> Import CSV
          </Button>
          <Button onClick={() => setShowAddModal(true)} variant="primary" size="sm" className="bg-emerald-600 hover:bg-emerald-500 border-emerald-500/50 shadow-lg shadow-emerald-900/20">
            <Plus className="w-3.5 h-3.5 mr-2" /> New Trade
          </Button>
        </div>
      </div>

      {/* 2. KPI CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <KPICard
          title="Total PnL"
          value={`+${formatCurrency(stats.totalPnL)}`}
          sub="Realized + Unrealized"
          colorClass="text-emerald-400"
          glowClass="shadow-[0_0_20px_rgba(16,185,129,0.15)] border-emerald-500/20"
          icon={WalletIcon}
        />
        <KPICard
          title="Realized PnL"
          value={`+${formatCurrency(stats.totalPnL)}`}
          sub="From closed trades"
          colorClass="text-emerald-400"
          glowClass="shadow-[0_0_20px_rgba(16,185,129,0.15)] border-emerald-500/20"
          icon={CheckCircleIcon}
        />
        <KPICard
          title="Unrealized PnL"
          value="+$0.00"
          sub="0 open positions"
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
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-indigo-400" /> Portfolio Growth Over Time
            </h3>
            <div className="flex bg-white/5 rounded-lg p-0.5">
              {(['7D', '1M', '1Y', 'YTD'] as const).map(range => (
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
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={filteredPortfolioData} margin={{ top: 10, right: 10, left: 10, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorEquity" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                <XAxis
                  dataKey="date"
                  stroke="#475569"
                  fontSize={10}
                  tickLine={false}
                  axisLine={false}
                  minTickGap={30}
                />
                <YAxis
                  stroke="#475569"
                  fontSize={10}
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(val) => `$${val}`}
                  width={50}
                />
                <Tooltip content={<CustomTooltip />} cursor={{ stroke: 'rgba(255,255,255,0.1)', strokeWidth: 1 }} />
                <Area type="monotone" dataKey="value" stroke="#6366f1" strokeWidth={2} fill="url(#colorEquity)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </GlassCard>

        {/* Asset Allocation */}
        <GlassCard className="p-6 flex flex-col">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <PieChartIcon className="w-4 h-4 text-cyan-400" /> PnL Breakdown by Asset
            </h3>
          </div>
          <div className="h-[200px] w-full relative">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={ASSET_DATA}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                  stroke="none"
                >
                  {ASSET_DATA.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.value > 0 ? entry.color : '#334155'} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
              </PieChart>
            </ResponsiveContainer>
            {/* Center Text */}
            <div className="absolute inset-0 flex items-center justify-center flex-col pointer-events-none">
              <span className="text-2xl font-bold text-white">4</span>
              <span className="text-[10px] text-slate-500 uppercase">Assets</span>
            </div>
          </div>
          <div className="mt-auto space-y-2">
            {ASSET_DATA.slice(0, 3).map(asset => (
              <div key={asset.name} className="flex justify-between items-center text-xs">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full" style={{ backgroundColor: asset.value > 0 ? asset.color : '#334155' }} />
                  <span className="text-slate-300">{asset.name}USDT</span>
                </div>
                <span className={`font-mono ${asset.value > 0 ? 'text-emerald-400' : 'text-slate-500'}`}>
                  {asset.value > 0 ? '+' : ''}{asset.value.toFixed(2)}
                </span>
              </div>
            ))}
          </div>
        </GlassCard>
      </div>

      {/* 4. STATS STRIP */}
      <div className="grid grid-cols-2 md:grid-cols-6 gap-4 mb-6">
        {[
          { label: 'Avg Profit/Day', val: `$${stats.avgProfit}`, icon: DollarSign },
          { label: 'Win Days', val: '4/8', icon: CalendarDays },
          { label: 'Profit Factor', val: stats.profitFactor.toFixed(2), icon: Target },
          { label: 'Trade Expectancy', val: `$${stats.expectancy}`, icon: Zap },
          { label: 'Avg PnL', val: `$${stats.expectancy}`, icon: BarChart3 },
          { label: 'Total Profit', val: `$${stats.totalPnL}`, icon: TrendingUp, highlight: true },
        ].map((stat, i) => (
          <div key={i} className={`p-4 rounded-xl border flex flex-col justify-center ${stat.highlight ? 'bg-emerald-500/10 border-emerald-500/20' : 'bg-white/5 border-white/5'}`}>
            <div className="text-[10px] text-slate-500 uppercase tracking-wider mb-1">{stat.label}</div>
            <div className={`text-lg font-mono font-bold ${stat.highlight ? 'text-emerald-400' : 'text-white'}`}>{stat.val}</div>
          </div>
        ))}
      </div>

      {/* 5. CHARTS ROW 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-6">

        {/* Cumulative PnL Line */}
        <GlassCard className="lg:col-span-2 p-6 h-[300px]">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Daily Net Cumulative PnL</h3>
            <div className="flex bg-white/5 rounded-lg p-0.5">
              {(['7D', '14D', '1M'] as const).map(range => (
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

          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={filteredCumulativeData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="colorCum" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.2} />
                  <stop offset="95%" stopColor="#06b6d4" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
              <XAxis
                dataKey="date"
                stroke="#475569"
                fontSize={10}
                tickLine={false}
                axisLine={false}
                minTickGap={20}
              />
              <YAxis
                stroke="#475569"
                fontSize={10}
                tickLine={false}
                axisLine={false}
                width={45}
                tickFormatter={(val) => `$${val}`}
              />
              <Tooltip content={<CustomTooltip />} />
              <Area type="monotone" dataKey="cumulative" stroke="#06b6d4" strokeWidth={2} fill="url(#colorCum)" />
            </AreaChart>
          </ResponsiveContainer>
        </GlassCard>

        {/* Net Daily PnL Bar */}
        <GlassCard className="lg:col-span-1 p-6 h-[300px]">
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-6">Net Daily PnL</h3>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={DAILY_PNL_RAW.slice(-14)}
              margin={{ top: 20, right: 10, left: 0, bottom: 5 }}
            >
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

              <XAxis
                dataKey="displayLabel"
                stroke="#475569"
                fontSize={9}
                tickLine={false}
                axisLine={false}
                interval={3}
              />
              <YAxis
                stroke="#475569"
                fontSize={9}
                tickLine={false}
                axisLine={false}
                width={30}
                tickFormatter={(val) => `$${Math.round(val)}`}
              />

              <ReferenceLine y={0} stroke="#475569" strokeDasharray="3 3" />
              <Tooltip content={<CustomTooltip />} cursor={{ fill: 'white', opacity: 0.05 }} />
              <Bar dataKey="pnl" radius={[4, 4, 4, 4]}>
                {DAILY_PNL_RAW.slice(-14).map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={entry.pnl > 0 ? "url(#winGradient)" : "url(#lossGradient)"}
                    stroke={entry.pnl > 0 ? "#10b981" : "#ef4444"}
                    strokeWidth={1}
                    strokeOpacity={0.5}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </GlassCard>

        {/* Streak / Stats Card */}
        <GlassCard className="lg:col-span-1 p-6 relative overflow-hidden flex flex-col items-center justify-center text-center bg-emerald-900/10 border-emerald-500/20">
          <div className="absolute inset-0 bg-emerald-500/5 blur-xl pointer-events-none" />

          <div className="relative z-10 flex flex-col items-center justify-center h-full">
            <div className="w-16 h-16 rounded-full bg-emerald-500/10 flex items-center justify-center mb-4 border border-emerald-500/20 text-emerald-400 shadow-[0_0_20px_rgba(16,185,129,0.2)]">
              <Zap className="w-8 h-8 fill-current" />
            </div>
            <div className="text-sm font-medium text-emerald-200 mb-1">Winning Streak</div>
            <div className="text-5xl font-bold text-white mb-2">2</div>
            <div className="text-xs text-emerald-400/60 uppercase tracking-wider">Days</div>

            <div className="mt-auto pt-6 border-t border-emerald-500/20 w-full px-4">
              <p className="text-[10px] text-emerald-300 italic">"Consistency is the key to the lock."</p>
            </div>
          </div>
        </GlassCard>
      </div>

      {/* 6. BOTTOM SECTION: CALENDAR & TRADES */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">

        {/* CALENDAR */}
        <div className="xl:col-span-2">
          <GlassCard className="p-0 h-full overflow-hidden">
            {/* Calendar Header Stats */}
            <div className="grid grid-cols-4 divide-x divide-white/5 border-b border-white/5 bg-white/[0.02]">
              <div className="p-4 text-center">
                <div className="text-[10px] text-slate-500 uppercase font-bold">Total PnL</div>
                <div className="text-sm font-mono text-emerald-400 font-bold">$0.00</div>
              </div>
              <div className="p-4 text-center">
                <div className="text-[10px] text-slate-500 uppercase font-bold">Win Days</div>
                <div className="text-sm font-mono text-white font-bold">0</div>
              </div>
              <div className="p-4 text-center">
                <div className="text-[10px] text-slate-500 uppercase font-bold">Loss Days</div>
                <div className="text-sm font-mono text-white font-bold">0</div>
              </div>
              <div className="p-4 text-center">
                <div className="text-[10px] text-slate-500 uppercase font-bold">Win Rate</div>
                <div className="text-sm font-mono text-white font-bold">0%</div>
              </div>
            </div>

            {/* Calendar Nav */}
            <div className="p-4 flex items-center justify-between">
              <h3 className="text-white flex items-center gap-2 font-light text-lg">
                <CalendarIcon className="w-5 h-5 text-indigo-400" /> December 2025
              </h3>
              <div className="flex gap-1">
                <button className="p-1.5 hover:bg-white/5 rounded-lg text-slate-400 hover:text-white transition-colors"><ChevronLeft className="w-4 h-4" /></button>
                <button className="p-1.5 hover:bg-white/5 rounded-lg text-slate-400 hover:text-white transition-colors"><ChevronRight className="w-4 h-4" /></button>
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
                {calendar.map((day, i) => (
                  <div
                    key={i}
                    className={`
                                relative h-24 border rounded-xl p-2 transition-all group flex flex-col justify-between
                                ${!day.isCurrentMonth ? 'border-transparent bg-transparent opacity-20 pointer-events-none' :
                        day.pnl > 0 ? 'bg-emerald-500/5 border-emerald-500/20 hover:bg-emerald-500/10' :
                          day.pnl < 0 ? 'bg-rose-500/5 border-rose-500/20 hover:bg-rose-500/10' :
                            'bg-white/[0.02] border-white/5 hover:bg-white/5'}
                            `}
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

        {/* RECENT TRADES (COMPACT LIST) */}
        <div className="xl:col-span-1 h-full">
          <GlassCard className="h-full flex flex-col p-0">
            <div className="p-4 border-b border-white/5 flex items-center justify-between bg-white/[0.02]">
              <h3 className="text-sm font-bold text-white">Recently Closed Trades</h3>
              <button className="p-1 hover:bg-white/5 rounded text-slate-400 hover:text-white">
                <MoreHorizontal className="w-4 h-4" />
              </button>
            </div>

            {/* Scrollable Container with Fixed Height as requested */}
            <div className="flex-1 overflow-y-auto max-h-[600px] custom-scrollbar p-2 space-y-1">
              {trades.map((trade) => (
                <TradeListItem key={trade.id} trade={trade} />
              ))}
              {trades.length === 0 && (
                <div className="text-center py-12 text-slate-500 text-sm">No recent trades found.</div>
              )}
            </div>

            <div className="p-3 border-t border-white/5 bg-white/[0.02] text-center">
              <button className="text-xs text-indigo-400 hover:text-white transition-colors font-medium">View All History</button>
            </div>
          </GlassCard>
        </div>

      </div>

      <AnimatePresence>
        {showAddModal && <AddTradeModal onClose={() => setShowAddModal(false)} />}
        {showImportModal && <ImportCSVModal onClose={() => setShowImportModal(false)} />}
      </AnimatePresence>

    </div>
  );
};

// --- EXTRA ICONS ---
const WalletIcon = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M21 12V7H5a2 2 0 0 1 0-4h14v4" /><path d="M3 5v14a2 2 0 0 0 2 2h16v-5" /><path d="M18 12a2 2 0 0 0 0 4h4v-4Z" /></svg>
)

const CheckCircleIcon = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" /></svg>
)
