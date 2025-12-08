export interface FeedItemData {
  id: string;
  asset: string;
  timeframe: string;
  message: string;
  signalType: 'bullish' | 'bearish' | 'neutral';
  badges: string[];
  priceData: { value: number; time: string }[];
  timestamp: string;
}

export interface TestimonialData {
  id: string;
  handle: string;
  avatar: string; // URL
  quote: string;
  rating: number;
}

export interface PricingTierData {
  id: string;
  name: string;
  priceMonthly: number;
  priceYearly: number;
  features: string[];
  isPopular?: boolean;
  isEnterprise?: boolean;
}

export enum SectionId {
  HERO = 'hero',
  FEED = 'feed',
  FEATURES = 'features',
  TESTIMONIALS = 'testimonials',
  PRICING = 'pricing'
}

// --- DASHBOARD TYPES ---

export interface UserProfile {
  name: string;
  plan: 'free' | 'pro' | 'whale';
  avatar?: string;
}

export interface TradingStats {
  winRate: number;
  totalPL: number;
  avgRMultiple: number;
  maxDrawdown: number;
  totalTrades: number;
  wins: number;
  losses: number;
}

export interface EquityPoint {
  date: string;
  balance: number;
}

export interface JournalInsight {
  title: string;
  value: string | number;
  subValue?: string;
  type: 'positive' | 'negative' | 'neutral';
  asset?: string;
}

export interface AICoachInsight {
  id: string;
  type: 'pattern' | 'recommendation' | 'alert';
  title: string;
  message: string;
}

// --- JOURNAL TYPES ---

export interface Trade {
  id: string;
  asset: string;
  type: 'Long' | 'Short';
  entryDate: string;
  exitDate: string;
  entryPrice: number;
  exitPrice: number;
  pnl: number;
  pnlPercent: number;
  status: 'Closed' | 'Open';
  tags: string[];
}

export interface DailyMetric {
  day: number;
  date: string; // ISO
  pnl: number;
  trades: number;
  winRate: number;
  isCurrentMonth: boolean;
}

export interface AssetMetric {
  name: string;
  value: number; // PnL
  color: string;
}