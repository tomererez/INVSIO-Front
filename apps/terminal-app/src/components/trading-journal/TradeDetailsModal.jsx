import React, { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { TrendingUp, TrendingDown, Edit, Trash2, Calendar, X } from "lucide-react";
import { motion } from "framer-motion";
import { api } from "@/api/client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import moment from "moment";
import EditTradeModal from "./EditTradeModal";
import CloseTradeModal from "./CloseTradeModal";
import DeleteConfirmModal from "./DeleteConfirmModal";

export default function TradeDetailsModal({ trade, onClose }) {
  const queryClient = useQueryClient();
  const [showEditModal, setShowEditModal] = useState(false);
  const [showCloseModal, setShowCloseModal] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [currentPrice, setCurrentPrice] = useState(null);
  const [livePnL, setLivePnL] = useState(null);
  const [connectionStatus, setConnectionStatus] = useState(true);

  const deleteTradeMutation = useMutation({
    mutationFn: () => api.entities.Trade.delete(trade.id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['trades'] });
      onClose();
    },
  });

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

  const handleDelete = () => {
    setShowDeleteConfirm(true);
  };

  const confirmDelete = () => {
    deleteTradeMutation.mutate();
    setShowDeleteConfirm(false);
  };

  const displayPnL = trade.status === 'open' && livePnL ? livePnL : { pnl: trade.pnl, pnlPercentage: trade.pnl_percentage };
  const isWin = displayPnL.pnl && displayPnL.pnl > 0;
  const isPending = trade.status === "open";
  const positionSize = trade.position_size_usd || (trade.entry_price * trade.quantity);

  return (
    <>
      <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={onClose}>
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          onClick={(e) => e.stopPropagation()}
          className="w-full max-w-3xl max-h-[90vh] overflow-y-auto"
        >
          <Card className={`bg-slate-900 border-slate-800 ${isPending ? 'border-blue-500/30' : ''}`}>
            <CardContent className="p-6">
              {/* Header */}
              <div className="flex items-start justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${trade.direction === "long"
                    ? "bg-green-500/20 text-green-400"
                    : "bg-red-500/20 text-red-400"
                    }`}>
                    {trade.direction === "long" ? (
                      <TrendingUp className="w-6 h-6" />
                    ) : (
                      <TrendingDown className="w-6 h-6" />
                    )}
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-white">{trade.symbol}</h3>
                    <p className="text-sm text-slate-400">
                      {trade.direction === "long" ? "Long" : "Short"} • מינוף {trade.leverage}x • גודל: ${positionSize.toLocaleString()}
                    </p>
                  </div>
                  <Badge
                    variant={isPending ? "default" : "secondary"}
                    className={isPending
                      ? "bg-blue-500/20 text-blue-400 border-blue-500/30"
                      : "bg-slate-800 text-slate-300"}
                  >
                    {isPending ? "פתוחה" : "סגורה"}
                  </Badge>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={onClose}
                  className="text-slate-400 hover:text-white"
                >
                  <X className="w-5 h-5" />
                </Button>
              </div>

              {/* Trade Details Grid */}
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="bg-slate-800/50 rounded-lg p-4">
                  <p className="text-xs text-slate-400 mb-1">מחיר כניסה</p>
                  <p className="text-lg font-semibold text-white">${trade.entry_price?.toLocaleString()}</p>
                </div>
                {currentPrice && isPending ? (
                  <div className="bg-slate-800/50 rounded-lg p-4">
                    <p className="text-xs text-slate-400 mb-1">מחיר נוכחי</p>
                    <p className="text-lg font-semibold text-emerald-400">${currentPrice.toLocaleString()}</p>
                  </div>
                ) : trade.exit_price ? (
                  <div className="bg-slate-800/50 rounded-lg p-4">
                    <p className="text-xs text-slate-400 mb-1">מחיר יציאה</p>
                    <p className="text-lg font-semibold text-white">${trade.exit_price.toLocaleString()}</p>
                  </div>
                ) : null}
                <div className="bg-slate-800/50 rounded-lg p-4">
                  <p className="text-xs text-slate-400 mb-1">סטופ לוס</p>
                  <p className="text-lg font-semibold text-red-400">${trade.stop_loss?.toLocaleString() || 'N/A'}</p>
                </div>
                <div className="bg-slate-800/50 rounded-lg p-4">
                  <p className="text-xs text-slate-400 mb-1">כמות</p>
                  <p className="text-lg font-semibold text-white">{trade.quantity}</p>
                </div>
              </div>

              {/* PnL Display */}
              {displayPnL.pnl !== undefined && displayPnL.pnl !== null && (
                <div className={`rounded-xl p-6 mb-4 ${isWin
                  ? "bg-green-500/10 border border-green-500/30"
                  : "bg-red-500/10 border border-red-500/30"
                  }`}>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-slate-400 mb-1">
                        {isPending ? "רווח/הפסד נוכחי" : "רווח/הפסד"}
                      </p>
                      <p className={`text-3xl font-bold ${isWin ? "text-green-400" : "text-red-400"}`}>
                        {isWin ? "+" : ""}{displayPnL.pnl.toFixed(2)}$
                      </p>
                      {displayPnL.pnlPercentage && (
                        <p className={`text-sm ${isWin ? "text-green-300" : "text-red-300"}`}>
                          {isWin ? "+" : ""}{displayPnL.pnlPercentage.toFixed(2)}%
                        </p>
                      )}
                    </div>
                    {isPending && (
                      <span className="relative flex h-3 w-3" title="מחירים מתעדכנים בזמן אמת">
                        <span className={`animate-ping absolute inline-flex h-full w-full rounded-full ${connectionStatus ? 'bg-emerald-400' : 'bg-red-400'} opacity-75`}></span>
                        <span className={`relative inline-flex rounded-full h-3 w-3 ${connectionStatus ? 'bg-emerald-500' : 'bg-red-500'}`}></span>
                      </span>
                    )}
                  </div>
                </div>
              )}

              {/* Take Profit Levels */}
              {trade.take_profit_levels && trade.take_profit_levels.length > 0 && (
                <div className="bg-slate-800/50 rounded-lg p-4 mb-4">
                  <p className="text-sm text-slate-400 mb-3 font-semibold">🎯 יעדי רווח:</p>
                  <div className="space-y-2">
                    {trade.take_profit_levels.map((tp, idx) => {
                      const targetPrice = tp.price;
                      const priceChange = trade.direction === 'long'
                        ? targetPrice - trade.entry_price
                        : trade.entry_price - targetPrice;
                      const partialQty = trade.quantity * (tp.percentage / 100);
                      const expectedPnl = priceChange * partialQty * (trade.leverage || 1);

                      return (
                        <div key={idx} className="flex items-center justify-between bg-slate-700/30 p-3 rounded-lg">
                          <div className="flex items-center gap-3">
                            <span className="text-green-400 font-bold">TP{idx + 1}</span>
                            <span className="text-white font-semibold">${tp.price?.toLocaleString()}</span>
                            <span className="text-slate-400 text-sm">({tp.percentage}%)</span>
                          </div>
                          <span className={`font-bold ${expectedPnl >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                            {expectedPnl >= 0 ? '+' : ''}{expectedPnl.toFixed(2)}$
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Reason/Notes */}
              {trade.reason && (
                <div className="bg-slate-800/50 rounded-lg p-4 mb-4">
                  <p className="text-sm text-slate-400 mb-2 font-semibold">סיבת הכניסה:</p>
                  <p className="text-slate-300">{trade.reason}</p>
                </div>
              )}

              {trade.notes && (
                <div className="bg-slate-800/50 rounded-lg p-4 mb-4">
                  <p className="text-sm text-slate-400 mb-2 font-semibold">הערות:</p>
                  <p className="text-slate-300">{trade.notes}</p>
                </div>
              )}

              {/* Date */}
              <div className="flex items-center gap-2 text-sm text-slate-400 mb-6">
                <Calendar className="w-4 h-4" />
                {moment(trade.entry_time).format('DD/MM/YYYY HH:mm')}
              </div>

              {/* Actions */}
              <div className="flex gap-3">
                <Button
                  variant="outline"
                  onClick={() => setShowEditModal(true)}
                  className="flex-1 bg-slate-800 border-slate-700 hover:bg-slate-700 text-slate-300"
                >
                  <Edit className="w-4 h-4 ml-2" />
                  ערוך עסקה
                </Button>
                <Button
                  variant="outline"
                  onClick={handleDelete}
                  disabled={deleteTradeMutation.isPending}
                  className="flex-1 bg-red-500/10 border-red-500/30 hover:bg-red-500/20 text-red-400"
                >
                  <Trash2 className="w-4 h-4 ml-2" />
                  מחק עסקה
                </Button>
                {isPending && (
                  <Button
                    onClick={() => setShowCloseModal(true)}
                    className="flex-1 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700"
                  >
                    סגור פוזיציה
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {showEditModal && (
        <EditTradeModal
          trade={trade}
          onClose={() => setShowEditModal(false)}
        />
      )}

      {showCloseModal && (
        <CloseTradeModal
          trade={trade}
          currentPrice={currentPrice}
          livePnL={livePnL}
          onClose={() => setShowCloseModal(false)}
        />
      )}

      {showDeleteConfirm && (
        <DeleteConfirmModal
          tradeSymbol={trade.symbol}
          onConfirm={confirmDelete}
          onCancel={() => setShowDeleteConfirm(false)}
        />
      )}
    </>
  );
}