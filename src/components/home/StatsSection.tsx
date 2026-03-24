"use client";

import { motion } from "framer-motion";
import { useT } from "@/lib/i18n-context";
import { useSettings } from "@/lib/settings-context";

export default function StatsSection() {
  const t = useT();
  const { currencySymbol } = useSettings();

  const stats = [
    { value: "50K+",              labelKey: "stats.users" },
    { value: `${currencySymbol}2B+`, labelKey: "stats.transactions" },
    { value: "99.9%",             labelKey: "stats.uptime" },
    { value: "4.9/5",             labelKey: "stats.rating" },
  ];

  return (
    <section className="py-12 sm:py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((item, index) => (
            <motion.div
              key={index}
              className="text-center space-y-1"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <div className="text-2xl sm:text-3xl md:text-4xl font-bold" style={{ color: "var(--app-accent)" }}>{item.value}</div>
              <div className="text-xs sm:text-sm text-neutral-500 dark:text-neutral-400">{t(item.labelKey)}</div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
