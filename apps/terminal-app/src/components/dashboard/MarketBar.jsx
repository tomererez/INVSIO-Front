import React, { useState, useEffect } from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';

export default function MarketBar({ isDark }) {
  const [btcData, setBtcData] = useState(null);
  const [fearGreed, setFearGreed] = useState(null);

  useEffect(() => {
    const fetchMarketData = async () => {
      try {
        const btcRes = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=usd&include_24hr_change=true');
        const btcJson = await btcRes.json();
        setBtcData({
          price: btcJson.bitcoin.usd,
          change: btcJson.bitcoin.usd_24h_change
        });

        const fgRes = await fetch('https://api.alternative.me/fng/?limit=1');
        const fgJson = await fgRes.json();
        setFearGreed(fgJson.data[0]);
      } catch (error) {
        console.error('Failed to fetch market data:', error);
      }
    };

    fetchMarketData();
    const interval = setInterval(fetchMarketData, 60000);
    return () => clearInterval(interval);
  }, []);

  if (!btcData) return null;

  const getFearGreedColor = (value) => {
    if (value < 25) return 'text-red-400';
    if (value < 50) return 'text-orange-400';
    if (value < 75) return 'text-yellow-400';
    return 'text-green-400';
  };

  return (
    <div className={`flex flex-wrap items-center gap-4 text-sm ${isDark ? 'text-slate-300' : 'text-gray-700'}`}>
      <div className="flex items-center gap-2">
        <span className={`font-medium ${isDark ? 'text-slate-400' : 'text-gray-600'}`}>BTC</span>
        <span className="font-bold">${btcData.price.toLocaleString('en-US', { maximumFractionDigits: 0 })}</span>
        <span className={`flex items-center gap-1 ${btcData.change >= 0 ? 'text-green-400' : 'text-red-400'}`}>
          {btcData.change >= 0 ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
          {Math.abs(btcData.change).toFixed(2)}%
        </span>
      </div>
      
      {fearGreed && (
        <div className="flex items-center gap-2">
          <span className={`font-medium ${isDark ? 'text-slate-400' : 'text-gray-600'}`}>Fear & Greed</span>
          <span className={`font-bold ${getFearGreedColor(fearGreed.value)}`}>
            {fearGreed.value} / {fearGreed.value_classification}
          </span>
        </div>
      )}
    </div>
  );
}