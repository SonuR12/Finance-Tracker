"use client";

import { motion } from "framer-motion";
import { useSettings } from "@/lib/settings-context";
import { useT } from "@/lib/i18n-context";
import { CreditCard, BarChart3, PieChart } from "lucide-react";
import Image from "next/image";

const stepImages = [
  "https://images.unsplash.com/photo-1633265486064-086b219458ec?w=600&q=80&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600&q=80&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1677442135703-1787eea5ce01?w=600&q=80&auto=format&fit=crop",
];
const stepIcons = [CreditCard, BarChart3, PieChart];

export default function HowItWorks() {
  const { chartColor } = useSettings();
  const t = useT();

  const steps = [
    { titleKey: "howItWorks.step1Title", descKey: "howItWorks.step1Desc", image: stepImages[0], Icon: stepIcons[0] },
    { titleKey: "howItWorks.step2Title", descKey: "howItWorks.step2Desc", image: stepImages[1], Icon: stepIcons[1] },
    { titleKey: "howItWorks.step3Title", descKey: "howItWorks.step3Desc", image: stepImages[2], Icon: stepIcons[2] },
  ];

  return (
    <section className="py-12 sm:py-24 px-4 sm:px-6 lg:px-8 bg-neutral-50 dark:bg-neutral-900/50">
      <div className="max-w-6xl mx-auto">
        <motion.div
          className="text-center mb-8 sm:mb-16 space-y-2 sm:space-y-3"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <p className="text-lg font-medium uppercase tracking-widest" style={{ color: "var(--app-accent)" }}>{t("howItWorks.label")}</p>
          <h2 className="text-xl sm:text-3xl md:text-4xl font-bold text-neutral-900 dark:text-neutral-100">
            {t("howItWorks.title")}
          </h2>
        </motion.div>

        {/* Mobile: vertical list with horizontal card layout */}
        <div className="flex flex-col gap-4 md:hidden">
          {steps.map((step, index) => (
            <motion.div
              key={index}
              className="flex items-center gap-4 bg-white dark:bg-neutral-900 rounded-2xl p-4 border border-neutral-100 dark:border-neutral-800"
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
            >
              {/* Step number + image */}
              <div className="relative w-20 h-20 flex-shrink-0 rounded-xl overflow-hidden">
                <Image src={step.image} alt={t(step.titleKey)} fill className="object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                <div
                  className="absolute top-1.5 right-1.5 w-5 h-5 rounded-full text-white text-[10px] font-bold flex items-center justify-center"
                  style={{ background: "var(--app-accent)" }}
                >
                  {index + 1}
                </div>
              </div>

              {/* Text */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <div
                    className="flex items-center justify-center w-7 h-7 rounded-lg flex-shrink-0"
                    style={{ background: "color-mix(in srgb, var(--app-accent) 12%, transparent)", color: "var(--app-accent)" }}
                  >
                    <step.Icon className="h-3.5 w-3.5" />
                  </div>
                  <h3 className="text-sm font-semibold text-neutral-900 dark:text-neutral-100">{t(step.titleKey)}</h3>
                </div>
                <p className="text-xs text-neutral-500 dark:text-neutral-400 leading-relaxed">{t(step.descKey)}</p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Desktop: original 3-col grid */}
        <div className="hidden md:grid grid-cols-3 gap-8">
          {steps.map((step, index) => (
            <motion.div
              key={index}
              className="relative flex flex-col gap-4"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.15 }}
            >
              {index < steps.length - 1 && (
                <div className="absolute top-6 left-[calc(50%+2rem)] w-full h-px bg-gradient-to-r from-neutral-300 to-transparent dark:from-neutral-700" />
              )}
              <div className="relative h-48 rounded-2xl overflow-hidden border border-neutral-100 dark:border-neutral-800">
                <Image src={step.image} alt={t(step.titleKey)} fill className="object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                <div
                  className="absolute bottom-3 left-3 flex items-center justify-center w-10 h-10 rounded-full bg-white dark:bg-neutral-900 shadow-md"
                  style={{ color: "var(--app-accent)" }}
                >
                  <step.Icon className="h-5 w-5" />
                </div>
                <div
                  className="absolute top-3 right-3 w-7 h-7 rounded-full text-white text-xs font-bold flex items-center justify-center"
                  style={{ background: "var(--app-accent)" }}
                >
                  {index + 1}
                </div>
              </div>
              <div className="space-y-1.5">
                <h3 className="font-semibold text-neutral-900 dark:text-neutral-100">{t(step.titleKey)}</h3>
                <p className="text-sm text-neutral-500 dark:text-neutral-400">{t(step.descKey)}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
