"use client";

import { motion } from "framer-motion";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { useSettings } from "@/lib/settings-context";

export default function IncomeExpenseChart({ data }: { data: any[] }) {
  const { currencySymbol, chartColor } = useSettings();

  return (
    <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 p-5">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="font-semibold text-neutral-900 dark:text-white">Income vs Expenses</h3>
          <p className="text-xs text-neutral-400 mt-0.5">Last 7 months overview</p>
        </div>
        <div className="flex gap-3 text-xs">
          <span className="flex items-center gap-1.5 text-neutral-500 dark:text-neutral-400">
            <span className="h-2.5 w-2.5 rounded-full" style={{ background: chartColor }} /> Income
          </span>
          <span className="flex items-center gap-1.5 text-neutral-500 dark:text-neutral-400">
            <span className="h-2.5 w-2.5 rounded-full bg-rose-400" /> Expenses
          </span>
        </div>
      </div>
      <ResponsiveContainer width="100%" height={220}>
        <AreaChart data={data} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
          <defs>
            <linearGradient id="incomeGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={chartColor} stopOpacity={0.25} />
              <stop offset="95%" stopColor={chartColor} stopOpacity={0} />
            </linearGradient>
            <linearGradient id="expenseGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#fb7185" stopOpacity={0.25} />
              <stop offset="95%" stopColor="#fb7185" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" className="dark:[&>line]:stroke-neutral-800" />
          <XAxis dataKey="month" tick={{ fontSize: 11, fill: "#9ca3af" }} axisLine={false} tickLine={false} />
          <YAxis tick={{ fontSize: 11, fill: "#9ca3af" }} axisLine={false} tickLine={false}
            tickFormatter={(v) => `${currencySymbol}${(v / 1000).toFixed(1)}k`} />
          <Tooltip
            contentStyle={{ borderRadius: 12, border: "none", boxShadow: "0 4px 24px rgba(0,0,0,0.1)", fontSize: 12 }}
            formatter={(v: any) => [`${currencySymbol}${Number(v).toLocaleString()}`, ""]}
          />
          <Area type="monotone" dataKey="income" stroke={chartColor} strokeWidth={2.5}
            fill="url(#incomeGrad)" dot={false} activeDot={{ r: 5, fill: chartColor }} />
          <Area type="monotone" dataKey="expenses" stroke="#fb7185" strokeWidth={2.5}
            fill="url(#expenseGrad)" dot={false} activeDot={{ r: 5, fill: "#fb7185" }} />
        </AreaChart>
      </ResponsiveContainer>
    </motion.div>
  );
}
