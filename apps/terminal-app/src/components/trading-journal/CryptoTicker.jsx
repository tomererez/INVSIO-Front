import React, { useState, useEffect } from "react";
import { TrendingUp, TrendingDown } from "lucide-react";

export default function CryptoTicker() {
  const [prices, setPrices] = useState({});
  const [loading, setLoading] = useState(true);

  const cryptos = [
    { id: 'bitcoin', symbol: 'BTC' },
    { id: 'ethereum', symbol: 'ETH' },
    { id: 'binancecoin', symbol: 'BNB' },
    { id: 'solana', symbol: 'SOL' },
    { id: 'ripple', symbol: 'XRP' },
    { id: 'cardano', symbol: 'ADA' },
    { id: 'dogecoin', symbol: 'DOGE' },
    { id: 'hyperliquid', symbol: 'HYPE' }
  ];

  const fetchPrices = async () => {
    try {
      const ids = cryptos.map(c => c.id).join(',');
      const response = await fetch(
        `https://api.coingecko.com/api/v3/simple/price?ids=${ids}&vs_currencies=usd&include_24hr_change=true&x_cg_demo_api_key=CG-6VSa9kxfhSwwfN3j1twVhToF`
      );
      const data = await response.json();
      setPrices(data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching crypto prices:', error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPrices();
    const interval = setInterval(fetchPrices, 3000);
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <div className="bg-slate-900/50 border-b border-slate-800 py-2">
        <div className="text-center text-slate-400 text-xs">טוען מחירים...</div>
      </div>
    );
  }

  const renderCryptoItem = (crypto, index) => {
    const priceData = prices[crypto.id];
    if (!priceData) return null;

    const price = priceData.usd;
    const change = priceData.usd_24h_change;
    const isPositive = change >= 0;

    return (
      <div key={`${crypto.id}-${index}`} className="inline-flex items-center gap-2 px-4 flex-shrink-0">
        <span className="text-slate-300 font-semibold text-xs">{crypto.symbol}</span>
        <span className="text-white font-bold text-xs whitespace-nowrap">
          ${price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
        </span>
        <div className={`inline-flex items-center gap-1 ${isPositive ? 'text-green-400' : 'text-red-400'}`}>
          {isPositive ? (
            <TrendingUp className="w-3 h-3" />
          ) : (
            <TrendingDown className="w-3 h-3" />
          )}
          <span className="text-xs font-semibold whitespace-nowrap">
            {isPositive ? '+' : ''}{change.toFixed(2)}%
          </span>
        </div>
        <span className="text-slate-600 mx-2">|</span>
      </div>
    );
  };

  return (
    <div className="bg-slate-900/50 border-b border-slate-800 overflow-hidden relative">
      <style>{`
        @keyframes scroll-left {
          from {
            transform: translateX(0);
          }
          to {
            transform: translateX(-50%);
          }
        }
        .ticker-animate {
          animation: scroll-left 40s linear infinite;
          display: inline-flex;
          will-change: transform;
        }
        .ticker-animate:hover {
          animation-play-state: paused;
        }
      `}</style>
      
      <div className="py-2.5 whitespace-nowrap">
        <div className="ticker-animate">
          {/* רנדור כפול של כל הרשימה */}
          {cryptos.map((crypto, index) => renderCryptoItem(crypto, index))}
          {cryptos.map((crypto, index) => renderCryptoItem(crypto, index + cryptos.length))}
        </div>
      </div>
    </div>
  );
}