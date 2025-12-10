
export const TESTIMONIALS = [
    { id: '1', handle: '@CryptoWizard', avatar: 'https://picsum.photos/100/100', quote: "The feed speed is unmatched. It's like having a team of analysts in my pocket.", rating: 5 },
    { id: '2', handle: '@AlphaSeeker', avatar: 'https://picsum.photos/101/101', quote: "Finally, a tool that cuts through the noise. The UI is absolutely gorgeous.", rating: 5 },
    { id: '3', handle: '@DayTradePro', avatar: 'https://picsum.photos/102/102', quote: "INVSIO paid for itself in the first 20 minutes. Incredible insights.", rating: 5 },
    { id: '4', handle: '@HedgeFundDropout', avatar: 'https://picsum.photos/103/103', quote: "I stopped using my Bloomberg terminal for this. Serious edge.", rating: 5 },
    { id: '5', handle: '@SatoshiDisciple', avatar: 'https://picsum.photos/104/104', quote: "The liquidity zone visualization is a game changer.", rating: 5 },
];

export const PRICING_TIERS = [
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
