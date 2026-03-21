"use client";

import { motion } from "framer-motion";
import { useSettings } from "@/lib/settings-context";
import { useT } from "@/lib/i18n-context";

export default function BudgetProgress({ data }: { data: any[] }) {
  const { currencySymbol } = useSettings();
  const t = useT();

  return (
    <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.4 }}
      className="rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 p-5">
      <div className="flex items-center justify-between mb-5">
        <div>
          <h3 className="font-semibold text-neutral-900 dark:text-white">{t("dashboard.budgetTracker")}</h3>
          <p className="text-xs text-neutral-400 mt-0.5">March 2025</p>
        </div>
        <span className="text-xs text-neutral-400">
          {data.filter((b) => b.spent <= b.limit).length}/{data.length} {t("dashboard.onTrack")}
        </span>
      </div>
      <div className="space-y-4">
        {data.map((b, i) => {
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
