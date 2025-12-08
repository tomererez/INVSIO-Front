import { Card, CardContent } from "@/components/ui/card";
import { TrendingUp, TrendingDown, DollarSign, BarChart3 } from "lucide-react";
import { useLanguage } from "../LanguageContext";

export default function ParameterGuides() {
  const { t, language } = useLanguage();

  return (
    <div className="space-y-6" dir={language === 'he' ? 'rtl' : 'ltr'}>
      {/* Price Action Guide */}
      <Card className="bg-gradient-to-br from-emerald-900/20 to-teal-900/20 border-emerald-500/30">
        <CardContent className="p-6">
          <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-emerald-400" />
            {t('cryptoAnalyzer.guides.priceAction.title')}
          </h3>
          
          <div className="space-y-4 text-slate-300">
            <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp className="w-5 h-5 text-green-400" />
                <span className="font-bold text-green-400">{t('cryptoAnalyzer.guides.priceAction.uptrend')}</span>
              </div>
              <p className="text-sm">
                {t('cryptoAnalyzer.guides.priceAction.uptrendDesc')}
              </p>
            </div>

            <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <TrendingDown className="w-5 h-5 text-red-400" />
                <span className="font-bold text-red-400">{t('cryptoAnalyzer.guides.priceAction.downtrend')}</span>
              </div>
              <p className="text-sm">
                {t('cryptoAnalyzer.guides.priceAction.downtrendDesc')}
              </p>
            </div>

            <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4">
              <p className="text-sm">
                <span className="font-semibold text-blue-400">{t('cryptoAnalyzer.guides.priceAction.range')}</span> {t('cryptoAnalyzer.guides.priceAction.rangeDesc')}
              </p>
            </div>

            <div className="bg-purple-500/10 border border-purple-500/30 rounded-lg p-4">
              <p className="text-sm">
                <span className="font-semibold text-purple-400">{t('cryptoAnalyzer.guides.priceAction.breakout')}</span> {t('cryptoAnalyzer.guides.priceAction.breakoutDesc')}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* CVD Guide */}
      <Card className="bg-gradient-to-br from-cyan-900/20 to-blue-900/20 border-cyan-500/30">
        <CardContent className="p-6">
          <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-cyan-400" />
            {t('cryptoAnalyzer.guides.cvd.title')}
          </h3>
          
          <div className="space-y-4 text-slate-300">
            <p className="text-sm">
              {t('cryptoAnalyzer.guides.cvd.description')}
            </p>

            <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-4">
              <div className="font-bold text-green-400 mb-2">{t('cryptoAnalyzer.guides.cvd.increasing')}</div>
              <ul className={`text-sm space-y-1 ${language === 'he' ? 'list-none' : 'list-disc list-inside'}`}>
                {t('cryptoAnalyzer.guides.cvd.increasingPoints').map((point, index) => (
                  <li key={index} className="flex items-start gap-2">
                    {language === 'he' && <span className="text-green-400">•</span>}
                    <span>{point}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4">
              <div className="font-bold text-red-400 mb-2">{t('cryptoAnalyzer.guides.cvd.decreasing')}</div>
              <ul className={`text-sm space-y-1 ${language === 'he' ? 'list-none' : 'list-disc list-inside'}`}>
                {t('cryptoAnalyzer.guides.cvd.decreasingPoints').map((point, index) => (
                  <li key={index} className="flex items-start gap-2">
                    {language === 'he' && <span className="text-red-400">•</span>}
                    <span>{point}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4">
              <div className="font-bold text-yellow-400 mb-2">{t('cryptoAnalyzer.guides.cvd.divergence')}</div>
              <p className="text-sm">
                {t('cryptoAnalyzer.guides.cvd.divergenceDesc')}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Open Interest Guide */}
      <Card className="bg-gradient-to-br from-orange-900/20 to-red-900/20 border-orange-500/30">
        <CardContent className="p-6">
          <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
            <DollarSign className="w-5 h-5 text-orange-400" />
            {t('cryptoAnalyzer.guides.oi.title')}
          </h3>
          
          <div className="space-y-4 text-slate-300">
            <p className="text-sm">
              {t('cryptoAnalyzer.guides.oi.description')}
            </p>

            <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-4">
              <div className="font-bold text-green-400 mb-2">{t('cryptoAnalyzer.guides.oi.increasing')}</div>
              <ul className={`text-sm space-y-1 ${language === 'he' ? 'list-none' : 'list-disc list-inside'}`}>
                {t('cryptoAnalyzer.guides.oi.increasingPoints').map((point, index) => (
                  <li key={index} className="flex items-start gap-2">
                    {language === 'he' && <span className="text-green-400">•</span>}
                    <span>{point}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4">
              <div className="font-bold text-red-400 mb-2">{t('cryptoAnalyzer.guides.oi.decreasing')}</div>
              <ul className={`text-sm space-y-1 ${language === 'he' ? 'list-none' : 'list-disc list-inside'}`}>
                {t('cryptoAnalyzer.guides.oi.decreasingPoints').map((point, index) => (
                  <li key={index} className="flex items-start gap-2">
                    {language === 'he' && <span className="text-red-400">•</span>}
                    <span>{point}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-purple-500/10 border border-purple-500/30 rounded-lg p-4">
              <div className="font-bold text-purple-400 mb-2">{t('cryptoAnalyzer.guides.oi.tip')}</div>
              <p className="text-sm">
                {t('cryptoAnalyzer.guides.oi.tipDesc')}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}