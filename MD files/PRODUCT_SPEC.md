# INVSIO.AI – Product Vision & Platform Spec

## 1. One-Liner

**From whales' behavior to your position size – INVSIO connects market data and risk management into one decision-making platform, so you don't have to stare at screens all day.**

---

## 2. Purpose & Scope

INVSIO.AI is a web-based trading companion focused on **market understanding and decision support**, not automated trading or financial advice.

The platform:

- Aggregates advanced market data (order flow, derivatives metrics, cross-exchange context) into a **clear market bias and narrative**.
- Connects that bias to **position sizing, journaling, and coaching**, so the trader can:
  - Understand what's going on in the market.
  - Act with a structured plan.
  - Learn from their own trades over time.

This document focuses **only on the product** (not on community, content ecosystem, or brand assets).  
It is meant to be the **source of truth** during the build: product behavior, expectations, and the end result we're aiming for.

---

## 3. Target Users

INVSIO is intentionally designed to serve a wide spectrum of traders in crypto derivatives:

1. **Active Day Traders**
   - Trade intraday on BTC.
   - Already familiar with concepts like OI, CVD, funding, and order flow.
   - Want to save time and screen-watching by offloading data reading to the platform.

2. **Intermediate / "Serious Amateur" Traders**
   - Understand basic trading (long/short, leverage, risk per trade).
   - Curious or partially familiar with advanced metrics but struggle to interpret them consistently.
   - Want structure, better decisions, and a clear process.

3. **Ambitious Beginners**
   - Know how to place trades on an exchange.
   - Barely know what OI, funding, or CVD are.
   - Want a tool that explains market conditions and helps them learn over time through reflection and feedback.

The common thread:  
**They want to understand the "mood" and structure of the market without spending their entire day glued to charts.**

---

## 4. Problems INVSIO Solves

### 4.1 Market Understanding Is Fragmented and Time-Consuming

- Traders must juggle:
  - Price charts
  - Open interest dashboards
  - CVD/volume tools
  - Funding dashboards
  - Multiple exchanges
- This leads to:
  - **Screen fatigue**
  - Missed context (looking at one metric without the others)
  - Inconsistent decision-making

### 4.2 No Single "Decision Layer"

Most tools give **raw data** or **indicators**, not a structured decision layer.  
Traders are left asking:

- "Is this really a good time to look for longs?"
- "Is this pump real or just shorts getting squeezed?"
- "Should I even be trading here, or just wait?"

### 4.3 Lack of Structured Learning from Past Trades

- Many traders don't journal.
- Those who do, rarely review their journals effectively.
- There is almost no **objective, consistent feedback** on:
  - Over-risking
  - Overtrading
  - Fighting the market bias
  - Emotional or impulsive behavior

---

## 5. Core Product Concept

INVSIO is a **decision-support and learning platform** that connects three layers:

1. **Market Layer – "What's the market doing?"**
   - Analyzes BTC derivatives and order-flow data from Binance and Bybit (coin-margined).
   - Synthesizes metrics into a clear **market bias** and explanation.

2. **Execution Prep Layer – "How should I structure this trade?"**
   - Risk & position calculator tied directly to the current market context.
   - User-controlled risk slider (e.g., 1–10% of account per trade), without enforcing a specific philosophy.

3. **Reflection & Coaching Layer – "What am I doing right/wrong?"**
   - Trade journal integrated into the workflow.
   - AI coach reviewing trades over time, highlighting patterns and giving practical suggestions.

The result:  
**One place to check the market, prepare trades, and review performance – instead of ten tabs and endless chart babysitting.**

---

## 6. MVP Feature Set

### 6.1 AI Market Analyzer (Flagship Module)

**Goal:** Turn complex derivatives and order-flow data into a **clear, human-readable picture** of the market.

**Scope (MVP):**

- **Instruments:**
  - BTC only (initially).
- **Exchanges:**
  - Binance.
  - Bybit (coin-margined).

**Outputs:**

- **Market Bias:**
  - `Bullish`, `Bearish`, or `Neutral / Wait`.
- **Bias Strength:**
  - Numeric / qualitative strength indicator (e.g., "weak bullish", "strong bearish").
- **Short Narrative:**
  - 1–3 sentence explanation of what's going on:
    - E.g., "Price is ranging while OI rises and CVD is negative – suggests new shorts entering into strength, caution on chasing longs."

**Inputs (Conceptual Metrics):**

- Price action & structure.
- Open Interest (changes, spikes, drops).
- CVD / aggressor flow.
- Funding rate behavior.
- Liquidations (clusters, spikes).
- Volume & volatility context.
- Cross-exchange comparison (e.g., differences between Binance and Bybit behavior).

