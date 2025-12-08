import React, { useState } from "react";
import { api } from "@/api/client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { X, TrendingUp, TrendingDown, DollarSign } from "lucide-react";
import { motion } from "framer-motion";

export default function CloseTradeModal({ trade, currentPrice, livePnL, onClose }) {
  const queryClient = useQueryClient();
  const [closeReason, setCloseReason] = useState("");

  const closeTradeMutation = useMutation({
    mutationFn: (data) => api.entities.Trade.update(trade.id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['trades'] });
      onClose();
    },
  });

  const handleClose = () => {
    if (!closeReason.trim()) {
      alert("נא למלא סיבת סגירה");
      return;
    }

    const exitPrice = currentPrice || trade.entry_price;
    const pnl = livePnL ? livePnL.pnl : 0;
    const pnlPercentage = livePnL ? livePnL.pnlPercentage : 0;

    const updatedTrade = {
      ...trade,
      status: "closed",
      exit_price: exitPrice,
      exit_time: new Date().toISOString(),
      pnl: pnl,
      pnl_percentage: pnlPercentage,
      notes: trade.notes
        ? `${trade.notes}\n\n--- סיבת סגירה ---\n${closeReason}`
        : `--- סיבת סגירה ---\n${closeReason}`
    };

    closeTradeMutation.mutate(updatedTrade);
  };

  const isProfit = livePnL && livePnL.pnl >= 0;

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={onClose}>
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-2xl"
        dir="rtl"
      >
        <Card className="bg-slate-900 border-slate-800">
          <CardHeader className="border-b border-slate-800 flex flex-row items-center justify-between p-6">
            <CardTitle className="text-xl font-bold text-white">
              סגירת עסקה - {trade.symbol}
            </CardTitle>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="text-slate-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </Button>
          </CardHeader>

          <CardContent className="p-6 space-y-6">
            {/* Trade Summary */}
            <div className="bg-slate-800/50 rounded-xl p-4 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${trade.direction === "long" ? "bg-green-500/20" : "bg-red-500/20"
                    }`}>
                    {trade.direction === "long" ? (
                      <TrendingUp className="w-5 h-5 text-green-400" />
                    ) : (
                      <TrendingDown className="w-5 h-5 text-red-400" />
                    )}
                  </div>
                  <div>
                    <p className="text-white font-bold">{trade.symbol}</p>
                    <p className="text-xs text-slate-400">
                      {trade.direction === "long" ? "Long" : "Short"} • מינוף {trade.leverage}x
                    </p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <p className="text-xs text-slate-400 mb-1">מחיר כניסה</p>
                  <p className="text-sm font-semibold text-white">${trade.entry_price?.toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-400 mb-1">מחיר נוכחי</p>
                  <p className="text-sm font-semibold text-emerald-400">
                    ${currentPrice ? currentPrice.toLocaleString() : trade.entry_price?.toLocaleString()}
                  </p>
                </div>
              </div>

              {livePnL && (
                <div className={`rounded-lg p-4 ${isProfit
                  ? "bg-green-500/10 border border-green-500/30"
                  : "bg-red-500/10 border border-red-500/30"
                  }`}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <DollarSign className={`w-5 h-5 ${isProfit ? "text-green-400" : "text-red-400"}`} />
                      <span className="text-white font-semibold">רווח/הפסד צפוי</span>
                    </div>
                    <div className="text-left">
                      <p className={`text-2xl font-bold ${isProfit ? "text-green-400" : "text-red-400"}`}>
                        {livePnL.pnl >= 0 ? "+" : ""}{livePnL.pnl.toFixed(2)}$
                      </p>
                      <p className={`text-sm ${isProfit ? "text-green-300" : "text-red-300"}`}>
                        {livePnL.pnl >= 0 ? "+" : ""}{livePnL.pnlPercentage.toFixed(2)}%
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Close Reason */}
            <div>
              <label className="block text-white font-semibold mb-2">
                למה אתה סוגר את העסקה? <span className="text-red-400">*</span>
              </label>
              <Textarea
                required
                placeholder="לדוגמה: הגעתי ליעד הרווח, נפגעתי בסטופ לוס, שינוי במגמה, וכו'..."
                value={closeReason}
                onChange={(e) => setCloseReason(e.target.value)}
                className="bg-slate-800 border-slate-700 text-white min-h-32"
              />
              <p className="text-xs text-slate-400 mt-2">
                💡 תעד את הסיבה לסגירה - זה יעזור לך ללמוד ולשפר את המסחר שלך
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                className="flex-1 h-12 text-base font-bold bg-slate-800 border-slate-700 hover:bg-slate-700"
              >
                ביטול
              </Button>
              <Button
                onClick={handleClose}
                disabled={closeTradeMutation.isPending || !closeReason.trim()}
                className={`flex-1 h-12 text-base font-bold ${isProfit
                  ? "bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700"
                  : "bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-700 hover:to-orange-700"
                  }`}
              >
                {closeTradeMutation.isPending ? "סוגר..." : "סגור עסקה"}
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}