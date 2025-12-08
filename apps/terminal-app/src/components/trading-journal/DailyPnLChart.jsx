import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import moment from "moment";
import { useLanguage } from "../LanguageContext";

export default function DailyPnLChart({ trades }) {
  const { t } = useLanguage();
  
  const chartData = React.useMemo(() => {
    const dailyPnL = {};
    
    trades.forEach(trade => {
      if (trade.status === 'closed' && trade.exit_time) {
        const date = moment(trade.exit_time).format('DD/MM');
        if (!dailyPnL[date]) {
          dailyPnL[date] = 0;
        }
        dailyPnL[date] += trade.pnl || 0;
      }
    });

    return Object.entries(dailyPnL)
      .map(([date, pnl]) => ({ date, pnl }))
      .sort((a, b) => {
        const [dayA, monthA] = a.date.split('/');
        const [dayB, monthB] = b.date.split('/');
        return new Date(2025, monthA - 1, dayA) - new Date(2025, monthB - 1, dayB);
      })
      .slice(-30);
  }, [trades]);

  return (
    <Card className="bg-slate-900/50 border-slate-800">
      <CardHeader className="border-b border-slate-800 pb-2 px-3 pt-3">
        <CardTitle className="text-xs text-white">{t('tradingJournal.charts.netDaily')}</CardTitle>
      </CardHeader>
      <CardContent className="p-3">
        {chartData.length === 0 ? (
          <div className="h-40 flex items-center justify-center">
            <p className="text-slate-400 text-xs">{t('tradingJournal.charts.noTrades')}</p>
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={180}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
              <XAxis 
                dataKey="date" 
                stroke="#64748b"
                style={{ fontSize: '9px' }}
              />
              <YAxis 
                stroke="#64748b"
                style={{ fontSize: '9px' }}
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#1e293b',
                  border: '1px solid #334155',
                  borderRadius: '8px',
                  fontSize: '10px'
                }}
                formatter={(value) => [`$${value.toFixed(2)}`, 'PnL']}
              />
              <Bar dataKey="pnl" radius={[4, 4, 0, 0]}>
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.pnl >= 0 ? '#06b6d4' : '#ef4444'} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        )}
      </CardContent>
    </Card>
  );
}