> **Important:**  
> The exact formulas and weights are implemented in the backend.  
> At the product level, the expectation is: **consistent, explainable bias and narrative, not random "feel."**

---

### 6.2 Risk & Position Calculator

**Goal:** Allow the trader to quickly size a position in line with their own risk preferences.

**Inputs:**

- Account size (or trading capital for this account).
- Risk percentage via slider (e.g., 1–10%).
- Entry price.
- Stop-loss price.
- (Optional) Take-profit price(s).

**Outputs:**

- Position size (contracts / notional).
- Approximate potential loss at stop.
- Approximate potential gain at TP (optional).
- Risk-to-reward ratio (if TP is provided).

**Key behavior:**

- Flexible: the platform does **not** enforce a specific risk model.
- Designed to be **fast and intuitive**:
  - The trader can move from Analyzer → Calculator in seconds.

**Integration:**

- One-click action: **"Log this plan to journal"** directly from the calculator.

---

### 6.3 Smart Alerts (MVP)

**Goal:** Notify the user of **meaningful changes**, not just raw metric fluctuations.

**MVP Behavior:**

- Alerts on:
  - Significant shifts in **market bias** (e.g., from Bullish to Neutral/Bearish).
  - Sudden changes in key metrics (e.g., sharp OI move + unusual CVD + funding flip).
- Delivery channels:
  - Initially in-app; future consideration for email / push / Telegram, etc.

The focus is on **high-signal events**, not spamming the user every time OI ticks up.

---

### 6.4 Trade Journal

**Goal:** Make journaling part of the natural flow, not an afterthought.

**Core behavior:**

- From the **Position Calculator**, the user can click:
  - **"Add to Trade Journal"**
- This logs:
  - Instrument (BTC).
  - Direction (long/short/other).
  - Entry, stop, TP.
  - Chosen risk (%).
  - Market bias at the time.
  - Optional free-text note: "Why am I taking this trade?"

**Post-trade:**

- The user can later update:
  - Outcome (Win/Loss/BE).
  - Final result (R, % or amount – depending on implementation).
  - Short reflection.

The idea: **logging trades becomes a natural step before placing them on the exchange.**

---

### 6.5 AI Trading Coach

**Goal:** Help traders improve by analyzing their behavior over time.

**Inputs:**

- Historical trades from the journal (plans + outcomes).
- Context at the time of each trade:
  - Market bias.
  - Risk used.
  - Result.

**Outputs (Examples):**

- Observations like:
  - "You consistently risk more than 5% when the bias is Neutral or against your trade."
  - "Your best performance comes when you trade in the direction of the bias and risk between 1–3%."
  - "You tend to overtrade after a losing day."

**Use Cases:**

- Periodic reviews:
  - Weekly / monthly summary.
- Per-trade feedback:
  - Short comments on recent trades.

The coach is **not a signal generator**.  
It is a pattern detector and feedback layer based on the user's own behavior.

---

### 6.6 Performance Dashboard

**Goal:** Provide a clean overview of trading performance and activity.

**Key elements (MVP):**

- Equity curve over time.
- Winrate.
- Average R / risk-adjusted performance (if applicable).
- Number of trades.
- Days active.
- Basic breakdowns:
  - Trades with vs. against market bias.
  - Distribution of risk percentages used.

---

### 6.7 Future / Phase 2+ (Not MVP)

Features that are **explicitly out of scope for MVP**, but part of the vision:

- **Liquidity Map / Heatmap Chart**
  - Visual chart with key liquidity zones and areas of interest.
- **Additional Instruments & Exchanges**
  - More pairs beyond BTC.
  - Wider exchange support.
- **Deeper multi-timeframe AI agents**
  - Macro, intraday, and micro-timeframe agents working together.
- **Optional API-based trade connectivity**
  - Reading fills and PnL automatically from exchanges.
- **Community / education layer**
  - Structured learning content, live sessions, etc.

---

## 7. Data & Metrics – Conceptual Model

### 7.1 Supported Markets (MVP)

- **Asset:** BTC (futures / perpetuals).
- **Exchanges:**
  - Binance.
  - Bybit (coin-margined).

### 7.2 Metrics Considered

At a product level, INVSIO considers (non-exhaustive):

- Price action (trend, ranges, volatility).
- Open interest (accumulation/distribution, squeezes, flushes).
- CVD / aggressor flow (who is more aggressive – buyers or sellers).
- Funding rate behavior (extremes, flips, persistence).
- Liquidations (clusters, spikes, squeezes).
- Volume patterns.
- Cross-exchange comparisons (differences in behavior between Binance and Bybit).

### 7.3 Bias Engine (Conceptual)

