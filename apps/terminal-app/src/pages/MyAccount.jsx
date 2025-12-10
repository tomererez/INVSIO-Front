import React, { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "@/api/client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { motion, AnimatePresence } from "framer-motion";
import {
  User, Mail, Shield, Wallet, TrendingUp, Percent,
  Settings as SettingsIcon, Sun, Moon, LogOut, DollarSign,
  Target, AlertCircle, CheckCircle2, Calendar, Activity, Lock, Sparkles,
  Crown, Zap, CreditCard, Clock, RotateCw, Check, X, FileText, ChevronRight, Download
} from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useAuth } from "@/context/AuthContext";

// --- MOCK DATA FOR BILLING ---
const INVOICES = [
  { id: 'inv_123', date: 'Dec 01, 2025', amount: 29.00, status: 'Paid', plan: 'Pro Plan' },
  { id: 'inv_124', date: 'Nov 01, 2025', amount: 29.00, status: 'Paid', plan: 'Pro Plan' },
  { id: 'inv_125', date: 'Oct 01, 2025', amount: 29.00, status: 'Paid', plan: 'Pro Plan' },
];

const PlanFeature = ({ children, included = true }) => (
  <div className="flex items-start gap-2 text-sm text-slate-400">
    {included ? (
      <Check className="w-4 h-4 text-emerald-400 mt-0.5 shrink-0" />
    ) : (
      <X className="w-4 h-4 text-slate-600 mt-0.5 shrink-0" />
    )}
    <span className={included ? "text-slate-300" : "text-slate-500"}>{children}</span>
  </div>
);

