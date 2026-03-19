"use client";

import { useEffect, useRef, useState } from "react";
import { useSettings } from "@/lib/settings-context";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { Sparkles, Bell, BarChart3, ArrowLeftRight, TrendingUp, TrendingDown, PiggyBank, Target, Wallet, CreditCard, Receipt, ShieldCheck, X, Send } from "lucide-react";
import { UserMenu } from "@/components/ui/UserMenu";
import StatCards from "./StatCards";
import IncomeExpenseChart from "./IncomeExpenseChart";
import SpendingChart from "./SpendingChart";
import WeeklyChart from "./WeeklyChart";
import BudgetProgress from "./BudgetProgress";
import RecentTransactions from "./RecentTransactions";
import AIInsights from "./AIInsights";
import { NOTIFICATIONS } from "./notifications";

interface Props { name?: string | null; image?: string | null; activeTab: string; onMobileMenuOpen?: () => void; onSettingsOpen?: () => void; readIds: number[]; setReadIds: React.Dispatch<React.SetStateAction<number[]>>; initialData: DashboardData; }

export interface DashboardData {
  stats: { totalBalance: number; monthlyIncome: number; monthlyExpenses: number; totalSavings: number };
  monthlyData: any[];
  spendingByCategory: any[];
  weeklySpending: any[];
  transactions: any[];
  budgets: any[];
  aiInsights: any[];
}

/* module-level cache — client-only, survives tab switches */
let dashboardCache: DashboardData | null = null;

function getGreeting() {
  const h = new Date().getHours();
  if (h < 12) return "Good morning";
  if (h < 17) return "Good afternoon";
  return "Good evening";
}

const TAB_TITLES: Record<string, { label: string; icon: any; desc: string }> = {
  dashboard:     { label: "Dashboard",     icon: BarChart3,      desc: "Your financial overview" },
  analytics:     { label: "Analytics",     icon: BarChart3,      desc: "Deep dive into your data" },
  "ai-insights": { label: "AI Insights",   icon: Sparkles,       desc: "Smart recommendations" },
  transactions:  { label: "Transactions",  icon: ArrowLeftRight, desc: "All your transactions" },
  income:        { label: "Income",        icon: TrendingUp,     desc: "Income sources & trends" },
  expenses:      { label: "Expenses",      icon: TrendingDown,   desc: "Spending breakdown" },
  budget:        { label: "Budget",        icon: PiggyBank,      desc: "Budget limits & tracking" },
  savings:       { label: "Savings",       icon: Target,         desc: "Savings goals & progress" },
  accounts:      { label: "Accounts",      icon: Wallet,         desc: "Linked bank accounts" },
  cards:         { label: "Cards",         icon: CreditCard,     desc: "Credit & debit cards" },
  bills:         { label: "Bills",         icon: Receipt,        desc: "Upcoming bills & payments" },
  investments:   { label: "Investments",   icon: TrendingUp,     desc: "Portfolio & returns" },
  notifications: { label: "Notifications", icon: Bell,           desc: "Alerts & updates" },
  security:      { label: "Security",      icon: ShieldCheck,    desc: "Account security settings" },
};

function ComingSoon({ tab }: { tab: string }) {
  const info = TAB_TITLES[tab];
  const Icon = info?.icon ?? BarChart3;
  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
       className="flex flex-col items-center justify-center min-h-[80vh] gap-4 text-center">
      <div className="h-16 w-16 rounded-2xl flex items-center justify-center" style={{ background: "color-mix(in srgb, var(--app-accent) 12%, transparent)" }}>
        <Icon className="h-8 w-8" style={{ color: "var(--app-accent)" }} />
      </div>
      <div>
        <p className="text-lg font-semibold text-neutral-800 dark:text-neutral-100">{info?.label ?? tab} coming soon</p>
        <p className="text-sm text-neutral-400 mt-1">{info?.desc ?? "This section is under construction."}</p>
      </div>
      <span className="px-3 py-1 rounded-full text-xs font-medium" style={{ background: "var(--app-accent)20", color: "var(--app-accent)" }}>In development</span>
    </motion.div>
  );
}

