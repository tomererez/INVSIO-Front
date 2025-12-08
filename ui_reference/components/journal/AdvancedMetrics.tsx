import React from "react";
import { motion } from "framer-motion";
import { TrendingUp, Target, DollarSign, Activity, Award, Zap } from "lucide-react";
import { GlassCard } from "../ui/GlassCard";
import { Trade } from "../../types";

interface AdvancedMetricsProps {
  stats: any;
  trades: Trade[];
}

export const AdvancedMetrics: React.FC<AdvancedMetricsProps> = ({ stats, trades }) => {
  
  const advancedStats = React.useMemo(() => {
    // Ported Logic: Calculating daily metrics based on user's requirements
    const closedTrades = trades.filter(t => t.status === 'Closed' && t.exitDate !== '-');
    
    // Simplistic date parsing for the mock data format
    const uniqueDates = new Set(closedTrades.map(t => t.exitDate.split(' ')[0]));
    const tradingDays = uniqueDates.size;

    const avgPnLPerDay = tradingDays > 0 ? stats.totalPnL / tradingDays : 0;

    // Calculate winning days
    const dailyPnL: Record<string, number> = {};
    closedTrades.forEach(trade => {
      const date = trade.exitDate.split(' ')[0];
      if (!dailyPnL[date]) dailyPnL[date] = 0;
      dailyPnL[date] += trade.pnl || 0;
    });
    
    const winDays = Object.values(dailyPnL).filter(pnl => pnl > 0).length;
    const winDaysPercent = tradingDays > 0 ? (winDays / tradingDays) * 100 : 0;

    return {
      avgPnLPerDay,
      winDays,
      winDaysPercent,
      tradingDays
    };
  }, [stats, trades]);

  const metrics = [
    {
      title: "Avg PnL / Day",
      value: `$${advancedStats.avgPnLPerDay.toFixed(2)}`,
      icon: DollarSign,
      color: "text-cyan-400",
      bg: "bg-cyan-500/20",
    },
    {
      title: "Win Days",
      value: `${advancedStats.winDays}/${advancedStats.tradingDays}`,
      subtitle: `${advancedStats.winDaysPercent.toFixed(1)}%`,
      icon: Activity,
      color: "text-emerald-400",
      bg: "bg-emerald-500/20",
    },
    {
      title: "Profit Factor",
      value: stats.profitFactor ? stats.profitFactor.toFixed(2) : "0.00",
      icon: Award,
      color: "text-pink-400",
      bg: "bg-pink-500/20",
    },
    {
      title: "Expectancy",
      value: `$${(stats.avgWin * (stats.winRate/100)).toFixed(2)}`, 
      icon: Zap,
      color: "text-amber-400",
      bg: "bg-amber-500/20",
    },
    {
      title: "Avg Trade",
      value: `$${(stats.totalPnL / (stats.closedTrades || 1)).toFixed(2)}`,
      icon: Target,
      color: "text-indigo-400",
      bg: "bg-indigo-500/20",
    },
    {
      title: "Total Profit",
      value: `$${stats.totalPnL.toFixed(2)}`,
      icon: TrendingUp,
      color: stats.totalPnL >= 0 ? "text-emerald-400" : "text-rose-400",
      bg: stats.totalPnL >= 0 ? "bg-emerald-500/20" : "bg-rose-500/20",
    }
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 mb-6">
      {metrics.map((metric, index) => (
        <motion.div
          key={metric.title}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: index * 0.05 }}
        >
          <GlassCard className="p-3 flex flex-col justify-between h-full hover:bg-white/5 transition-colors" hoverEffect={false}>
            <div className={`w-8 h-8 rounded-lg ${metric.bg} flex items-center justify-center mb-2`}>
              <metric.icon className={`w-4 h-4 ${metric.color}`} />
            </div>
            <div>
                <p className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold mb-0.5">{metric.title}</p>
                <p className="text-sm font-bold text-white leading-tight">{metric.value}</p>
                {metric.subtitle && (
                    <p className="text-[10px] text-slate-400 mt-0.5">{metric.subtitle}</p>
                )}
            </div>
          </GlassCard>
        </motion.div>
      ))}
    </div>
  );
};