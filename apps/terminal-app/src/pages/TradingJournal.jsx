
import React, { useState, useMemo, useEffect } from "react";
import { api } from "@/api/client";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Plus, Calendar as CalendarIcon, X, Upload } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { useLanguage } from "../components/LanguageContext";
import moment from "moment";

import AddTradeModal from "../components/trading-journal/AddTradeModal";
import ImportCSVModal from "../components/trading-journal/ImportCSVModal";
import TradeCard from "../components/trading-journal/TradeCard";
import TradesTimeline from "../components/trading-journal/TradesTimeline";
import PnLChart from "../components/trading-journal/PnLChart";
import CryptoTicker from "../components/trading-journal/CryptoTicker";

import MonthlyCalendar from "../components/trading-journal/MonthlyCalendar";
import DailyPnLChart from "../components/trading-journal/DailyPnLChart";
import AdvancedMetrics from "../components/trading-journal/AdvancedMetrics";
import StreakIndicator from "../components/trading-journal/StreakIndicator";
import PortfolioOverview from "../components/trading-journal/PortfolioOverview";
import AIInsightsButton from "../components/trading-journal/AIInsightsButton";
import { FeatureGate } from "../components/FeatureGate";

export default function TradingJournal() {
  const { t, language } = useLanguage();
  const [search, setSearch] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);
  const [showImportModal, setShowImportModal] = useState(false);
  const [filterStatus, setFilterStatus] = useState("all");
  const [dateRange, setDateRange] = useState({ from: null, to: null });
  const [showDatePicker, setShowDatePicker] = useState(false);
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

  const { data: user } = useQuery({
    queryKey: ['currentUser'],
    queryFn: () => api.auth.me(),
  });

  const { data: trades = [] } = useQuery({
    queryKey: ['trades'],
    queryFn: () => api.entities.Trade.list('-entry_time'),
  });

  const filteredTrades = useMemo(() => {
    return trades.filter(trade => {
      const matchesSearch = !search || trade.symbol?.toLowerCase().includes(search.toLowerCase());
      const matchesStatus = filterStatus === "all" || trade.status === filterStatus;

      // Date range filter
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
    const avgWin = winningTrades.length > 0
      ? totalWins / winningTrades.length
      : 0;
    const avgLoss = losingTrades.length > 0
      ? totalLosses / losingTrades.length
      : 0;
    const winRate = closedTrades.length > 0 ? (winningTrades.length / closedTrades.length) * 100 : 0;
    const profitFactor = totalLosses > 0 ? totalWins / totalLosses : totalWins > 0 ? totalWins : 0;
    const expectancy = closedTrades.length > 0 ? totalPnL / closedTrades.length : 0;

    return {
      totalTrades: filteredTrades.length,
      openTrades: filteredTrades.filter(t => t.status === "open").length,
      closedTrades: closedTrades.length,
      totalPnL,
      winRate,
      avgWin,
      avgLoss,
      profitFactor,
      expectancy,
      winningTrades: winningTrades.length,
      losingTrades: losingTrades.length
    };
  }, [filteredTrades]);

  const clearDateRange = () => {
    setDateRange({ from: null, to: null });
  };

  const formatDateRange = () => {
    if (dateRange.from && dateRange.to) {
      return `${moment(dateRange.from).format('DD/MM/YY')} - ${moment(dateRange.to).format('DD/MM/YY')}`;
    } else if (dateRange.from) {
      return `${language === 'he' ? 'מ-' : 'From'} ${moment(dateRange.from).format('DD/MM/YY')}`;
    } else if (dateRange.to) {
      return `${language === 'he' ? 'עד' : 'To'} ${moment(dateRange.to).format('DD/MM/YY')}`;
    }
    return t('tradingJournal.dateRange');
  };

  return (
    <div className={`min-h-screen ${isDark ? 'bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950' : 'bg-gradient-to-br from-gray-50 via-white to-gray-100'}`} dir={language === 'he' ? 'rtl' : 'ltr'}>
      {/* Crypto Ticker */}
      <CryptoTicker />

      {/* AI Insights Floating Button - Pro+ */}
      <FeatureGate feature="ai_trade_coach_standard">
        <AIInsightsButton trades={trades} />
      </FeatureGate>

      {/* Hero Section */}
      <div className={`relative overflow-hidden border-b ${isDark ? 'border-slate-800/50 bg-gradient-to-b from-slate-900/50' : 'border-gray-200 bg-gradient-to-b from-white/50'} to-transparent`}>
        <div className="absolute inset-0 bg-grid-pattern opacity-5" />
        <div className="relative max-w-[1600px] mx-auto px-4 sm:px-6 py-8">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <h1 className="text-3xl font-bold mb-2 bg-gradient-to-l from-emerald-400 via-teal-400 to-cyan-400 bg-clip-text text-transparent">
                  {t('tradingJournal.title')}
                </h1>
                <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-gray-600'}`}>
                  {t('tradingJournal.greeting')} {user?.full_name?.split(' ')[0] || t('tradingJournal.greetingDefault')}! {t('tradingJournal.subtitle')}
                </p>
              </div>
              <div className="flex gap-2">
                <Popover open={showDatePicker} onOpenChange={setShowDatePicker}>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      size="sm"
                      className={`border ${isDark ? 'bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700' : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'} ${(dateRange.from || dateRange.to) ? 'border-cyan-500/50 bg-cyan-900/20' : ''
                        }`}
                    >
                      <CalendarIcon className={`w-4 h-4 ${language === 'he' ? 'ml-2' : 'mr-2'}`} />
                      {formatDateRange()}
                      {(dateRange.from || dateRange.to) && (
                        <X
                          className={`w-3 h-3 ${language === 'he' ? 'mr-2' : 'ml-2'} hover:text-red-400`}
                          onClick={(e) => {
                            e.stopPropagation();
                            clearDateRange();
                          }}
                        />
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className={`w-auto p-0 border ${isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-gray-200'}`} align={language === 'he' ? 'end' : 'start'}>
                    <div className="p-4 space-y-4">
                      <div className={`text-sm font-semibold ${isDark ? 'text-white' : 'text-gray-900'} mb-2`}>
                        {language === 'he' ? 'בחר טווח תאריכים' : 'Select Date Range'}
                      </div>
                      <div className="flex gap-4">
                        <div>
                          <label className={`text-xs ${isDark ? 'text-slate-400' : 'text-gray-500'} mb-1 block`}>
                            {language === 'he' ? 'מתאריך' : 'From'}
                          </label>
                          <Calendar
                            mode="single"
                            selected={dateRange.from}
                            onSelect={(date) => setDateRange(prev => ({ ...prev, from: date }))}
                            className={`rounded-md border ${isDark ? 'border-slate-800 bg-slate-900 text-white [&_.rdp-day]:text-slate-300 [&_.rdp-day_button]:text-slate-300 [&_.rdp-day_button:hover]:bg-slate-800 [&_.rdp-day_button:hover]:text-white [&_.rdp-day_button[aria-selected]]:bg-cyan-600 [&_.rdp-day_button[aria-selected]]:text-white [&_.rdp-caption]:text-white [&_.rdp-nav_button]:text-slate-400 [&_.rdp-nav_button:hover]:text-white [&_.rdp-head_cell]:text-slate-400' : 'border-gray-200 bg-white text-gray-900 [&_.rdp-day]:text-gray-700 [&_.rdp-day_button]:text-gray-700 [&_.rdp-day_button:hover]:bg-gray-100 [&_.rdp-day_button:hover]:text-gray-900 [&_.rdp-day_button[aria-selected]]:bg-cyan-600 [&_.rdp-day_button[aria-selected]]:text-white [&_.rdp-caption]:text-gray-900 [&_.rdp-nav_button]:text-gray-500 [&_.rdp-nav_button:hover]:text-gray-900 [&_.rdp-head_cell]:text-gray-500'}`}
                          />
                        </div>
                        <div>
                          <label className={`text-xs ${isDark ? 'text-slate-400' : 'text-gray-500'} mb-1 block`}>
                            {language === 'he' ? 'עד תאריך' : 'To'}
                          </label>
                          <Calendar
                            mode="single"
                            selected={dateRange.to}
                            onSelect={(date) => setDateRange(prev => ({ ...prev, to: date }))}
                            disabled={(date) => dateRange.from && date < dateRange.from}
                            className={`rounded-md border ${isDark ? 'border-slate-800 bg-slate-900 text-white [&_.rdp-day]:text-slate-300 [&_.rdp-day_button]:text-slate-300 [&_.rdp-day_button:hover]:bg-slate-800 [&_.rdp-day_button:hover]:text-white [&_.rdp-day_button[aria-selected]]:bg-cyan-600 [&_.rdp-day_button[aria-selected]]:text-white [&_.rdp-caption]:text-white [&_.rdp-nav_button]:text-slate-400 [&_.rdp-nav_button:hover]:text-white [&_.rdp-head_cell]:text-slate-400' : 'border-gray-200 bg-white text-gray-900 [&_.rdp-day]:text-gray-700 [&_.rdp-day_button]:text-gray-700 [&_.rdp-day_button:hover]:bg-gray-100 [&_.rdp-day_button:hover]:text-gray-900 [&_.rdp-day_button[aria-selected]]:bg-cyan-600 [&_.rdp-day_button[aria-selected]]:text-white [&_.rdp-caption]:text-gray-900 [&_.rdp-nav_button]:text-gray-500 [&_.rdp-nav_button:hover]:text-gray-900 [&_.rdp-head_cell]:text-gray-500'}`}
                          />
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => {
                            clearDateRange();
                            setShowDatePicker(false);
                          }}
                          className={`flex-1 ${isDark ? 'bg-slate-800 hover:bg-slate-700 text-white' : 'bg-gray-100 hover:bg-gray-200 text-gray-800'}`}
                        >
                          {language === 'he' ? 'נקה' : 'Clear'}
                        </Button>
                        <Button
                          size="sm"
                          onClick={() => setShowDatePicker(false)}
                          className="flex-1 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white"
                        >
                          {language === 'he' ? 'החל' : 'Apply'}
                        </Button>
                      </div>
                    </div>
                  </PopoverContent>
                </Popover>
                <Button
                  onClick={() => setShowImportModal(true)}
                  variant="outline"
                  size="sm"
                  className="border-emerald-500/50 text-emerald-400 hover:bg-emerald-500/10"
                >
                  <Upload className={`w-4 h-4 ${language === 'he' ? 'ml-2' : 'mr-2'}`} />
                  {language === 'he' ? 'ייבוא CSV' : 'Import CSV'}
                </Button>
                <Button
                  onClick={() => setShowAddModal(true)}
                  size="sm"
                  className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700"
                >
                  <Plus className={`w-4 h-4 ${language === 'he' ? 'ml-2' : 'mr-2'}`} />
                  {t('tradingJournal.newTrade')}
                </Button>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 py-4 space-y-4">
        {/* Portfolio Overview */}
        <PortfolioOverview trades={filteredTrades} />

        {/* Advanced Metrics - Pro+ */}
        <FeatureGate feature="advanced_metrics">
          <AdvancedMetrics stats={stats} trades={filteredTrades} />
        </FeatureGate>

        {/* Charts Grid - Full Dashboard is Pro+ */}
        <FeatureGate feature="full_dashboard">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <PnLChart trades={filteredTrades} />
            <DailyPnLChart trades={filteredTrades} />
            <StreakIndicator trades={filteredTrades} />
          </div>
        </FeatureGate>

        {/* Monthly Calendar & Timeline Side by Side */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div className="lg:col-span-2">
            <MonthlyCalendar trades={filteredTrades} />
          </div>
          <div className="lg:col-span-1">
            <TradesTimeline trades={filteredTrades} />
          </div>
        </div>

        {/* Tabs Section - Trades List */}
        <Tabs defaultValue="all" className="w-full">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
            {/* Search - Left in LTR, Right in RTL */}
            <div className={`relative w-full sm:w-auto ${language === 'he' ? 'order-2 sm:order-1' : 'order-1'}`}>
              <Search className={`absolute ${language === 'he' ? 'right-3' : 'left-3'} top-1/2 transform -translate-y-1/2 w-4 h-4 ${isDark ? 'text-slate-500' : 'text-gray-500'}`} />
              <Input
                placeholder={t('tradingJournal.searchPlaceholder')}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className={`${language === 'he' ? 'pr-10' : 'pl-10'} h-10 ${isDark ? 'bg-slate-900/50 border-slate-800 text-white' : 'bg-white border-gray-300 text-gray-900'} w-full sm:w-64`}
              />
            </div>

            {/* Filters - Right in LTR, Left in RTL */}
            <TabsList className={`border ${isDark ? 'bg-slate-900/50 border-slate-800' : 'bg-gray-100 border-gray-300'} ${language === 'he' ? 'order-1 sm:order-2' : 'order-2'}`}>
              <TabsTrigger
                value="all"
                onClick={() => setFilterStatus("all")}
                className="data-[state=active]:bg-emerald-600 data-[state=active]:text-white"
              >
                {t('tradingJournal.allTrades')} ({stats.totalTrades})
              </TabsTrigger>
              <TabsTrigger
                value="open"
                onClick={() => setFilterStatus("open")}
                className="data-[state=active]:bg-blue-600 data-[state=active]:text-white"
              >
                {t('tradingJournal.openTrades')} ({stats.openTrades})
              </TabsTrigger>
              <TabsTrigger
                value="closed"
                onClick={() => setFilterStatus("closed")}
                className="data-[state=active]:bg-slate-600 data-[state=active]:text-white"
              >
                {t('tradingJournal.closedTrades')} ({stats.closedTrades})
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="all" className="mt-0">
            <div className="space-y-3">
              <AnimatePresence mode="popLayout">
                {filteredTrades.length === 0 ? (
                  <div className={`${isDark ? 'bg-slate-900/50 border-slate-800' : 'bg-white border-gray-200 shadow-lg'} border rounded-xl p-12 text-center`}>
                    <p className={`${isDark ? 'text-slate-400' : 'text-gray-600'} text-lg`}>
                      {t('tradingJournal.noTrades')}
                    </p>
                  </div>
                ) : (
                  filteredTrades.map((trade) => (
                    <TradeCard key={trade.id} trade={trade} />
                  ))
                )}
              </AnimatePresence>
            </div>
          </TabsContent>

          <TabsContent value="open" className="mt-0">
            <div className="space-y-3">
              <AnimatePresence mode="popLayout">
                {filteredTrades.length === 0 ? (
                  <div className={`${isDark ? 'bg-slate-900/50 border-slate-800' : 'bg-white border-gray-200 shadow-lg'} border rounded-xl p-12 text-center`}>
                    <p className={`${isDark ? 'text-slate-400' : 'text-gray-600'} text-lg`}>{t('tradingJournal.noOpenTrades')}</p>
                  </div>
                ) : (
                  filteredTrades.map((trade) => (
                    <TradeCard key={trade.id} trade={trade} />
                  ))
                )}
              </AnimatePresence>
            </div>
          </TabsContent>

          <TabsContent value="closed" className="mt-0">
            <div className="space-y-3">
              <AnimatePresence mode="popLayout">
                {filteredTrades.length === 0 ? (
                  <div className={`${isDark ? 'bg-slate-900/50 border-slate-800' : 'bg-white border-gray-200 shadow-lg'} border rounded-xl p-12 text-center`}>
                    <p className={`${isDark ? 'text-slate-400' : 'text-gray-600'} text-lg`}>{t('tradingJournal.noClosedTrades')}</p>
                  </div>
                ) : (
                  filteredTrades.map((trade) => (
                    <TradeCard key={trade.id} trade={trade} />
                  ))
                )}
              </AnimatePresence>
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* Modals */}
      {showAddModal && (
        <AddTradeModal
          onClose={() => setShowAddModal(false)}
        />
      )}

      {/* CSV Import - Pro+ */}
      {showImportModal && (
        <FeatureGate feature="csv_import">
          <ImportCSVModal
            onClose={() => setShowImportModal(false)}
          />
        </FeatureGate>
      )}
    </div>
  );
}
