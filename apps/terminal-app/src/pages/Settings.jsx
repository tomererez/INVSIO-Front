
import React, { useState, useEffect } from "react";
import { api } from "@/api/client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { motion } from "framer-motion";
import { Settings as SettingsIcon, DollarSign, TrendingUp, Percent, Wallet, AlertCircle, CheckCircle2 } from "lucide-react";
import { useLanguage } from "../components/LanguageContext";
import { PageHeader } from "../components/PageHeader";

export default function Settings() {
  const { t, language } = useLanguage();
  const queryClient = useQueryClient();
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

  // Fetch user settings
  const { data: settingsList = [] } = useQuery({
    queryKey: ['settings'],
    queryFn: () => api.entities.Settings.list(),
  });

  // Fetch all trades for portfolio calculation
  const { data: trades = [] } = useQuery({
    queryKey: ['trades'],
    queryFn: () => api.entities.Trade.list(),
  });

  const settings = settingsList[0] || null;

  const [formData, setFormData] = useState({
    initial_equity: settings?.initial_equity || "",
    taker_fee_percent: settings?.taker_fee_percent || 0.055,
    maker_fee_percent: settings?.maker_fee_percent || 0.02,
  });

  const [showSuccess, setShowSuccess] = useState(false);

  // Calculate current equity based on initial + closed trades PnL
  const currentEquity = React.useMemo(() => {
    if (!settings?.initial_equity) return 0;
    const closedTrades = trades.filter(t => t.status === 'closed');
    const totalPnL = closedTrades.reduce((sum, t) => sum + (t.pnl || 0), 0);
    return settings.initial_equity + totalPnL;
  }, [settings, trades]);

  const createSettingsMutation = useMutation({
    mutationFn: (data) => api.entities.Settings.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['settings'] });
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
    },
  });

  const updateSettingsMutation = useMutation({
    mutationFn: (data) => api.entities.Settings.update(settings.id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['settings'] });
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();

    const data = {
      initial_equity: parseFloat(formData.initial_equity),
      taker_fee_percent: parseFloat(formData.taker_fee_percent),
      maker_fee_percent: parseFloat(formData.maker_fee_percent),
    };

    if (settings) {
      updateSettingsMutation.mutate(data);
    } else {
      createSettingsMutation.mutate(data);
    }
  };

  const portfolioStats = React.useMemo(() => {
    if (!settings?.initial_equity) return null;

    const closedTrades = trades.filter(t => t.status === 'closed');
    const totalPnL = closedTrades.reduce((sum, t) => sum + (t.pnl || 0), 0);
    const roiPercent = (totalPnL / settings.initial_equity) * 100;

    return {
      initial: settings.initial_equity,
      current: currentEquity,
      totalPnL,
      roiPercent,
      numTrades: closedTrades.length
    };
  }, [settings, trades, currentEquity]);

  return (
    <div className={`min-h-screen ${isDark ? 'bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950' : 'bg-gradient-to-br from-gray-50 via-white to-gray-100'}`} dir={language === 'he' ? 'rtl' : 'ltr'}>
      {/* Hero Section */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        <PageHeader
          title={language === 'he' ? 'הגדרות' : 'Settings'}
          subtitle={language === 'he' ? 'נהל את התיק והעמלות שלך' : 'Manage your portfolio and fees'}
          variant="purple"
        />
      </div>

      {/* Main Content */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
        <div className="grid lg:grid-cols-2 gap-6">
          {/* Settings Form */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Card className={`${isDark ? 'bg-slate-900/50 border-slate-800' : 'bg-white border-gray-200 shadow-lg'} backdrop-blur-sm shadow-2xl`}>
              <CardHeader className={`border-b ${isDark ? 'border-slate-800' : 'border-gray-200'}`}>
                <CardTitle className={`text-xl font-bold flex items-center gap-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                  <SettingsIcon className="w-5 h-5 text-purple-500" />
                  {language === 'he' ? 'הגדרות תיק ועמלות' : 'Portfolio & Fee Settings'}
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Initial Equity */}
                  <div>
                    <label className={`block font-bold mb-2 flex items-center gap-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                      <Wallet className="w-4 h-4 text-green-500" />
                      {language === 'he' ? 'גודל תיק התחלתי ($)' : 'Initial Portfolio Size ($)'}
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
                    <p className={`text-xs mt-2 font-semibold ${isDark ? 'text-slate-400' : 'text-gray-600'}`}>
                      💡 {language === 'he'
                        ? 'התיק הנוכחי יחושב אוטומטית: תיק התחלתי + PnL מעסקאות סגורות'
                        : 'Current portfolio will be calculated automatically: Initial + PnL from closed trades'}
                    </p>
                  </div>

                  {/* Taker Fee */}
                  <div>
                    <label className={`block font-bold mb-2 flex items-center gap-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                      <Percent className="w-4 h-4 text-orange-500" />
                      {language === 'he' ? 'עמלת Taker (%)' : 'Taker Fee (%)'}
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
                    <p className={`text-xs mt-2 font-semibold ${isDark ? 'text-slate-400' : 'text-gray-600'}`}>
                      {language === 'he'
                        ? 'ברירת מחדל Binance Futures: 0.055%'
                        : 'Binance Futures default: 0.055%'}
                    </p>
                  </div>

                  {/* Maker Fee */}
                  <div>
                    <label className={`block font-bold mb-2 flex items-center gap-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                      <Percent className="w-4 h-4 text-blue-500" />
                      {language === 'he' ? 'עמלת Maker (%)' : 'Maker Fee (%)'}
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
                    <p className={`text-xs mt-2 font-semibold ${isDark ? 'text-slate-400' : 'text-gray-600'}`}>
                      {language === 'he'
                        ? 'ברירת מחדל Binance Futures: 0.02%'
                        : 'Binance Futures default: 0.02%'}
                    </p>
                  </div>

                  {/* Info Box */}
                  <div className={`${isDark ? 'bg-blue-500/10 border-blue-500/30' : 'bg-blue-50 border-blue-300'} border rounded-lg p-4`}>
                    <div className="flex items-start gap-3">
                      <AlertCircle className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />
                      <div className={`text-sm space-y-1 ${isDark ? 'text-blue-300' : 'text-blue-700'}`}>
                        <p className="font-bold">
                          {language === 'he' ? 'מה זה Taker ו-Maker?' : 'What is Taker and Maker?'}
                        </p>
                        <p className="text-xs font-semibold">
                          <strong>Taker:</strong> {language === 'he'
                            ? 'פקודה שמבוצעת מיידית (Market Order) - עמלה גבוהה יותר'
                            : 'Order executed immediately (Market Order) - higher fee'}
                        </p>
                        <p className="text-xs font-semibold">
                          <strong>Maker:</strong> {language === 'he'
                            ? 'פקודה שנכנסת לספר הפקודות (Limit Order) - עמלה נמוכה יותר'
                            : 'Order added to order book (Limit Order) - lower fee'}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Submit Button */}
                  <Button
                    type="submit"
                    disabled={createSettingsMutation.isPending || updateSettingsMutation.isPending}
                    className="w-full h-12 text-lg font-bold bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 shadow-lg"
                  >
                    {createSettingsMutation.isPending || updateSettingsMutation.isPending
                      ? (language === 'he' ? 'שומר...' : 'Saving...')
                      : (language === 'he' ? 'שמור הגדרות' : 'Save Settings')}
                  </Button>

                  {/* Success Message */}
                  {showSuccess && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={`${isDark ? 'bg-green-500/10 border-green-500/30' : 'bg-green-50 border-green-300'} border rounded-lg p-4 flex items-center gap-3`}
                    >
                      <CheckCircle2 className="w-5 h-5 text-green-500" />
                      <p className={`font-bold ${isDark ? 'text-green-300' : 'text-green-700'}`}>
                        {language === 'he' ? '✓ ההגדרות נשמרו בהצלחה!' : '✓ Settings saved successfully!'}
                      </p>
                    </motion.div>
                  )}
                </form>
              </CardContent>
            </Card>
          </motion.div>

          {/* Portfolio Overview */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="space-y-6"
          >
            {portfolioStats ? (
              <>
                <Card className={`${isDark ? 'bg-gradient-to-br from-green-900/30 to-emerald-900/30 border-green-500/30' : 'bg-gradient-to-br from-green-50 to-emerald-50 border-green-300 shadow-lg'}`}>
                  <CardHeader className={`border-b ${isDark ? 'border-green-500/30' : 'border-green-300'}`}>
                    <CardTitle className={`text-xl font-bold flex items-center gap-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                      <TrendingUp className="w-5 h-5 text-green-500" />
                      {language === 'he' ? 'סטטוס תיק' : 'Portfolio Status'}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-6 space-y-4">
                    <div className="flex justify-between items-center">
                      <span className={`${isDark ? 'text-slate-300' : 'text-gray-700'} font-semibold`}>{language === 'he' ? 'תיק התחלתי:' : 'Initial Portfolio:'}</span>
                      <span className={`${isDark ? 'text-white' : 'text-gray-900'} font-bold text-lg`}>${portfolioStats.initial.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className={`${isDark ? 'text-slate-300' : 'text-gray-700'} font-semibold`}>{language === 'he' ? 'PnL כולל:' : 'Total PnL:'}</span>
                      <span className={`font-bold text-lg ${portfolioStats.totalPnL >= 0 ? (isDark ? 'text-green-400' : 'text-green-600') : (isDark ? 'text-red-400' : 'text-red-600')}`}>
                        {portfolioStats.totalPnL >= 0 ? '+' : ''}${portfolioStats.totalPnL.toFixed(2)}
                      </span>
                    </div>
                    <div className={`h-px my-4 ${isDark ? 'bg-slate-700' : 'bg-gray-300'}`} />
                    <div className="flex justify-between items-center">
                      <span className={`${isDark ? 'text-slate-300' : 'text-gray-700'} font-extrabold`}>{language === 'he' ? 'תיק נוכחי:' : 'Current Portfolio:'}</span>
                      <span className={`${isDark ? 'text-white' : 'text-gray-900'} font-extrabold text-2xl`}>${portfolioStats.current.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className={`${isDark ? 'text-slate-300' : 'text-gray-700'} font-semibold`}>ROI:</span>
                      <span className={`font-bold text-xl ${portfolioStats.roiPercent >= 0 ? (isDark ? 'text-green-400' : 'text-green-600') : (isDark ? 'text-red-400' : 'text-red-600')}`}>
                        {portfolioStats.roiPercent >= 0 ? '+' : ''}{portfolioStats.roiPercent.toFixed(2)}%
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className={`${isDark ? 'text-slate-300' : 'text-gray-700'} font-semibold`}>{language === 'he' ? 'מספר עסקאות:' : 'Number of Trades:'}</span>
                      <span className={`${isDark ? 'text-white' : 'text-gray-900'} font-semibold`}>{portfolioStats.numTrades}</span>
                    </div>
                  </CardContent>
                </Card>

                <Card className={`${isDark ? 'bg-slate-900/50 border-slate-800' : 'bg-white border-gray-200 shadow-lg'}`}>
                  <CardHeader className={`border-b ${isDark ? 'border-slate-800' : 'border-gray-200'}`}>
                    <CardTitle className={`text-lg font-bold flex items-center gap-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                      <DollarSign className="w-5 h-5 text-yellow-500" />
                      {language === 'he' ? 'סימולציית עמלות' : 'Fee Simulation'}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-6 space-y-4">
                    <p className={`text-sm mb-4 font-semibold ${isDark ? 'text-slate-300' : 'text-gray-700'}`}>
                      {language === 'he'
                        ? 'עמלות משוערות לעסקה של $1,000:'
                        : 'Estimated fees for a $1,000 trade:'}
                    </p>
                    <div className="space-y-3">
                      <div className={`${isDark ? 'bg-slate-800/50' : 'bg-gray-100'} rounded-lg p-3`}>
                        <div className="flex justify-between items-center mb-1">
                          <span className={`${isDark ? 'text-slate-400' : 'text-gray-700'} text-sm font-semibold`}>Taker (Market Order):</span>
                          <span className={`${isDark ? 'text-orange-400' : 'text-orange-600'} font-bold`}>${(1000 * formData.taker_fee_percent / 100).toFixed(2)}</span>
                        </div>
                        <div className={`text-xs ${isDark ? 'text-slate-500' : 'text-gray-500'} font-semibold`}>
                          {language === 'he' ? 'כניסה + יציאה: ' : 'Entry + Exit: '}
                          <span className={`${isDark ? 'text-orange-300' : 'text-orange-500'} font-bold`}>${(1000 * formData.taker_fee_percent / 100 * 2).toFixed(2)}</span>
                        </div>
                      </div>
                      <div className={`${isDark ? 'bg-slate-800/50' : 'bg-gray-100'} rounded-lg p-3`}>
                        <div className="flex justify-between items-center mb-1">
                          <span className={`${isDark ? 'text-slate-400' : 'text-gray-700'} text-sm font-semibold`}>Maker (Limit Order):</span>
                          <span className={`${isDark ? 'text-blue-400' : 'text-blue-600'} font-bold`}>${(1000 * formData.maker_fee_percent / 100).toFixed(2)}</span>
                        </div>
                        <div className={`text-xs ${isDark ? 'text-slate-500' : 'text-gray-500'} font-semibold`}>
                          {language === 'he' ? 'כניסה + יציאה: ' : 'Entry + Exit: '}
                          <span className={`${isDark ? 'text-blue-300' : 'text-blue-500'} font-bold`}>${(1000 * formData.maker_fee_percent / 100 * 2).toFixed(2)}</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </>
            ) : (
              <Card className={`${isDark ? 'bg-slate-900/30 border-slate-800/50' : 'bg-white border-gray-200 shadow-lg'} h-full flex items-center justify-center min-h-[400px]`}>
                <CardContent className="text-center p-12">
                  <div className={`w-20 h-20 ${isDark ? 'bg-slate-800/50' : 'bg-gray-100'} rounded-full flex items-center justify-center mx-auto mb-6`}>
                    <Wallet className={`w-10 h-10 ${isDark ? 'text-slate-600' : 'text-gray-400'}`} />
                  </div>
                  <h3 className={`text-2xl font-bold mb-3 ${isDark ? 'text-slate-400' : 'text-gray-700'}`}>
                    {language === 'he' ? 'טרם הוגדר תיק' : 'No Portfolio Set'}
                  </h3>
                  <p className={`text-sm max-w-md mx-auto font-semibold ${isDark ? 'text-slate-500' : 'text-gray-600'}`}>
                    {language === 'he'
                      ? 'הזן את גודל התיק ההתחלתי והעמלות כדי להתחיל'
                      : 'Enter initial portfolio size and fees to get started'}
                  </p>
                </CardContent>
              </Card>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
}
