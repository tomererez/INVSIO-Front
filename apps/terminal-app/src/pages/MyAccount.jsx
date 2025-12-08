import React, { useState, useEffect, useMemo } from "react";
import { api } from "@/api/client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { motion } from "framer-motion";
import {
  User, Mail, Shield, Wallet, TrendingUp, Percent,
  Settings as SettingsIcon, Sun, Moon, LogOut, DollarSign,
  Target, AlertCircle, CheckCircle2, Calendar, Activity, Lock, Sparkles,
  Crown, Zap
} from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function MyAccount() {
  const queryClient = useQueryClient();
  const [theme, setTheme] = useState('dark');
  const [showSuccess, setShowSuccess] = useState(false);

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

  const { data: user, isLoading: userLoading, error } = useQuery({
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
    queryFn: async () => {
      const allSettings = await api.entities.Settings.list();
      return allSettings.length > 0 ? allSettings[0] : null;
    },
    enabled: !!user,
  });

  const { data: trades = [] } = useQuery({
    queryKey: ['trades'],
    queryFn: () => api.entities.Trade.list('-entry_time'),
    enabled: !!user,
  });

  const [formData, setFormData] = useState({
    initial_equity: '',
    taker_fee_percent: '0.055',
    maker_fee_percent: '0.02',
  });

  const [preferences, setPreferences] = useState({
    default_risk_percent: '1',
    trading_style: 'swing',
    theme_preference: 'dark',
  });

  useEffect(() => {
    if (settings) {
      setFormData({
        initial_equity: settings.initial_equity?.toString() || '',
        taker_fee_percent: settings.taker_fee_percent?.toString() || '0.055',
        maker_fee_percent: settings.maker_fee_percent?.toString() || '0.02',
      });
    }
  }, [settings]);

  useEffect(() => {
    if (user) {
      setPreferences({
        default_risk_percent: user.default_risk_percent?.toString() || '1',
        trading_style: user.trading_style || 'swing',
        theme_preference: user.theme_preference || theme,
      });
    }
  }, [user, theme]);

  useEffect(() => {
    const checkAuth = async () => {
      if (!userLoading && !user) {
        const isAuth = await api.auth.isAuthenticated();
        if (!isAuth) {
          api.auth.redirectToLogin(window.location.pathname);
        }
      }
    };
    checkAuth();
  }, [user, userLoading]);

  const createSettingsMutation = useMutation({
    mutationFn: (data) => api.entities.Settings.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['settings'] });
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
    },
  });

  const updateSettingsMutation = useMutation({
    mutationFn: ({ id, data }) => api.entities.Settings.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['settings'] });
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
    },
  });

  const updateUserMutation = useMutation({
    mutationFn: (data) => api.auth.updateMe(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['currentUser'] });
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
    },
  });

  const handleSettingsSave = (e) => {
    e.preventDefault();
    const data = {
      initial_equity: parseFloat(formData.initial_equity),
      taker_fee_percent: parseFloat(formData.taker_fee_percent),
      maker_fee_percent: parseFloat(formData.maker_fee_percent),
    };

    if (settings) {
      updateSettingsMutation.mutate({ id: settings.id, data });
    } else {
      createSettingsMutation.mutate(data);
    }
  };

  const handlePreferencesSave = (e) => {
    e.preventDefault();
    updateUserMutation.mutate({
      default_risk_percent: parseFloat(preferences.default_risk_percent),
      trading_style: preferences.trading_style,
      theme_preference: preferences.theme_preference,
    });

    if (preferences.theme_preference !== theme) {
      localStorage.setItem('theme', preferences.theme_preference);
      document.documentElement.setAttribute('data-theme', preferences.theme_preference);
      setTheme(preferences.theme_preference);
    }
  };

  const handleLogout = () => {
    api.auth.logout();
  };

  const currentEquity = useMemo(() => {
    if (!settings?.initial_equity) return null;
    const closedTrades = trades.filter(t => t.status === 'closed');
    const totalPnL = closedTrades.reduce((sum, t) => sum + (t.pnl || 0), 0);
    return settings.initial_equity + totalPnL;
  }, [settings, trades]);

  const portfolioStats = useMemo(() => {
    if (!settings?.initial_equity) return null;
    const closedTrades = trades.filter(t => t.status === 'closed');
    const totalPnL = closedTrades.reduce((sum, t) => sum + (t.pnl || 0), 0);
    const roi = ((totalPnL / settings.initial_equity) * 100).toFixed(2);
    return {
      initialEquity: settings.initial_equity,
      currentEquity,
      totalPnL,
      roi,
      closedTrades: closedTrades.length,
    };
  }, [settings, trades, currentEquity]);

  const accountAge = useMemo(() => {
    if (!user?.created_date) return null;
    const created = new Date(user.created_date);
    const now = new Date();
    const diffTime = Math.abs(now - created);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  }, [user]);

  const subscriptionAge = useMemo(() => {
    if (!user?.subscription_start_date) return null;
    const started = new Date(user.subscription_start_date);
    const now = new Date();
    const diffTime = Math.abs(now - started);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  }, [user]);

  if (!user && !userLoading) {
    return (
      <div className={`min-h-screen ${isDark ? 'bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950' : 'bg-gradient-to-br from-gray-50 via-white to-gray-100'} flex items-center justify-center p-4`}>
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="max-w-md w-full"
        >
          <Card className={`${isDark ? 'bg-slate-900/50 border-slate-800' : 'bg-white border-gray-200 shadow-2xl'} backdrop-blur-sm`}>
            <CardContent className="p-8 sm:p-12 text-center">
              <div className="w-20 h-20 bg-gradient-to-r from-purple-500 to-pink-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg shadow-purple-500/30">
                <Lock className="w-10 h-10 text-white" />
              </div>
              <h1 className="text-3xl sm:text-4xl font-bold mb-3 bg-gradient-to-l from-purple-400 via-pink-400 to-purple-400 bg-clip-text text-transparent">
                Authentication Required
              </h1>
              <p className={`text-base font-semibold mb-6 ${isDark ? 'text-slate-300' : 'text-gray-700'}`}>
                Redirecting you to login...
              </p>

              <div className="flex items-center justify-center gap-2 mb-6">
                <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse"></div>
                <div className="w-2 h-2 bg-pink-500 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
                <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></div>
              </div>

              <div className={`mt-8 ${isDark ? 'bg-blue-500/10 border-blue-500/30' : 'bg-blue-50 border-blue-300'} border rounded-lg p-4`}>
                <div className="flex items-start gap-3">
                  <Sparkles className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
                  <div className={`text-sm ${isDark ? 'text-blue-300' : 'text-blue-700'}`}>
                    <p className="font-bold mb-2">What you'll get:</p>
                    <ul className="space-y-1 text-xs font-semibold text-left">
                      <li>✓ Professional trading journal</li>
                      <li>✓ Advanced position calculator</li>
                      <li>✓ AI-powered market analysis</li>
                      <li>✓ Portfolio tracking & insights</li>
                    </ul>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    );
  }

  if (userLoading) {
    return (
      <div className={`min-h-screen ${isDark ? 'bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950' : 'bg-gradient-to-br from-gray-50 via-white to-gray-100'} flex items-center justify-center`}>
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className={`text-lg font-semibold ${isDark ? 'text-slate-300' : 'text-gray-700'}`}>Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen ${isDark ? 'bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950' : 'bg-gradient-to-br from-gray-50 via-white to-gray-100'}`}>
      <div className={`relative overflow-hidden border-b ${isDark ? 'border-slate-800/50 bg-gradient-to-b from-slate-900/50' : 'border-gray-200 bg-gradient-to-b from-white/50'} to-transparent`}>
        <div className="absolute inset-0 bg-grid-pattern opacity-5" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 py-12">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
              <div className="flex items-center gap-4">
                <div className="w-20 h-20 bg-gradient-to-r from-purple-500 to-pink-600 rounded-2xl flex items-center justify-center shadow-lg shadow-purple-500/30">
                  <User className="w-10 h-10 text-white" />
                </div>
                <div>
                  <h1 className="text-4xl font-bold bg-gradient-to-l from-purple-400 via-pink-400 to-purple-400 bg-clip-text text-transparent">
                    {user?.full_name || 'My Account'}
                  </h1>
                  <p className={`text-sm font-semibold flex items-center gap-2 mt-1 ${isDark ? 'text-slate-300' : 'text-gray-700'}`}>
                    <Mail className="w-4 h-4" />
                    {user?.email}
                  </p>

                  <div className="flex items-center gap-2 mt-2">
                    <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold ${user?.subscription_tier === 'elite'
                      ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                      : user?.subscription_tier === 'pro'
                        ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                        : 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                      }`}>
                      {user?.subscription_tier === 'elite' && <Crown className="w-3 h-3" />}
                      {user?.subscription_tier === 'pro' && <Zap className="w-3 h-3" />}
                      {(!user?.subscription_tier || user?.subscription_tier === 'free') && <Shield className="w-3 h-3" />}
                      {user?.subscription_tier?.toUpperCase() || 'FREE'} PLAN
                    </div>
                    {subscriptionAge && (
                      <span className={`text-xs ${isDark ? 'text-slate-400' : 'text-gray-600'}`}>
                        • Subscribed {subscriptionAge} days ago
                      </span>
                    )}
                  </div>

                  {accountAge && (
                    <p className={`text-xs font-semibold flex items-center gap-2 mt-1 ${isDark ? 'text-slate-400' : 'text-gray-600'}`}>
                      <Calendar className="w-3 h-3" />
                      Member for {accountAge} days
                    </p>
                  )}
                </div>
              </div>
              <Button
                onClick={handleLogout}
                variant="outline"
                className={`border ${isDark ? 'bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700' : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'}`}
              >
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </Button>
            </div>
          </motion.div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        {portfolioStats && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
              <Card className={`${isDark ? 'bg-slate-900/50 border-slate-800' : 'bg-white border-gray-200 shadow-lg'}`}>
                <CardContent className="p-6">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-10 h-10 bg-blue-500/20 rounded-lg flex items-center justify-center">
                      <Wallet className="w-5 h-5 text-blue-400" />
                    </div>
                    <p className={`text-sm font-bold ${isDark ? 'text-slate-400' : 'text-gray-600'}`}>Current Portfolio</p>
                  </div>
                  <p className={`text-3xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                    ${portfolioStats.currentEquity.toFixed(2)}
                  </p>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
              <Card className={`${isDark ? 'bg-slate-900/50 border-slate-800' : 'bg-white border-gray-200 shadow-lg'}`}>
                <CardContent className="p-6">
                  <div className="flex items-center gap-3 mb-2">
                    <div className={`w-10 h-10 ${portfolioStats.totalPnL >= 0 ? 'bg-green-500/20' : 'bg-red-500/20'} rounded-lg flex items-center justify-center`}>
                      <TrendingUp className={`w-5 h-5 ${portfolioStats.totalPnL >= 0 ? 'text-green-400' : 'text-red-400'}`} />
                    </div>
                    <p className={`text-sm font-bold ${isDark ? 'text-slate-400' : 'text-gray-600'}`}>Total P&L</p>
                  </div>
                  <p className={`text-3xl font-bold ${portfolioStats.totalPnL >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                    ${portfolioStats.totalPnL.toFixed(2)}
                  </p>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
              <Card className={`${isDark ? 'bg-slate-900/50 border-slate-800' : 'bg-white border-gray-200 shadow-lg'}`}>
                <CardContent className="p-6">
                  <div className="flex items-center gap-3 mb-2">
                    <div className={`w-10 h-10 ${parseFloat(portfolioStats.roi) >= 0 ? 'bg-emerald-500/20' : 'bg-orange-500/20'} rounded-lg flex items-center justify-center`}>
                      <Percent className={`w-5 h-5 ${parseFloat(portfolioStats.roi) >= 0 ? 'text-emerald-400' : 'text-orange-400'}`} />
                    </div>
                    <p className={`text-sm font-bold ${isDark ? 'text-slate-400' : 'text-gray-600'}`}>ROI</p>
                  </div>
                  <p className={`text-3xl font-bold ${parseFloat(portfolioStats.roi) >= 0 ? 'text-emerald-400' : 'text-orange-400'}`}>
                    {portfolioStats.roi}%
                  </p>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
              <Card className={`${isDark ? 'bg-slate-900/50 border-slate-800' : 'bg-white border-gray-200 shadow-lg'}`}>
                <CardContent className="p-6">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-10 h-10 bg-purple-500/20 rounded-lg flex items-center justify-center">
                      <Activity className="w-5 h-5 text-purple-400" />
                    </div>
                    <p className={`text-sm font-bold ${isDark ? 'text-slate-400' : 'text-gray-600'}`}>Closed Trades</p>
                  </div>
                  <p className={`text-3xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                    {portfolioStats.closedTrades}
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        )}

        <div className="grid lg:grid-cols-2 gap-6">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Card className={`${isDark ? 'bg-slate-900/50 border-slate-800' : 'bg-white border-gray-200 shadow-lg'} shadow-2xl`}>
              <CardHeader className={`border-b ${isDark ? 'border-slate-800' : 'border-gray-200'}`}>
                <CardTitle className={`text-xl font-bold flex items-center gap-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                  <Wallet className="w-5 h-5 text-green-500" />
                  Portfolio & Fee Settings
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <form onSubmit={handleSettingsSave} className="space-y-6">
                  <div>
                    <label className={`block font-bold mb-2 flex items-center gap-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                      <DollarSign className="w-4 h-4 text-green-500" />
                      Initial Portfolio Size ($)
                    </label>
                    <Input
                      type="number"
                      step="0.01"
                      required
                      value={formData.initial_equity}
                      onChange={(e) => setFormData({ ...formData, initial_equity: e.target.value })}
                      placeholder="10000"
                      className={`h-12 text-base font-semibold ${isDark ? 'bg-slate-800 border-slate-700 text-white placeholder:text-slate-500' : 'bg-white border-gray-300 text-gray-900 placeholder:text-gray-400'}`}
                    />
                  </div>

                  <div>
                    <label className={`block font-bold mb-2 flex items-center gap-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                      <Percent className="w-4 h-4 text-orange-500" />
                      Taker Fee (%)
                    </label>
                    <Input
                      type="number"
                      step="0.001"
                      required
                      value={formData.taker_fee_percent}
                      onChange={(e) => setFormData({ ...formData, taker_fee_percent: e.target.value })}
                      placeholder="0.055"
                      className={`h-12 text-base font-semibold ${isDark ? 'bg-slate-800 border-slate-700 text-white placeholder:text-slate-500' : 'bg-white border-gray-300 text-gray-900 placeholder:text-gray-400'}`}
                    />
                  </div>

                  <div>
                    <label className={`block font-bold mb-2 flex items-center gap-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                      <Percent className="w-4 h-4 text-blue-500" />
                      Maker Fee (%)
                    </label>
                    <Input
                      type="number"
                      step="0.001"
                      required
                      value={formData.maker_fee_percent}
                      onChange={(e) => setFormData({ ...formData, maker_fee_percent: e.target.value })}
                      placeholder="0.02"
                      className={`h-12 text-base font-semibold ${isDark ? 'bg-slate-800 border-slate-700 text-white placeholder:text-slate-500' : 'bg-white border-gray-300 text-gray-900 placeholder:text-gray-400'}`}
                    />
                  </div>

                  <Button
                    type="submit"
                    disabled={createSettingsMutation.isPending || updateSettingsMutation.isPending}
                    className="w-full h-12 text-lg font-bold bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 shadow-lg"
                  >
                    Save Portfolio Settings
                  </Button>
                </form>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <Card className={`${isDark ? 'bg-slate-900/50 border-slate-800' : 'bg-white border-gray-200 shadow-lg'} shadow-2xl`}>
              <CardHeader className={`border-b ${isDark ? 'border-slate-800' : 'border-gray-200'}`}>
                <CardTitle className={`text-xl font-bold flex items-center gap-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                  <Target className="w-5 h-5 text-blue-500" />
                  Trading Preferences
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <form onSubmit={handlePreferencesSave} className="space-y-6">
                  <div>
                    <label className={`block font-bold mb-2 flex items-center gap-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                      <Shield className="w-4 h-4 text-red-500" />
                      Default Risk Per Trade (%)
                    </label>
                    <Input
                      type="number"
                      step="0.1"
                      min="0.1"
                      max="10"
                      required
                      value={preferences.default_risk_percent}
                      onChange={(e) => setPreferences({ ...preferences, default_risk_percent: e.target.value })}
                      placeholder="1"
                      className={`h-12 text-base font-semibold ${isDark ? 'bg-slate-800 border-slate-700 text-white placeholder:text-slate-500' : 'bg-white border-gray-300 text-gray-900 placeholder:text-gray-400'}`}
                    />
                    <p className={`text-xs mt-2 font-semibold ${isDark ? 'text-slate-400' : 'text-gray-600'}`}>
                      💡 Recommended: 1-2% for conservative, 2-3% for aggressive
                    </p>
                  </div>

                  <div>
                    <label className={`block font-bold mb-2 flex items-center gap-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                      <TrendingUp className="w-4 h-4 text-purple-500" />
                      Preferred Trading Style
                    </label>
                    <Select value={preferences.trading_style} onValueChange={(value) => setPreferences({ ...preferences, trading_style: value })}>
                      <SelectTrigger className={`h-12 font-semibold ${isDark ? 'bg-slate-800 border-slate-700 text-white' : 'bg-white border-gray-300 text-gray-900'}`}>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className={isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-gray-300'}>
                        <SelectItem value="scalping">Scalping (Minutes)</SelectItem>
                        <SelectItem value="day">Day Trading (Hours)</SelectItem>
                        <SelectItem value="swing">Swing Trading (Days)</SelectItem>
                        <SelectItem value="position">Position Trading (Weeks)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <label className={`block font-bold mb-2 flex items-center gap-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                      {preferences.theme_preference === 'dark' ? <Moon className="w-4 h-4 text-indigo-500" /> : <Sun className="w-4 h-4 text-yellow-500" />}
                      Theme Preference
                    </label>
                    <Select value={preferences.theme_preference} onValueChange={(value) => setPreferences({ ...preferences, theme_preference: value })}>
                      <SelectTrigger className={`h-12 font-semibold ${isDark ? 'bg-slate-800 border-slate-700 text-white' : 'bg-white border-gray-300 text-gray-900'}`}>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className={isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-gray-300'}>
                        <SelectItem value="dark">Dark Mode</SelectItem>
                        <SelectItem value="light">Light Mode</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <Button
                    type="submit"
                    disabled={updateUserMutation.isPending}
                    className="w-full h-12 text-lg font-bold bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 shadow-lg"
                  >
                    Save Preferences
                  </Button>
                </form>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {showSuccess && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className={`mt-6 ${isDark ? 'bg-green-500/10 border-green-500/30' : 'bg-green-50 border-green-300'} border rounded-lg p-4 flex items-center gap-3 max-w-md mx-auto`}
          >
            <CheckCircle2 className="w-6 h-6 text-green-500" />
            <p className={`font-bold text-lg ${isDark ? 'text-green-300' : 'text-green-700'}`}>
              ✓ Settings saved successfully!
            </p>
          </motion.div>
        )}

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mt-8"
        >
          <Card className={`${isDark ? 'bg-gradient-to-br from-blue-900/20 to-cyan-900/20 border-blue-500/30' : 'bg-gradient-to-br from-blue-50 to-cyan-50 border-blue-300'}`}>
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-blue-500/20 rounded-xl flex items-center justify-center flex-shrink-0">
                  <AlertCircle className="w-6 h-6 text-blue-400" />
                </div>
                <div>
                  <h3 className={`text-lg font-bold mb-2 ${isDark ? 'text-blue-300' : 'text-blue-700'}`}>
                    💡 Account Settings Guide
                  </h3>
                  <ul className={`text-sm space-y-2 ${isDark ? 'text-slate-300' : 'text-gray-700'} font-semibold`}>
                    <li><strong>Portfolio Size:</strong> Your starting capital. Current portfolio auto-calculates with P&L.</li>
                    <li><strong>Default Risk:</strong> Used as default in Position Calculator for consistent risk management.</li>
                    <li><strong>Trading Style:</strong> Helps tailor recommendations and defaults to your timeframe.</li>
                    <li><strong>Theme:</strong> Choose your preferred visual mode for the platform.</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}