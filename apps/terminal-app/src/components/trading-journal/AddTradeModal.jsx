
import React, { useState } from "react";
import { api } from "@/api/client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { X, TrendingUp, TrendingDown } from "lucide-react";
import { motion } from "framer-motion";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function AddTradeModal({ onClose, prefillData = null }) {
  const queryClient = useQueryClient();
  const [tradeType, setTradeType] = useState("open"); // "open" or "closed"

  const [formData, setFormData] = useState({
    symbol: prefillData?.symbol || "",
    direction: prefillData?.direction || "long",
    entry_price: prefillData?.entry_price || "",
    exit_price: prefillData?.exit_price || "",
    stop_loss: prefillData?.stop_loss || "",
    quantity: prefillData?.quantity || "",
    position_size_usd: prefillData?.position_size_usd || "",
    risk_amount: prefillData?.risk_amount || "",
    risk_reward_ratio: prefillData?.risk_reward_ratio || "",
    reason: "",
    notes: "",
    entry_time: new Date().toISOString().slice(0, 16),
    exit_time: "",
    status: "open",
    take_profit_levels: prefillData?.take_profit_levels || [],
    pnl: "",
    pnl_percentage: "",
  });

  const createTradeMutation = useMutation({
    mutationFn: (data) => api.entities.Trade.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['trades'] });
      onClose();
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();

    const tradeData = {
      ...formData,
      status: tradeType,
      entry_price: parseFloat(formData.entry_price),
      exit_price: formData.exit_price ? parseFloat(formData.exit_price) : undefined,
      stop_loss: formData.stop_loss ? parseFloat(formData.stop_loss) : undefined,
      quantity: parseFloat(formData.quantity),
      position_size_usd: formData.position_size_usd ? parseFloat(formData.position_size_usd) : undefined,
      risk_amount: formData.risk_amount ? parseFloat(formData.risk_amount) : undefined,
      risk_reward_ratio: formData.risk_reward_ratio ? parseFloat(formData.risk_reward_ratio) : undefined,
      pnl: formData.pnl ? parseFloat(formData.pnl) : undefined,
      pnl_percentage: formData.pnl_percentage ? parseFloat(formData.pnl_percentage) : undefined,
    };

    createTradeMutation.mutate(tradeData);
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={onClose}>
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-3xl max-h-[90vh] overflow-y-auto"
      >
        <Card className="bg-slate-900 border-slate-800">
          <CardHeader className="border-b border-slate-800 flex flex-row items-center justify-between p-6">
            <CardTitle className="text-xl font-bold text-white">
              הוסף עסקה חדשה
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
            <Tabs value={tradeType} onValueChange={setTradeType} className="w-full mb-6">
              <TabsList className="grid w-full grid-cols-2 bg-slate-800 p-1">
                <TabsTrigger
                  value="open"
                  className="data-[state=active]:bg-blue-600 data-[state=active]:text-white"
                >
                  📊 פוזיציה פתוחה
                </TabsTrigger>
                <TabsTrigger
                  value="closed"
                  className="data-[state=active]:bg-slate-600 data-[state=active]:text-white"
                >
                  📝 עסקה מהעבר
                </TabsTrigger>
              </TabsList>
            </Tabs>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Direction Selection */}
              <div>
                <label className="block text-white font-semibold mb-3">כיוון</label>
                <div className="flex gap-3">
                  <Button
                    type="button"
                    onClick={() => setFormData({ ...formData, direction: "long" })}
                    className={`flex-1 h-14 ${formData.direction === "long"
                      ? "bg-green-600 hover:bg-green-700"
                      : "bg-slate-800 hover:bg-slate-700"
                      }`}
                  >
                    <TrendingUp className="w-5 h-5 ml-2" />
                    Long
                  </Button>
                  <Button
                    type="button"
                    onClick={() => setFormData({ ...formData, direction: "short" })}
                    className={`flex-1 h-14 ${formData.direction === "short"
                      ? "bg-red-600 hover:bg-red-700"
                      : "bg-slate-800 hover:bg-slate-700"
                      }`}
                  >
                    <TrendingDown className="w-5 h-5 ml-2" />
                    Short
                  </Button>
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

                {/* Exit Price - Only for closed trades */}
                {tradeType === "closed" && (
                  <div>
                    <label className="block text-white font-semibold mb-2">מחיר יציאה</label>
                    <Input
                      required={tradeType === "closed"}
                      type="number"
                      step="0.01"
                      placeholder="102000"
                      value={formData.exit_price}
                      onChange={(e) => setFormData({ ...formData, exit_price: e.target.value })}
                      className="bg-slate-800 border-slate-700 text-white h-12"
                    />
                  </div>
                )}

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

                {/* Exit Time - Only for closed trades */}
                {tradeType === "closed" && (
                  <div>
                    <label className="block text-white font-semibold mb-2">זמן יציאה</label>
                    <Input
                      required={tradeType === "closed"}
                      type="datetime-local"
                      value={formData.exit_time}
                      onChange={(e) => setFormData({ ...formData, exit_time: e.target.value })}
                      className="bg-slate-800 border-slate-700 text-white h-12"
                    />
                  </div>
                )}
              </div>

              {/* PnL Fields - Only for closed trades */}
              {tradeType === "closed" && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
                </div>
              )}

              {/* Reason */}
              <div>
                <label className="block text-white font-semibold mb-2">סיבת הכניסה לעסקה</label>
                <Textarea
                  required
                  placeholder="למה נכנסת לעסקה הזו? מה הסטאפ של האנליזה?"
                  value={formData.reason}
                  onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
                  className="bg-slate-800 border-slate-700 text-white min-h-24"
                />
              </div>

              {/* Notes */}
              <div>
                <label className="block text-white font-semibold mb-2">הערות נוספות (אופציונלי)</label>
                <Textarea
                  placeholder="הערות, תצפיות או מחשבות..."
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  className="bg-slate-800 border-slate-700 text-white min-h-20"
                />
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                disabled={createTradeMutation.isPending}
                className="w-full h-14 text-lg font-bold bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700"
              >
                {createTradeMutation.isPending ? "שומר..." : "שמור עסקה"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