function DashboardHome({ name, d }: { name?: string | null; d: DashboardData }) {
  const firstName = name?.split(" ")[0] ?? "there";
  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}
        className="flex items-center justify-between">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-neutral-900 dark:text-white">
            {getGreeting()}, {firstName} 👋
          </h1>
          <p className="text-sm text-neutral-400 mt-0.5">Here's what's happening with your finances today.</p>
        </div>
        <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4, delay: 0.15 }}
          className="hidden sm:flex items-center gap-2 px-3 py-2 rounded-xl text-white text-xs font-medium shadow-lg"
          style={{ background: "linear-gradient(to right, var(--app-accent), var(--app-accent))" }}>
          <Sparkles className="h-3.5 w-3.5" />
          AI-Powered Insights Active
        </motion.div>
      </motion.div>
      <StatCards stats={d.stats} />
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2"><IncomeExpenseChart data={d.monthlyData} /></div>
        <AIInsights data={d.aiInsights} />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <SpendingChart data={d.spendingByCategory} />
        <WeeklyChart data={d.weeklySpending} />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2"><RecentTransactions data={d.transactions} /></div>
        <BudgetProgress data={d.budgets} />
      </div>
    </div>
  );
}

function NotificationsTab({ readIds, setReadIds }: { readIds: number[]; setReadIds: React.Dispatch<React.SetStateAction<number[]>> }) {
  const unread = NOTIFICATIONS.filter((n) => n.unread && !readIds.includes(n.id)).length;
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-base font-semibold text-neutral-800 dark:text-neutral-100">Notifications</p>
          {unread > 0 && <p className="text-xs text-neutral-400 mt-0.5">{unread} unread</p>}
        </div>
        {unread > 0 && (
          <button
            onClick={() => setReadIds(NOTIFICATIONS.filter((n) => n.unread).map((n) => n.id))}
            className="text-xs hover:underline" style={{ color: "var(--app-accent)" }}
          >
            Mark all read
          </button>
        )}
      </div>
      <div className="rounded-2xl border border-neutral-200 dark:border-neutral-800 overflow-hidden">
        {NOTIFICATIONS.map((n) => {
          const isUnread = n.unread && !readIds.includes(n.id);
          return (
            <button
              key={n.id}
              onClick={() => setReadIds((r) => [...r, n.id])}
              className={`w-full flex items-start gap-4 px-5 py-4 hover:bg-neutral-50 dark:hover:bg-neutral-800/60 transition text-left border-b border-neutral-100 dark:border-neutral-800 last:border-0`}
              style={isUnread ? { background: "var(--app-accent)10" } : {}}
            >
              <span className="text-2xl leading-none mt-0.5 flex-shrink-0">{n.icon}</span>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <p className={`text-sm ${isUnread ? "font-semibold text-neutral-800 dark:text-neutral-100" : "font-medium text-neutral-600 dark:text-neutral-300"}`}>
                    {n.title}
                  </p>
                  <span className="text-xs text-neutral-400 flex-shrink-0">{n.time}</span>
                </div>
                <p className="text-sm text-neutral-400 mt-0.5">{n.desc}</p>
              </div>
              {isUnread && <span className="h-2 w-2 rounded-full flex-shrink-0 mt-2" style={{ background: "var(--app-accent)" }} />}
            </button>
          );
        })}
      </div>
    </div>
  );
}

function TabContent({ tab, name, d, readIds, setReadIds }: { tab: string; name?: string | null; d: DashboardData; readIds: number[]; setReadIds: React.Dispatch<React.SetStateAction<number[]>> }) {
  switch (tab) {
    case "dashboard":    return <DashboardHome name={name} d={d} />;
    case "analytics":    return (
      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <IncomeExpenseChart data={d.monthlyData} />
          <SpendingChart data={d.spendingByCategory} />
        </div>
        <WeeklyChart data={d.weeklySpending} />
      </div>
    );
    case "ai-insights":  return <AIInsights data={d.aiInsights} />;
    case "transactions": return <RecentTransactions data={d.transactions} />;
    case "expenses":     return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <SpendingChart data={d.spendingByCategory} />
        <WeeklyChart data={d.weeklySpending} />
      </div>
    );
    case "budget":       return <BudgetProgress data={d.budgets} />;
    case "notifications": return <NotificationsTab readIds={readIds} setReadIds={setReadIds} />;
    default:             return <ComingSoon tab={tab} />;
  }
}

