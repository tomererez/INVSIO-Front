
import React, { useState, useEffect, useMemo } from "react";
import { motion } from "framer-motion";
import {
  TrendingUp, TrendingDown, DollarSign, Activity, Brain,
  Award, CheckCircle2, User, Lock, Plus, AlertTriangle, Zap,
  BarChart2, Calendar, Settings, ChevronRight
} from "lucide-react";
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from "recharts";

import { GlassCard } from "../ui/GlassCard";
import { Button } from "../ui/Button";
import { api } from "../../lib/api";
import { UserProfile, TradingStats, EquityPoint, JournalInsight, AICoachInsight } from "../../types";

// --- UI HELPERS ---

const StatCard: React.FC<{
  title: string;
  value: string;
  subValue?: string;
  icon: React.ReactNode;
  trend?: "up" | "down" | "neutral";
  delay?: number;
}> = ({ title, value, subValue, icon, trend, delay = 0 }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5, delay }}
  >
    <GlassCard className="p-6 h-full flex flex-col justify-between group">
      <div className="flex justify-between items-start mb-4">
        <div className="p-2 rounded-lg bg-white/5 text-slate-400 group-hover:text-white group-hover:bg-white/10 transition-colors">
          {icon}
        </div>
        {trend && (
          <div
            className={`text-xs px-2 py-1 rounded-full ${
              trend === "up"
                ? "bg-emerald-500/10 text-emerald-400"
                : trend === "down"
                ? "bg-rose-500/10 text-rose-400"
                : "bg-slate-500/10 text-slate-400"
            }`}
          >
            {trend === "up" ? "↗" : trend === "down" ? "↘" : "•"}
          </div>
        )}
      </div>
      <div>
        <h3 className="text-xs font-medium text-slate-400 uppercase tracking-wider mb-1">
          {title}
        </h3>
        <div className="text-3xl font-light text-white mb-1">{value}</div>
        {subValue && <div className="text-xs text-slate-500">{subValue}</div>}
      </div>
    </GlassCard>
  </motion.div>
);

const InsightRow: React.FC<{
  label: string;
  value: string;
  sub?: string;
  colorClass?: string;
}> = ({ label, value, sub, colorClass = "text-white" }) => (
  <div className="flex items-center justify-between p-4 bg-white/5 rounded-xl border border-white/5 mb-3 last:mb-0">
    <div className="flex flex-col">
      <span className="text-sm text-slate-400 font-medium">{label}</span>
      {sub && <span className="text-xs text-slate-500 mt-0.5">{sub}</span>}
    </div>
    <span className={`text-lg font-mono font-medium ${colorClass}`}>{value}</span>
  </div>
);

const AICoachMessage: React.FC<{
  type: "pattern" | "recommendation" | "alert";
  title: string;
  message: string;
}> = ({ type, title, message }) => {
  const styles = {
    pattern: "border-indigo-500/30 bg-indigo-500/5",
    recommendation: "border-cyan-500/30 bg-cyan-500/5",
    alert: "border-amber-500/30 bg-amber-500/5",
  } as const;

  const icons = {
    pattern: <Activity className="w-4 h-4 text-indigo-400" />,
    recommendation: <Zap className="w-4 h-4 text-cyan-400" />,
    alert: <AlertTriangle className="w-4 h-4 text-amber-400" />,
  } as const;

  return (
    <div className={`p-4 rounded-xl border mb-3 last:mb-0 ${styles[type]}`}>
      <div className="flex items-center gap-2 mb-2">
        {icons[type]}
        <h4 className="text-sm font-semibold text-white tracking-wide">{title}</h4>
      </div>
      <p className="text-sm text-slate-300 leading-relaxed font-light">{message}</p>
    </div>
  );
};

// --- MAIN DASHBOARD ---

interface DashboardProps {
  user: UserProfile;
}

