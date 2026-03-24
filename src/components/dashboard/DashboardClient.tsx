"use client";

import { useEffect, useRef, useState } from "react";
import { useSettings } from "@/lib/settings-context";
import { useT } from "@/lib/i18n-context";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, Bell, BarChart3, ArrowLeftRight, TrendingUp, TrendingDown, PiggyBank, Target, Wallet, CreditCard, Receipt, ShieldCheck, X, Send, Trash2 } from "lucide-react";
import { AppButton } from "@/components/ui/AppButton";

function BotIcon({ size = 32, color }: { size?: number; color: string }) {
  const id = `bg-${color.replace("#", "")}`;
  return (
    <svg width={size} height={size} viewBox="0 0 56 56" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="56" height="56" rx="14" fill={`url(#${id})`} />
      <line x1="28" y1="8" x2="28" y2="14" stroke="white" strokeWidth="2.5" strokeLinecap="round" />
      <circle cx="28" cy="7" r="2.5" fill="white" />
      <rect x="12" y="14" width="32" height="24" rx="8" fill="white" fillOpacity="0.18" />
      <rect x="12" y="14" width="32" height="24" rx="8" stroke="white" strokeOpacity="0.5" strokeWidth="1.5" />
      <circle cx="22" cy="25" r="4" fill="white" />
      <circle cx="34" cy="25" r="4" fill="white" />
      <circle cx="23" cy="25" r="2" fill={color} />
      <circle cx="35" cy="25" r="2" fill={color} />
      <circle cx="24" cy="24" r="0.8" fill="white" />
      <circle cx="36" cy="24" r="0.8" fill="white" />
      <path d="M22 31 Q28 35 34 31" stroke="white" strokeWidth="2" strokeLinecap="round" fill="none" />
      <rect x="18" y="40" width="20" height="10" rx="5" fill="white" fillOpacity="0.18" stroke="white" strokeOpacity="0.4" strokeWidth="1.2" />
      <circle cx="24" cy="45" r="1.5" fill="white" fillOpacity="0.8" />
      <circle cx="28" cy="45" r="1.5" fill="white" fillOpacity="0.8" />
      <circle cx="32" cy="45" r="1.5" fill="white" fillOpacity="0.8" />
      <defs>
        <linearGradient id={id} x1="0" y1="0" x2="56" y2="56" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor={color} />
          <stop offset="100%" stopColor={color} stopOpacity="0.7" />
        </linearGradient>
      </defs>
    </svg>
  );
}
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

const TAB_ICON_MAP: Record<string, any> = {
  dashboard:     BarChart3,
  analytics:     BarChart3,
  "ai-insights": Sparkles,
  transactions:  ArrowLeftRight,
  income:        TrendingUp,
  expenses:      TrendingDown,
  budget:        PiggyBank,
  savings:       Target,
  accounts:      Wallet,
  cards:         CreditCard,
  bills:         Receipt,
  investments:   TrendingUp,
  notifications: Bell,
  security:      ShieldCheck,
};

function ComingSoon({ tab }: { tab: string }) {
  const t = useT();
  const Icon = TAB_ICON_MAP[tab] ?? BarChart3;
  const labelKey = `dashboard.${tab === "ai-insights" ? "aiInsightsTab" : tab}`;
  const descKey = `dashboard.tabDesc.${tab === "ai-insights" ? "aiInsights" : tab}`;
  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
       className="flex flex-col items-center justify-center min-h-[80vh] gap-4 text-center">
      <div className="h-16 w-16 rounded-2xl flex items-center justify-center" style={{ background: "color-mix(in srgb, var(--app-accent) 12%, transparent)" }}>
        <Icon className="h-8 w-8" style={{ color: "var(--app-accent)" }} />
      </div>
      <div>
        <p className="text-lg font-semibold text-neutral-800 dark:text-neutral-100">{t(labelKey)} {t("dashboard.comingSoon")}</p>
        <p className="text-sm text-neutral-400 mt-1">{t(descKey)}</p>
      </div>
      <span className="px-3 py-1 rounded-full text-xs font-medium" style={{ background: "var(--app-accent)20", color: "var(--app-accent)" }}>{t("dashboard.inDevelopment")}</span>
    </motion.div>
  );
}