export default function DashboardClient({ name, image, activeTab, onMobileMenuOpen, onSettingsOpen, readIds, setReadIds, initialData }: Props) {
  const info = TAB_TITLES[activeTab] ?? TAB_TITLES["dashboard"];
  const Icon = info.icon;

  const [data] = useState<DashboardData>(initialData);
  const [notifOpen, setNotifOpen] = useState(false);
  const [atBottom, setAtBottom] = useState(false);
  const notifRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) setNotifOpen(false);
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const unreadCount = NOTIFICATIONS.filter((n) => n.unread && !readIds.includes(n.id)).length;

  return (
    <div className="flex flex-col h-full overflow-hidden">
      <header className="sticky top-0 z-30 h-14 flex items-center justify-between sm:pl-5 sm:pr-5 pr-6 pl-2 border-b border-neutral-200 dark:border-neutral-800 bg-white/80 dark:bg-neutral-900/80 backdrop-blur-md flex-shrink-0">
        {/* Left: hamburger on mobile, tab title on desktop */}
        <div className="flex items-center gap-2.5">
          <button
            onClick={onMobileMenuOpen}
            className="lg:hidden p-2.5 border rounded-xl text-neutral-500 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition"
          >
            <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          <div className="hidden lg:flex items-center gap-2.5">
            <div className="h-9 w-9 rounded-lg flex items-center justify-center" style={{ background: "color-mix(in srgb, var(--app-accent) 12%, transparent)" }}>
              <Icon className="h-5 w-5" style={{ color: "var(--app-accent)" }} />
            </div>
            <div>
              <p className="text-sm font-semibold text-neutral-800 dark:text-neutral-100 leading-none">{info.label}</p>
              <p className="text-[10px] text-neutral-400 mt-0.5">{info.desc}</p>
            </div>
          </div>
        </div>

        {/* Right: bell + user */}
        <div className="flex items-center gap-2">
          {/* Bell with dropdown */}
          <div className="relative" ref={notifRef}>
            <button
              onClick={() => { setNotifOpen((v) => !v); setAtBottom(false); }}
              className="relative p-2.5 rounded-xl text-neutral-500 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition"
            >
              <Bell className="h-5 w-5" />
              {unreadCount > 0 && (
                <span className="absolute top-1.5 right-1.5 h-4 min-w-4 px-0.5 rounded-full bg-rose-500 text-white text-[9px] font-bold flex items-center justify-center">
                  {unreadCount}
                </span>
              )}
            </button>

            <AnimatePresence>
              {notifOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 8, scale: 0.96 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 8, scale: 0.96 }}
                  transition={{ duration: 0.15 }}
                  className="absolute right-0 top-full mt-2 w-80 rounded-2xl border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-900 shadow-xl shadow-black/10 z-50"
                >
                  <div className="flex items-center justify-between px-4 py-3 border-b border-neutral-100 dark:border-neutral-800">
                    <div>
                      <p className="text-sm font-semibold text-neutral-800 dark:text-neutral-100">Notifications</p>
                      {unreadCount > 0 && <p className="text-xs text-neutral-400">{unreadCount} unread</p>}
                    </div>
                    <div className="flex items-center gap-1">
                      {unreadCount > 0 && (
                        <button
                          onClick={() => setReadIds(NOTIFICATIONS.filter((n) => n.unread).map((n) => n.id))}
                          className="text-xs hover:underline px-2 py-1" style={{ color: "var(--app-accent)" } as any}
                        >
                          Mark all read
                        </button>
                      )}
                      <button onClick={() => setNotifOpen(false)} className="p-1 rounded-lg text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition">
                        <X className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>
                  <div className="relative">
                    <div
                      id="notif-scroll"
                      onScroll={(e) => {
                        const el = e.currentTarget;
                        setAtBottom(el.scrollHeight - el.scrollTop <= el.clientHeight + 4);
                      }}
                      className="overflow-y-auto max-h-72"
                    >
                    {NOTIFICATIONS.map((n) => {
                      const isUnread = n.unread && !readIds.includes(n.id);
                      return (
                        <button
                          key={n.id}
                          onClick={() => setReadIds((r) => [...r, n.id])}
                          className={`w-full flex items-start gap-3 px-4 py-3 hover:bg-neutral-50 dark:hover:bg-neutral-800/60 transition text-left border-b border-neutral-100 dark:border-neutral-800/60 last:border-0`}
                          style={isUnread ? { background: "var(--app-accent)10" } : {}}
                        >
                          <span className="text-lg leading-none mt-0.5 flex-shrink-0">{n.icon}</span>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between gap-2">
                              <p className={`text-sm truncate ${isUnread ? "font-semibold text-neutral-800 dark:text-neutral-100" : "font-medium text-neutral-600 dark:text-neutral-300"}`}>
                                {n.title}
                              </p>
                              <span className="text-[10px] text-neutral-400 flex-shrink-0">{n.time}</span>
                            </div>
                            <p className="text-xs text-neutral-400 mt-0.5 line-clamp-2">{n.desc}</p>
                          </div>
                          {isUnread && <span className="h-2 w-2 rounded-full flex-shrink-0 mt-1.5" style={{ background: "var(--app-accent)" }} />}
                        </button>
                      );
                    })}
                    </div>
                    {/* Scroll-down arrow */}
                    {!atBottom && (
                      <div className="absolute bottom-2 right-2">
                        <button
                          onClick={() => {
                            const el = document.getElementById("notif-scroll");
                            if (el) el.scrollBy({ top: 120, behavior: "smooth" });
                          }}
                          className="flex items-center justify-center h-7 w-7 rounded-full text-white shadow-md transition"
                          style={{ background: "var(--app-accent)" }}
                        >
                          <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" /></svg>
                        </button>
                      </div>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* User menu (mobile only) — same as home page */}
          <div className="lg:hidden">
            <UserMenu image={image} name={name} onSettings={onSettingsOpen} size={36} />
          </div>
        </div>
      </header>

      <main className="flex-1 overflow-y-auto px-4 sm:px-6 py-4 pt-4 lg:pt-6">
        <TabContent tab={activeTab} name={name} d={data} readIds={readIds} setReadIds={setReadIds} />
      </main>

      <AIFloatingButton insights={data.aiInsights} data={data} />
    </div>
  );
}

