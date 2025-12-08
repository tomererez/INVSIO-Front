import React, { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, TrendingDown } from "lucide-react";
import { motion } from "framer-motion";

import moment from "moment";
import TradeDetailsModal from "./TradeDetailsModal";

export default function TradeCard({ trade }) {
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [currentPrice, setCurrentPrice] = useState(null);
  const [livePnL, setLivePnL] = useState(null);
  const [connectionStatus, setConnectionStatus] = useState(true);

  const getCoinGeckoId = (symbol) => {
    const symbolMap = {
      'BTCUSDT': 'bitcoin',
      'ETHUSDT': 'ethereum',
      'BNBUSDT': 'binancecoin',
      'SOLUSDT': 'solana',
      'XRPUSDT': 'ripple',
      'ADAUSDT': 'cardano',
      'DOGEUSDT': 'dogecoin',
      'MATICUSDT': 'matic-network',
      'DOTUSDT': 'polkadot',
      'AVAXUSDT': 'avalanche-2',
      'LINKUSDT': 'chainlink',
      'ATOMUSDT': 'cosmos',
      'UNIUSDT': 'uniswap',
      'LTCUSDT': 'litecoin',
      'NEARUSDT': 'near',
      'HYPEUSDT': 'hyperliquid',
    };
    return symbolMap[symbol.toUpperCase()] || symbol.toLowerCase().replace('usdt', '');
  };

  useEffect(() => {
    if (trade.status === 'open') {
      const fetchPrice = async () => {
        try {
          const coinId = getCoinGeckoId(trade.symbol);
          const response = await fetch(
            `https://api.coingecko.com/api/v3/simple/price?ids=${coinId}&vs_currencies=usd&x_cg_demo_api_key=CG-6VSa9kxfhSwwfN3j1twVhToF`
          );
          const data = await response.json();

          if (data[coinId]) {
            const price = data[coinId].usd;
            setCurrentPrice(price);
            setConnectionStatus(true);

            const priceChange = trade.direction === 'long'
              ? price - trade.entry_price
              : trade.entry_price - price;

            const pnl = priceChange * trade.quantity * (trade.leverage || 1);
            const pnlPercentage = (priceChange / trade.entry_price) * 100 * (trade.leverage || 1);

            setLivePnL({ pnl, pnlPercentage });
          }
        } catch (error) {
          console.error('Error fetching price:', error);
          setConnectionStatus(false);
        }
      };

      fetchPrice();
      const interval = setInterval(fetchPrice, 1000);
      return () => clearInterval(interval);
    }
  }, [trade]);

  const displayPnL = trade.status === 'open' && livePnL ? livePnL : { pnl: trade.pnl, pnlPercentage: trade.pnl_percentage };
  const isWin = displayPnL.pnl && displayPnL.pnl > 0;
  const isPending = trade.status === "open";

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        layout
        onClick={() => setShowDetailsModal(true)}
        className="cursor-pointer"
      >
        <Card className={`bg-slate-900/50 border-slate-800 backdrop-blur-sm hover:bg-slate-900/70 hover:border-cyan-500/30 transition-all ${isPending ? 'border-blue-500/30' : ''
          }`}>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3 flex-1">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${trade.direction === "long"
                    ? "bg-green-500/20 text-green-400"
                    : "bg-red-500/20 text-red-400"
                  }`}>
                  {trade.direction === "long" ? (
                    <TrendingUp className="w-5 h-5" />
                  ) : (
                    <TrendingDown className="w-5 h-5" />
                  )}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h3 className="text-lg font-bold text-white">{trade.symbol}</h3>
                    <Badge
                      variant={isPending ? "default" : "secondary"}
                      className={`text-xs ${isPending
                        ? "bg-blue-500/20 text-blue-400 border-blue-500/30"
                        : "bg-slate-800 text-slate-300"}`}
                    >
                      {isPending ? "פתוחה" : "סגורה"}
                    </Badge>
                  </div>
                  <p className="text-xs text-slate-400">
                    {trade.direction === "long" ? "Long" : "Short"} • מינוף {trade.leverage}x
                  </p>
                </div>
              </div>

              {displayPnL.pnl !== undefined && displayPnL.pnl !== null && (
                <div className="text-left">
                  <div className="flex items-center gap-2">
                    <p className={`text-lg font-bold ${isWin ? "text-green-400" : "text-red-400"}`}>
                      {isWin ? "+" : ""}{displayPnL.pnl.toFixed(2)}$
                    </p>
                    {isPending && (
                      <span className="relative flex h-2 w-2">
                        <span className={`animate-ping absolute inline-flex h-full w-full rounded-full ${connectionStatus ? 'bg-emerald-400' : 'bg-red-400'} opacity-75`}></span>
                        <span className={`relative inline-flex rounded-full h-2 w-2 ${connectionStatus ? 'bg-emerald-500' : 'bg-red-500'}`}></span>
                      </span>
                    )}
                  </div>
                  {displayPnL.pnlPercentage && (
                    <p className={`text-xs ${isWin ? "text-green-300" : "text-red-300"}`}>
                      {isWin ? "+" : ""}{displayPnL.pnlPercentage.toFixed(2)}%
                    </p>
                  )}
                </div>
              )}
            </div>

            <div className="mt-2 text-xs text-slate-400">
              {moment(trade.entry_time).format('DD/MM/YYYY HH:mm')}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {showDetailsModal && (
        <TradeDetailsModal
          trade={trade}
          onClose={() => setShowDetailsModal(false)}
        />
      )}
    </>
  );
}