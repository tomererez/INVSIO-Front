import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, Calendar, X } from "lucide-react";
import moment from "moment";
import { useLanguage } from "../LanguageContext";
import { motion, AnimatePresence } from "framer-motion";

export default function MonthlyCalendar({ trades }) {
  const { t, language } = useLanguage();
  const [currentMonth, setCurrentMonth] = useState(moment());
  const [selectedDate, setSelectedDate] = useState(null);
  const [showDayModal, setShowDayModal] = useState(false);

  const getDailyPnL = () => {
    const dailyPnL = {};

    trades.forEach((trade) => {
      if (trade.status === 'closed' && trade.exit_time) {
        const date = moment(trade.exit_time).format('YYYY-MM-DD');
        if (!dailyPnL[date]) {
          dailyPnL[date] = 0;
        }
        dailyPnL[date] += trade.pnl || 0;
      }
    });

    return dailyPnL;
  };

  const dailyPnL = getDailyPnL();

  const getDaysInMonth = () => {
    const startOfMonth = currentMonth.clone().startOf('month');
    const endOfMonth = currentMonth.clone().endOf('month');
    const days = [];

    const startDay = startOfMonth.day();
    for (let i = 0; i < startDay; i++) {
      days.push(null);
    }

    for (let date = startOfMonth.clone(); date.isSameOrBefore(endOfMonth); date.add(1, 'day')) {
      days.push(date.clone());
    }

    return days;
  };

  const days = getDaysInMonth();
  const weekDays = ['ראשון', 'שני', 'שלישי', 'רביעי', 'חמישי', 'שישי', 'שבת'];

  const monthStats = React.useMemo(() => {
    const monthStart = currentMonth.clone().startOf('month').format('YYYY-MM-DD');
    const monthEnd = currentMonth.clone().endOf('month').format('YYYY-MM-DD');

    let totalPnL = 0;
    let winDays = 0;
    let lossDays = 0;

    Object.entries(dailyPnL).forEach(([date, pnl]) => {
      if (date >= monthStart && date <= monthEnd) {
        totalPnL += pnl;
        if (pnl > 0) winDays++;
        if (pnl < 0) lossDays++;
      }
    });

    return { totalPnL, winDays, lossDays, totalDays: winDays + lossDays };
  }, [currentMonth, dailyPnL]);

  const getPnLColor = (pnl) => {
    if (pnl > 0) return 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30';
    if (pnl < 0) return 'bg-red-500/20 text-red-400 border border-red-500/30';
    return 'bg-slate-700/30 text-slate-400';
  };

  const handleDayClick = (day, pnl) => {
    if (pnl !== undefined) {
      setSelectedDate(day);
      setShowDayModal(true);
    }
  };

  const getDayTrades = () => {
    if (!selectedDate) return [];
    const dateStr = selectedDate.format('YYYY-MM-DD');
    return trades.filter(trade => 
      trade.status === 'closed' && 
      moment(trade.exit_time).format('YYYY-MM-DD') === dateStr
    );
  };

  const dayTrades = getDayTrades();

  return (
    <>
      <Card className="bg-slate-900/50 border-slate-800">
        <CardHeader className="border-b border-slate-800 pb-3 px-4 pt-4">
          <div className="flex items-center justify-between">
            <CardTitle className="text-base text-white flex items-center gap-2">
              <Calendar className="w-5 h-5 text-cyan-400" />
              {currentMonth.format('MMMM YYYY')}
            </CardTitle>
            <div className="flex items-center gap-1">
              <Button
                variant="outline"
                size="icon"
                onClick={() => setCurrentMonth(currentMonth.clone().subtract(1, 'month'))}
                className="bg-slate-800 border-slate-700 hover:bg-slate-700 text-slate-300 h-8 w-8"
              >
                <ChevronRight className="w-4 h-4" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentMonth(moment())}
                className="bg-slate-800 border-slate-700 hover:bg-slate-700 text-slate-300 h-8 text-xs px-3"
              >
                {t('tradingJournal.calendar.today')}
              </Button>
              <Button
                variant="outline"
                size="icon"
                onClick={() => setCurrentMonth(currentMonth.clone().add(1, 'month'))}
                className="bg-slate-800 border-slate-700 hover:bg-slate-700 text-slate-300 h-8 w-8"
              >
                <ChevronLeft className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
        
        <CardContent className="p-4">
          {/* סטטיסטיקות החודש */}
          <div className="grid grid-cols-4 gap-3 mb-4">
            <div className="bg-slate-800/50 rounded-lg p-3 text-center">
              <div className="text-xs text-slate-400 mb-1">{t('tradingJournal.calendar.totalPnL')}</div>
              <div className={`text-lg font-bold ${monthStats.totalPnL >= 0 ? 'text-cyan-400' : 'text-red-400'}`}>
                ${monthStats.totalPnL.toFixed(2)}
              </div>
            </div>
            <div className="bg-slate-800/50 rounded-lg p-3 text-center">
              <div className="text-xs text-slate-400 mb-1">
                {language === 'he' ? 'ימי רווח' : 'Win Days'}
              </div>
              <div className="text-lg font-bold text-cyan-400">{monthStats.winDays}</div>
            </div>
            <div className="bg-slate-800/50 rounded-lg p-3 text-center">
              <div className="text-xs text-slate-400 mb-1">
                {language === 'he' ? 'ימי הפסד' : 'Loss Days'}
              </div>
              <div className="text-lg font-bold text-red-400">{monthStats.lossDays}</div>
            </div>
            <div className="bg-slate-800/50 rounded-lg p-3 text-center">
              <div className="text-xs text-slate-400 mb-1">{t('tradingJournal.calendar.successRate')}</div>
              <div className="text-lg font-bold text-white">
                {monthStats.totalDays > 0 ? (monthStats.winDays / monthStats.totalDays * 100).toFixed(0) : 0}%
              </div>
            </div>
          </div>

          {/* כותרות ימים */}
          <div className="grid grid-cols-7 gap-1 mb-2">
            {weekDays.map((day) => (
              <div key={day} className="text-center text-xs font-semibold text-slate-400 py-1">
                {day.slice(0, 2)}
              </div>
            ))}
          </div>

          {/* לוח הימים */}
          <div className="grid grid-cols-7 gap-1">
            {days.map((day, index) => {
              if (!day) {
                return <div key={`empty-${index}`} className="aspect-square" />;
              }

              const dateStr = day.format('YYYY-MM-DD');
              const pnl = dailyPnL[dateStr];
              const isToday = day.isSame(moment(), 'day');

              return (
                <div
                  key={dateStr}
                  onClick={() => handleDayClick(day, pnl)}
                  className={`aspect-square rounded-md p-2 flex flex-col items-center justify-center text-center transition-all ${
                    pnl !== undefined ? getPnLColor(pnl) + ' cursor-pointer hover:scale-105' : 'bg-slate-800/30'
                  } ${isToday ? 'ring-2 ring-cyan-500' : ''}`}
                >
                  <div className="text-sm font-semibold text-white mb-1">
                    {day.format('D')}
                  </div>
                  {pnl !== undefined && (
                    <div className="text-xs font-bold">
                      {pnl >= 0 ? '+' : ''}${pnl.toFixed(2)}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Day Trades Modal */}
      <AnimatePresence>
        {showDayModal && selectedDate && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="bg-slate-900 rounded-xl border border-slate-800 shadow-2xl max-w-2xl w-full max-h-[80vh] overflow-hidden"
            >
              <div className="flex items-center justify-between p-6 border-b border-slate-800">
                <div>
                  <h2 className="text-2xl font-bold text-white">
                    {selectedDate.format('DD MMMM YYYY')}
                  </h2>
                  <p className="text-sm text-slate-400 mt-1">
                    {dayTrades.length} {dayTrades.length === 1 ? 'trade' : 'trades'} • 
                    <span className={`font-semibold ml-1 ${dailyPnL[selectedDate.format('YYYY-MM-DD')] >= 0 ? 'text-cyan-400' : 'text-red-400'}`}>
                      {dailyPnL[selectedDate.format('YYYY-MM-DD')] >= 0 ? '+' : ''}
                      ${dailyPnL[selectedDate.format('YYYY-MM-DD')]?.toFixed(2)}
                    </span>
                  </p>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setShowDayModal(false)}
                  className="text-slate-400 hover:text-white"
                >
                  <X className="w-5 h-5" />
                </Button>
              </div>

              <div className="p-6 overflow-y-auto max-h-[calc(80vh-120px)]">
                <div className="space-y-3">
                  {dayTrades.map((trade) => (
                    <div
                      key={trade.id}
                      className="bg-slate-800/50 rounded-lg p-4 border border-slate-700/50 hover:border-cyan-500/30 transition-all"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-3">
                          <div className={`px-2 py-1 rounded text-xs font-semibold ${
                            trade.direction === 'long' 
                              ? 'bg-green-500/20 text-green-400' 
                              : 'bg-red-500/20 text-red-400'
                          }`}>
                            {trade.direction.toUpperCase()}
                          </div>
                          <span className="text-lg font-bold text-white">{trade.symbol}</span>
                        </div>
                        <div className="text-right">
                          <p className={`text-lg font-bold ${trade.pnl >= 0 ? 'text-cyan-400' : 'text-red-400'}`}>
                            {trade.pnl >= 0 ? '+' : ''}${trade.pnl.toFixed(2)}
                          </p>
                          {trade.pnl_percentage && (
                            <p className={`text-xs ${trade.pnl >= 0 ? 'text-cyan-300' : 'text-red-300'}`}>
                              {trade.pnl >= 0 ? '+' : ''}{trade.pnl_percentage.toFixed(2)}%
                            </p>
                          )}
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <p className="text-slate-400 text-xs">Entry</p>
                          <p className="text-white font-semibold">${trade.entry_price.toLocaleString()}</p>
                        </div>
                        <div>
                          <p className="text-slate-400 text-xs">Exit</p>
                          <p className="text-white font-semibold">${trade.exit_price?.toLocaleString()}</p>
                        </div>
                        <div>
                          <p className="text-slate-400 text-xs">Quantity</p>
                          <p className="text-white font-semibold">{trade.quantity}</p>
                        </div>
                        <div>
                          <p className="text-slate-400 text-xs">Leverage</p>
                          <p className="text-white font-semibold">{trade.leverage}x</p>
                        </div>
                      </div>

                      {trade.strategy && (
                        <div className="mt-3 pt-3 border-t border-slate-700">
                          <p className="text-slate-400 text-xs mb-1">Strategy</p>
                          <p className="text-slate-300 text-sm">{trade.strategy}</p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}