- INVSIO does **not** output "Buy/Sell signals".
- Instead, it:
  - Aggregates metrics into a **bias score**:
    - Long bias score.
    - Short bias score.
  - Converts this into:
    - `Bullish`, `Bearish`, or `Neutral / Wait`.
  - Provides a short explanation so the user understands *why* the bias exists.

Exact formulas and weights are defined in the backend and can evolve over time; the front-end contract is stable: **bias + strength + explanation.**

---

## 8. Key User Flows

### 8.1 Daily Market Check-In

1. User opens INVSIO.
2. AI Market Analyzer shows:
   - Current bias for BTC.
   - Strength + short explanation.
3. User decides:
   - "Is this a day to look for longs, shorts, or mostly stand aside?"

### 8.2 Pre-Trade Flow

1. User reviews the **Market Analyzer**.
2. If they decide to plan a trade:
   - Open the **Risk & Position Calculator**.
3. Fill in:
   - Account size.
   - Risk percentage (slider).
   - Entry, stop, TP (optional).
4. Platform returns:
   - Position size, projected loss, projected gain (optional).
5. User clicks:
   - **"Add to Trade Journal"** to log the trade plan.
6. User executes the trade manually on the exchange of their choice.

### 8.3 Post-Trade Review

1. After the trade is closed, user returns to INVSIO.
2. Updates:
   - Outcome (Win/Loss/BE).
   - Result (R, % or amount).
   - Optional reflection.
3. Over time, **AI Coach**:
   - Analyzes patterns.
   - Provides feedback and insights about behavior and performance.

---

## 9. Technical / Architecture Overview (High Level)

> Note: This is a conceptual overview for product and design. Exact implementation details remain flexible.

1. **Data Layer**
   - Pulls market data from external providers (order flow, derivatives analytics, funding, liquidations, etc.).
   - Normalizes metrics across Binance and Bybit into a consistent internal format.

2. **Feature & Analysis Layer**
   - Computes derived features (trend, squeezes, divergences, etc.).
   - Aggregates metrics into a **bias model** for BTC.

3. **AI & Explanation Layer**
   - Generates:
     - Bias classification (`Bullish / Bearish / Neutral`).
     - Strength.
     - Human-readable explanation.

4. **Application Layer**
   - Exposure of:
     - Market Analyzer API.
     - Risk & Position Calculator logic.
     - Journal & Coach endpoints.
   - Frontend renders:
     - Dashboard.
     - Calculator.
     - Journal.
     - Settings.

5. **Storage Layer**
   - User accounts.
   - Trade journal entries.
   - Configuration (e.g., default risk preference).

---

## 10. Pricing & Access Model (Draft Direction)

> Exact pricing and packaging are **TBD** and can change. This section captures the current *direction*.

Planned tiers:

- **Free**
  - Limited access.
  - Example: Position calculator + very basic view of market bias (no history, limited detail).

- **Pro (around $25/month)**
  - Full access to:
    - AI Market Analyzer.
    - Trade journal.
    - Basic AI Coach features.
    - Standard alerts.

- **Elite (around $60/month)**
  - Everything in Pro, plus:
    - Advanced alerts.
    - Deeper AI coaching and analysis.
    - Priority access to new features.

Final scope per tier will be refined closer to launch.

---

## 11. Principles, Constraints & Compliance

1. **Educational Use Only**
   - INVSIO is built as a **learning and decision-support tool**.
   - It does **not** provide financial advice.
   - It does **not** guarantee profits or outcomes.

2. **No "Buy/Sell Signals" Promise**
   - The platform outputs **market bias and context**, not "Buy now / Sell now" directives.
   - Wording and UI must reflect:
     - "Analysis", "insights", "bias", "context" – not guaranteed signals.

3. **User Responsibility**
   - All trading decisions are made by the user, on their own accounts and platforms.
   - INVSIO does not hold user funds or execute orders (at least in the initial phases).

4. **Transparency Over Hype**
   - Insights must be explainable.
   - No unrealistic marketing claims in the product itself.

---

## 12. Future Directions (Beyond MVP)

- Add more coins and markets.
- More sophisticated liquidity and volume maps.
- Multi-timeframe AI agents (macro, intraday, micro) working together.
- Integration with trading platforms for auto-importing trade history.
- Deeper educational layers:
  - Structured training around how to interpret the Analyzer.
  - Playbooks based on market regimes.

---

## 13. Summary

INVSIO.AI aims to be the **single place** where a trader can:

- Understand the current state of the BTC derivatives market.
- Prepare trades with clear, consistent structure.
- Log, review, and improve their behavior over time with AI-powered feedback.

Not a magic box. Not a "get rich" button.  
A serious tool for traders who want **less noise, more clarity, and a real process.**
