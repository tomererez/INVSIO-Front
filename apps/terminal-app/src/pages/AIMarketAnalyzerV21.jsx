import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Sparkles, TrendingUp, TrendingDown, Activity, Zap, Loader2, AlertTriangle, RefreshCw, Target, Brain, BarChart3, Crosshair, Crown } from "lucide-react";
import { api } from "@/api/client";
import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import UserNotRegisteredError from "../components/UserNotRegisteredError";
import { FeatureGate } from "../components/FeatureGate";
import TradingCoachChat from "../components/TradingCoachChat";

export default function AIMarketAnalyzerV21() {
  const [loading, setLoading] = useState(false);
  const [marketData, setMarketData] = useState(null);
  const [analysis, setAnalysis] = useState(null);
  const [error, setError] = useState(null);
  const [theme, setTheme] = useState('dark');

  const { data: user, isLoading: userLoading } = useQuery({
    queryKey: ['currentUser'],
    queryFn: async () => {
      const isAuth = await api.auth.isAuthenticated();
      if (!isAuth) return null;
      return await api.auth.me();
    },
    retry: false,
  });

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

  // Show loading while checking auth
  if (userLoading) {
    return (
      <div className={`min-h-screen ${isDark ? 'bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950' : 'bg-gradient-to-br from-gray-50 via-white to-gray-100'} flex items-center justify-center`}>
        <Loader2 className="w-12 h-12 animate-spin text-orange-400" />
      </div>
    );
  }

  // Show login required if not authenticated
  if (!user) {
    return <UserNotRegisteredError />;
  }

  const runFullAnalysis = async () => {
    setLoading(true);
    setError(null);

    try {
      // Fetch market data
      const response = await api.functions.getMarketSnapshot();
      let data = response.data;

      if (data.success && data.data) {
        data = data.data;
      }

      if (!data || !data.raw || !data.raw.binance) {
        throw new Error('Invalid market data response');
      }

      setMarketData(data);

      // Run AI Analysis using OpenAI backend function
      const analysisResponse = await api.functions.analyzeMarketWithOpenAI({
        marketData: data
      });

      if (analysisResponse.data.error) {
        throw new Error(analysisResponse.data.error);
      }

      setAnalysis(analysisResponse.data);
    } catch (err) {
      console.error("Error:", err);
      const errorMsg = err.response?.data?.error || err.message || "Failed to run analysis. Please try again.";
      setError(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  const getBiasColor = (bias) => {
    const b = bias?.toLowerCase();
    if (b === 'bullish') return 'text-emerald-400';
    if (b === 'bearish') return 'text-red-400';
    return 'text-amber-400';
  };

  const getBiasBg = (bias) => {
    const b = bias?.toLowerCase();
    if (b === 'bullish') return 'bg-emerald-500/20 border-emerald-500/50';
    if (b === 'bearish') return 'bg-red-500/20 border-red-500/50';
    return 'bg-amber-500/20 border-amber-500/50';
  };

  const getConfidenceBadge = (confidence) => {
    if (confidence >= 8) return { color: 'bg-emerald-500', text: 'High Conviction' };
    if (confidence >= 5) return { color: 'bg-amber-500', text: 'Moderate' };
    return { color: 'bg-slate-500', text: 'Low Confidence' };
  };

  return (
    <FeatureGate feature="unlimited_analysis">
      <div className={`min-h-screen ${isDark ? 'bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950' : 'bg-gradient-to-br from-gray-50 via-white to-gray-100'} py-8 px-4`}>
        <div className="max-w-7xl mx-auto space-y-8">

          {/* Hero Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-amber-500 via-orange-500 to-red-500 rounded-2xl mb-4 shadow-2xl shadow-orange-500/30">
              <Crown className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-5xl font-black mb-3 bg-gradient-to-r from-amber-400 via-orange-400 to-red-400 bg-clip-text text-transparent">
              AI Market Analyzer v2.1
            </h1>
            <p className={`text-lg ${isDark ? 'text-slate-400' : 'text-gray-600'}`}>
              Powered by OpenAI GPT-4o • Premium Intelligence Engine
            </p>
          </motion.div>

          {/* CTA Button */}
          <div className="flex justify-center">
            <Button
              onClick={runFullAnalysis}
              disabled={loading}
              size="lg"
              className="relative overflow-hidden group bg-gradient-to-r from-amber-600 via-orange-600 to-red-600 hover:from-amber-500 hover:via-orange-500 hover:to-red-500 text-white shadow-2xl shadow-orange-500/50 px-12 py-6 text-xl font-bold rounded-xl transition-all duration-300 hover:scale-105"
            >
              {loading ? (
                <>
                  <Loader2 className="w-6 h-6 mr-3 animate-spin" />
                  AI Analyzing...
                </>
              ) : (
                <>
                  <Crown className="w-6 h-6 mr-3 group-hover:rotate-12 transition-transform" />
                  Run Premium AI Scan
                </>
              )}
            </Button>
          </div>

          {/* Error Display */}
          {error && (
            <Card className="bg-red-500/10 border-red-500/30">
              <CardContent className="p-4 flex items-center gap-3">
                <AlertTriangle className="w-5 h-5 text-red-400" />
                <p className="text-red-300">{error}</p>
              </CardContent>
            </Card>
          )}

          {/* Live Market Metrics */}
          {marketData && !loading && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <Card className={`${isDark ? 'bg-slate-900/80 border-slate-800' : 'bg-white border-gray-200'} backdrop-blur-sm`}>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <Activity className="w-5 h-5 text-orange-400" />
                      <h3 className={`text-lg font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                        Live Market Data
                      </h3>
                    </div>
                    <Button onClick={runFullAnalysis} variant="ghost" size="sm">
                      <RefreshCw className="w-4 h-4" />
                    </Button>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div>
                      <div className={`text-xs ${isDark ? 'text-slate-500' : 'text-gray-500'}`}>BTC Price</div>
                      <div className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                        ${marketData.raw?.binance?.['4h']?.price?.toLocaleString() || 'N/A'}
                      </div>
                      <div className={`text-xs ${marketData.raw?.binance?.['4h']?.price_change >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                        {marketData.raw?.binance?.['4h']?.price_change >= 0 ? '+' : ''}{marketData.raw?.binance?.['4h']?.price_change?.toFixed(2)}%
                      </div>
                    </div>

                    <div>
                      <div className={`text-xs ${isDark ? 'text-slate-500' : 'text-gray-500'}`}>Market Regime</div>
                      <div className={`text-lg font-bold ${isDark ? 'text-white' : 'text-gray-900'} capitalize`}>
                        {marketData.marketRegime?.regime || 'N/A'}
                      </div>
                      <div className={`text-xs ${isDark ? 'text-slate-400' : 'text-gray-600'}`}>
                        Confidence: {marketData.marketRegime?.confidence || 0}/10
                      </div>
                    </div>

                    <div>
                      <div className={`text-xs ${isDark ? 'text-slate-500' : 'text-gray-500'}`}>AI Bias</div>
                      <div className={`text-lg font-bold ${getBiasColor(marketData.finalDecision?.bias)}`}>
                        {marketData.finalDecision?.bias || 'WAIT'}
                      </div>
                      <div className={`text-xs ${isDark ? 'text-slate-400' : 'text-gray-600'}`}>
                        Score: {marketData.finalDecision?.confidence || 0}/10
                      </div>
                    </div>

                    <div>
                      <div className={`text-xs ${isDark ? 'text-slate-500' : 'text-gray-500'}`}>Whale Activity</div>
                      <div className={`text-lg font-bold ${isDark ? 'text-white' : 'text-gray-900'} capitalize`}>
                        {marketData.exchangeDivergence?.dominantPlayer || 'N/A'}
                      </div>
                      <div className={`text-xs ${isDark ? 'text-slate-400' : 'text-gray-600'}`}>
                        Ratio: {marketData.exchangeDivergence?.whaleRetailRatio?.toFixed(2) || '0'}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {/* AI Analysis Results */}
          {analysis && !loading && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-8"
            >

              {/* Market Bias Hero Card */}
              <Card className={`${isDark ? 'bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 border-slate-700' : 'bg-gradient-to-br from-white via-gray-50 to-white border-gray-300'} shadow-2xl`}>
                <CardContent className="p-8">
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-4">
                      <div className={`w-16 h-16 rounded-2xl flex items-center justify-center ${getBiasBg(analysis.market_bias)}`}>
                        {analysis.market_bias?.toLowerCase() === 'bullish' ? (
                          <TrendingUp className={`w-8 h-8 ${getBiasColor(analysis.market_bias)}`} />
                        ) : analysis.market_bias?.toLowerCase() === 'bearish' ? (
                          <TrendingDown className={`w-8 h-8 ${getBiasColor(analysis.market_bias)}`} />
                        ) : (
                          <Activity className={`w-8 h-8 ${getBiasColor(analysis.market_bias)}`} />
                        )}
                      </div>
                      <div>
                        <h2 className={`text-4xl font-black ${getBiasColor(analysis.market_bias)}`}>
                          {analysis.market_bias?.toUpperCase()}
                        </h2>
                        <div className="flex items-center gap-3 mt-1">
                          <Badge className={getConfidenceBadge(analysis.confidence).color}>
                            {getConfidenceBadge(analysis.confidence).text}
                          </Badge>
                          <span className={`text-sm ${isDark ? 'text-slate-400' : 'text-gray-600'}`}>
                            {analysis.confidence}/10
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className={`text-right ${isDark ? 'text-slate-400' : 'text-gray-600'}`}>
                      <div className="text-sm">Current Price</div>
                      <div className="text-2xl font-bold text-white">
                        ${analysis.current_price?.toLocaleString()}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* 3 Timeframe Views */}
              <div className="grid md:grid-cols-3 gap-6">
                {/* MACRO */}
                {analysis.macro_view && (
                  <Card className={`${isDark ? 'bg-slate-900/80 border-slate-800' : 'bg-white border-gray-200'}`}>
                    <CardContent className="p-6">
                      <div className="flex items-center gap-3 mb-4">
                        <BarChart3 className="w-6 h-6 text-blue-400" />
                        <div>
                          <h3 className={`text-lg font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                            📊 MACRO
                          </h3>
                          <p className="text-xs text-slate-400">1d-4h Timeframe</p>
                        </div>
                      </div>
                      <Badge className={`mb-3 ${getBiasBg(analysis.macro_view.bias)}`}>
                        <span className={getBiasColor(analysis.macro_view.bias)}>
                          {analysis.macro_view.bias}
                        </span>
                      </Badge>
                      <p className={`text-sm mb-4 ${isDark ? 'text-slate-300' : 'text-gray-700'}`}>
                        {analysis.macro_view.summary}
                      </p>
                      {analysis.macro_view.smart_money_position && (
                        <div className={`p-3 rounded-lg ${isDark ? 'bg-slate-800/50' : 'bg-gray-100'} mb-3`}>
                          <div className="text-xs font-bold text-purple-400 mb-1">SMART MONEY</div>
                          <p className={`text-xs ${isDark ? 'text-slate-300' : 'text-gray-700'}`}>
                            {analysis.macro_view.smart_money_position}
                          </p>
                        </div>
                      )}
                      {analysis.macro_view.key_drivers && (
                        <div className="space-y-1">
                          {analysis.macro_view.key_drivers.map((driver, idx) => (
                            <div key={idx} className="flex items-start gap-2">
                              <span className="text-blue-400 text-xs mt-0.5">•</span>
                              <span className={`text-xs ${isDark ? 'text-slate-300' : 'text-gray-700'}`}>
                                {driver}
                              </span>
                            </div>
                          ))}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                )}

                {/* MICRO */}
                {analysis.micro_view && (
                  <Card className={`${isDark ? 'bg-slate-900/80 border-slate-800' : 'bg-white border-gray-200'}`}>
                    <CardContent className="p-6">
                      <div className="flex items-center gap-3 mb-4">
                        <Target className="w-6 h-6 text-emerald-400" />
                        <div>
                          <h3 className={`text-lg font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                            ⚡ MICRO
                          </h3>
                          <p className="text-xs text-slate-400">1h-4h Timeframe</p>
                        </div>
                      </div>
                      <Badge className={`mb-3 ${getBiasBg(analysis.micro_view.bias)}`}>
                        <span className={getBiasColor(analysis.micro_view.bias)}>
                          {analysis.micro_view.bias}
                        </span>
                      </Badge>
                      <p className={`text-sm mb-4 ${isDark ? 'text-slate-300' : 'text-gray-700'}`}>
                        {analysis.micro_view.summary}
                      </p>
                      {analysis.micro_view.technical_state && (
                        <div className={`p-3 rounded-lg ${isDark ? 'bg-slate-800/50' : 'bg-gray-100'} mb-3`}>
                          <div className="text-xs font-bold text-emerald-400 mb-1">TECHNICAL</div>
                          <p className={`text-xs ${isDark ? 'text-slate-300' : 'text-gray-700'}`}>
                            {analysis.micro_view.technical_state}
                          </p>
                        </div>
                      )}
                      {analysis.micro_view.traps_to_avoid && (
                        <div className="space-y-1">
                          <div className="text-xs font-bold text-orange-400 mb-1">AVOID</div>
                          {analysis.micro_view.traps_to_avoid.map((trap, idx) => (
                            <div key={idx} className="flex items-start gap-2">
                              <AlertTriangle className="w-3 h-3 text-orange-400 mt-0.5" />
                              <span className={`text-xs ${isDark ? 'text-slate-300' : 'text-gray-700'}`}>
                                {trap}
                              </span>
                            </div>
                          ))}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                )}

                {/* SCALPING */}
                {analysis.scalping_view && (
                  <Card className={`${isDark ? 'bg-slate-900/80 border-slate-800' : 'bg-white border-gray-200'}`}>
                    <CardContent className="p-6">
                      <div className="flex items-center gap-3 mb-4">
                        <Crosshair className="w-6 h-6 text-fuchsia-400" />
                        <div>
                          <h3 className={`text-lg font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                            🔥 SCALPING
                          </h3>
                          <p className="text-xs text-slate-400">5m-30m Timeframe</p>
                        </div>
                      </div>
                      <Badge className={`mb-3 ${getBiasBg(analysis.scalping_view.bias)}`}>
                        <span className={getBiasColor(analysis.scalping_view.bias)}>
                          {analysis.scalping_view.bias}
                        </span>
                      </Badge>
                      <p className={`text-sm mb-4 ${isDark ? 'text-slate-300' : 'text-gray-700'}`}>
                        {analysis.scalping_view.summary}
                      </p>
                      <div className="grid grid-cols-2 gap-2 mb-3">
                        <div className={`p-2 rounded ${isDark ? 'bg-slate-800/50' : 'bg-gray-100'}`}>
                          <div className="text-xs text-slate-400">Volatility</div>
                          <div className={`text-sm font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                            {analysis.scalping_view.volatility}
                          </div>
                        </div>
                        <div className={`p-2 rounded ${isDark ? 'bg-slate-800/50' : 'bg-gray-100'}`}>
                          <div className="text-xs text-slate-400">Approach</div>
                          <div className={`text-sm font-bold ${isDark ? 'text-white' : 'text-gray-900'} truncate`}>
                            {analysis.scalping_view.best_approach?.split(' ').slice(0, 2).join(' ')}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>

              {/* Entry Zones */}
              {analysis.entry_zones && (
                <div className="grid md:grid-cols-2 gap-6">
                  {/* LONG ZONES */}
                  <Card className={`${isDark ? 'bg-gradient-to-br from-emerald-950/50 to-slate-900 border-emerald-800/50' : 'bg-gradient-to-br from-emerald-50 to-white border-emerald-200'}`}>
                    <CardContent className="p-6">
                      <h3 className="text-2xl font-bold mb-4 flex items-center gap-2 text-emerald-400">
                        <TrendingUp className="w-6 h-6" />
                        Long Setups
                      </h3>
                      <div className="space-y-3">
                        {analysis.entry_zones.long_opportunities?.map((opp, idx) => (
                          <div key={idx} className={`p-4 rounded-lg ${isDark ? 'bg-slate-800/50 border border-emerald-800/30' : 'bg-white border border-emerald-200'}`}>
                            <div className="flex items-center justify-between mb-2">
                              <span className="font-mono font-bold text-emerald-400">{opp.zone}</span>
                              <Badge className={
                                opp.confidence === 'High' ? 'bg-emerald-500' :
                                  opp.confidence === 'Medium' ? 'bg-amber-500' : 'bg-slate-500'
                              }>
                                {opp.confidence}
                              </Badge>
                            </div>
                            <p className={`text-sm mb-2 ${isDark ? 'text-slate-300' : 'text-gray-700'}`}>
                              {opp.reason}
                            </p>
                            {opp.invalidation && (
                              <div className="text-xs text-red-400 flex items-center gap-1">
                                <span>❌</span>
                                <span>Invalidation: {opp.invalidation}</span>
                              </div>
                            )}
                          </div>
                        )) || <p className="text-sm text-slate-400">No clear long setups</p>}
                      </div>
                    </CardContent>
                  </Card>

                  {/* SHORT ZONES */}
                  <Card className={`${isDark ? 'bg-gradient-to-br from-red-950/50 to-slate-900 border-red-800/50' : 'bg-gradient-to-br from-red-50 to-white border-red-200'}`}>
                    <CardContent className="p-6">
                      <h3 className="text-2xl font-bold mb-4 flex items-center gap-2 text-red-400">
                        <TrendingDown className="w-6 h-6" />
                        Short Setups
                      </h3>
                      <div className="space-y-3">
                        {analysis.entry_zones.short_opportunities?.map((opp, idx) => (
                          <div key={idx} className={`p-4 rounded-lg ${isDark ? 'bg-slate-800/50 border border-red-800/30' : 'bg-white border border-red-200'}`}>
                            <div className="flex items-center justify-between mb-2">
                              <span className="font-mono font-bold text-red-400">{opp.zone}</span>
                              <Badge className={
                                opp.confidence === 'High' ? 'bg-red-500' :
                                  opp.confidence === 'Medium' ? 'bg-amber-500' : 'bg-slate-500'
                              }>
                                {opp.confidence}
                              </Badge>
                            </div>
                            <p className={`text-sm mb-2 ${isDark ? 'text-slate-300' : 'text-gray-700'}`}>
                              {opp.reason}
                            </p>
                            {opp.invalidation && (
                              <div className="text-xs text-emerald-400 flex items-center gap-1">
                                <span>❌</span>
                                <span>Invalidation: {opp.invalidation}</span>
                              </div>
                            )}
                          </div>
                        )) || <p className="text-sm text-slate-400">No clear short setups</p>}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              )}

              {/* Action Plan */}
              {analysis.action_plan && (
                <Card className={`${isDark ? 'bg-slate-900/80 border-slate-800' : 'bg-white border-gray-200'}`}>
                  <CardContent className="p-6">
                    <h3 className={`text-2xl font-bold mb-6 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                      💡 Action Plan
                    </h3>
                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <div className="text-sm text-slate-400 mb-2">PRIMARY STRATEGY</div>
                        <p className={`text-lg font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                          {analysis.action_plan.primary_strategy}
                        </p>
                      </div>
                      <div>
                        <div className="text-sm text-slate-400 mb-2">RISK LEVEL</div>
                        <Badge className={
                          analysis.action_plan.risk_level === 'High' ? 'bg-red-500' :
                            analysis.action_plan.risk_level === 'Medium' ? 'bg-amber-500' : 'bg-emerald-500'
                        }>
                          {analysis.action_plan.risk_level}
                        </Badge>
                        <span className={`ml-3 text-sm ${isDark ? 'text-slate-300' : 'text-gray-700'}`}>
                          Size: {analysis.action_plan.position_sizing}
                        </span>
                      </div>
                    </div>

                    {analysis.action_plan.key_levels && (
                      <div className="mt-4">
                        <div className="text-sm text-slate-400 mb-2">KEY LEVELS TO WATCH</div>
                        <div className="flex flex-wrap gap-2">
                          {analysis.action_plan.key_levels.map((level, idx) => (
                            <Badge key={idx} className="bg-orange-500/20 text-orange-400 border-orange-500/30">
                              {level}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}

                    {analysis.action_plan.avoid && (
                      <div className={`mt-4 p-4 rounded-lg ${isDark ? 'bg-red-500/10 border border-red-500/20' : 'bg-red-50 border border-red-200'}`}>
                        <div className="flex items-start gap-2">
                          <AlertTriangle className="w-5 h-5 text-red-400 mt-0.5" />
                          <div>
                            <div className="text-sm font-bold text-red-400 mb-1">AVOID</div>
                            <p className={`text-sm ${isDark ? 'text-red-300' : 'text-red-700'}`}>
                              {analysis.action_plan.avoid}
                            </p>
                          </div>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              )}

              {/* Scenarios */}
              {analysis.scenarios && (
                <div className="grid md:grid-cols-2 gap-6">
                  <Card className={`${isDark ? 'bg-emerald-950/30 border-emerald-800/30' : 'bg-emerald-50 border-emerald-200'}`}>
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between mb-4">
                        <h4 className="text-lg font-bold text-emerald-400">📈 Bullish Scenario</h4>
                        <Badge className="bg-emerald-500">
                          {analysis.scenarios.bullish?.probability}
                        </Badge>
                      </div>
                      <div className="space-y-2">
                        <div>
                          <div className="text-xs text-slate-400">Trigger</div>
                          <p className={`text-sm ${isDark ? 'text-slate-300' : 'text-gray-700'}`}>
                            {analysis.scenarios.bullish?.trigger}
                          </p>
                        </div>
                        <div>
                          <div className="text-xs text-slate-400">Target</div>
                          <p className="text-lg font-bold text-emerald-400">
                            {analysis.scenarios.bullish?.target}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className={`${isDark ? 'bg-red-950/30 border-red-800/30' : 'bg-red-50 border-red-200'}`}>
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between mb-4">
                        <h4 className="text-lg font-bold text-red-400">📉 Bearish Scenario</h4>
                        <Badge className="bg-red-500">
                          {analysis.scenarios.bearish?.probability}
                        </Badge>
                      </div>
                      <div className="space-y-2">
                        <div>
                          <div className="text-xs text-slate-400">Trigger</div>
                          <p className={`text-sm ${isDark ? 'text-slate-300' : 'text-gray-700'}`}>
                            {analysis.scenarios.bearish?.trigger}
                          </p>
                        </div>
                        <div>
                          <div className="text-xs text-slate-400">Target</div>
                          <p className="text-lg font-bold text-red-400">
                            {analysis.scenarios.bearish?.target}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              )}
            </motion.div>
          )}

          {/* Empty State */}
          {!analysis && !loading && (
            <Card className={`${isDark ? 'bg-slate-900/50 border-slate-800' : 'bg-white border-gray-200'}`}>
              <CardContent className="p-16 text-center">
                <Crown className={`w-20 h-20 mx-auto mb-6 ${isDark ? 'text-slate-700' : 'text-gray-300'}`} />
                <p className={`text-xl ${isDark ? 'text-slate-400' : 'text-gray-600'}`}>
                  Run the premium AI scan powered by OpenAI GPT-4o
                </p>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Trading Coach Chatbot */}
        <TradingCoachChat marketData={marketData} isDark={isDark} />
      </div>
    </FeatureGate>
  );
}