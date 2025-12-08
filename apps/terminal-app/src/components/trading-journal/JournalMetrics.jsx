
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { TrendingUp, TrendingDown, DollarSign, Target, Award, Zap } from "lucide-react";
import { motion } from "framer-motion";

export default function JournalMetrics({ stats }) {
  const metrics = [
    {
      title: "סה\"כ רווח/הפסד",
      value: `$${stats.totalPnL.toFixed(2)}`,
      icon: DollarSign,
      color: stats.totalPnL >= 0 ? "from-cyan-500 to-blue-600" : "from-red-500 to-orange-600",
      iconBg: stats.totalPnL >= 0 ? "bg-cyan-500/20" : "bg-red-500/20",
      iconColor: stats.totalPnL >= 0 ? "text-cyan-400" : "text-red-400"
    },
    {
      title: "אחוז הצלחה",
      value: `${stats.winRate.toFixed(1)}%`,
      icon: Target,
      color: "from-blue-500 to-cyan-600",
      iconBg: "bg-blue-500/20",
      iconColor: "text-blue-400"
    },
    {
      title: "ממוצע רווח",
      value: `$${stats.avgWin.toFixed(2)}`,
      icon: TrendingUp,
      color: "from-cyan-500 to-teal-600",
      iconBg: "bg-cyan-500/20",
      iconColor: "text-cyan-400"
    },
    {
      title: "ממוצע הפסד",
      value: `$${stats.avgLoss.toFixed(2)}`,
      icon: TrendingDown,
      color: "from-orange-500 to-red-600",
      iconBg: "bg-orange-500/20",
      iconColor: "text-orange-400"
    },
    {
      title: "Profit Factor",
      value: stats.profitFactor.toFixed(2),
      icon: Award,
      color: "from-purple-500 to-pink-600",
      iconBg: "bg-purple-500/20",
      iconColor: "text-purple-400"
    },
    {
      title: "Expectancy",
      value: `$${stats.expectancy.toFixed(2)}`,
      icon: Zap,
      color: "from-yellow-500 to-amber-600",
      iconBg: "bg-yellow-500/20",
      iconColor: "text-yellow-400"
    }
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
      {metrics.map((metric, index) => (
        <motion.div
          key={metric.title}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: index * 0.05 }}
        >
          <Card className="bg-slate-900/50 border-slate-800 backdrop-blur-sm hover:bg-slate-900/70 transition-all">
            <CardContent className="p-3">
              <div className={`w-8 h-8 rounded-lg ${metric.iconBg} flex items-center justify-center mb-2`}>
                <metric.icon className={`w-4 h-4 ${metric.iconColor}`} />
              </div>
              <p className="text-[10px] text-slate-400 mb-1 uppercase tracking-wide">{metric.title}</p>
              <p className="text-lg font-bold text-white">{metric.value}</p>
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </div>
  );
}
