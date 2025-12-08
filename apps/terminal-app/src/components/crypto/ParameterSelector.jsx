import { DollarSign, BarChart3 } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import PropTypes from 'prop-types';
import { useLanguage } from "../LanguageContext";

export default function ParameterSelector({
  priceAction,
  setPriceAction,
  cvd,
  setCvd,
  openInterest,
  setOpenInterest,
  volume,
  setVolume,
}) {
  const { t, language } = useLanguage();

  return (
    <div className="space-y-6" dir={language === 'he' ? 'rtl' : 'ltr'}>
      {/* Price Action Selection */}
      <div className="space-y-3">
        <label className="text-base font-semibold text-white flex items-center gap-2">
          <BarChart3 className="w-5 h-5 text-emerald-400" />
          {t('cryptoAnalyzer.parameters.priceAction.title')}
        </label>
        <Select value={priceAction} onValueChange={setPriceAction}>
          <SelectTrigger className="bg-slate-800 border-slate-600 text-white hover:bg-slate-750 h-12 text-base" dir={language === 'he' ? 'rtl' : 'ltr'}>
            <SelectValue placeholder={t('cryptoAnalyzer.parameters.priceAction.placeholder')} className="text-slate-300" />
          </SelectTrigger>
          <SelectContent className="bg-slate-800 border-slate-600" dir={language === 'he' ? 'rtl' : 'ltr'}>
            <SelectItem value="uptrend" className="text-white hover:bg-slate-700 focus:bg-slate-700 cursor-pointer">
              {t('cryptoAnalyzer.parameters.priceAction.uptrend')}
            </SelectItem>
            <SelectItem value="downtrend" className="text-white hover:bg-slate-700 focus:bg-slate-700 cursor-pointer">
              {t('cryptoAnalyzer.parameters.priceAction.downtrend')}
            </SelectItem>
            <SelectItem value="range" className="text-white hover:bg-slate-700 focus:bg-slate-700 cursor-pointer">
              {t('cryptoAnalyzer.parameters.priceAction.range')}
            </SelectItem>
            <SelectItem value="breakout" className="text-white hover:bg-slate-700 focus:bg-slate-700 cursor-pointer">
              {t('cryptoAnalyzer.parameters.priceAction.breakout')}
            </SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* CVD Selection */}
      <div className="space-y-3">
        <label className="text-base font-semibold text-white flex items-center gap-2">
          <BarChart3 className="w-5 h-5 text-cyan-400" />
          {t('cryptoAnalyzer.parameters.cvd.title')}
        </label>
        <Select value={cvd} onValueChange={setCvd}>
          <SelectTrigger className="bg-slate-800 border-slate-600 text-white hover:bg-slate-750 h-12 text-base" dir={language === 'he' ? 'rtl' : 'ltr'}>
            <SelectValue placeholder={t('cryptoAnalyzer.parameters.cvd.placeholder')} className="text-slate-300" />
          </SelectTrigger>
          <SelectContent className="bg-slate-800 border-slate-600" dir={language === 'he' ? 'rtl' : 'ltr'}>
            <SelectItem value="increasing" className="text-white hover:bg-slate-700 focus:bg-slate-700 cursor-pointer">
              {t('cryptoAnalyzer.parameters.cvd.increasing')}
            </SelectItem>
            <SelectItem value="decreasing" className="text-white hover:bg-slate-700 focus:bg-slate-700 cursor-pointer">
              {t('cryptoAnalyzer.parameters.cvd.decreasing')}
            </SelectItem>
            <SelectItem value="flat" className="text-white hover:bg-slate-700 focus:bg-slate-700 cursor-pointer">
              {t('cryptoAnalyzer.parameters.cvd.flat')}
            </SelectItem>
            <SelectItem value="divergence" className="text-white hover:bg-slate-700 focus:bg-slate-700 cursor-pointer">
              {t('cryptoAnalyzer.parameters.cvd.divergence')}
            </SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Open Interest Selection */}
      <div className="space-y-3">
        <label className="text-base font-semibold text-white flex items-center gap-2">
          <DollarSign className="w-5 h-5 text-orange-400" />
          {t('cryptoAnalyzer.parameters.oi.title')}
        </label>
        <Select value={openInterest} onValueChange={setOpenInterest}>
          <SelectTrigger className="bg-slate-800 border-slate-600 text-white hover:bg-slate-750 h-12 text-base" dir={language === 'he' ? 'rtl' : 'ltr'}>
            <SelectValue placeholder={t('cryptoAnalyzer.parameters.oi.placeholder')} className="text-slate-300" />
          </SelectTrigger>
          <SelectContent className="bg-slate-800 border-slate-600" dir={language === 'he' ? 'rtl' : 'ltr'}>
            <SelectItem value="increasing" className="text-white hover:bg-slate-700 focus:bg-slate-700 cursor-pointer">
              {t('cryptoAnalyzer.parameters.oi.increasing')}
            </SelectItem>
            <SelectItem value="decreasing" className="text-white hover:bg-slate-700 focus:bg-slate-700 cursor-pointer">
              {t('cryptoAnalyzer.parameters.oi.decreasing')}
            </SelectItem>
            <SelectItem value="flat" className="text-white hover:bg-slate-700 focus:bg-slate-700 cursor-pointer">
              {t('cryptoAnalyzer.parameters.oi.flat')}
            </SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Volume Selection */}
      <div className="space-y-3">
        <label className="text-base font-semibold text-white flex items-center gap-2">
          <BarChart3 className="w-5 h-5 text-blue-400" />
          {t('cryptoAnalyzer.parameters.volume.title')}
        </label>
        <Select value={volume} onValueChange={setVolume}>
          <SelectTrigger className="bg-slate-800 border-slate-600 text-white hover:bg-slate-750 h-12 text-base" dir={language === 'he' ? 'rtl' : 'ltr'}>
            <SelectValue placeholder={t('cryptoAnalyzer.parameters.volume.placeholder')} className="text-slate-300" />
          </SelectTrigger>
          <SelectContent className="bg-slate-800 border-slate-600" dir={language === 'he' ? 'rtl' : 'ltr'}>
            <SelectItem value="high" className="text-white hover:bg-slate-700 focus:bg-slate-700 cursor-pointer">
              {t('cryptoAnalyzer.parameters.volume.high')}
            </SelectItem>
            <SelectItem value="normal" className="text-white hover:bg-slate-700 focus:bg-slate-700 cursor-pointer">
              {t('cryptoAnalyzer.parameters.volume.normal')}
            </SelectItem>
            <SelectItem value="low" className="text-white hover:bg-slate-700 focus:bg-slate-700 cursor-pointer">
              {t('cryptoAnalyzer.parameters.volume.low')}
            </SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}

ParameterSelector.propTypes = {
  priceAction: PropTypes.string.isRequired,
  setPriceAction: PropTypes.func.isRequired,
  cvd: PropTypes.string.isRequired,
  setCvd: PropTypes.func.isRequired,
  openInterest: PropTypes.string.isRequired,
  setOpenInterest: PropTypes.func.isRequired,
  volume: PropTypes.string.isRequired,
  setVolume: PropTypes.func.isRequired
};