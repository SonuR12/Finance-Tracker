# 💰 AI Finance Tracker

An AI-powered personal finance tracker built with **Next.js 16**, **NextAuth v5**, and **MongoDB**, featuring a clean responsive dashboard, smart transaction management, and real-time financial insights.

---

## Features

- 🤖 **AI-Generated Insights** — Intelligent spending analysis and suggestions based on your transaction history
- 📊 **Interactive Charts** — Weekly spending bar chart and income/expense area chart powered by Recharts
- 💳 **Transaction Tracking** — Add, filter, and search transactions across income and expense categories
- 📈 **Stat Cards** — Total balance, income, expenses, and savings overview at a glance
- 🔔 **Notifications** — In-app notification panel with unread indicators
- 🌍 **Multi-Language Support** — 15 languages: English, Spanish, French, German, Hindi, Italian, Japanese, Korean, Dutch, Polish, Portuguese, Russian, Turkish, Chinese, Arabic
- 🎨 **Customizable Theme** — App-wide accent color picker with hex presets; persisted to localStorage
- 🔐 **Authentication** — Sign in, Sign up, Forgot password with email OTP verification via Nodemailer
- 👤 **User Profile** — Update display name, manage account settings
- 📱 **Fully Responsive** — Optimized for mobile and desktop with icon-only sidebar on mobile
- 🌐 **3D Auth Scene** — Three.js animated background on the sign-in page

---

## Tech Stack

| Category | Library |
|---|---|
| Framework | [Next.js 16](https://nextjs.org) |
| Auth | [NextAuth.js v5](https://next-auth.js.org) |
| Database | [MongoDB](https://mongodb.com) + [Prisma](https://prisma.io) |
| Animations | [Framer Motion](https://www.framer.com/motion/) |
| Charts | [Recharts](https://recharts.org) |
| 3D | [React Three Fiber](https://docs.pmnd.rs/react-three-fiber) + [Three.js](https://threejs.org) |
| i18n | [next-intl](https://next-intl-docs.vercel.app) |
| UI | [shadcn/ui](https://ui.shadcn.com) + [Radix UI](https://radix-ui.com) + [Lucide Icons](https://lucide.dev) |
| Styling | [Tailwind CSS v4](https://tailwindcss.com) |
| Email | [Nodemailer](https://nodemailer.com) |
| Toasts | [Sonner](https://sonner.emilkowal.ski) |

---

## Folder Structure

```
finance/
├── prisma/
│   └── schema.prisma           # Prisma DB schema
├── public/
│   ├── Images/                 # Static images (logo, hero, budget)
│   └── svg/                    # SVG icons
├── src/
│   ├── app/
│   │   ├── (auth)/
│   │   │   ├── sign-in/        # Sign in page
│   │   │   └── forgot-password/ # Password reset page
│   │   ├── api/
│   │   │   ├── auth/           # NextAuth route handler
│   │   │   ├── authentication/ # signup, verify-code, update-name, etc.
│   │   │   ├── dashboard/      # Dashboard data API
│   │   │   └── settings/       # User settings API
│   │   ├── dashboard/          # Main dashboard page
│   │   ├── globals.css         # Global styles + CSS variables
│   │   ├── layout.tsx          # Root layout
│   │   └── page.tsx            # Landing/home page
│   ├── components/
│   │   ├── auth/
│   │   │   └── FinanceScene.tsx # Three.js 3D auth background
│   │   ├── dashboard/
│   │   │   ├── AIInsights.tsx       # AI-generated insight cards
│   │   │   ├── BudgetProgress.tsx   # Budget progress bars
│   │   │   ├── DashboardClient.tsx  # Main dashboard shell + notifications
│   │   │   ├── DashboardNav.tsx     # Top navigation bar
│   │   │   ├── DashboardShell.tsx   # Layout wrapper
│   │   │   ├── IncomeExpenseChart.tsx # Area chart
│   │   │   ├── RecentTransactions.tsx # Transaction list with filters
│   │   │   ├── Sidebar.tsx          # Collapsible sidebar nav
│   │   │   ├── SpendingChart.tsx    # Spending breakdown chart
│   │   │   ├── StatCards.tsx        # Summary stat cards
│   │   │   ├── WeeklyChart.tsx      # Weekly bar chart
│   │   │   ├── data.ts              # Mock/static data
│   │   │   └── notifications.ts     # Notification data
│   │   ├── home/
│   │   │   ├── Footer.tsx
│   │   │   ├── Hero.tsx
│   │   │   └── Navbar.tsx
│   │   ├── ui/
│   │   │   ├── AccentButton.tsx     # Reusable AccentButton + AccentToggle
│   │   │   ├── SettingsDialog.tsx   # Settings modal (profile, theme, language)
│   │   │   ├── UserMenu.tsx         # User avatar dropdown
│   │   │   └── ...                  # shadcn/ui primitives
│   │   └── SignOutButton.tsx
│   ├── data/
│   │   ├── categories.tsx      # Transaction categories
│   │   └── home.tsx            # Home page content data
│   ├── lib/
│   │   ├── auth.ts             # NextAuth config
│   │   ├── email.ts            # Nodemailer email helpers
│   │   ├── i18n-context.tsx    # Language context + switcher
│   │   ├── mongodb.ts          # MongoDB client
│   │   ├── settings-context.tsx # Theme color + settings state
│   │   └── utils.ts            # Utility functions
│   ├── messages/               # i18n JSON files (15 languages)
│   │   ├── en.json, es.json, fr.json, de.json, hi.json
│   │   ├── it.json, ja.json, ko.json, nl.json, pl.json
│   │   ├── pt.json, ru.json, tr.json, zh.json, ar.json
│   └── types/
│       └── next-auth.d.ts      # NextAuth type extensions
```

---

## Getting Started

### 1. Install dependencies

```bash
npm install
```

### 2. Set up environment variables

Copy `.env.example` to `.env` and fill in your values:

```bash
cp .env.example .env
```

Required environment variables:

```env
# Site Configuration
NEXT_PUBLIC_SITE_URL=http://localhost:3000
NEXT_PUBLIC_SITE_NAME=Finance Tracker
NEXT_PUBLIC_SITE_DESCRIPTION=Track and manage your personal finances

# NextAuth Configuration
NEXTAUTH_URL=http://localhost:3000
AUTH_SECRET=<generate_with_openssl_rand_base64_32>

# MongoDB
MONGODB_URI=<your_mongodb_connection_string>

# SMTP Configuration (for email verification)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=<your_email>
SMTP_PASS=<your_email_app_password>

# AI Provider (choose one)
AI_PROVIDER=groq  # or openai, gemini
GROQ_API_KEY=<your_groq_api_key>  # Free tier available
# OPENAI_API_KEY=<your_openai_api_key>
# GEMINI_API_KEY=<your_gemini_api_key>
```

**Generate AUTH_SECRET:**
```bash
openssl rand -base64 32
```

**SMTP Setup (Gmail):**
1. Go to [Google Account Settings](https://myaccount.google.com/security)
2. Enable 2-Step Verification
3. Generate an App Password for "Mail"
4. Use the 16-character app password as `SMTP_PASS`

### 3. Generate Prisma client

```bash
npx prisma generate
```

### 4. Run the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the app.

---

## Deploy on Vercel

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new)

Connect your GitHub repository to Vercel and add the environment variables in the Vercel dashboard. Vercel auto-deploys on every push to `main`.