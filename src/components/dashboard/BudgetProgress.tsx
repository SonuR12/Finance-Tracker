"use client";

import { motion } from "framer-motion";
import { useSettings } from "@/lib/settings-context";
import { useT } from "@/lib/i18n-context";

export default function BudgetProgress({ data }: { data: any[] }) {
  const { currencySymbol } = useSettings();
  const t = useT();

  const fakeData = [
    { category: "Food & Dining",  spent: 680,  limit: 800,  color: "#f43f5e" },
    { category: "Transport",      spent: 420,  limit: 500,  color: "#f97316" },
    { category: "Shopping",       spent: 540,  limit: 600,  color: "#ec4899" },
    { category: "Entertainment",  spent: 310,  limit: 300,  color: "#8b5cf6" },
    { category: "Health",         spent: 250,  limit: 400,  color: "#14b8a6" },
    { category: "Utilities",      spent: 92,   limit: 200,  color: "#06b6d4" },
    { category: "Housing",        spent: 1200, limit: 1500, color: "#ef4444" },
    { category: "Education",      spent: 180,  limit: 300,  color: "#3b82f6" },
    { category: "Travel",         spent: 450,  limit: 400,  color: "#f59e0b" },
    { category: "Subscriptions",  spent: 89,   limit: 100,  color: "#10b981" },
    { category: "Clothing",       spent: 220,  limit: 250,  color: "#a855f7" },
    { category: "Gifts",          spent: 130,  limit: 150,  color: "#e11d48" },
  ];

  return (
    <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.4 }}
      className="rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 p-5 h-full flex flex-col">
      <div className="flex items-center justify-between mb-5">
        <div>
          <h3 className="font-semibold text-neutral-900 dark:text-white">{t("dashboard.budgetTracker")}</h3>
          <p className="text-xs text-neutral-400 mt-0.5">March 2025</p>
        </div>
        <span className="text-xs text-neutral-400">
          {data.filter((b) => b.spent <= b.limit).length}/{fakeData.length} {t("dashboard.onTrack")}
        </span>
      </div>
      <div className="space-y-4 flex-1 overflow-y-auto pr-1 min-h-0">
        {fakeData.map((b, i) => {
          const pct = Math.min((b.spent / b.limit) * 100, 100);
          const over = b.spent > b.limit;
          return (
            <div key={b.category}>
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-sm text-neutral-700 dark:text-neutral-300">{b.category}</span>
                <span className={`text-xs font-semibold ${over ? "text-rose-500" : "text-neutral-500 dark:text-neutral-400"}`}>
                  {currencySymbol}{b.spent} / {currencySymbol}{b.limit}{over && " ⚠️"}
                </span>
              </div>
              <div className="h-2 w-full rounded-full bg-neutral-100 dark:bg-neutral-800 overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${pct}%` }}
                  transition={{ duration: 0.7, delay: 0.4 + i * 0.07, ease: "easeOut" }}
                  className="h-full rounded-full"
                  style={{ background: over ? "#ef4444" : b.color }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </motion.div>
  );
}
