import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { TrendingUp, Target, DollarSign, Activity, Award, Zap } from "lucide-react";
import { motion } from "framer-motion";
import { useLanguage } from "../LanguageContext";

export default function AdvancedMetrics({ stats, trades }) {
  const { t } = useLanguage();
  
  const advancedStats = React.useMemo(() => {
    const closedTrades = trades.filter(t => t.status === 'closed' && t.exit_time);
    
    const tradingDays = new Set(
      closedTrades.map(t => new Date(t.exit_time).toDateString())
    ).size;

    const avgPnLPerDay = tradingDays > 0 ? stats.totalPnL / tradingDays : 0;

    const dailyPnL = {};
    closedTrades.forEach(trade => {
      const date = new Date(trade.exit_time).toDateString();
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
      title: t('tradingJournal.metrics.avgPnLPerDay'),
      value: `$${advancedStats.avgPnLPerDay.toFixed(2)}`,
      icon: DollarSign,
      color: "from-cyan-500 to-blue-600",
      iconBg: "bg-cyan-500/20",
      iconColor: "text-cyan-400"
    },
    {
      title: t('tradingJournal.metrics.winDays'),
      value: `${advancedStats.winDays}/${advancedStats.tradingDays}`,
      subtitle: `${advancedStats.winDaysPercent.toFixed(1)}%`,
      icon: Activity,
      color: "from-emerald-500 to-teal-600",
      iconBg: "bg-emerald-500/20",
      iconColor: "text-emerald-400"
    },
    {
      title: t('tradingJournal.metrics.profitFactor'),
      value: stats.profitFactor.toFixed(2),
      icon: Award,
      color: "from-purple-500 to-pink-600",
      iconBg: "bg-purple-500/20",
      iconColor: "text-purple-400"
    },
    {
      title: t('tradingJournal.metrics.expectancy'),
      value: `$${stats.expectancy.toFixed(2)}`,
      icon: Zap,
      color: "from-yellow-500 to-amber-600",
      iconBg: "bg-yellow-500/20",
      iconColor: "text-yellow-400"
    },
    {
      title: t('tradingJournal.metrics.avgPnL'),
      value: `$${(stats.totalPnL / (stats.closedTrades || 1)).toFixed(2)}`,
      icon: Target,
      color: "from-indigo-500 to-blue-600",
      iconBg: "bg-indigo-500/20",
      iconColor: "text-indigo-400"
    },
    {
      title: t('tradingJournal.metrics.totalProfit'),
      value: `$${stats.totalPnL.toFixed(2)}`,
      icon: TrendingUp,
      color: stats.totalPnL >= 0 ? "from-cyan-500 to-emerald-600" : "from-red-500 to-orange-600",
      iconBg: stats.totalPnL >= 0 ? "bg-cyan-500/20" : "bg-red-500/20",
      iconColor: stats.totalPnL >= 0 ? "text-cyan-400" : "text-red-400"
    }
  ];

  return (
    <div className="grid grid-cols-3 md:grid-cols-6 gap-2">
      {metrics.map((metric, index) => (
        <motion.div
          key={metric.title}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: index * 0.05 }}
        >
          <Card className="bg-slate-900/50 border-slate-800 backdrop-blur-sm hover:bg-slate-900/70 transition-all">
            <CardContent className="p-2">
              <div className={`w-6 h-6 rounded-lg ${metric.iconBg} flex items-center justify-center mb-1`}>
                <metric.icon className={`w-3 h-3 ${metric.iconColor}`} />
              </div>
              <p className="text-[9px] text-slate-400 mb-0.5 uppercase tracking-wide">{metric.title}</p>
              <p className="text-sm font-bold text-white">{metric.value}</p>
              {metric.subtitle && (
                <p className="text-[10px] text-slate-400 mt-0.5">{metric.subtitle}</p>
              )}
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </div>
  );
}