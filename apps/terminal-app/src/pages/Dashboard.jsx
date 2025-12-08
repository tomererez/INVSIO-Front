import React, { useState, useEffect, useMemo } from "react";
import { api } from "@/api/client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { createPageUrl } from "../utils";
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  Target,
  Activity,
  Calendar,
  Plus,
  BookOpen,
  Brain,
  Calculator,
  BarChart3,
  Settings,
  Award,
  CheckCircle2,
  Crown,
  User,
  Sparkles,
  Lock,
  Clock,
  LogIn,
  UserPlus,
  LayoutDashboard,
  Bitcoin,
  Gauge
} from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import MarketBar from "../components/dashboard/MarketBar";
import EmptyState from "../components/dashboard/EmptyState";

export default function Dashboard() {
  const [theme, setTheme] = useState('dark');
  const queryClient = useQueryClient();

  useEffect(() => {
    const currentTheme = document.documentElement.getAttribute('data-theme') || 'dark';
    setTheme(currentTheme);

    const observer = new MutationObserver(() => {
      const newTheme = document.documentElement.getAttribute('data-theme') || 'dark';
      setTheme(newTheme);
    });

    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
    return () => observer.disconnect();
  }, []);

  const isDark = theme === 'dark';

  const { data: user, isLoading: userLoading } = useQuery({
    queryKey: ['currentUser'],
    queryFn: async () => {
      const isAuth = await api.auth.isAuthenticated();
      if (!isAuth) return null;
      return await api.auth.me();
    },
    retry: false,
  });

  const { data: settings } = useQuery({
    queryKey: ['settings'],
    queryFn: () => api.entities.Settings.list(),
    enabled: !!user,
  });

  const { data: trades = [] } = useQuery({
    queryKey: ['trades'],
    queryFn: () => api.entities.Trade.list('-created_date', 1000),
    initialData: [],
    enabled: !!user,
  });

  const [formData, setFormData] = useState({
    initial_equity: '',
    taker_fee_percent: '0.055',
    maker_fee_percent: '0.02'
  });

  const [preferences, setPreferences] = useState({
    max_risk_percent: '2',
    default_leverage: '3',
    trading_style: 'conservative',
    theme: theme
  });

  const [saveSuccess, setSaveSuccess] = useState(false);

  useEffect(() => {
    if (settings && settings.length > 0) {
      const currentSettings = settings[0];
      setFormData({
        initial_equity: currentSettings.initial_equity?.toString() || '',
        taker_fee_percent: currentSettings.taker_fee_percent?.toString() || '0.055',
        maker_fee_percent: currentSettings.maker_fee_percent?.toString() || '0.02'
      });
    }
  }, [settings]);

  useEffect(() => {
    if (user) {
      setPreferences({
        max_risk_percent: user.max_risk_percent?.toString() || '2',
        default_leverage: user.default_leverage?.toString() || '3',
        trading_style: user.trading_style || 'conservative',
        theme: user.theme || theme
      });
    }
  }, [user, theme]);

  const createSettingsMutation = useMutation({
    mutationFn: (data) => api.entities.Settings.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['settings'] });
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    },
  });

  const updateSettingsMutation = useMutation({
    mutationFn: ({ id, data }) => api.entities.Settings.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['settings'] });
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    },
  });

  const updateUserMutation = useMutation({
    mutationFn: (data) => api.auth.updateMe(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['currentUser'] });
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    },
  });

  const handleSaveSettings = async () => {
    const dataToSave = {
      initial_equity: parseFloat(formData.initial_equity),
      taker_fee_percent: parseFloat(formData.taker_fee_percent),
      maker_fee_percent: parseFloat(formData.maker_fee_percent)
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
      theme: preferences.theme
    };
    updateUserMutation.mutate(dataToSave);
  };

  const closedTrades = trades.filter(t => t.status === 'closed' && t.pnl != null);

  const currentEquity = useMemo(() => {
    const initialEquity = settings?.[0]?.initial_equity || 0;
    const totalPnL = closedTrades.reduce((sum, trade) => sum + (trade.pnl || 0), 0);
    return initialEquity + totalPnL;
  }, [settings, closedTrades]);

  const last30DaysTrades = closedTrades.filter(t => {
    const exitDate = new Date(t.exit_time);
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    return exitDate >= thirtyDaysAgo;
  });

  const last30DaysPnL = last30DaysTrades.reduce((sum, t) => sum + (t.pnl || 0), 0);

  const winningTrades = closedTrades.filter(t => t.pnl > 0);
  const losingTrades = closedTrades.filter(t => t.pnl < 0);
  const winRate = closedTrades.length > 0 ? (winningTrades.length / closedTrades.length * 100) : 0;

  const avgRMultiple = closedTrades.length > 0
    ? closedTrades.reduce((sum, t) => sum + (t.pnl_percentage || 0), 0) / closedTrades.length
    : 0;

  let runningEquity = settings?.[0]?.initial_equity || 0;
  let peak = runningEquity;
  let maxDrawdown = 0;

  closedTrades.forEach(trade => {
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
    const sortedTrades = [...closedTrades].sort((a, b) =>
      new Date(a.exit_time) - new Date(b.exit_time)
    );

    return sortedTrades.slice(-30).map((trade) => {
      equity += trade.pnl || 0;
      return {
        name: new Date(trade.exit_time).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        equity: equity
      };
    });
  }, [closedTrades, settings]);

  const bestRMultiple = closedTrades.length >= 5
    ? closedTrades.reduce((best, t) => ((t.pnl_percentage || 0) > (best.pnl_percentage || 0) ? t : best), closedTrades[0])
    : null;

  const worstRMultiple = closedTrades.length >= 5
    ? closedTrades.reduce((worst, t) => ((t.pnl_percentage || 0) < (worst.pnl_percentage || 0) ? t : worst), closedTrades[0])
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

  const currentDate = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  if (userLoading) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${isDark ? 'bg-slate-950' : 'bg-gray-50'}`}>
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className={`${isDark ? 'text-slate-400' : 'text-gray-600'}`}>Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className={`min-h-screen ${isDark ? 'bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950' : 'bg-gradient-to-br from-gray-50 via-white to-gray-100'} flex items-center justify-center p-4 relative z-10`}>
        <motion.div
          initial={{ opacity: 1, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="max-w-2xl w-full"
        >
          <Card className={`${isDark ? 'bg-slate-900/50 border-slate-800' : 'bg-white border-gray-200'} shadow-2xl`}>
            <CardContent className="p-12 text-center">
              <div className="w-24 h-24 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-lg shadow-emerald-500/30">
                <Lock className="w-12 h-12 text-white" />
              </div>

              <h1 className="text-4xl font-bold mb-4 bg-gradient-to-l from-emerald-400 via-teal-400 to-cyan-400 bg-clip-text text-transparent">
                You're Not Logged In
              </h1>

              <p className={`text-lg mb-8 ${isDark ? 'text-slate-300' : 'text-gray-700'}`}>
                Login or create a free account to access your trading dashboard and unlock professional analytics
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button
                  size="lg"
                  onClick={() => api.auth.redirectToLogin(window.location.pathname)}
                  className="bg-gradient-to-r from-emerald-600 to-teal-600 text-white hover:from-emerald-700 hover:to-teal-700 shadow-lg text-lg px-8 py-6"
                >
                  <LogIn className="w-5 h-5 mr-2" />
                  Login
                </Button>

                <Button
                  size="lg"
                  onClick={() => api.auth.redirectToLogin(window.location.pathname)}
                  variant="outline"
                  className={`${isDark ? 'border-slate-700 hover:bg-slate-800' : 'border-gray-300 hover:bg-gray-50'} text-lg px-8 py-6`}
                >
                  <UserPlus className="w-5 h-5 mr-2" />
                  Create Account
                </Button>
              </div>

              <div className={`mt-12 p-6 rounded-xl ${isDark ? 'bg-emerald-500/10 border border-emerald-500/20' : 'bg-emerald-50 border border-emerald-200'}`}>
                <h3 className={`text-lg font-bold mb-3 ${isDark ? 'text-emerald-300' : 'text-emerald-700'}`}>
                  What You'll Get:
                </h3>
                <ul className={`space-y-2 text-left max-w-md mx-auto ${isDark ? 'text-slate-300' : 'text-gray-700'}`}>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                    Professional trading journal with unlimited trades
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                    Advanced position size calculator with R-multiples
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                    AI-powered market analysis and insights
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                    Real-time performance tracking and analytics
                  </li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    );
  }

  const hasTrades = closedTrades.length > 0;
  const hasEnoughForInsights = closedTrades.length >= 10;
  const hasEnoughForJournalHighlights = closedTrades.length >= 5;

  return (
    <div className={`min-h-screen ${isDark ? 'bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950' : 'bg-gradient-to-br from-gray-50 via-white to-gray-100'} relative z-10`}>
      <div className={`border-b ${isDark ? 'border-slate-800/50 bg-slate-900/80' : 'border-gray-200 bg-white/80'} backdrop-blur-lg`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            {/* Header Section */}
            <div className="flex items-center gap-3 mb-6">
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${isDark ? 'bg-gradient-to-br from-emerald-500/20 to-teal-500/20' : 'bg-gradient-to-br from-emerald-100 to-teal-100'
                }`}>
                <LayoutDashboard className={`w-6 h-6 ${isDark ? 'text-emerald-400' : 'text-emerald-600'}`} />
              </div>
              <div>
                <h1 className={`text-3xl lg:text-4xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                  Welcome back, {user?.full_name?.split(' ')[0] || 'Trader'}
                </h1>
                <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-gray-600'}`}>
                  {currentDate}
                </p>
              </div>
            </div>

            {/* Market Widgets Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <MarketBar isDark={isDark} />
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-wrap gap-3">
              <Link to={createPageUrl("RiskCalculator")}>
                <Button
                  size="lg"
                  className="bg-gradient-to-r from-emerald-600 to-teal-600 text-white hover:from-emerald-700 hover:to-teal-700 shadow-lg hover:shadow-xl hover:scale-[1.02] transition-all duration-200 h-12"
                >
                  <Calculator className="w-4 h-4 mr-2" />
                  New Position
                </Button>
              </Link>
              <Link to={createPageUrl("TradingJournal")}>
                <Button
                  size="lg"
                  className={`h-12 ${isDark
                    ? 'bg-slate-800 border-slate-700 hover:bg-slate-700 text-white'
                    : 'bg-white border-gray-300 hover:bg-gray-50 text-gray-900'
                    } border shadow-md hover:shadow-lg hover:scale-[1.02] transition-all duration-200`}
                >
                  <BookOpen className="w-4 h-4 mr-2" />
                  Add Trade
                </Button>
              </Link>
              <Link to={createPageUrl("CryptoAnalyzer")}>
                <Button
                  size="lg"
                  className={`h-12 ${isDark
                    ? 'bg-slate-800 border-slate-700 hover:bg-slate-700 text-white'
                    : 'bg-white border-gray-300 hover:bg-gray-50 text-gray-900'
                    } border shadow-md hover:shadow-lg hover:scale-[1.02] transition-all duration-200`}
                >
                  <Brain className="w-4 h-4 mr-2" />
                  Launch AI Coach
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
        <Tabs defaultValue="overview" className="w-full">
          <TabsList className={`mb-8 ${isDark ? 'bg-slate-900 border border-slate-800' : 'bg-white border border-gray-200'}`}>
            <TabsTrigger value="overview" className="text-base px-6">Dashboard</TabsTrigger>
            <TabsTrigger value="settings" className="text-base px-6">Settings</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-8">
            <div className="overflow-x-auto -mx-4 px-4 pb-2">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 min-w-[800px] lg:min-w-0">
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
                  <Card className={`${isDark
                    ? 'bg-slate-900/50 border border-slate-800/60 hover:border-emerald-500/40'
                    : 'bg-white border border-gray-200 hover:border-emerald-300'
                    } rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 h-full`}>
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between mb-4">
                        <div className={`w-11 h-11 rounded-xl flex items-center justify-center ${isDark ? 'bg-emerald-500/15' : 'bg-emerald-100'
                          }`}>
                          <Target className="w-5 h-5 text-emerald-400" />
                        </div>
                        <span className={`text-xs font-bold uppercase tracking-wider ${isDark ? 'text-slate-500' : 'text-gray-500'}`}>Win Rate</span>
                      </div>
                      {hasTrades ? (
                        <div>
                          <div className={`text-4xl font-bold mb-1 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                            {winRate.toFixed(1)}%
                          </div>
                          <p className={`text-xs ${isDark ? 'text-slate-500' : 'text-gray-500'}`}>
                            {winningTrades.length}W / {losingTrades.length}L
                          </p>
                        </div>
                      ) : (
                        <div className={`text-sm leading-relaxed ${isDark ? 'text-slate-500' : 'text-gray-500'}`}>
                          Add your first trade to unlock insights
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </motion.div>

                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
                  <Card className={`${isDark
                    ? 'bg-slate-900/50 border border-slate-800/60 hover:border-blue-500/40'
                    : 'bg-white border border-gray-200 hover:border-blue-300'
                    } rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 h-full`}>
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between mb-4">
                        <div className={`w-11 h-11 rounded-xl flex items-center justify-center ${isDark ? 'bg-blue-500/15' : 'bg-blue-100'
                          }`}>
                          <DollarSign className="w-5 h-5 text-blue-400" />
                        </div>
                        <span className={`text-xs font-bold uppercase tracking-wider ${isDark ? 'text-slate-500' : 'text-gray-500'}`}>P/L (30d)</span>
                      </div>
                      {hasTrades ? (
                        <div>
                          <div className={`text-4xl font-bold mb-1 ${last30DaysPnL >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                            ${Math.abs(last30DaysPnL).toFixed(2)}
                          </div>
                          <p className={`text-xs ${last30DaysPnL >= 0 ? 'text-emerald-500' : 'text-red-500'}`}>
                            {last30DaysPnL >= 0 ? '▲' : '▼'} Last 30 days
                          </p>
                        </div>
                      ) : (
                        <div className={`text-sm leading-relaxed ${isDark ? 'text-slate-500' : 'text-gray-500'}`}>
                          Add your first trade to unlock insights
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </motion.div>

                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
                  <Card className={`${isDark
                    ? 'bg-slate-900/50 border border-slate-800/60 hover:border-purple-500/40'
                    : 'bg-white border border-gray-200 hover:border-purple-300'
                    } rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 h-full`}>
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between mb-4">
                        <div className={`w-11 h-11 rounded-xl flex items-center justify-center ${isDark ? 'bg-purple-500/15' : 'bg-purple-100'
                          }`}>
                          <Activity className="w-5 h-5 text-purple-400" />
                        </div>
                        <span className={`text-xs font-bold uppercase tracking-wider ${isDark ? 'text-slate-500' : 'text-gray-500'}`}>Avg R-Multiple</span>
                      </div>
                      {hasTrades ? (
                        <div>
                          <div className={`text-4xl font-bold mb-1 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                            {avgRMultiple.toFixed(2)}R
                          </div>
                          <p className={`text-xs ${isDark ? 'text-slate-500' : 'text-gray-500'}`}>
                            Risk-reward ratio
                          </p>
                        </div>
                      ) : (
                        <div className={`text-sm leading-relaxed ${isDark ? 'text-slate-500' : 'text-gray-500'}`}>
                          Add your first trade to unlock insights
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </motion.div>

                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
                  <Card className={`${isDark
                    ? 'bg-slate-900/50 border border-slate-800/60 hover:border-red-500/40'
                    : 'bg-white border border-gray-200 hover:border-red-300'
                    } rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 h-full`}>
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between mb-4">
                        <div className={`w-11 h-11 rounded-xl flex items-center justify-center ${isDark ? 'bg-red-500/15' : 'bg-red-100'
                          }`}>
                          <TrendingDown className="w-5 h-5 text-red-400" />
                        </div>
                        <span className={`text-xs font-bold uppercase tracking-wider ${isDark ? 'text-slate-500' : 'text-gray-500'}`}>Max Drawdown</span>
                      </div>
                      {hasTrades ? (
                        <div>
                          <div className={`text-4xl font-bold mb-1 text-red-400`}>
                            {maxDrawdown.toFixed(1)}%
                          </div>
                          <p className={`text-xs ${isDark ? 'text-slate-500' : 'text-gray-500'}`}>
                            Peak to trough
                          </p>
                        </div>
                      ) : (
                        <div className={`text-sm leading-relaxed ${isDark ? 'text-slate-500' : 'text-gray-500'}`}>
                          Add your first trade to unlock insights
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </motion.div>
              </div>
            </div>

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}>
              <Card className={`${isDark
                ? 'bg-slate-900/50 border border-slate-800/60'
                : 'bg-white border border-gray-200'
                } rounded-2xl shadow-lg`}>
                <CardHeader className="pb-4">
                  <CardTitle className={`flex items-center gap-3 text-xl ${isDark ? 'text-white' : 'text-gray-900'}`}>
                    <div className={`w-11 h-11 rounded-xl flex items-center justify-center ${isDark ? 'bg-emerald-500/15' : 'bg-emerald-100'
                      }`}>
                      <TrendingUp className="w-5 h-5 text-emerald-400" />
                    </div>
                    Equity Curve
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {equityCurveData.length > 0 ? (
                    <ResponsiveContainer width="100%" height={280}>
                      <LineChart data={equityCurveData}>
                        <CartesianGrid strokeDasharray="3 3" stroke={isDark ? '#334155' : '#e5e7eb'} />
                        <XAxis
                          dataKey="name"
                          stroke={isDark ? '#94a3b8' : '#6b7280'}
                          style={{ fontSize: '13px', fontWeight: 500 }}
                        />
                        <YAxis
                          stroke={isDark ? '#94a3b8' : '#6b7280'}
                          style={{ fontSize: '13px', fontWeight: 500 }}
                        />
                        <Tooltip
                          contentStyle={{
                            backgroundColor: isDark ? '#1e293b' : '#ffffff',
                            border: `1px solid ${isDark ? '#334155' : '#e5e7eb'}`,
                            borderRadius: '12px',
                            fontSize: '13px',
                            fontWeight: 500,
                            padding: '12px'
                          }}
                        />
                        <Line
                          type="monotone"
                          dataKey="equity"
                          stroke="#10b981"
                          strokeWidth={3}
                          dot={false}
                          activeDot={{ r: 6, fill: '#10b981' }}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  ) : (
                    <div className="py-12 px-6 text-center">
                      <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-5 ${isDark ? 'bg-slate-800/50' : 'bg-gray-100'
                        }`}>
                        <BarChart3 className={`w-8 h-8 ${isDark ? 'text-slate-600' : 'text-gray-400'}`} />
                      </div>

                      <div className={`w-full h-24 rounded-xl mb-5 relative overflow-hidden ${isDark ? 'bg-slate-800/30' : 'bg-gray-100'
                        }`}>
                        <svg className="w-full h-full" viewBox="0 0 400 100" preserveAspectRatio="none">
                          <polyline
                            points="0,80 50,75 100,60 150,65 200,45 250,50 300,30 350,35 400,20"
                            fill="none"
                            stroke={isDark ? '#334155' : '#d1d5db'}
                            strokeWidth="2"
                            opacity="0.3"
                          />
                        </svg>
                      </div>

                      <h3 className={`text-lg font-bold mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                        Your Equity Curve Awaits
                      </h3>
                      <p className={`text-sm mb-5 max-w-md mx-auto ${isDark ? 'text-slate-400' : 'text-gray-600'}`}>
                        Your performance chart will unlock once you record your first trades. Track your growth over time and visualize your trading journey.
                      </p>

                      <Link to={createPageUrl("TradingJournal")}>
                        <Button
                          size="sm"
                          variant="outline"
                          className={`${isDark
                            ? 'border-slate-700 hover:bg-slate-800 text-slate-300'
                            : 'border-gray-300 hover:bg-gray-50 text-gray-700'
                            }`}
                        >
                          <Plus className="w-4 h-4 mr-2" />
                          Add Your First Trade
                        </Button>
                      </Link>
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>

            <div className="grid lg:grid-cols-2 gap-8">
              <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.6 }}>
                <Card className={`${isDark
                  ? 'bg-slate-900/50 border border-slate-800/60 hover:border-amber-500/40'
                  : 'bg-white border border-gray-200 hover:border-amber-300'
                  } rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 h-full`}>
                  <CardHeader className="pb-4">
                    <CardTitle className={`flex items-center gap-3 text-xl ${isDark ? 'text-white' : 'text-gray-900'}`}>
                      <div className={`w-11 h-11 rounded-xl flex items-center justify-center ${isDark ? 'bg-amber-500/15' : 'bg-amber-100'
                        }`}>
                        <Award className="w-5 h-5 text-amber-400" />
                      </div>
                      Journal Insights
                    </CardTitle>
                    <p className={`text-sm mt-1 ${isDark ? 'text-slate-400' : 'text-gray-600'}`}>
                      Track your best and worst trades
                    </p>
                  </CardHeader>
                  <CardContent>
                    {hasEnoughForJournalHighlights ? (
                      <div className="space-y-4">
                        <div className={`p-5 rounded-xl ${isDark ? 'bg-emerald-500/10 border border-emerald-500/20' : 'bg-emerald-50 border border-emerald-200'}`}>
                          <div className="flex items-center justify-between mb-2">
                            <span className={`text-sm font-bold ${isDark ? 'text-emerald-300' : 'text-emerald-700'}`}>Best R-Multiple</span>
                            <span className="text-2xl font-bold text-emerald-400">
                              {(bestRMultiple?.pnl_percentage || 0).toFixed(2)}R
                            </span>
                          </div>
                          <p className={`text-xs font-medium ${isDark ? 'text-slate-400' : 'text-gray-600'}`}>
                            {bestRMultiple?.symbol}
                          </p>
                        </div>

                        <div className={`p-5 rounded-xl ${isDark ? 'bg-red-500/10 border border-red-500/20' : 'bg-red-50 border border-red-200'}`}>
                          <div className="flex items-center justify-between mb-2">
                            <span className={`text-sm font-bold ${isDark ? 'text-red-300' : 'text-red-700'}`}>Worst R-Multiple</span>
                            <span className="text-2xl font-bold text-red-400">
                              {(worstRMultiple?.pnl_percentage || 0).toFixed(2)}R
                            </span>
                          </div>
                          <p className={`text-xs font-medium ${isDark ? 'text-slate-400' : 'text-gray-600'}`}>
                            {worstRMultiple?.symbol}
                          </p>
                        </div>

                        <div className={`grid grid-cols-2 gap-4`}>
                          <div className={`p-4 rounded-xl ${isDark ? 'bg-slate-800/50' : 'bg-gray-50'}`}>
                            <p className={`text-xs font-bold mb-2 ${isDark ? 'text-slate-400' : 'text-gray-600'}`}>Win/Loss</p>
                            <p className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                              {winningTrades.length}/{losingTrades.length}
                            </p>
                          </div>
                          <div className={`p-4 rounded-xl ${isDark ? 'bg-slate-800/50' : 'bg-gray-50'}`}>
                            <p className={`text-xs font-bold mb-2 ${isDark ? 'text-slate-400' : 'text-gray-600'}`}>Avg Hold Time</p>
                            <p className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                              {avgHoldTime}
                            </p>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <EmptyState
                        icon={Lock}
                        title="Insights Unlock at 5 Trades"
                        description="Your journal insights will activate after your first 5 trades. Keep trading to unlock detailed performance metrics and identify your best strategies."
                        isDark={isDark}
                      />
                    )}
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.7 }}>
                <Card className={`${isDark
                  ? 'bg-slate-900/50 border border-slate-800/60 hover:border-purple-500/40'
                  : 'bg-white border border-gray-200 hover:border-purple-300'
                  } rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 h-full`}>
                  <CardHeader className="pb-4">
                    <CardTitle className={`flex items-center gap-3 text-xl ${isDark ? 'text-white' : 'text-gray-900'}`}>
                      <div className={`w-11 h-11 rounded-xl flex items-center justify-center ${isDark ? 'bg-purple-500/15' : 'bg-purple-100'
                        }`}>
                        <Brain className="w-5 h-5 text-purple-400" />
                      </div>
                      AI Coach
                    </CardTitle>
                    <p className={`text-sm mt-1 ${isDark ? 'text-slate-400' : 'text-gray-600'}`}>
                      Get personalized trading insights
                    </p>
                  </CardHeader>
                  <CardContent>
                    {hasEnoughForInsights ? (
                      <div className="space-y-4">
                        <div className={`p-5 rounded-xl ${isDark ? 'bg-purple-500/10 border border-purple-500/20' : 'bg-purple-50 border border-purple-200'}`}>
                          <p className={`text-sm font-medium leading-relaxed ${isDark ? 'text-purple-200' : 'text-purple-900'}`}>
                            <span className="font-bold">Pattern Detected:</span> You have a {winRate.toFixed(0)}% win rate with an average R-multiple of {avgRMultiple.toFixed(2)}R.
                          </p>
                        </div>

                        <div className={`p-5 rounded-xl ${isDark ? 'bg-blue-500/10 border border-blue-500/20' : 'bg-blue-50 border border-blue-200'}`}>
                          <p className={`text-sm font-medium leading-relaxed ${isDark ? 'text-blue-200' : 'text-blue-900'}`}>
                            <span className="font-bold">Recommendation:</span> {avgRMultiple < 1 ? 'Consider letting winners run longer to improve your R-multiple' : 'Great R-multiple! Keep following your strategy'}
                          </p>
                        </div>

                        {winRate < 45 && (
                          <div className={`p-5 rounded-xl ${isDark ? 'bg-amber-500/10 border border-amber-500/20' : 'bg-amber-50 border border-amber-200'}`}>
                            <p className={`text-sm font-medium leading-relaxed ${isDark ? 'text-amber-200' : 'text-amber-900'}`}>
                              <span className="font-bold">Risk Alert:</span> Your win rate is below 45%. Focus on better trade selection and entry timing.
                            </p>
                          </div>
                        )}
                      </div>
                    ) : (
                      <EmptyState
                        icon={Brain}
                        title="AI Coach Activates at 10 Trades"
                        description="Your AI trading coach will provide personalized insights and recommendations after analyzing your first 10 completed trades. Get ready for professional-level feedback."
                        isDark={isDark}
                      />
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            </div>
          </TabsContent>

          <TabsContent value="settings" className="space-y-8">
            <div className="grid lg:grid-cols-2 gap-8">
              <Card className={`${isDark ? 'bg-slate-900/50 border-slate-800' : 'bg-white border-gray-200'} shadow-xl`}>
                <CardHeader>
                  <CardTitle className={`flex items-center gap-3 text-xl ${isDark ? 'text-white' : 'text-gray-900'}`}>
                    <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center">
                      <User className="w-5 h-5 text-emerald-400" />
                    </div>
                    Account Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-5">
                  <div>
                    <Label className={`text-sm font-bold ${isDark ? 'text-slate-400' : 'text-gray-600'}`}>Email</Label>
                    <p className={`font-medium mt-1 ${isDark ? 'text-white' : 'text-gray-900'}`}>{user?.email}</p>
                  </div>
                  <div>
                    <Label className={`text-sm font-bold ${isDark ? 'text-slate-400' : 'text-gray-600'}`}>Full Name</Label>
                    <p className={`font-medium mt-1 ${isDark ? 'text-white' : 'text-gray-900'}`}>{user?.full_name}</p>
                  </div>
                  <div>
                    <Label className={`text-sm font-bold ${isDark ? 'text-slate-400' : 'text-gray-600'}`}>Current Tier</Label>
                    <div className="flex items-center gap-2 mt-1">
                      {user?.subscription_tier === 'elite' && <Crown className="w-5 h-5 text-amber-400" />}
                      <span className={`font-medium capitalize ${isDark ? 'text-white' : 'text-gray-900'}`}>
                        {user?.subscription_tier || 'Free'}
                      </span>
                    </div>
                  </div>
                  {user?.subscription_start_date && (
                    <div>
                      <Label className={`text-sm font-bold ${isDark ? 'text-slate-400' : 'text-gray-600'}`}>Subscription Age</Label>
                      <p className={`font-medium mt-1 ${isDark ? 'text-white' : 'text-gray-900'}`}>{subscriptionAge} days</p>
                    </div>
                  )}
                  <div>
                    <Label className={`text-sm font-bold ${isDark ? 'text-slate-400' : 'text-gray-600'}`}>Account Age</Label>
                    <p className={`font-medium mt-1 ${isDark ? 'text-white' : 'text-gray-900'}`}>{accountAge} days</p>
                  </div>
                </CardContent>
              </Card>

              <Card className={`${isDark ? 'bg-slate-900/50 border-slate-800' : 'bg-white border-gray-200'} shadow-xl`}>
                <CardHeader>
                  <CardTitle className={`flex items-center gap-3 text-xl ${isDark ? 'text-white' : 'text-gray-900'}`}>
                    <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center">
                      <DollarSign className="w-5 h-5 text-emerald-400" />
                    </div>
                    Portfolio Overview
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-5">
                  <div>
                    <Label className={`text-sm font-bold ${isDark ? 'text-slate-400' : 'text-gray-600'}`}>Initial Equity</Label>
                    <p className={`text-3xl font-bold mt-1 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                      ${(settings?.[0]?.initial_equity || 0).toFixed(2)}
                    </p>
                  </div>
                  <div>
                    <Label className={`text-sm font-bold ${isDark ? 'text-slate-400' : 'text-gray-600'}`}>Current Equity</Label>
                    <p className={`text-3xl font-bold mt-1 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                      ${currentEquity.toFixed(2)}
                    </p>
                  </div>
                  <div>
                    <Label className={`text-sm font-bold ${isDark ? 'text-slate-400' : 'text-gray-600'}`}>Total P/L</Label>
                    <p className={`text-3xl font-bold mt-1 ${currentEquity >= (settings?.[0]?.initial_equity || 0) ? 'text-emerald-400' : 'text-red-400'}`}>
                      ${(currentEquity - (settings?.[0]?.initial_equity || 0)).toFixed(2)}
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card className={`${isDark ? 'bg-slate-900/50 border-slate-800' : 'bg-white border-gray-200'} shadow-xl`}>
              <CardHeader>
                <CardTitle className={`flex items-center gap-3 text-xl ${isDark ? 'text-white' : 'text-gray-900'}`}>
                  <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center">
                    <DollarSign className="w-5 h-5 text-emerald-400" />
                  </div>
                  Portfolio & Fee Settings
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid md:grid-cols-3 gap-6">
                  <div>
                    <Label className={`font-bold ${isDark ? 'text-slate-300' : 'text-gray-700'}`}>Initial Equity ($)</Label>
                    <Input
                      type="number"
                      value={formData.initial_equity}
                      onChange={(e) => setFormData({ ...formData, initial_equity: e.target.value })}
                      className={`mt-2 h-12 ${isDark ? 'bg-slate-800 border-slate-700 text-white' : 'bg-white border-gray-300'}`}
                    />
                  </div>
                  <div>
                    <Label className={`font-bold ${isDark ? 'text-slate-300' : 'text-gray-700'}`}>Taker Fee (%)</Label>
                    <Input
                      type="number"
                      step="0.001"
                      value={formData.taker_fee_percent}
                      onChange={(e) => setFormData({ ...formData, taker_fee_percent: e.target.value })}
                      className={`mt-2 h-12 ${isDark ? 'bg-slate-800 border-slate-700 text-white' : 'bg-white border-gray-300'}`}
                    />
                  </div>
                  <div>
                    <Label className={`font-bold ${isDark ? 'text-slate-300' : 'text-gray-700'}`}>Maker Fee (%)</Label>
                    <Input
                      type="number"
                      step="0.001"
                      value={formData.maker_fee_percent}
                      onChange={(e) => setFormData({ ...formData, maker_fee_percent: e.target.value })}
                      className={`mt-2 h-12 ${isDark ? 'bg-slate-800 border-slate-700 text-white' : 'bg-white border-gray-300'}`}
                    />
                  </div>
                </div>
                <Button
                  onClick={handleSaveSettings}
                  size="lg"
                  className="bg-gradient-to-r from-emerald-600 to-teal-600 text-white hover:from-emerald-700 hover:to-teal-700 shadow-lg"
                >
                  Save Portfolio Settings
                </Button>
              </CardContent>
            </Card>

            <Card className={`${isDark ? 'bg-slate-900/50 border-slate-800' : 'bg-white border-gray-200'} shadow-xl`}>
              <CardHeader>
                <CardTitle className={`flex items-center gap-3 text-xl ${isDark ? 'text-white' : 'text-gray-900'}`}>
                  <div className="w-10 h-10 rounded-xl bg-purple-500/10 flex items-center justify-center">
                    <Settings className="w-5 h-5 text-purple-400" />
                  </div>
                  Trading Preferences
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <Label className={`font-bold ${isDark ? 'text-slate-300' : 'text-gray-700'}`}>Max Risk per Trade (%)</Label>
                    <Input
                      type="number"
                      step="0.1"
                      value={preferences.max_risk_percent}
                      onChange={(e) => setPreferences({ ...preferences, max_risk_percent: e.target.value })}
                      className={`mt-2 h-12 ${isDark ? 'bg-slate-800 border-slate-700 text-white' : 'bg-white border-gray-300'}`}
                    />
                  </div>
                  <div>
                    <Label className={`font-bold ${isDark ? 'text-slate-300' : 'text-gray-700'}`}>Default Leverage</Label>
                    <Input
                      type="number"
                      step="1"
                      value={preferences.default_leverage}
                      onChange={(e) => setPreferences({ ...preferences, default_leverage: e.target.value })}
                      className={`mt-2 h-12 ${isDark ? 'bg-slate-800 border-slate-700 text-white' : 'bg-white border-gray-300'}`}
                    />
                  </div>
                </div>
                <Button
                  onClick={handleSavePreferences}
                  size="lg"
                  className="bg-gradient-to-r from-emerald-600 to-teal-600 text-white hover:from-emerald-700 hover:to-teal-700 shadow-lg"
                >
                  Save Preferences
                </Button>
              </CardContent>
            </Card>

            {saveSuccess && (
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className={`fixed top-24 right-6 p-4 rounded-xl shadow-2xl flex items-center gap-3 z-50 ${isDark ? 'bg-emerald-500/20 border border-emerald-500/30' : 'bg-emerald-50 border border-emerald-300'}`}
              >
                <CheckCircle2 className="w-6 h-6 text-emerald-400" />
                <span className={`font-bold ${isDark ? 'text-emerald-300' : 'text-emerald-700'}`}>Settings saved successfully!</span>
              </motion.div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}