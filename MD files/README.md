# INVSIO Platform

INVSIO is a smart trading platform split into three independent applications, featuring a unified **Dark Space / Glassmorphism** design system.

## Applications

### 1. Marketing App (Port 2800)
Public-facing marketing website showcasing INVSIO features, pricing, and information.
Features deep-space aesthetics with dynamic nebula effects and glassmorphic UI elements.

**Location:** `apps/marketing-app/`

### 2. Terminal App (Port 4200)
Private trading terminal with advanced analytics and trading tools.
Optimized for data density with a dark, low-eye-strain interface.

**Location:** `apps/terminal-app/`

### 3. Admin App (Port 4300) 🔐
Isolated admin command center for platform management and monitoring.
Security-isolated from the terminal app for enhanced protection.

**Location:** `apps/admin-app/`

**Features:**
- 15+ modular dashboard sections
- User management with tier control
- Analyzer control panel (restart, version, cache, debug)
- AI performance & drift tracking
- Error intelligence with categorized logs
- Behavioral & risk engine monitoring
- Cross-module intelligence
- Audit & security logs
- Feature toggles

**Credentials:** `admin@invsio.com` / `admin123`

---

## Running the Apps

### Marketing App
```bash
cd apps/marketing-app
npm install
npm run dev
```
Opens at: http://localhost:2800/

### Terminal App
```bash
cd apps/terminal-app
npm install
npm run dev
```
Opens at: http://localhost:4200/

### Admin App
```bash
cd apps/admin-app
npm install
npm run dev
```
Opens at: http://localhost:4300/

---

## Building for Production

### Marketing App
```bash
cd apps/marketing-app
npm run build
```

### Terminal App
```bash
cd apps/terminal-app
npm run build
```

### Admin App
```bash
cd apps/admin-app
npm run build
```

---

## Project Structure

```
INVSIO-Front/
├── apps/
│   ├── marketing-app/    # Public marketing site (Port 2800)
│   ├── terminal-app/     # Trading terminal (Port 4200)
│   └── admin-app/        # Admin command center (Port 4300) 🔐
├── .env                  # Environment variables
├── .gitignore            # Git ignore rules
└── README.md             # This file
```

---

## Tech Stack

- **Frontend:** React 18 + Vite
- **Styling:** Tailwind CSS
- **UI Components:** Framer Motion (Animations), Lucide React (Icons)
- **Design System:** Custom Glassmorphism & Nebula Effects
- **Routing:** React Router v6
- **Charts:** Recharts
- **State Management:** TanStack Query