import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AlertTriangle } from "lucide-react";
import { motion } from "framer-motion";

export default function DeleteConfirmModal({ onConfirm, onCancel, tradeSymbol }) {
  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[60] flex items-center justify-center p-4" onClick={onCancel}>
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-md"
      >
        <Card className="bg-slate-900 border-red-500/30">
          <CardContent className="p-6">
            <div className="flex items-start gap-4 mb-6">
              <div className="w-12 h-12 bg-red-500/20 rounded-xl flex items-center justify-center flex-shrink-0">
                <AlertTriangle className="w-6 h-6 text-red-400" />
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-bold text-white mb-2">
                  מחיקת עסקה
                </h3>
                <p className="text-slate-300 text-sm">
                  האם אתה בטוח שברצונך למחוק את העסקה{' '}
                  <span className="font-bold text-white">{tradeSymbol}</span>?
                </p>
                <p className="text-red-400 text-xs mt-2">
                  ⚠️ פעולה זו בלתי הפיכה ותמחק את כל הנתונים הקשורים לעסקה זו
                </p>
              </div>
            </div>

            <div className="flex gap-3">
              <Button
                onClick={onCancel}
                variant="outline"
                className="flex-1 bg-slate-800 border-slate-700 hover:bg-slate-700 text-slate-300"
              >
                ביטול
              </Button>
              <Button
                onClick={onConfirm}
                className="flex-1 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white"
              >
                מחק עסקה
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}