function buildContext(insights: any[], data: DashboardData, currency: string, currencySymbol: string, language: string): string {
  const sym = currencySymbol;
  const txList = data.transactions
    .slice(0, 10)
    .map((t: any) => `  ${t.icon} ${t.name} (${t.category}): ${t.amount > 0 ? "+" : ""}${sym}${Math.abs(t.amount)} on ${t.date}`)
    .join("\n");
  const budgetList = data.budgets
    .map((b: any) => `  ${b.category}: spent ${sym}${b.spent} of ${sym}${b.limit} limit${b.spent > b.limit ? " [OVER BUDGET]" : ""}`)
    .join("\n");
  const spendingList = data.spendingByCategory
    .map((s: any) => `  ${s.name}: ${sym}${s.value}`)
    .join("\n");
  const weeklyList = data.weeklySpending
    .map((w: any) => `  ${w.day}: ${sym}${w.amount}`)
    .join("\n");
  const insightList = insights.map((i: any) => `  [${i.type}] ${i.title}: ${i.desc}`).join("\n");

  return [
    `User currency: ${currency} (${sym}) — always use this currency symbol in all monetary values`,
    `User language: ${language} — always respond in this language`,
    `Today's date: ${new Date().toDateString()}`,
    `
FINANCIAL SUMMARY:`,
    `  Total Balance: ${sym}${data.stats.totalBalance}`,
    `  Monthly Income: ${sym}${data.stats.monthlyIncome}`,
    `  Monthly Expenses: ${sym}${data.stats.monthlyExpenses}`,
    `  Total Savings: ${sym}${data.stats.totalSavings}`,
    `  Savings Rate: ${Math.round((data.stats.totalSavings / data.stats.monthlyIncome) * 100)}%`,
    `
RECENT TRANSACTIONS (last 10):`,
    txList,
    `
BUDGET STATUS:`,
    budgetList,
    `
SPENDING BY CATEGORY:`,
    spendingList,
    `
WEEKLY SPENDING:`,
    weeklyList,
    `
AI INSIGHTS:`,
    insightList,
  ].join("\n");
}

