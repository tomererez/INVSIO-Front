import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Brain, TrendingUp, AlertTriangle, Target, Sparkles, RefreshCw } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { api } from "@/api/client";

export default function AIInsights({ trades }) {
  const [insights, setInsights] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const analyzeWithAI = async () => {
    setLoading(true);
    setError(null);

    try {
      // הכנת הנתונים לניתוח
      const closedTrades = trades.filter(t => t.status === 'closed');
      const winningTrades = closedTrades.filter(t => t.pnl > 0);
      const losingTrades = closedTrades.filter(t => t.pnl < 0);

      // חישוב סטטיסטיקות
      const totalPnL = closedTrades.reduce((sum, t) => sum + (t.pnl || 0), 0);
      const avgWin = winningTrades.length > 0
        ? winningTrades.reduce((sum, t) => sum + t.pnl, 0) / winningTrades.length
        : 0;
      const avgLoss = losingTrades.length > 0
        ? Math.abs(losingTrades.reduce((sum, t) => sum + t.pnl, 0) / losingTrades.length)
        : 0;
      const winRate = closedTrades.length > 0 ? (winningTrades.length / closedTrades.length) * 100 : 0;

      // הכנת נתונים מפורטים
      const tradesSummary = {
        total_trades: closedTrades.length,
        winning_trades: winningTrades.length,
        losing_trades: losingTrades.length,
        total_pnl: totalPnL,
        win_rate: winRate,
        avg_win: avgWin,
        avg_loss: avgLoss,
        profit_factor: avgLoss > 0 ? avgWin / avgLoss : 0,

        // פירוק לפי סימבולים
        symbols: [...new Set(closedTrades.map(t => t.symbol))],

        // דוגמאות למסחרים מנצחים
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

        // דוגמאות למסחרים מפסידים
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

        // פוזיציות פתוחות
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

  return (
    <Card className="bg-gradient-to-br from-purple-900/30 to-blue-900/30 border-purple-500/30">
      <CardHeader className="border-b border-purple-500/30 pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg text-white flex items-center gap-2">
            <Brain className="w-6 h-6 text-purple-400" />
            תובנות AI מתקדמות
          </CardTitle>
          <Button
            onClick={analyzeWithAI}
            disabled={loading || trades.filter(t => t.status === 'closed').length === 0}
            className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
          >
            {loading ? (
              <>
                <RefreshCw className="w-4 h-4 ml-2 animate-spin" />
                מנתח...
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 ml-2" />
                נתח את המסחר שלי
              </>
            )}
          </Button>
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
              <p className="text-slate-400 text-sm">
                ה-AI ינתח את כל העסקאות שלך ויספק המלצות מותאמות אישית
              </p>
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

              <div className="flex justify-center">
                <Button
                  onClick={analyzeWithAI}
                  variant="outline"
                  className="bg-slate-800 border-slate-700 hover:bg-slate-700"
                >
                  <RefreshCw className="w-4 h-4 ml-2" />
                  נתח מחדש
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </CardContent>
    </Card>
  );
}

// פונקציה לחילוץ קטע מסוים מהתשובה
function extractSection(text, sectionName) {
  if (!text) return '';

  // מחפש את הכותרת
  const regex = new RegExp(`\\*\\*${sectionName}[:\\*\\*]*([\\s\\S]*?)(?=\\*\\*[1-4]\\.|\$)`, 'i');
  const match = text.match(regex);

  if (match && match[1]) {
    return match[1].trim();
  }

  // אם לא מצא, מחזיר הכל
  return text;
}

// פונקציה להמרת markdown בסיסי ל-HTML
function formatMarkdown(text) {
  if (!text) return '';

  return text
    // כותרות
    .replace(/### (.*?)$/gm, '<h3 class="text-base font-bold mt-3 mb-2">$1</h3>')
    .replace(/## (.*?)$/gm, '<h2 class="text-lg font-bold mt-4 mb-2">$1</h2>')

    // Bold
    .replace(/\*\*(.*?)\*\*/g, '<strong class="text-white font-bold">$1</strong>')

    // רשימות
    .replace(/^- (.*?)$/gm, '<li class="ml-4 list-disc">$1</li>')
    .replace(/^• (.*?)$/gm, '<li class="ml-4 list-disc">$1</li>')
    .replace(/^\d+\. (.*?)$/gm, '<li class="ml-4 list-decimal">$1</li>')

    // שורות חדשות
    .replace(/\n\n/g, '<br/><br/>')
    .replace(/\n/g, '<br/>');
}