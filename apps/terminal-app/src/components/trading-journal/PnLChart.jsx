import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import moment from "moment";
import { useLanguage } from "../LanguageContext";

export default function PnLChart({ trades }) {
  const { t } = useLanguage();
  
  const chartData = React.useMemo(() => {
    const closedTrades = trades.filter(t => t.status === "closed" && t.pnl !== undefined);
    
    let cumulative = 0;
    return closedTrades
      .sort((a, b) => new Date(a.exit_time) - new Date(b.exit_time))
      .map(trade => {
        cumulative += trade.pnl || 0;
        return {
          date: moment(trade.exit_time || trade.entry_time).format('DD/MM'),
          pnl: cumulative,
          tradePnl: trade.pnl
        };
      });
  }, [trades]);

  return (
    <Card className="bg-slate-900/50 border-slate-800">
      <CardHeader className="border-b border-slate-800 pb-2 px-3 pt-3">
        <CardTitle className="text-xs text-white">{t('tradingJournal.charts.dailyCumulative')}</CardTitle>
      </CardHeader>
      <CardContent className="p-3">
        {chartData.length === 0 ? (
          <div className="h-40 flex items-center justify-center">
            <p className="text-slate-400 text-xs">{t('tradingJournal.charts.noTrades')}</p>
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={180}>
            <AreaChart data={chartData}>
              <defs>
                <linearGradient id="colorPnl" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#06b6d4" stopOpacity={0}/>
                </linearGradient>
              </defs>
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
                labelStyle={{ color: '#cbd5e1' }}
              />
              <Area 
                type="monotone" 
                dataKey="pnl" 
                stroke="#06b6d4" 
                strokeWidth={2}
                fill="url(#colorPnl)" 
              />
            </AreaChart>
          </ResponsiveContainer>
        )}
      </CardContent>
    </Card>
  );
}