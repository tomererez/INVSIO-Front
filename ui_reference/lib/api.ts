import { AICoachInsight, AssetMetric, DailyMetric, EquityPoint, JournalInsight, Trade, TradingStats, UserProfile } from '../types';

/**
 * MOCK DATABASE / API LAYER
 */

const MOCK_USER: UserProfile = {
  name: 'Tomer',
  plan: 'pro',
  avatar: 'https://i.pravatar.cc/150?u=tomer'
};

const MOCK_STATS: TradingStats = {
  winRate: 25.0,
  totalPL: 708.24,
  avgRMultiple: 0.11,
  maxDrawdown: 19.8,
  totalTrades: 42,
  wins: 14,
  losses: 28
};

const MOCK_EQUITY_DATA: EquityPoint[] = [
  { date: 'Nov 16', balance: 1000 },
  { date: 'Nov 17', balance: 1050 },
  { date: 'Nov 18', balance: 1020 },
  { date: 'Nov 19', balance: 1080 },
  { date: 'Nov 20', balance: 1060 },
  { date: 'Nov 21', balance: 1040 },
  { date: 'Nov 22', balance: 980 },
  { date: 'Nov 23', balance: 950 },
  { date: 'Nov 24', balance: 920 },
  { date: 'Nov 25', balance: 900 },
  { date: 'Nov 26', balance: 1400 }, 
  { date: 'Nov 27', balance: 1380 },
  { date: 'Nov 28', balance: 1350 },
  { date: 'Nov 29', balance: 1320 },
  { date: 'Nov 30', balance: 1550 },
];

const MOCK_JOURNAL_INSIGHTS: JournalInsight[] = [
  { title: 'Best R-Multiple', value: '4.38R', asset: 'BTCUSDT', type: 'positive' },
  { title: 'Worst R-Multiple', value: '-0.92R', asset: 'BTCUSDT', type: 'negative' },
  { title: 'Win/Loss', value: '14/42', subValue: '33% WR', type: 'neutral' },
  { title: 'Avg Hold Time', value: '0.9h', type: 'neutral' },
];

const MOCK_AI_COACH: AICoachInsight[] = [
  { 
    id: '1', 
    type: 'pattern', 
    title: 'Pattern Detected', 
    message: 'You have a 25% win rate with an average R-multiple of 0.11R. Your strategy relies on high R:R outliers.' 
  },
  { 
    id: '2', 
    type: 'recommendation', 
    title: 'Recommendation', 
    message: 'Consider letting winners run longer to improve your R-multiple, or tighten stops on losers.' 
  },
  { 
    id: '3', 
    type: 'alert', 
    title: 'Risk Alert', 
    message: 'Your win rate is below 45%. Focus on better trade selection and entry timing.' 
  }
];

let MOCK_TRADES: Trade[] = [
  { id: '1', asset: 'BTCUSDT', type: 'Short', entryDate: '25/11/2025 08:21', exitDate: '25/11/2025 12:00', entryPrice: 98200, exitPrice: 97800, pnl: 390.20, pnlPercent: 2.19, status: 'Closed', tags: ['Scalp'] },
  { id: '2', asset: 'HYPEUSDT', type: 'Short', entryDate: '20/11/2025 20:43', exitDate: '20/11/2025 21:00', entryPrice: 4.20, exitPrice: 4.25, pnl: -29.89, pnlPercent: -0.8, status: 'Closed', tags: ['FOMO'] },
  { id: '3', asset: 'BTCUSDT', type: 'Long', entryDate: '20/11/2025 20:41', exitDate: '20/11/2025 23:05', entryPrice: 96000, exitPrice: 95500, pnl: -53.16, pnlPercent: -0.43, status: 'Closed', tags: [] },
  { id: '4', asset: 'BTCUSDT', type: 'Long', entryDate: '20/11/2025 15:38', exitDate: '20/11/2025 18:59', entryPrice: 95000, exitPrice: 98500, pnl: 607.45, pnlPercent: 3.19, status: 'Closed', tags: ['Breakout'] },
  { id: '5', asset: 'HYPEUSDT', type: 'Long', entryDate: '20/11/2025 18:03', exitDate: '20/11/2025 18:15', entryPrice: 4.10, exitPrice: 4.08, pnl: -24.81, pnlPercent: -0.23, status: 'Closed', tags: [] },
  { id: '6', asset: 'BTCUSDT', type: 'Short', entryDate: '19/11/2025 14:00', exitDate: '19/11/2025 15:00', entryPrice: 97000, exitPrice: 97100, pnl: -36.32, pnlPercent: -0.34, status: 'Closed', tags: [] },
  { id: '7', asset: 'SOLUSDT', type: 'Long', entryDate: '18/11/2025 09:00', exitDate: '18/11/2025 10:00', entryPrice: 140, exitPrice: 145, pnl: 92.47, pnlPercent: 0.41, status: 'Closed', tags: [] },
  { id: '8', asset: 'ETHUSDT', type: 'Short', entryDate: '17/11/2025 04:25', exitDate: '17/11/2025 06:00', entryPrice: 3200, exitPrice: 3220, pnl: -27.46, pnlPercent: -0.52, status: 'Closed', tags: [] },
  { id: '9', asset: 'XRPUSDT', type: 'Long', entryDate: '06/12/2025 10:30', exitDate: '-', entryPrice: 0.65, exitPrice: 0.68, pnl: 150.00, pnlPercent: 4.6, status: 'Open', tags: ['Swing'] },
  { id: '10', asset: 'DOGEUSDT', type: 'Long', entryDate: '06/12/2025 11:15', exitDate: '-', entryPrice: 0.12, exitPrice: 0.118, pnl: -12.50, pnlPercent: -1.6, status: 'Open', tags: [] },
];

