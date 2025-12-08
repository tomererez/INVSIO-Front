
import React, { useState } from "react";
import { api } from "@/api/client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { X, TrendingUp, TrendingDown } from "lucide-react";
import { motion } from "framer-motion";

export default function EditTradeModal({ trade, onClose }) {
  const queryClient = useQueryClient();

  const [formData, setFormData] = useState({
    symbol: trade.symbol || "",
    direction: trade.direction || "long",
    entry_price: trade.entry_price || "",
    exit_price: trade.exit_price || "",
    stop_loss: trade.stop_loss || "",
    quantity: trade.quantity || "",
    // leverage: trade.leverage || "", // Removed as per outline
    position_size_usd: trade.position_size_usd || "", // Kept as per outline
    risk_amount: trade.risk_amount || "", // Kept as per outline
    risk_reward_ratio: trade.risk_reward_ratio || "", // Kept as per outline
    reason: trade.reason || "",
    notes: trade.notes || "",
    entry_time: trade.entry_time ? new Date(trade.entry_time).toISOString().slice(0, 16) : "",
    exit_time: trade.exit_time ? new Date(trade.exit_time).toISOString().slice(0, 16) : "",
    status: trade.status || "open",
    pnl: trade.pnl || "",
    pnl_percentage: trade.pnl_percentage || "",
  });

  const updateTradeMutation = useMutation({
    mutationFn: (data) => api.entities.Trade.update(trade.id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['trades'] });
      onClose();
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();

    const tradeData = {
      ...formData,
      entry_price: parseFloat(formData.entry_price),
      exit_price: formData.exit_price ? parseFloat(formData.exit_price) : undefined,
      stop_loss: formData.stop_loss ? parseFloat(formData.stop_loss) : undefined,
      quantity: parseFloat(formData.quantity),
      // leverage: parseFloat(formData.leverage), // Removed as per outline
      position_size_usd: formData.position_size_usd ? parseFloat(formData.position_size_usd) : undefined, // Kept as per outline
      risk_amount: formData.risk_amount ? parseFloat(formData.risk_amount) : undefined, // Kept as per outline
      risk_reward_ratio: formData.risk_reward_ratio ? parseFloat(formData.risk_reward_ratio) : undefined, // Kept as per outline
      pnl: formData.pnl ? parseFloat(formData.pnl) : undefined,
      pnl_percentage: formData.pnl_percentage ? parseFloat(formData.pnl_percentage) : undefined,
    };

    updateTradeMutation.mutate(tradeData);
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={onClose}>
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-3xl max-h-[90vh] overflow-y-auto"
        dir="rtl"
      >
        <Card className="bg-slate-900 border-slate-800">
          <CardHeader className="border-b border-slate-800 flex flex-row items-center justify-between p-6">
            <CardTitle className="text-xl font-bold text-white">
              עריכת עסקה - {trade.symbol}
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

          <CardContent className="p-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Direction & Status */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-white font-semibold mb-3">כיוון</label>
                  <div className="flex gap-3">
                    <Button
                      type="button"
                      onClick={() => setFormData({ ...formData, direction: "long" })}
                      className={`flex-1 h-12 ${formData.direction === "long"
                        ? "bg-green-600 hover:bg-green-700"
                        : "bg-slate-800 hover:bg-slate-700"
                        }`}
                    >
                      <TrendingUp className="w-4 h-4 ml-2" />
                      Long
                    </Button>
                    <Button
                      type="button"
                      onClick={() => setFormData({ ...formData, direction: "short" })}
                      className={`flex-1 h-12 ${formData.direction === "short"
                        ? "bg-red-600 hover:bg-red-700"
                        : "bg-slate-800 hover:bg-slate-700"
                        }`}
                    >
                      <TrendingDown className="w-4 h-4 ml-2" />
                      Short
                    </Button>
                  </div>
                </div>

                <div>
                  <label className="block text-white font-semibold mb-3">סטטוס</label>
                  <div className="flex gap-3">
                    <Button
                      type="button"
                      onClick={() => setFormData({ ...formData, status: "open" })}
                      className={`flex-1 h-12 ${formData.status === "open"
                        ? "bg-blue-600 hover:bg-blue-700"
                        : "bg-slate-800 hover:bg-slate-700"
                        }`}
                    >
                      פתוחה
                    </Button>
                    <Button
                      type="button"
                      onClick={() => setFormData({ ...formData, status: "closed" })}
                      className={`flex-1 h-12 ${formData.status === "closed"
                        ? "bg-slate-600 hover:bg-slate-700"
                        : "bg-slate-800 hover:bg-slate-700"
                        }`}
                    >
                      סגורה
                    </Button>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Symbol */}
                <div>
                  <label className="block text-white font-semibold mb-2">סימבול</label>
                  <Input
                    required
                    placeholder="BTCUSDT"
                    value={formData.symbol}
                    onChange={(e) => setFormData({ ...formData, symbol: e.target.value.toUpperCase() })}
                    className="bg-slate-800 border-slate-700 text-white h-12"
                  />
                </div>

                {/* Entry Price */}
                <div>
                  <label className="block text-white font-semibold mb-2">מחיר כניסה</label>
                  <Input
                    required
                    type="number"
                    step="0.01"
                    placeholder="100000"
                    value={formData.entry_price}
                    onChange={(e) => setFormData({ ...formData, entry_price: e.target.value })}
                    className="bg-slate-800 border-slate-700 text-white h-12"
                  />
                </div>

                {/* Exit Price */}
                <div>
                  <label className="block text-white font-semibold mb-2">מחיר יציאה</label>
                  <Input
                    type="number"
                    step="0.01"
                    placeholder="102000"
                    value={formData.exit_price}
                    onChange={(e) => setFormData({ ...formData, exit_price: e.target.value })}
                    className="bg-slate-800 border-slate-700 text-white h-12"
                  />
                </div>

                {/* Stop Loss */}
                <div>
                  <label className="block text-white font-semibold mb-2">סטופ לוס</label>
                  <Input
                    type="number"
                    step="0.01"
                    placeholder="98000"
                    value={formData.stop_loss}
                    onChange={(e) => setFormData({ ...formData, stop_loss: e.target.value })}
                    className="bg-slate-800 border-slate-700 text-white h-12"
                  />
                </div>

                {/* Quantity */}
                <div>
                  <label className="block text-white font-semibold mb-2">כמות</label>
                  <Input
                    required
                    type="number"
                    step="0.0001"
                    placeholder="0.1566"
                    value={formData.quantity}
                    onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                    className="bg-slate-800 border-slate-700 text-white h-12"
                  />
                </div>

                {/* PnL */}
                <div>
                  <label className="block text-white font-semibold mb-2">רווח/הפסד ($)</label>
                  <Input
                    type="number"
                    step="0.01"
                    placeholder="500"
                    value={formData.pnl}
                    onChange={(e) => setFormData({ ...formData, pnl: e.target.value })}
                    className="bg-slate-800 border-slate-700 text-white h-12"
                  />
                </div>

                {/* PnL Percentage */}
                <div>
                  <label className="block text-white font-semibold mb-2">רווח/הפסד (%)</label>
                  <Input
                    type="number"
                    step="0.01"
                    placeholder="5.5"
                    value={formData.pnl_percentage}
                    onChange={(e) => setFormData({ ...formData, pnl_percentage: e.target.value })}
                    className="bg-slate-800 border-slate-700 text-white h-12"
                  />
                </div>

                {/* Entry Time */}
                <div>
                  <label className="block text-white font-semibold mb-2">זמן כניסה</label>
                  <Input
                    required
                    type="datetime-local"
                    value={formData.entry_time}
                    onChange={(e) => setFormData({ ...formData, entry_time: e.target.value })}
                    className="bg-slate-800 border-slate-700 text-white h-12"
                  />
                </div>

                {/* Exit Time */}
                <div>
                  <label className="block text-white font-semibold mb-2">זמן יציאה</label>
                  <Input
                    type="datetime-local"
                    value={formData.exit_time}
                    onChange={(e) => setFormData({ ...formData, exit_time: e.target.value })}
                    className="bg-slate-800 border-slate-700 text-white h-12"
                  />
                </div>
              </div>

              {/* Reason */}
              <div>
                <label className="block text-white font-semibold mb-2">סיבת הכניסה לעסקה</label>
                <Textarea
                  placeholder="למה נכנסת לעסקה הזו?"
                  value={formData.reason}
                  onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
                  className="bg-slate-800 border-slate-700 text-white min-h-24"
                />
              </div>

              {/* Notes */}
              <div>
                <label className="block text-white font-semibold mb-2">הערות נוספות</label>
                <Textarea
                  placeholder="הערות, תצפיות או מחשבות..."
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  className="bg-slate-800 border-slate-700 text-white min-h-20"
                />
              </div>

              {/* Submit Button */}
              <div className="flex gap-3">
                <Button
                  type="button"
                  variant="outline"
                  onClick={onClose}
                  className="flex-1 h-14 text-lg font-bold bg-slate-800 border-slate-700 hover:bg-slate-700"
                >
                  ביטול
                </Button>
                <Button
                  type="submit"
                  disabled={updateTradeMutation.isPending}
                  className="flex-1 h-14 text-lg font-bold bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700"
                >
                  {updateTradeMutation.isPending ? "שומר..." : "עדכן עסקה"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
