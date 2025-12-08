import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, TrendingDown } from "lucide-react";
import moment from "moment";
import TradeDetailsModal from "./TradeDetailsModal";
import { useLanguage } from "../LanguageContext";

export default function TradesTimeline({ trades }) {
  const { t, language } = useLanguage();
  
  // Filter only closed trades and get the latest 10
  const closedTrades = trades.filter(trade => trade.status === 'closed');
  const recentTrades = closedTrades.slice(0, 10);
  const [selectedTrade, setSelectedTrade] = useState(null);

  return (
    <>
      <Card className="bg-slate-900/50 border-slate-800">
        <CardHeader className="border-b border-slate-800 pb-3">
          <CardTitle className="text-base text-white">
            {language === 'he' ? 'עסקאות שנסגרו לאחרונה' : 'Recently Closed Trades'}
          </CardTitle>
        </CardHeader>
        <CardContent className="p-4">
          <div className="space-y-3">
            {recentTrades.length === 0 ? (
              <p className="text-center text-slate-400 py-8">
                {language === 'he' ? 'אין עסקאות סגורות עדיין' : 'No closed trades yet'}
              </p>
            ) : (
              recentTrades.map((trade) => (
                <div 
                  key={trade.id} 
                  onClick={() => setSelectedTrade(trade)}
                  className="flex items-center gap-3 p-3 rounded-lg bg-slate-800/50 hover:bg-slate-800 hover:border hover:border-cyan-500/30 transition-all cursor-pointer"
                >
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                    trade.direction === "long" ? "bg-green-500/20" : "bg-red-500/20"
                  }`}>
                    {trade.direction === "long" ? (
                      <TrendingUp className="w-5 h-5 text-green-400" />
                    ) : (
                      <TrendingDown className="w-5 h-5 text-red-400" />
                    )}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-semibold text-white">{trade.symbol}</p>
                      <span className="text-xs px-2 py-0.5 rounded bg-slate-700 text-slate-300">
                        {language === 'he' ? 'סגור' : 'Closed'}
                      </span>
                    </div>
                    <p className="text-xs text-slate-400">
                      {moment(trade.exit_time || trade.entry_time).format('DD/MM/YYYY HH:mm')}
                    </p>
                  </div>

                  {trade.pnl !== undefined && trade.pnl !== null && (
                    <div className="text-right">
                      <p className={`text-sm font-bold ${
                        trade.pnl >= 0 ? "text-green-400" : "text-red-400"
                      }`}>
                        {trade.pnl >= 0 ? "+" : ""}{trade.pnl.toFixed(2)}$
                      </p>
                      {trade.pnl_percentage && (
                        <p className={`text-xs ${
                          trade.pnl >= 0 ? "text-green-300" : "text-red-300"
                        }`}>
                          {trade.pnl >= 0 ? "+" : ""}{trade.pnl_percentage.toFixed(1)}%
                        </p>
                      )}
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>

      {selectedTrade && (
        <TradeDetailsModal
          trade={selectedTrade}
          onClose={() => setSelectedTrade(null)}
        />
      )}
    </>
  );
}