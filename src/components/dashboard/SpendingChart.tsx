"use client";

import { motion } from "framer-motion";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";
import { useSettings } from "@/lib/settings-context";

const RADIAN = Math.PI / 180;
function CustomLabel({ cx, cy, midAngle, innerRadius, outerRadius, percent }: any) {
  if (percent < 0.07) return null;
  const r = innerRadius + (outerRadius - innerRadius) * 0.5;
  const x = cx + r * Math.cos(-midAngle * RADIAN);
  const y = cy + r * Math.sin(-midAngle * RADIAN);
  return (
    <text x={x} y={y} fill="white" textAnchor="middle" dominantBaseline="central" fontSize={11} fontWeight={600}>
      {`${(percent * 100).toFixed(0)}%`}
    </text>
  );
}

export default function SpendingChart({ data }: { data: any[] }) {
  const { currencySymbol } = useSettings();
  const total = data.reduce((s, c) => s + c.value, 0);

  return (
    <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.3 }}
      className="rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 p-5">
      <div className="mb-4">
        <h3 className="font-semibold text-neutral-900 dark:text-white">Spending by Category</h3>
        <p className="text-xs text-neutral-400 mt-0.5">This month</p>
      </div>
      <div className="flex flex-col sm:flex-row items-center gap-4">
        <div className="relative flex-shrink-0">
          <ResponsiveContainer width={140} height={140}>
            <PieChart>
              <Pie data={data} cx="50%" cy="50%" innerRadius={40} outerRadius={65}
                dataKey="value" labelLine={false} label={CustomLabel}>
                {data.map((entry, i) => <Cell key={i} fill={entry.color} stroke="none" />)}
              </Pie>
              <Tooltip
                contentStyle={{ borderRadius: 10, border: "none", boxShadow: "0 4px 20px rgba(0,0,0,0.1)", fontSize: 12 }}
                formatter={(v: any) => [`${currencySymbol}${v}`, ""]}
              />
            </PieChart>
          </ResponsiveContainer>
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
            <p className="text-xs text-neutral-400">Total</p>
            <p className="text-sm font-bold text-neutral-900 dark:text-white">{currencySymbol}{total.toLocaleString()}</p>
          </div>
        </div>
        <div className="flex-1 grid grid-cols-2 sm:grid-cols-1 gap-x-4 gap-y-2 w-full min-w-0">
          {data.map((cat) => (
            <div key={cat.name} className="flex items-center gap-2">
              <span className="h-2.5 w-2.5 rounded-full flex-shrink-0" style={{ background: cat.color }} />
              <span className="text-xs text-neutral-600 dark:text-neutral-400 flex-1 truncate">{cat.name}</span>
              <span className="text-xs font-semibold text-neutral-800 dark:text-neutral-200">{currencySymbol}{cat.value}</span>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
