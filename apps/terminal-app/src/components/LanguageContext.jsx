import React, { createContext, useContext, useEffect } from 'react';

const translations = {
  en: {
    nav: {
      home: "Home",
      technicalAnalysis: "Technical Analysis",
      positionCalculator: "Position Calculator",
      riskCalculator: "Position Calculator",
      tradingJournal: "Trading Journal",
      settings: "Settings",
      smartTrading: "SmarTrading",
      tagline: "Trade Like Smart Money"
    },
    home: {
      title: "SmarTrading",
      subtitle: "Professional Trading Intelligence Platform",
      description: "Stop trading on emotions and retail mentality. Use institutional-grade tools to analyze markets, manage risk, and make data-driven decisions like professional traders.",
      features: {
        smartAnalysis: "Smart Money Analysis",
        smartAnalysisDesc: "Read market structure like institutions do",
        speed: "Real-Time Intelligence",
        speedDesc: "Instant insights when markets move",
        accuracy: "Precision Risk Control",
        accuracyDesc: "Calculate exact position sizes every time"
      },
      tools: {
        title: "Professional Trading Tools Built for Serious Traders",
        subtitle: "Everything you need to transition from retail thinking to professional execution",
        technicalAnalyzer: {
          title: "Smart Money Technical Analyzer",
          description: "Decode market behavior using Price Action, CVD, Open Interest, and Funding Rates. Understand what smart money is doing—not just what retail traders see.",
          feature1: "AI-powered chart analysis in seconds",
          feature2: "27 institutional market scenarios",
          feature3: "Clear long/short recommendations with context"
        },
        positionCalc: {
          title: "Smart Position Size Calculator",
          description: "Stop risking too much or too little. Calculate exact position sizes based on 1R risk methodology with intelligent scale-in logic and multiple profit targets.",
          feature1: "Automatic 1R risk calculation",
          feature2: "Smart scale-in at optimal levels",
          feature3: "Dynamic leverage based on your stop"
        },
        riskCalc: {
          title: "Smart Position Size Calculator",
          description: "Stop risking too much or too little. Calculate exact position sizes based on 1R risk methodology with intelligent scale-in logic and multiple profit targets.",
          feature1: "Automatic 1R risk calculation",
          feature2: "Smart scale-in at optimal levels",
          feature3: "Dynamic leverage based on your stop"
        },
        journal: {
          title: "Professional Trading Journal",
          description: "Track every trade with precision. Analyze your performance with institutional metrics like profit factor, expectancy, and win rate to identify what actually works.",
          feature1: "Automatic P&L tracking and analytics",
          feature2: "Performance breakdown by strategy",
          feature3: "AI-powered insights on your patterns"
        }
      },
      cta: {
        title: "Ready to Trade with Professional Intelligence?",
        description: "Join traders who've moved beyond guessing and gambling. Start making calculated, professional decisions today.",
        startAnalysis: "Analyze a Trade Setup",
        openCalculator: "Calculate Position Size"
      },
      clickToEnter: "Open Tool"
    },
    cryptoAnalyzer: {
      title: "Professional Technical Analysis Calculator",
      subtitle: "Data-Driven Analysis",
      accurateRecommendations: "Accurate Recommendations",
      detailedScenarios: "Detailed Scenarios",
      guide: "Parameters Guide",
      autoAnalysis: "Auto Analysis",
      manualAnalysis: "Manual Analysis",
      marketParameters: "Market Parameters",
      howItWorks: "How Does It Work?",
      howItWorksDesc: "Select the current state of each parameter (for Funding Rate - enter the last 4 values from the chart), and the system will analyze the market situation and display a detailed scenario with action recommendations.",
      selectAllParameters: "Select All Parameters",
      selectAllParametersDesc: "After selecting all 4 main parameters and entering Funding Rate values, the complete market interpretation will be displayed here",
      disclaimer: "The information provided is for educational purposes only and does not constitute investment advice. Cryptocurrency investment involves risk.",
      autoAnalysisTitle: "AI Automatic Analysis",
      uploadChart: "Upload Chart Image for Analysis",
      uploadDesc: "Drag file or click to select • Supports PNG, JPG, JPEG",
      selectDifferent: "Select Different Image",
      analyzing: "Analyzing Chart with AI...",
      analyzingDesc: "This may take a few seconds",
      analysisResults: "Analysis Results",
      analyzeNew: "Analyze New Chart",
      howAutoWorks: "How Does It Work?",
      autoStep1: "Upload a screenshot of a technical chart (TradingView, Binance, etc.)",
      autoStep2: "AI will analyze all technical parameters",
      autoStep3: "You'll receive a detailed recommendation and market explanation",
      parameters: {
        priceAction: {
          title: "Price Action",
          placeholder: "Select Price Action state",
          uptrend: "Uptrend",
          downtrend: "Downtrend",
          range: "Range",
          breakout: "Breakout"
        },
        cvd: {
          title: "CVD (Cumulative Volume Delta)",
          placeholder: "Select CVD state",
          increasing: "CVD Increasing (Positive)",
          decreasing: "CVD Decreasing (Negative)",
          flat: "CVD Flat (Neutral)",
          divergence: "Divergence"
        },
        oi: {
          title: "Open Interest",
          placeholder: "Select Open Interest state",
          increasing: "OI Increasing",
          decreasing: "OI Decreasing",
          flat: "OI Flat"
        },
        fundingRate: {
          title: "Funding Rate",
          simpleTab: "Simple",
          detailedTab: "Detailed",
          placeholder: "Select Funding Rate state",
          positive: "Positive/Rising (Longs pay)",
          neutral: "Neutral/Balanced",
          negative: "Negative/Falling (Shorts pay)",
          period: "Period",
          note: "Enter Funding Rate from newest to oldest (e.g., 0.01%, -0.02%)",
          quickNote: "💡 Quick selection based on overall Funding Rate state"
        },
        volume: {
          title: "Volume",
          placeholder: "Select Volume state",
          high: "High Volume",
          normal: "Normal Volume",
          low: "Low Volume"
        }
      },
      guides: {
        priceAction: {
          title: "Price Action Guide",
          uptrend: "Uptrend",
          uptrendDesc: "Price creates higher highs and higher lows. Sign of buyer strength and continued positive movement.",
          downtrend: "Downtrend",
          downtrendDesc: "Price creates lower lows and lower highs. Sign of seller strength and continued negative movement.",
          range: "Range:",
          rangeDesc: "Price moves between clear support and resistance levels. State of market uncertainty.",
          breakout: "Breakout:",
          breakoutDesc: "Price breaks significant resistance or support level. Sign of strong movement in breakout direction."
        },
        cvd: {
          title: "CVD (Cumulative Volume Delta) Guide",
          description: "CVD measures the cumulative difference between buy and sell volume. Helps identify real market pressure.",
          increasing: "CVD Increasing (Positive)",
          increasingPoints: ["More buying than selling", "Strong buyer pressure", "Supports price increases"],
          decreasing: "CVD Decreasing (Negative)",
          decreasingPoints: ["More selling than buying", "Strong seller pressure", "Supports price decreases"],
          divergence: "CVD Divergence",
          divergenceDesc: "When price rises but CVD falls (or vice versa) - this is a warning sign for possible direction change!"
        },
        oi: {
          title: "Open Interest Guide",
          description: "Open Interest is the number of open contracts (Futures/Options) not yet closed.",
          increasing: "OI Increasing",
          increasingPoints: ["New money entering market", "Continuation of existing trend", "Strengthening movement"],
          decreasing: "OI Decreasing",
          decreasingPoints: ["Position closing", "Declining interest", "Possible trend ending"],
          tip: "💡 Tip:",
          tipDesc: "Combine OI with Price Action - rising price + rising OI = strong trend!"
        }
      }
    },
    riskCalculator: {
      title: "Professional Position Calculator",
      subtitle: "Smart 1R Calculation",
      tradeSetup: "Trade Setup",
      accountSize: "Account Size ($)",
      useCurrentPortfolio: "Use Current Portfolio",
      manualPortfolioSize: "Enter Portfolio Size Manually",
      currentPortfolio: "Current Portfolio (from Settings)",
      riskPercent: "Risk Percent",
      direction: "Direction",
      long: "Long",
      short: "Short",
      btcMode: "BTC Mode",
      btcModeDesc: "Tips for wider stop and lower leverage (doesn't change calculations)",
      priceSettings: "Price Settings",
      entryAndStop: "Entry + Stop",
      entryAndPercent: "Entry + %",
      automatic: "Automatic",
      entryPrice: "Entry Price ($)",
      stopPrice: "Stop Price ($)",
      stopPercent: "Stop Percent",
      targetLeverage: "Target Leverage",
      autoStopNote: "💡 Stop will be calculated automatically based on target leverage",
      targets: "Targets (R-Multiples)",
      addTarget: "+ Add Target",
      tpAllocation: "🎯 Take Profit Allocation (% of remaining)",
      tpNote: "💡 Each target closes % of **remaining position** (not original)",
      tpDefault: "Default: R3=50% of all, R4=50% of remaining, R5=100% of remaining",
      numSlLevels: "Number of Stop Loss Levels",
      slAllocation: "🛑 Stop Loss Allocation (% of remaining)",
      slNote: "💡 Each SL closes % of remaining position (not original)",
      scaleIn: "Smart Scale-In",
      triggerR: "Trigger at R",
      additionalQty: "Additional Quantity (% of original)",
      scaleInWarning: "⚠️ Scale-In will only execute if target is reached and stop is moved to BE",
      calculate: "Calculate",
      summary: "Trade Summary",
      maxRisk: "Maximum Risk",
      expectedProfit: "Expected Profit",
      quantity: "Quantity",
      notional: "Notional Exposure",
      effectiveLeverage: "Effective Leverage",
      stopDistance: "Stop Distance",
      riskReward: "Risk:Reward Ratio (R:R)",
      btcModeNote: "BTC Mode: Consider wider stop (3-5%) and lower leverage (1-3x)",
      slLevels: "🛑 Stop Loss Levels",
      tpLevels: "🎯 Take Profit Levels",
      price: "Price",
      distance: "Distance",
      qtyToClose: "Qty to Close",
      remaining: "Remaining After",
      loss: "Loss",
      profit: "Profit",
      scaleInApproved: "✓ Scale-In Approved",
      scaleInNotRecommended: "✗ Scale-In Not Recommended",
      newQty: "New Quantity",
      newNotional: "New Notional",
      newLeverage: "New Leverage",
      enterDetails: "Enter Details and Calculate",
      enterDetailsDesc: "Fill in the parameters and click 'Calculate' for full analysis",
      howItWorks: "💡 How Does It Work?",
      howItWorksPoint1: "The system calculates absolute risk (1R) based on risk percentage of portfolio",
      howItWorksPoint2: "Quantity is calculated so that loss at stop equals exactly 1R",
      howItWorksPoint3: "Leverage is calculated automatically based on notional exposure divided by portfolio size",
      howItWorksPoint4: "Each R target is calculated as a multiple of the stop distance",
      howItWorksPoint5: "Scale-In only executes if target is reached and stop is moved to BE",
      saveTrade: "💾 Save Trade to Journal",
      saveTradeDesc: "Save calculated trade details to your trading journal",
      fromRemaining: "of remaining",
      fromAll: "of all",
      remove: "Remove",
      portfolioNote: "💡 Current portfolio calculated: Initial + PnL from closed trades",
      noSettingsWarning: "⚠️ No portfolio set in settings - go to Settings page"
    },
    tradingJournal: {
      title: "Professional Trading Journal",
      greeting: "Hello",
      greetingDefault: "Trader",
      subtitle: "Document and analyze your trading",
      dateRange: "Date Range",
      newTrade: "New Trade",
      searchPlaceholder: "Search by symbol...",
      allTrades: "All Trades",
      openTrades: "Open",
      closedTrades: "Closed",
      noTrades: "No trades found. Start documenting your trading!",
      noOpenTrades: "No open trades",
      noClosedTrades: "No closed trades",
      portfolio: {
        title: "Portfolio Overview",
        subtitle: "Complete view of all your activity",
        totalPnL: "Total PnL",
        realizedPnL: "Realized PnL",
        unrealizedPnL: "Unrealized PnL",
        realizedUnrealized: "Realized + Unrealized",
        fromClosedTrades: "From closed trades",
        openPositions: "open positions",
        growth: "Portfolio Growth Over Time",
        breakdown: "PnL Breakdown by Asset",
        noClosedTrades: "No closed trades yet",
        noData: "No data yet",
        openPositionsTitle: "Open Positions",
        live: "LIVE",
        long: "Long",
        short: "Short",
        close: "Close",
        total: "Total"
      },
      metrics: {
        avgPnLPerDay: "Avg Profit/Day",
        winDays: "Win Days",
        profitFactor: "Profit Factor",
        expectancy: "Trade Expectancy",
        avgPnL: "Avg PnL",
        totalProfit: "Total Profit"
      },
      charts: {
        dailyCumulative: "Daily Net Cumulative P&L",
        netDaily: "Net Daily P&L",
        noTrades: "No trades yet"
      },
      streak: {
        title: "Your Streak",
        winDays: "Win Days",
        lossDays: "Loss Days",
        keepGoing: "Keep it up! 🔥",
        comeback: "Come back strong! 💪"
      },
      calendar: {
        today: "Today",
        totalPnL: "Total PnL",
        profit: "Profit",
        loss: "Loss",
        successRate: "Win Rate"
      },
      timeline: {
        title: "Recent Trades",
        noTrades: "No trades yet",
        open: "Open",
        closed: "Closed"
      }
    },
    footer: {
      tagline: "Professional Trading Intelligence",
      disclaimer: "⚠️ For educational purposes only. Not financial advice. Trading involves significant risk."
    }
  }
};

const getTranslation = (lang, key) => {
  const keys = key.split('.');
  let value = translations[lang];
  
  for (const k of keys) {
    if (value && typeof value === 'object') {
      value = value[k];
    } else {
      return key;
    }
  }
  
  return value || key;
};

const LanguageContext = createContext();

export const LanguageProvider = ({ children }) => {
  const language = 'en';

  useEffect(() => {
    if (typeof document !== 'undefined') {
      document.documentElement.dir = 'ltr';
      document.documentElement.lang = 'en';
    }
  }, []);

  const t = (key) => {
    return getTranslation('en', key);
  };

  return (
    <LanguageContext.Provider value={{ language, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};