const MOCK_CALENDAR: DailyMetric[] = Array.from({ length: 35 }, (_, i) => {
  const day = i - 3; 
  const isCurrentMonth = day > 0 && day <= 31;
  
  if (!isCurrentMonth) return { day: day > 0 ? day : 30 + day, date: '', pnl: 0, trades: 0, winRate: 0, isCurrentMonth: false };

  const hasTrades = Math.random() > 0.6;
  const pnl = hasTrades ? (Math.random() * 400 - 150) : 0;
  const trades = hasTrades ? Math.floor(Math.random() * 5) + 1 : 0;
  const wins = hasTrades ? Math.floor(Math.random() * trades) : 0;
  
  return {
    day,
    date: `2025-12-${day}`,
    pnl,
    trades,
    winRate: trades > 0 ? Math.round((wins / trades) * 100) : 0,
    isCurrentMonth: true
  };
});

const MOCK_ASSET_METRICS: AssetMetric[] = [
  { name: 'BTCUSDT', value: 788.84, color: '#06b6d4' },
  { name: 'HYPEUSDT', value: -119.85, color: '#ef4444' }, 
  { name: 'INJUSDT', value: 39.355, color: '#eab308' },
];

export const api = {
  auth: {
    getUser: async (): Promise<UserProfile> => {
      await new Promise(resolve => setTimeout(resolve, 500));
      return MOCK_USER;
    },
    login: async (): Promise<UserProfile> => {
      await new Promise(resolve => setTimeout(resolve, 800));
      return MOCK_USER;
    }
  },

  dashboard: {
    getStats: async (): Promise<TradingStats> => {
      await new Promise(resolve => setTimeout(resolve, 600));
      return MOCK_STATS;
    },
    getEquityCurve: async (): Promise<EquityPoint[]> => {
      await new Promise(resolve => setTimeout(resolve, 700));
      return MOCK_EQUITY_DATA;
    },
    getJournalInsights: async (): Promise<JournalInsight[]> => {
      await new Promise(resolve => setTimeout(resolve, 500));
      return MOCK_JOURNAL_INSIGHTS;
    },
    getAICoachInsights: async (): Promise<AICoachInsight[]> => {
      await new Promise(resolve => setTimeout(resolve, 900));
      return MOCK_AI_COACH;
    }
  },

  journal: {
    getTrades: async (): Promise<Trade[]> => {
        await new Promise(resolve => setTimeout(resolve, 400));
        return MOCK_TRADES;
    },
    getCalendarMetrics: async (): Promise<DailyMetric[]> => {
        await new Promise(resolve => setTimeout(resolve, 600));
        return MOCK_CALENDAR;
    },
    getAssetMetrics: async (): Promise<AssetMetric[]> => {
        await new Promise(resolve => setTimeout(resolve, 500));
        return MOCK_ASSET_METRICS;
    },
    createTrade: async (tradeData: any): Promise<void> => {
        await new Promise(resolve => setTimeout(resolve, 1000));
        const newTrade: Trade = {
            id: Math.random().toString(36).substr(2, 9),
            asset: tradeData.symbol || 'UNKNOWN',
            type: tradeData.direction === 'long' ? 'Long' : 'Short',
            entryDate: tradeData.entry_time || new Date().toISOString(),
            exitDate: tradeData.exit_time || '-',
            entryPrice: parseFloat(tradeData.entry_price) || 0,
            exitPrice: parseFloat(tradeData.exit_price) || 0,
            pnl: parseFloat(tradeData.pnl) || 0,
            pnlPercent: parseFloat(tradeData.pnl_percentage) || 0,
            status: tradeData.status === 'open' ? 'Open' : 'Closed',
            tags: []
        };
        MOCK_TRADES = [newTrade, ...MOCK_TRADES];
        return;
    },
    invokeLLM: async (prompt: string): Promise<any> => {
        await new Promise(resolve => setTimeout(resolve, 2500));
        return `
**Winning Patterns:**
- High probability detected in **BTC/USD** longs during London Session overlap.
- **Trend Following** strategy yields 2.5x higher expectancy than mean reversion.
- Average winner holding time is > 4 hours.

**Improvements:**
- Stop loss placement on **ETH** shorts is consistently too tight (stopped out before move).
- **FOMO** entries account for 60% of total drawdowns.
- Leverage on losing trades averages 20x, while winning trades average 5x.

**Forecast:**
- Market structure shifting bullish on 4H. Look for long entries on **SOL** retests.
- Volatility expected to expand.

**Recommended Strategy:**
- Focus on **Breakout** setups on BTC.
- Reduce leverage to max 5x.
- Set strict stop loss at recent swing lows.
        `;
    }
  }
};