export default function MyAccount() {
  const queryClient = useQueryClient();
  const [theme, setTheme] = useState('dark');
  const [showSuccess, setShowSuccess] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");
  const [billingPeriod, setBillingPeriod] = useState("monthly");

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

  // Use Supabase auth context instead of the old mocked api.auth
  const { user, loading: userLoading, signOut } = useAuth();

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

  const navigate = useNavigate();

  useEffect(() => {
    if (!userLoading && !user) navigate('/login');
  }, [user, userLoading, navigate]);

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

  if (!user && !userLoading) return null;

  if (userLoading) {
    return (
      <div className="min-h-screen bg-void flex items-center justify-center">
        <div className="w-16 h-16 border-4 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 pb-20">
      {/* HEADER */}
      <div className="relative border-b border-white/5 bg-white/[0.02]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-6">
              <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-indigo-500/20 to-purple-500/20 border border-indigo-500/30 flex items-center justify-center text-3xl font-bold text-indigo-400">
                {user?.user_metadata?.full_name?.charAt(0) || user?.email?.charAt(0)}
              </div>
              <div className="text-center md:text-left">
                <h1 className="text-3xl font-bold text-white mb-2">{user?.user_metadata?.full_name || user?.email}</h1>
                <div className="flex flex-wrap items-center justify-center md:justify-start gap-3">
                  <Badge variant="outline" className="border-indigo-500/30 bg-indigo-500/10 text-indigo-400">
                    {user?.email}
                  </Badge>
                  <Badge variant="outline" className={`border-emerald-500/30 bg-emerald-500/10 text-emerald-400 flex items-center gap-1`}>
                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                    {(user?.subscription_tier || 'Free').toUpperCase()} PLAN
                  </Badge>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        <Tabs defaultValue="overview" className="space-y-8" value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="bg-white/5 border border-white/10 p-1 rounded-xl w-full sm:w-auto h-auto grid grid-cols-2 sm:flex">
            <TabsTrigger value="overview" className="data-[state=active]:bg-indigo-600 data-[state=active]:text-white h-9 px-4 sm:px-6">Overview</TabsTrigger>
            <TabsTrigger value="plans" className="data-[state=active]:bg-indigo-600 data-[state=active]:text-white h-9 px-4 sm:px-6">Plans</TabsTrigger>
            <TabsTrigger value="billing" className="data-[state=active]:bg-indigo-600 data-[state=active]:text-white h-9 px-4 sm:px-6">Billing</TabsTrigger>
            <TabsTrigger value="settings" className="data-[state=active]:bg-indigo-600 data-[state=active]:text-white h-9 px-4 sm:px-6">Settings</TabsTrigger>
          </TabsList>

          {/* OVERVIEW TAB */}
          <TabsContent value="overview" className="space-y-6">
            {portfolioStats && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <Card className="bg-white/5 border-white/10 text-white">
                  <CardContent className="p-6">
                    <p className="text-sm font-medium text-slate-400 mb-2">Current Equity</p>
                    <p className="text-2xl font-bold">${portfolioStats.currentEquity.toFixed(2)}</p>
                  </CardContent>
                </Card>
                <Card className="bg-white/5 border-white/10 text-white">
                  <CardContent className="p-6">
                    <p className="text-sm font-medium text-slate-400 mb-2">Total P&L</p>
                    <p className={`text-2xl font-bold ${portfolioStats.totalPnL >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                      ${portfolioStats.totalPnL.toFixed(2)}
                    </p>
                  </CardContent>
                </Card>
                <Card className="bg-white/5 border-white/10 text-white">
                  <CardContent className="p-6">
                    <p className="text-sm font-medium text-slate-400 mb-2">ROI</p>
                    <p className={`text-2xl font-bold ${parseFloat(portfolioStats.roi) >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                      {portfolioStats.roi}%
                    </p>
                  </CardContent>
                </Card>
                <Card className="bg-white/5 border-white/10 text-white">
                  <CardContent className="p-6">
                    <p className="text-sm font-medium text-slate-400 mb-2">Closed Trades</p>
                    <p className="text-2xl font-bold">{portfolioStats.closedTrades}</p>
                  </CardContent>
                </Card>
              </div>
            )}

            <div className="grid lg:grid-cols-2 gap-6">
              {/* Plan Summary Card */}
              <Card className="bg-gradient-to-br from-indigo-900/20 to-purple-900/20 border-indigo-500/20">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-white">
                    <Crown className="w-5 h-5 text-amber-400" />
                    Current Plan Overview
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex items-center justify-between p-4 rounded-xl bg-white/5 border border-white/5">
                    <div>
                      <p className="font-bold text-lg text-white">{(user?.subscription_tier || 'Free').toUpperCase()} PLAN</p>
                      <p className="text-xs text-slate-400">Renews on Jan 12, 2026</p>
                    </div>
                    <Badge className="bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/20 border-emerald-500/30">Active</Badge>
                  </div>

                  <div className="space-y-4">
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-slate-400">Accounts Linked</span>
                        <span className="text-white font-medium">1 / 3</span>
                      </div>
                      <Progress value={33} className="h-2 bg-white/10" indicatorClassName="bg-indigo-500" />
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-slate-400">Monthly Trades</span>
                        <span className="text-white font-medium">12 / 50</span>
                      </div>
                      <Progress value={24} className="h-2 bg-white/10" indicatorClassName="bg-purple-500" />
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-slate-400">AI Credits</span>
                        <span className="text-white font-medium">850 / 1000</span>
                      </div>
                      <Progress value={85} className="h-2 bg-white/10" indicatorClassName="bg-amber-500" />
                    </div>
                  </div>

                  <div className="flex gap-3 pt-2">
                    <Button onClick={() => setActiveTab("plans")} className="flex-1 bg-white hover:bg-slate-200 text-slate-900 font-bold">
                      Upgrade Plan
                    </Button>
                    <Button onClick={() => setActiveTab("settings")} variant="outline" className="flex-1 border-white/10 hover:bg-white/5 text-white">
                      Edit Profile
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Quick Actions / Guide */}
              <Card className="bg-white/5 border-white/10">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-white">
                    <SettingsIcon className="w-5 h-5 text-slate-400" />
                    Quick Actions
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  {[
                    { label: "Change Password", icon: Lock },
                    { label: "Manage Notifications", icon: Mail },
                    { label: "Export Data", icon: FileText },
                    { label: "Sign Out", icon: LogOut, action: handleLogout, color: "text-red-400" },
                  ].map((item, i) => (
                    <button
                      key={i}
                      onClick={item.action}
                      className="w-full flex items-center justify-between p-4 rounded-xl hover:bg-white/5 transition-colors group text-left"
                    >
                      <div className="flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-white/5 text-slate-400 group-hover:text-white transition-colors">
                          <item.icon className={`w-4 h-4 ${item.color || ""}`} />
                        </div>
                        <span className={`font-medium ${item.color ? "text-red-400" : "text-slate-300 group-hover:text-white"}`}>
                          {item.label}
                        </span>
                      </div>
                      <ChevronRight className="w-4 h-4 text-slate-600 group-hover:text-slate-400" />
                    </button>
                  ))}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* PLANS TAB */}
          <TabsContent value="plans" className="space-y-8">
            <div className="flex flex-col items-center justify-center text-center space-y-4 mb-8">
              <h2 className="text-3xl font-bold text-white">Simple, Transparent Pricing</h2>
              <p className="text-slate-400 max-w-lg">Choose the perfect plan for your trading journey. Change or cancel at any time.</p>

              <div className="flex items-center p-1 bg-white/5 rounded-lg border border-white/10">
                <button
                  onClick={() => setBillingPeriod("monthly")}
                  className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all ${billingPeriod === "monthly" ? "bg-indigo-500 text-white shadow-lg" : "text-slate-400 hover:text-white"}`}
                >
                  Monthly
                </button>
                <button
                  onClick={() => setBillingPeriod("annual")}
                  className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all ${billingPeriod === "annual" ? "bg-indigo-500 text-white shadow-lg" : "text-slate-400 hover:text-white"}`}
                >
                  Yearly <span className="ml-1 text-[10px] text-amber-300 font-bold">-20%</span>
                </button>
              </div>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              {/* Free Plan */}
              <Card className="bg-white/5 border-white/10 hover:border-indigo-500/30 transition-all flex flex-col">
                <CardHeader>
                  <CardTitle className="text-white">Free</CardTitle>
                  <div className="text-3xl font-bold text-white mt-2">$0<span className="text-sm font-normal text-slate-500">/mo</span></div>
                  <CardDescription>Perfect for getting started</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4 flex-1">
                  <PlanFeature>1 Connected Exchange</PlanFeature>
                  <PlanFeature>Basic Trading Journal</PlanFeature>
                  <PlanFeature>Standard Charts</PlanFeature>
                  <PlanFeature included={false}>AI Market Analysis</PlanFeature>
                  <PlanFeature included={false}>Advanced Risk Calculator</PlanFeature>
                </CardContent>
                <CardFooter>
                  <Button variant="outline" className="w-full border-white/10 hover:bg-white/5 text-white">Current Plan</Button>
                </CardFooter>
              </Card>

              {/* Pro Plan */}
              <Card className="bg-gradient-to-b from-indigo-900/20 to-white/5 border-indigo-500 relative flex flex-col transform hover:-translate-y-1 transition-transform duration-300">
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full text-[10px] font-bold text-white uppercase tracking-wide shadow-lg">
                  Most Popular
                </div>
                <CardHeader>
                  <CardTitle className="text-white">Pro</CardTitle>
                  <div className="text-3xl font-bold text-white mt-2">
                    ${billingPeriod === 'monthly' ? '29' : '24'}
                    <span className="text-sm font-normal text-slate-500">/mo</span>
                  </div>
                  <CardDescription>For serious traders</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4 flex-1">
                  <PlanFeature>5 Connected Exchanges</PlanFeature>
                  <PlanFeature>Unlimited Journaling</PlanFeature>
                  <PlanFeature>AI Market Insights</PlanFeature>
                  <PlanFeature>Advanced Risk Calculator</PlanFeature>
                  <PlanFeature>Priority Support</PlanFeature>
                </CardContent>
                <CardFooter>
                  <Button className="w-full bg-indigo-500 hover:bg-indigo-600 text-white font-bold shadow-lg shadow-indigo-500/25">Upgrade to Pro</Button>
                </CardFooter>
              </Card>

              {/* Elite Plan */}
              <Card className="bg-white/5 border-white/10 hover:border-amber-500/30 transition-all flex flex-col">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    Elite <Crown className="w-4 h-4 text-amber-500" />
                  </CardTitle>
                  <div className="text-3xl font-bold text-white mt-2">
                    ${billingPeriod === 'monthly' ? '99' : '79'}
                    <span className="text-sm font-normal text-slate-500">/mo</span>
                  </div>
                  <CardDescription>For professional firms</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4 flex-1">
                  <PlanFeature>Unlimited Exchanges</PlanFeature>
                  <PlanFeature>White-glove Onboarding</PlanFeature>
                  <PlanFeature>Custom AI Models</PlanFeature>
                  <PlanFeature>API Access</PlanFeature>
                  <PlanFeature>Dedicated Account Manager</PlanFeature>
                </CardContent>
                <CardFooter>
                  <Button variant="outline" className="w-full border-white/10 hover:bg-white/5 text-white">Contact Sales</Button>
                </CardFooter>
              </Card>
            </div>
          </TabsContent>

          {/* BILLING TAB */}
          <TabsContent value="billing" className="space-y-6">
            {/* Payment Methods */}
            <Card className="bg-white/5 border-white/10">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <CreditCard className="w-5 h-5 text-slate-400" />
                  Payment Methods
                </CardTitle>
                <CardDescription>Manage how you pay for your subscription</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between p-4 rounded-xl bg-white/5 border border-white/5">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-8 rounded bg-slate-700 flex items-center justify-center">
                      <div className="w-6 h-6 rounded-full bg-red-500/50" />
                    </div>
                    <div>
                      <p className="font-bold text-white text-sm">Valid ending in 08/25</p>
                      <p className="text-xs text-slate-400">Mastercard •••• 4242</p>
                    </div>
                  </div>
                  <Badge variant="secondary" className="bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/10">Default</Badge>
                </div>
                <Button variant="outline" className="w-full border-dashed border-white/20 text-slate-400 hover:bg-white/5 hover:text-white">
                  + Add New Payment Method
                </Button>
              </CardContent>
            </Card>

            {/* Invoice History */}
            <Card className="bg-white/5 border-white/10">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Clock className="w-5 h-5 text-slate-400" />
                  Billing History
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {INVOICES.map((inv) => (
                    <div key={inv.id} className="flex items-center justify-between py-3 border-b border-white/5 last:border-0">
                      <div className="flex items-center gap-4">
                        <div className="p-2 rounded bg-white/5">
                          <FileText className="w-4 h-4 text-slate-400" />
                        </div>
                        <div>
                          <p className="font-bold text-white text-sm">{inv.plan}</p>
                          <p className="text-xs text-slate-400">{inv.date}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <span className="text-white font-mono">${inv.amount.toFixed(2)}</span>
                        <Badge className="bg-emerald-500/10 text-emerald-400 border-none">{inv.status}</Badge>
                        <Button size="icon" variant="ghost" className="h-8 w-8 text-slate-400 hover:text-white">
                          <Download className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* SETTINGS TAB (Legacy Settings) */}
          <TabsContent value="settings" className="space-y-6">
            <div className="grid lg:grid-cols-2 gap-6">
              <Card className="bg-white/5 border-white/10">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <Wallet className="w-5 h-5 text-green-500" />
                    Portfolio & Fees
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSettingsSave} className="space-y-4">
                    <div>
                      <label className="text-sm font-semibold text-slate-300 mb-1.5 block">Initial Equity ($)</label>
                      <Input
                        type="number" step="0.01" required
                        value={formData.initial_equity}
                        onChange={(e) => setFormData({ ...formData, initial_equity: e.target.value })}
                        className="bg-black/20 border-white/10 text-white"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-semibold text-slate-300 mb-1.5 block">Taker Fee (%)</label>
                      <Input
                        type="number" step="0.001" required
                        value={formData.taker_fee_percent}
                        onChange={(e) => setFormData({ ...formData, taker_fee_percent: e.target.value })}
                        className="bg-black/20 border-white/10 text-white"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-semibold text-slate-300 mb-1.5 block">Maker Fee (%)</label>
                      <Input
                        type="number" step="0.001" required
                        value={formData.maker_fee_percent}
                        onChange={(e) => setFormData({ ...formData, maker_fee_percent: e.target.value })}
                        className="bg-black/20 border-white/10 text-white"
                      />
                    </div>
                    <Button type="submit" disabled={createSettingsMutation.isPending || updateSettingsMutation.isPending} className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold">
                      Save Changes
                    </Button>
                  </form>
                </CardContent>
              </Card>

              <Card className="bg-white/5 border-white/10">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <Target className="w-5 h-5 text-blue-500" />
                    Preferences
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handlePreferencesSave} className="space-y-4">
                    <div>
                      <label className="text-sm font-semibold text-slate-300 mb-1.5 block">Default Risk (%)</label>
                      <Input
                        type="number" step="0.1" required
                        value={preferences.default_risk_percent}
                        onChange={(e) => setPreferences({ ...preferences, default_risk_percent: e.target.value })}
                        className="bg-black/20 border-white/10 text-white"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-semibold text-slate-300 mb-1.5 block">Trading Style</label>
                      <Select value={preferences.trading_style} onValueChange={(value) => setPreferences({ ...preferences, trading_style: value })}>
                        <SelectTrigger className="bg-black/20 border-white/10 text-white"><SelectValue /></SelectTrigger>
                        <SelectContent className="bg-slate-900 border-slate-700 text-white">
                          <SelectItem value="scalping">Scalping</SelectItem>
                          <SelectItem value="day">Day Trading</SelectItem>
                          <SelectItem value="swing">Swing Trading</SelectItem>
                          <SelectItem value="position">Position Trading</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <label className="text-sm font-semibold text-slate-300 mb-1.5 block">Theme</label>
                      <Select value={preferences.theme_preference} onValueChange={(value) => setPreferences({ ...preferences, theme_preference: value })}>
                        <SelectTrigger className="bg-black/20 border-white/10 text-white"><SelectValue /></SelectTrigger>
                        <SelectContent className="bg-slate-900 border-slate-700 text-white">
                          <SelectItem value="dark">Dark Mode</SelectItem>
                          <SelectItem value="light">Light Mode</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <Button type="submit" disabled={updateUserMutation.isPending} className="w-full bg-purple-600 hover:bg-purple-500 text-white font-bold">
                      Save Preferences
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </div>

            {showSuccess && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-xl flex items-center gap-3 text-emerald-400">
                <CheckCircle2 className="w-5 h-5" />
                <span className="font-bold">Settings saved successfully!</span>
              </motion.div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}