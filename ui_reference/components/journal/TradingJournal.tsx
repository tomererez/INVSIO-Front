
import React, { useEffect, useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  TrendingUp, TrendingDown, Calendar as CalendarIcon, Filter, 
  Download, Plus, Search, ChevronLeft, ChevronRight
} from 'lucide-react';
import { GlassCard } from '../ui/GlassCard';
import { Button } from '../ui/Button';
import { api } from '../../lib/api';
import { Trade, DailyMetric } from '../../types';
import { AddTradeModal } from './modals/AddTradeModal';
import { ImportCSVModal } from './modals/ImportCSVModal';
import { AdvancedMetrics } from './AdvancedMetrics';
import { AIInsightsButton } from './AIInsightsButton';

const formatCurrency = (val: number) => 
  new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(val);

const TradeRow: React.FC<{ trade: Trade }> = ({ trade }) => {
  const isWin = trade.pnl > 0;
  const isOpen = trade.status === 'Open';
  
  return (
    <motion.div 
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="flex items-center justify-between p-4 bg-white/5 border border-white/5 rounded-xl hover:bg-white/10 transition-colors group relative overflow-hidden"
    >
      <div className="flex items-center gap-4 relative z-10">
        <div className={`p-2 rounded-lg ${isOpen ? 'bg-indigo-500/10 text-indigo-400' : isWin ? 'bg-emerald-500/10 text-emerald-400' : 'bg-rose-500/10 text-rose-400'}`}>
          {isOpen ? <div className="w-4 h-4 rounded-full border-2 border-current border-t-transparent animate-spin" /> : isWin ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
        </div>
        <div>
          <div className="flex items-center gap-2">
            <span className="font-bold text-white text-sm">{trade.asset}</span>
            <span className={`text-[10px] px-1.5 py-0.5 rounded border ${trade.type === 'Long' ? 'border-emerald-500/30 text-emerald-400' : 'border-rose-500/30 text-rose-400'}`}>
              {trade.type}
            </span>
            {isOpen && <span className="text-[10px] bg-indigo-500/20 text-indigo-300 px-1.5 py-0.5 rounded">Active</span>}
          </div>
          <div className="text-xs text-slate-500">{trade.entryDate}</div>
        </div>
      </div>
      
      <div className="text-right relative z-10">
        <div className={`font-mono font-medium ${isOpen ? 'text-slate-200' : isWin ? 'text-emerald-400' : 'text-rose-400'}`}>
          {trade.pnl > 0 ? '+' : ''}{formatCurrency(trade.pnl)}
        </div>
        <div className={`text-xs ${isOpen ? 'text-slate-500' : isWin ? 'text-emerald-500/70' : 'text-rose-500/70'}`}>
           {trade.pnlPercent > 0 ? '+' : ''}{trade.pnlPercent}%
        </div>
      </div>
    </motion.div>
  );
};

export const TradingJournal: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [trades, setTrades] = useState<Trade[]>([]);
  const [calendar, setCalendar] = useState<DailyMetric[]>([]);
  
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [showAddModal, setShowAddModal] = useState(false);
  const [showImportModal, setShowImportModal] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [tradesData, calendarData] = await Promise.all([
          api.journal.getTrades(),
          api.journal.getCalendarMetrics()
        ]);
        setTrades(tradesData);
        setCalendar(calendarData);
        setLoading(false);
      } catch (err) {
        console.error(err);
        setLoading(false);
      }
    };
    loadData();
  }, []);

  const filteredTrades = useMemo(() => {
    return trades.filter(trade => {
      const matchesSearch = !search || trade.asset.toLowerCase().includes(search.toLowerCase());
      const matchesStatus = filterStatus === "all" 
        ? true 
        : filterStatus === "open" 
            ? trade.status === "Open"
            : trade.status === "Closed";

      return matchesSearch && matchesStatus;
    });
  }, [trades, search, filterStatus]);

  const stats = useMemo(() => {
    const closedTrades = filteredTrades.filter(t => t.status === "Closed");
    const winningTrades = closedTrades.filter(t => t.pnl > 0);
    const losingTrades = closedTrades.filter(t => t.pnl < 0);
    
    const totalPnL = filteredTrades.reduce((sum, t) => sum + t.pnl, 0);
    const totalWins = winningTrades.length;
    const totalTrades = closedTrades.length;
    
    const winRate = totalTrades > 0 ? Math.round((totalWins / totalTrades) * 100) : 0;
    
    const avgWin = winningTrades.length > 0 ? winningTrades.reduce((a,b) => a + b.pnl, 0) / winningTrades.length : 0;
    const avgLoss = losingTrades.length > 0 ? Math.abs(losingTrades.reduce((a,b) => a + b.pnl, 0) / losingTrades.length) : 0;

    return {
      totalTrades: filteredTrades.length,
      openTrades: filteredTrades.filter(t => t.status === "Open").length,
      closedTrades: closedTrades.length,
      totalPnL,
      winRate,
      profitFactor: avgLoss > 0 ? avgWin / avgLoss : 0,
      avgWin,
      expectancy: totalTrades > 0 ? totalPnL / totalTrades : 0
    };
  }, [filteredTrades]);

  if (loading) return <div className="min-h-screen pt-24 flex justify-center"><div className="w-8 h-8 border-2 border-indigo-500 rounded-full animate-spin border-t-transparent" /></div>;

  return (
    <div className="min-h-screen pt-24 pb-12 px-4 md:px-8 max-w-[1600px] mx-auto animate-in fade-in duration-500 relative">
      
      <AIInsightsButton trades={trades} />

      <div className="flex flex-col md:flex-row justify-between items-end mb-8 gap-4">
        <div>
           <h1 className="text-3xl font-light text-white mb-2">Professional Trading Journal</h1>
           <p className="text-slate-400 text-sm">Analyze your edge. Refine your strategy.</p>
        </div>
        <div className="flex flex-wrap gap-2">
            <div className="relative group">
               <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                  <CalendarIcon className="w-3.5 h-3.5 text-slate-500" />
               </div>
               <input 
                  type="date" 
                  className="bg-white/5 border border-white/10 rounded-full py-2 pl-9 pr-4 text-xs text-white focus:outline-none focus:border-indigo-500 transition-colors h-9"
               />
            </div>

            <Button onClick={() => setShowImportModal(true)} variant="secondary" size="sm">
                <Download className="w-3.5 h-3.5 mr-2" /> Import CSV
            </Button>
            <Button onClick={() => setShowAddModal(true)} variant="primary" size="sm">
                <Plus className="w-3.5 h-3.5 mr-2" /> New Trade
            </Button>
        </div>
      </div>

      <AdvancedMetrics stats={stats} trades={filteredTrades} />

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        
        <div className="xl:col-span-2">
           <GlassCard className="p-6 h-full">
             <div className="flex items-center justify-between mb-6">
                 <h3 className="text-white flex items-center gap-2 font-light">
                    <CalendarIcon className="w-4 h-4 text-indigo-400" /> Trading Calendar
                 </h3>
                 <div className="flex gap-1">
                     <button className="p-1 hover:bg-white/5 rounded text-slate-400 hover:text-white"><ChevronLeft className="w-4 h-4" /></button>
                     <span className="px-3 py-1 text-sm text-slate-300">December 2025</span>
                     <button className="p-1 hover:bg-white/5 rounded text-slate-400 hover:text-white"><ChevronRight className="w-4 h-4" /></button>
                 </div>
             </div>
             
             <div className="grid grid-cols-7 mb-3 text-center">
                 {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(d => (
                     <div key={d} className="text-[10px] text-slate-600 font-bold uppercase tracking-wider">{d}</div>
                 ))}
             </div>

             <div className="grid grid-cols-7 gap-2">
                {calendar.map((day, i) => (
                    <div 
                        key={i} 
                        className={`
                            relative h-28 border rounded-xl p-2 transition-all group
                            ${!day.isCurrentMonth ? 'border-transparent bg-transparent opacity-20' : 
                              day.pnl > 0 ? 'bg-emerald-500/5 border-emerald-500/20 hover:bg-emerald-500/10' :
                              day.pnl < 0 ? 'bg-rose-500/5 border-rose-500/20 hover:bg-rose-500/10' :
                              'bg-white/[0.02] border-white/5 hover:bg-white/5'}
                        `}
                    >
                        <div className="flex justify-between items-start mb-2">
                            <span className={`text-xs font-medium ${day.isCurrentMonth ? 'text-slate-400' : 'text-slate-800'}`}>
                                {day.day}
                            </span>
                            {day.trades > 0 && (
                                <span className="text-[9px] bg-white/5 px-1.5 rounded text-slate-500">
                                    {day.trades}t
                                </span>
                            )}
                        </div>
                        {day.pnl !== 0 && (
                            <div className="absolute inset-0 flex flex-col items-center justify-center">
                                <span className={`text-sm font-bold ${day.pnl > 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                                    {day.pnl > 0 ? '+' : ''}{Math.round(day.pnl)}$
                                </span>
                            </div>
                        )}
                    </div>
                ))}
             </div>
           </GlassCard>
        </div>

        <div className="xl:col-span-1 flex flex-col h-full">
            <GlassCard className="flex-1 flex flex-col p-0 overflow-hidden min-h-[500px]">
                <div className="p-5 border-b border-white/5 bg-white/[0.02]">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-white font-light">Recent Trades</h3>
                        <span className="text-xs px-2 py-1 bg-indigo-500/10 text-indigo-400 rounded-full border border-indigo-500/20">
                            {filteredTrades.length} Found
                        </span>
                    </div>
                    
                    <div className="space-y-3">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                            <input 
                                type="text" 
                                placeholder="Search symbol (e.g. BTC)..." 
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="w-full bg-black/20 border border-white/10 rounded-lg py-2 pl-9 pr-4 text-sm text-white focus:outline-none focus:border-indigo-500 transition-colors placeholder:text-slate-600"
                            />
                        </div>

                        <div className="flex p-1 bg-black/20 rounded-lg border border-white/5">
                            {['all', 'open', 'closed'].map(tab => (
                                <button
                                    key={tab}
                                    onClick={() => setFilterStatus(tab)}
                                    className={`flex-1 py-1.5 text-xs font-medium rounded-md capitalize transition-all ${
                                        filterStatus === tab 
                                        ? 'bg-indigo-600 text-white shadow-lg' 
                                        : 'text-slate-500 hover:text-slate-300'
                                    }`}
                                >
                                    {tab}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto p-2 space-y-2 custom-scrollbar">
                    <AnimatePresence mode="popLayout">
                        {filteredTrades.length > 0 ? (
                            filteredTrades.map(trade => (
                                <TradeRow key={trade.id} trade={trade} />
                            ))
                        ) : (
                            <motion.div 
                                initial={{ opacity: 0 }} 
                                animate={{ opacity: 1 }} 
                                className="flex flex-col items-center justify-center py-12 text-slate-600"
                            >
                                <Filter className="w-8 h-8 mb-2 opacity-50" />
                                <p className="text-sm">No trades match your filters</p>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </GlassCard>
        </div>
      </div>

      <AnimatePresence>
        {showAddModal && (
          <AddTradeModal onClose={() => setShowAddModal(false)} />
        )}

        {showImportModal && (
          <ImportCSVModal onClose={() => setShowImportModal(false)} />
        )}
      </AnimatePresence>

    </div>
  );
};
