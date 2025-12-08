import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { TrendingUp, TrendingDown, AlertTriangle, Target, Brain, Users, Lightbulb, BarChart3 } from "lucide-react";
import PropTypes from 'prop-types';
import { useLanguage } from "../LanguageContext";

function ScenarioResult({ scenario, volume }) {
  const { language } = useLanguage();
  
  if (!scenario) return null;

  const getColorClass = (type) => {
    if (type === "bullish") return "from-green-900/30 to-emerald-900/30 border-green-500/40";
    if (type === "bearish") return "from-red-900/30 to-orange-900/30 border-red-500/40";
    return "from-yellow-900/30 to-amber-900/30 border-yellow-500/40";
  };

  const getIcon = (type) => {
    if (type === "bullish") return <TrendingUp className="w-7 h-7 text-green-400" />;
    if (type === "bearish") return <TrendingDown className="w-7 h-7 text-red-400" />;
    return <AlertTriangle className="w-7 h-7 text-yellow-400" />;
  };

  const volumeInsight = volume && scenario.volumeInsights 
    ? scenario.volumeInsights[volume] 
    : null;

  const labels = language === 'he' ? {
    scenario: 'תרחיש',
    marketInterpretation: 'פרשנות השוק',
    smartMoney: 'Smart Money',
    retailTraders: 'Retail Traders',
    recommendation: 'המלצת פעולה',
    volumeInsight: 'תובנת Volume'
  } : {
    scenario: 'Scenario',
    marketInterpretation: 'Market Interpretation',
    smartMoney: 'Smart Money',
    retailTraders: 'Retail Traders',
    recommendation: 'Action Recommendation',
    volumeInsight: 'Volume Insight'
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
      className="space-y-4"
      dir={language === 'he' ? 'rtl' : 'ltr'}
    >
      {/* Main Card - Scenario Name */}
      <Card className={`bg-gradient-to-br ${getColorClass(scenario.type)} backdrop-blur-sm border-2`}>
        <CardContent className="p-6">
          <div className="flex items-center gap-4 mb-4">
            <div className={`w-14 h-14 rounded-xl flex items-center justify-center ${
              scenario.type === "bullish" ? "bg-green-500/20" :
              scenario.type === "bearish" ? "bg-red-500/20" : "bg-yellow-500/20"
            }`}>
              {getIcon(scenario.type)}
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs font-semibold text-slate-400">
                  {labels.scenario} #{scenario.number}
                </span>
              </div>
              <h3 className="text-2xl font-bold text-white">{scenario.name}</h3>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Market Interpretation */}
      <Card className="bg-slate-900/50 border-slate-800">
        <CardContent className="p-6">
          <div className="flex items-center gap-2 mb-3">
            <BarChart3 className="w-5 h-5 text-cyan-400" />
            <h4 className="text-lg font-semibold text-white">{labels.marketInterpretation}</h4>
          </div>
          <p className="text-slate-300 leading-relaxed">
            {scenario.marketInterpretation}
          </p>
        </CardContent>
      </Card>

      {/* Smart Money vs Retail */}
      <div className="grid md:grid-cols-2 gap-4">
        <Card className="bg-gradient-to-br from-purple-900/20 to-indigo-900/20 border-purple-500/30">
          <CardContent className="p-5">
            <div className="flex items-center gap-2 mb-3">
              <Brain className="w-5 h-5 text-purple-400" />
              <h4 className="text-base font-semibold text-white">{labels.smartMoney}</h4>
            </div>
            <p className="text-slate-300 text-sm leading-relaxed">
              {scenario.smartMoney}
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-orange-900/20 to-red-900/20 border-orange-500/30">
          <CardContent className="p-5">
            <div className="flex items-center gap-2 mb-3">
              <Users className="w-5 h-5 text-orange-400" />
              <h4 className="text-base font-semibold text-white">{labels.retailTraders}</h4>
            </div>
            <p className="text-slate-300 text-sm leading-relaxed">
              {scenario.retail}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Recommendation */}
      <Card className="bg-gradient-to-br from-emerald-900/30 to-teal-900/30 border-emerald-500/40 border-2">
        <CardContent className="p-6">
          <div className="flex items-center gap-2 mb-3">
            <Target className="w-6 h-6 text-emerald-400" />
            <h4 className="text-xl font-bold text-white">{labels.recommendation}</h4>
          </div>
          <p className="text-emerald-100 text-base leading-relaxed font-medium">
            {scenario.recommendation}
          </p>
        </CardContent>
      </Card>

      {/* Volume Insight */}
      {volumeInsight && (
        <Card className="bg-gradient-to-br from-blue-900/20 to-cyan-900/20 border-blue-500/30">
          <CardContent className="p-5">
            <div className="flex items-center gap-2 mb-3">
              <Lightbulb className="w-5 h-5 text-blue-400" />
              <h4 className="text-base font-semibold text-white">{labels.volumeInsight}</h4>
            </div>
            <p className="text-slate-300 text-sm leading-relaxed">
              {volumeInsight}
            </p>
          </CardContent>
        </Card>
      )}
    </motion.div>
  );
}

ScenarioResult.propTypes = {
  scenario: PropTypes.object,
  volume: PropTypes.string
};

export default ScenarioResult;