function DashboardHome({ name, d }: { name?: string | null; d: DashboardData }) {
  const t = useT();
  const firstName = name?.split(" ")[0] ?? "there";
  const greetingKey = (() => {
    const h = new Date().getHours();
    if (h < 12) return "dashboard.goodMorning";
    if (h < 17) return "dashboard.goodAfternoon";
    return "dashboard.goodEvening";
  })();
  return (
    <div className="space-y-4 sm:space-y-6">
      <motion.div initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}
        className="flex items-center justify-between">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-neutral-900 dark:text-white">
            {t(greetingKey)}, {firstName} 👋
          </h1>
          <p className="text-sm text-neutral-400 mt-0.5">{t("dashboard.financesOverview")}</p>
        </div>
        <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4, delay: 0.15 }}
          className="hidden sm:flex items-center gap-2 px-3 py-2 rounded-xl text-white text-xs font-medium shadow-lg"
          style={{ background: "linear-gradient(to right, var(--app-accent), var(--app-accent))" }}>
          <Sparkles className="h-3.5 w-3.5" />
          {t("dashboard.aiPowered")}
        </motion.div>
      </motion.div>
      <StatCards stats={d.stats} />
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 lg:h-[320px]"><IncomeExpenseChart data={d.monthlyData} /></div>
        <div className="h-[320px]"><AIInsights data={d.aiInsights} /></div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <SpendingChart data={d.spendingByCategory} />
        <WeeklyChart data={d.weeklySpending} />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 h-[420px] sm:h-[380px]"><RecentTransactions data={d.transactions} /></div>
        <div className="h-[420px] sm:h-[380px]"><BudgetProgress data={d.budgets} /></div>
      </div>
    </div>
  );
}

function NotificationsTab({ readIds, setReadIds }: { readIds: number[]; setReadIds: React.Dispatch<React.SetStateAction<number[]>> }) {
  const t = useT();
  const unread = NOTIFICATIONS.filter((n) => n.unread && !readIds.includes(n.id)).length;
  return (
    <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.1 }}
      className="rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 p-5 flex flex-col h-full overflow-hidden">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="font-semibold text-neutral-900 dark:text-white">{t("dashboard.notifications")}</h3>
          {unread > 0 && <p className="text-xs text-neutral-400 mt-0.5">{unread} {t("dashboard.unread")}</p>}
        </div>
        {unread > 0 && (
          <button onClick={() => setReadIds(NOTIFICATIONS.filter((n) => n.unread).map((n) => n.id))}
            className="text-xs hover:underline" style={{ color: "var(--app-accent)" }}>
            {t("dashboard.markAllRead")}
          </button>
        )}
      </div>
      <div className="flex-1 overflow-y-auto space-y-1 pr-1 min-h-0">
        {NOTIFICATIONS.map((n) => {
          const isUnread = n.unread && !readIds.includes(n.id);
          return (
            <button key={n.id} onClick={() => setReadIds((r) => [...r, n.id])}
              className="w-full flex items-start gap-3 p-2.5 rounded-xl hover:bg-neutral-50 dark:hover:bg-neutral-800/60 transition text-left"
              style={isUnread ? { background: "var(--app-accent)08" } : {}}>
              <span className="text-xl leading-none mt-0.5 flex-shrink-0">{n.icon}</span>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <p className={`text-sm truncate ${isUnread ? "font-semibold text-neutral-800 dark:text-neutral-100" : "font-medium text-neutral-600 dark:text-neutral-300"}`}>{n.title}</p>
                  <span className="text-xs text-neutral-400 flex-shrink-0">{n.time}</span>
                </div>
                <p className="text-xs text-neutral-400 mt-0.5">{n.desc}</p>
              </div>
              {isUnread && <span className="h-2 w-2 rounded-full flex-shrink-0 mt-1.5" style={{ background: "var(--app-accent)" }} />}
            </button>
          );
        })}
      </div>
    </motion.div>
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
    case "ai-insights":  return <div className="h-[calc(100vh-7rem)]"><AIInsights data={d.aiInsights} /></div>;
    case "transactions": return <div className="h-[calc(100vh-7rem)]"><RecentTransactions data={d.transactions} /></div>;
    case "expenses":     return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <SpendingChart data={d.spendingByCategory} />
        <WeeklyChart data={d.weeklySpending} />
      </div>
    );
    case "budget":       return <div className="h-[calc(100vh-7rem)]"><BudgetProgress data={d.budgets} /></div>;
    case "notifications": return <div className="h-[calc(100vh-7rem)]"><NotificationsTab readIds={readIds} setReadIds={setReadIds} /></div>;
    default:             return <ComingSoon tab={tab} />;
  }
}

