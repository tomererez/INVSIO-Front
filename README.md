# INVSIO Platform

INVSIO is a smart trading platform split into two independent applications, now featuring a unified **Dark Space / Glassmorphism** design system.

## Applications

### 1. Marketing App (Port 2800)
Public-facing marketing website showcasing INVSIO features, pricing, and information.
Features deep-space aesthetics with dynamic nebula effects and glassmorphic UI elements.

**Location:** `apps/marketing-app/`

### 2. Terminal App (Port 4200)
Private trading terminal with advanced analytics and trading tools.
Optimized for data density with a dark, low-eye-strain interface.

**Location:** `apps/terminal-app/`

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

---

## Project Structure

```
INVSIO-Front/
├── apps/
│   ├── marketing-app/    # Public marketing site (Port 2800)
│   └── terminal-app/     # Trading terminal (Port 4200)
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