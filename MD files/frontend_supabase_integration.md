# INVSIO — Frontend ↔ Supabase Integration Specification

This document defines the full workflow for integrating the INVSIO frontend (React/Vite) with the Supabase backend. It is intended for Antigravity and future developers to reference during generation of UI, logic, and data connections.

The goal is to ensure a consistent, scalable, and secure connection between the frontend and the Supabase database.

---

## 1. Overview
INVSIO uses Supabase as the backend layer, which provides:
- Authentication (email/password)
- PostgreSQL database (profiles, trades, and more)
- Row-Level Security (RLS) enforcing per-user access
- REST/JS client auto-generated for all tables

The frontend interacts directly with Supabase without needing a custom backend.

---

## 2. Supabase Architecture
### 2.1 Authentication (`auth.users`)
Supabase handles:
- User signup
- User login
- Session handling
- Password resets

A database trigger creates a matching `profiles` row for every new user.

### 2.2 Database Tables
Custom tables:

| Table | Description |
|-------|-------------|
| `profiles` | Extended user information mapped 1:1 with `auth.users` |
| `trades` | All trading entries for each individual user |
| *(Optional future tables)* `accounts`, `journal_entries`, `performance_snapshots` |

### 2.3 Row Level Security (RLS)
- Regular users can access **only their own rows**.
- Admin users (role = `admin`) can **view/manage all rows**.

All frontend queries automatically respect these rules.

---

## 3. Environment Variables (Frontend)
Create a `.env` file with:

```
VITE_SUPABASE_URL=https://PROJECT_ID.supabase.co
VITE_SUPABASE_ANON_KEY=PUBLIC_ANON_KEY
```

These values must be accessed using Vite's `import.meta.env`.

---

## 4. Initializing the Supabase Client
Create a global client inside:
```
src/lib/supabaseClient.ts
```

```ts
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseKey);
```

This instance is reused across the app.

---

## 5. Authentication Workflow
### 5.1 Signup
```ts
const { data, error } = await supabase.auth.signUp({
  email,
  password
});
```
A trigger automatically inserts a row into `profiles` linked to the user.

### 5.2 Login
```ts
const { data, error } = await supabase.auth.signInWithPassword({
  email,
  password
});
```

### 5.3 Session Handling
```ts
const { data: { user } } = await supabase.auth.getUser();

supabase.auth.onAuthStateChange((event, session) => {
  // Update global state
});
```

The session should be stored in global state (e.g., React Context or Zustand).

---

## 6. Fetching Data From Supabase
### 6.1 Fetch Profile
```ts
const { data: profile } = await supabase
  .from('profiles')
  .select('*')
  .single();
```

### 6.2 Fetch Trades
```ts
const { data: trades } = await supabase
  .from('trades')
  .select('*')
  .order('opened_at', { ascending: false });
```

RLS ensures users only receive the rows that belong to them.

Admin users receive all rows.

---

## 7. Inserting Data
### Insert Trade
```ts
const { data, error } = await supabase
  .from('trades')
  .insert([
    {
      user_id: user.id, // validated by RLS
      symbol,
      side,
      entry_price,
      size_usd,
      exchange
    }
  ]);
```

If the authenticated user does not match `user_id`, the insert fails automatically.

---

## 8. Updating & Deleting Data
### Update Trade
```ts
await supabase
  .from('trades')
  .update({ exit_price })
  .eq('id', tradeId);
```

### Delete Trade
```ts
await supabase
  .from('trades')
  .delete()
  .eq('id', tradeId);
```

RLS again ensures proper permissions.

---

## 9. Recommended Frontend Structure
```
src/
  lib/
    supabaseClient.ts
  services/
    auth.ts        // login, signup, session helpers
    trades.ts      // fetchTrades(), addTrade(), updateTrade()
  hooks/
    useAuth.ts     // manages auth state and session
  pages/
    Login/
    Dashboard/
    Trades/
```

This keeps UI components clean and centralizes all Supabase communication.

---

## 10. Frontend Responsibilities
### The frontend **must**:
- Use the shared Supabase client
- Handle all authentication through Supabase
- Perform data operations using the Supabase JS client
- Expect Supabase to enforce access via RLS
- Handle loading, empty, and error states

### The frontend must **not**:
- Store any private keys in the browser
- Manually enforce security checks
- Fetch all rows and filter on the frontend

---

## 11. Purpose of This Document
This document guides Antigravity and developers in generating:
- Authentication screens
- Dashboard views
- Trade input forms
- CRUD operations
- State management and session flow

It defines the integration contract between the frontend and Supabase.

---

## 12. Summary
This specification outlines the complete workflow for:
- Initializing Supabase
- Authenticating users
- Fetching and manipulating user-specific data
- Respecting RLS security
- Structuring frontend logic

This markdown file should be added to the project's repository and referenced by Antigravity when generating code or UI elements.

