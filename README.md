# INVSIO Platform

INVSIO is a smart trading platform split into two independent applications.

## Applications

### 1. Marketing App (Port 5180)
Public-facing marketing website showcasing INVSIO features, pricing, and information.

**Location:** `apps/marketing-app/`

### 2. Terminal App (Port 5181)
Private trading terminal with advanced analytics and trading tools.

**Location:** `apps/terminal-app/`

---

## Running the Apps

### Marketing App
```bash
cd apps/marketing-app
npm install
npm run dev
```
Opens at: http://localhost:5180/

### Terminal App
```bash
cd apps/terminal-app
npm install
npm run dev
```
Opens at: http://localhost:5181/

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
│   ├── marketing-app/    # Public marketing site (Port 5180)
│   └── terminal-app/     # Trading terminal (Port 5181)
├── .env                  # Environment variables
├── .gitignore           # Git ignore rules
└── README.md            # This file
```

---

## Tech Stack

- **Frontend:** React 18 + Vite
- **Styling:** Tailwind CSS
- **UI Components:** Radix UI + shadcn/ui
- **Routing:** React Router v7
- **Charts:** Recharts
- **Animation:** Framer Motion