export const Dashboard: React.FC<DashboardProps> = ({ user }) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'settings'>('overview');
  const [loading, setLoading] = useState(true);
  
  // State for data
  const [stats, setStats] = useState<TradingStats | null>(null);
  const [equityData, setEquityData] = useState<EquityPoint[]>([]);
  const [journalInsights, setJournalInsights] = useState<JournalInsight[]>([]);
  const [aiInsights, setAiInsights] = useState<AICoachInsight[]>([]);

  // Settings State
  const [settingsForm, setSettingsForm] = useState({
    equity: "10000",
    risk: "2.0",
    theme: "Dark Void"
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [statsData, equityData, journalData, aiData] = await Promise.all([
            api.dashboard.getStats(),
            api.dashboard.getEquityCurve(),
            api.dashboard.getJournalInsights(),
            api.dashboard.getAICoachInsights()
        ]);
        
        setStats(statsData);
        setEquityData(equityData);
        setJournalInsights(journalData);
        setAiInsights(aiData);
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
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  if (loading) {
    return (
        <div className="min-h-screen pt-24 flex items-center justify-center">
            <div className="w-8 h-8 border-2 border-indigo-500 rounded-full animate-spin border-t-transparent" />
        </div>
    );
  }

  return (
    <div className="min-h-screen pt-24 pb-12 px-4 md:px-8 max-w-[1600px] mx-auto animate-in fade-in duration-500">
      
      {/* HEADER */}
      <div className="flex flex-col md:flex-row justify-between items-end mb-8 gap-6 border-b border-white/5 pb-8">
        <div>
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-3 mb-2"
          >
            <div className="p-2 bg-indigo-500/20 rounded-lg">
              <Brain className="w-5 h-5 text-indigo-400" />
            </div>
            <h1 className="text-3xl font-light text-white">
              Welcome back,{" "}
              <span className="font-normal text-indigo-100">
                {user.name}
              </span>
            </h1>
          </motion.div>
          <div className="flex items-center gap-4 text-sm text-slate-400">
            <span className="flex items-center gap-1">
              <Calendar className="w-3 h-3" /> {currentDate}
            </span>
            <span className="px-2 py-0.5 rounded bg-white/5 border border-white/5 text-xs uppercase tracking-wide">
                {user.plan} Plan
            </span>
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex gap-3"
        >
           <Button variant="secondary" size="sm">
              <Settings className="w-3.5 h-3.5 mr-2" /> Configure
           </Button>
           <Button variant="primary" size="sm">
              <Plus className="w-3.5 h-3.5 mr-2" /> Add Funds
           </Button>
        </motion.div>
      </div>

      {/* TABS */}
      <div className="flex gap-2 mb-8 bg-white/5 w-fit p-1 rounded-full">
         <button 
            onClick={() => setActiveTab('overview')}
            className={`px-5 py-2 text-sm font-medium rounded-full transition-all ${activeTab === 'overview' ? 'bg-slate-800 text-white shadow-lg' : 'text-slate-400 hover:text-white'}`}
         >
            Overview
         </button>
         <button 
            onClick={() => setActiveTab('settings')}
            className={`px-5 py-2 text-sm font-medium rounded-full transition-all ${activeTab === 'settings' ? 'bg-slate-800 text-white shadow-lg' : 'text-slate-400 hover:text-white'}`}
         >
            Settings
         </button>
      </div>

      {activeTab === 'overview' && stats && (
         <div className="space-y-8">
            {/* STAT CARDS */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <StatCard
                title="Win Rate"
                value={`${stats.winRate.toFixed(1)}%`}
                subValue={`${stats.wins}W / ${stats.losses}L`}
                icon={<Activity className="w-5 h-5" />}
                trend={stats.winRate >= 50 ? "up" : "down"}
                delay={0.1}
              />
              <StatCard
                title="Total P/L"
                value={`$${stats.totalPL.toFixed(2)}`}
                subValue="All time"
                icon={<DollarSign className="w-5 h-5" />}
                trend={stats.totalPL >= 0 ? "up" : "down"}
                delay={0.2}
              />
              <StatCard
                title="Avg R-Multiple"
                value={`${stats.avgRMultiple}R`}
                subValue="Risk-reward ratio"
                icon={<TrendingUp className="w-5 h-5" />}
                trend="neutral"
                delay={0.3}
              />
              <StatCard
                title="Max Drawdown"
                value={`${stats.maxDrawdown}%`}
                subValue="Peak to trough"
                icon={<TrendingDown className="w-5 h-5" />}
                trend="down"
                delay={0.4}
              />
            </div>

            {/* EQUITY CURVE */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              <GlassCard className="p-6">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-lg font-light text-white flex items-center gap-2">
                    <BarChart2 className="w-4 h-4 text-cyan-400" /> Equity Curve
                  </h3>
                </div>
                <div className="h-[100px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={equityData}>
                      <defs>
                        <linearGradient id="colorBalance" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.3} />
                          <stop offset="95%" stopColor="#06b6d4" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" vertical={false} />
                      <XAxis
                        dataKey="date"
                        stroke="#475569"
                        fontSize={12}
                        tickLine={false}
                        axisLine={false}
                        minTickGap={30}
                      />
                      <YAxis
                        stroke="#475569"
                        fontSize={12}
                        tickLine={false}
                        axisLine={false}
                        tickFormatter={(value) => `$${value}`}
                      />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "#020617",
                          borderColor: "rgba(148,163,184,0.3)",
                          borderRadius: 8,
                        }}
                        itemStyle={{ color: "#e5e7eb" }}
                      />
                      <Area
                        type="monotone"
                        dataKey="balance"
                        stroke="#06b6d4"
                        strokeWidth={2}
                        fillOpacity={1}
                        fill="url(#colorBalance)"
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </GlassCard>
            </motion.div>

            {/* BOTTOM GRID */}
            <div className="grid lg:grid-cols-2 gap-8">
               {/* Journal Insights */}
               <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.6 }}
               >
                 <GlassCard className="p-6 h-full">
                    <h3 className="text-lg font-light text-white mb-1 flex items-center gap-2">
                        <Zap className="w-4 h-4 text-amber-400" /> Journal Insights
                    </h3>
                    <p className="text-sm text-slate-400 mb-6">Performance highlights.</p>
                    
                    <div className="space-y-3">
                        {journalInsights.map((insight, idx) => (
                             <InsightRow 
                                key={idx}
                                label={insight.title}
                                sub={insight.asset}
                                value={String(insight.value)}
                                colorClass={insight.type === 'positive' ? 'text-emerald-400' : insight.type === 'negative' ? 'text-rose-400' : 'text-white'}
                             />
                        ))}
                    </div>
                 </GlassCard>
               </motion.div>

               {/* AI Coach */}
               <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.7 }}
               >
                 <GlassCard className="p-6 h-full border-indigo-500/20 bg-indigo-900/10">
                    <h3 className="text-lg font-light text-white mb-1 flex items-center gap-2">
                        <Brain className="w-4 h-4 text-indigo-400" /> AI Coach
                    </h3>
                    <p className="text-sm text-slate-400 mb-6">Active strategy optimization.</p>
                    
                    <div className="space-y-3">
                        {aiInsights.map((insight, idx) => (
                            <AICoachMessage 
                                key={idx}
                                type={insight.type}
                                title={insight.title}
                                message={insight.message}
                            />
                        ))}
                    </div>
                 </GlassCard>
               </motion.div>
            </div>
         </div>
      )}

      {activeTab === 'settings' && (
         <div className="grid lg:grid-cols-2 gap-8">
            <GlassCard className="p-6">
                <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 rounded-xl bg-indigo-500/10 flex items-center justify-center">
                        <User className="w-5 h-5 text-indigo-400" />
                    </div>
                    <h3 className="text-xl font-light text-white">Account Information</h3>
                </div>
                <div className="space-y-5">
                    <div>
                        <label className="text-sm font-bold text-slate-500">Name</label>
                        <p className="text-white text-lg">{user.name}</p>
                    </div>
                    <div>
                        <label className="text-sm font-bold text-slate-500">Plan</label>
                        <div className="flex items-center gap-2 mt-1">
                            <Award className="w-5 h-5 text-amber-400" />
                            <span className="text-white capitalize">{user.plan}</span>
                        </div>
                    </div>
                </div>
            </GlassCard>

            <GlassCard className="p-6">
                <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 rounded-xl bg-cyan-500/10 flex items-center justify-center">
                        <Settings className="w-5 h-5 text-cyan-400" />
                    </div>
                    <h3 className="text-xl font-light text-white">Preferences</h3>
                </div>
                
                <div className="space-y-4">
                    <div>
                        <label className="text-sm text-slate-400 mb-1 block">Initial Equity ($)</label>
                        <input 
                           type="number" 
                           value={settingsForm.equity}
                           onChange={(e) => setSettingsForm({...settingsForm, equity: e.target.value})}
                           className="w-full bg-black/20 border border-white/10 rounded-lg px-4 py-2 text-white outline-none focus:border-cyan-500"
                        />
                    </div>
                    <div>
                        <label className="text-sm text-slate-400 mb-1 block">Max Risk per Trade (%)</label>
                        <input 
                           type="number" 
                           value={settingsForm.risk}
                           onChange={(e) => setSettingsForm({...settingsForm, risk: e.target.value})}
                           className="w-full bg-black/20 border border-white/10 rounded-lg px-4 py-2 text-white outline-none focus:border-cyan-500"
                        />
                    </div>
                    <Button variant="primary" className="w-full mt-4">Save Changes</Button>
                </div>
            </GlassCard>
         </div>
      )}
    </div>
  );
};
