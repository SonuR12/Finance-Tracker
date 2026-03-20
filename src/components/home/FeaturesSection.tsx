"use client";

import { motion } from "framer-motion";
import { useT } from "@/lib/i18n-context";
import { useSettings } from "@/lib/settings-context";
import { BarChart3, Receipt, PieChart, CreditCard, Globe, Zap } from "lucide-react";
import Image from "next/image";

const features = [
  { Icon: BarChart3,  key: "analytics",     image: "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=800&q=85&auto=format&fit=crop", span: "col-span-1 md:col-span-2", tall: true },
  { Icon: Receipt,    key: "scanner",        image: "https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=600&q=85&auto=format&fit=crop", span: "col-span-1", tall: false },
  { Icon: PieChart,   key: "budget",         image: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=600&q=85&auto=format&fit=crop", span: "col-span-1", tall: false },
  { Icon: CreditCard, key: "multiAccount",   image: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=600&q=85&auto=format&fit=crop", span: "col-span-1", tall: false },
  { Icon: Globe,      key: "multiCurrency",  image: "https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?w=800&q=85&auto=format&fit=crop", span: "col-span-1 md:col-span-2", tall: false },
  { Icon: Zap,        key: "insights",       image: "https://images.unsplash.com/photo-1677442135703-1787eea5ce01?w=600&q=85&auto=format&fit=crop", span: "col-span-1", tall: false },
];

export default function FeaturesSection() {
  const t = useT();
  const { chartColor } = useSettings();

  return (
    <section id="features" className="py-16 sm:py-24 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">

        <motion.div
          className="text-center mb-10 sm:mb-16 space-y-3"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <p className="text-lg font-medium uppercase tracking-widest" style={{ color: chartColor }}>Features</p>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-neutral-900 dark:text-neutral-100">
            {t("features.title")}
          </h2>
          <p className="text-neutral-500 dark:text-neutral-400 max-w-xl mx-auto">
            Everything you need to take control of your finances, powered by cutting-edge AI.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4">
          {features.map((feature, index) => (
            <motion.div
              key={feature.key}
              className={`group relative overflow-hidden rounded-2xl border-2 border-neutral-200 dark:border-neutral-800 group-hover:border-transparent ${feature.span} ${feature.tall ? "min-h-[360px]" : "min-h-[260px]"}`}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.08 }}
            >
              {/* Full bleed image */}
              <Image
                src={feature.image}
                alt={feature.key}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-105"
              />

              {/* Dark gradient overlay — bottom 60% so text is readable */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/10" />

              {/* Content pinned to bottom */}
              <div className="absolute inset-0 z-10 flex flex-col justify-between p-6">
                {/* Icon top-left */}
                <div
                  className="flex items-center justify-center w-11 h-11 rounded-xl backdrop-blur-sm"
                  style={{ background: `${chartColor}33`, color: "#fff", border: `1px solid ${chartColor}55` }}
                >
                  <feature.Icon className="h-5 w-5" />
                </div>

                {/* Text bottom */}
                <div className="space-y-1.5">
                  <h3 className="text-base font-semibold text-white">
                    {t(`features.${feature.key}.title`)}
                  </h3>
                  <p className="text-sm text-white/70 leading-relaxed">
                    {t(`features.${feature.key}.desc`)}
                  </p>
                </div>
              </div>

              {/* Accent border on hover */}
              <div
                className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
                style={{ boxShadow: `inset 0 0 0 2.5px ${chartColor}` }}
              />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
