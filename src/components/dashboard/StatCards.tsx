"use client";

import { motion } from "framer-motion";
import { TrendingUp, TrendingDown, DollarSign, PiggyBank, ArrowUpRight, ArrowDownRight } from "lucide-react";
import { useSettings } from "@/lib/settings-context";

const CARD_META = [
  { title: "Total Balance",    key: "totalBalance",    change: +12.5, icon: DollarSign,  bg: "bg-indigo-50 dark:bg-indigo-950/30",   iconBg: "bg-indigo-500",   glow: "bg-indigo-500",   accent: true  },
  { title: "Monthly Income",   key: "monthlyIncome",   change: +8.2,  icon: TrendingUp,  bg: "bg-emerald-50 dark:bg-emerald-950/30", iconBg: "bg-emerald-500",  glow: "bg-emerald-500",  accent: false },
  { title: "Monthly Expenses", key: "monthlyExpenses", change: -3.1,  icon: TrendingDown, bg: "bg-rose-50 dark:bg-rose-950/30",      iconBg: "bg-rose-500",     glow: "bg-rose-500",     accent: false },
  { title: "Total Savings",    key: "totalSavings",    change: +22.4, icon: PiggyBank,   bg: "bg-amber-50 dark:bg-amber-950/30",    iconBg: "bg-amber-500",    glow: "bg-amber-500",    accent: false },
];

export default function StatCards({ stats }: { stats: Record<string, number> }) {
  const { currencySymbol } = useSettings();

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
      {CARD_META.map((card, i) => {
        const Icon = card.icon;
        const isPositive = card.change > 0;
        const isAccent = card.accent;
        return (
          <motion.div key={card.title}
            initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: i * 0.08 }}
            className={`relative overflow-hidden rounded-2xl border border-neutral-200 dark:border-neutral-800 p-5 ${card.bg}`}
            style={isAccent ? { backgroundColor: "color-mix(in srgb, var(--app-accent) 12%, transparent)" } : {}}>
            <div className="flex items-start justify-between mb-4">
              <div
                className={`h-10 w-10 rounded-xl flex items-center justify-center shadow-sm ${isAccent ? "" : card.iconBg}`}
                style={isAccent ? { background: "var(--app-accent)" } : {}}>
                <Icon className="h-5 w-5 text-white" />
              </div>
              <span className={`flex items-center gap-0.5 text-xs font-semibold px-2 py-1 rounded-full ${
                isPositive
                  ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-400"
                  : "bg-rose-100 text-rose-700 dark:bg-rose-900/40 dark:text-rose-400"
              }`}>
                {isPositive ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownRight className="h-3 w-3" />}
                {Math.abs(card.change)}%
              </span>
            </div>
            <p className="text-xs text-neutral-500 dark:text-neutral-400 mb-1">{card.title}</p>
            <p className="text-2xl font-bold text-neutral-900 dark:text-white">
              {currencySymbol}{stats[card.key]?.toLocaleString()}
            </p>
            <p className="text-xs text-neutral-400 mt-1">vs last month</p>
            <div
              className={`absolute -right-4 -bottom-4 h-20 w-20 rounded-full opacity-10 blur-xl ${isAccent ? "" : card.glow}`}
              style={isAccent ? { background: "var(--app-accent)" } : {}} />
          </motion.div>
        );
      })}
    </div>
  );
}
