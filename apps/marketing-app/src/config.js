/**
 * Centralized Configuration
 * URLs automatically switch between development and production
 */

const isProduction = import.meta.env.PROD;

export const config = {
    // App URLs
    MARKETING_URL: isProduction ? "https://invsio.com" : "http://localhost:2800",
    TERMINAL_URL: isProduction ? "https://app.invsio.com" : "http://localhost:4200",
    ADMIN_URL: isProduction ? "https://admin.invsio.com" : "http://localhost:4300",

    // Meta
    APP_NAME: "INVSIO",
    APP_TAGLINE: "Trade Like Smart Money",

    // Feature flags (can be expanded later)
    features: {
        AI_ENABLED: true,
        DEMO_MODE: !isProduction,
    }
};

export default config;
