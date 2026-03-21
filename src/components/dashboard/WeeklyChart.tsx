"use client";

import { motion } from "framer-motion";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from "recharts";
import { useSettings } from "@/lib/settings-context";
import { useT } from "@/lib/i18n-context";

export default function WeeklyChart({ data }: { data: any[] }) {
  const { currencySymbol, chartColor } = useSettings();
  const t = useT();
  const max = Math.max(...data.map((d) => d.amount));
  const dimColor = chartColor + "33"; // ~20% opacity hex

  return (
    <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.35 }}
      className="rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 p-5">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="font-semibold text-neutral-900 dark:text-white">{t("dashboard.weeklySpending")}</h3>
          <p className="text-xs text-neutral-400 mt-0.5">{t("dashboard.currentWeek")}</p>
        </div>
        <span className="text-xs bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 px-2.5 py-1 rounded-full font-medium">
          {currencySymbol}{data.reduce((s, d) => s + d.amount, 0).toLocaleString()} {t("dashboard.total")}
        </span>
      </div>
      <ResponsiveContainer width="100%" height={140}>
        <BarChart data={data} margin={{ top: 4, right: 4, left: -24, bottom: 0 }} barSize={22}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" className="dark:[&>line]:stroke-neutral-800" vertical={false} />
          <XAxis dataKey="day" tick={{ fontSize: 11, fill: "#9ca3af" }} axisLine={false} tickLine={false} />
          <YAxis tick={{ fontSize: 11, fill: "#9ca3af" }} axisLine={false} tickLine={false}
            tickFormatter={(v) => `${currencySymbol}${v}`} />
          <Tooltip
            contentStyle={{ borderRadius: 10, border: "none", boxShadow: "0 4px 20px rgba(0,0,0,0.1)", fontSize: 12 }}
            formatter={(v: any) => [`${currencySymbol}${v}`, "Spent"]}
            cursor={{ fill: "rgba(99,102,241,0.06)", radius: 8 }}
          />
          <Bar dataKey="amount" radius={[6, 6, 0, 0]}>
            {data.map((entry, i) => (
              <Cell key={i} fill={entry.amount === max ? chartColor : dimColor} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </motion.div>
  );
}
