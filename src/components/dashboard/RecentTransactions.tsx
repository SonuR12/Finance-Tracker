"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { recentTransactions } from "./data";
import { useSettings } from "@/lib/settings-context";
import { Search } from "lucide-react";

export default function RecentTransactions() {
  const { currencySymbol } = useSettings();
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<"all" | "income" | "expense">("all");

  const filtered = recentTransactions.filter((tx) => {
    const matchSearch = tx.name.toLowerCase().includes(search.toLowerCase()) ||
      tx.category.toLowerCase().includes(search.toLowerCase());
    const matchFilter =
      filter === "all" ||
      (filter === "income" && tx.amount > 0) ||
      (filter === "expense" && tx.amount < 0);
    return matchSearch && matchFilter;
  });

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.45 }}
      className="rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 p-5"
    >
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="font-semibold text-neutral-900 dark:text-white">Recent Transactions</h3>
          <p className="text-xs text-neutral-400 mt-0.5">{recentTransactions.length} transactions</p>
        </div>
        <div className="flex gap-1.5">
          {(["all", "income", "expense"] as const).map((f) => (
            <button key={f} onClick={() => setFilter(f)}
              className={`text-xs px-2.5 py-1 rounded-full capitalize transition ${
                filter === f
                  ? "bg-indigo-500 text-white"
                  : "bg-neutral-100 dark:bg-neutral-800 text-neutral-500 dark:text-neutral-400 hover:bg-neutral-200 dark:hover:bg-neutral-700"
              }`}>
              {f}
            </button>
          ))}
        </div>
      </div>

      <div className="relative mb-3">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-neutral-400" />
        <input
          value={search} onChange={(e) => setSearch(e.target.value)}
          placeholder="Search transactions..."
          className="w-full pl-8 pr-3 py-2 text-sm rounded-lg bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 text-neutral-800 dark:text-neutral-100 outline-none focus:border-indigo-400 placeholder:text-neutral-400"
        />
      </div>

      <div className="space-y-1 max-h-72 overflow-y-auto pr-1">
        <AnimatePresence mode="popLayout">
          {filtered.map((tx, i) => (
            <motion.div
              key={tx.id}
              initial={{ opacity: 0, x: -12 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 12 }}
              transition={{ duration: 0.2, delay: i * 0.04 }}
              className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-neutral-50 dark:hover:bg-neutral-800/60 transition group"
            >
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
            </motion.div>
          ))}
        </AnimatePresence>
        {filtered.length === 0 && (
          <p className="text-center text-sm text-neutral-400 py-8">No transactions found</p>
        )}
      </div>
    </motion.div>
  );
}
