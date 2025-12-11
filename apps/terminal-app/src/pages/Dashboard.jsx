import React, { useState, useEffect, useMemo } from "react";
import { api } from "@/api/client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import { createPageUrl } from "../utils";
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  Target,
  Activity,
  Plus,
  BookOpen,
  Brain,
  Calculator,
  Settings,
  CheckCircle2,
  Crown,
  User,
  Lock,
  LogIn,
  UserPlus,
  ChevronRight,
  AlertTriangle,
  Zap,
  FileText
} from "lucide-react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from "recharts";
import { GlassCard } from "@/components/ui/glass-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import MarketBar from "../components/dashboard/MarketBar";

// --- HELPERS ---
const formatCurrency = (val) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(val);

// --- STAT CARD COMPONENT ---
const StatCard = ({ label, value, sub, icon: Icon, trend, delay = 0 }) => {
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
            <div
              className={`text-[10px] px-2 py-0.5 rounded-full border ${trend === "up"
                ? "text-emerald-400 border-emerald-500/20 bg-emerald-500/10"
                : trend === "down"
                  ? "text-rose-400 border-rose-500/20 bg-rose-500/10"
                  : "text-slate-400 border-slate-500/20 bg-slate-500/10"
                }`}
            >
              {trend === "up" ? "Good" : trend === "down" ? "Concern" : "Neutral"}
            </div>
          )}
        </div>

        <div>
          <div className="text-[11px] font-bold text-slate-500 uppercase tracking-widest mb-1">
            {label}
          </div>
          <div className="text-3xl font-light tracking-tight text-white mb-1">{value}</div>
          <div className="text-xs text-slate-500 font-medium">{sub}</div>
        </div>
      </GlassCard>
    </motion.div>
  );
};

