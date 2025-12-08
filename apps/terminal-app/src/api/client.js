/*
 * Local API Client
 * Replaces Base44 SDK with local storage and direct API calls.
 */
import { createRepository } from './local/storage';
import { getMarketSnapshot } from './local/market';
import { invokeLLM } from './local/openai';

// Entities / Repositories
const Trade = createRepository('trades');
const Settings = createRepository('settings');
const Users = createRepository('users');

// Initialize admin user if not exists
// Initialize admin and test users if they don't exist
const initializeDefaultUsers = () => {
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    let hasChanges = false;

    // 1. Admin User
    if (!users.some(u => u.email === 'admin@invsio.com')) {
        const adminUser = {
            id: 'admin-user-001',
            email: 'admin@invsio.com',
            password: 'admin123',
            full_name: 'Admin User',
            role: 'admin',
            subscription_tier: 'elite',
            subscription_start_date: new Date().toISOString(),
            created_date: new Date().toISOString(),
            max_risk_percent: 2,
            default_leverage: 5,
            trading_style: 'aggressive',
            theme: 'dark',
            is_active: true
        };
        users.push(adminUser);
        hasChanges = true;
        console.log('[Auth] Admin user initialized: admin@invsio.com');
    }

    // 2. Elite Test User
    if (!users.some(u => u.email === 'test@invsio.ai')) {
        const testUser = {
            id: 'test-user-elite-01',
            email: 'test@invsio.ai',
            password: 'test123',
            full_name: 'Elite Tester',
            role: 'user',
            subscription_tier: 'elite',
            subscription_start_date: new Date().toISOString(),
            created_date: new Date().toISOString(),
            max_risk_percent: 5,
            default_leverage: 20,
            trading_style: 'aggressive',
            theme: 'dark',
            is_active: true
        };
        users.push(testUser);
        hasChanges = true;
        console.log('[Auth] Elite Test user initialized: test@invsio.ai');
    }

    if (hasChanges) {
        localStorage.setItem('users', JSON.stringify(users));
    }
};

// Initialize on load
initializeDefaultUsers();

// Get current user from localStorage
const getCurrentUser = () => {
    const userId = localStorage.getItem('currentUserId');
    if (!userId) return null;
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    return users.find(u => u.id === userId) || null;
};

// Auth with real login support
const Auth = {
    isAuthenticated: async () => {
        const user = getCurrentUser();
        return !!user;
    },

    me: async () => {
        const user = getCurrentUser();
        if (user) return user;

        // Fallback to default dev user for backward compatibility
        return {
            id: 'local-trader',
            email: 'trader@local.app',
            full_name: 'Local Trader',
            role: 'user',
            subscription_tier: 'pro',
            subscription_start_date: new Date().toISOString(),
            created_date: new Date().toISOString(),
            max_risk_percent: 2,
            default_leverage: 3,
            trading_style: 'balanced',
            theme: localStorage.getItem('theme') || 'dark'
        };
    },

    login: async (email, password) => {
        const users = JSON.parse(localStorage.getItem('users') || '[]');
        const user = users.find(u => u.email === email && u.password === password);

        if (user) {
            localStorage.setItem('currentUserId', user.id);
            return { success: true, user };
        }
        return { success: false, error: 'Invalid credentials' };
    },

    logout: async () => {
        localStorage.removeItem('currentUserId');
        window.location.reload();
    },

    redirectToLogin: () => {
        console.log("[Local Auth] Redirect requested");
        window.location.href = '/login';
    },

    updateMe: async (updates) => {
        const userId = localStorage.getItem('currentUserId');
        if (!userId) return { success: false };

        const users = JSON.parse(localStorage.getItem('users') || '[]');
        const index = users.findIndex(u => u.id === userId);

        if (index !== -1) {
            users[index] = { ...users[index], ...updates };
            localStorage.setItem('users', JSON.stringify(users));
            return { success: true, ...users[index] };
        }
        return { success: false };
    },

    isAdmin: async () => {
        const user = getCurrentUser();
        return user?.role === 'admin';
    },

    // Quick login as admin for dev purposes
    loginAsAdmin: async () => {
        return Auth.login('admin@invsio.com', 'admin123');
    }
};

// Functions / Integrations
const Functions = {
    getMarketSnapshot: getMarketSnapshot,
    GetBtcMarketSnapshot: getMarketSnapshot,
    invokeLLM: invokeLLM,

    tradingCoachChat: async (args) => {
        const { message, marketData, conversationHistory } = args;
        const systemPrompt = `You are an expert trading coach. Analyze the market data and user question.
    Market Data: ${JSON.stringify(marketData)}
    `;
        const messages = [
            { role: 'system', content: systemPrompt },
            ...(conversationHistory || []).map(msg => ({ role: msg.sender === 'user' ? 'user' : 'assistant', content: msg.text })),
            { role: 'user', content: message }
        ];
        return invokeLLM({ messages });
    },

    analyzeMarketWithOpenAI: async (args) => {
        const { marketData } = args;
        const binance4h = marketData.raw?.binance?.['4h'] || {};

        const prompt = `You are the SmartTrading Market Intelligence AI (V2.1 Premium).

CURRENT BTC PRICE: $${binance4h.price}

MARKET DATA:
${JSON.stringify(marketData, null, 2)}

ANALYSIS INSTRUCTIONS:
- Analyze exchange divergence (Whale vs Retail)
- Evaluate Market Regime and AI Bias
- Check Technicals (CVD, OI, Funding)

RETURN THIS JSON (Strict):
{
  "market_bias": "BULLISH/BEARISH/NEUTRAL",
  "confidence": 1-10,
  "current_price": ${binance4h.price},
  "macro_view": { "bias": "...", "summary": "...", "smart_money_position": "...", "key_drivers": [] },
  "micro_view": { "bias": "...", "summary": "...", "technical_state": "...", "traps_to_avoid": [] },
  "scalping_view": { "bias": "...", "summary": "...", "volatility": "...", "best_approach": "..." },
  "entry_zones": { "long_opportunities": [{ "zone": "...", "reason": "...", "confidence": "...", "invalidation": "..." }], "short_opportunities": [] },
  "action_plan": { "primary_strategy": "...", "risk_level": "...", "position_sizing": "...", "key_levels": [], "avoid": "..." },
  "scenarios": { "bullish": { "probability": "...", "trigger": "...", "target": "..." }, "bearish": { ... } }
}`;

        const result = await invokeLLM({
            messages: [{ role: 'user', content: prompt }],
            response_format: { type: "json_object" }
        });
        return { data: result };
    }
};

// Integrations Mock
const Integrations = {
    SendEmail: async (data) => {
        console.log("[Local Email] Sending email:", data);
        return { success: true };
    },
    UploadFile: async ({ file }) => {
        console.log("[Local Upload] Uploading file:", file);
        return { file_url: URL.createObjectURL(file), success: true };
    }
};

// Unified API Object
export const api = {
    auth: Auth,
    entities: {
        Trade,
        Settings,
        Users
    },
    functions: Functions,
    integrations: Integrations
};

