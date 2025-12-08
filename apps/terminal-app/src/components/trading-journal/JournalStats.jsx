import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { TrendingUp, Activity, DollarSign } from "lucide-react";
import { motion } from "framer-motion";

export default function JournalStats({ stats }) {
  const statCards = [
    {
      title: "סה\"כ עסקאות",
      value: stats.totalTrades,
      icon: Activity,
      color: "from-blue-500 to-cyan-600",
    },
    {
      title: "עסקאות פתוחות",
      value: stats.openTrades,
      icon: TrendingUp,
      color: "from-purple-500 to-pink-600",
    },
    {
      title: "רווח/הפסד כולל",
      value: `$${stats.totalPnL.toFixed(2)}`,
      icon: DollarSign,
      color: stats.totalPnL >= 0 ? "from-green-500 to-emerald-600" : "from-red-500 to-orange-600",
    },
    {
      title: "אחוז הצלחה",
      value: `${stats.winRate.toFixed(1)}%`,
      icon: TrendingUp,
      color: "from-emerald-500 to-teal-600",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      {statCards.map((stat, index) => (
        <motion.div
          key={stat.title}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: index * 0.1 }}
        >
          <Card className="bg-slate-900/50 border-slate-800 backdrop-blur-sm hover:bg-slate-900/70 transition-all">
            <CardContent className="p-4 sm:p-6">
              <div className="flex items-center justify-between mb-3">
                <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-gradient-to-r ${stat.color} flex items-center justify-center`}>
                  <stat.icon className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                </div>
              </div>
              <h3 className="text-xs sm:text-sm text-slate-400 mb-1">{stat.title}</h3>
              <p className="text-2xl sm:text-3xl font-bold text-white">{stat.value}</p>
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </div>
  );
}