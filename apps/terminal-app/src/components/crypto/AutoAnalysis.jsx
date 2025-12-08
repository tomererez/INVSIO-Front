import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Sparkles, Upload, Loader2, BarChart3 } from "lucide-react";
import { api } from "@/api/client";
import { motion, AnimatePresence } from "framer-motion";
import { useLanguage } from "../LanguageContext";

export default function AutoAnalysis() {
  const { t, language } = useLanguage();
  const [selectedImage, setSelectedImage] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysis, setAnalysis] = useState(null);

  const handleImageUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setSelectedImage(URL.createObjectURL(file));
    setIsAnalyzing(true);
    setAnalysis(null);

    try {
      const { file_url } = await api.integrations.UploadFile({ file });

      const hebrewPrompt = `נתח את התרשים הטכני הזה בפורמט הבא:

**מצב השוק הנוכחי:**
[תיאור קצר של מה רואים בגרף]

**ניתוח פרמטרים:**
• Price Action: [uptrend/downtrend/range/breakout]
• CVD: [increasing/decreasing/flat/divergence]
• Open Interest: [increasing/decreasing/flat]
• Funding Rate: [positive/negative/neutral]
• Volume: [high/normal/low]

**המלצה:**
[המלצה ברורה - לונג/שורט/המתן]

**רמות חשובות:**
• תמיכה: [מחיר]
• התנגדות: [מחיר]
• סטופ לוס מומלץ: [מחיר]

**הסבר מפורט:**
[הסבר מעמיק של הניתוח]`;

      const englishPrompt = `Analyze this technical chart in the following format:

**Current Market State:**
[Brief description of what's visible in the chart]

**Parameters Analysis:**
• Price Action: [uptrend/downtrend/range/breakout]
• CVD: [increasing/decreasing/flat/divergence]
• Open Interest: [increasing/decreasing/flat]
• Funding Rate: [positive/negative/neutral]
• Volume: [high/normal/low]

**Recommendation:**
[Clear recommendation - long/short/wait]

**Key Levels:**
• Support: [price]
• Resistance: [price]
• Recommended Stop Loss: [price]

**Detailed Explanation:**
[In-depth analysis explanation]`;

      const prompt = language === 'he' ? hebrewPrompt : englishPrompt;

      const result = await api.functions.invokeLLM({
        messages: [
          {
            role: 'user', content: [
              { type: 'text', text: prompt },
              { type: 'image_url', image_url: { url: file_url } }
            ]
          }
        ]
      });

      setAnalysis(result);
    } catch (error) {
      console.error("Error analyzing image:", error);
      setAnalysis(language === 'he'
        ? "❌ שגיאה בניתוח התמונה. נסה שוב."
        : "❌ Error analyzing image. Please try again."
      );
    } finally {
      setIsAnalyzing(false);
    }
  };

  const resetAnalysis = () => {
    setSelectedImage(null);
    setAnalysis(null);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6" dir={language === 'he' ? 'rtl' : 'ltr'}>
      {/* Upload Card */}
      <Card className="bg-slate-900/50 border-slate-800 backdrop-blur-sm shadow-2xl">
        <CardContent className="p-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-emerald-500/20 rounded-xl flex items-center justify-center">
              <Sparkles className="w-6 h-6 text-emerald-400" />
            </div>
            <h2 className="text-2xl font-bold text-white">
              {t('cryptoAnalyzer.autoAnalysisTitle')}
            </h2>
          </div>

          {!selectedImage ? (
            <label className="cursor-pointer block">
              <div className="border-2 border-dashed border-slate-700 rounded-xl p-12 hover:border-emerald-500 transition-all duration-300 hover:bg-slate-800/50">
                <Upload className="w-16 h-16 mx-auto mb-4 text-slate-500" />
                <p className="text-white text-lg mb-2 text-center font-semibold">
                  {t('cryptoAnalyzer.uploadChart')}
                </p>
                <p className="text-slate-400 text-center">
                  {t('cryptoAnalyzer.uploadDesc')}
                </p>
              </div>
              <input
                type="file"
                className="hidden"
                accept="image/*"
                onChange={handleImageUpload}
              />
            </label>
          ) : (
            <div className="space-y-4">
              <div className="relative rounded-xl overflow-hidden border-2 border-slate-700">
                <img
                  src={selectedImage}
                  alt="Uploaded chart"
                  className="w-full h-auto"
                />
              </div>

              {!analysis && (
                <button
                  onClick={resetAnalysis}
                  className="w-full py-3 bg-slate-700 hover:bg-slate-600 text-white rounded-xl transition-colors font-medium"
                >
                  {t('cryptoAnalyzer.selectDifferent')}
                </button>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Loading State */}
      <AnimatePresence>
        {isAnalyzing && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <Card className="bg-gradient-to-br from-emerald-900/20 to-teal-900/20 border-emerald-500/30">
              <CardContent className="p-8">
                <div className="flex items-center justify-center gap-3 text-emerald-400">
                  <Loader2 className="w-6 h-6 animate-spin" />
                  <span className="text-lg font-semibold">{t('cryptoAnalyzer.analyzing')}</span>
                </div>
                <p className="text-center text-slate-400 mt-3">
                  {t('cryptoAnalyzer.analyzingDesc')}
                </p>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Analysis Results */}
      <AnimatePresence>
        {analysis && !isAnalyzing && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <Card className="bg-slate-900/50 border-slate-800 backdrop-blur-sm shadow-2xl">
              <CardContent className="p-8">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-emerald-500/20 rounded-xl flex items-center justify-center">
                      <BarChart3 className="w-6 h-6 text-emerald-400" />
                    </div>
                    <h2 className="text-2xl font-bold text-white">
                      {t('cryptoAnalyzer.analysisResults')}
                    </h2>
                  </div>
                  <button
                    onClick={resetAnalysis}
                    className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition-colors font-medium"
                  >
                    {t('cryptoAnalyzer.analyzeNew')}
                  </button>
                </div>

                <div className="prose prose-invert max-w-none">
                  <div className="text-slate-200 whitespace-pre-wrap leading-relaxed text-base">
                    {analysis}
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Info Card */}
      {!selectedImage && (
        <Card className="bg-gradient-to-br from-blue-900/20 to-purple-900/20 border-blue-500/30">
          <CardContent className="p-6">
            <h3 className="text-lg font-semibold text-blue-300 mb-3">
              💡 {t('cryptoAnalyzer.howAutoWorks')}
            </h3>
            <ul className="text-slate-300 text-sm space-y-2">
              <li className="flex items-start gap-2">
                <span className="text-emerald-400 mt-1">✓</span>
                <span>{t('cryptoAnalyzer.autoStep1')}</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-emerald-400 mt-1">✓</span>
                <span>{t('cryptoAnalyzer.autoStep2')}</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-emerald-400 mt-1">✓</span>
                <span>{t('cryptoAnalyzer.autoStep3')}</span>
              </li>
            </ul>
          </CardContent>
        </Card>
      )}
    </div>
  );
}