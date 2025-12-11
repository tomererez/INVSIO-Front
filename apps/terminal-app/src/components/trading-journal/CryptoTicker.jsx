import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown } from 'lucide-react';

const COINGECKO_API_KEY = "CG-6VSa9kxfhSwwfN3j1twVhToF";

export const CryptoTicker = () => {
  const [coins, setCoins] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCoins = async () => {
      try {
        const response = await fetch(
          `https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=100&page=1&sparkline=false&x_cg_demo_api_key=${COINGECKO_API_KEY}`
        );
        const data = await response.json();
        if (Array.isArray(data)) {
          // Specific list of top 20 coins from user request
          const targetSymbols = [
            'btc', 'eth', 'avax', 'xrp', 'bnb', 'shib', 'sol', 'trx', 'doge', 'ada',
            'bch', 'hype', 'link', 'leo', 'xlm', 'xmr', 'zec', 'usde', 'ltc', 'sui'
          ];

          // Filter and sort based on the target list order
          const filteredCoins = data.filter(coin => targetSymbols.includes(coin.symbol.toLowerCase()));
          const sortedCoins = filteredCoins.sort((a, b) => {
            return targetSymbols.indexOf(a.symbol.toLowerCase()) - targetSymbols.indexOf(b.symbol.toLowerCase());
          });

          setCoins(sortedCoins);
        }
      } catch (error) {
        console.error("Failed to fetch crypto prices", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCoins();
    // Refresh every 60 seconds
    const interval = setInterval(fetchCoins, 60000);
    return () => clearInterval(interval);
  }, []);

  if (loading || coins.length === 0) return null;

  return (
    <div className="w-full bg-white/[0.02] backdrop-blur-md border-b border-white/5 overflow-hidden py-2 relative z-10">
      <div className="flex overflow-hidden">
        <motion.div
          className="flex gap-8 items-center px-4"
          animate={{ x: ["0%", "-50%"] }}
          transition={{ duration: 80, repeat: Infinity, ease: "linear" }}
          style={{ width: "max-content" }}
        >
          {/* Double the list for seamless loop */}
          {[...coins, ...coins].map((coin, index) => (
            <div key={`${coin.id}-${index}`} className="flex items-center gap-2 whitespace-nowrap">
              <span className="text-xs font-bold text-slate-300 uppercase">{coin.symbol}</span>
              <span className="text-xs font-mono text-white">${coin.current_price.toLocaleString()}</span>
              <div className={`flex items-center text-[10px] ${coin.price_change_percentage_24h >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                {coin.price_change_percentage_24h >= 0 ? <TrendingUp className="w-3 h-3 mr-0.5" /> : <TrendingDown className="w-3 h-3 mr-0.5" />}
                {Math.abs(coin.price_change_percentage_24h).toFixed(2)}%
              </div>
              <div className="w-px h-3 bg-white/10 mx-2" />
            </div>
          ))}
        </motion.div>
      </div>
      {/* Fade Edges */}
      <div className="absolute left-0 top-0 bottom-0 w-20 bg-gradient-to-r from-black/20 to-transparent z-10 pointer-events-none" />
      <div className="absolute right-0 top-0 bottom-0 w-20 bg-gradient-to-l from-black/20 to-transparent z-10 pointer-events-none" />
    </div>
  );
};