
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { TrendingUp, TrendingDown, DollarSign, Wallet, PieChart, Activity, X as XIcon } from "lucide-react";
import { motion } from "framer-motion";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart as RechartsPie, Pie, Cell, Sector } from 'recharts';
import moment from "moment";
import TradeDetailsModal from "./TradeDetailsModal";
import CloseTradeModal from "./CloseTradeModal";
import { useLanguage } from "../LanguageContext";

// Custom active shape for pie chart
const renderActiveShape = (props) => {
  const { cx, cy, innerRadius, outerRadius, startAngle, endAngle, fill } = props;

  return (
    <g>
      <Sector
        cx={cx}
        cy={cy}
        innerRadius={innerRadius}
        outerRadius={outerRadius + 10}
        startAngle={startAngle}
        endAngle={endAngle}
        fill={fill}
        stroke={fill}
        strokeWidth={2}
      />
    </g>
  );
};

export default function PortfolioOverview({ trades }) {
  const { t } = useLanguage();
  const [prices, setPrices] = useState({});
  const [connectionStatus, setConnectionStatus] = useState(true);
  const [selectedTrade, setSelectedTrade] = useState(null);
  const [closingTrade, setClosingTrade] = useState(null);
  const [activeIndex, setActiveIndex] = useState(null);

  const getCoinGeckoId = (symbol) => {
    const symbolMap = {
      'BTCUSDT': 'bitcoin',
      'ETHUSDT': 'ethereum',
      'BNBUSDT': 'binancecoin',
      'SOLUSDT': 'solana',
      'XRPUSDT': 'ripple',
      'ADAUSDT': 'cardano',
      'DOGEUSDT': 'dogecoin',
      'MATICUSDT': 'matic-network',
      'DOTUSDT': 'polkadot',
      'AVAXUSDT': 'avalanche-2',
      'LINKUSDT': 'chainlink',
      'ATOMUSDT': 'cosmos',
      'UNIUSDT': 'uniswap',
      'LTCUSDT': 'litecoin',
      'NEARUSDT': 'near',
      'HYPEUSDT': 'hyperliquid',
    };
    return symbolMap[symbol.toUpperCase()] || symbol.toLowerCase().replace('usdt', '');
  };

  useEffect(() => {
    const openTrades = trades.filter(t => t.status === 'open');
    if (openTrades.length === 0) return;

    const fetchPrices = async () => {
      try {
        const uniqueSymbols = [...new Set(openTrades.map(t => getCoinGeckoId(t.symbol)))];
        const ids = uniqueSymbols.join(',');
        const response = await fetch(
          `https://api.coingecko.com/api/v3/simple/price?ids=${ids}&vs_currencies=usd&x_cg_demo_api_key=CG-6VSa9kxfhSwwfN3j1twVhToF`
        );
        const data = await response.json();
        setPrices(data);
        setConnectionStatus(true);
      } catch (error) {
        console.error('Error fetching prices:', error);
        setConnectionStatus(false);
      }
    };

    fetchPrices();
    const interval = setInterval(fetchPrices, 3000);
    return () => clearInterval(interval);
  }, [trades]);

  const portfolioStats = React.useMemo(() => {
    const openTrades = trades.filter(t => t.status === 'open');
    const closedTrades = trades.filter(t => t.status === 'closed');

    const realizedPnL = closedTrades.reduce((sum, t) => sum + (t.pnl || 0), 0);

    let unrealizedPnL = 0;
    const openPositions = openTrades.map(trade => {
      const coinId = getCoinGeckoId(trade.symbol);
      const currentPrice = prices[coinId]?.usd;
      
      let tradePnL = 0;
      if (currentPrice) {
        const priceChange = trade.direction === 'long'
          ? currentPrice - trade.entry_price
          : trade.entry_price - currentPrice;
        tradePnL = priceChange * trade.quantity * (trade.leverage || 1);
        unrealizedPnL += tradePnL;
      }

      return {
        ...trade,
        currentPrice,
        unrealizedPnL: tradePnL
      };
    });

    const totalPnL = realizedPnL + unrealizedPnL;

    const bySymbol = {};
    [...openTrades, ...closedTrades].forEach(trade => {
      if (!bySymbol[trade.symbol]) {
        bySymbol[trade.symbol] = { realized: 0, unrealized: 0, trades: 0 };
      }
      bySymbol[trade.symbol].trades++;
      
      if (trade.status === 'closed') {
        bySymbol[trade.symbol].realized += trade.pnl || 0;
      } else {
        const coinId = getCoinGeckoId(trade.symbol);
        const currentPrice = prices[coinId]?.usd;
        if (currentPrice) {
          const priceChange = trade.direction === 'long'
            ? currentPrice - trade.entry_price
            : trade.entry_price - currentPrice;
          const pnl = priceChange * trade.quantity * (trade.leverage || 1);
          bySymbol[trade.symbol].unrealized += pnl;
        }
      }
    });

    const growthData = closedTrades
      .sort((a, b) => new Date(a.exit_time) - new Date(b.exit_time))
      .reduce((acc, trade, index) => {
        const cumulative = index === 0 
          ? trade.pnl 
          : acc[index - 1].value + trade.pnl;
        
        return [...acc, {
          date: moment(trade.exit_time).format('DD/MM'),
          value: cumulative,
          realized: cumulative,
          total: cumulative + unrealizedPnL
        }];
      }, []);

    if (growthData.length > 0) {
      growthData.push({
        date: t('tradingJournal.calendar.today'),
        value: totalPnL,
        realized: realizedPnL,
        total: totalPnL
      });
    }

    return {
      realizedPnL,
      unrealizedPnL,
      totalPnL,
      openPositions,
      bySymbol,
      growthData
    };
  }, [trades, prices, t]);

  const symbolPieData = Object.entries(portfolioStats.bySymbol).map(([symbol, data]) => ({
    name: symbol,
    value: Math.abs(data.realized + data.unrealized),
    pnl: data.realized + data.unrealized
  })).filter(item => item.value > 0);

  const COLORS = ['#06b6d4', '#10b981', '#f59e0b', '#8b5cf6', '#ec4899', '#ef4444', '#3b82f6'];

  return (
    <>
      <div className="space-y-4">
        {/* כותרת */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-xl flex items-center justify-center">
            <Wallet className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-white">{t('tradingJournal.portfolio.title')}</h2>
            <p className="text-sm text-slate-400">{t('tradingJournal.portfolio.subtitle')}</p>
          </div>
        </div>

        {/* סטטיסטיקות ראשיות */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <Card className="bg-gradient-to-br from-cyan-900/30 to-blue-900/30 border-cyan-500/30">
              <CardContent className="p-4">
                <div className="flex items-center gap-2 mb-2">
                  <DollarSign className="w-5 h-5 text-cyan-400" />
                  <p className="text-xs text-slate-400 uppercase">{t('tradingJournal.portfolio.totalPnL')}</p>
                </div>
                <p className={`text-2xl font-bold ${portfolioStats.totalPnL >= 0 ? 'text-cyan-400' : 'text-red-400'}`}>
                  {portfolioStats.totalPnL >= 0 ? '+' : ''}{portfolioStats.totalPnL.toFixed(2)}$
                </p>
                <p className="text-xs text-slate-400 mt-1">
                  {t('tradingJournal.portfolio.realizedUnrealized')}
                </p>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
            <Card className="bg-gradient-to-br from-green-900/30 to-emerald-900/30 border-green-500/30">
              <CardContent className="p-4">
                <div className="flex items-center gap-2 mb-2">
                  <TrendingUp className="w-5 h-5 text-green-400" />
                  <p className="text-xs text-slate-400 uppercase">{t('tradingJournal.portfolio.realizedPnL')}</p>
                </div>
                <p className={`text-2xl font-bold ${portfolioStats.realizedPnL >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                  {portfolioStats.realizedPnL >= 0 ? '+' : ''}{portfolioStats.realizedPnL.toFixed(2)}$
                </p>
                <p className="text-xs text-slate-400 mt-1">
                  {t('tradingJournal.portfolio.fromClosedTrades')}
                </p>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
            <Card className="bg-gradient-to-br from-blue-900/30 to-indigo-900/30 border-blue-500/30">
              <CardContent className="p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Activity className="w-5 h-5 text-blue-400" />
                  <p className="text-xs text-slate-400 uppercase">{t('tradingJournal.portfolio.unrealizedPnL')}</p>
                  {connectionStatus && portfolioStats.openPositions.length > 0 && (
                    <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-500"></span>
                    </span>
                  )}
                </div>
                <p className={`text-2xl font-bold ${portfolioStats.unrealizedPnL >= 0 ? 'text-blue-400' : 'text-red-400'}`}>
                  {portfolioStats.unrealizedPnL >= 0 ? '+' : ''}{portfolioStats.unrealizedPnL.toFixed(2)}$
                </p>
                <p className="text-xs text-slate-400 mt-1">
                  {portfolioStats.openPositions.length} {t('tradingJournal.portfolio.openPositions')}
                </p>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* גרפים */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* גרף צמיחת תיק */}
          <Card className="bg-slate-900/50 border-slate-800">
            <CardHeader className="border-b border-slate-800 pb-3 px-4 pt-4">
              <CardTitle className="text-sm text-white flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-cyan-400" />
                {t('tradingJournal.portfolio.growth')}
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4">
              {portfolioStats.growthData.length === 0 ? (
                <div className="h-48 flex items-center justify-center">
                  <p className="text-slate-400 text-sm">{t('tradingJournal.portfolio.noClosedTrades')}</p>
                </div>
              ) : (
                <ResponsiveContainer width="100%" height={200}>
                  <AreaChart data={portfolioStats.growthData} margin={{ top: 5, right: 5, left: 5, bottom: 5 }}>
                    <defs>
                      <linearGradient id="colorTotal" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#06b6d4" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                    <XAxis 
                      dataKey="date" 
                      stroke="#64748b"
                      style={{ fontSize: '10px' }}
                    />
                    <YAxis 
                      stroke="#64748b"
                      style={{ fontSize: '10px' }}
                      width={55}
                      tickFormatter={(value) => {
                        if (value >= 1000) return `${(value / 1000).toFixed(1)}k`;
                        return value.toFixed(0);
                      }}
                    />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: '#1e293b',
                        border: '1px solid #334155',
                        borderRadius: '8px',
                        fontSize: '11px'
                      }}
                      formatter={(value, name) => {
                        if (name === 'total') return [`$${value.toFixed(2)}`, t('tradingJournal.portfolio.total')];
                        if (name === 'realized') return [`$${value.toFixed(2)}`, t('tradingJournal.portfolio.realizedPnL')];
                        return [`$${value.toFixed(2)}`, name];
                      }}
                    />
                    <Area 
                      type="monotone" 
                      dataKey="total" 
                      stroke="#06b6d4" 
                      strokeWidth={2}
                      fill="url(#colorTotal)" 
                    />
                  </AreaChart>
                </ResponsiveContainer>
              )}
            </CardContent>
          </Card>

          {/* פירוק לפי סימבול */}
          <Card className="bg-slate-900/50 border-slate-800">
            <CardHeader className="border-b border-slate-800 pb-3 px-4 pt-4">
              <CardTitle className="text-sm text-white flex items-center gap-2">
                <PieChart className="w-4 h-4 text-cyan-400" />
                {t('tradingJournal.portfolio.breakdown')}
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4">
              {symbolPieData.length === 0 ? (
                <div className="h-48 flex items-center justify-center">
                  <p className="text-slate-400 text-sm">{t('tradingJournal.portfolio.noData')}</p>
                </div>
              ) : (
                <div className="flex items-center gap-4">
                  <ResponsiveContainer width="50%" height={200}>
                    <RechartsPie>
                      <Pie
                        data={symbolPieData}
                        cx="50%"
                        cy="50%"
                        innerRadius={40}
                        outerRadius={70}
                        paddingAngle={5}
                        dataKey="value"
                        activeIndex={activeIndex}
                        activeShape={renderActiveShape}
                        onMouseEnter={(_, index) => setActiveIndex(index)}
                        onMouseLeave={() => setActiveIndex(null)}
                      >
                        {symbolPieData.map((entry, index) => (
                          <Cell 
                            key={`cell-${index}`} 
                            fill={COLORS[index % COLORS.length]}
                            opacity={activeIndex === null || activeIndex === index ? 1 : 0.3}
                          />
                        ))}
                      </Pie>
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: '#1e293b',
                          border: '1px solid #334155',
                          borderRadius: '8px',
                          fontSize: '11px'
                        }}
                        formatter={(value, name, props) => [
                          `$${props.payload.pnl.toFixed(2)}`,
                          props.payload.name
                        ]}
                      />
                    </RechartsPie>
                  </ResponsiveContainer>
                  <div className="flex-1 space-y-2">
                    {symbolPieData.map((item, index) => (
                      <div 
                        key={item.name} 
                        className={`flex items-center justify-between text-xs p-2 rounded-lg transition-all duration-200 cursor-pointer ${
                          activeIndex === index 
                            ? 'bg-slate-800/80 scale-105 shadow-lg' 
                            : 'hover:bg-slate-800/50'
                        }`}
                        onMouseEnter={() => setActiveIndex(index)}
                        onMouseLeave={() => setActiveIndex(null)}
                        style={{
                          opacity: activeIndex === null || activeIndex === index ? 1 : 0.5,
                          transition: 'all 0.3s ease'
                        }}
                      >
                        <div className="flex items-center gap-2">
                          <div 
                            className="w-3 h-3 rounded-full transition-transform duration-200" 
                            style={{ 
                              backgroundColor: COLORS[index % COLORS.length],
                              transform: activeIndex === index ? 'scale(1.3)' : 'scale(1)'
                            }}
                          />
                          <span className={`font-medium transition-colors duration-200 ${
                            activeIndex === index ? 'text-white' : 'text-slate-300'
                          }`}>
                            {item.name}
                          </span>
                        </div>
                        <span className={`font-bold transition-all duration-200 ${
                          item.pnl >= 0 ? 'text-green-400' : 'text-red-400'
                        } ${activeIndex === index ? 'text-base' : ''}`}>
                          {item.pnl >= 0 ? '+' : ''}{item.pnl.toFixed(2)}$
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* פוזיציות פתוחות */}
        {portfolioStats.openPositions.length > 0 && (
          <Card className="bg-gradient-to-br from-blue-900/30 via-cyan-900/20 to-blue-900/30 border-2 border-cyan-500/50 shadow-lg shadow-cyan-500/20 relative overflow-hidden">
            {/* Animated background glow */}
            <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/10 via-blue-500/10 to-cyan-500/10 animate-pulse" />
            
            <CardHeader className="border-b border-cyan-500/30 pb-3 px-4 pt-4 relative z-10">
              <CardTitle className="text-sm text-white flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <Activity className="w-4 h-4 text-cyan-400" />
                  {t('tradingJournal.portfolio.openPositionsTitle')} ({portfolioStats.openPositions.length})
                </span>
                {connectionStatus && (
                  <span className="text-xs text-cyan-400 flex items-center gap-1 bg-cyan-500/10 px-2 py-1 rounded-full border border-cyan-500/30">
                    <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-500"></span>
                    </span>
                    {t('tradingJournal.portfolio.live')}
                  </span>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 relative z-10">
              <div className="space-y-2">
                {portfolioStats.openPositions.map((position) => (
                  <div 
                    key={position.id} 
                    className="bg-gradient-to-r from-blue-900/40 via-cyan-900/30 to-blue-900/40 backdrop-blur-sm rounded-lg p-3 flex items-center justify-between hover:from-blue-800/50 hover:via-cyan-800/40 hover:to-blue-800/50 transition-all group border border-cyan-500/30 hover:border-cyan-400/60 hover:shadow-lg hover:shadow-cyan-500/20"
                  >
                    <div 
                      onClick={() => setSelectedTrade(position)}
                      className="flex items-center gap-3 flex-1 cursor-pointer"
                    >
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                        position.direction === 'long' ? 'bg-green-500/20 border border-green-500/30' : 'bg-red-500/20 border border-red-500/30'
                      }`}>
                        {position.direction === 'long' ? (
                          <TrendingUp className="w-4 h-4 text-green-400" />
                        ) : (
                          <TrendingDown className="w-4 h-4 text-red-400" />
                        )}
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-bold text-white">{position.symbol}</p>
                        <p className="text-xs text-cyan-300/80">
                          {position.direction === 'long' ? t('tradingJournal.portfolio.long') : t('tradingJournal.portfolio.short')} • 
                          ${position.entry_price.toLocaleString()} → 
                          {position.currentPrice && ` $${position.currentPrice.toLocaleString()}`}
                        </p>
                      </div>
                      <div className="text-right">
                        {position.unrealizedPnL !== 0 && (
                          <>
                            <p className={`text-sm font-bold ${position.unrealizedPnL >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                              {position.unrealizedPnL >= 0 ? '+' : ''}{position.unrealizedPnL.toFixed(2)}$
                            </p>
                            <p className={`text-xs ${position.unrealizedPnL >= 0 ? 'text-green-300' : 'text-red-300'}`}>
                              {position.unrealizedPnL >= 0 ? '+' : ''}
                              {((position.unrealizedPnL / (position.entry_price * position.quantity)) * 100).toFixed(2)}%
                            </p>
                          </>
                        )}
                      </div>
                    </div>
                    <Button
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        setClosingTrade(position);
                      }}
                      className="mr-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 opacity-0 group-hover:opacity-100 transition-opacity shadow-lg"
                    >
                      <XIcon className="w-3 h-3 ml-1" />
                      {t('tradingJournal.portfolio.close')}
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {selectedTrade && (
        <TradeDetailsModal
          trade={selectedTrade}
          onClose={() => setSelectedTrade(null)}
        />
      )}

      {closingTrade && (
        <CloseTradeModal
          trade={closingTrade}
          currentPrice={closingTrade.currentPrice}
          livePnL={closingTrade.unrealizedPnL ? { 
            pnl: closingTrade.unrealizedPnL,
            pnlPercentage: ((closingTrade.unrealizedPnL / (closingTrade.entry_price * closingTrade.quantity)) * 100)
          } : null}
          onClose={() => setClosingTrade(null)}
        />
      )}
    </>
  );
}