function AIFloatingButton({ insights, data }: { insights: any[]; data: DashboardData }) {
  const { currency, currencySymbol, language } = useSettings();
  const STORAGE_KEY = "ai_chat_history";
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<{ role: "user" | "ai"; text: string }[]>(() => {
    try { return JSON.parse(localStorage.getItem(STORAGE_KEY) ?? "[]"); } catch { return []; }
  });
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(messages)); } catch {}
  }, [messages]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  useEffect(() => {
    if (open) bottomRef.current?.scrollIntoView({ behavior: "instant" });
  }, [open]);

  async function handleSend(override?: string) {
    const trimmed = (typeof override === "string" ? override : input).trim();
    if (!trimmed || loading) return;
    const userMsg = { role: "user" as const, text: trimmed };
    setMessages((m) => [...m, userMsg]);
    setInput("");
    setLoading(true);
    try {
      const history = [...messages, userMsg].map((m) => ({
        role: m.role === "user" ? "user" : "assistant",
        content: m.text,
      }));
      const context = buildContext(insights, data, currency, currencySymbol, language);
      const res = await fetch("/api/ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: history, context }),
      });
      const json = await res.json();
      setMessages((m) => [...m, { role: "ai", text: json.reply ?? json.error ?? "Something went wrong." }]);
    } catch {
      setMessages((m) => [...m, { role: "ai", text: "Network error. Please try again." }]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 16, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.96 }}
            transition={{ duration: 0.2 }}
            className="fixed bottom-24 right-5 z-50 w-100 h-100 rounded-2xl border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-900 shadow-2xl shadow-black/15 flex flex-col overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-neutral-100 dark:border-neutral-800" style={{ background: "color-mix(in srgb, var(--app-accent) 8%, transparent)" }}>
              <div className="flex items-center gap-2">
                <Sparkles className="h-4 w-4" style={{ color: "var(--app-accent)" }} />
                <p className="text-sm font-semibold text-neutral-800 dark:text-neutral-100">AI Finance Assistant</p>
              </div>
              <div className="flex items-center gap-1">
                {messages.length > 0 && (
                  <button onClick={() => setMessages([])} className="text-[10px] px-2 py-0.5 rounded-lg text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition">Clear</button>
                )}
                <button onClick={() => setOpen(false)} className="p-1 rounded-lg text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition">
                  <X className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3 min-h-0">
              {messages.length === 0 && (
                <div className="py-2">
                  <Image src="/Images/chatbot-icon.jpg" alt="AI" width={32} height={32} className="mx-auto mb-2 rounded-full" />
                  <p className="text-xs text-neutral-400 text-center mb-3">Ask me anything about your finances!</p>
                  <div className="flex flex-col gap-1.5">
                    {[
                      "How can I reduce my expenses?",
                      "Show my recent transactions",
                      "Which budget am I over?",
                      "Where am I spending the most?",
                      "Stock market today?",
                      "How to improve my savings rate?",
                    ].map((q) => (
                      <button key={q} onClick={() => handleSend(q)}
                        className="text-xs px-3 py-2 hover:cursor-pointer rounded-xl border border-neutral-200 dark:border-neutral-700 text-neutral-600 dark:text-neutral-400 hover:bg-neutral-50 dark:hover:bg-neutral-800 transition text-left">
                        {q}
                      </button>
                    ))}
                  </div>
                </div>
              )}
              {messages.map((m, i) => (
                <div key={i} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
                  <div className={`max-w-[85%] px-3 py-2 rounded-xl text-xs leading-relaxed ${
                    m.role === "user"
                      ? "text-white rounded-br-sm"
                      : "bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 rounded-bl-sm"
                  }`} style={m.role === "user" ? { background: "var(--app-accent)" } : {}}>
                    {m.role === "user" ? m.text : (
                      <div className="space-y-1.5">
                        {m.text
                          .split(/(?<=[.!?])\ +|\n+/)
                          .map(s => s.trim())
                          .filter(Boolean)
                          .map((sentence, j) => (
                            <p key={j}>{sentence}</p>
                          ))}
                      </div>
                    )}
                  </div>
                </div>
              ))}
              {loading && (
                <div className="flex justify-start">
                  <div className="px-3 py-2 rounded-xl rounded-bl-sm bg-neutral-100 dark:bg-neutral-800 text-xs text-neutral-400 italic tracking-wide">
                    Analysing...
                  </div>
                </div>
              )}
              <div ref={bottomRef} />
            </div>

            {/* Input */}
            <div className="px-3 py-3 border-t border-neutral-100 dark:border-neutral-800 flex gap-2">
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSend()}
                placeholder="Ask about your finances…"
                className="flex-1 text-xs px-3 py-2 rounded-xl border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 text-neutral-800 dark:text-neutral-100 placeholder-neutral-400 outline-none focus:border-current transition"
              />
              <button
                onClick={() => handleSend()}
                disabled={!input.trim() || loading}
                className="h-8 w-8 rounded-xl flex items-center justify-center text-white transition disabled:opacity-40"
                style={{ background: "var(--app-accent)" }}
              >
                <Send className="h-3.5 w-3.5" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* FAB */}
      <motion.button
        onClick={() => setOpen((v) => !v)}
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.94 }}
        className="fixed bottom-6 right-5 z-50 h-14 w-14 rounded-2xl overflow-hidden shadow-xl shadow-black/20 transition"
      >
        <AnimatePresence mode="wait">
          {open
            ? <motion.span key="x" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }} transition={{ duration: 0.15 }} className="flex items-center justify-center h-full w-full bg-neutral-800"><X className="h-5 w-5 text-white" /></motion.span>
            : <motion.span key="img" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.15 }} className="block h-full w-full"><Image src="/Images/chatbot-icon.jpg" alt="AI Assistant" fill className="object-cover" /></motion.span>
          }
        </AnimatePresence>
      </motion.button>
    </>
  );
}

