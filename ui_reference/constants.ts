import { FeedItemData, PricingTierData, TestimonialData } from './types';

export const FEED_DATA: FeedItemData[] = [
  {
    id: '1',
    asset: 'BTC/USD',
    timeframe: '15m',
    message: 'Bitcoin is showing exhaustion. Smart money is selling into this pump near $65k. RSI Divergence detected.',
    signalType: 'bearish',
    badges: ['Whale Alert', 'Volume Spike'],
    timestamp: '2m ago',
    priceData: [
      { time: '10:00', value: 64200 },
      { time: '10:05', value: 64500 },
      { time: '10:10', value: 64800 },
      { time: '10:15', value: 64950 }, // Peak
      { time: '10:20', value: 64900 },
      { time: '10:25', value: 64750 },
      { time: '10:30', value: 64600 },
    ]
  },
  {
    id: '2',
    asset: 'ETH/USDT',
    timeframe: '4H',
    message: 'Liquidity grab completed at $3,200. Order flow shifting to net long. Expect a bounce to $3,350.',
    signalType: 'bullish',
    badges: ['Liquidity Grab', 'Golden Cross'],
    timestamp: '12m ago',
    priceData: [
      { time: '12:00', value: 3300 },
      { time: '13:00', value: 3250 },
      { time: '14:00', value: 3210 }, // Dip
      { time: '15:00', value: 3195 }, // Wick
      { time: '16:00', value: 3240 }, // Recovery
      { time: '17:00', value: 3280 },
    ]
  },
  {
    id: '3',
    asset: 'SOL/USD',
    timeframe: '1H',
    message: 'Consolidation phase holding steady. Volatility squeeze incoming.',
    signalType: 'neutral',
    badges: ['Squeeze'],
    timestamp: '45m ago',
    priceData: [
      { time: '09:00', value: 145 },
      { time: '10:00', value: 146 },
      { time: '11:00', value: 145.5 },
      { time: '12:00', value: 145.8 },
      { time: '13:00', value: 145.2 },
      { time: '14:00', value: 146.1 },
    ]
  },
    {
    id: '4',
    asset: 'NVDA',
    timeframe: '1D',
    message: 'Institutional buy walls detected at $850. Sentiment remains extreme greed.',
    signalType: 'bullish',
    badges: ['Sentiment: Greed', 'Inst. Buy'],
    timestamp: '1h ago',
    priceData: [
      { time: 'Mon', value: 820 },
      { time: 'Tue', value: 835 },
      { time: 'Wed', value: 840 },
      { time: 'Thu', value: 845 },
      { time: 'Fri', value: 855 },
    ]
  }
];

export const TESTIMONIALS: TestimonialData[] = [
  { id: '1', handle: '@CryptoWizard', avatar: 'https://picsum.photos/100/100', quote: "The feed speed is unmatched. It's like having a team of analysts in my pocket.", rating: 5 },
  { id: '2', handle: '@AlphaSeeker', avatar: 'https://picsum.photos/101/101', quote: "Finally, a tool that cuts through the noise. The UI is absolutely gorgeous.", rating: 5 },
  { id: '3', handle: '@DayTradePro', avatar: 'https://picsum.photos/102/102', quote: "MarketFlow paid for itself in the first 20 minutes. Incredible insights.", rating: 5 },
  { id: '4', handle: '@HedgeFundDropout', avatar: 'https://picsum.photos/103/103', quote: "I stopped using my Bloomberg terminal for this. Serious edge.", rating: 5 },
  { id: '5', handle: '@SatoshiDisciple', avatar: 'https://picsum.photos/104/104', quote: "The liquidity zone visualization is a game changer.", rating: 5 },
];

export const PRICING_TIERS: PricingTierData[] = [
  {
    id: 'starter',
    name: 'Starter',
    priceMonthly: 0,
    priceYearly: 0,
    features: ['Delayed Data (15m)', '3 Daily Alerts', 'Basic Chart Patterns', 'Community Access'],
    isPopular: false
  },
  {
    id: 'pro',
    name: 'Pro',
    priceMonthly: 49,
    priceYearly: 39,
    features: ['Real-time Data', 'Unlimited AI Alerts', 'Liquidity Heatmaps', 'Whale Tracking', 'Sentiment Analysis'],
    isPopular: true
  },
  {
    id: 'whale',
    name: 'Whale',
    priceMonthly: 199,
    priceYearly: 149,
    features: ['API Access', '1-on-1 Strategy Call', 'Dedicated Server', 'Institutional Reports', 'Early Feature Access'],
    isEnterprise: true
  }
];