export default function DashboardClient({ name, image, activeTab, onMobileMenuOpen, onSettingsOpen, readIds, setReadIds, initialData }: Props) {
  const t = useT();
  const Icon = TAB_ICON_MAP[activeTab] ?? BarChart3;
  const tabLabelKey = `dashboard.${activeTab === "ai-insights" ? "aiInsightsTab" : activeTab}`;
  const tabDescKey = `dashboard.tabDesc.${activeTab === "ai-insights" ? "aiInsights" : activeTab}`;

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
              <p className="text-sm font-semibold text-neutral-800 dark:text-neutral-100 leading-none">{t(tabLabelKey)}</p>
              <p className="text-[10px] text-neutral-400 mt-0.5">{t(tabDescKey)}</p>
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
                  className="absolute -right-10 sm:right-0 top-full mt-4 w-80 rounded-2xl border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-900 shadow-xl shadow-black/10 z-50"
                >
                  <div className="flex items-center justify-between px-4 py-3 border-b border-neutral-100 dark:border-neutral-800">
                    <div>
                      <p className="text-sm font-semibold text-neutral-800 dark:text-neutral-100">{t("dashboard.notifications")}</p>
                      {unreadCount > 0 && <p className="text-xs text-neutral-400">{unreadCount} {t("dashboard.unread")}</p>}
                    </div>
                    <div className="flex items-center gap-1">
                      {unreadCount > 0 && (
                        <button
                          onClick={() => setReadIds(NOTIFICATIONS.filter((n) => n.unread).map((n) => n.id))}
                          className="text-xs hover:underline px-2 py-1" style={{ color: "var(--app-accent)" } as any}
                        >
                          {t("dashboard.markAllRead")}
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
            <UserMenu image={image} name={name} onSettings={onSettingsOpen} width={28} height={28} />
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

type ChatMsg = { role: "user" | "ai"; text: string; time: string };

function nowTime() {
  return new Date().toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit", hour12: true });
}

function TypingDots() {
  return (
    <div className="flex items-center gap-1 px-1 py-0.5">
      {[0, 1, 2].map((i) => (
        <motion.span
          key={i}
          className="h-1.5 w-1.5 rounded-full bg-neutral-400 dark:bg-neutral-500 block"
          animate={{ y: [0, -4, 0] }}
          transition={{ duration: 0.6, repeat: Infinity, delay: i * 0.15, ease: "easeInOut" }}
        />
      ))}
    </div>
  );
}

function AIFloatingButton({ insights, data }: { insights: any[]; data: DashboardData }) {
  const t = useT();
  const { currency, currencySymbol, language } = useSettings();
  const STORAGE_KEY = "ai_chat_history";
  const [open, setOpen] = useState(false);
  const [closing, setClosing] = useState(false);
  const [showHint, setShowHint] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setShowHint(false), 2000);
    return () => clearTimeout(timer);
  }, []);

  function openChat()  { setOpen(true); }
  function closeChat() {
    setClosing(true);
    setTimeout(() => { setOpen(false); setClosing(false); }, 120);
  }
  function toggleChat() { open ? closeChat() : openChat(); }
  const [input, setInput] = useState("");
  const [focused, setFocused] = useState(false);
  const [messages, setMessages] = useState<ChatMsg[]>(() => {
    try { return JSON.parse(localStorage.getItem(STORAGE_KEY) ?? "[]"); } catch { return []; }
  });
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

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
    const userMsg: ChatMsg = { role: "user", text: trimmed, time: nowTime() };
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
      setMessages((m) => [...m, { role: "ai", text: json.reply ?? json.error ?? "Something went wrong.", time: nowTime() }]);
    } catch {
      setMessages((m) => [...m, { role: "ai", text: "Network error. Please try again.", time: nowTime() }]);
    } finally {
      setLoading(false);
    }
  }

  const suggestions = [
    t("dashboard.suggestedQ1"),
    t("dashboard.suggestedQ2"),
    t("dashboard.suggestedQ3"),
    t("dashboard.suggestedQ4"),
  ];

  return (
    <>
      {open && (
        <div
          className={`ai-chat-${closing ? "close" : "open"} fixed bottom-22 right-4 sm:right-5 z-50 flex flex-col rounded-2xl overflow-hidden shadow-2xl shadow-black/20 border border-neutral-200 dark:border-neutral-700/80 bg-white dark:bg-neutral-900`}
          style={{ width: "min(360px, calc(100vw - 2rem))", height: "min(580px, calc(100svh - 100px))" }}
        >
            {/* ── Header ── */}
            <div
              className="flex items-center justify-between px-4 py-3 flex-shrink-0"
              style={{ background: "linear-gradient(135deg, color-mix(in srgb, var(--app-accent) 93%, transparent), color-mix(in srgb, var(--app-accent) 60%, black))" }}
            >
              <div className="flex items-center gap-2.5">
                <div className="relative">
                  <div className="h-9 w-9 rounded-xl bg-white/20 flex items-center justify-center overflow-hidden">
                    <BotIcon size={32} color="var(--app-accent)" />
                  </div>
                  <span className="absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full bg-emerald-400 border-2 border-white" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-white leading-none">{t("dashboard.aiAssistant")}</p>
                  <p className="text-[10px] text-white/70 mt-0.5">
                    {loading ? "Analysing…" : "Online · Finance AI"}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-1">
                {messages.length > 0 && (
                  <button
                    onClick={() => setMessages([])}
                    className="p-1.5 rounded-lg text-white/70 hover:text-white hover:bg-white/15 transition"
                    title="Clear chat"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                )}
                <button
                  onClick={closeChat}
                  className="p-1.5 rounded-lg text-white/70 hover:text-white hover:bg-white/15 transition"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
            <div className="flex-1 overflow-y-auto px-3 py-4 space-y-4 min-h-0 bg-neutral-50 dark:bg-neutral-950/40">
              {messages.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full gap-4 px-2">
                  <div className="h-14 w-14 rounded-2xl flex items-center justify-center shadow-lg overflow-hidden">
                    <BotIcon size={56} color="var(--app-accent)" />
                  </div>
                  <div className="text-center">
                    <p className="text-sm font-semibold text-neutral-700 dark:text-neutral-200">{t("dashboard.aiAssistant")}</p>
                    <p className="text-xs text-neutral-400 mt-1">{t("dashboard.askFinances")}</p>
                  </div>
                  <div className="w-full flex flex-col gap-2 mt-1">
                    {suggestions.map((q) => (
                      <button
                        key={q}
                        onClick={() => handleSend(q)}
                        className="text-xs px-3 py-2.5 rounded-xl border border-neutral-200 dark:border-neutral-700 text-neutral-600 dark:text-neutral-400 hover:text-white transition text-left flex items-center gap-2 group"
                        style={{ background: "transparent" }}
                        onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.background = "var(--app-accent)"; (e.currentTarget as HTMLButtonElement).style.borderColor = "var(--app-accent)"; (e.currentTarget as HTMLButtonElement).style.color = "white"; }}
                        onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.background = "transparent"; (e.currentTarget as HTMLButtonElement).style.borderColor = ""; (e.currentTarget as HTMLButtonElement).style.color = ""; }}
                      >
                        <Sparkles className="h-3 w-3 flex-shrink-0 opacity-50 group-hover:opacity-100" />
                        {q}
                      </button>
                    ))}
                  </div>
                </div>
              ) : (
                messages.map((m, i) => {
                  const isUser = m.role === "user";
                  const showAvatar = !isUser && (i === 0 || messages[i - 1]?.role === "user");
                  return (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.18 }}
                      className={`flex items-end gap-2 ${isUser ? "justify-end" : "justify-start"}`}
                    >
                      {/* AI avatar */}
                      {!isUser && (
                        <div className="flex-shrink-0 h-6 w-6 rounded-full flex items-center justify-center mb-0.5 overflow-hidden">
                          {showAvatar && <BotIcon size={24} color="var(--app-accent)" />}
                        </div>
                      )}
                      <div className={`flex flex-col gap-1 max-w-[78%] ${isUser ? "items-end" : "items-start"}`}>
                        <div
                          className={`px-3 py-2.5 text-xs leading-relaxed ${
                            isUser
                              ? "text-white rounded-2xl rounded-br-sm shadow-sm"
                              : "bg-white dark:bg-neutral-800 text-neutral-700 dark:text-neutral-200 rounded-2xl rounded-bl-sm border border-neutral-100 dark:border-neutral-700 shadow-sm"
                          }`}
                          style={isUser ? { background: "color-mix(in srgb, var(--app-accent) 80%, transparent)" } : {}}
                        >
                          {isUser ? m.text : (
                            <div className="space-y-1.5">
                              {m.text.split(/\n+/).map(s => s.trim()).filter(Boolean).map((s, j) => (
                                <p key={j} dangerouslySetInnerHTML={{ __html: s.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>') }} />
                              ))}
                            </div>
                          )}
                        </div>
                        <span className="text-[10px] text-neutral-400 px-1">{m.time}</span>
                      </div>
                    </motion.div>
                  );
                })
              )}

              {/* Typing indicator */}
              {loading && (
                <motion.div
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-end gap-2"
                >
                  <div className="flex-shrink-0 h-6 w-6 rounded-full flex items-center justify-center overflow-hidden">
                    <BotIcon size={24} color="var(--app-accent)" />
                  </div>
                  <div className="px-3 py-2.5 rounded-2xl rounded-bl-sm bg-white dark:bg-neutral-800 border border-neutral-100 dark:border-neutral-700 shadow-sm">
                    <TypingDots />
                  </div>
                </motion.div>
              )}
              <div ref={bottomRef} />
            </div>

            {/* ── Input ── */}
            <div className="px-3 py-3 border-t border-neutral-100 dark:border-neutral-800 bg-white dark:bg-neutral-900 flex-shrink-0">
              <div
                className="flex items-center gap-2 px-3 py-2 rounded-xl border bg-neutral-50 dark:bg-neutral-800 transition-colors cursor-text"
                style={{ borderColor: focused ? "var(--app-accent)" : undefined }}
                onClick={() => inputRef.current?.focus()}
              >
                <input
                  ref={inputRef}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && handleSend()}
                  onFocus={() => setFocused(true)}
                  onBlur={() => setFocused(false)}
                  placeholder={t("dashboard.askPlaceholder")}
                  className="flex-1 text-xs bg-transparent text-neutral-800 dark:text-neutral-100 placeholder-neutral-400 outline-none"
                />
                <button
                  onClick={() => handleSend()}
                  disabled={!input.trim() || loading}
                  className="h-7 w-7 rounded-lg flex items-center justify-center text-white transition-all disabled:opacity-35 flex-shrink-0"
                  style={{ background: "var(--app-accent)" }}
                >
                  <Send className="h-3 w-3" />
                </button>
              </div>
              <p className="text-[10px] text-neutral-400 text-center mt-1.5">AI · Finance Assistant</p>
            </div>
        </div>
      )}

      {/* Hint tooltip */}
      <AnimatePresence>
        {showHint && !open && (
          <motion.div
            initial={{ opacity: 0, y: 6, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 6, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="fixed bottom-24 right-4 sm:right-5 z-50 flex items-center gap-2 px-3 py-2 rounded-xl text-white text-xs font-medium shadow-lg pointer-events-none"
            style={{ background: "linear-gradient(135deg, color-mix(in srgb, var(--app-accent) 93%, transparent), color-mix(in srgb, var(--app-accent) 60%, black))" }}
          >
            {/* <Sparkles className="h-3.5 w-3.5 flex-shrink-0" /> */}
            {t("dashboard.aiAssistant")}
            {/* Arrow pointing down */}
            <span
              className="absolute -bottom-1.5 right-5 h-3 w-3 rotate-45"
              style={{ background: "color-mix(in srgb, var(--app-accent) 60%, black)" }}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* FAB */}
      <AppButton
        variant="primary"
        onClick={toggleChat}
        className="fixed bottom-6 right-4 sm:right-5 z-50 !h-14 !w-14 !rounded-2xl !p-0 flex items-center justify-center active:scale-95"
        style={{ boxShadow: "0 4px 14px color-mix(in srgb, var(--app-accent) 33%, transparent)" }}
      >
        <span
          className="absolute flex items-center justify-center transition-all duration-150"
          style={{ opacity: open ? 1 : 0, transform: open ? "rotate(0deg) scale(1)" : "rotate(-90deg) scale(0.5)" }}
        >
          <X className="h-5 w-5 text-white" />
        </span>
        <span
          className="absolute flex items-center justify-center transition-all duration-150"
          style={{ opacity: open ? 0 : 1, transform: open ? "rotate(90deg) scale(0.5)" : "rotate(0deg) scale(1)" }}
        >
          <BotIcon size={40} color="var(--app-accent)" />
        </span>
      </AppButton>
    </>
  );
}

