"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, X, RefreshCw } from "lucide-react";

const typeStyles: Record<string, string> = {
  warning: "border-amber-200 bg-amber-50 dark:border-amber-800/50 dark:bg-amber-950/20",
  tip:     "border-emerald-200 bg-emerald-50 dark:border-emerald-800/50 dark:bg-emerald-950/20",
  info:    "border-blue-200 bg-blue-50 dark:border-blue-800/50 dark:bg-blue-950/20",
};

export default function AIInsights({ data }: { data: any[] }) {
  const [dismissed, setDismissed] = useState<number[]>([]);
  const [loading, setLoading] = useState(false);
  const [atBottom, setAtBottom] = useState(false);

  const visible = data.filter((_, i) => !dismissed.includes(i));

  function refresh() {
    setLoading(true);
    setTimeout(() => { setDismissed([]); setLoading(false); }, 800);
  }

  return (
    <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.5 }}
      className="rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 p-5 flex flex-col h-[330px]">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="h-7 w-7 rounded-lg flex items-center justify-center" style={{ background: "var(--app-accent)" }}>
            <Sparkles className="h-3.5 w-3.5 text-white" />
          </div>
          <div>
            <h3 className="font-semibold text-neutral-900 dark:text-white">AI Insights</h3>
            <p className="text-xs text-neutral-400">Powered by your spending data</p>
          </div>
        </div>
        <button onClick={refresh} disabled={loading}
          className="p-1.5 rounded-lg text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition">
          <RefreshCw className={`h-3.5 w-3.5 ${loading ? "animate-spin" : ""}`} />
        </button>
      </div>

      <div className="relative">
        <div
          id="insights-scroll"
          className="overflow-y-auto max-h-64"
          onScroll={(e) => {
            const el = e.currentTarget;
            setAtBottom(el.scrollHeight - el.scrollTop <= el.clientHeight + 4);
          }}
        >
          <AnimatePresence>
            {visible.map((insight, i) => {
              const idx = data.indexOf(insight);
              return (
                <motion.div key={idx}
                  initial={{ opacity: 0, height: 0, marginBottom: 0 }}
                  animate={{ opacity: 1, height: "auto", marginBottom: 10 }}
                  exit={{ opacity: 0, height: 0, marginBottom: 0 }}
                  transition={{ duration: 0.25 }}
                  className={`relative rounded-xl border p-3.5 ${typeStyles[insight.type]}`}>
                  <button onClick={() => setDismissed((d) => [...d, idx])}
                    className="absolute top-2.5 right-2.5 text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-200 transition">
                    <X className="h-3.5 w-3.5" />
                  </button>
                  <div className="flex gap-2.5 pr-5">
                    <span className="text-lg leading-none mt-0.5">{insight.icon}</span>
                    <div>
                      <p className="text-sm font-semibold text-neutral-800 dark:text-neutral-100 mb-0.5">{insight.title}</p>
                      <p className="text-xs text-neutral-500 dark:text-neutral-400 leading-relaxed">{insight.desc}</p>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
          {visible.length === 0 && (
            <div className="text-center py-6">
              <p className="text-sm text-neutral-400">All caught up! No new insights.</p>
              <button onClick={refresh} className="mt-2 text-xs hover:underline" style={{ color: "var(--app-accent)" }}>Refresh insights</button>
            </div>
          )}
        </div>

        {!atBottom && visible.length > 0 && (
          <div className="absolute bottom-2 right-2">
            <button
              onClick={() => {
                const el = document.getElementById("insights-scroll");
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
    </motion.div>
  );
}
