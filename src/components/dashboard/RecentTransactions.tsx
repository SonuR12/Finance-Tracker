"use client";

import { useMemo, useState, useTransition } from "react";
import { motion } from "framer-motion";
import { useSettings } from "@/lib/settings-context";
import { Search } from "lucide-react";
import { AppButton } from "@/components/ui/AppButton";

export default function RecentTransactions({ data }: { data: any[] }) {
  const { currencySymbol } = useSettings();
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<"all" | "income" | "expense">("all");
  const [, startTransition] = useTransition();

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return data.filter((tx) => {
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
      className="rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 p-5">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="font-semibold text-neutral-900 dark:text-white">Recent Transactions</h3>
          <p className="text-xs text-neutral-400 mt-0.5">{data.length} transactions</p>
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
              {f}
            </AppButton>
          ))}
        </div>
      </div>
      <div className="relative mb-3">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-neutral-400" />
        <input value={search} onChange={(e) => { const v = e.target.value; startTransition(() => setSearch(v)); }}
          placeholder="Search transactions..."
          className="w-full pl-8 pr-3 py-2 text-sm rounded-lg bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 text-neutral-800 dark:text-neutral-100 outline-none focus:border-indigo-400 placeholder:text-neutral-400" />
      </div>
      <div className="space-y-1 max-h-72 overflow-y-auto pr-1">
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
        {filtered.length === 0 && (
          <div className="flex flex-col items-center justify-center py-12 gap-3">
            <span className="text-4xl">{search ? "🔍" : filter === "income" ? "💰" : filter === "expense" ? "💸" : "📭"}</span>
            <p className="text-sm font-medium text-neutral-600 dark:text-neutral-400">
              {search ? `No results for "${search}"` : filter === "income" ? "No income transactions" : filter === "expense" ? "No expense transactions" : "No transactions yet"}
            </p>
            <p className="text-xs text-neutral-400">
              {search ? "Try a different search term" : "Transactions will appear here once added"}
            </p>
          </div>
        )}
      </div>
    </motion.div>
  );
}
