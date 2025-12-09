
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  TrendingUp, TrendingDown, DollarSign, Activity, Brain,
  Zap, Calendar, Settings, Plus, Target, Clock,
  ChevronRight, AlertTriangle, FileText, BookOpen
} from "lucide-react";
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from "recharts";

import { GlassCard } from "../ui/GlassCard";
import { Button } from "../ui/Button";
import { api } from "../../lib/api";
import { UserProfile, TradingStats, EquityPoint, JournalInsight, AICoachInsight, Trade } from "../../types";

// --- HELPERS ---

const formatCurrency = (val: number) =>
  new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(val);

// --- COMPONENT: STAT CARD ---
const StatCard: React.FC<{
  label: string;
  value: string;
  sub: string;
  icon: React.ElementType;
  trend?: 'up' | 'down' | 'neutral';
  delay?: number
}> = ({ label, value, sub, icon: Icon, trend, delay = 0 }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
    >
      <GlassCard className="p-6 h-full flex flex-col justify-between group hover:bg-white/[0.03] transition-colors">
        <div className="flex justify-between items-start mb-4">
          <div className="p-2.5 rounded-lg bg-white/5 border border-white/5 text-slate-400 group-hover:text-white group-hover:bg-white/10 transition-all">
            <Icon className="w-5 h-5" />
          </div>
          {trend && (
            <div className={`text-[10px] px-2 py-0.5 rounded-full border ${trend === 'up' ? 'text-emerald-400 border-emerald-500/20 bg-emerald-500/10' :
                trend === 'down' ? 'text-rose-400 border-rose-500/20 bg-rose-500/10' :
                  'text-slate-400 border-slate-500/20 bg-slate-500/10'
              }`}>
              {trend === 'up' ? 'Good' : trend === 'down' ? 'Concern' : 'Neutral'}
            </div>
          )}
        </div>

        <div>
          <div className="text-[11px] font-bold text-slate-500 uppercase tracking-widest mb-1">{label}</div>
          <div className={`text-3xl font-light tracking-tight text-white mb-1`}>
            {value}
          </div>
          <div className="text-xs text-slate-500 font-medium">{sub}</div>
        </div>
      </GlassCard>
    </motion.div>
  );
};

// --- MAIN DASHBOARD ---

interface DashboardProps {
  user: UserProfile;
}

