import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Flame } from "lucide-react";
import { motion } from "framer-motion";
import { useLanguage } from "../LanguageContext";

export default function StreakIndicator({ trades }) {
  const { t } = useLanguage();
  
  const calculateStreak = () => {
    const closedTrades = trades
      .filter(t => t.status === 'closed' && t.exit_time && t.pnl !== undefined)
      .sort((a, b) => new Date(b.exit_time) - new Date(a.exit_time));

    if (closedTrades.length === 0) return { days: 0, type: 'none' };

    const tradingDays = {};
    closedTrades.forEach(trade => {
      const date = new Date(trade.exit_time).toDateString();
      if (!tradingDays[date]) {
        tradingDays[date] = { pnl: 0, trades: [] };
      }
      tradingDays[date].pnl += trade.pnl;
      tradingDays[date].trades.push(trade);
    });

    const sortedDays = Object.entries(tradingDays)
      .sort((a, b) => new Date(b[0]) - new Date(a[0]));

    let streakDays = 0;
    let streakType = 'win';

    if (sortedDays.length > 0) {
      const firstDay = sortedDays[0];
      streakType = firstDay[1].pnl >= 0 ? 'win' : 'loss';
      streakDays = 1;

      for (let i = 1; i < sortedDays.length; i++) {
        const currentDay = sortedDays[i];
        const currentType = currentDay[1].pnl >= 0 ? 'win' : 'loss';
        
        if (currentType === streakType) {
          streakDays++;
        } else {
          break;
        }
      }
    }

    return { days: streakDays, type: streakType };
  };

  const streak = calculateStreak();
  const isWinStreak = streak.type === 'win';
  const hasStreak = streak.days > 0;

  if (!hasStreak) return null;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
    >
      <Card className={`bg-gradient-to-br ${
        isWinStreak 
          ? 'from-cyan-900/30 to-blue-900/30 border-cyan-500/30' 
          : 'from-red-900/30 to-orange-900/30 border-red-500/30'
      } backdrop-blur-sm h-full`}>
        <CardContent className="p-4 flex flex-col items-center justify-center h-full">
          <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-2 ${
            isWinStreak ? 'bg-cyan-500/20' : 'bg-red-500/20'
          }`}>
            <Flame className={`w-6 h-6 ${
              isWinStreak ? 'text-cyan-400' : 'text-red-400'
            }`} />
          </div>
          <div className="text-slate-400 text-xs mb-1">{t('tradingJournal.streak.title')}</div>
          <div className={`text-3xl font-bold ${
            isWinStreak ? 'text-cyan-400' : 'text-red-400'
          }`}>
            {streak.days}
          </div>
          <div className="text-slate-300 text-xs mb-2">
            {isWinStreak ? t('tradingJournal.streak.winDays') : t('tradingJournal.streak.lossDays')}
          </div>
          <div className={`text-xl mb-1 ${
            isWinStreak ? 'text-cyan-400' : 'text-red-400'
          }`}>
            {isWinStreak ? '🔥' : '💪'}
          </div>
          <div className="text-slate-300 text-xs text-center">
            {isWinStreak 
              ? t('tradingJournal.streak.keepGoing')
              : t('tradingJournal.streak.comeback')}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}