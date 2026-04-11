"use client";

import { motion } from "framer-motion";
import { useT } from "@/lib/i18n-context";
import { BarChart3, Receipt, PieChart, CreditCard, Globe, Zap } from "lucide-react";
import Image from "next/image";

const features = [
  { Icon: BarChart3,  key: "analytics",     image: "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=800&q=85&auto=format&fit=crop", span: "col-span-2 md:col-span-2", tall: true },
  { Icon: Receipt,    key: "scanner",        image: "https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=600&q=85&auto=format&fit=crop", span: "col-span-1", tall: false },
  { Icon: PieChart,   key: "budget",         image: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=600&q=85&auto=format&fit=crop", span: "col-span-1", tall: false },
  { Icon: CreditCard, key: "multiAccount",   image: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=600&q=85&auto=format&fit=crop", span: "col-span-1", tall: false },
  { Icon: Globe,      key: "multiCurrency",  image: "https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?w=800&q=85&auto=format&fit=crop", span: "col-span-1 md:col-span-2", tall: false },
  { Icon: Zap,        key: "insights",       image: "https://images.unsplash.com/photo-1677442135703-1787eea5ce01?w=600&q=85&auto=format&fit=crop", span: "col-span-1", tall: false },
];

export default function FeaturesSection() {
  const t = useT();

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
          <p className="text-lg font-medium uppercase tracking-widest" style={{ color: "var(--app-accent)" }}>{t("features.label")}</p>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-neutral-900 dark:text-neutral-100">
            {t("features.title")}
          </h2>
          <p className="text-neutral-500 dark:text-neutral-400 max-w-xl mx-auto">
            {t("features.subtitle")}
          </p>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-2 sm:gap-4">
          {features.map((feature, index) => (
            <motion.div
              key={feature.key}
              className={`group relative overflow-hidden rounded-xl sm:rounded-2xl border-2 border-neutral-200 dark:border-neutral-800 group-hover:border-transparent ${feature.span} ${feature.tall ? "min-h-[180px] sm:min-h-[360px]" : "min-h-[140px] sm:min-h-[260px]"}`}
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
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-cover transition-transform duration-500 group-hover:scale-105"
              />

              {/* Dark gradient overlay — bottom 60% so text is readable */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/10" />

              {/* Content pinned to bottom */}
              <div className="absolute inset-0 z-10 flex flex-col justify-between p-3 sm:p-6">
                {/* Icon top-left */}
                <div
                  className="flex items-center justify-center w-8 h-8 sm:w-11 sm:h-11 rounded-lg sm:rounded-xl backdrop-blur-sm"
                  style={{ background: "color-mix(in srgb, var(--app-accent) 20%, transparent)", color: "#fff", border: "1px solid color-mix(in srgb, var(--app-accent) 33%, transparent)" }}
                >
                  <feature.Icon className="h-3.5 w-3.5 sm:h-5 sm:w-5" />
                </div>

                {/* Text bottom */}
                <div className="space-y-0.5 sm:space-y-1.5">
                  <h3 className="text-xs sm:text-base font-semibold text-white">
                    {t(`features.${feature.key}.title`)}
                  </h3>
                  <p className="hidden sm:block text-sm text-white/70 leading-relaxed">
                    {t(`features.${feature.key}.desc`)}
                  </p>
                </div>
              </div>

              {/* Accent border on hover */}
              <div
                className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
                style={{ boxShadow: "inset 0 0 0 2.5px var(--app-accent)" }}
              />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
