import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { motion } from "framer-motion";
import { Sparkles, Hand, Brain } from "lucide-react";
import { PageHeader } from "../components/PageHeader";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useLanguage } from "../components/LanguageContext";

import ParameterSelector from "../components/crypto/ParameterSelector";
import ScenarioResult from "../components/crypto/ScenarioResult";
import AutoAnalysis from "../components/crypto/AutoAnalysis";
import { getScenario } from "../components/crypto/scenariosData";
import { FeatureGate } from "../components/FeatureGate";

export default function AIAnalysis() {
  const { t, language } = useLanguage();
  const [priceAction, setPriceAction] = useState("");
  const [cvd, setCvd] = useState("");
  const [openInterest, setOpenInterest] = useState("");
  const [volume, setVolume] = useState("");
  const [scenario, setScenario] = useState(null);
  const [theme, setTheme] = useState('dark');

  useEffect(() => {
    const currentTheme = document.documentElement.getAttribute('data-theme') || 'dark';
    setTheme(currentTheme);

    const observer = new MutationObserver(() => {
      const newTheme = document.documentElement.getAttribute('data-theme') || 'dark';
      setTheme(newTheme);
    });

    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
    return () => observer.disconnect();
  }, []);

  const isDark = theme === 'dark';
  const appleEasing = [0.25, 0.1, 0.25, 1];

  const convertPriceAction = (action) => {
    if (action === "uptrend") return "up";
    if (action === "downtrend") return "down";
    if (action === "range") return "sideways";
    if (action === "breakout") return "up";
    return action;
  };

  const convertCVD = (cvdValue) => {
    if (cvdValue === "increasing") return "positive";
    if (cvdValue === "decreasing") return "negative";
    if (cvdValue === "flat") return "neutral";
    if (cvdValue === "divergence") return "negative";
    return cvdValue;
  };

  const convertOI = (oiValue) => {
    if (oiValue === "increasing") return "rising";
    if (oiValue === "decreasing") return "falling";
    if (oiValue === "flat") return "stable";
    return oiValue;
  };

  useEffect(() => {
    if (priceAction && cvd && openInterest) {
      const convertedPriceAction = convertPriceAction(priceAction);
      const convertedCVD = convertCVD(cvd);
      const convertedOI = convertOI(openInterest);

      const foundScenario = getScenario(convertedPriceAction, convertedCVD, convertedOI, language);
      setScenario(foundScenario);
    } else {
      setScenario(null);
    }
  }, [priceAction, cvd, openInterest, language]);

  return (
    <div className={`min-h-screen ${isDark ? 'bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950' : 'bg-gradient-to-br from-gray-50 via-white to-gray-100'}`} dir={language === 'he' ? 'rtl' : 'ltr'}>
      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <PageHeader
          title="AI Technical"
          highlightText="Analysis"
          subtitle="AI-powered chart analysis and institutional scenario modeling"
          variant="cyan"
        />
      </div>

      {/* Tabs */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        <Tabs defaultValue="auto" className="w-full">
          <TabsList className={`grid w-full max-w-2xl mx-auto grid-cols-2 mb-8 p-1 rounded-xl ${isDark ? 'bg-slate-900 border border-slate-800' : 'bg-white border border-gray-200 shadow-lg'}`}>
            <TabsTrigger
              value="auto"
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-emerald-600 data-[state=active]:to-teal-600 data-[state=active]:text-white rounded-lg transition-all duration-200 flex items-center gap-2"
            >
              <Sparkles className="w-4 h-4" />
              <span className="font-semibold">Auto Analysis</span>
            </TabsTrigger>

            <TabsTrigger
              value="manual"
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-emerald-600 data-[state=active]:to-teal-600 data-[state=active]:text-white rounded-lg transition-all duration-200 flex items-center gap-2"
            >
              <Hand className="w-4 h-4" />
              <span className="font-semibold">Manual Analysis</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="auto" className="mt-0">
            <FeatureGate feature="ai_trade_coach_standard">
              <AutoAnalysis />
            </FeatureGate>
          </TabsContent>

          <TabsContent value="manual" className="mt-0">
            <div className="grid lg:grid-cols-2 gap-8">
              <motion.div
                initial={{ opacity: 0, x: language === 'he' ? -20 : 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className={language === 'he' ? 'lg:order-1' : 'lg:order-2'}
              >
                {scenario ? (
                  <ScenarioResult scenario={scenario} volume={volume} />
                ) : (
                  <Card className={`${isDark ? 'bg-slate-900/30 border-slate-800/50' : 'bg-white border-gray-200 shadow-lg'} backdrop-blur-sm h-full flex items-center justify-center min-h-[600px]`}>
                    <CardContent className="text-center p-12">
                      <div className={`w-24 h-24 ${isDark ? 'bg-slate-800/50' : 'bg-gray-100'} rounded-full flex items-center justify-center mx-auto mb-6`}>
                        <Brain className={`w-12 h-12 ${isDark ? 'text-slate-600' : 'text-gray-400'}`} />
                      </div>
                      <h3 className={`text-2xl font-semibold mb-3 ${isDark ? 'text-slate-400' : 'text-gray-600'}`}>
                        {language === 'he' ? 'בחר את כל הפרמטרים' : 'Select All Parameters'}
                      </h3>
                      <p className={`text-lg max-w-md mx-auto ${isDark ? 'text-slate-500' : 'text-gray-500'}`}>
                        {language === 'he'
                          ? 'לאחר בחירת כל 3 הפרמטרים, תוצג כאן הפרשנות המלאה של מצב השוק'
                          : 'After selecting all 3 parameters, the complete market interpretation will be displayed here'
                        }
                      </p>
                      {(priceAction || cvd || openInterest) && (
                        <div className="mt-6 space-y-2">
                          <p className={`text-xs ${isDark ? 'text-slate-500' : 'text-gray-500'}`}>
                            {language === 'he' ? 'נבחרו:' : 'Selected:'}
                          </p>
                          {priceAction && <p className="text-sm text-emerald-400">✓ Price Action</p>}
                          {cvd && <p className="text-sm text-cyan-400">✓ CVD</p>}
                          {openInterest && <p className="text-sm text-orange-400">✓ Open Interest</p>}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                )}
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: language === 'he' ? 20 : -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className={language === 'he' ? 'lg:order-2' : 'lg:order-1'}
              >
                <Card className={`${isDark ? 'bg-slate-900/50 border-slate-800' : 'bg-white border-gray-200 shadow-lg'} backdrop-blur-sm shadow-2xl`}>
                  <CardContent className="p-8">
                    <div className="flex items-center gap-3 mb-8">
                      <div className={`w-10 h-10 ${isDark ? 'bg-emerald-500/20' : 'bg-emerald-100'} rounded-xl flex items-center justify-center`}>
                        <Hand className="w-6 h-6 text-emerald-400" />
                      </div>
                      <h2 className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                        Market Parameters
                      </h2>
                    </div>
                    <ParameterSelector
                      priceAction={priceAction}
                      setPriceAction={setPriceAction}
                      cvd={cvd}
                      setCvd={setCvd}
                      openInterest={openInterest}
                      setOpenInterest={setOpenInterest}
                      volume={volume}
                      setVolume={setVolume}
                    />
                  </CardContent>
                </Card>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.4 }}
                  className="mt-6"
                >
                  <Card className={`${isDark ? 'bg-gradient-to-br from-emerald-900/20 to-teal-900/20 border-emerald-500/30' : 'bg-gradient-to-br from-emerald-50 to-teal-100 border-emerald-300'} backdrop-blur-sm`}>
                    <CardContent className="p-6">
                      <h3 className={`text-lg font-semibold mb-3 ${isDark ? 'text-emerald-300' : 'text-emerald-700'}`}>
                        💡 {language === 'he' ? 'איך זה עובד?' : 'How Does It Work?'}
                      </h3>
                      <p className={`text-sm leading-relaxed ${isDark ? 'text-slate-300' : 'text-gray-700'}`}>
                        {language === 'he'
                          ? 'בחר את המצב הנוכחי של כל פרמטר, והמערכת תנתח את מצב השוק ותציג תרחיש מפורט עם המלצות פעולה.'
                          : 'Select the current state of each parameter, and the system will analyze the market situation and display a detailed scenario with action recommendations.'
                        }
                      </p>
                    </CardContent>
                  </Card>
                </motion.div>
              </motion.div>
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* Disclaimer */}
      <div className={`border-t ${isDark ? 'border-slate-800/50' : 'border-gray-200'} mt-16`}>
        <div className="max-w-7xl mx-auto px-6 py-8">
          <p className={`text-center text-sm ${isDark ? 'text-slate-500' : 'text-gray-600'}`}>
            ⚠️ {t('cryptoAnalyzer.disclaimer')}
          </p>
        </div>
      </div>
    </div>
  );
}