export const Dashboard: React.FC<DashboardProps> = ({ user }) => {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'settings'>('dashboard');
  const [loading, setLoading] = useState(true);

  // Data State
  const [equityData, setEquityData] = useState<EquityPoint[]>([]);
  const [aiInsights, setAiInsights] = useState<AICoachInsight[]>([]);
  const [journalInsights, setJournalInsights] = useState<JournalInsight[]>([]);
  const [stats, setStats] = useState<TradingStats | null>(null);

  const [btcPrice, setBtcPrice] = useState(90349);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [equityData, aiData, journalData, statsData] = await Promise.all([
          api.dashboard.getEquityCurve(),
          api.dashboard.getAICoachInsights(),
          api.dashboard.getJournalInsights(),
          api.dashboard.getStats()
        ]);

        setEquityData(equityData);
        setAiInsights(aiData);
        setJournalInsights(journalData);
        setStats(statsData);
        setLoading(false);
      } catch (e) {
        console.error("Failed to load dashboard data", e);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const currentDate = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric"
  });

  if (loading || !stats) {
    return (
      <div className="min-h-screen pt-24 flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-indigo-500 rounded-full animate-spin border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24 pb-12 px-4 md:px-8 max-w-[1600px] mx-auto animate-in fade-in duration-500">

      {/* 1. HEADER SECTION */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-10 gap-6">
        <div>
          {/* Icon Title */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-3 mb-2"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500/20 to-teal-500/20 flex items-center justify-center border border-emerald-500/20 text-emerald-400">
              <Activity className="w-5 h-5" />
            </div>
            <h1 className="text-3xl md:text-4xl font-semibold text-white tracking-tight">
              Welcome back, {user.name}
            </h1>
          </motion.div>

          {/* Date & Ticker */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-3 text-sm text-slate-400 ml-1">
            <span>{currentDate}</span>
            <span className="hidden sm:block text-slate-700">|</span>
            <div className="flex items-center gap-3">
              <span className="text-slate-300 font-mono">BTC <span className="text-white font-bold">${btcPrice.toLocaleString()}</span> <span className="text-rose-400 text-xs">↘ 1.13%</span></span>
              <span className="text-slate-600">Fear & Greed</span>
              <span className="text-rose-400 font-bold">20 / Extreme Fear</span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-3">
          <Button variant="primary" className="bg-emerald-600 hover:bg-emerald-500 border-emerald-500/50 shadow-emerald-900/20">
            <FileText className="w-4 h-4 mr-2" /> New Position
          </Button>
          <Button variant="secondary">
            <Plus className="w-4 h-4 mr-2" /> Add Trade
          </Button>
          <Button variant="secondary">
            <Brain className="w-4 h-4 mr-2" /> Launch AI Coach
          </Button>
        </div>
      </div>

      {/* 2. TABS & FILTER (Mock) */}
      <div className="flex items-center gap-1 mb-8 border-b border-white/5 pb-0">
        <button
          onClick={() => setActiveTab('dashboard')}
          className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${activeTab === 'dashboard' ? 'border-indigo-500 text-white' : 'border-transparent text-slate-500 hover:text-slate-300'}`}
        >
          Dashboard
        </button>
        <button
          onClick={() => setActiveTab('settings')}
          className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${activeTab === 'settings' ? 'border-indigo-500 text-white' : 'border-transparent text-slate-500 hover:text-slate-300'}`}
        >
          Settings
        </button>
      </div>

      {activeTab === 'dashboard' && (
        <div className="space-y-6">

          {/* 3. KEY STATS ROW */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard
              label="Win Rate"
              value={`${stats.winRate.toFixed(1)}%`}
              sub={`${stats.wins}W / ${stats.losses}L`}
              icon={Target}
              trend={stats.winRate > 40 ? 'up' : 'down'}
              delay={0.1}
            />
            <StatCard
              label="P/L (30D)"
              value={`${stats.totalPL > 0 ? '+' : ''}${formatCurrency(stats.totalPL)}`}
              sub={stats.totalPL > 0 ? "▲ Last 30 days" : "▼ Last 30 days"}
              icon={DollarSign}
              trend={stats.totalPL > 0 ? 'up' : 'down'}
              delay={0.2}
            />
            <StatCard
              label="Avg R-Multiple"
              value={`${stats.avgRMultiple}R`}
              sub="Risk-reward ratio"
              icon={Activity}
              trend={stats.avgRMultiple > 1 ? 'up' : 'down'}
              delay={0.3}
            />
            <StatCard
              label="Max Drawdown"
              value={`${stats.maxDrawdown}%`}
              sub="Peak to trough"
              icon={TrendingDown}
              trend={stats.maxDrawdown < 15 ? 'up' : 'down'}
              delay={0.4}
            />
          </div>

          {/* 4. EQUITY CURVE */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <GlassCard className="p-6">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-emerald-400" />
                  <h3 className="text-lg font-medium text-white">Equity Curve</h3>
                </div>
                <div className="flex gap-2">
                  {['1W', '1M', '3M', 'YTD', 'ALL'].map(t => (
                    <button key={t} className={`text-xs px-2 py-1 rounded hover:bg-white/5 transition-colors ${t === '1M' ? 'text-white bg-white/10' : 'text-slate-500'}`}>{t}</button>
                  ))}
                </div>
              </div>

              <div className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={equityData} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
                    <defs>
                      <linearGradient id="colorBalance" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#10b981" stopOpacity={0.2} />
                        <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                    <XAxis
                      dataKey="date"
                      stroke="#475569"
                      fontSize={10}
                      tickLine={false}
                      axisLine={false}
                      minTickGap={40}
                    />
                    <YAxis
                      stroke="#475569"
                      fontSize={10}
                      tickLine={false}
                      axisLine={false}
                      tickFormatter={(val) => `$${val}`}
                    />
                    <Tooltip
                      contentStyle={{ backgroundColor: "#020617", borderColor: "rgba(255,255,255,0.1)", borderRadius: "8px" }}
                      itemStyle={{ color: "#10b981" }}
                      formatter={(value: number) => [formatCurrency(value), "Balance"]}
                    />
                    <Area
                      type="monotone"
                      dataKey="balance"
                      stroke="#10b981"
                      strokeWidth={2}
                      fillOpacity={1}
                      fill="url(#colorBalance)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </GlassCard>
          </motion.div>

          {/* 5. SPLIT SECTION: JOURNAL INSIGHTS & AI COACH */}
          <div className="grid lg:grid-cols-2 gap-6">

            {/* JOURNAL INSIGHTS */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6 }}
              className="flex flex-col h-full"
            >
              <GlassCard className="p-6 h-full flex flex-col">
                <div className="flex items-center gap-2 mb-6">
                  <BookOpen className="w-5 h-5 text-amber-400" />
                  <h3 className="text-lg font-medium text-white">Journal Insights</h3>
                </div>

                <p className="text-xs text-slate-500 mb-4">Track your best and worst trades</p>

                <div className="space-y-4 flex-1">
                  {/* Best R-Multiple */}
                  <div className="p-4 rounded-xl bg-emerald-950/20 border border-emerald-500/20 flex justify-between items-center group hover:bg-emerald-900/20 transition-colors">
                    <div>
                      <div className="text-xs font-bold text-emerald-400 uppercase tracking-wider mb-1">Best R-Multiple</div>
                      <div className="text-xs text-emerald-200/50">{journalInsights[0]?.asset || 'BTCUSDT'}</div>
                    </div>
                    <div className="text-2xl font-mono text-emerald-400 font-bold">{journalInsights[0]?.value || '0R'}</div>
                  </div>

                  {/* Worst R-Multiple */}
                  <div className="p-4 rounded-xl bg-rose-950/20 border border-rose-500/20 flex justify-between items-center group hover:bg-rose-900/20 transition-colors">
                    <div>
                      <div className="text-xs font-bold text-rose-400 uppercase tracking-wider mb-1">Worst R-Multiple</div>
                      <div className="text-xs text-rose-200/50">{journalInsights[1]?.asset || 'BTCUSDT'}</div>
                    </div>
                    <div className="text-2xl font-mono text-rose-400 font-bold">{journalInsights[1]?.value || '0R'}</div>
                  </div>
                </div>

                {/* Footer Stats */}
                <div className="grid grid-cols-2 gap-4 mt-6 pt-6 border-t border-white/5">
                  <div className="bg-white/5 rounded-lg p-3">
                    <div className="text-[10px] text-slate-500 uppercase font-bold mb-1">Win/Loss</div>
                    <div className="text-lg font-mono text-white">{journalInsights[2]?.value || '0/0'}</div>
                  </div>
                  <div className="bg-white/5 rounded-lg p-3">
                    <div className="text-[10px] text-slate-500 uppercase font-bold mb-1">Avg Hold Time</div>
                    <div className="text-lg font-mono text-white">{journalInsights[3]?.value || '0h'}</div>
                  </div>
                </div>
              </GlassCard>
            </motion.div>

            {/* AI COACH */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.7 }}
              className="flex flex-col h-full"
            >
              <GlassCard className="p-6 h-full flex flex-col border-indigo-500/20 bg-indigo-950/5">
                <div className="flex items-center gap-2 mb-6">
                  <div className="p-1.5 rounded bg-indigo-500/20 text-indigo-400">
                    <Brain className="w-5 h-5" />
                  </div>
                  <h3 className="text-lg font-medium text-white">AI Coach</h3>
                </div>

                <p className="text-xs text-slate-500 mb-4">Get personalized trading insights</p>

                <div className="space-y-3 flex-1 overflow-y-auto max-h-[400px] pr-2 custom-scrollbar">
                  {aiInsights.map((insight) => (
                    <div
                      key={insight.id}
                      className={`p-4 rounded-xl border backdrop-blur-sm transition-all hover:-translate-y-1 hover:shadow-lg ${insight.type === 'pattern' ? 'bg-indigo-500/10 border-indigo-500/20 hover:border-indigo-500/40' :
                          insight.type === 'recommendation' ? 'bg-cyan-500/10 border-cyan-500/20 hover:border-cyan-500/40' :
                            'bg-amber-500/10 border-amber-500/20 hover:border-amber-500/40'
                        }`}
                    >
                      <div className="flex items-center gap-2 mb-2">
                        {insight.type === 'pattern' && <Activity className="w-3.5 h-3.5 text-indigo-400" />}
                        {insight.type === 'recommendation' && <Zap className="w-3.5 h-3.5 text-cyan-400" />}
                        {insight.type === 'alert' && <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />}

                        <span className={`text-xs font-bold uppercase tracking-wide ${insight.type === 'pattern' ? 'text-indigo-300' :
                            insight.type === 'recommendation' ? 'text-cyan-300' :
                              'text-amber-300'
                          }`}>
                          {insight.title}
                        </span>
                      </div>
                      <p className="text-xs text-slate-300 leading-relaxed font-light">
                        {insight.message}
                      </p>
                    </div>
                  ))}
                </div>

                <div className="mt-4 pt-4 border-t border-white/5">
                  <Button variant="ghost" size="sm" className="w-full text-indigo-400 hover:text-white hover:bg-indigo-500/10 justify-between group">
                    View Full Analysis <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </div>
              </GlassCard>
            </motion.div>

          </div>
        </div>
      )}

      {activeTab === 'settings' && (
        <div className="py-12 text-center text-slate-500">
          <Settings className="w-12 h-12 mx-auto mb-4 opacity-50" />
          <p>Settings panel is under construction.</p>
        </div>
      )}
    </div>
  );
};
