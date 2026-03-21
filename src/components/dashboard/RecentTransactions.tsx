"use client";

import { useMemo, useState, useTransition } from "react";
import { motion } from "framer-motion";
import { useSettings } from "@/lib/settings-context";
import { useT } from "@/lib/i18n-context";
import { Search } from "lucide-react";
import { AppButton } from "@/components/ui/AppButton";

export default function RecentTransactions({ data }: { data: any[] }) {
  const { currencySymbol } = useSettings();
  const t = useT();
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<"all" | "income" | "expense">("all");
  const [atBottom, setAtBottom] = useState(false);
  const [, startTransition] = useTransition();

  function checkBottom(el: HTMLElement) {
    setAtBottom(el.scrollHeight - el.scrollTop <= el.clientHeight + 4);
  }


    const fakeData = [
    { id: 101, name: "Test 1", category: "Food", amount: -10, date: "Jan 1", icon: "🍕" },
    { id: 102, name: "Test 2", category: "Food", amount: -20, date: "Jan 2", icon: "🍕" },
    { id: 103, name: "Test 3", category: "Food", amount: -30, date: "Jan 3", icon: "🍕" },
    { id: 104, name: "Test 4", category: "Food", amount: -40, date: "Jan 4", icon: "🍕" },
    { id: 105, name: "Test 5", category: "Food", amount: -50, date: "Jan 5", icon: "🍕" },
    { id: 106, name: "Test 6", category: "Food", amount: -60, date: "Jan 6", icon: "🍕" },
    { id: 107, name: "Test 7", category: "Food", amount: -70, date: "Jan 7", icon: "🍕" },
    { id: 108, name: "Test 8", category: "Food", amount: -80, date: "Jan 8", icon: "🍕" },
    { id: 109, name: "Test 9", category: "Food", amount: -90, date: "Jan 9", icon: "🍕" },
    { id: 110, name: "Test 10", category: "Food", amount: -100, date: "Jan 10", icon: "🍕" },
    { id: 111, name: "Netflix", category: "Entertainment", amount: -15.99, date: "Jan 11", icon: "🎬" },
    { id: 112, name: "Salary", category: "Income", amount: 5400, date: "Jan 12", icon: "💰" },
    { id: 113, name: "Uber", category: "Transport", amount: -12.50, date: "Jan 13", icon: "🚗" },
    { id: 114, name: "Spotify", category: "Entertainment", amount: -9.99, date: "Jan 14", icon: "🎵" },
    { id: 115, name: "Gym", category: "Health", amount: -49.99, date: "Jan 15", icon: "💪" },
    { id: 116, name: "Amazon", category: "Shopping", amount: -134.20, date: "Jan 16", icon: "📦" },
    { id: 117, name: "Freelance", category: "Income", amount: 850, date: "Jan 17", icon: "💻" },
    { id: 118, name: "Electric Bill", category: "Utilities", amount: -92.00, date: "Jan 18", icon: "⚡" },
    { id: 119, name: "Coffee Shop", category: "Food", amount: -6.50, date: "Jan 19", icon: "☕" },
    { id: 120, name: "Rent", category: "Housing", amount: -1200, date: "Jan 20", icon: "🏠" },
    { id: 121, name: "Dividends", category: "Income", amount: 220, date: "Jan 21", icon: "📈" },
    { id: 122, name: "Apple Store", category: "Shopping", amount: -49.00, date: "Jan 22", icon: "🍎" },
    { id: 123, name: "Gas Station", category: "Transport", amount: -55.00, date: "Jan 23", icon: "⛽" },
    { id: 124, name: "Doctor Visit", category: "Health", amount: -30.00, date: "Jan 24", icon: "🏥" },
    { id: 125, name: "Restaurant", category: "Food", amount: -62.80, date: "Jan 25", icon: "🍽️" },
  ];

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return fakeData.filter((tx) => {
      const matchSearch = !q || tx.name.toLowerCase().includes(q) || tx.category.toLowerCase().includes(q);
      const matchFilter =
        filter === "all" ||
        (filter === "income" && tx.amount > 0) ||
        (filter === "expense" && tx.amount < 0);
      return matchSearch && matchFilter;
    });
  }, [data, search, filter]);

  return (
    <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.45 }}
      className="rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 p-5 h-full flex flex-col overflow-hidden min-h-0">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="font-semibold text-neutral-900 dark:text-white">{t("dashboard.recentTransactions")}</h3>
          <p className="text-xs text-neutral-400 mt-0.5">{data.length} {t("dashboard.transactions")}</p>
        </div>
        <div className="flex gap-1.5">
          {(["all", "income", "expense"] as const).map((f) => (
            <AppButton
              key={f}
              variant={filter === f ? "primary" : "subtle"}
              size="sm"
              className="rounded-full capitalize"
              onClick={() => setFilter(f)}
            >
              {t(`dashboard.${f === "all" ? "all" : f === "income" ? "income" : "expenses"}`)}
            </AppButton>
          ))}
        </div>
      </div>
      <div className="relative mb-3">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-neutral-400" />
        <input value={search} onChange={(e) => { const v = e.target.value; startTransition(() => setSearch(v)); }}
          placeholder={t("dashboard.searchTransactions")}
          className="w-full pl-8 pr-3 py-2 text-sm rounded-lg bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 text-neutral-800 dark:text-neutral-100 outline-none focus:border-indigo-400 placeholder:text-neutral-400" />
      </div>
      {filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center flex-1 gap-3">
          <span className="text-4xl">{search ? "🔍" : filter === "income" ? "💰" : filter === "expense" ? "💸" : "📭"}</span>
          <p className="text-sm font-medium text-neutral-600 dark:text-neutral-400">
            {search ? `${t("dashboard.noResults")} "${search}"` : filter === "income" ? t("dashboard.noIncome") : filter === "expense" ? t("dashboard.noExpense") : t("dashboard.noTransactions")}
          </p>
          <p className="text-xs text-neutral-400">
            {search ? t("dashboard.tryDifferent") : t("dashboard.transactionsAppear")}
          </p>
        </div>
      ) : (
        <div className="relative flex-1 min-h-0">
          <div
            id="tx-scroll"
            className="space-y-1 h-full overflow-y-auto pr-1"
            ref={(el) => { if (el) checkBottom(el); }}
            onScroll={(e) => checkBottom(e.currentTarget)}
          >
            {filtered.map((tx) => (
              <div key={tx.id}
                className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-neutral-50 dark:hover:bg-neutral-800/60 transition">
                <div className="h-9 w-9 rounded-xl bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center text-base flex-shrink-0">
                  {tx.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-neutral-800 dark:text-neutral-100 truncate">{tx.name}</p>
                  <p className="text-xs text-neutral-400 truncate">{tx.category} · {tx.date}</p>
                </div>
                <span className={`text-sm font-semibold flex-shrink-0 ${tx.amount > 0 ? "text-emerald-500" : "text-neutral-700 dark:text-neutral-300"}`}>
                  {tx.amount > 0 ? "+" : ""}{currencySymbol}{Math.abs(tx.amount).toFixed(2)}
                </span>
              </div>
            ))}
          </div>
          {!atBottom && filtered.length > 0 && (
            <div className="absolute bottom-2 right-2">
              <button
                onClick={() => {
                  const el = document.getElementById("tx-scroll");
                  if (el) el.scrollBy({ top: 120, behavior: "smooth" });
                }}
                className="flex items-center justify-center h-7 w-7 rounded-full text-white shadow-md transition"
                style={{ background: "var(--app-accent)" }}
              >
                <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                </svg>
              </button>
            </div>
          )}
        </div>
      )}
    </motion.div>
  );
}