// --- MAIN DASHBOARD ---
// --- CHANGED: USE REAL SUPABASE AUTH ---
import { useAuth } from "../context/AuthContext";

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState("dashboard");
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const { user, loading: userLoading } = useAuth();

  // --- REDIRECT IF NOT LOGGED IN ---
  useEffect(() => {
    if (!userLoading && !user) {
      navigate('/login');
    }
  }, [user, userLoading, navigate]);

  const { data: settings } = useQuery({
    queryKey: ["settings"],
    queryFn: () => api.entities.Settings.list(),
    enabled: !!user,
  });

  const { data: trades = [] } = useQuery({
    queryKey: ["trades"],
    queryFn: () => api.entities.Trade.list("-created_date", 1000),
    initialData: [],
    enabled: !!user,
  });

  const [formData, setFormData] = useState({
    initial_equity: "",
    taker_fee_percent: "0.055",
    maker_fee_percent: "0.02",
  });

  const [preferences, setPreferences] = useState({
    max_risk_percent: "2",
    default_leverage: "3",
    trading_style: "conservative",
  });

  const [saveSuccess, setSaveSuccess] = useState(false);

  useEffect(() => {
    if (settings && settings.length > 0) {
      const currentSettings = settings[0];
      setFormData({
        initial_equity: currentSettings.initial_equity?.toString() || "",
        taker_fee_percent: currentSettings.taker_fee_percent?.toString() || "0.055",
        maker_fee_percent: currentSettings.maker_fee_percent?.toString() || "0.02",
      });
    }
  }, [settings]);

  useEffect(() => {
    if (user) {
      setPreferences({
        max_risk_percent: user.max_risk_percent?.toString() || "2",
        default_leverage: user.default_leverage?.toString() || "3",
        trading_style: user.trading_style || "conservative",
      });
    }
  }, [user]);

  const createSettingsMutation = useMutation({
    mutationFn: (data) => api.entities.Settings.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["settings"] });
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    },
  });

  const updateSettingsMutation = useMutation({
    mutationFn: ({ id, data }) => api.entities.Settings.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["settings"] });
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    },
  });

  const updateUserMutation = useMutation({
    mutationFn: (data) => api.auth.updateMe(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["currentUser"] });
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    },
  });

  const handleSaveSettings = async () => {
    const dataToSave = {
      initial_equity: parseFloat(formData.initial_equity),
      taker_fee_percent: parseFloat(formData.taker_fee_percent),
      maker_fee_percent: parseFloat(formData.maker_fee_percent),
    };

    if (settings && settings.length > 0) {
      updateSettingsMutation.mutate({ id: settings[0].id, data: dataToSave });
    } else {
      createSettingsMutation.mutate(dataToSave);
    }
  };

  const handleSavePreferences = async () => {
    const dataToSave = {
      max_risk_percent: parseFloat(preferences.max_risk_percent),
      default_leverage: parseFloat(preferences.default_leverage),
      trading_style: preferences.trading_style,
    };
    updateUserMutation.mutate(dataToSave);
  };

  // --- CALCULATIONS (PRESERVED) ---
  const closedTrades = trades.filter((t) => t.status === "closed" && t.pnl != null);

  const currentEquity = useMemo(() => {
    const initialEquity = settings?.[0]?.initial_equity || 0;
    const totalPnL = closedTrades.reduce((sum, trade) => sum + (trade.pnl || 0), 0);
    return initialEquity + totalPnL;
  }, [settings, closedTrades]);

  const last30DaysTrades = closedTrades.filter((t) => {
    const exitDate = new Date(t.exit_time);
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    return exitDate >= thirtyDaysAgo;
  });

  const last30DaysPnL = last30DaysTrades.reduce((sum, t) => sum + (t.pnl || 0), 0);

  const winningTrades = closedTrades.filter((t) => t.pnl > 0);
  const losingTrades = closedTrades.filter((t) => t.pnl < 0);
  const winRate = closedTrades.length > 0 ? (winningTrades.length / closedTrades.length) * 100 : 0;

  const avgRMultiple =
    closedTrades.length > 0
      ? closedTrades.reduce((sum, t) => sum + (t.pnl_percentage || 0), 0) / closedTrades.length
      : 0;

  let runningEquity = settings?.[0]?.initial_equity || 0;
  let peak = runningEquity;
  let maxDrawdown = 0;

  closedTrades.forEach((trade) => {
    runningEquity += trade.pnl || 0;
    if (runningEquity > peak) {
      peak = runningEquity;
    }
    const drawdown = ((peak - runningEquity) / peak) * 100;
    if (drawdown > maxDrawdown) {
      maxDrawdown = drawdown;
    }
  });

  const equityCurveData = useMemo(() => {
    if (closedTrades.length === 0) return [];

    let equity = settings?.[0]?.initial_equity || 0;
    const sortedTrades = [...closedTrades].sort(
      (a, b) => new Date(a.exit_time) - new Date(b.exit_time)
    );

    return sortedTrades.slice(-30).map((trade) => {
      equity += trade.pnl || 0;
      return {
        date: new Date(trade.exit_time).toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
        }),
        balance: equity,
      };
    });
  }, [closedTrades, settings]);

  const bestRMultiple =
    closedTrades.length >= 5
      ? closedTrades.reduce(
        (best, t) => ((t.pnl_percentage || 0) > (best.pnl_percentage || 0) ? t : best),
        closedTrades[0]
      )
      : null;

  const worstRMultiple =
    closedTrades.length >= 5
      ? closedTrades.reduce(
        (worst, t) => ((t.pnl_percentage || 0) < (worst.pnl_percentage || 0) ? t : worst),
        closedTrades[0]
      )
      : null;

  const avgHoldTime = useMemo(() => {
    if (closedTrades.length < 5) return null;

    const totalHours = closedTrades.reduce((sum, t) => {
      const entryTime = new Date(t.entry_time);
      const exitTime = new Date(t.exit_time);
      const hours = (exitTime - entryTime) / (1000 * 60 * 60);
      return sum + hours;
    }, 0);

    const avgHours = totalHours / closedTrades.length;
    if (avgHours < 24) return `${avgHours.toFixed(1)}h`;
    return `${(avgHours / 24).toFixed(1)}d`;
  }, [closedTrades]);

  const accountAge = user?.created_date
    ? Math.floor((new Date() - new Date(user.created_date)) / (1000 * 60 * 60 * 24))
    : 0;

  const subscriptionAge = user?.subscription_start_date
    ? Math.floor((new Date() - new Date(user.subscription_start_date)) / (1000 * 60 * 60 * 24))
    : 0;

  const currentDate = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const hasTrades = closedTrades.length > 0;
  const hasEnoughForInsights = closedTrades.length >= 10;
  const hasEnoughForJournalHighlights = closedTrades.length >= 5;

  // --- LOADING STATE ---
  if (userLoading) {
    return (
      <div className="min-h-screen pt-24 flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-indigo-500 rounded-full animate-spin border-t-transparent" />
      </div>
    );
  }

  // --- REDIRECT IF NOT LOGGED IN ---


  // If not logged in, return null (or a spinner) while redirecting
  if (!user) {
    return null;
  }

  // --- MAIN DASHBOARD UI ---
  return (
    <div className="min-h-screen pt-24 pb-12 px-4 md:px-8 max-w-[1600px] mx-auto">
      {/* 1. HEADER SECTION */}
      <div className="relative flex flex-col md:flex-row justify-between items-start md:items-end mb-10 gap-6">
        {/* Gentle Nebula Glow */}
        <div className="absolute -top-20 -left-20 w-[300px] h-[200px] bg-indigo-500/10 rounded-full blur-[100px] pointer-events-none" />
        <div className="absolute -top-10 -left-10 w-[200px] h-[150px] bg-cyan-500/5 rounded-full blur-[80px] pointer-events-none" />
        <div>
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-2"
          >
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-light tracking-tight">
              <span className="text-white">Welcome back, </span>
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-cyan-400 font-normal">{user?.user_metadata?.full_name?.split(" ")[0] || "Trader"}</span>
            </h1>
          </motion.div>

          <div className="flex flex-col sm:flex-row sm:items-center gap-3 text-base text-slate-400 ml-1">
            <span>{currentDate}</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-3">
          <Link to={createPageUrl("RiskCalculator")}>
            <Button className="bg-emerald-600 hover:bg-emerald-500 border-emerald-500/50 shadow-emerald-900/20 text-white">
              <FileText className="w-4 h-4 mr-2" /> New Position
            </Button>
          </Link>
          <Link to={createPageUrl("TradingJournal")}>
            <Button variant="outline" className="border-white/10 hover:bg-white/5 text-white">
              <Plus className="w-4 h-4 mr-2" /> Add Trade
            </Button>
          </Link>
          <Link to={createPageUrl("CryptoAnalyzer")}>
            <Button variant="outline" className="border-white/10 hover:bg-white/5 text-white">
              <Brain className="w-4 h-4 mr-2" /> Launch AI Coach
            </Button>
          </Link>
        </div>
      </div>

      {/* Market Bar */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        <MarketBar isDark={true} />
      </div>

      {/* 2. TABS */}
      <div className="flex items-center gap-1 mb-8 border-b border-white/5 pb-0">
        <button
          onClick={() => setActiveTab("dashboard")}
          className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${activeTab === "dashboard"
            ? "border-indigo-500 text-white"
            : "border-transparent text-slate-500 hover:text-slate-300"
            }`}
        >
          Dashboard
        </button>
        <button
          onClick={() => setActiveTab("settings")}
          className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${activeTab === "settings"
            ? "border-indigo-500 text-white"
            : "border-transparent text-slate-500 hover:text-slate-300"
            }`}
        >
          Settings
        </button>
      </div>

      {activeTab === "dashboard" && (
        <div className="space-y-6">
          {/* 3. KEY STATS ROW */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard
              label="Win Rate"
              value={hasTrades ? `${winRate.toFixed(1)}%` : "—"}
              sub={hasTrades ? `${winningTrades.length}W / ${losingTrades.length}L` : "Add trades to unlock"}
              icon={Target}
              trend={hasTrades ? (winRate > 40 ? "up" : "down") : null}
              delay={0.1}
            />
            <StatCard
              label="P/L (30D)"
              value={hasTrades ? `${last30DaysPnL >= 0 ? "+" : ""}${formatCurrency(last30DaysPnL)}` : "—"}
              sub={hasTrades ? (last30DaysPnL >= 0 ? "▲ Last 30 days" : "▼ Last 30 days") : "Add trades to unlock"}
              icon={DollarSign}
              trend={hasTrades ? (last30DaysPnL >= 0 ? "up" : "down") : null}
              delay={0.2}
            />
            <StatCard
              label="Avg R-Multiple"
              value={hasTrades ? `${avgRMultiple.toFixed(2)}R` : "—"}
              sub="Risk-reward ratio"
              icon={Activity}
              trend={hasTrades ? (avgRMultiple > 1 ? "up" : "down") : null}
              delay={0.3}
            />
            <StatCard
              label="Max Drawdown"
              value={hasTrades ? `${maxDrawdown.toFixed(1)}%` : "—"}
              sub="Peak to trough"
              icon={TrendingDown}
              trend={hasTrades ? (maxDrawdown < 15 ? "up" : "down") : null}
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
              </div>

              {equityCurveData.length > 0 ? (
                <div className="h-[300px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={equityCurveData} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
                      <defs>
                        <linearGradient id="colorBalance" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#10b981" stopOpacity={0.2} />
                          <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                      <XAxis dataKey="date" stroke="#475569" fontSize={10} tickLine={false} axisLine={false} minTickGap={40} />
                      <YAxis stroke="#475569" fontSize={10} tickLine={false} axisLine={false} tickFormatter={(val) => `$${val}`} />
                      <Tooltip
                        contentStyle={{ backgroundColor: "#020617", borderColor: "rgba(255,255,255,0.1)", borderRadius: "8px" }}
                        itemStyle={{ color: "#10b981" }}
                        formatter={(value) => [formatCurrency(value), "Balance"]}
                      />
                      <Area type="monotone" dataKey="balance" stroke="#10b981" strokeWidth={2} fillOpacity={1} fill="url(#colorBalance)" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              ) : (
                <div className="py-16 text-center">
                  <TrendingUp className="w-12 h-12 mx-auto mb-4 text-slate-600" />
                  <h3 className="text-lg font-medium text-white mb-2">Your Equity Curve Awaits</h3>
                  <p className="text-sm text-slate-400 mb-6 max-w-md mx-auto">
                    Your performance chart will unlock once you record your first trades.
                  </p>
                  <Link to={createPageUrl("TradingJournal")}>
                    <Button variant="outline" className="border-white/10 hover:bg-white/5 text-white">
                      <Plus className="w-4 h-4 mr-2" /> Add Your First Trade
                    </Button>
                  </Link>
                </div>
              )}
            </GlassCard>
          </motion.div>

          {/* 5. SPLIT SECTION: JOURNAL INSIGHTS & AI COACH */}
          <div className="grid lg:grid-cols-2 gap-6">
            {/* JOURNAL INSIGHTS */}
            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.6 }} className="flex flex-col h-full">
              <GlassCard className="p-6 h-full flex flex-col">
                <div className="flex items-center gap-2 mb-6">
                  <BookOpen className="w-5 h-5 text-amber-400" />
                  <h3 className="text-lg font-medium text-white">Journal Insights</h3>
                </div>

                <p className="text-xs text-slate-500 mb-4">Track your best and worst trades</p>

                {hasEnoughForJournalHighlights ? (
                  <div className="space-y-4 flex-1">
                    <div className="p-4 rounded-xl bg-emerald-950/20 border border-emerald-500/20 flex justify-between items-center">
                      <div>
                        <div className="text-xs font-bold text-emerald-400 uppercase tracking-wider mb-1">Best R-Multiple</div>
                        <div className="text-xs text-emerald-200/50">{bestRMultiple?.symbol}</div>
                      </div>
                      <div className="text-2xl font-mono text-emerald-400 font-bold">
                        {(bestRMultiple?.pnl_percentage || 0).toFixed(2)}R
                      </div>
                    </div>

                    <div className="p-4 rounded-xl bg-rose-950/20 border border-rose-500/20 flex justify-between items-center">
                      <div>
                        <div className="text-xs font-bold text-rose-400 uppercase tracking-wider mb-1">Worst R-Multiple</div>
                        <div className="text-xs text-rose-200/50">{worstRMultiple?.symbol}</div>
                      </div>
                      <div className="text-2xl font-mono text-rose-400 font-bold">
                        {(worstRMultiple?.pnl_percentage || 0).toFixed(2)}R
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 mt-6 pt-6 border-t border-white/5">
                      <div className="bg-white/5 rounded-lg p-3">
                        <div className="text-[10px] text-slate-500 uppercase font-bold mb-1">Win/Loss</div>
                        <div className="text-lg font-mono text-white">
                          {winningTrades.length}/{losingTrades.length}
                        </div>
                      </div>
                      <div className="bg-white/5 rounded-lg p-3">
                        <div className="text-[10px] text-slate-500 uppercase font-bold mb-1">Avg Hold Time</div>
                        <div className="text-lg font-mono text-white">{avgHoldTime || "—"}</div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="flex-1 flex flex-col items-center justify-center text-center py-8">
                    <Lock className="w-10 h-10 text-slate-600 mb-4" />
                    <h4 className="text-white font-medium mb-2">Insights Unlock at 5 Trades</h4>
                    <p className="text-sm text-slate-500">Keep trading to unlock detailed performance metrics</p>
                  </div>
                )}
              </GlassCard>
            </motion.div>

            {/* AI COACH */}
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.7 }} className="flex flex-col h-full">
              <GlassCard className="p-6 h-full flex flex-col border-indigo-500/20 bg-indigo-950/5">
                <div className="flex items-center gap-2 mb-6">
                  <div className="p-1.5 rounded bg-indigo-500/20 text-indigo-400">
                    <Brain className="w-5 h-5" />
                  </div>
                  <h3 className="text-lg font-medium text-white">AI Coach</h3>
                </div>

                <p className="text-xs text-slate-500 mb-4">Get personalized trading insights</p>

                {hasEnoughForInsights ? (
                  <div className="space-y-3 flex-1">
                    <div className="p-4 rounded-xl bg-indigo-500/10 border border-indigo-500/20">
                      <div className="flex items-center gap-2 mb-2">
                        <Activity className="w-3.5 h-3.5 text-indigo-400" />
                        <span className="text-xs font-bold uppercase tracking-wide text-indigo-300">Pattern Detected</span>
                      </div>
                      <p className="text-xs text-slate-300 leading-relaxed">
                        You have a {winRate.toFixed(0)}% win rate with an average R-multiple of {avgRMultiple.toFixed(2)}R.
                      </p>
                    </div>

                    <div className="p-4 rounded-xl bg-cyan-500/10 border border-cyan-500/20">
                      <div className="flex items-center gap-2 mb-2">
                        <Zap className="w-3.5 h-3.5 text-cyan-400" />
                        <span className="text-xs font-bold uppercase tracking-wide text-cyan-300">Recommendation</span>
                      </div>
                      <p className="text-xs text-slate-300 leading-relaxed">
                        {avgRMultiple < 1
                          ? "Consider letting winners run longer to improve your R-multiple"
                          : "Great R-multiple! Keep following your strategy"}
                      </p>
                    </div>

                    {winRate < 45 && (
                      <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/20">
                        <div className="flex items-center gap-2 mb-2">
                          <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
                          <span className="text-xs font-bold uppercase tracking-wide text-amber-300">Risk Alert</span>
                        </div>
                        <p className="text-xs text-slate-300 leading-relaxed">
                          Your win rate is below 45%. Focus on better trade selection and entry timing.
                        </p>
                      </div>
                    )}

                    <div className="mt-4 pt-4 border-t border-white/5">
                      <Link to={createPageUrl("CryptoAnalyzer")}>
                        <Button variant="ghost" className="w-full text-indigo-400 hover:text-white hover:bg-indigo-500/10 justify-between group">
                          View Full Analysis <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                        </Button>
                      </Link>
                    </div>
                  </div>
                ) : (
                  <div className="flex-1 flex flex-col items-center justify-center text-center py-8">
                    <Brain className="w-10 h-10 text-slate-600 mb-4" />
                    <h4 className="text-white font-medium mb-2">AI Coach Activates at 10 Trades</h4>
                    <p className="text-sm text-slate-500">Get personalized insights after analyzing your trades</p>
                  </div>
                )}
              </GlassCard>
            </motion.div>
          </div>
        </div>
      )}

      {activeTab === "settings" && (
        <div className="space-y-6">
          <div className="grid lg:grid-cols-2 gap-6">
            {/* Account Information */}
            <GlassCard className="p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center">
                  <User className="w-5 h-5 text-emerald-400" />
                </div>
                <h3 className="text-xl font-medium text-white">Account Information</h3>
              </div>
              <div className="space-y-5">
                <div>
                  <Label className="text-sm font-bold text-slate-400">Email</Label>
                  <p className="font-medium mt-1 text-white">{user?.email}</p>
                </div>
                <div>
                  <Label className="text-sm font-bold text-slate-400">Full Name</Label>
                  <p className="font-medium mt-1 text-white">{user?.user_metadata?.full_name}</p>
                </div>
                <div>
                  <Label className="text-sm font-bold text-slate-400">Current Tier</Label>
                  <div className="flex items-center gap-2 mt-1">
                    {user?.subscription_tier === "elite" && <Crown className="w-5 h-5 text-amber-400" />}
                    <span className="font-medium capitalize text-white">{user?.subscription_tier || "Free"}</span>
                  </div>
                </div>
                <div>
                  <Label className="text-sm font-bold text-slate-400">Account Age</Label>
                  <p className="font-medium mt-1 text-white">{accountAge} days</p>
                </div>
              </div>
            </GlassCard>

            {/* Portfolio Overview */}
            <GlassCard className="p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center">
                  <DollarSign className="w-5 h-5 text-emerald-400" />
                </div>
                <h3 className="text-xl font-medium text-white">Portfolio Overview</h3>
              </div>
              <div className="space-y-5">
                <div>
                  <Label className="text-sm font-bold text-slate-400">Initial Equity</Label>
                  <p className="text-3xl font-bold mt-1 text-white">${(settings?.[0]?.initial_equity || 0).toFixed(2)}</p>
                </div>
                <div>
                  <Label className="text-sm font-bold text-slate-400">Current Equity</Label>
                  <p className="text-3xl font-bold mt-1 text-white">${currentEquity.toFixed(2)}</p>
                </div>
                <div>
                  <Label className="text-sm font-bold text-slate-400">Total P/L</Label>
                  <p className={`text-3xl font-bold mt-1 ${currentEquity >= (settings?.[0]?.initial_equity || 0) ? "text-emerald-400" : "text-red-400"}`}>
                    ${(currentEquity - (settings?.[0]?.initial_equity || 0)).toFixed(2)}
                  </p>
                </div>
              </div>
            </GlassCard>
          </div>

          {/* Portfolio & Fee Settings */}
          <GlassCard className="p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center">
                <DollarSign className="w-5 h-5 text-emerald-400" />
              </div>
              <h3 className="text-xl font-medium text-white">Portfolio & Fee Settings</h3>
            </div>
            <div className="grid md:grid-cols-3 gap-6 mb-6">
              <div>
                <Label className="font-bold text-slate-300">Initial Equity ($)</Label>
                <Input
                  type="number"
                  value={formData.initial_equity}
                  onChange={(e) => setFormData({ ...formData, initial_equity: e.target.value })}
                  className="mt-2 h-12 bg-white/5 border-white/10 text-white"
                />
              </div>
              <div>
                <Label className="font-bold text-slate-300">Taker Fee (%)</Label>
                <Input
                  type="number"
                  step="0.001"
                  value={formData.taker_fee_percent}
                  onChange={(e) => setFormData({ ...formData, taker_fee_percent: e.target.value })}
                  className="mt-2 h-12 bg-white/5 border-white/10 text-white"
                />
              </div>
              <div>
                <Label className="font-bold text-slate-300">Maker Fee (%)</Label>
                <Input
                  type="number"
                  step="0.001"
                  value={formData.maker_fee_percent}
                  onChange={(e) => setFormData({ ...formData, maker_fee_percent: e.target.value })}
                  className="mt-2 h-12 bg-white/5 border-white/10 text-white"
                />
              </div>
            </div>
            <Button
              onClick={handleSaveSettings}
              className="bg-gradient-to-r from-emerald-600 to-teal-600 text-white hover:from-emerald-700 hover:to-teal-700 shadow-lg"
            >
              Save Portfolio Settings
            </Button>
          </GlassCard>

          {/* Trading Preferences */}
          <GlassCard className="p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-purple-500/10 flex items-center justify-center">
                <Settings className="w-5 h-5 text-purple-400" />
              </div>
              <h3 className="text-xl font-medium text-white">Trading Preferences</h3>
            </div>
            <div className="grid md:grid-cols-2 gap-6 mb-6">
              <div>
                <Label className="font-bold text-slate-300">Max Risk per Trade (%)</Label>
                <Input
                  type="number"
                  step="0.1"
                  value={preferences.max_risk_percent}
                  onChange={(e) => setPreferences({ ...preferences, max_risk_percent: e.target.value })}
                  className="mt-2 h-12 bg-white/5 border-white/10 text-white"
                />
              </div>
              <div>
                <Label className="font-bold text-slate-300">Default Leverage</Label>
                <Input
                  type="number"
                  step="1"
                  value={preferences.default_leverage}
                  onChange={(e) => setPreferences({ ...preferences, default_leverage: e.target.value })}
                  className="mt-2 h-12 bg-white/5 border-white/10 text-white"
                />
              </div>
            </div>
            <Button
              onClick={handleSavePreferences}
              className="bg-gradient-to-r from-emerald-600 to-teal-600 text-white hover:from-emerald-700 hover:to-teal-700 shadow-lg"
            >
              Save Preferences
            </Button>
          </GlassCard>
        </div>
      )}

      {/* Success Toast */}
      {saveSuccess && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="fixed top-24 right-6 p-4 rounded-xl shadow-2xl flex items-center gap-3 z-50 bg-emerald-500/20 border border-emerald-500/30 backdrop-blur-md"
        >
          <CheckCircle2 className="w-6 h-6 text-emerald-400" />
          <span className="font-bold text-emerald-300">Settings saved successfully!</span>
        </motion.div>
      )}
    </div>
  );
}