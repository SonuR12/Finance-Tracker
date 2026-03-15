"use client";

import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { motion } from "framer-motion";
import { Sparkles, Bell, BarChart3, ArrowLeftRight, TrendingUp, TrendingDown, PiggyBank, Target, Wallet, CreditCard, Receipt, ShieldCheck } from "lucide-react";
import StatCards from "./StatCards";
import IncomeExpenseChart from "./IncomeExpenseChart";
import SpendingChart from "./SpendingChart";
import WeeklyChart from "./WeeklyChart";
import BudgetProgress from "./BudgetProgress";
import RecentTransactions from "./RecentTransactions";
import AIInsights from "./AIInsights";

interface Props { name?: string | null }

function getGreeting() {
  const h = new Date().getHours();
  if (h < 12) return "Good morning";
  if (h < 17) return "Good afternoon";
  return "Good evening";
}

const TAB_TITLES: Record<string, { label: string; icon: any; desc: string }> = {
  dashboard:     { label: "Dashboard",     icon: BarChart3,       desc: "Your financial overview" },
  analytics:     { label: "Analytics",     icon: BarChart3,       desc: "Deep dive into your data" },
  "ai-insights": { label: "AI Insights",   icon: Sparkles,        desc: "Smart recommendations" },
  transactions:  { label: "Transactions",  icon: ArrowLeftRight,  desc: "All your transactions" },
  income:        { label: "Income",        icon: TrendingUp,      desc: "Income sources & trends" },
  expenses:      { label: "Expenses",      icon: TrendingDown,    desc: "Spending breakdown" },
  budget:        { label: "Budget",        icon: PiggyBank,       desc: "Budget limits & tracking" },
  savings:       { label: "Savings",       icon: Target,          desc: "Savings goals & progress" },
  accounts:      { label: "Accounts",      icon: Wallet,          desc: "Linked bank accounts" },
  cards:         { label: "Cards",         icon: CreditCard,      desc: "Credit & debit cards" },
  bills:         { label: "Bills",         icon: Receipt,         desc: "Upcoming bills & payments" },
  investments:   { label: "Investments",   icon: TrendingUp,      desc: "Portfolio & returns" },
  notifications: { label: "Notifications", icon: Bell,            desc: "Alerts & updates" },
  security:      { label: "Security",      icon: ShieldCheck,     desc: "Account security settings" },
};

function ComingSoon({ tab }: { tab: string }) {
  const info = TAB_TITLES[tab];
  const Icon = info?.icon ?? BarChart3;
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center justify-center h-80 gap-4 text-center"
    >
      <div className="h-16 w-16 rounded-2xl bg-indigo-50 dark:bg-indigo-950/40 flex items-center justify-center">
        <Icon className="h-8 w-8 text-indigo-500" />
      </div>
      <div>
        <p className="text-lg font-semibold text-neutral-800 dark:text-neutral-100">{info?.label ?? tab} coming soon</p>
        <p className="text-sm text-neutral-400 mt-1">{info?.desc ?? "This section is under construction."}</p>
      </div>
      <span className="px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-950/40 text-indigo-500 text-xs font-medium">In development</span>
    </motion.div>
  );
}

function DashboardHome({ name }: Props) {
  const firstName = name?.split(" ")[0] ?? "there";
  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="flex items-center justify-between"
      >
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-neutral-900 dark:text-white">
            {getGreeting()}, {firstName} 👋
          </h1>
          <p className="text-sm text-neutral-400 mt-0.5">Here's what's happening with your finances today.</p>
        </div>
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4, delay: 0.15 }}
          className="hidden sm:flex items-center gap-2 px-3 py-2 rounded-xl bg-gradient-to-r from-indigo-500 to-violet-600 text-white text-xs font-medium shadow-lg shadow-indigo-200 dark:shadow-indigo-900/40"
        >
          <Sparkles className="h-3.5 w-3.5" />
          AI-Powered Insights Active
        </motion.div>
      </motion.div>

      <StatCards />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2"><IncomeExpenseChart /></div>
        <AIInsights />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <SpendingChart />
        <WeeklyChart />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2"><RecentTransactions /></div>
        <BudgetProgress />
      </div>
    </div>
  );
}

function TabContent({ tab, name }: { tab: string; name?: string | null }) {
  switch (tab) {
    case "dashboard":    return <DashboardHome name={name} />;
    case "analytics":    return (
      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <IncomeExpenseChart />
          <SpendingChart />
        </div>
        <WeeklyChart />
      </div>
    );
    case "ai-insights":  return <AIInsights />;
    case "transactions": return <RecentTransactions />;
    case "expenses":     return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <SpendingChart />
        <WeeklyChart />
      </div>
    );
    case "budget":       return <BudgetProgress />;
    default:             return <ComingSoon tab={tab} />;
  }
}

function Inner({ name }: Props) {
  const params = useSearchParams();
  const tab = params.get("tab") ?? "dashboard";
  const info = TAB_TITLES[tab] ?? TAB_TITLES["dashboard"];
  const Icon = info.icon;

  return (
    <div className="flex flex-col min-h-screen">
      {/* Top bar */}
      <header className="sticky top-0 lg:top-0 z-30 h-14 flex items-center justify-between px-4 sm:px-6 border-b border-neutral-200 dark:border-neutral-800 bg-white/80 dark:bg-neutral-900/80 backdrop-blur-md flex-shrink-0">
        <div className="flex items-center gap-2.5">
          <div className="h-7 w-7 rounded-lg bg-indigo-50 dark:bg-indigo-950/40 flex items-center justify-center">
            <Icon className="h-3.5 w-3.5 text-indigo-500" />
          </div>
          <div>
            <p className="text-sm font-semibold text-neutral-800 dark:text-neutral-100 leading-none">{info.label}</p>
            <p className="text-[10px] text-neutral-400 mt-0.5">{info.desc}</p>
          </div>
        </div>
        <button className="relative p-2 rounded-lg text-neutral-500 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition">
          <Bell className="h-4 w-4" />
          <span className="absolute top-1.5 right-1.5 h-1.5 w-1.5 rounded-full bg-rose-500" />
        </button>
      </header>

      {/* Page content */}
      <main className="flex-1 px-4 sm:px-6 py-6 pt-20 lg:pt-6">
        <TabContent tab={tab} name={name} />
      </main>
    </div>
  );
}

export default function DashboardClient({ name }: Props) {
  return (
    <Suspense>
      <Inner name={name} />
    </Suspense>
  );
}
