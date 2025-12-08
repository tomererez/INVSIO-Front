import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

export default function StrategyBreakdown({ trades }) {
  const strategyData = React.useMemo(() => {
    const strategies = {};
    
    trades.forEach(trade => {
      const strategy = trade.strategy || "אחר";
      if (!strategies[strategy]) {
        strategies[strategy] = { wins: 0, losses: 0, totalPnl: 0, count: 0 };
      }
      
      strategies[strategy].count++;
      strategies[strategy].totalPnl += trade.pnl || 0;
      if (trade.pnl > 0) strategies[strategy].wins++;
      else if (trade.pnl < 0) strategies[strategy].losses++;
    });

    return Object.entries(strategies).map(([name, data]) => ({
      name,
      winRate: data.count > 0 ? ((data.wins / data.count) * 100).toFixed(0) : 0,
      pnl: data.totalPnl,
      trades: data.count
    })).sort((a, b) => b.pnl - a.pnl);
  }, [trades]);

  const COLORS = {
    positive: '#10b981',
    negative: '#ef4444'
  };

  return (
    <Card className="bg-slate-900/50 border-slate-800">
      <CardHeader className="border-b border-slate-800 pb-3">
        <CardTitle className="text-base text-white">ביצועים לפי אסטרטגיה</CardTitle>
      </CardHeader>
      <CardContent className="p-4">
        {strategyData.length === 0 ? (
          <div className="h-64 flex items-center justify-center">
            <p className="text-slate-400">אין עדיין נתונים להצגה</p>
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={strategyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
              <XAxis 
                dataKey="name" 
                stroke="#64748b"
                style={{ fontSize: '11px' }}
              />
              <YAxis 
                stroke="#64748b"
                style={{ fontSize: '11px' }}
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#1e293b',
                  border: '1px solid #334155',
                  borderRadius: '8px',
                  fontSize: '12px'
                }}
                content={({ active, payload }) => {
                  if (active && payload && payload[0]) {
                    const data = payload[0].payload;
                    return (
                      <div className="bg-slate-800 border border-slate-700 rounded-lg p-3">
                        <p className="text-white font-semibold mb-1">{data.name}</p>
                        <p className={`text-sm ${data.pnl >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                          רווח: ${data.pnl.toFixed(2)}
                        </p>
                        <p className="text-sm text-slate-300">Win Rate: {data.winRate}%</p>
                        <p className="text-sm text-slate-300">עסקאות: {data.trades}</p>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Bar dataKey="pnl" radius={[8, 8, 0, 0]}>
                {strategyData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.pnl >= 0 ? COLORS.positive : COLORS.negative} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        )}
      </CardContent>
    </Card>
  );
}