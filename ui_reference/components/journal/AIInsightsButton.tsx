import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Brain, TrendingUp, AlertTriangle, Target, Sparkles, RefreshCw, X } from "lucide-react";
import { GlassCard } from "../ui/GlassCard";
import { Button } from "../ui/Button";
import { api } from "../../lib/api";
import { Trade } from "../../types";

interface AIInsightsButtonProps {
  trades: Trade[];
}

export const AIInsightsButton: React.FC<AIInsightsButtonProps> = ({ trades }) => {
  const [showModal, setShowModal] = useState(false);
  const [insights, setInsights] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const analyzeWithAI = async () => {
    setLoading(true);
    setError(null);

    try {
      const closedTrades = trades.filter(t => t.status === 'Closed');
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

      const summary = {
         total_trades: closedTrades.length,
         win_rate: winRate,
         total_pnl: totalPnL,
         avg_win: avgWin,
         avg_loss: avgLoss,
         profit_factor: avgLoss > 0 ? avgWin / avgLoss : 0
      };

      const prompt = `
        Act as a professional trading coach. Analyze the following data:
        Summary: ${JSON.stringify(summary)}
        Top Wins: ${JSON.stringify(winningTrades.slice(0, 3))}
        Top Losses: ${JSON.stringify(losingTrades.slice(0, 3))}
        
        Provide:
        1. Winning Patterns
        2. Improvements
        3. Forecast
        4. Recommended Strategy
      `;

      const response = await api.journal.invokeLLM(prompt);
      setInsights(response);

    } catch (err) {
      console.error('Error analyzing with AI:', err);
      setError('Analysis failed. Please try again.');
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
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        className="fixed bottom-8 left-8 z-40"
      >
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleButtonClick}
          className="relative w-14 h-14 rounded-full bg-gradient-to-br from-indigo-600 to-purple-600 shadow-[0_0_30px_rgba(79,70,229,0.5)] flex items-center justify-center group border border-white/20"
        >
          <span className="absolute inset-0 rounded-full bg-indigo-500 animate-ping opacity-20"></span>
          <Brain className="w-6 h-6 text-white relative z-10" />
          
          <div className="absolute left-full ml-4 px-3 py-1.5 bg-slate-900 border border-white/10 text-white text-xs font-medium rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
            AI Trade Coach
          </div>
        </motion.button>
      </motion.div>

      <AnimatePresence>
        {showModal && (
          <div className="fixed inset-0 bg-void/90 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setShowModal(false)}>
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-4xl max-h-[85vh] overflow-y-auto"
            >
              <GlassCard className="p-0 overflow-hidden border-indigo-500/30">
                <div className="px-6 py-4 border-b border-indigo-500/30 bg-indigo-500/5 flex items-center justify-between sticky top-0 backdrop-blur-md z-10">
                    <div className="flex items-center gap-3">
                         <div className="p-2 rounded-lg bg-indigo-500/20 text-indigo-400">
                             <Brain className="w-5 h-5" />
                         </div>
                         <h3 className="text-xl font-light text-white">AI Coach Insights</h3>
                    </div>
                    <div className="flex gap-2">
                        {!loading && insights && (
                             <Button variant="ghost" onClick={analyzeWithAI} className="!p-2 text-indigo-400 hover:text-white">
                                <RefreshCw className="w-4 h-4" />
                             </Button>
                        )}
                        <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-white transition-colors">
                            <X className="w-6 h-6" />
                        </button>
                    </div>
                </div>

                <div className="p-8">
                   <AnimatePresence mode="wait">
                        {loading ? (
                            <motion.div initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} className="flex flex-col items-center justify-center py-12">
                                <div className="w-12 h-12 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin mb-4" />
                                <p className="text-indigo-300 animate-pulse">Analyzing 42 data points...</p>
                            </motion.div>
                        ) : error ? (
                             <motion.div initial={{opacity:0}} animate={{opacity:1}} className="text-center py-12 text-rose-400">
                                <AlertTriangle className="w-12 h-12 mx-auto mb-4" />
                                <p>{error}</p>
                             </motion.div>
                        ) : insights ? (
                             <motion.div initial={{opacity:0}} animate={{opacity:1}} className="space-y-6">
                                <InsightBlock 
                                    title="Winning Patterns" 
                                    icon={<TrendingUp className="w-5 h-5" />} 
                                    color="text-emerald-400" 
                                    content={extractSection(insights, 'Winning Patterns')}
                                />
                                <InsightBlock 
                                    title="Improvements Needed" 
                                    icon={<AlertTriangle className="w-5 h-5" />} 
                                    color="text-rose-400" 
                                    content={extractSection(insights, 'Improvements')}
                                />
                                <InsightBlock 
                                    title="Market Forecast" 
                                    icon={<Sparkles className="w-5 h-5" />} 
                                    color="text-cyan-400" 
                                    content={extractSection(insights, 'Forecast')}
                                />
                                <InsightBlock 
                                    title="Recommended Strategy" 
                                    icon={<Target className="w-5 h-5" />} 
                                    color="text-indigo-400" 
                                    content={extractSection(insights, 'Recommended Strategy')}
                                    isHighlight
                                />
                             </motion.div>
                        ) : (
                             <div className="text-center py-12">
                                <Button onClick={analyzeWithAI} variant="primary">Generate Insights</Button>
                             </div>
                        )}
                   </AnimatePresence>
                </div>

              </GlassCard>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};

const InsightBlock: React.FC<{title: string, icon: React.ReactNode, color: string, content: string, isHighlight?: boolean}> = ({title, icon, color, content, isHighlight}) => (
    <div className={`p-5 rounded-xl border ${isHighlight ? 'bg-indigo-500/10 border-indigo-500/30' : 'bg-white/5 border-white/5'}`}>
        <div className={`flex items-center gap-2 mb-3 font-medium ${color}`}>
            {icon} {title}
        </div>
        <div className="text-slate-300 text-sm leading-relaxed whitespace-pre-line pl-7" dangerouslySetInnerHTML={{ __html: formatMarkdown(content) }} />
    </div>
);

function extractSection(text: string, sectionName: string) {
  if (!text) return '';
  const regex = new RegExp(`\\*\\*${sectionName}[:\\*\\*]*([\\s\\S]*?)(?=\\*\\*[A-Z]|$)`, 'i');
  const match = text.match(regex);
  return match && match[1] ? match[1].trim() : '';
}

function formatMarkdown(text: string) {
  if (!text) return 'No data available.';
  return text
    .replace(/^- (.*?)$/gm, '<li class="ml-4 list-disc marker:text-slate-500">$1</li>')
    .replace(/\*\*(.*?)\*\*/g, '<strong class="text-white font-semibold">$1</strong>');
}