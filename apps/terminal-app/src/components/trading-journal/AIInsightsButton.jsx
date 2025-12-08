import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Brain, TrendingUp, AlertTriangle, Target, Sparkles, RefreshCw, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { api } from "@/api/client";

export default function AIInsightsButton({ trades }) {
  const [showModal, setShowModal] = useState(false);
  const [insights, setInsights] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const analyzeWithAI = async () => {
    setLoading(true);
    setError(null);

    try {
      const closedTrades = trades.filter(t => t.status === 'closed');
      const winningTrades = closedTrades.filter(t => t.pnl > 0);
      const losingTrades = closedTrades.filter(t => t.pnl < 0);

      const totalPnL = closedTrades.reduce((sum, t) => sum + (t.pnl || 0), 0);
      const avgWin = winningTrades.length > 0
        ? winningTrades.reduce((sum, t) => sum + t.pnl, 0) / winningTrades.length
        : 0;
      const avgLoss = losingTrades.length > 0
        ? Math.abs(losingTrades.reduce((sum, t) => sum + t.pnl, 0) / losingTrades.length)
        : 0;
      const winRate = closedTrades.length > 0 ? (winningTrades.length / closedTrades.length) * 100 : 0;

      const tradesSummary = {
        total_trades: closedTrades.length,
        winning_trades: winningTrades.length,
        losing_trades: losingTrades.length,
        total_pnl: totalPnL,
        win_rate: winRate,
        avg_win: avgWin,
        avg_loss: avgLoss,
        profit_factor: avgLoss > 0 ? avgWin / avgLoss : 0,
        symbols: [...new Set(closedTrades.map(t => t.symbol))],
        top_wins: winningTrades
          .sort((a, b) => b.pnl - a.pnl)
          .slice(0, 5)
          .map(t => ({
            symbol: t.symbol,
            direction: t.direction,
            pnl: t.pnl,
            leverage: t.leverage,
            reason: t.reason,
            entry_price: t.entry_price,
            exit_price: t.exit_price
          })),
        top_losses: losingTrades
          .sort((a, b) => a.pnl - b.pnl)
          .slice(0, 5)
          .map(t => ({
            symbol: t.symbol,
            direction: t.direction,
            pnl: t.pnl,
            leverage: t.leverage,
            reason: t.reason,
            entry_price: t.entry_price,
            exit_price: t.exit_price
          })),
        open_positions: trades.filter(t => t.status === 'open').map(t => ({
          symbol: t.symbol,
          direction: t.direction,
          entry_price: t.entry_price,
          leverage: t.leverage
        }))
      };

      const prompt = `אתה יועץ מסחר מקצועי ומנתח AI. נתח את נתוני המסחר הבאים וספק תובנות מעמיקות:

נתוני סיכום:
- סה"כ עסקאות: ${tradesSummary.total_trades}
- עסקאות מנצחות: ${tradesSummary.winning_trades}
- עסקאות מפסידות: ${tradesSummary.losing_trades}
- אחוז הצלחה: ${tradesSummary.win_rate.toFixed(1)}%
- סה"כ רווח/הפסד: $${tradesSummary.total_pnl.toFixed(2)}
- ממוצע רווח: $${tradesSummary.avg_win.toFixed(2)}
- ממוצע הפסד: $${tradesSummary.avg_loss.toFixed(2)}
- Profit Factor: ${tradesSummary.profit_factor.toFixed(2)}

5 העסקאות הטובות ביותר:
${JSON.stringify(tradesSummary.top_wins, null, 2)}

5 העסקאות הגרועות ביותר:
${JSON.stringify(tradesSummary.top_losses, null, 2)}

פוזיציות פתוחות כרגע:
${JSON.stringify(tradesSummary.open_positions, null, 2)}

אנא ספק:
1. **דפוסים בעסקאות מנצחות**: מה מאפיין את העסקאות המצליחות? (סימבולים, כיוון, מינוף, סיבות כניסה)
2. **שיפורים לעסקאות מפסידות**: מה אפשר לשפר? איפה הטעויות החוזרות?
3. **תחזית ותובנות**: על סמך ההיסטוריה, מה הכיוון הצפוי? אילו סימבולים לעקוב אחריהם?
4. **אסטרטגיה מומלצת**: אסטרטגיית מסחר מותאמת אישית על סמך הביצועים.

השב בעברית, בצורה מפורטת אך קונקרטית. השתמש ב-markdown לעיצוב (כותרות, רשימות, **bold**).`;

      const response = await api.functions.invokeLLM({
        messages: [{ role: 'user', content: prompt }]
      });

      setInsights(response);
    } catch (err) {
      console.error('Error analyzing with AI:', err);
      setError('אירעה שגיאה בניתוח הנתונים. אנא נסה שוב.');
    } finally {
      setLoading(false);
    }
  };

  const handleButtonClick = () => {
    setShowModal(true);
    if (!insights && !loading) {
      analyzeWithAI();
    }
  };

  return (
    <>
      {/* Floating Button */}
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        className="fixed bottom-8 left-8 z-40"
      >
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleButtonClick}
          className="relative w-16 h-16 rounded-full bg-gradient-to-br from-purple-600 to-blue-600 shadow-2xl shadow-purple-500/50 flex items-center justify-center group"
        >
          {/* Pulse Effect */}
          <span className="absolute inset-0 rounded-full bg-purple-500 animate-ping opacity-20"></span>

          {/* Icon */}
          <Brain className="w-8 h-8 text-white relative z-10" />

          {/* Tooltip */}
          <div className="absolute left-full ml-4 px-3 py-2 bg-slate-900 text-white text-sm rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
            תובנות AI מתקדמות
          </div>
        </motion.button>
      </motion.div>

      {/* Modal */}
      <AnimatePresence>
        {showModal && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setShowModal(false)}>
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-5xl max-h-[90vh] overflow-y-auto"
            >
              <Card className="bg-gradient-to-br from-purple-900/30 to-blue-900/30 border-purple-500/30">
                <CardHeader className="border-b border-purple-500/30 pb-4 sticky top-0 bg-slate-900/95 backdrop-blur-lg z-10">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg text-white flex items-center gap-2">
                      <Brain className="w-6 h-6 text-purple-400" />
                      תובנות AI מתקדמות
                    </CardTitle>
                    <div className="flex items-center gap-2">
                      {!loading && insights && (
                        <Button
                          onClick={analyzeWithAI}
                          variant="outline"
                          size="sm"
                          className="bg-slate-800 border-slate-700 hover:bg-slate-700"
                        >
                          <RefreshCw className="w-4 h-4 ml-2" />
                          נתח מחדש
                        </Button>
                      )}
                      <Button
                        onClick={() => setShowModal(false)}
                        variant="ghost"
                        size="icon"
                        className="text-slate-400 hover:text-white"
                      >
                        <X className="w-5 h-5" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="p-6">
                  <AnimatePresence mode="wait">
                    {!insights && !loading && !error && (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="text-center py-12"
                      >
                        <Brain className="w-16 h-16 text-purple-400 mx-auto mb-4 opacity-50" />
                        <p className="text-slate-300 mb-2">קבל תובנות מתקדמות על המסחר שלך</p>
                        <p className="text-slate-400 text-sm mb-6">
                          ה-AI ינתח את כל העסקאות שלך ויספק המלצות מותאמות אישית
                        </p>
                        <Button
                          onClick={analyzeWithAI}
                          disabled={trades.filter(t => t.status === 'closed').length === 0}
                          className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
                        >
                          <Sparkles className="w-4 h-4 ml-2" />
                          נתח את המסחר שלי
                        </Button>
                      </motion.div>
                    )}

                    {loading && (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="text-center py-12"
                      >
                        <RefreshCw className="w-12 h-12 text-purple-400 mx-auto mb-4 animate-spin" />
                        <p className="text-slate-300 mb-2">מנתח את נתוני המסחר שלך...</p>
                        <p className="text-slate-400 text-sm">זה עשוי לקחת מספר שניות</p>
                      </motion.div>
                    )}

                    {error && (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="bg-red-500/10 border border-red-500/30 rounded-lg p-4"
                      >
                        <p className="text-red-300 flex items-center gap-2">
                          <AlertTriangle className="w-5 h-5" />
                          {error}
                        </p>
                      </motion.div>
                    )}

                    {insights && (
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="space-y-6"
                      >
                        {/* Winning Patterns */}
                        <div className="bg-slate-800/50 rounded-lg p-4">
                          <div className="flex items-center gap-2 mb-3">
                            <TrendingUp className="w-5 h-5 text-green-400" />
                            <h3 className="text-lg font-bold text-green-400">דפוסים מנצחים</h3>
                          </div>
                          <div className="text-slate-200 prose prose-invert prose-sm max-w-none prose-headings:text-slate-100 prose-strong:text-white">
                            <div dangerouslySetInnerHTML={{ __html: formatMarkdown(extractSection(insights, 'דפוסים בעסקאות מנצחות')) }} />
                          </div>
                        </div>

                        {/* Improvements */}
                        <div className="bg-slate-800/50 rounded-lg p-4">
                          <div className="flex items-center gap-2 mb-3">
                            <AlertTriangle className="w-5 h-5 text-orange-400" />
                            <h3 className="text-lg font-bold text-orange-400">שיפורים נדרשים</h3>
                          </div>
                          <div className="text-slate-200 prose prose-invert prose-sm max-w-none prose-headings:text-slate-100 prose-strong:text-white">
                            <div dangerouslySetInnerHTML={{ __html: formatMarkdown(extractSection(insights, 'שיפורים לעסקאות מפסידות')) }} />
                          </div>
                        </div>

                        {/* Predictions */}
                        <div className="bg-slate-800/50 rounded-lg p-4">
                          <div className="flex items-center gap-2 mb-3">
                            <Sparkles className="w-5 h-5 text-blue-400" />
                            <h3 className="text-lg font-bold text-blue-400">תחזית ותובנות</h3>
                          </div>
                          <div className="text-slate-200 prose prose-invert prose-sm max-w-none prose-headings:text-slate-100 prose-strong:text-white">
                            <div dangerouslySetInnerHTML={{ __html: formatMarkdown(extractSection(insights, 'תחזית ותובנות')) }} />
                          </div>
                        </div>

                        {/* Strategy */}
                        <div className="bg-gradient-to-r from-purple-900/30 to-blue-900/30 border border-purple-500/30 rounded-lg p-4">
                          <div className="flex items-center gap-2 mb-3">
                            <Target className="w-5 h-5 text-purple-400" />
                            <h3 className="text-lg font-bold text-purple-400">אסטרטגיה מומלצת</h3>
                          </div>
                          <div className="text-slate-200 prose prose-invert prose-sm max-w-none prose-headings:text-slate-100 prose-strong:text-white">
                            <div dangerouslySetInnerHTML={{ __html: formatMarkdown(extractSection(insights, 'אסטרטגיה מומלצת')) }} />
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}

function extractSection(text, sectionName) {
  if (!text) return '';
  const regex = new RegExp(`\\*\\*${sectionName}[:\\*\\*]*([\\s\\S]*?)(?=\\*\\*[1-4]\\.|\$)`, 'i');
  const match = text.match(regex);
  if (match && match[1]) {
    return match[1].trim();
  }
  return text;
}

function formatMarkdown(text) {
  if (!text) return '';

  return text
    .replace(/### (.*?)$/gm, '<h3 class="text-base font-bold mt-3 mb-2">$1</h3>')
    .replace(/## (.*?)$/gm, '<h2 class="text-lg font-bold mt-4 mb-2">$1</h2>')
    .replace(/\*\*(.*?)\*\*/g, '<strong class="text-white font-bold">$1</strong>')
    .replace(/^- (.*?)$/gm, '<li class="ml-4 list-disc">$1</li>')
    .replace(/^• (.*?)$/gm, '<li class="ml-4 list-disc">$1</li>')
    .replace(/^\d+\. (.*?)$/gm, '<li class="ml-4 list-decimal">$1</li>')
    .replace(/\n\n/g, '<br/><br/>')
    .replace(/\n/g, '<br/>');
}